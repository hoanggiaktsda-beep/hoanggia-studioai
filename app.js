import { buildDirection } from "./core/prompt-engine.js";
import { editModeDirection } from "./core/edit-engine.js";
import { expertFor } from "./core/expert-decision-layer.js";

const brief=document.getElementById("brief"),result=document.getElementById("result"),resultContent=document.getElementById("resultContent");
const resultText=document.getElementById("resultText"),brainStatus=document.getElementById("brainStatus");
const sceneInput=document.getElementById("sceneInput"),referenceInput=document.getElementById("referenceInput");
const scenePreview=document.getElementById("scenePreview"),referencePreview=document.getElementById("referencePreview"),referenceGallery=document.getElementById("referenceGallery");
const scenePlaceholder=document.getElementById("scenePlaceholder"),referencePlaceholder=document.getElementById("referencePlaceholder");
const targetSelect=document.getElementById("target"),targetLabel=document.getElementById("targetLabel");
const modelControls=document.getElementById("modelControls");
const modeControls=document.getElementById("modeControls");
const decisionControls=document.getElementById("decisionControls"),reasoningSummary=document.getElementById("reasoningSummary");
const decisionCount=document.getElementById("decisionCount"),expertName=document.getElementById("expertName"),expertRole=document.getElementById("expertRole"),expertSource=document.getElementById("expertSource");
let currentMode="Furniture";
let referenceFiles=[];

