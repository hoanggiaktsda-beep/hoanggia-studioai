// Presentation-only friction. This is NOT a security boundary:
// visible prompts and client-side engines remain accessible in developer tools.
// True protection requires server-side generation and authenticated access.
export function installPromptCopyGuard({ output, copyButton, status }) {
  if (!output) return;
  output.classList.add("prompt-copy-guard");
  output.setAttribute("aria-label", "Kết quả prompt (chế độ hạn chế sao chép)");
  if (copyButton) {
    copyButton.hidden = true;
    copyButton.disabled = true;
    copyButton.setAttribute("aria-hidden", "true");
  }
  const notice = document.createElement("p");
  notice.className = "prompt-protection-notice";
  notice.textContent = "🔒 Chế độ bảo vệ: hạn chế chọn, sao chép và tải prompt. Đây không phải mã hóa bảo mật; nội dung hiển thị vẫn có thể được ghi lại.";
  output.parentNode.insertBefore(notice, output);
  const isInside = target => target === output || output.contains(target);
  output.addEventListener("contextmenu", e => e.preventDefault());
  output.addEventListener("dragstart", e => e.preventDefault());
  output.addEventListener("selectstart", e => e.preventDefault());
  output.addEventListener("copy", e => e.preventDefault());
  output.addEventListener("cut", e => e.preventDefault());
  document.addEventListener("copy", e => {
    const selection = document.getSelection();
    if (document.activeElement === output || (selection && selection.anchorNode && isInside(selection.anchorNode.parentElement))) e.preventDefault();
  });
  output.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && ["a", "c", "x", "s", "p"].includes(e.key.toLowerCase())) {
      e.preventDefault();
      if (status) status.textContent = "Chế độ bảo vệ đang hạn chế sao chép prompt.";
    }
  });
}
