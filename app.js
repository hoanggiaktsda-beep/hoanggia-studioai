import { buildDirection } from "./core/prompt-engine.js";
import { editModeDirection } from "./core/edit-engine.js";
import { expertFor } from "./core/expert-decision-layer.js";

const brief=document.getElementById("brief"),result=document.getElementById("result"),resultContent=document.getElementById("resultContent");
const resultText=document.getElementById("resultText"),brainStatus=document.getElementById("brainStatus");
const sceneInput=document.getElementById("sceneInput"),referenceInput=document.getElementById("referenceInput");
const scenePreview=document.getElementById("scenePreview"),referenceGallery=document.getElementById("referenceGallery");
const scenePlaceholder=document.getElementById("scenePlaceholder"),referencePlaceholder=document.getElementById("referencePlaceholder");
const targetSelect=document.getElementById("target"),targetLabel=document.getElementById("targetLabel");
const modelControls=document.getElementById("modelControls");
const modeControls=document.getElementById("modeControls");
const decisionControls=document.getElementById("decisionControls"),reasoningSummary=document.getElementById("reasoningSummary");
const decisionCount=document.getElementById("decisionCount"),expertName=document.getElementById("expertName"),expertRole=document.getElementById("expertRole"),expertSource=document.getElementById("expertSource");
const expertLabel=document.getElementById("expertLabel"),expertScope=document.getElementById("expertScope"),expertProtocol=document.getElementById("expertProtocol"),expertLocks=document.getElementById("expertLocks");
let currentMode="Furniture";
let referenceFiles=[];
let referenceMeta=[];

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
  ["identity","Mục tiêu thay đồ",["Thay đúng model cung cấp","Thay model tương đương","Tinh chỉnh model hiện tại"]],
  ["fit","Tỷ lệ & công năng",["Giữ nguyên tỷ lệ model","Điều chỉnh vừa không gian","Ưu tiên công thái học"]],
  ["placement","Vị trí & lưu thông",["Giữ footprint hiện tại","Tối ưu khoảng lưu thông","Khớp chính xác vị trí đồ cũ"]]
 ],
 Material:[
  ["boundary","Phạm vi vật liệu",["Chỉ thay bề mặt","Thay toàn bộ hệ vật liệu","Đổi vật liệu nhưng giữ cấu tạo"]],
  ["finish","Bề mặt & phản xạ",["Tự nhiên / mờ","Bán bóng","Bóng cao"]],
  ["junction","Liên kết vật liệu",["Giữ nguyên mối nối","Ưu tiên liên tục vân / mạch","Nhấn mạnh chi tiết cạnh / khe"]]
 ],
 Lighting:[
  ["mood","Không khí ánh sáng",["Sang trọng ấm áp","Tự nhiên trung tính","Mềm như ảnh biên tập","Tương phản mạnh"]],
  ["source","Thứ bậc nguồn sáng",["Giữ nguồn sáng hiện tại","Tự nhiên chủ đạo","Nhân tạo chủ đạo","Chiếu sáng nhiều lớp"]],
  ["contrast","Tương phản & bóng",["Mềm","Cân bằng","Mạnh"]]
 ],
 Camera:[
  ["view","Câu chuyện không gian",["Giữ góc hiện tại","Mở rộng để đọc không gian","Tập trung đối tượng","Góc chụp kiến trúc"]],
  ["lens","Tiêu cự / FOV",["Kiến trúc tự nhiên","Góc rộng có kiểm soát","35mm cân bằng","50mm chi tiết"]],
  ["height","Cao độ & khung hình",["Ngang tầm mắt","Thấp / gần trải nghiệm","Cao / đọc tổng thể","Cận chi tiết"]]
 ];
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
 const object=modelControls.querySelector('[data-model="modelObject"]');
 if(object){object.value=targetSelect.value;object.addEventListener("change",syncModelObjectToTarget);}
}
function modelData(){return Object.fromEntries([...modelControls.querySelectorAll("[data-model]")].map(x=>[x.dataset.model,x.value]));}
function syncModelObjectToTarget(){
 const object=modelControls?.querySelector('[data-model="modelObject"]');
 if(object && targetSelect) targetSelect.value=object.value;
}
function syncTargetToModelObject(){
 const object=modelControls?.querySelector('[data-model="modelObject"]');
 if(object) object.value=targetSelect.value;
}


