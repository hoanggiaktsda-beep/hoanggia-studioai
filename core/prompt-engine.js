import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";

export function buildDirection({brief,mode,output,camera,target="Khác",replacement="",params={}}){
 const analysis=analyzeBrief(brief,mode,output,camera);
 const modeData=editModeDirection(mode,target,brief,params);
 const reasoning={
  target:target,
  authority:mode==="Furniture"?"Scene A = space/camera authority · Reference B = furniture design authority":"Scene A = spatial authority · Reference = change-direction authority",
  preserve:mode==="Camera"?"Architecture, objects, materials and design intent":"Architecture, non-target objects and all elements outside the edit scope"
 };
 let body=[];
 if(mode==="Furniture"){
  const f=furnitureDirection(target,replacement,brief);
  body=[
   "HOANGGIA AI — FURNITURE REPLACEMENT",
   "",
   "DESIGN INTENT","Replace only: "+target,
   "Reference rule: "+f.referenceRule,
   "",
   "ARCHITECTURAL REASONING","• "+f.anatomy.join(", ")+"\n"+f.checks.map(x=>"• "+x).join("\n"),
   "",
   "REFERENCE INTELLIGENCE","• Scene A controls architecture, camera, spatial context and non-target objects.\n• Reference B controls furniture identity, silhouette, construction language and distinctive details.",
   "",
   "USER DIRECTION",brief.trim(),
   "",
   "INTEGRATION","• "+f.realism+"\n• Preserve believable clearances, floor contact, occlusion and scale.\n• Match existing light direction, color temperature and shadow softness.",
  ];
 } else if(mode==="Material"){
  const m=materialDirection(analysis);
  body=[
   "HOANGGIA AI — MATERIAL TRANSFORMATION",
   "",
   "MATERIAL TARGET","Change only: "+target,
   "CURRENT / TARGET MATERIAL LOGIC","• Do not alter geometry or construction.\n• New finish: "+(params.finish||"realistic natural finish")+"\n• Texture scale: "+(params.texture||"architectural scale"),
   "",
   "MATERIAL INTELLIGENCE",m.hierarchy.map(x=>"• "+x).join("\n")+"\n• "+m.rule+"\n• "+m.realism.join("\n• "),
   "",
   "USER DIRECTION",brief.trim()
  ];
 } else if(mode==="Lighting"){
  body=[
   "HOANGGIA AI — LIGHTING TRANSFORMATION",
   "",
   "LIGHTING TARGET","• "+target,
   "LIGHT MODEL","• Mood: "+(params.mood||"Warm luxury")+"\n• Direction: "+(params.direction||"Believable existing direction")+"\n• Reason through key light, fill, ambient bounce, practical sources and contact shadows.",
   "",
   "ARCHITECTURAL LIGHTING CONTROL","• Preserve architecture and furniture geometry.\n• Keep material response physically believable.\n• Avoid clipped highlights, black crushed shadows and artificial glow.\n• Maintain coherent falloff and shadow direction.",
   "",
   "USER DIRECTION",brief.trim()
  ];
 } else {
  body=[
   "HOANGGIA AI — CAMERA / VIEW TRANSFORMATION",
   "",
   "VIEW TARGET","• "+target,
   "CAMERA MODEL","• Lens feel: "+(params.lens||"Natural architectural")+"\n• Height: "+(params.height||"Eye level")+"\n• Reason through camera position, yaw, pitch, FOV, framing and vanishing points.",
   "",
   "ARCHITECTURAL CAMERA CONTROL","• Preserve actual room dimensions and object positions.\n• Keep verticals and perspective believable.\n• Do not use lens distortion to fake spatial enlargement.\n• Preserve the design hierarchy in the new composition.",
   "",
   "USER DIRECTION",brief.trim()
  ];
 }
 const common=[
  "",
  "PRESERVATION LOCK",
  "• "+modeData.safeguards.join("\n• "),
  "• Keep walls, floor, ceiling, windows, doors, openings and built-ins unchanged.",
  "• Preserve every non-target object unless explicitly included in the edit.",
  "",
  "AI QUALITY CONTROL",
  "• Photorealistic architectural visualization.",
  "• No warped geometry, impossible construction or invented unrelated details.",
  "• The result must read as physically coherent, buildable and naturally integrated.",
  "",
  "OUTPUT RULE",
  "Return a production-ready image-editing prompt only. Do not generate the image."
 ];
 return {analysis,reasoning,prompt:body.concat(common).join("\n")};
}