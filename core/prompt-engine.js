import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";

export function buildDirection({brief,mode,output,camera,target="Khác",replacement="",params={},decisions={}}){
 const analysis=analyzeBrief(brief,mode,output,camera),modeData=editModeDirection(mode,target,brief,params,decisions);
 const reasoning={target,authority:mode==="Furniture"?"Scene A = spatial authority · Reference B = furniture design authority":"Scene A = spatial authority · Reference = design direction authority",preserve:"Architecture, non-target objects, material identity and all elements outside the selected edit scope"};
 const decisionLines=Object.entries(decisions).map(([k,v])=>"• "+k.toUpperCase()+": "+v).join("\n");
 let body=[];
 if(mode==="Furniture"){
  const f=furnitureDirection(target,replacement,brief);
  body=["HOANGGIA AI — FURNITURE DECISION SYSTEM","","DESIGN INTENT","Replace only: "+target,"","DESIGN DECISIONS",decisionLines,"","REFERENCE INTELLIGENCE","• Scene A controls architecture, camera, spatial context and non-target objects.\n• Reference B controls furniture identity, silhouette, construction language and distinctive details.","","ARCHITECTURAL REASONING","• "+f.anatomy.join(", ")+"\n"+f.checks.map(x=>"• "+x).join("\n"),"","USER INTENT",brief.trim()];
 }else if(mode==="Material"){
  const m=materialDirection(analysis);
  body=["HOANGGIA AI — MATERIAL DECISION SYSTEM","","MATERIAL TARGET","Change only: "+target,"","DESIGN DECISIONS",decisionLines,"","MATERIAL INTELLIGENCE",m.hierarchy.map(x=>"• "+x).join("\n")+"\n• "+m.rule+"\n• "+m.realism.join("\n• "),"","USER INTENT",brief.trim()];
 }else if(mode==="Lighting"){
  body=["HOANGGIA AI — LIGHTING DECISION SYSTEM","","LIGHTING TARGET","• "+target,"","DESIGN DECISIONS",decisionLines,"","LIGHTING INTELLIGENCE","• Reason through key light, fill, ambient bounce, practical sources, exposure and contact shadows.\n• Maintain coherent falloff, source logic and material response.","","USER INTENT",brief.trim()];
 }else{
  body=["HOANGGIA AI — CAMERA DECISION SYSTEM","","VIEW TARGET","• "+target,"","DESIGN DECISIONS",decisionLines,"","CAMERA INTELLIGENCE","• Reason through camera position, height, yaw, pitch, lens/FOV, framing and vanishing points.\n• Preserve actual room dimensions and object positions.","","USER INTENT",brief.trim()];
 }
 body.push("","PRESERVATION LOCK",...modeData.safeguards.map(x=>"• "+x),"• Keep walls, floor, ceiling, windows, doors, openings and built-ins unchanged.","• Preserve every non-target object unless explicitly included in the edit.","","AI QUALITY CONTROL","• Photorealistic architectural visualization.","• No warped geometry, impossible construction or invented unrelated details.","• The result must read as physically coherent, buildable and naturally integrated.","","OUTPUT RULE","Return a production-ready image-editing prompt only. Do not generate the image.");
 return {analysis,reasoning,prompt:body.join("\n")};
}