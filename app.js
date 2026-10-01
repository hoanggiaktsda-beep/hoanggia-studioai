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
const decisionTitle=document.getElementById("decisionTitle"),decisionHint=document.getElementById("decisionHint");
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
  ["intervention","Mục tiêu can thiệp","Bạn muốn Expert làm gì với model trong không gian?",["Thay đúng model cung cấp","Tinh chỉnh model hiện tại","Thay bằng model tương đương"]],
  ["identity","Mức độ giữ nhận diện","Sau khi đặt vào không gian, mức độ nhận diện model phải được giữ thế nào?",["Giữ 100% hình dáng + cấu tạo","Giữ silhouette + chi tiết đặc trưng","Giữ ngôn ngữ thiết kế"]],
  ["fit","Tỷ lệ & kích thước","Expert được phép xử lý tỷ lệ của model với không gian ở mức nào?",["Giữ nguyên tỷ lệ model","Điều chỉnh kích thước vừa không gian","Ưu tiên ergonomics + tỷ lệ không gian"]],
  ["placement","Vị trí & lưu thông","Khi đưa model vào, ưu tiên bố trí nào?",["Giữ đúng vị trí đồ cũ","Tối ưu khoảng lưu thông","Cho phép chọn vị trí mới"]],
  ["construction","Mức độ bảo toàn cấu tạo","Expert phải xử lý logic cấu tạo của model thế nào?",["Bảo toàn cấu tạo nguyên bản","Bảo toàn cấu tạo + mối nối nhìn thấy","Cho phép thích nghi cấu tạo tối thiểu"]]
 ],
 Material:[],Lighting:[],Camera:[]
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
 const fields=decisions[mode]||[];
 if(decisionTitle) decisionTitle.textContent=mode==="Furniture"?"Quyết định của Expert — Furniture": "Quyết định của Expert";
 if(decisionHint) decisionHint.textContent=mode==="Furniture"
  ?"Ốc chỉ quyết định 5 điểm cốt lõi. Citterio suy luận tỷ lệ, công năng, lưu thông và cấu tạo trong phạm vi đã chọn."
  :"Khu vực đang được sắp xếp lại. Chưa có quyết định nào được cấu hình.";
 decisionControls.innerHTML=fields.map(([key,label,hint,opts],i)=>`
  <div class="decision-field">
   <span class="decision-index">${String(i+1).padStart(2,"0")}</span>
   <label>${label}<small>${hint}</small></label>
   <select data-decision="${key}">${opts.map((o,j)=>`<option${j===0?" selected":""}>${o}</option>`).join("")}</select>
  </div>`).join("");
 updateCount();
}
function updateCount(){
 const total=(decisions[currentMode]||[]).length;
 const n=Object.values(selectedDecisions()).filter(Boolean).length;
 decisionCount.textContent=n+" / "+total;
}
decisionControls.addEventListener("change",updateCount);

const modeTemplates={
 Furniture:()=>"",
 Material:()=>"",
 Lighting:()=>"",
 Camera:()=> ""
};
