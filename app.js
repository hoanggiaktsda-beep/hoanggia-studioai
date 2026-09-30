import { buildDirection } from "./core/prompt-engine.js";
import { editModeDirection } from "./core/edit-engine.js";

const brief=document.getElementById("brief"),result=document.getElementById("result"),resultContent=document.getElementById("resultContent");
const resultText=document.getElementById("resultText"),brainStatus=document.getElementById("brainStatus");
const sceneInput=document.getElementById("sceneInput"),referenceInput=document.getElementById("referenceInput");
const scenePreview=document.getElementById("scenePreview"),referencePreview=document.getElementById("referencePreview");
const scenePlaceholder=document.getElementById("scenePlaceholder"),referencePlaceholder=document.getElementById("referencePlaceholder");
const targetSelect=document.getElementById("target"),targetLabel=document.getElementById("targetLabel");
const referencePriority=document.getElementById("referencePriority"),modeControls=document.getElementById("modeControls");
const decisionControls=document.getElementById("decisionControls"),reasoningSummary=document.getElementById("reasoningSummary");
const decisionCount=document.getElementById("decisionCount");
let currentMode="Furniture";

const targetSets={
 Furniture:["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
 Material:["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Tường","Sàn","Trần","Đá / mặt bàn","Gỗ / veneer","Da / vải","Kim loại","Khác"],
 Lighting:["Toàn cảnh","Đèn trần","Đèn hắt","Đèn trang trí","Ánh sáng tự nhiên","Vùng ánh sáng","Khác"],
 Camera:["Toàn cảnh","Góc sofa","Góc bàn ăn","Góc phòng","Cận vật liệu","Góc mới theo yêu cầu"]
};

const decisions={
 Furniture:[
  ["direction","Hướng thay đổi",["Thay bằng mẫu tham chiếu","Thay bằng thiết kế mới","Tinh chỉnh mẫu hiện tại"]],
  ["fit","Mức độ can thiệp",["Giữ nguyên footprint","Điều chỉnh vừa không gian","Ưu tiên đúng tỷ lệ mẫu"]],
  ["character","Ngôn ngữ thiết kế",["Giữ nguyên phong cách không gian","Modern Luxury","Minimal Luxury","Contemporary","Neo-classic Contemporary"]]
 ],
 Material:[
  ["change","Mục tiêu vật liệu",["Thay hoàn toàn","Tinh chỉnh tone màu","Nâng cấp finish","Đổi vật liệu nhưng giữ cấu tạo"]],
  ["finish","Bề mặt",["Natural / matte","Satin","High gloss","Brushed / textured"]],
  ["character","Cảm giác",["Ấm và tự nhiên","Tinh tế / understated","Sang trọng","Tương phản mạnh"]]
 ],
 Lighting:[
  ["mood","Bầu không khí",["Warm luxury","Neutral daylight","Soft editorial","Dramatic contrast","Calm residential"]],
  ["source","Nguồn sáng",["Giữ nguồn sáng hiện tại","Daylight ưu tiên","Artificial lighting ưu tiên","Layered lighting"]],
  ["contrast","Độ tương phản",["Soft","Balanced","Dramatic"]]
 ],
 Camera:[
  ["view","Ý đồ góc nhìn",["Giữ góc hiện tại","Rộng hơn để thấy không gian","Tập trung vật thể","Góc editorial","Góc kiến trúc"]],
  ["lens","Cảm giác tiêu cự",["Natural architectural","24–28mm wide","35mm balanced","50mm detail"]],
  ["height","Cao độ máy",["Eye level","Low architectural","High overview","Close detail"]]
 ]
};

function setPreview(input,preview,placeholder,label){
 input.addEventListener("change",()=>{const f=input.files?.[0];if(!f)return;preview.src=URL.createObjectURL(f);preview.classList.add("visible");placeholder.classList.add("hidden");brainStatus.textContent=label+" loaded";});
}
setPreview(sceneInput,scenePreview,scenePlaceholder,"Scene image");setPreview(referenceInput,referencePreview,referencePlaceholder,"Reference image");

function selectedDecisions(){return Object.fromEntries([...decisionControls.querySelectorAll("[data-decision]")].map(x=>[x.dataset.decision,x.value]));}
function renderDecisions(mode){
 decisionControls.innerHTML=decisions[mode].map(([key,label,opts])=>`<div class="decision-field"><label>${label}</label><select data-decision="${key}"><option value="">Chọn quyết định…</option>${opts.map(o=>`<option>${o}</option>`).join("")}</select></div>`).join("");
 updateCount();
}
function updateCount(){
 const n=Object.values(selectedDecisions()).filter(Boolean).length;decisionCount.textContent=n+" / 3";
}
decisionControls.addEventListener("change",updateCount);

const modeTemplates={
 Furniture:()=>`<div class="mode-control-grid"><div class="field"><label>Reference priority</label><select data-param="reference"><option>Khóa hình dáng + cấu tạo mẫu B</option><option>Khóa hình dáng, cho phép đổi finish</option><option>Khóa ngôn ngữ thiết kế</option></select></div><div class="field"><label>Construction check</label><select data-param="construction"><option>Architectural / buildable</option><option>Preserve visible joinery</option><option>Minimal structural intervention</option></select></div></div>`,
 Material:()=>`<div class="mode-control-grid"><div class="field"><label>Texture scale</label><select data-param="texture"><option>Architectural realistic scale</option><option>Fine grain</option><option>Bold grain / veining</option></select></div><div class="field"><label>Material priority</label><select data-param="materialPriority"><option>Realism first</option><option>Reference first</option><option>Architectural continuity</option></select></div></div>`,
 Lighting:()=>`<div class="mode-control-grid"><div class="field"><label>Color temperature</label><select data-param="temperature"><option>2700–3000K warm</option><option>3500–4000K neutral</option><option>5000–6500K daylight</option></select></div><div class="field"><label>Light hierarchy</label><select data-param="hierarchy"><option>Layered / architectural</option><option>Daylight dominant</option><option>Artificial dominant</option></select></div></div>`,
 Camera:()=>`<div class="mode-control-grid"><div class="field"><label>Perspective</label><select data-param="perspective"><option>Natural architectural</option><option>Corrected verticals</option><option>Controlled wide perspective</option></select></div><div class="field"><label>Composition</label><select data-param="composition"><option>Preserve design hierarchy</option><option>Hero object priority</option><option>Spatial overview</option></select></div></div>`
};

function params(){return Object.fromEntries([...modeControls.querySelectorAll("[data-param]")].map(x=>[x.dataset.param,x.value]));}
function populateTargets(mode){
 targetSelect.innerHTML=targetSets[mode].map(x=>"<option>"+x+"</option>").join("");
 targetLabel.textContent=mode==="Furniture"?"Furniture target":mode==="Material"?"Material / surface target":mode==="Lighting"?"Lighting target":"Camera target";
 referencePriority.parentElement.style.display=mode==="Furniture"?"":"none";
 referenceInput.closest(".upload-panel").querySelector("h2").textContent=mode==="Furniture"?"Ảnh mẫu nội thất":mode==="Material"?"Ảnh mẫu vật liệu":mode==="Lighting"?"Ảnh tham chiếu ánh sáng":"Ảnh tham chiếu góc nhìn";
 modeControls.innerHTML=modeTemplates[mode]();renderDecisions(mode);resultText.textContent="Chọn các quyết định thiết kế; HOANGGIA AI sẽ suy luận phần còn lại.";
}
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mode]").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentMode=b.dataset.mode;populateTargets(currentMode);brainStatus.textContent=currentMode+" decision system";}));
document.querySelectorAll("[data-fill]").forEach(b=>b.addEventListener("click",()=>{brief.value=(brief.value?brief.value+" ":"")+b.dataset.fill;brief.focus();}));

