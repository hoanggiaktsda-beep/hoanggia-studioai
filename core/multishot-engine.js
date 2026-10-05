// Expert 09: independent pure prompt compiler; no imports from Expert 01–08.
export const SHOT_ANGLES=["Góc chéo 2/3","Chính diện","Góc 45°","Góc 90°","Toàn cảnh","Góc thấp","Góc cao","Cận cảnh","Góc qua vai","Góc nhìn xuyên lớp","Góc tự do"];
const counts={"2x2":4,"3x2":6,"3x3":9};
const spaces={architecture:"KIẾN TRÚC",interior:"NỘI THẤT"};
const people={auto:"AI đề xuất người trưởng thành hư cấu phù hợp nếu hữu ích",none:"Không có người",male:"Nam trưởng thành",female:"Nữ trưởng thành",both:"Nam và nữ trưởng thành"};
const zones={auto:"AI chọn khu vực có bằng chứng thị giác mạnh nhất",living:"Sofa / khu tiếp khách",dining:"Bàn ăn",kitchen:"Bếp",facade:"Mặt đứng / hình khối",landscape:"Cảnh quan",detail:"Chi tiết vật liệu",custom:"Khu vực do kiến trúc sư mô tả"};
export function compileMultiShot(c){
 const total=counts[c.layout];if(!total)throw Error("Bố cục không hợp lệ");
 if(!c.master)throw Error("Thiếu MASTER IMAGE");
 if(!spaces[c.space])throw Error("Chuyên ngành không hợp lệ");
 if(c.shots.length>total)throw Error("Số SHOT vượt quá số ô");
 const expert=c.space==="architecture"?"Tadao Ando — tư duy hình khối, tỷ lệ, kết cấu, ánh sáng và công trình trong bối cảnh; Iwan Baan — nhiếp ảnh kiến trúc và con người.":"Antonio Citterio — tỷ lệ, công năng, vật liệu và trật tự nội thất; François Halard — nhiếp ảnh nội thất, ánh sáng và chân dung.";
 const specified=c.shots.map((s,i)=>"SHOT "+String(i+1).padStart(2,"0")+" — KIẾN TRÚC SƯ CHỈ ĐỊNH (HARD LOCK): Góc "+s.angle+"; khu vực: "+(s.subject||"AI chọn trong phạm vi ảnh")+"; nhân vật: "+(people[s.person]||people.auto)+"; hành động: "+(s.action||"tự nhiên, phù hợp cảnh")+"; ghi chú: "+(s.note||"không có")+".").join("\n");
 const remaining=Array.from({length:total-c.shots.length},(_,i)=>"SHOT "+String(c.shots.length+i+1).padStart(2,"0")+" — AI TỰ ĐỀ XUẤT: Góc khác biệt, có giá trị hình ảnh, ưu tiên dữ liệu nhìn thấy; không trùng góc đã chọn.").join("\n");
 return [
 "HOANGGIA AI — EXPERT 09 · MULTI-SHOT STORYBOARD",
 "TASK: Generate EXACTLY ONE finished composite image with "+total+" distinct photographic panels arranged "+c.layout.replace("x","×")+". No separate images, no contact-sheet labels, no textual captions unless specifically requested.",
 "MASTER IMAGE (attach separately): "+c.master+". MASTER is the sole source of truth for scene geometry, architecture, furniture, materials, lighting and identity of the space. Filenames are not visual evidence.",
 "DOMAIN: "+spaces[c.space]+".",
 "BRAIN 01/02 — SPATIAL DESIGN: "+expert,
 "BRAIN 03 — PHOTOGRAPHY: Use expert architectural/interior photography reasoning; natural perspective, controlled lens, coherent light, human scale, no fisheye or distorted verticals.",
 "BRAIN 04 — ART DIRECTION & MODELING: Visual direction inspired by Peter Lindbergh's natural storytelling; model posing informed by David Gandy and Liu Wen's professional editorial practices. These are professional principles, NOT requests to reproduce these individuals' likenesses.",
 "PRIORITY AREA: "+(zones[c.zone]||zones.auto)+(c.zoneNote?"; architect note: "+c.zoneNote:"")+".",
 "CHARACTER POLICY: "+(people[c.cast]||people.auto)+". If FACE ID and BODY TEXT are missing, suggest fictional adults with natural appearance, consistent across all panels; never copy an actual model's face.",
 c.face?"FACE ID (attach separately): "+c.face+". This controls only facial identity; keep consistent in all relevant shots.":"FACE ID: not supplied; use a fictional adult identity.",
 c.bodyText?"BODY TEXT ONLY (reviewed by user): "+c.bodyText+". Maintain realistic anatomy; no exaggerated or sexualized measurements.":"BODY: natural adult proportions, believable posture and scale. No body reference image is sent to the image generator.",
 c.outfit?"OUTFIT REFERENCE (attach separately): "+c.outfit+". Use only garment silhouette, fabric, palette and accessories; never derive face/body from outfit photo.":"OUTFIT: appropriate understated editorial clothing, consistent across shots.",
 "SHOT DIRECTOR: The architect's manual shot requirements take priority. Photography brain decides viewpoint, lens, camera height and framing. Art director places and directs people without obscuring key design features.",
 specified,remaining,
 "CONTINUITY LOCK: Same project, geometry, objects, material palette, furniture positions, light direction, time of day, character identities, wardrobe and proportions across panels. Allow only camera viewpoint, framing and natural actions to vary.",
 "EVIDENCE LIMIT: A single MASTER image does not prove hidden surfaces, unseen rooms, rear facades or exact reverse views. Prefer camera shifts supported by visible geometry. Do not invent doors, windows, furniture, structural elements or unsupported hidden details. When a requested shot cannot be verified, approximate conservatively and preserve the known scene.",
 "COMPOSITION: editorial quality, deliberate visual rhythm, clean aligned gutters, consistent color grade, balanced wide/medium/detail storytelling. No duplicated panel.",
 c.brief?"ADDITIONAL DESIGN INTENT: "+c.brief:""
 ].filter(Boolean).join("\n\n");
}
