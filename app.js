import { buildDirection } from "./core/prompt-engine.js";

const brief = document.getElementById("brief");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resultText = document.getElementById("resultText");
const brainStatus = document.getElementById("brainStatus");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const imagePlaceholder = document.getElementById("imagePlaceholder");

document.querySelectorAll("[data-fill]").forEach(button => {
  button.addEventListener("click", () => {
    brief.value = (brief.value ? brief.value + " " : "") + button.dataset.fill;
    brief.focus();
  });
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  imagePreview.src = url;
  imagePreview.classList.add("visible");
  imagePlaceholder.classList.add("hidden");
  brainStatus.textContent = "Reference image loaded";
});

document.getElementById("generate").addEventListener("click", () => {
  const target = document.getElementById("target").value;
  const replacement = document.getElementById("replacement").value;
  const data = {
    brief: [
      "EDIT FURNITURE IN THE PROVIDED INTERIOR IMAGE.",
      "Target furniture: " + target,
      "Replacement direction: " + replacement,
      brief.value.trim()
    ].filter(Boolean).join(" "),
    mode: "Furniture replacement",
    output: "Photorealistic",
    camera: "Preserve original camera"
  };

  const { analysis, prompt } = buildDirection(data);
  const finalPrompt = [
    "HOANGGIA AI — FURNITURE REPLACEMENT PROMPT",
    "",
    prompt,
    "",
    "IMAGE EDITING RULES",
    "• Keep the room architecture unchanged.",
    "• Keep walls, floor, ceiling, windows, doors and built-in elements unchanged.",
    "• Keep the original camera angle, framing, perspective and image proportions.",
    "• Replace only the selected furniture.",
    "• Match the replacement furniture to the original scale, floor contact, perspective, shadows and lighting.",
    "• Do not redesign the room or add unrelated furniture.",
    "• Preserve every non-target object unless explicitly requested.",
    "• The replacement must look physically present, not pasted or floating."
  ].join("\n");

  resultContent.textContent = finalPrompt;
  result.classList.remove("hidden");
  brainStatus.textContent = "Furniture edit direction ready";
  resultText.textContent = "Đã khóa kiến trúc + camera và tập trung toàn bộ suy luận vào việc thay đổi đồ nội thất.";
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
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.classList.remove("visible");
  imagePlaceholder.classList.remove("hidden");
  result.classList.add("hidden");
  brainStatus.textContent = "Furniture editor ready";
  window.scrollTo({ top: 0, behavior: "smooth" });
});