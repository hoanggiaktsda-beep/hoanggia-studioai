import { buildDirection } from "./core/prompt-engine.js";
import { editModeDirection } from "./core/edit-engine.js";
import { expertFor } from "./core/expert-decision-layer.js";

const brief = document.getElementById("brief");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resultText = document.getElementById("resultText");
const brainStatus = document.getElementById("brainStatus");
const sceneInput = document.getElementById("sceneInput");
const referenceInput = document.getElementById("referenceInput");
const scenePreview = document.getElementById("scenePreview");
const referenceGallery = document.getElementById("referenceGallery");
const scenePlaceholder = document.getElementById("scenePlaceholder");
const referencePlaceholder = document.getElementById("referencePlaceholder");
const referenceTrigger = document.getElementById("referenceTrigger");
const decisionControls = document.getElementById("decisionControls");
const reasoningSummary = document.getElementById("reasoningSummary");
const decisionTitle = document.getElementById("decisionTitle");
const decisionHint = document.getElementById("decisionHint");
const decisionCount = document.getElementById("decisionCount");
const expertName = document.getElementById("expertName");
const expertRole = document.getElementById("expertRole");
const expertSource = document.getElementById("expertSource");
const expertLabel = document.getElementById("expertLabel");
const expertScope = document.getElementById("expertScope");
const expertProtocol = document.getElementById("expertProtocol");
const expertLocks = document.getElementById("expertLocks");
const modeControls = document.getElementById("modeControls");
const intentStyle = document.getElementById("intentStyle");
const intentLighting = document.getElementById("intentLighting");
const intentView = document.getElementById("intentView");
const intentCamera = document.getElementById("intentCamera");
const spaceSyncPanel = document.getElementById("spaceSyncPanel");
const syncReferenceInput = document.getElementById("syncReferenceInput");
const syncReferencePreview = document.getElementById("syncReferencePreview");
const syncReferencePlaceholder = document.getElementById("syncReferencePlaceholder");
const syncTargetInput = document.getElementById("syncTargetInput");
const syncTargetGallery = document.getElementById("syncTargetGallery");
const syncTargetTrigger = document.getElementById("syncTargetTrigger");
const syncTargetCount = document.getElementById("syncTargetCount");

let currentMode = "Furniture";
let selectedAITarget = "ChatGPT Images";

const aiTargetProfiles = {
  "ChatGPT Images": "Format for OpenAI image editing: direct conversational edit instruction, explicit target, preservation locks, spatial consistency and precise requested change.",
  "GPT Image 2.5": "Format for high-precision image editing: isolate the requested intervention, preserve everything else, state exact edit boundaries and realism constraints.",
  "Nano Banana Pro": "Format for complex professional image editing: explicit multi-reference handling, target identity, spatial consistency, material fidelity and preservation.",
  "Nano Banana 2": "Format for fast advanced image editing: concise target/change/constraints with strong object consistency and physical realism.",
  "FLUX.2 Pro": "Format for production image editing: concise contextual instructions, composition continuity, geometry/material consistency and controlled transformation.",
  "Midjourney": "Format for Midjourney image direction: compact visual art direction, reference intent, composition, material, atmosphere and controlled style language.",
  "Seedream 5.0": "Format for high-fidelity image editing: explicit target, identity preservation, spatial/material consistency and detailed visual constraints.",
  "Adobe Firefly": "Format for Adobe Firefly: clear generative-edit instruction with precise edit scope, preservation boundaries and production-safe visual language.",
  "Ideogram": "Format for Ideogram: concise image-editing direction with precise composition, object details and typography-aware constraints.",
  Lovart: "Format for Lovart: compact production directives, clear material/object/camera actions and strict preservation rules.",
  "Nano Banana": "Format for legacy Nano Banana image editing: explicit image-editing instructions, precise target boundaries and strong preservation constraints.",
  "Khác": "Format as a concise production-ready image-editing prompt that clearly states the target, changes, preservation and realism."
};
let referenceFiles = [];
let referenceMeta = [];
let syncReferenceFile = null;
let syncTargetFiles = [];
let syncTargetNotes = [];

