export function cameraDirection(analysis, camera) {
  const presets = {
    "Preserve original camera": "LOCK original camera, lens feel, framing, perspective and major vanishing points.",
    "Eye level": "Eye-level architectural camera; natural perspective; avoid exaggerated wide-angle distortion.",
    "Wide architectural": "Moderately wide architectural lens; preserve verticals and spatial proportions; no fisheye distortion.",
    "Close material detail": "Controlled close-up focused on material, joinery and tactile detail with shallow but believable depth."
  };
  return presets[camera] || analysis.camera;
}


export function buildIndependentCameraPrompt(opts = {}) {
  const referenceName = opts.referenceName || "";
  const targetName = opts.targetName || "";
  if (!referenceName) throw new Error("EXPERT 04 cần ảnh góc máy tham chiếu.");
  if (!targetName) throw new Error("EXPERT 04 cần ảnh nhận tham chiếu.");
  const keep = (opts.preserve || "").trim() || "Kiến trúc · nội thất · vật liệu · ánh sáng · tỷ lệ vật thể";
  const change = (opts.change || "").trim() || "Chỉ góc máy theo ảnh tham chiếu";
  return ["EXPERT 04 — GÓC MÁY","Ảnh góc máy tham chiếu: " + referenceName,"Ảnh nhận: " + targetName,"GIỮ NGUYÊN: " + keep + ".","CHỈ THAY: " + change + ".","Đọc từ ảnh tham chiếu: vị trí máy, cao độ, hướng nhìn, phối cảnh, tiêu cự/FOV, framing, trục nhìn và quan hệ tiền cảnh–trung cảnh–hậu cảnh.","Không sao chép kiến trúc, nội thất, vật liệu, ánh sáng, vật thể hoặc nhân vật từ ảnh góc máy tham chiếu.",opts.targetAnalysis ? "GHI CHÚ: " + opts.targetAnalysis : "",opts.brief ? "YÊU CẦU: " + opts.brief : "","Kết quả phải giữ đúng không gian ảnh nhận; chỉ tái dựng cách quan sát theo camera tham chiếu, không làm biến dạng hình học.","Đầu ra: " + (opts.aiTarget || "ChatGPT Images")].filter(Boolean).join("\n");
}
