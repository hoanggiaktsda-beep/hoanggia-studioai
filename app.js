import { buildDirection } from "./core/prompt-engine.js";

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
const referencePriority = document.getElementById("referencePriority");

const targetHints = {
  "Sofa": "seat count, overall proportions, back, arms, cushions, base and upholstery construction",
  "Armchair / ghế đơn": "seat proportions, back, arms, base/legs and relationship between upholstery and exposed structure",
  "Bàn trà": "top dimensions, height, thickness, edge profile, base and distance to sofa",
  "Bàn ăn": "table dimensions, height, top thickness, base and seating capacity",
  "Ghế ăn": "seat height, back, legs and relationship to the dining table",
  "Giường": "mattress size, headboard, frame, base and bedside clearances",
  "Tủ / kệ": "modules, doors, drawers, depth, height, base and wall relationship",
  "Đèn": "fixture type, scale, mounting, construction and light direction",
  "Khác": "silhouette, proportions, function, construction and distinctive details"
};

function setupPreview(input, preview, placeholder, label) {
  input.addEventListener("change", () => {
    const file = input.files?.[0];
    if (!file) return;
    preview.src = URL.createObjectURL(file);
    preview.classList.add("visible");
    placeholder.classList.add("hidden");
    brainStatus.textContent = label + " loaded";
  });
}
setupPreview(sceneInput, scenePreview, scenePlaceholder, "Scene image");
setupPreview(referenceInput, referencePreview, referencePlaceholder, "Furniture reference");

document.querySelectorAll("[data-fill]").forEach(button => {
  button.addEventListener("click", () => {
    brief.value = (brief.value ? brief.value + " " : "") + button.dataset.fill;
    brief.focus();
  });
});

targetSelect.addEventListener("change", () => {
  resultText.textContent = targetHints[targetSelect.value] || targetHints["Khác"];
  brainStatus.textContent = targetSelect.value + " reference engine selected";
});

document.getElementById("generate").addEventListener("click", () => {
  const target = targetSelect.value;
  const priority = referencePriority.value;
  const userBrief = brief.value.trim();

  if (!sceneInput.files?.[0] || !referenceInput.files?.[0]) {
    resultText.textContent = "Hãy tải đủ 2 ảnh: không gian A và mẫu nội thất B.";
    brainStatus.textContent = "Waiting for scene + furniture reference";
    return;
  }

  if (!userBrief) {
    brief.focus();
    resultText.textContent = "Hãy thêm yêu cầu để Reference Intelligence biết chính xác cách đưa mẫu B vào không gian A.";
    brainStatus.textContent = "Waiting for replacement direction";
    return;
  }

  const data = {
    brief: [
      "SCENE A: provided interior image.",
      "REFERENCE B: provided furniture reference image.",
      "EDIT TASK: replace the existing target furniture in Scene A with the furniture shown in Reference B.",
      "Target furniture: " + target,
      "Reference priority: " + priority,
      userBrief
    ].join(" "),
    mode: "Furniture replacement",
    output: "Photorealistic",
    camera: "Preserve original camera",
    target,
    replacement: "Use Reference B as the primary furniture design reference."
  };

  const { analysis, prompt } = buildDirection(data);

  const finalPrompt = [
    prompt,
    "",
    "REFERENCE INTELLIGENCE — A + B RELATIONSHIP",
    "• Scene A is the environment authority: preserve its architecture, camera, perspective, lighting context and all non-target objects.",
    "• Reference B is the furniture authority: reproduce the target furniture's silhouette, proportions, construction language, materials, color and distinctive details.",
    "• Transfer the furniture from B into the target furniture position in A; do not transfer B's background, floor, walls, props or camera.",
    "• Adapt only the physical scale and orientation required for a believable fit in Scene A, without redesigning the reference furniture.",
    "• Resolve occlusion, floor contact, perspective, shadows and ambient light so the furniture belongs naturally to Scene A.",
    "• If Scene A and Reference B conflict, preserve Scene A's spatial context and preserve Reference B's furniture identity.",
    "",
    "OUTPUT INTENT",
    "Create a production-ready image-editing prompt only. Do not generate the image. Do not describe unrelated design alternatives."
  ].join("\n");

  resultContent.textContent = finalPrompt;
  result.classList.remove("hidden");
  brainStatus.textContent = "A + B reference prompt ready";
  resultText.textContent = "Đã liên kết không gian A với mẫu nội thất B. Chỉ xuất prompt.";
  result.dataset.analysis = JSON.stringify(analysis);
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
  resultText.textContent = "Ảnh A + mẫu B + target → tạo prompt thay đồ, không tạo ảnh.";
  window.scrollTo({ top: 0, behavior: "smooth" });
});
