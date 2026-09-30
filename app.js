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

let currentMode = "Furniture";

const targetSets = {
  Furniture: ["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Đèn","Khác"],
  Material: ["Sofa","Armchair / ghế đơn","Bàn trà","Bàn ăn","Ghế ăn","Giường","Tủ / kệ","Tường","Sàn","Trần","Đá / mặt bàn","Gỗ / veneer","Da / vải","Kim loại","Khác"],
  Lighting: ["Toàn cảnh","Đèn trần","Đèn hắt","Đèn trang trí","Ánh sáng tự nhiên","Vùng ánh sáng","Khác"],
  Camera: ["Toàn cảnh","Góc sofa","Góc bàn ăn","Góc phòng","Cận vật liệu","Góc mới theo yêu cầu"]
};

const hints = {
  Furniture: "Phân tích cấu tạo, tỷ lệ, vị trí, vật liệu và độ hòa nhập của món đồ.",
  Material: "Khóa hình học và chỉ thay finish/material trên đúng bề mặt được yêu cầu.",
  Lighting: "Thay mood, hướng sáng, nhiệt độ màu, highlight, shadow và ambient bounce.",
  Camera: "Thay viewpoint, framing, lens feel và perspective mà không redesign không gian."
};

function setPreview(input, preview, placeholder, label) {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.classList.add("visible");
    placeholder.classList.add("hidden");
    brainStatus.textContent = label + " loaded";
  });
}
setPreview(sceneInput, scenePreview, scenePlaceholder, "Scene image");
setPreview(referenceInput, referencePreview, referencePlaceholder, "Reference image");

function populateTargets(mode) {
  targetSelect.innerHTML = targetSets[mode].map(x => "<option>" + x + "</option>").join("");
  targetLabel.textContent = mode === "Furniture" ? "Furniture target" : mode === "Material" ? "Material / surface target" : mode === "Lighting" ? "Lighting target" : "Camera target";
  referencePriority.parentElement.style.display = mode === "Furniture" ? "" : "none";
  referenceInput.closest(".upload-panel").querySelector("h2").textContent =
    mode === "Furniture" ? "Ảnh mẫu nội thất" : mode === "Material" ? "Ảnh mẫu vật liệu" : mode === "Lighting" ? "Ảnh tham chiếu ánh sáng" : "Ảnh tham chiếu góc nhìn";
  resultText.textContent = hints[mode];
}

document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mode]").forEach(x => x.classList.remove("active"));
    button.classList.add("active");
    currentMode = button.dataset.mode;
    populateTargets(currentMode);
    brainStatus.textContent = currentMode + " engine selected";
  });
});

document.querySelectorAll("[data-fill]").forEach(button => {
  button.addEventListener("click", () => {
    brief.value = (brief.value ? brief.value + " " : "") + button.dataset.fill;
    brief.focus();
  });
});

document.getElementById("generate").addEventListener("click", () => {
  const target = targetSelect.value;
  const userBrief = brief.value.trim();

  if (!sceneInput.files?.[0]) {
    resultText.textContent = "Hãy tải ảnh không gian để làm ảnh nền tham chiếu.";
    brainStatus.textContent = "Waiting for base image";
    return;
  }

  if (!userBrief) {
    brief.focus();
    resultText.textContent = "Hãy mô tả thay đổi bạn muốn thực hiện.";
    brainStatus.textContent = "Waiting for edit direction";
    return;
  }

  if (currentMode === "Furniture" && !referenceInput.files?.[0]) {
    resultText.textContent = "Với thay đồ nội thất, hãy tải thêm ảnh mẫu B để Reference Intelligence bám đúng thiết kế.";
    brainStatus.textContent = "Waiting for furniture reference";
    return;
  }

  const priority = referencePriority.value;
  const modeData = editModeDirection(currentMode, target, userBrief);

  const data = {
    brief: [
      "BASE IMAGE: provided interior image.",
      currentMode === "Furniture" ? "REFERENCE IMAGE B: provided furniture reference image." : "REFERENCE IMAGE: optional visual reference.",
      modeData.instruction,
      "Target: " + target,
      currentMode === "Furniture" ? "Reference priority: " + priority : "",
      userBrief
    ].filter(Boolean).join(" "),
    mode: "Furniture replacement",
    output: "Photorealistic",
    camera: currentMode === "Camera" ? userBrief : "Preserve original camera",
    target,
    replacement: currentMode === "Furniture" ? "Use Reference B as the primary furniture design reference." : userBrief
  };

  const { analysis, prompt } = buildDirection(data);

  const extra = [
    "HOANGGIA AI — " + modeData.label.toUpperCase(),
    "",
    "EDIT SCOPE",
    "• " + modeData.instruction,
    ...modeData.safeguards.map(x => "• " + x),
    "",
    "REFERENCE INTELLIGENCE",
    currentMode === "Furniture"
      ? "• Scene A controls space, camera, lighting context and non-target objects. Reference B controls furniture identity."
      : "• Use the reference image only as visual guidance for the requested change; do not copy unrelated background elements.",
    "• Preserve everything outside the requested edit scope.",
    "",
    "OUTPUT",
    "• Return a production-ready image-editing prompt only.",
    "• Do not generate the image.",
    "• Do not invent unrelated design changes."
  ].join("\n");

  resultContent.textContent = extra + "\n\n" + prompt;
  result.classList.remove("hidden");
  brainStatus.textContent = modeData.label + " prompt ready";
  resultText.textContent = "Đã tạo prompt cho: " + modeData.label + ".";
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultContent.textContent);
  document.getElementById("copy").textContent = "Copied ✓";
  setTimeout(() => document.getElementById("copy").textContent = "Copy prompt", 1200);
});

document.getElementById("newProject").addEventListener("click", () => {
  brief.value = "";
  sceneInput.value = "";
  referenceInput.value = "";
  scenePreview.src = "";
  referencePreview.src = "";
  scenePreview.classList.remove("visible");
  referencePreview.classList.remove("visible");
  scenePlaceholder.classList.remove("hidden");
  referencePlaceholder.classList.remove("hidden");
  result.classList.add("hidden");
  brainStatus.textContent = "Reference engine ready";
  populateTargets("Furniture");
  document.querySelectorAll("[data-mode]").forEach(x => x.classList.toggle("active", x.dataset.mode === "Furniture"));
  currentMode = "Furniture";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

populateTargets("Furniture");
