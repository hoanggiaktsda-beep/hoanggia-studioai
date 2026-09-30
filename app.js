import { buildDirection } from "./core/prompt-engine.js";
import { editModeDirection } from "./core/edit-engine.js";

const brief = document.getElementById("brief");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resultText = document.getElementById("resultText");
const brainStatus = document.getElementById("brainStatus");
const sceneInput = document.getElementById("sceneInput");
const referenceInput = document.getElementById("referenceInput");
const scenePreview = document.getElementById("scenePreview");
const referencePreview = document.getElementById("referencePreview");
const scenePlaceholder = document.getElementById("scenePlaceholder");
const referencePlaceholder = document.getElementById("referencePlaceholder");
const targetSelect = document.getElementById("target");
const targetLabel = document.getElementById("targetLabel");
const referencePriority = document.getElementById("referencePriority");
const modeControls = document.getElementById("modeControls");
const reasoningSummary = document.getElementById("reasoningSummary");

let currentMode = "Furniture";

const targetSets = {
  Furniture:["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
  Material:["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Tường","Sàn","Trần","Đá / mặt bàn","Gỗ / veneer","Da / vải","Kim loại","Khác"],
  Lighting:["Toàn cảnh","Đèn trần","Đèn hắt","Đèn trang trí","Ánh sáng tự nhiên","Vùng ánh sáng","Khác"],
  Camera:["Toàn cảnh","Góc sofa","Góc bàn ăn","Góc phòng","Cận vật liệu","Góc mới theo yêu cầu"]
};

const modeCopy = {
  Furniture:["Phân tích cấu tạo, tỷ lệ, vị trí, vật liệu và độ hòa nhập của món đồ.","Ảnh mẫu B là design authority; ảnh A là spatial authority."],
  Material:["Khóa hình học, chỉ thay đúng lớp vật liệu/finish được chỉ định.","Ảnh A giữ toàn bộ kiến trúc; ảnh B chỉ dẫn vật liệu."],
  Lighting:["Suy luận nguồn sáng, hướng, nhiệt độ màu, độ tương phản và bounce light.","Ảnh A là spatial authority; ảnh B chỉ dẫn mood/light."],
  Camera:["Suy luận vị trí máy, cao độ, tiêu cự, framing và perspective.","Thiết kế giữ nguyên; chỉ thay viewpoint theo yêu cầu."]
};

const controlTemplates = {
  Furniture:()=>`<div class="mode-control-grid">
    <div class="field"><label>Nguyên tắc tỷ lệ</label><select data-param="scale"><option>Giữ footprint hiện tại</option><option>Điều chỉnh vừa không gian</option><option>Giữ đúng kích thước mẫu B</option></select></div>
    <div class="field"><label>Độ ưu tiên mẫu B</label><select data-param="reference"><option>Khóa hình dáng + cấu tạo</option><option>Khóa hình dáng, cho phép đổi finish</option><option>Khóa ngôn ngữ thiết kế</option></select></div>
  </div>`,
  Material:()=>`<div class="mode-control-grid">
    <div class="field"><label>Finish</label><select data-param="finish"><option>Natural / matte</option><option>Satin</option><option>High gloss</option><option>Textured / brushed</option></select></div>
    <div class="field"><label>Texture scale</label><select data-param="texture"><option>Architectural / realistic scale</option><option>Fine grain</option><option>Bold grain / veining</option></select></div>
  </div>`,
  Lighting:()=>`<div class="mode-control-grid">
    <div class="field"><label>Lighting mood</label><select data-param="mood"><option>Warm luxury</option><option>Neutral daylight</option><option>Soft editorial</option><option>Dramatic contrast</option></select></div>
    <div class="field"><label>Light direction</label><select data-param="direction"><option>Giữ hướng sáng hiện tại</option><option>Từ cửa sổ / daylight</option><option>Từ trần / downlight</option><option>Side light</option></select></div>
  </div>`,
  Camera:()=>`<div class="mode-control-grid">
    <div class="field"><label>Lens feel</label><select data-param="lens"><option>Natural architectural</option><option>24–28mm wide</option><option>35mm balanced</option><option>50mm detail</option></select></div>
    <div class="field"><label>Camera height</label><select data-param="height"><option>Eye level</option><option>Low architectural</option><option>High overview</option><option>Close detail</option></select></div>
  </div>`
};

function setPreview(input, preview, placeholder, label){
  input.addEventListener("change",()=>{
    const file=input.files?.[0]; if(!file)return;
    preview.src=URL.createObjectURL(file); preview.classList.add("visible"); placeholder.classList.add("hidden");
    brainStatus.textContent=label+" loaded";
  });
}
setPreview(sceneInput,scenePreview,scenePlaceholder,"Scene image");
setPreview(referenceInput,referencePreview,referencePlaceholder,"Reference image");

function params(){
  return Object.fromEntries([...modeControls.querySelectorAll("[data-param]")].map(x=>[x.dataset.param,x.value]));
}

function populateTargets(mode){
  targetSelect.innerHTML=targetSets[mode].map(x=>"<option>"+x+"</option>").join("");
  targetLabel.textContent=mode==="Furniture"?"Furniture target":mode==="Material"?"Material / surface target":mode==="Lighting"?"Lighting target":"Camera target";
  referencePriority.parentElement.style.display=mode==="Furniture"?"":"none";
  referenceInput.closest(".upload-panel").querySelector("h2").textContent=
    mode==="Furniture"?"Ảnh mẫu nội thất":mode==="Material"?"Ảnh mẫu vật liệu":mode==="Lighting"?"Ảnh tham chiếu ánh sáng":"Ảnh tham chiếu góc nhìn";
  modeControls.innerHTML=controlTemplates[mode]();
  resultText.textContent=modeCopy[mode][0];
}

document.querySelectorAll("[data-mode]").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll("[data-mode]").forEach(x=>x.classList.remove("active"));
    button.classList.add("active"); currentMode=button.dataset.mode;
    populateTargets(currentMode); brainStatus.textContent=currentMode+" engine selected";
  });
});

