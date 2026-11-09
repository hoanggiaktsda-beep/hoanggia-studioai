import bpy,sys
from pathlib import Path
args=sys.argv[sys.argv.index("--")+1:]
source,target,width_mm=args[0],args[1],float(args[2])
bpy.ops.object.select_all(action="SELECT");bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=source)
meshes=[o for o in bpy.context.scene.objects if o.type=="MESH"]
if not meshes: raise RuntimeError("No mesh")
if width_mm:
    from mathutils import Vector
    corners=[o.matrix_world@Vector(c) for o in meshes for c in o.bound_box]
    current=max(p.x for p in corners)-min(p.x for p in corners)
    if current<=0: raise RuntimeError("Invalid width")
    scale=(width_mm/1000)/current
    for o in bpy.context.scene.objects:
        if o.parent is None: o.scale*=scale
    bpy.context.view_layer.update()
    bpy.ops.object.select_all(action="SELECT");bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
ext=Path(target).suffix.lower()
if ext==".glb": bpy.ops.export_scene.gltf(filepath=target,export_format="GLB")
elif ext==".fbx": bpy.ops.export_scene.fbx(filepath=target)
elif ext==".obj": bpy.ops.wm.obj_export(filepath=target)
elif ext==".stl": bpy.ops.wm.stl_export(filepath=target)
elif ext==".blend": bpy.ops.wm.save_as_mainfile(filepath=target)
else: raise RuntimeError("Unsupported format")
