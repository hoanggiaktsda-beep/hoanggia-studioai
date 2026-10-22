# BỘ KỸ NĂNG XỬ LÝ VẬT LIỆU — HOANGGIA EDIT AI

## Mục tiêu
Tạo bản đồ vật liệu từ ảnh da, vải, gỗ, đá, bê tông, sơn, gạch, giấy dán tường, mây tre, thảm, nhựa, gạch đất nung, nút bần và cao su. Không hỗ trợ kim loại và kính.

## Kỹ năng 01 — Phân loại vật liệu
Cho phép người dùng chọn nhóm; không khẳng định đã nhận diện bằng AI nếu chỉ chọn thủ công. Mỗi nhóm có cấu hình gợi ý riêng.

## Kỹ năng 02 — Giữ đúng màu
Bản đồ màu giữ RGB ảnh nguồn, không áp bóng đổ giả. Nếu ảnh nguồn có bóng đổ, cảnh báo người dùng cắt vùng phẳng, đủ sáng.

## Kỹ năng 03 — Kiểm soát vân nhỏ
Cho phép tăng mật độ vân để tránh vân da/vải quá lớn; chỉ coi kích thước theo mm là chính xác khi người dùng cung cấp mẫu chuẩn hoặc kích thước tham chiếu.

## Kỹ năng 04 — Tạo bản đồ
Bản đồ màu, pháp tuyến, độ nhám, độ cao, che khuất. Những bản đồ suy ra từ một ảnh phải gắn nhãn 'ước lượng', không tuyên bố đo vật lý.

## Kỹ năng 05 — Kiểm tra chất lượng
Kiểm tra ảnh có độ phân giải thấp, bóng đổ mạnh, phối cảnh xiên hoặc hoa văn lặp dễ lộ mối nối. Tránh tăng chi tiết giả gây sai vật liệu.

## Kỹ năng 06 — Chuẩn bị cho diễn họa
Xuất PNG theo từng loại bản đồ, tên tệp nhất quán, màu bản đồ màu ở sRGB và bản đồ dữ liệu ở tuyến tính khi dùng trong phần mềm 3D.

## Kỹ năng 07 — Giao diện thuần tiếng Việt
Tất cả nhãn, nút, hướng dẫn và thông báo bằng tiếng Việt. Chỉ giữ tên kỹ thuật trong tên tệp nếu cần tương thích.

## Kỹ năng 08 — Quy tắc triển khai
Ưu tiên chạy trên thiết bị, miễn phí, không API trả phí. Tính năng chưa triển khai phải được ghi rõ; không mô tả bản ước lượng là AI chuyên sâu.