const referenceOptions = {
  object: ["Sofa","Ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
  priority: ["Giữ nguyên toàn bộ model cung cấp","Ưu tiên hình dáng + cấu tạo","Ưu tiên hình dáng + vật liệu","Ưu tiên ngôn ngữ thiết kế"],
  preservation: ["Bảo toàn 100% hình dáng và cấu tạo","Giữ silhouette, tối ưu tỷ lệ vừa không gian","Cho phép tinh chỉnh nhẹ theo không gian"],
  views: ["Nhiều góc nhìn của cùng một model","Một góc nhìn chính","Góc chính + ảnh chi tiết"]
};

const decisions = {
  Furniture: [
    ["intervention","Mục tiêu can thiệp","Phạm vi thay đổi của đồ nội thất.",["Thay đúng model cung cấp","Tinh chỉnh model hiện tại","Thay bằng model tương đương"]],
    ["identity","Mức độ giữ nhận diện","Ranh giới nhận diện của model.",["Giữ 100% hình dáng + cấu tạo","Giữ silhouette + chi tiết đặc trưng","Giữ ngôn ngữ thiết kế"]],
    ["fit","Tỷ lệ & kích thước","Cách xử lý kích thước với không gian.",["Giữ nguyên tỷ lệ model","Điều chỉnh kích thước vừa không gian","Ưu tiên ergonomics + tỷ lệ không gian"]],
    ["placement","Vị trí & lưu thông","Cách đặt model trong không gian.",["Giữ đúng vị trí đồ cũ","Tối ưu khoảng lưu thông","Cho phép chọn vị trí mới"]],
    ["construction","Mức độ bảo toàn cấu tạo","Mức độ giữ logic cấu tạo.",["Bảo toàn cấu tạo nguyên bản","Bảo toàn cấu tạo + mối nối nhìn thấy","Cho phép thích nghi cấu tạo tối thiểu"]]
  ],
  Material: [
    ["boundary","Phạm vi vật liệu","Xác định chính xác vùng được phép đổi.",["Đúng bề mặt được chỉ định","Toàn bộ chi tiết cùng hệ vật liệu","Cho phép xử lý các mép chuyển tiếp"]],
    ["substrate","Nền & lớp cấu tạo","Giữ vật liệu như một hệ có cấu tạo.",["Giữ nguyên nền và chiều dày","Giữ cấu tạo + xử lý lớp hoàn thiện","Cho phép thích nghi lớp nền tối thiểu"]],
    ["texture","Tỷ lệ & hướng texture","Kiểm soát scale và hướng vân/hoa văn.",["Giữ tỷ lệ texture thực tế","Ưu tiên hướng vân / vein","Tối ưu scale theo kích thước bề mặt"]],
    ["finish","Bề mặt & độ phản xạ","Kiểm soát roughness, sheen và chiều sâu.",["Giữ hoàn thiện tự nhiên","Tinh chỉnh độ mờ / bóng","Ưu tiên chiều sâu xúc giác"]],
    ["junction","Mối nối & chuyển tiếp","Xử lý cạnh, khe, góc và tiếp giáp.",["Giữ nguyên mối nối hiện có","Làm rõ khe / shadow gap","Cho phép tinh chỉnh chuyển tiếp tối thiểu"]]
  ],
  Lighting: [
    ["mood","Không khí ánh sáng","Xác định cảm xúc trước khi xử lý cường độ.",["Tự nhiên và cân bằng","Ấm, sâu và giàu tương phản","Tập trung, giàu tính trình diễn"]],
    ["source","Logic nguồn sáng","Phân vai cho daylight, architectural và decorative.",["Giữ nguồn sáng hiện có","Ưu tiên nguồn sáng chính","Cho phép bổ sung nguồn hợp lý"]],
    ["direction","Hướng & độ rơi","Kiểm soát hướng chiếu, falloff và softness.",["Giữ hướng sáng hiện tại","Tạo hướng sáng chủ đạo rõ","Ưu tiên ánh sáng mềm và chuyển sắc"]],
    ["contrast","Tương phản","Giữ hierarchy giữa sáng và tối.",["Tương phản tự nhiên","Tăng chiều sâu vùng sáng / tối","Tương phản nghệ thuật có kiểm soát"]],
    ["shadow","Bóng & phản xạ","Bảo đảm bóng, contact shadow và bounce hợp lý.",["Bảo toàn bóng vật lý","Làm rõ contact shadow","Ưu tiên chiều sâu bằng bóng và bounce"]]
  ],
  SpaceSync: [
    ["alignment","Trục & căn chỉnh","Đồng bộ các trục kiến trúc và đường chuẩn.",["Ưu tiên trục kiến trúc hiện hữu","Căn chỉnh đồ nội thất + kiến trúc","Cho phép tinh chỉnh nhẹ theo hệ trục"]],
    ["circulation","Lưu thông & khoảng thở","Bảo vệ đường đi và vùng sử dụng.",["Giữ nguyên lưu thông hiện tại","Tối ưu luồng di chuyển","Ưu tiên khoảng thở và chuyển tiếp"]],
    ["proportion","Tỷ lệ toàn không gian","Cân bằng đồ vật với thể tích phòng.",["Giữ tỷ lệ hiện hữu","Cân bằng theo thể tích phòng","Ưu tiên tỷ lệ con người + kiến trúc"]],
    ["sightline","Tầm nhìn & điểm nhấn","Điều phối thứ tự nhìn và các lớp không gian.",["Giữ sightline hiện tại","Tối ưu điểm nhìn chính","Tạo chuỗi nhìn xuyên không gian"]],
    ["continuity","Liên tục & nhịp điệu","Kết nối hình thức, vật liệu, ánh sáng và khoảng trống.",["Giữ ngôn ngữ hiện hữu","Tăng tính liên tục","Ưu tiên nhịp điệu và lặp có kiểm soát"]],
    ["hierarchy","Phân cấp thị giác","Xác định vai trò chính, phụ và nền.",["Giữ hierarchy hiện tại","Làm rõ điểm nhấn chính","Tối ưu hierarchy toàn cảnh"]]
  ],
  Camera: [
    ["view","Ý đồ khung hình","Xác định câu chuyện không gian trước khi đặt máy.",["Toàn cảnh không gian","Tập trung khu vực chính","Nhấn mạnh một chi tiết kiến trúc / nội thất"]],
    ["position","Vị trí máy","Xác định điểm đứng mà không thay đổi scene.",["Giữ vị trí máy gần hiện tại","Tối ưu vị trí để đọc không gian","Cho phép chọn góc mới"]],
    ["lens","Ống kính / FOV","Kiểm soát cảm giác rộng và độ trung thực.",["Giữ cảm giác tiêu cự hiện tại","FOV vừa đủ cho không gian","Ưu tiên perspective tự nhiên"]],
    ["height","Chiều cao máy","Liên hệ máy ảnh với tầm mắt và tỷ lệ kiến trúc.",["Giữ chiều cao hiện tại","Theo tầm mắt người","Ưu tiên kể chuyện kiến trúc"]],
    ["framing","Bố cục & phối cảnh","Kiểm soát foreground, subject, background và verticals.",["Giữ framing hiện tại","Tối ưu hierarchy trong khung","Ưu tiên verticals + chiều sâu"]]
  ]
};

const intentByMode = {
  Furniture: {
    hint: "Chỉ mô tả món đồ cần thay/chỉnh. Citterio suy luận tỷ lệ, công năng, lưu thông và cấu tạo.",
    placeholder: "Ví dụ: thay sofa hiện tại bằng đúng model cung cấp, giữ silhouette và cấu tạo, khớp tỷ lệ với không gian...",
    chips: ["giữ nguyên model cung cấp","giữ tỷ lệ và công thái học","giữ nguyên cấu tạo","chỉ thay đúng món đồ mục tiêu"]
  },
  Material: {
    hint: "Chỉ mô tả vật liệu cần thay. Zumthor suy luận boundary, texture, hoàn thiện và mối nối.",
    placeholder: "Ví dụ: đổi mặt cánh tủ sang veneer óc chó, giữ nguyên hình học, chiều dày, khe và cấu tạo...",
    chips: ["giữ nguyên hình học","texture đúng tỷ lệ","giữ mối nối","không đổi vật liệu ngoài vùng chọn"]
  },
  Lighting: {
    hint: "Chỉ mô tả ánh sáng mong muốn. Maurer suy luận nguồn, hướng, falloff, tương phản và bóng.",
    placeholder: "Ví dụ: tạo ánh sáng chiều ấm, giữ nguyên toàn bộ đèn và đồ nội thất, tăng chiều sâu bóng...",
    chips: ["giữ nguồn sáng","ánh sáng ấm","tăng chiều sâu bóng","không đổi vật liệu / đồ nội thất"]
  },
  SpaceSync: {
    hint: "Mô tả cách Ốc muốn toàn bộ không gian đồng bộ. Expert sẽ điều phối trục, tỷ lệ, lưu thông, tầm nhìn và hierarchy.",
    placeholder: "Ví dụ: đồng bộ sofa, bàn trà, đèn và vách theo trục kiến trúc, giữ lối đi và tạo hierarchy rõ...",
    chips: ["đồng bộ theo trục kiến trúc","giữ lưu thông","cân bằng tỷ lệ toàn không gian","giữ identity từng thành phần"]
  },
  Camera: {
    hint: "Chỉ mô tả góc nhìn. Baan suy luận vị trí, chiều cao, lens, framing và phối cảnh.",
    placeholder: "Ví dụ: lấy góc rộng vừa đủ để thấy sofa và cửa sổ, giữ nguyên vị trí mọi đồ vật...",
    chips: ["giữ vị trí đồ vật","perspective tự nhiên","giữ verticals","không staging lại không gian"]
  }
};

function setPreview(input, preview, placeholder, label) {
  if (!input) return;
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.classList.add("visible");
    placeholder?.classList.add("hidden");
    if (brainStatus) brainStatus.textContent = label + " đã tải";
  });
}
setPreview(sceneInput, scenePreview, scenePlaceholder, "Ảnh không gian");