const targetSets={
 Furniture:["Sofa","Ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
 Material:["Sofa","Ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Tường","Sàn","Trần","Đá / mặt bàn","Gỗ / veneer","Da / vải","Kim loại","Khác"],
 Lighting:["Toàn cảnh","Đèn trần","Đèn hắt","Đèn trang trí","Ánh sáng tự nhiên","Vùng ánh sáng","Khác"],
 Camera:["Toàn cảnh","Góc sofa","Góc bàn ăn","Góc phòng","Cận vật liệu","Góc mới theo yêu cầu"]
};

const modelSchema={
 object:["Sofa","Ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
 priority:["Giữ nguyên toàn bộ model cung cấp","Ưu tiên hình dáng + cấu tạo","Ưu tiên hình dáng + vật liệu","Ưu tiên ngôn ngữ thiết kế"],
 preservation:["Bảo toàn 100% hình dáng và cấu tạo","Giữ silhouette, tối ưu tỷ lệ vừa không gian","Cho phép tinh chỉnh nhẹ theo không gian"],
 views:["Nhiều góc nhìn của cùng một model","Một góc nhìn chính","Góc chính + ảnh chi tiết"]
};

const decisions={
 Furniture:[
  ["direction","Hướng thay đổi",["Thay bằng model cung cấp","Thay bằng thiết kế mới","Tinh chỉnh model hiện tại"]],
  ["fit","Mức độ can thiệp",["Giữ nguyên diện tích chiếm chỗ","Điều chỉnh vừa không gian","Ưu tiên đúng tỷ lệ model"]],
  ["character","Ngôn ngữ thiết kế",["Giữ nguyên phong cách không gian","Hiện đại sang trọng","Tối giản sang trọng","Đương đại","Tân cổ điển đương đại"]]
 ],
 Material:[
  ["change","Mục tiêu vật liệu",["Thay hoàn toàn","Tinh chỉnh tông màu","Nâng cấp bề mặt","Đổi vật liệu nhưng giữ cấu tạo"]],
  ["finish","Bề mặt",["Tự nhiên / mờ","Bán bóng","Bóng cao","Xước / có vân"]],
  ["character","Cảm giác",["Ấm và tự nhiên","Tinh tế / tiết chế","Sang trọng","Tương phản mạnh"]]
 ],
 Lighting:[
  ["mood","Bầu không khí",["Sang trọng ấm áp","Ánh sáng ban ngày trung tính","Mềm như ảnh biên tập","Tương phản mạnh","Nhà ở thư thái"]],
  ["source","Nguồn sáng",["Giữ nguồn sáng hiện tại","Ưu tiên ánh sáng tự nhiên","Ưu tiên ánh sáng nhân tạo","Chiếu sáng nhiều lớp"]],
  ["contrast","Độ tương phản",["Mềm","Cân bằng","Mạnh"]]
 ],
 Camera:[
  ["view","Ý đồ góc nhìn",["Giữ góc hiện tại","Rộng hơn để thấy không gian","Tập trung vật thể","Góc chụp biên tập","Góc chụp kiến trúc"]],
  ["lens","Cảm giác tiêu cự",["Kiến trúc tự nhiên","Góc rộng 24–28mm","Cân bằng 35mm","Chi tiết 50mm"]],
  ["height","Cao độ máy",["Ngang tầm mắt","Góc máy thấp","Góc máy cao","Cận chi tiết"]]
 ]
};

function setPreview(input,preview,placeholder,label){
 input.addEventListener("change",()=>{const f=input.files?.[0];if(!f)return;preview.src=URL.createObjectURL(f);preview.classList.add("visible");placeholder.classList.add("hidden");brainStatus.textContent=label+" đã tải";});
}
setPreview(sceneInput,scenePreview,scenePlaceholder,"Ảnh không gian");


function renderModelControls(){
 if(!modelControls)return;
 modelControls.innerHTML=[
  ["modelObject","Đối tượng nội thất",modelSchema.object],
  ["modelPriority","Ưu tiên model cung cấp",modelSchema.priority],
  ["modelPreservation","Mức độ bảo toàn",modelSchema.preservation],
  ["modelViews","Chuẩn hóa góc nhìn",modelSchema.views]
 ].map(([key,label,opts])=>`<div class="field"><label>${label}</label><select data-model="${key}">${opts.map((o,i)=>`<option${i===0?" selected":""}>${o}</option>`).join("")}</select></div>`).join("");
}
function modelData(){return Object.fromEntries([...modelControls.querySelectorAll("[data-model]")].map(x=>[x.dataset.model,x.value]));}
function renderReferenceGallery(){
 if(!referenceGallery)return;
 referenceGallery.innerHTML="";
 referenceFiles.forEach((file,i)=>{
  const item=document.createElement("div");item.className="reference-thumb";
  const img=document.createElement("img");img.src=URL.createObjectURL(file);img.alt="Model cung cấp "+(i+1);
  const remove=document.createElement("button");remove.type="button";remove.className="reference-remove";remove.textContent="×";remove.title="Xóa ảnh";
  remove.addEventListener("click",e=>{e.preventDefault();referenceFiles.splice(i,1);renderReferenceGallery();});
  const index=document.createElement("span");index.textContent=i+1;
  item.append(img,index,remove);referenceGallery.appendChild(item);
 });
 referencePlaceholder.classList.toggle("hidden",referenceFiles.length>0);
 brainStatus.textContent=referenceFiles.length?"Đã tải "+referenceFiles.length+" ảnh model cung cấp":"Hệ thống sẵn sàng";
}
referenceInput.addEventListener("change",()=>{
 referenceFiles=[...referenceFiles,...Array.from(referenceInput.files||[])];
 referenceInput.value="";
 renderReferenceGallery();
});
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
 Furniture:()=>`<div class="mode-control-grid"><div class="field"><label>Ưu tiên model cung cấp</label><select data-param="reference"><option>Khóa hình dáng + cấu tạo model</option><option>Khóa hình dáng, cho phép đổi bề mặt</option><option>Khóa ngôn ngữ thiết kế</option></select></div><div class="field"><label>Kiểm tra cấu tạo</label><select data-param="construction"><option>Kiến trúc / có thể thi công</option><option>Giữ chi tiết liên kết nhìn thấy</option><option>Can thiệp cấu trúc tối thiểu</option></select></div></div>`,
 Material:()=>`<div class="mode-control-grid"><div class="field"><label>Tỷ lệ vân / texture</label><select data-param="texture"><option>Tỷ lệ thực tế theo kiến trúc</option><option>Vân mịn</option><option>Vân / đường đá nổi bật</option></select></div><div class="field"><label>Ưu tiên vật liệu</label><select data-param="materialPriority"><option>Ưu tiên tính chân thực</option><option>Ưu tiên ảnh tham chiếu</option><option>Ưu tiên tính liên tục kiến trúc</option></select></div></div>`,
 Lighting:()=>`<div class="mode-control-grid"><div class="field"><label>Nhiệt độ màu</label><select data-param="temperature"><option>2700–3000K · ấm</option><option>3500–4000K · trung tính</option><option>5000–6500K · ánh sáng ban ngày</option></select></div><div class="field"><label>Thứ bậc ánh sáng</label><select data-param="hierarchy"><option>Nhiều lớp / kiến trúc</option><option>Ánh sáng tự nhiên chủ đạo</option><option>Ánh sáng nhân tạo chủ đạo</option></select></div></div>`,
 Camera:()=>`<div class="mode-control-grid"><div class="field"><label>Phối cảnh</label><select data-param="perspective"><option>Kiến trúc tự nhiên</option><option>Hiệu chỉnh đường đứng</option><option>Góc rộng có kiểm soát</option></select></div><div class="field"><label>Bố cục</label><select data-param="composition"><option>Giữ thứ bậc thiết kế</option><option>Ưu tiên đối tượng chính</option><option>Ưu tiên toàn cảnh không gian</option></select></div></div>`
};

function params(){return Object.fromEntries([...modeControls.querySelectorAll("[data-param]")].map(x=>[x.dataset.param,x.value]));}
function renderExpert(mode){
 const e=expertFor(mode);
 if(expertName) expertName.textContent=e.name;
 if(expertRole) expertRole.textContent=e.role;
 if(expertSource) expertSource.textContent=e.source;
}
function populateTargets(mode){
 targetSelect.innerHTML=targetSets[mode].map(x=>"<option>"+x+"</option>").join("");
 targetLabel.textContent=mode==="Furniture"?"Đối tượng nội thất":mode==="Material"?"Đối tượng / bề mặt vật liệu":mode==="Lighting"?"Đối tượng ánh sáng":"Đối tượng góc máy";
 modelControls.parentElement.style.display=mode==="Furniture"?"":"none";
 renderModelControls();
 referenceInput.closest(".upload-panel").querySelector("h2").textContent=mode==="Furniture"?"Model cung cấp":mode==="Material"?"Ảnh mẫu vật liệu":mode==="Lighting"?"Ảnh tham chiếu ánh sáng":"Ảnh tham chiếu góc nhìn";
 modeControls.innerHTML=modeTemplates[mode]();renderDecisions(mode);renderExpert(mode);resultText.textContent="Chọn các quyết định thiết kế; HOANGGIA AI sẽ suy luận phần còn lại.";
}
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mode]").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentMode=b.dataset.mode;populateTargets(currentMode);brainStatus.textContent="Hệ thống "+expertFor(currentMode).name;}));
document.querySelectorAll("[data-fill]").forEach(b=>b.addEventListener("click",()=>{brief.value=(brief.value?brief.value+" ":"")+b.dataset.fill;brief.focus();}));