function referenceMetaDefaults(){return {model:targetSelect?.value||modelSchema.object[0],priority:modelSchema.priority[0],preservation:modelSchema.preservation[0],views:modelSchema.views[0],note:""};}
function renderReferenceGallery(){
 if(!referenceGallery)return;
 referenceGallery.innerHTML="";
 referenceFiles.forEach((file,i)=>{
  const meta=referenceMeta[i]||referenceMetaDefaults(); referenceMeta[i]=meta;
  const d=document.createElement("div");d.className="reference-thumb evidence-card";
  d.innerHTML=`<img src="${URL.createObjectURL(file)}" alt="Model cung cấp ${i+1}"><span>${String(i+1).padStart(2,"0")}</span><button type="button" class="reference-remove" title="Xóa ảnh">×</button>
  <div class="evidence-details">
   <div class="evidence-row"><label>MODEL</label><select class="evidence-model">${modelSchema.object.map(x=>`<option${meta.model===x?" selected":""}>${x}</option>`).join("")}</select></div>
   <div class="evidence-row"><label>ƯU TIÊN MODEL CUNG CẤP</label><select class="evidence-priority">${modelSchema.priority.map(x=>`<option${meta.priority===x?" selected":""}>${x}</option>`).join("")}</select></div>
   <div class="evidence-row"><label>MỨC ĐỘ BẢO TOÀN</label><select class="evidence-preservation">${modelSchema.preservation.map(x=>`<option${meta.preservation===x?" selected":""}>${x}</option>`).join("")}</select></div>
   <div class="evidence-row"><label>CHUẨN HÓA GÓC NHÌN</label><select class="evidence-views">${modelSchema.views.map(x=>`<option${meta.views===x?" selected":""}>${x}</option>`).join("")}</select></div>
   <div class="evidence-row"><label>GHI CHÚ</label><input class="evidence-note" value="${meta.note||""}" placeholder="Ghi chú riêng cho ảnh (tuỳ chọn)"></div>
  </div>`;
  d.querySelector(".reference-remove").addEventListener("click",e=>{e.preventDefault();referenceFiles.splice(i,1);referenceMeta.splice(i,1);renderReferenceGallery();});
  const model=d.querySelector(".evidence-model"),priority=d.querySelector(".evidence-priority"),preservation=d.querySelector(".evidence-preservation"),views=d.querySelector(".evidence-views"),note=d.querySelector(".evidence-note");
  const save=()=>{referenceMeta[i]={model:model.value,priority:priority.value,preservation:preservation.value,views:views.value,note:note.value.trim()};};
  [model,priority,preservation,views,note].forEach(x=>x.addEventListener("change",save));
  note.addEventListener("input",save);
  referenceGallery.appendChild(d);
 });
 referencePlaceholder.classList.toggle("hidden",referenceFiles.length>0);
 brainStatus.textContent=referenceFiles.length?"Đã chuẩn hóa "+referenceFiles.length+" Model Evidence Card":"Hệ thống sẵn sàng";
}
referenceInput.addEventListener("change",()=>{
 Array.from(referenceInput.files||[]).forEach(file=>{referenceFiles.push(file);referenceMeta.push(referenceMetaDefaults());});
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
 Furniture:()=>`<div class="expert-controls-head"><span>KIỂM SOÁT CHUYÊN MÔN</span><small>Chỉ dùng khi cần tinh chỉnh cách Expert triển khai quyết định.</small></div><div class="mode-control-grid furniture-advanced">
 <div class="field"><label>Cách thay đồ</label><select data-param="replacementMethod"><option>Thay đúng model cung cấp</option><option>Thay model tương đương theo ngôn ngữ thiết kế</option><option>Tinh chỉnh model hiện tại</option></select></div>
 <div class="field"><label>Khóa nhận diện model</label><select data-param="identityLock"><option>Khóa tuyệt đối silhouette + cấu tạo</option><option>Khóa silhouette + chi tiết đặc trưng</option><option>Khóa ngôn ngữ thiết kế</option></select></div>
 <div class="field"><label>Xử lý tỷ lệ</label><select data-param="scalePolicy"><option>Giữ nguyên tỷ lệ model</option><option>Điều chỉnh vừa không gian nhưng không đổi thiết kế</option><option>Ưu tiên tỷ lệ model so với đồ cũ</option></select></div>
 <div class="field"><label>Vị trí & tiếp xúc</label><select data-param="placementPolicy"><option>Khớp đúng vị trí đồ cũ</option><option>Tối ưu khoảng lưu thông</option><option>Giữ footprint hiện tại</option></select></div>
 <div class="field"><label>Kiểm tra cấu tạo</label><select data-param="construction"><option>Kiến trúc / có thể thi công</option><option>Giữ chi tiết liên kết nhìn thấy</option><option>Can thiệp cấu trúc tối thiểu</option></select></div>
 <div class="field"><label>Vật liệu model</label><select data-param="modelMaterial"><option>Giữ nguyên vật liệu model</option><option>Giữ cấu tạo, cho phép đổi bề mặt</option><option>Ưu tiên vật liệu theo ảnh tham chiếu</option></select></div>
 </div>`,
 Material:()=>`<div class="expert-controls-head"><span>KIỂM SOÁT CHUYÊN MÔN</span><small>Chi tiết kỹ thuật của hệ vật liệu.</small></div><div class="mode-control-grid"><div class="field"><label>Tỷ lệ vân / texture</label><select data-param="texture"><option>Tỷ lệ thực tế theo kiến trúc</option><option>Vân mịn</option><option>Vân / đường đá nổi bật</option></select></div><div class="field"><label>Ưu tiên vật liệu</label><select data-param="materialPriority"><option>Ưu tiên tính chân thực</option><option>Ưu tiên ảnh tham chiếu</option><option>Ưu tiên tính liên tục kiến trúc</option></select></div></div>`,
 Lighting:()=>`<div class="expert-controls-head"><span>KIỂM SOÁT CHUYÊN MÔN</span><small>Chi tiết kỹ thuật của hệ ánh sáng.</small></div><div class="mode-control-grid"><div class="field"><label>Nhiệt độ màu</label><select data-param="temperature"><option>2700–3000K · ấm</option><option>3500–4000K · trung tính</option><option>5000–6500K · ánh sáng ban ngày</option></select></div><div class="field"><label>Thứ bậc ánh sáng</label><select data-param="hierarchy"><option>Nhiều lớp / kiến trúc</option><option>Ánh sáng tự nhiên chủ đạo</option><option>Ánh sáng nhân tạo chủ đạo</option></select></div></div>`,
 Camera:()=>`<div class="expert-controls-head"><span>KIỂM SOÁT CHUYÊN MÔN</span><small>Chi tiết kỹ thuật của camera và phối cảnh.</small></div><div class="mode-control-grid camera-advanced"><div class="field"><label>Phối cảnh</label><select data-param="perspective"><option>Kiến trúc tự nhiên</option><option>Hiệu chỉnh đường đứng</option><option>Góc rộng có kiểm soát</option></select></div><div class="field"><label>Bố cục</label><select data-param="composition"><option>Giữ thứ bậc thiết kế</option><option>Ưu tiên đối tượng chính</option><option>Ưu tiên toàn cảnh không gian</option></select></div><div class="field"><label>Chiều sâu</label><select data-param="depth"><option>Tiền · trung · hậu cảnh rõ</option><option>Ưu tiên chiều sâu tự nhiên</option><option>Tập trung lớp chủ thể</option></select></div><div class="field"><label>Đường đứng</label><select data-param="verticalControl"><option>Giữ thẳng kiến trúc</option><option>Hiệu chỉnh phối cảnh</option><option>Tự nhiên theo góc máy</option></select></div></div>`
};
function params(){return Object.fromEntries([...modeControls.querySelectorAll("[data-param]")].map(x=>[x.dataset.param,x.value]));}
function renderExpert(mode){
 const e=expertFor(mode);
 if(expertName) expertName.textContent=e.name;
 if(expertRole) expertRole.textContent=e.role;
 if(expertSource) expertSource.textContent=e.source;
 if(expertLabel) expertLabel.textContent=e.label;
 if(expertScope) expertScope.textContent=e.scope;
 if(expertProtocol) expertProtocol.innerHTML=e.protocol.map((step,i)=>`<div class="protocol-step"><span>${String(i+1).padStart(2,"0")}</span><p>${step.includes(": ") ? step.split(": ").slice(1).join(": ") : step}</p></div>`).join("");
 if(expertLocks) expertLocks.innerHTML=e.lockedDomains.map(x=>`<span>${x.replaceAll("_"," ")}</span>`).join("");
}
function populateTargets(mode){
 targetSelect.innerHTML=targetSets[mode].map(x=>"<option>"+x+"</option>").join("");
 targetLabel.textContent=mode==="Furniture"?"Đối tượng nội thất":mode==="Material"?"Đối tượng / bề mặt vật liệu":mode==="Lighting"?"Đối tượng ánh sáng":"Đối tượng góc máy";
 modelControls.parentElement.style.display=mode==="Furniture"?"":"none";
 renderModelControls();
 referenceInput.closest(".upload-panel").querySelector("h2").textContent=mode==="Furniture"?"Model thay đồ cung cấp":mode==="Material"?"Ảnh mẫu vật liệu":mode==="Lighting"?"Ảnh tham chiếu ánh sáng":"Ảnh tham chiếu góc nhìn";
 modeControls.innerHTML=modeTemplates[mode]();renderDecisions(mode);renderExpert(mode);resultText.textContent="Chọn các quyết định thiết kế; HOANGGIA AI sẽ suy luận phần còn lại.";
}
targetSelect.addEventListener("change",syncTargetToModelObject);
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-mode]").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentMode=b.dataset.mode;populateTargets(currentMode);brainStatus.textContent="Hệ thống "+expertFor(currentMode).name;}));
document.querySelectorAll("[data-fill]").forEach(b=>b.addEventListener("click",()=>{brief.value=(brief.value?brief.value+" ":"")+b.dataset.fill;brief.focus();}));