document.getElementById("generate").addEventListener("click",()=>{
 const target=targetSelect.value,userBrief=brief.value.trim(),p=params(),d=selectedDecisions();
 if(!sceneInput.files?.[0]){resultText.textContent="Hãy tải ảnh không gian.";return;}
 if(!userBrief){brief.focus();resultText.textContent="Hãy mô tả ngắn gọn ý định thiết kế.";return;}
 if(currentMode==="Furniture"&&!referenceInput.files?.[0]){resultText.textContent="Furniture mode cần ảnh mẫu B.";return;}
 if(Object.keys(d).length<3){resultText.textContent="Hãy hoàn tất 3 quyết định thiết kế trước khi kết xuất prompt.";return;}
 const modeData=editModeDirection(currentMode,target,userBrief,p);
 const authority=currentMode==="Furniture"?"Scene A = spatial authority · Reference B = furniture authority":"Scene A = spatial authority · Reference = direction authority";
 const data={brief:["SCENE A: spatial authority.",currentMode==="Furniture"?"REFERENCE B: furniture authority.":"REFERENCE: visual direction only.","TARGET: "+target,"DECISIONS: "+Object.entries(d).map(([k,v])=>k+"="+v).join(" | "),"CONTROLS: "+Object.entries(p).map(([k,v])=>k+"="+v).join(" | "),userBrief].join(" "),mode:currentMode,output:"Photorealistic",camera:"Preserve original camera",target,replacement:currentMode==="Furniture"?"Use Reference B as primary design authority.":userBrief,params:p,decisions:d};
 const {prompt,reasoning}=buildDirection(data);
 reasoningSummary.innerHTML=[["TARGET",reasoning.target],["AUTHORITY",authority],["DECISIONS",Object.values(d).join(" · ")],["PRESERVE",reasoning.preserve]].map(([a,b])=>`<div class="reason-card"><small>${a}</small><span>${b}</span></div>`).join("");
 resultContent.textContent=prompt;result.classList.remove("hidden");brainStatus.textContent="Architectural prompt ready";resultText.textContent="HOANGGIA AI đã chuyển quyết định thiết kế thành production prompt.";result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
document.getElementById("copy").addEventListener("click",async()=>{await navigator.clipboard.writeText(resultContent.textContent);document.getElementById("copy").textContent="Copied ✓";setTimeout(()=>document.getElementById("copy").textContent="Copy prompt",1200);});
document.getElementById("newProject").addEventListener("click",()=>{brief.value="";sceneInput.value="";referenceInput.value="";scenePreview.src="";referencePreview.src="";scenePreview.classList.remove("visible");referencePreview.classList.remove("visible");scenePlaceholder.classList.remove("hidden");referencePlaceholder.classList.remove("hidden");result.classList.add("hidden");currentMode="Furniture";document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode==="Furniture"));populateTargets("Furniture");brainStatus.textContent="Decision system ready";window.scrollTo({top:0,behavior:"smooth"});});
populateTargets("Furniture");