document.getElementById("generate").addEventListener("click",()=>{
 const target=targetSelect.value,userBrief=brief.value.trim(),p=params(),d=selectedDecisions();
 if(!sceneInput.files?.[0]){resultText.textContent="Hãy tải ảnh không gian.";return;}
 if(!userBrief){brief.focus();resultText.textContent="Hãy mô tả ngắn gọn ý đồ thiết kế.";return;}
 const model=modelData();
 if(currentMode==="Furniture"&&!referenceFiles.length){resultText.textContent="Hãy tải ít nhất 1 ảnh model cung cấp cho chế độ nội thất.";return;}
 if(currentMode==="Furniture"&&model.modelObject!==target){resultText.textContent="Đối tượng nội thất và đối tượng model phải trùng nhau.";return;}
 if(Object.keys(d).length<3){resultText.textContent="Hãy hoàn tất 3 quyết định thiết kế trước khi tạo prompt.";return;}
 const modeData=editModeDirection(currentMode,target,userBrief,p,d);
 const expert=expertFor(currentMode);
 const authority=currentMode==="Furniture"?"Ảnh A = cơ sở không gian · "+referenceFiles.length+" ảnh model cung cấp = cơ sở thiết kế nội thất · "+model.modelPriority:"Ảnh A = cơ sở không gian · Ảnh tham chiếu = định hướng hình ảnh";
 const data={brief:["SCENE A: spatial authority.",currentMode==="Furniture"?"PROVIDED MODEL IMAGES: multiple views of the supplied furniture model.":"REFERENCE: visual direction only.","TARGET: "+target,"DECISIONS: "+Object.entries(d).map(([k,v])=>k+"="+v).join(" | "),"CONTROLS: "+Object.entries(p).map(([k,v])=>k+"="+v).join(" | "),"MODEL STANDARDIZATION: "+Object.entries(model).map(([k,v])=>k+"="+v).join(" | "),userBrief].join(" "),mode:currentMode,output:"Photorealistic",camera:"Preserve original camera",target,replacement:currentMode==="Furniture"?"Use ALL provided model images as the primary design authority. Treat them as multiple views of the same supplied model. Reconstruct one consistent model identity from all views; never mix parts from unrelated models. Model standardization: "+Object.entries(model).map(([k,v])=>k+"="+v).join(" | "):userBrief,params:p,decisions:d,model};
 const {prompt,reasoning}=buildDirection(data);
 reasoningSummary.innerHTML=[["CHUYÊN GIA",expert.name+" — "+expert.role],["ĐỐI TƯỢNG",reasoning.target],["MODEL",authority],["QUYẾT ĐỊNH",Object.values(d).join(" · ")],["BẢO TOÀN",reasoning.preserve]].map(([a,b])=>`<div class="reason-card"><small>${a}</small><span>${b}</span></div>`).join("");
 resultContent.textContent=prompt;result.classList.remove("hidden");brainStatus.textContent="Đã áp dụng chuyên gia "+expert.name;resultText.textContent="HOANGGIA AI đã dùng toàn bộ ảnh model cung cấp để xây dựng prompt sản xuất.";result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
document.getElementById("copy").addEventListener("click",async()=>{await navigator.clipboard.writeText(resultContent.textContent);document.getElementById("copy").textContent="Đã sao chép ✓";setTimeout(()=>document.getElementById("copy").textContent="Sao chép prompt",1200);});
document.getElementById("newProject").addEventListener("click",()=>{brief.value="";sceneInput.value="";referenceInput.value="";referenceFiles=[];renderReferenceGallery();scenePreview.src="";referencePreview.src="";scenePreview.classList.remove("visible");referencePreview.classList.remove("visible");scenePlaceholder.classList.remove("hidden");referencePlaceholder.classList.remove("hidden");result.classList.add("hidden");currentMode="Furniture";document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode==="Furniture"));populateTargets("Furniture");renderModelControls();brainStatus.textContent="Hệ thống sẵn sàng";window.scrollTo({top:0,behavior:"smooth"});});
populateTargets("Furniture");