document.getElementById("generate").addEventListener("click",()=>{
 const target=targetSelect.value,userBrief=brief.value.trim(),p=params(),d=selectedDecisions();
 if(!sceneInput.files?.[0]){resultText.textContent="Hãy tải ảnh không gian.";return;}
 if(!userBrief){brief.focus();resultText.textContent="Hãy mô tả ngắn gọn ý đồ thiết kế.";return;}
 const model=modelData();
 const referenceRoles=referenceMeta.map((m,i)=>`#${i+1} model=${m?.model||modelSchema.object[0]} | priority=${m?.priority||modelSchema.priority[0]} | preservation=${m?.preservation||modelSchema.preservation[0]} | views=${m?.views||modelSchema.views[0]}${m?.note?` | note=${m.note}`:""}`).join(" || ");
 const referenceRequired=currentMode==="Furniture";
 if(referenceRequired&&!referenceFiles.length){resultText.textContent="Hãy tải ít nhất 1 ảnh model cung cấp cho chế độ nội thất.";return;}
  if(Object.keys(d).length<3){resultText.textContent="Hãy hoàn tất 3 quyết định thiết kế trước khi tạo prompt.";return;}
 const modeData=editModeDirection(currentMode,target,userBrief,p,d);
 const expert=expertFor(currentMode);
 const authority=currentMode==="Furniture"?"Ảnh A = cơ sở không gian · "+referenceFiles.length+" ảnh model cung cấp = cơ sở thiết kế nội thất · "+model.modelPriority:"Ảnh A = cơ sở không gian · Ảnh tham chiếu = định hướng hình ảnh";
 const data={brief:["SCENE A: spatial authority.",currentMode==="Furniture"?"PROVIDED MODEL IMAGES: multiple views of the supplied furniture model.":"REFERENCE: visual direction only.","TARGET: "+target,"DECISIONS: "+Object.entries(d).map(([k,v])=>k+"="+v).join(" | "),"CONTROLS: "+Object.entries(p).map(([k,v])=>k+"="+v).join(" | "),"MODEL STANDARDIZATION: "+Object.entries(model).map(([k,v])=>k+"="+v).join(" | ")+" | EVIDENCE CARDS: "+referenceRoles,userBrief].join(" "),mode:currentMode,output:"Photorealistic",camera:"Preserve original camera",target,replacement:currentMode==="Furniture"?"Use ALL provided model images as the primary design authority. Treat them as multiple views of the same supplied model. Reconstruct one consistent model identity from all views; never mix parts from unrelated models. Each Model Evidence Card carries its own model, priority, preservation and view-standardization settings; synthesize all cards into ONE model identity without inventing unsupported geometry. Model standardization: "+Object.entries(model).map(([k,v])=>k+"="+v).join(" | ")+" | Model Evidence Cards: "+referenceRoles:userBrief,params:p,decisions:d,model,referenceRoles};
 const {prompt,reasoning}=buildDirection(data);
 reasoningSummary.innerHTML=[["CHUYÊN GIA",expert.name+" — "+expert.role],["ĐỐI TƯỢNG",reasoning.target],["MODEL",authority],["QUYẾT ĐỊNH",Object.values(d).join(" · ")],["BẢO TOÀN",reasoning.preserve]].map(([a,b])=>`<div class="reason-card"><small>${a}</small><span>${b}</span></div>`).join("");
 resultContent.textContent=prompt;result.classList.remove("hidden");brainStatus.textContent="Đã áp dụng chuyên gia "+expert.name;resultText.textContent="HOANGGIA AI đã dùng toàn bộ ảnh model cung cấp để xây dựng prompt sản xuất.";result.scrollIntoView({behavior:"smooth",block:"nearest"});
});
document.getElementById("copy").addEventListener("click",async()=>{await navigator.clipboard.writeText(resultContent.textContent);document.getElementById("copy").textContent="Đã sao chép ✓";setTimeout(()=>document.getElementById("copy").textContent="Sao chép prompt",1200);});
document.getElementById("newProject").addEventListener("click",()=>{brief.value="";sceneInput.value="";referenceInput.value="";referenceFiles=[];referenceMeta=[];renderReferenceGallery();sceneInput.value="";scenePreview.src="";scenePreview.classList.remove("visible");scenePlaceholder.classList.remove("hidden");referencePlaceholder.classList.remove("hidden");result.classList.add("hidden");currentMode="Furniture";document.querySelectorAll("[data-mode]").forEach(x=>x.classList.toggle("active",x.dataset.mode==="Furniture"));populateTargets("Furniture");brainStatus.textContent="Hệ thống sẵn sàng";window.scrollTo({top:0,behavior:"smooth"});});
populateTargets("Furniture");
