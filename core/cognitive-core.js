// HOANGGIA AI — Cognitive Core v1.0. Pure, deterministic, offline prompt reasoning.
// No remote calls, secrets, or claims of automatic image understanding.
export const CORE_VERSION = "1.0.0";
const clean = x => typeof x === "string" ? x.trim().replace(/\s+/g," ") : "";
const uniq = a => [...new Set(a.filter(Boolean))];
const DOMAINS = {
  architecture:["architecture","kiến trúc","tường","trần","sàn","cửa","mặt bằng"],
  furniture:["furniture","sofa","bàn","ghế","tủ","giường","nội thất"],
  material:["material","vật liệu","đá","gỗ","veneer","vải","da"],
  lighting:["lighting","ánh sáng","đèn","daylight"],
  camera:["camera","góc máy","phối cảnh","lens","ống kính"],
  video:["video","chuyển động","storyboard","shot"],
  identity:["face","khuôn mặt","nhân vật","identity","adn"],
  restoration:["upscale","phục hồi","nhiễu","độ nét","resolution"]
};
const TARGETS = {
  chatgpt:{name:"ChatGPT",hint:"Use the uploaded images in their declared roles; do not invent unseen image details."},
  gemini:{name:"Gemini",hint:"Respect image roles and preserve explicitly locked attributes."},
  grok:{name:"Grok",hint:"Treat each reference according to its assigned role and avoid unrelated changes."}
};
const RESTRICTIONS = ["architecture","geometry","camera","perspective","composition","non-target objects"];
export function reason(input={}){
  const task=clean(input.task), brief=clean(input.brief), text=(task+" "+brief).toLowerCase();
  const evidence=Array.isArray(input.evidence)?input.evidence.filter(x=>x&&typeof x==="object").map(x=>({
    role:clean(x.role)||"unspecified",description:clean(x.description),
    observed:x.observed===true
  })):[];
  const domains=Object.entries(DOMAINS).filter(([,words])=>words.some(w=>text.includes(w))).map(([k])=>k);
  const mode=clean(input.mode)||"edit";
  const locks=uniq((Array.isArray(input.locks)?input.locks:mode==="edit"?RESTRICTIONS:[]).map(clean));
  const changes=uniq((Array.isArray(input.changes)?input.changes:[]).map(clean));
  const conflicts=changes.filter(c=>locks.some(l=>c.toLowerCase()===l.toLowerCase())).map(c=>"Change conflicts with preservation lock: "+c);
  const warnings=[];
  if(!task&&!brief)warnings.push("Missing task and design brief");
  if(mode==="edit"&&!evidence.some(e=>e.role==="target"))warnings.push("Target image not declared");
  if(evidence.some(e=>!e.observed&&e.description))warnings.push("Some descriptions are user-provided or inferred, not verified visual observations");
  if(mode==="edit"&&changes.length===0)warnings.push("No explicit allowed changes specified");
  if(conflicts.length)warnings.push("Resolve preservation conflicts before exporting");
  const ready=warnings.filter(w=>/Missing task|conflicts|Target image/.test(w)).length===0;
  return {version:CORE_VERSION,mode,task,brief,domains:uniq(domains),evidence,locks,changes,conflicts,warnings,ready};
}
export function compilePrompt(input={},platform="chatgpt"){
  const r=reason(input), target=TARGETS[String(platform).toLowerCase()]||TARGETS.chatgpt;
  const lines=[
    "TASK: "+(r.task||r.brief||"Unspecified"),
    r.brief&&r.task?"DESIGN BRIEF: "+r.brief:"",
    "IMAGE ROLES: "+(r.evidence.map((e,i)=>`Image ${i+1}: ${e.role}; ${e.description||"no verified description"}; ${e.observed?"observed":"not visually verified"}`).join(" | ")||"No images declared"),
    "ALLOWED CHANGES: "+(r.changes.join("; ")||"Not specified"),
    "PRESERVE: "+(r.locks.join("; ")||"Only user-approved constraints"),
    "EXPERT DOMAINS: "+(r.domains.join(", ")||"general design"),
    "EVIDENCE RULE: Never invent missing architecture, products, faces, materials, or visual facts.",
    "CONFLICT RULE: If instructions contradict preservation constraints, ask for clarification rather than silently overriding.",
    "TARGET GUIDANCE: "+target.hint
  ].filter(Boolean);
  return {platform:target.name,prompt:lines.join("\n"),report:r};
}