document.querySelectorAll("[data-fill]").forEach(button=>{
  button.addEventListener("click",()=>{
    brief.value=(brief.value?brief.value+" ":"")+button.dataset.fill; brief.focus();
  });
});

document.getElementById("generate").addEventListener("click",()=>{
  const target=targetSelect.value, userBrief=brief.value.trim(), p=params();
  if(!sceneInput.files?.[0]){resultText.textContent="Hãy tải ảnh không gian để làm ảnh nền tham chiếu.";brainStatus.textContent="Waiting for base image";return;}
  if(!userBrief){brief.focus();resultText.textContent="Hãy mô tả thay đổi bạn muốn thực hiện.";brainStatus.textContent="Waiting for edit direction";return;}
  if(currentMode==="Furniture"&&!referenceInput.files?.[0]){resultText.textContent="Với thay đồ nội thất, hãy tải thêm ảnh mẫu B.";brainStatus.textContent="Waiting for furniture reference";return;}

  const priority=referencePriority.value;
  const modeData=editModeDirection(currentMode,target,userBrief,p);
  const data={
    brief:[
      "BASE IMAGE: Scene A is the spatial authority.",
      currentMode==="Furniture"?"REFERENCE IMAGE B: supplied furniture reference is the design authority.":"REFERENCE IMAGE: supplied image is guidance only for the requested edit.",
      modeData.instruction,"Target: "+target,
      currentMode==="Furniture"?"Reference priority: "+priority:"",
      Object.entries(p).map(([k,v])=>k.toUpperCase()+": "+v).join(" | "),userBrief
    ].filter(Boolean).join(" "),
    mode:currentMode,output:"Photorealistic",
    camera:currentMode==="Camera"?userBrief:"Preserve original camera",target,
    replacement:currentMode==="Furniture"?"Use Reference B as the primary furniture design reference.":userBrief,
    params:p
  };

  const {prompt,reasoning}=buildDirection(data);
  reasoningSummary.innerHTML=[
    ["TARGET",reasoning.target],
    ["DESIGN AUTHORITY",reasoning.authority],
    ["PRESERVE",reasoning.preserve],
  ].map(([a,b])=>`<div class="reason-card"><small>${a}</small><span>${b}</span></div>`).join("");

  resultContent.textContent=prompt; result.classList.remove("hidden");
  brainStatus.textContent=modeData.label+" prompt ready";
  resultText.textContent="Đã tạo production prompt theo logic kiến trúc.";
  result.scrollIntoView({behavior:"smooth",block:"nearest"});
});

document.getElementById("copy").addEventListener("click",async()=>{
  await navigator.clipboard.writeText(resultContent.textContent);
  document.getElementById("copy").textContent="Copied ✓"; setTimeout(()=>document.getElementById("copy").textContent="Copy prompt",1200);
});

document.getElementById("newProject").addEventListener("click",()=>{
  brief.value="";sceneInput.value="";referenceInput.value="";scenePreview.src="";referencePreview.src="";
  scenePreview.classList.remove("visible");referencePreview.classList.remove("visible");
  scenePlaceholder.classList.remove("hidden");referencePlaceholder.classList.remove("hidden");result.classList.add("hidden");
  brainStatus.textContent="Reference engine ready";currentMode="Furniture";populateTargets("Furniture");
  document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode==="Furniture"));
  window.scrollTo({top:0,behavior:"smooth"});
});
populateTargets("Furniture");