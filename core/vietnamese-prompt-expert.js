// Chuyên gia Biên dịch & Tối ưu Prompt: biên soạn từ dữ liệu có cấu trúc,
// không cắt chuỗi prompt gốc vì dễ làm mất ràng buộc hoặc tham chiếu.
const clean = x => String(x ?? "").trim();
const show = x => clean(x) || "Không chỉ định";
const modeName = {Furniture:"Thay nội thất",Material:"Đổi vật liệu",Lighting:"Điều chỉnh ánh sáng",Camera:"Đổi góc máy",Removal:"Xóa vật thể",AspectRatio:"Đổi tỷ lệ ảnh",ReferenceReplica:"Tái tạo ảnh tham chiếu",SpaceSync:"Đồng bộ không gian"};
const rule = {
 Furniture:"Chỉ thay sản phẩm được chọn; giữ đúng kiểu dáng, tỷ lệ, cấu tạo theo ảnh tham chiếu, tiếp xúc sàn, bóng đổ và phối cảnh.",
 Material:"Chỉ thay bề mặt được chọn; bảo đảm đúng đặc tính vật liệu, tỷ lệ vân, phản xạ và ánh sáng.",
 Lighting:"Chỉ chỉnh nguồn sáng được chọn; bảo đảm hướng, cường độ, nhiệt độ màu, độ suy giảm và bóng đổ hợp lý.",
 Camera:"Chỉ đổi góc máy được chọn; kiểm soát vị trí, độ cao, tiêu cự và phối cảnh; không đổi thiết kế.",
 Removal:"Chỉ xóa vật thể được chỉ định và dấu vết của nó; phục hồi bề mặt bị che theo bằng chứng có sẵn, không thêm vật thể.",
 AspectRatio:"Chỉ đổi khung hình; ưu tiên mở rộng khung, không bóp méo, cắt mất chi tiết quan trọng hoặc tự tạo kiến trúc.",
 ReferenceReplica:"Tái tạo sát ảnh tham chiếu về kiến trúc, nội thất, vật liệu, ánh sáng và góc máy; chỉ thay sản phẩm được cấp phép.",
 SpaceSync:"Ảnh tham chiếu quyết định phong cách, đồ nội thất, vật liệu và ánh sáng; ảnh đích quyết định kiến trúc, hình học và góc máy."
};
function flatten(v) {
 if (v == null || v === "") return "";
 if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return clean(v);
 if (Array.isArray(v)) return v.map(flatten).filter(Boolean).join("; ");
 return Object.entries(v).map(([k,x])=>k+": "+flatten(x)).filter(x=>!x.endsWith(": ")).join("; ");
}
export function compactVietnamesePrompt(c) {
 const lines=["HOANGGIA AI — YÊU CẦU THIẾT KẾ (TIẾNG VIỆT, TỐI ƯU)","NHIỆM VỤ: "+(modeName[c.mode]||show(c.mode))+". Đối tượng: "+show(c.target)+".",rule[c.mode]||""];
 if(c.replacement)lines.push("SẢN PHẨM / VẬT LIỆU THAY THẾ: "+flatten(c.replacement)+".");
 if(c.brief)lines.push("YÊU CẦU RIÊNG: "+clean(c.brief));
 if(c.output)lines.push("ĐẦU RA: "+flatten(c.output));
 if(c.camera)lines.push("GÓC MÁY: "+flatten(c.camera));
 if(c.params&&Object.keys(c.params).length)lines.push("THÔNG SỐ ĐÃ CHỌN: "+flatten(c.params));
 if(c.decisions&&Object.keys(c.decisions).length)lines.push("QUYẾT ĐỊNH CHUYÊN GIA: "+flatten(c.decisions));
 if(c.referenceRoles)lines.push("PHÂN QUYỀN ẢNH THAM CHIẾU: "+flatten(c.referenceRoles));
 if(c.model)lines.push("MẪU SẢN PHẨM: "+flatten(c.model));
 if(c.aiTarget)lines.push("NỀN TẢNG AI: "+c.aiTarget);
 lines.push("KHÓA BẢO TOÀN: Giữ nguyên mọi đối tượng ngoài phạm vi chỉnh sửa; kiến trúc, mặt bằng, cửa, hình học, vật liệu, ánh sáng và góc máy không được cấp phép thay đổi. Không trộn ảnh tham chiếu, không suy diễn chi tiết bị khuất.");
 lines.push("CHẤT LƯỢNG: Ảnh chân thực, tỷ lệ đúng, vật liệu và ánh sáng hợp vật lý, không vật thể trùng, không biến dạng hoặc chi tiết giả.");
 return lines.filter(Boolean).join("\n");
}
export function compactVietnameseMulti(c) {
 const n=c.outputMode==="multiview"?c.viewCount:({"2x2":4,"3x2":6,"3x3":9}[c.layout]||4);
 const lines=["HOANGGIA AI — CHUYÊN GIA 09 (TIẾNG VIỆT, TỐI ƯU)",
 "NHIỆM VỤ: "+(c.outputMode==="multiview"?"Tạo "+n+" ảnh độc lập, mỗi yêu cầu một ảnh.":"Tạo một ảnh ghép "+c.layout+" gồm "+n+" góc khác nhau.") ,
 "ẢNH GỐC: "+show(c.master)+". Chỉ dùng ảnh đính kèm làm căn cứ hình học, không suy đoán từ tên tệp.",
 "KHÔNG GIAN: "+(c.space==="interior"?"Nội thất":"Kiến trúc")+". Khu vực: "+show(c.zone)+". "+clean(c.zoneNote),
 "NHÂN VẬT: "+show(c.cast)+". "+clean(c.castNote),
 c.face?"KHUÔN MẶT: dùng ảnh "+c.face+" chỉ cho nhận diện khuôn mặt.":"",
 c.bodyText?"DÁNG NGƯỜI (MÔ TẢ): "+c.bodyText:"",
 c.outfit?"TRANG PHỤC: dùng ảnh "+c.outfit+" chỉ cho quần áo.":"",
 c.brief?"YÊU CẦU RIÊNG: "+c.brief:"",
 "NỀN TẢNG: "+show(c.aiTarget),
 "KHÓA: Giữ nguyên công trình, kiến trúc, vị trí nội thất, vật liệu, ánh sáng, thời điểm, nhân vật và trang phục. Chỉ thay góc nhìn, bố cục và hành động hợp lý. Không tạo phòng, cửa, mặt sau hay chi tiết khuất không có bằng chứng.",
 "GÓC MÁY: Các góc phải khác nhau, phối cảnh tự nhiên, tỷ lệ người đúng; không che khuất thiết kế."];
 for(let i=0;i<n;i++){const s=c.shots[i];lines.push("GÓC "+String(i+1).padStart(2,"0")+": "+(!s||s.mode==="auto"?"Chuyên gia tự chọn góc khác biệt theo bằng chứng trong ảnh.":("Theo kiến trúc sư: "+[s.angle,s.zone,s.subject,s.person,s.action,s.note].filter(Boolean).join("; "))))}
 lines.push("CHẤT LƯỢNG: Ảnh kiến trúc chân thực, vật liệu, ánh sáng, tỷ lệ, phối cảnh và bóng đổ hợp lý; không thêm chi tiết giả.");
 return lines.filter(Boolean).join("\n");
}
