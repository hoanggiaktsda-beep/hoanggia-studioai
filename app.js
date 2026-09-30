import { buildDirection } from "./core/prompt-engine.js";

const brief = document.getElementById("brief");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resultText = document.getElementById("resultText");
const brainStatus = document.getElementById("brainStatus");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const targetSelect = document.getElementById("target");
const replacementSelect = document.getElementById("replacement");

const targetHints = {
  "Sofa": "Tập trung vào số chỗ ngồi, tỷ lệ thân sofa, tay vịn, lưng, đệm, chân/đế và khoảng cách tới bàn trà.",
  "Armchair / ghế đơn": "Tập trung vào tỷ lệ ngồi, lưng ghế, tay vịn, chân/đế và quan hệ giữa phần gỗ/kim loại với phần bọc.",
  "Bàn trà": "Tập trung vào kích thước mặt bàn, chiều cao, độ dày mặt, cạnh, chân/đế và khoảng cách với sofa.",
  "Bàn ăn": "Tập trung vào kích thước mặt bàn, chiều cao, chân/đế và số lượng ghế có thể bố trí.",
  "Ghế ăn": "Tập trung vào chiều cao mặt ngồi, lưng ghế, chân và quan hệ tỷ lệ với bàn ăn.",
  "Giường": "Tập trung vào kích thước đệm, đầu giường, khung giường, chân/đế và khoảng cách hai bên.",
  "Tủ / kệ": "Tập trung vào module, cánh/ngăn kéo, chiều sâu, cao độ, chân/đế và giao tiếp với tường.",
  "Đèn": "Tập trung vào loại đèn, kích thước, vị trí treo/đặt, cấu tạo và hướng phát sáng.",
  "Khác": "Tập trung vào silhouette, tỷ lệ, công năng, cấu tạo và điểm nhận diện của món đồ."
};

document.querySelectorAll("[data-fill]").forEach(button => {
  button.addEventListener("click", () => {
    brief.value = (brief.value ? brief.value + " " : "") + button.dataset.fill;
    brief.focus();
  });
});

targetSelect.addEventListener("change", () => {
  const hint = targetHints[targetSelect.value] || targetHints["Khác"];
  resultText.textContent = hint;
  brainStatus.textContent = targetSelect.value + " engine selected";
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
  const target = targetSelect.value;
  const replacement = replacementSelect.value;
  const userBrief = brief.value.trim();

  if (!userBrief) {
    brief.focus();
    resultText.textContent = "Hãy mô tả món đồ mới để Furniture Engine có đủ dữ liệu tạo prompt.";
    brainStatus.textContent = "Waiting for furniture direction";
    return;
  }

  const data = {
    brief: [
      "EDIT FURNITURE IN THE PROVIDED INTERIOR IMAGE.",
      "Target furniture: " + target,
      "Replacement direction: " + replacement,
      userBrief
    ].filter(Boolean).join(" "),
    mode: "Furniture replacement",
    output: "Photorealistic",
    camera: "Preserve original camera",
    target,
    replacement
  };

  const { analysis, prompt } = buildDirection(data);
  resultContent.textContent = prompt;
  result.classList.remove("hidden");
  brainStatus.textContent = target + " replacement prompt ready";
  resultText.textContent = "Furniture Engine đã áp dụng bộ quy tắc riêng cho " + target + ".";
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
  resultText.textContent = "Ảnh + target + mô tả → tạo chỉ dẫn chỉnh sửa.";
  window.scrollTo({ top: 0, behavior: "smooth" });
});
