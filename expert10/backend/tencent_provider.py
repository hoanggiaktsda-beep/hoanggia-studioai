"""Tencent TokenHub HY-3D-3.1 provider adapter. API key stays server-side."""
import os, base64
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel

router=APIRouter(prefix="/api/v2")
BASE="https://tokenhub.tencentmaas.com/v1/api/3d"
MODEL="hy-3d-3.1"

def headers():
    key=os.getenv("TENCENT_TOKENHUB_API_KEY")
    if not key: raise HTTPException(503,"Tencent Cloud API chưa được cấu hình")
    return {"Authorization":f"Bearer {key}","Content-Type":"application/json"}

async def provider_call(endpoint,payload):
    async with httpx.AsyncClient(timeout=45) as client:
        try:
            response=await client.post(BASE+endpoint,headers=headers(),json=payload)
            response.raise_for_status()
            result=response.json()
        except (httpx.HTTPError,ValueError) as exc:
            raise HTTPException(502,"Tencent Cloud request failed") from exc
    return result

@router.post("/jobs")
async def create_job(image:UploadFile=File(...)):
    if image.content_type not in ("image/png","image/jpeg","image/webp"):
        raise HTTPException(415,"Ảnh phải là PNG, JPEG hoặc WebP")
    raw=await image.read(6*1024*1024+1)
    if not raw or len(raw)>6*1024*1024: raise HTTPException(413,"Ảnh vượt giới hạn 6 MB")
    # Image dimensions should be checked by Pillow in production.
    result=await provider_call("/submit",{"model":MODEL,"image_base64":base64.b64encode(raw).decode(),"enable_pbr":True,"generate_type":"Normal"})
    if not result.get("id"): raise HTTPException(502,"Tencent không trả về mã tác vụ")
    return {"id":str(result["id"]),"status":result.get("status","queued")}

class JobQuery(BaseModel):
    id:str

@router.post("/jobs/status")
async def job_status(body:JobQuery):
    if not body.id.isdigit() or len(body.id)>32: raise HTTPException(422,"Mã tác vụ không hợp lệ")
    result=await provider_call("/query",{"model":MODEL,"id":body.id})
    assets=[{"type":item.get("type"),"url":item.get("url"),"preview_image_url":item.get("preview_image_url")} for item in result.get("data",[]) if isinstance(item,dict)]
    return {"status":result.get("status","unknown"),"assets":assets}
