import { buildDirection } from "./core/prompt-engine.js";

const brief = document.getElementById("brief");
const result = document.getElementById("result");
const resultContent = document.getElementById("resultContent");
const resultText = document.getElementById("resultText");
const brainStatus = document.getElementById("brainStatus");

document.querySelectorAll("[data-fill]").forEach(button => {
  button.addEventListener("click", () => {
    brief.value = (brief.value ? brief.value + " " : "") + button.dataset.fill;
    brief.focus();
  });
});

document.getElementById("generate").addEventListener("click", () => {
  const data = {
    brief: brief.value.trim() || "Không gian nội thất cao cấp",
    mode: document.getElementById("mode").value,
    output: document.getElementById("output").value,
    camera: document.getElementById("camera").value
  };
  const { analysis, prompt } = buildDirection(data);

  resultContent.textContent = prompt;
  result.classList.remove("hidden");
  brainStatus.textContent = "Brain analysis complete";
  resultText.textContent = [
    "Đã phân tích công năng, tỷ lệ, vật liệu, ánh sáng, camera và tính khả thi.",
    "Output hiện là production prompt có cấu trúc; AI image backend sẽ được nối ở lớp tiếp theo."
  ].join(" ");
  result.dataset.analysis = JSON.stringify(analysis);
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.getElementById("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(resultContent.textContent);
  document.getElementById("copy").textContent = "Copied ✓";
  setTimeout(() => document.getElementById("copy").textContent = "Copy direction", 1200);
});

document.getElementById("newProject").addEventListener("click", () => {
  brief.value = "";
  result.classList.add("hidden");
  brainStatus.textContent = "Brain ready";
  window.scrollTo({ top: 0, behavior: "smooth" });
  brief.focus();
});