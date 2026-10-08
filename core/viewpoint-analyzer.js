// EXPERT VIEWPOINT ANALYZER — bước suy luận hình học 3D trước khi thay nội thất.
// Chỉ bổ sung chỉ dẫn cho prompt, không tạo file CAD/mesh 3D thật và không sửa tỷ lệ model.
export function viewpointAnalysisPrompt({hasReference=false}={}) {
  if (!hasReference) return "";
  return [
    "EXPERT VIEWPOINT ANALYZER — THỰC HIỆN THEO ĐÚNG THỨ TỰ TRƯỚC KHI THAY SẢN PHẨM.",
    "BƯỚC 1 / ĐỌC ẢNH THAM CHIẾU 2D: Coi 2–3 ảnh (nếu có) là các góc nhìn của MỘT sản phẩm. Nhận diện mặt trước, bên, 3/4, kích thước ghi rõ, vật liệu, đường biên, chân đỡ, giao điểm và các khoảng rỗng. Không suy kích thước tuyệt đối từ pixel.",
    "BƯỚC 2 / SUY LUẬN HÌNH HỌC 3D: Thiết lập hệ trục X–Y–Z (dài–rộng–cao), cấu trúc không gian tương đối của mặt, chân, các dải cong, vị trí giao nhau, độ sâu và các vùng bị che. Phân biệt đặc điểm XÁC NHẬN qua ảnh với đặc điểm SUY LUẬN; không bịa phần khuất. Không nhầm hình chiếu chữ X 2D với một tấm phẳng.",
    "BƯỚC 3 / PHÂN TÍCH CAMERA ĐÍCH: Xác định trục dài–rộng vật cũ, hướng nhìn, điểm tụ nếu có bằng chứng, mặt sàn và che khuất. Xoay TOÀN BỘ mô hình 3D tương đối vào cùng hệ trục ảnh không gian rồi tính hình chiếu theo góc camera; không xoay riêng phần chân hoặc ép mặt chính diện hướng về camera.",
    "BƯỚC 4 / THAY SẢN PHẨM: Chỉ sau ba bước trên mới đưa model vào ảnh. Bảo toàn tỷ lệ dài:rộng:cao theo kích thước đã xác nhận, không kéo giãn để lấp đầy đồ cũ. Giữ tâm/vị trí và tiếp xúc sàn hợp lý; bảo toàn kiến trúc, camera và đồ không thuộc mục tiêu.",
    "KIỂM TRA HÌNH CHIẾU: Với camera nhìn dọc trục dài của bàn, hình chiếu chân có thể thu hẹp, chồng lấp và che khuất; không được giữ nguyên chữ X rộng của ảnh chụp ngang, biến chân cong rỗng thành khối đặc hoặc tự tạo hình học không có chứng cứ.",
    "GIỚI HẠN: Đây là suy luận hình học 3D tương đối từ ảnh 2D, không phải phép tái dựng mesh 3D chính xác. Khi thiếu góc nhìn, giữ bất định thay vì khẳng định độ chính xác tuyệt đối."
  ].join("\n");
}
