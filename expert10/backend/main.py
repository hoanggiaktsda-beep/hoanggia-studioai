"""Expert 10 backend. Requires FAL_KEY, Blender CLI and configured CORS origin."""
import os, tempfile, subprocess, pathlib
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import fal_client

app = FastAPI(title="HOANGGIA Expert 10")
app.add_middleware(CORSMiddleware,allow_origins=[os.getenv("FRONTEND_ORIGIN","https://hoanggiaktsda-beep.github.io")],allow_methods=["POST"],allow_headers=["*"])
ALLOWED={"glb","fbx","obj","stl","blend"}
@app.get("/health")
def health(): return {"service":"expert10","provider_configured":bool(os.getenv("FAL_KEY"))}

@app.post("/api/v1/reconstruct")
async def reconstruct(image:UploadFile=File(...),format:str=Form("glb"),width_mm:float|None=Form(None)):
    if format.lower()=="skp": raise HTTPException(422,"SKP requires a licensed SketchUp conversion adapter; not configured")
    if format.lower() not in ALLOWED: raise HTTPException(422,"Unsupported format")
    if width_mm is not None and not 1<=width_mm<=30000: raise HTTPException(422,"Invalid width")
    if image.content_type not in {"image/png","image/jpeg","image/webp"}: raise HTTPException(415,"Invalid image type")
    data=await image.read(10*1024*1024+1)
    if len(data)>10*1024*1024: raise HTTPException(413,"Image too large")
    if not os.getenv("FAL_KEY"): raise HTTPException(503,"FAL_KEY not configured")
    with tempfile.TemporaryDirectory() as tmp:
        ext={"image/png":".png","image/jpeg":".jpg","image/webp":".webp"}[image.content_type]
        source=pathlib.Path(tmp)/("input"+ext);source.write_bytes(data)
        try:
            uploaded=await fal_client.upload_file_async(str(source))
            result=await fal_client.subscribe_async("fal-ai/trellis",arguments={"image_url":uploaded})
            model=result.get("model_mesh") or result.get("model_file")
            url=model.get("url") if isinstance(model,dict) else model
            if not isinstance(url,str) or not url.startswith("https://"): raise ValueError("Provider did not return a model URL")
            async with httpx.AsyncClient(timeout=180,follow_redirects=False) as client:
                response=await client.get(url)
                response.raise_for_status()
            if len(response.content)>200*1024*1024: raise ValueError("Model exceeds size limit")
            glb=pathlib.Path(tmp)/"input.glb";glb.write_bytes(response.content)
            if not glb.read_bytes()[:4]==b"glTF": raise ValueError("Provider response is not GLB")
            output=pathlib.Path(tmp)/("model."+format.lower())
            if format.lower()=="glb" and width_mm is None: output=glb
            else:
                script=pathlib.Path(__file__).with_name("convert.py")
                cmd=[os.getenv("BLENDER_BIN","blender"),"-b","--python",str(script),"--",str(glb),str(output),str(width_mm or 0)]
                subprocess.run(cmd,check=True,timeout=180,capture_output=True)
            # FileResponse is sent after the endpoint returns; TemporaryDirectory would delete it.
            # Persist into a dedicated temp path and delete via background task.
            import shutil
            from starlette.background import BackgroundTask
            fd,path=tempfile.mkstemp(suffix="."+format.lower());os.close(fd)
            shutil.copyfile(output,path)
            return FileResponse(path,filename="HOANGGIA_MODEL."+format.lower(),background=BackgroundTask(os.unlink,path))
        except (ValueError,httpx.HTTPError,subprocess.SubprocessError,FileNotFoundError) as exc:
            raise HTTPException(502,"Reconstruction or conversion failed: "+str(exc)[:200]) from exc