function referenceMetaDefaults() {
  return {
    model: "Sofa",
    priority: "Giữ nguyên toàn bộ model cung cấp",
    preservation: "Bảo toàn 100% hình dáng và cấu tạo",
    views: "Nhiều góc nhìn của cùng một model",
    note: ""
  };
}

function renderReferenceGallery() {
  if (!referenceGallery) return;
  referenceGallery.innerHTML = "";
  referenceFiles.forEach((file, i) => {
    const meta = referenceMeta[i] || referenceMetaDefaults();
    referenceMeta[i] = meta;
    const card = document.createElement("div");
    card.className = "reference-thumb evidence-card";
    card.innerHTML = `
      <img src="${URL.createObjectURL(file)}" alt="Model cung cấp ${i + 1}">
      <span>${String(i + 1).padStart(2, "0")}</span>
      <button type="button" class="reference-remove" title="Xóa ảnh">×</button>
      <div class="evidence-details">
        <div class="evidence-row"><label>MODEL</label><select class="evidence-model">${referenceOptions.object.map(x => `<option${meta.model === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
        <div class="evidence-row"><label>ƯU TIÊN MODEL CUNG CẤP</label><select class="evidence-priority">${referenceOptions.priority.map(x => `<option${meta.priority === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
        <div class="evidence-row"><label>MỨC ĐỘ BẢO TOÀN</label><select class="evidence-preservation">${referenceOptions.preservation.map(x => `<option${meta.preservation === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
        <div class="evidence-row"><label>CHUẨN HÓA GÓC NHÌN</label><select class="evidence-views">${referenceOptions.views.map(x => `<option${meta.views === x ? " selected" : ""}>${x}</option>`).join("")}</select></div>
        <div class="evidence-row"><label>GHI CHÚ</label><input class="evidence-note" value="${meta.note || ""}" placeholder="Ghi chú riêng cho ảnh (tùy chọn)"></div>
      </div>`;
    card.querySelector(".reference-remove").addEventListener("click", e => {
      e.preventDefault();
      referenceFiles.splice(i, 1);
      referenceMeta.splice(i, 1);
      renderReferenceGallery();
    });
    const model = card.querySelector(".evidence-model");
    const priority = card.querySelector(".evidence-priority");
    const preservation = card.querySelector(".evidence-preservation");
    const views = card.querySelector(".evidence-views");
    const note = card.querySelector(".evidence-note");
    const save = () => {
      referenceMeta[i] = { model: model.value, priority: priority.value, preservation: preservation.value, views: views.value, note: note.value.trim() };
    };
    [model, priority, preservation, views, note].forEach(el => el.addEventListener("change", save));
    note.addEventListener("input", save);
    referenceGallery.appendChild(card);
  });
  referencePlaceholder?.classList.toggle("hidden", referenceFiles.length > 0);
  if (brainStatus) brainStatus.textContent = referenceFiles.length ? `Đã chuẩn bị ${referenceFiles.length} thẻ bằng chứng mẫu` : "Hệ thống sẵn sàng";
}

referenceTrigger?.addEventListener("click", () => referenceInput?.click());
referenceInput?.addEventListener("change", () => {
  Array.from(referenceInput.files || []).forEach(file => {
    referenceFiles.push(file);
    referenceMeta.push(referenceMetaDefaults());
  });
  referenceInput.value = "";
  renderReferenceGallery();
});

function renderSpaceSyncTargets() {
  if (syncTargetCount) syncTargetCount.textContent = syncTargetFiles.length + " ảnh";
  if (!syncTargetGallery) return;
  syncTargetGallery.innerHTML = syncTargetFiles.map((file, i) => {
    const url = URL.createObjectURL(file);
    const note = (syncTargetNotes[i] || "").replace(/"/g, "&quot;");
    return '<div class="sync-target-item">' +
      '<img src="' + url + '" alt="Ảnh cần đồng bộ ' + (i + 1) + '">' +
      '<div class="sync-target-meta"><strong>Ảnh ' + String(i + 1).padStart(2, "0") + '</strong>' +
      '<input type="text" data-sync-note="' + i + '" value="' + note + '" placeholder="Ghi chú riêng cho ảnh này (tuỳ chọn)"></div>' +
      '<button type="button" class="sync-remove" data-sync-remove="' + i + '" aria-label="Xóa ảnh">×</button></div>';
  }).join("");
  syncTargetGallery.querySelectorAll("[data-sync-note]").forEach(input => {
    input.addEventListener("input", () => { syncTargetNotes[Number(input.dataset.syncNote)] = input.value; });
  });
  syncTargetGallery.querySelectorAll("[data-sync-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.syncRemove);
      syncTargetFiles.splice(i, 1);
      syncTargetNotes.splice(i, 1);
      renderSpaceSyncTargets();
    });
  });
}

syncReferenceInput?.addEventListener("change", () => {
  syncReferenceFile = syncReferenceInput.files?.[0] || null;
  if (syncReferenceFile && syncReferencePreview) {
    syncReferencePreview.src = URL.createObjectURL(syncReferenceFile);
    syncReferencePreview.classList.add("visible");
    syncReferencePlaceholder?.classList.add("hidden");
  }
  syncReferenceInput.value = "";
});

syncTargetTrigger?.addEventListener("click", () => syncTargetInput?.click());
syncTargetInput?.addEventListener("change", () => {
  Array.from(syncTargetInput.files || []).forEach(file => {
    syncTargetFiles.push(file);
    syncTargetNotes.push("");
  });
  syncTargetInput.value = "";
  renderSpaceSyncTargets();
});

function selectedDecisions() {
  return Object.fromEntries([...decisionControls.querySelectorAll("[data-decision]")].map(el => [el.dataset.decision, el.value]));
}

function renderDecisions(mode) {
  const fields = decisions[mode] || [];
  const intent = intentByMode[mode];
  if (decisionTitle) decisionTitle.textContent = `Quyết định của Expert — ${mode === "SpaceSync" ? "Đồng bộ hóa không gian" : mode}`;
  if (decisionHint) decisionHint.textContent = intent.hint;
  decisionControls.innerHTML = fields.map(([key, label, hint, opts], i) => `
    <div class="decision-field">
      <span class="decision-index">${String(i + 1).padStart(2, "0")}</span>
      <label>${label}<small>${hint}</small></label>
      <select data-decision="${key}">
        ${opts.map((o, j) => `<option${j === 0 ? " selected" : ""}>${o}</option>`).join("")}
      </select>
    </div>`).join("");
  updateCount();
}

function updateCount() {
  const total = (decisions[currentMode] || []).length;
  const count = Object.values(selectedDecisions()).filter(Boolean).length;
  if (decisionCount) decisionCount.textContent = count + " / " + total;
}

function designIntent() {
  return {
    style: intentStyle?.value || "",
    lighting: intentLighting?.value || "",
    view: intentView?.value || "",
    camera: intentCamera?.value || ""
  };
}

function renderIntentPanel() {
  const intent = intentByMode[currentMode];
  const second = document.querySelector(".decision-intro .decision-step");
  const textarea = document.getElementById("brief");
  if (textarea) textarea.placeholder = intent.placeholder;
  const chips = document.querySelector(".chips");
  if (chips) chips.innerHTML = intent.chips.map(text => `<button type="button" data-fill="${text}">${text}</button>`).join("");
  chips?.querySelectorAll("[data-fill]").forEach(btn => btn.addEventListener("click", () => {
    const value = btn.dataset.fill;
    textarea.value = textarea.value.trim() ? textarea.value.trim() + ", " + value : value;
    textarea.focus();
  }));
  if (second) second.textContent = "02";
}

function renderExpert(mode) {
  const expert = expertFor(mode);
  if (expertName) expertName.textContent = expert.name;
  if (expertRole) expertRole.textContent = expert.role;
  if (expertSource) expertSource.textContent = expert.source;
  if (expertLabel) expertLabel.textContent = expert.label;
  if (expertScope) expertScope.textContent = expert.scope;
  if (expertProtocol) expertProtocol.innerHTML = expert.protocol.map((x, i) => `<div class="protocol-step"><span>${String(i + 1).padStart(2, "0")}</span><p>${x}</p></div>`).join("");
  if (expertLocks) expertLocks.innerHTML = expert.lockedDomains.map(x => `<span>${x}</span>`).join("");
}

function renderAITargets() {
  document.querySelectorAll(".ai-target-option").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.aiTarget === selectedAITarget);
  });
}

document.querySelectorAll(".ai-target-option").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedAITarget = btn.dataset.aiTarget || "ChatGPT Images";
    renderAITargets();
    if (brainStatus) brainStatus.textContent = `Đầu ra: ${selectedAITarget}`;
  });
});

function renderMode(mode) {
  if (spaceSyncPanel) spaceSyncPanel.classList.toggle("hidden", mode !== "SpaceSync");
  currentMode = mode;
  document.querySelectorAll(".mode-card").forEach(card => card.classList.toggle("active", card.dataset.mode === mode));
  renderExpert(mode);
  renderDecisions(mode);
  renderIntentPanel();
  if (resultText) resultText.textContent = `Ảnh không gian + yêu cầu + quyết định ${mode} → tạo yêu cầu AI, không tạo ảnh.`;
  if (brainStatus) brainStatus.textContent = `${expertFor(mode).name} đang hoạt động độc lập`;
}

document.querySelectorAll(".mode-card").forEach(card => {
  card.addEventListener("click", () => renderMode(card.dataset.mode));
});

decisionControls?.addEventListener("change", updateCount);

document.getElementById("newProject")?.addEventListener("click", () => {
  currentMode = "Furniture";
  selectedAITarget = "ChatGPT Images";
  renderAITargets();
  referenceFiles = [];
  referenceMeta = [];
  syncReferenceFile = null;
  syncTargetFiles = [];
  syncTargetNotes = [];
  if (syncReferencePreview) { syncReferencePreview.src = ""; syncReferencePreview.classList.remove("visible"); }
  syncReferencePlaceholder?.classList.remove("hidden");
  renderSpaceSyncTargets();
  if (sceneInput) sceneInput.value = "";
  if (referenceInput) referenceInput.value = "";
  if (scenePreview) { scenePreview.src = ""; scenePreview.classList.remove("visible"); }
  scenePlaceholder?.classList.remove("hidden");
  renderReferenceGallery();
  if (brief) brief.value = "";
  result?.classList.add("hidden");
  renderAITargets();
renderMode("Furniture");
  if (brainStatus) brainStatus.textContent = "Hệ thống sẵn sàng";
});

document.getElementById("generate")?.addEventListener("click", () => {
  const expert = expertFor(currentMode);
  const decisionsNow = selectedDecisions();
  const firstModel = referenceMeta[0]?.model || "selected furniture";
  const target = currentMode === "Furniture"
    ? firstModel
    : currentMode === "Material"
      ? "selected material surface"
      : currentMode === "Lighting"
        ? "selected lighting system"
        : currentMode === "Camera"
          ? "selected camera view"
          : "selected spatial system";
  const model = currentMode === "Furniture" ? (referenceMeta[0] || {}) : {};
  const referenceRoles = referenceMeta.map((m, i) => `Image ${i + 1}: ${m.model}; priority=${m.priority}; preservation=${m.preservation}; views=${m.views}; note=${m.note || "none"}`).join(" | ");
  const params = { ...designIntent() };
  const output = "production prompt";
  const camera = {};
  const replacement = brief?.value?.trim() || "";
  try {
    if (currentMode === "SpaceSync" && syncTargetFiles.length) {
      if (!syncReferenceFile) {
        throw new Error("Đồng bộ hóa không gian cần 1 ảnh tham chiếu cố định.");
      }
      const prompts = syncTargetFiles.map((file, index) => {
        const note = syncTargetNotes[index]?.trim() || "Không có ghi chú riêng.";
        const syncBrief = [
          "ẢNH THAM CHIẾU CỐ ĐỊNH: " + syncReferenceFile.name,
          "ẢNH CẦN ĐỒNG BỘ: " + file.name,
          "ĐÂY LÀ NHIỆM VỤ ĐỘC LẬP SỐ " + (index + 1) + "/" + syncTargetFiles.length + ".",
          "Chỉ tạo yêu cầu cho ảnh đích này; không sao chép prompt của ảnh đích khác.",
          "GHI CHÚ RIÊNG: " + note,
          replacement ? "YÊU CẦU CHUNG: " + replacement : ""
        ].filter(Boolean).join("\n");
        return buildDirection({
          brief: syncBrief,
          mode: "SpaceSync",
          output,
          camera,
          target: "Ảnh cần đồng bộ " + (index + 1),
          replacement: syncBrief,
          params,
          decisions: decisionsNow,
          model: {},
          referenceRoles: "Ảnh tham chiếu cố định: " + syncReferenceFile.name + " | Ảnh đích riêng: " + file.name + " | Nhiệm vụ " + (index + 1) + "/" + syncTargetFiles.length,
          aiTarget: selectedAITarget,
          aiProfile: aiTargetProfiles[selectedAITarget] || aiTargetProfiles["Khác"]
        }).prompt;
      });
      if (resultContent) resultContent.textContent = prompts.map((prompt, i) =>
        "════════════════════════════════════════\n" +
        "PROMPT " + String(i + 1).padStart(2, "0") + " — ẢNH CẦN ĐỒNG BỘ: " + syncTargetFiles[i].name + "\n" +
        "════════════════════════════════════════\n" + prompt
      ).join("\n\n");
      if (reasoningSummary) reasoningSummary.innerHTML =
        "<div><b>ĐỒNG BỘ HÓA KHÔNG GIAN</b><span>4 Expert được tổng hợp cho từng ảnh đích.</span></div>" +
        "<div><b>" + syncTargetFiles.length + " prompt riêng</b><span>Mỗi ảnh đích có một yêu cầu độc lập, không dùng lại nguyên prompt của ảnh khác.</span></div>" +
        "<div><b>" + selectedAITarget + "</b><span>Định dạng theo nền tảng AI đã chọn.</span></div>";
      result?.classList.remove("hidden");
      result?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (brainStatus) brainStatus.textContent = "Đã tạo " + prompts.length + " prompt đồng bộ riêng";
      return;
    }
    if (currentMode === "SpaceSync" && !syncTargetFiles.length) {
      throw new Error("Hãy thêm ít nhất 1 ảnh cần đồng bộ.");
    }
    const built = buildDirection({
      brief: brief?.value || "",
      mode: currentMode,
      output,
      camera,
      target,
      replacement,
      params,
      decisions: decisionsNow,
      model,
      referenceRoles,
      aiTarget: selectedAITarget,
      aiProfile: aiTargetProfiles[selectedAITarget] || aiTargetProfiles["Khác"]
    });
    if (resultContent) resultContent.textContent = built.prompt;
    if (reasoningSummary) reasoningSummary.innerHTML = `
      <div><b>${built.reasoning.expert}</b><span>${built.reasoning.expertRole}</span></div>
      <div><b>${built.reasoning.independence}</b><span>Không suy luận chéo sang expert khác.</span></div>
      <div><b>${selectedAITarget}</b><span>Yêu cầu AI được định hình cho nền tảng đã chọn.</span></div>
      <div><b>${Object.keys(decisionsNow).length} quyết định</b><span>Được áp dụng trực tiếp vào yêu cầu AI hoàn chỉnh.</span></div>`;
    result?.classList.remove("hidden");
    result?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (brainStatus) brainStatus.textContent = `${expert.name} đã xây dựng yêu cầu AI`;
  } catch (error) {
    console.error("[HOANGGIA AI] Lỗi tạo yêu cầu:", error);
    const message = error instanceof Error ? error.message : String(error || "Lỗi không xác định");
    if (brainStatus) brainStatus.textContent = "Có lỗi khi xây dựng yêu cầu AI";
    if (resultContent) resultContent.textContent = "Không thể tạo yêu cầu AI.\n\nChi tiết: " + message;
    result?.classList.remove("hidden");
  }
});

document.getElementById("copy")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(resultContent?.textContent || "");
    const copyButton = document.getElementById("copy");
    if (copyButton) {
      copyButton.textContent = "✓ Đã sao chép";
      setTimeout(() => { copyButton.textContent = "Sao chép yêu cầu AI"; }, 1600);
    }
    if (brainStatus) brainStatus.textContent = "Đã sao chép yêu cầu AI";
  } catch {
    if (brainStatus) brainStatus.textContent = "Không thể sao chép tự động";
  }
});

renderMode("Furniture");
