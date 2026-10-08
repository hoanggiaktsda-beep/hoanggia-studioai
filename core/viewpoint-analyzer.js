// EXPERT độc lập: phân tích góc nhìn trước khi thay nội thất.
// Chỉ tạo chỉ dẫn; không đo kích thước từ pixel, không sửa tỷ lệ sản phẩm.
export function viewpointAnalysisPrompt({hasReference=false}={}) {
  if (!hasReference) return "";
  return [
    "EXPERT VIEWPOINT ANALYZER — CHẠY TRƯỚC KHI THAY SẢN PHẨM.",
    "GIAI ĐOẠN 1 / ẢNH KHÔNG GIAN: Xác định hướng camera, đường chân trời/điểm tụ nếu có đủ chứng cứ, hướng trục dài–rộng của vật thể cũ và mặt phẳng tiếp xúc sàn. Không suy đoán kích thước tuyệt đối từ ảnh.",
    "GIAI ĐOẠN 2 / ẢNH MODEL: Coi toàn bộ ảnh sản phẩm là các góc của MỘT model. Đối chiếu mặt trước, mặt bên, mặt 3/4, cấu tạo chân, giao điểm, khoảng rỗng và phần bị che. Góc ảnh tham chiếu không phải góc cần xuất.",
    "GIAI ĐOẠN 3 / ĐỊNH HƯỚNG: Ánh xạ trục dài–rộng–cao của model sang trục tương ứng trong ảnh không gian, rồi xác định hình chiếu hợp lý của cấu tạo theo camera đích. Hình học giữ nguyên dù các chi tiết chồng hình hoặc bị che.",
    "GIAI ĐOẠN 4 / BÀN GIAO: Chỉ sau khi phân tích góc nhìn mới thực hiện thay thế. Giữ tỷ lệ model đã xác nhận; giữ vị trí tâm và tiếp xúc sàn hợp lý, KHÔNG kéo giãn để lấp đầy đồ cũ.",
    "KIỂM TRA: Không biến chân cong có lỗ rỗng thành chân trụ đặc; không sao chép nguyên hình chiếu 2D của ảnh model. Nếu ảnh không đủ chứng cứ, không bịa cấu tạo hoặc khẳng định góc xoay chính xác."
  ].join("\n");
}
