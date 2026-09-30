import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";
import {expertDecision} from "./expert-decision-layer.js";

export function buildDirection({brief,mode,output,camera,target="Khác",replacement="",params={},decisions={}}){
 const analysis=analyzeBrief(brief,mode,output,camera),modeData=editModeDirection(mode,target,brief,params,decisions);
 const expert=expertDecision(mode,decisions);
 const reasoning={target,authority:mode==="Furniture"?"Scene A = spatial authority · Reference B = furniture design authority":"Scene A = spatial authority · Reference = design direction authority",preserve:"Architecture, non-target objects, material identity and all elements outside the selected edit scope",expert:expert.name,expertRole:expert.role};
 const decisionLines=Object.entries(decisions).map(([k,v])=>"• "+k.toUpperCase()+": "+v).join("\n");
 let body=[];
 body.push("HOANGGIA AI — "+expert.label,"","EXPERT DECISION LENS","• Expert: "+expert.name+" — "+expert.role,"• Decision philosophy: "+expert.source,"• This is a design lens, not a literal simulation of the expert.","","EXPERT PRINCIPLES",expert.principles.map(x=>"• "+x).join("\n"),"","DESIGN DECISIONS",decisionLines,"","EXPERT DECISION LOGIC",expert.applied.length?expert.applied.map(x=>"• "+x).join("\n"):"• Apply the expert principles to the user's intent.");
 if(mode==="Furniture"){
  const f=furnitureDirection(target,replacement,brief);
  body.push("","FURNITURE TARGET","Replace only: "+target,"","REFERENCE INTELLIGENCE","• Scene A controls architecture, camera, spatial context and non-target objects.\n• Reference B controls furniture identity, silhouette, construction language and distinctive details.","","ARCHITECTURAL REASONING","• "+f.anatomy.join(", ")+"\n"+f.checks.map(x=>"• "+x).join("\n"));
 }else if(mode==="Material"){
  const m=materialDirection(analysis);
  body.push("","MATERIAL TARGET","Change only: "+target,"","MATERIAL INTELLIGENCE",m.hierarchy.map(x=>"• "+x).join("\n")+"\n• "+m.rule+"\n• "+m.realism.join("\n• "));
 }else if(mode==="Lighting"){
  body.push("","LIGHTING TARGET","• "+target,"","LIGHTING INTELLIGENCE","• Reason through key light, fill, ambient bounce, practical sources, exposure and contact shadows.\n• Maintain coherent falloff, source logic and material response.");
 }else{
  body.push("","VIEW TARGET","• "+target,"","CAMERA INTELLIGENCE","• Reason through camera position, height, yaw, pitch, lens/FOV, framing and vanishing points.\n• Preserve actual room dimensions and object positions.");
 }
 body.push("","USER INTENT",brief.trim(),"","PRESERVATION LOCK",...modeData.safeguards.map(x=>"• "+x),"• Keep walls, floor, ceiling, windows, doors, openings and built-ins unchanged.","• Preserve every non-target object unless explicitly included in the edit.","","AI QUALITY CONTROL","• Photorealistic architectural visualization.","• No warped geometry, impossible construction or invented unrelated details.","• The result must read as physically coherent, buildable and naturally integrated.","","OUTPUT RULE","Return a production-ready image-editing prompt only. Do not generate the image.");
 return {analysis,reasoning,prompt:body.join("\n")};
}
