// Expert 09: independent pure prompt compiler; no imports from Expert 01–08.
export const SHOT_ANGLES=["Góc chéo 2/3","Chính diện","Góc 45°","Góc 90°","Toàn cảnh","Góc thấp","Góc cao","Cận cảnh","Góc qua vai","Góc nhìn xuyên lớp","Góc tự do"];
const counts={"2x2":4,"3x2":6,"3x3":9};
const spaces={architecture:"KIẾN TRÚC",interior:"NỘI THẤT"};
const people={auto:"AI đề xuất người trưởng thành hư cấu phù hợp nếu hữu ích",none:"Không có người",male:"Nam trưởng thành",female:"Nữ trưởng thành",both:"Nam và nữ trưởng thành",pedestrians:"Người đi bộ và cư dân trong không gian công cộng, tỷ lệ thật",visitors:"Khách tham quan hoặc du khách, tương tác tự nhiên với kiến trúc",family:"Gia đình hoặc nhóm người sinh hoạt phù hợp không gian",cyclists:"Người đi xe đạp trên tuyến được nhìn thấy và phù hợp công năng",gardeners:"Nhân viên chăm sóc cây xanh, làm vườn hoặc bảo trì cảnh quan",community:"Nhóm người sinh hoạt cộng đồng phù hợp quảng trường, công viên",crowd:"Đám đông có mật độ hợp lý, không che khuất thiết kế",custom:"Nhân vật theo mô tả của kiến trúc sư"};
export const EXPERT09_ZONES={"interior":{"auto":"AI tự chọn khu vực trong MASTER","living":"Phòng khách / sofa","dining":"Phòng ăn","kitchen":"Bếp / đảo bếp","bedroom":"Phòng ngủ","master":"Phòng ngủ master","bathroom":"Phòng tắm / WC","wardrobe":"Phòng thay đồ","foyer":"Sảnh đón / tiền phòng","hallway":"Hành lang / lưu thông","stairs":"Cầu thang / thông tầng","lounge":"Lounge / giải trí","bar":"Minibar / quầy bar","office":"Phòng làm việc","showroom":"Showroom / trưng bày","retail":"Cửa hàng / thương mại","hospitality":"Sảnh khách sạn / nhà hàng","ceiling":"Trần / hệ đèn","wall":"Vách / hệ tủ","floor":"Sàn / vật liệu","detail":"Chi tiết nội thất","custom":"Khác — mô tả riêng"},"architecture":{"auto":"AI tự chọn khu vực trong MASTER","facade":"Mặt đứng / hình khối","entrance":"Lối vào / tiền sảnh","massing":"Tổng thể khối công trình","roof":"Mái / sân mái","courtyard":"Sân trong","terrace":"Ban công / sân hiên","landscape":"Cảnh quan tổng thể","garden":"Sân vườn / cây xanh","park":"Công viên","plaza":"Quảng trường / không gian công cộng","walkway":"Lối đi bộ / đường dạo","water":"Hồ nước / đài phun / mặt nước","pool":"Hồ bơi / khu nghỉ","playground":"Sân chơi / khu hoạt động","parking":"Lối xe / bãi đỗ","street":"Đường phố / cảnh quan đô thị","boundary":"Cổng / hàng rào / ranh giới","lighting":"Chiếu sáng ngoại thất","detail":"Chi tiết kiến trúc / vật liệu","custom":"Khác — mô tả riêng"}};
const zoneText=c=>EXPERT09_ZONES[c.space]?.[c.zone]||EXPERT09_ZONES[c.space]?.auto;
const architectureCasts=new Set(["pedestrians","visitors","family","cyclists","gardeners","community","crowd","custom"]);function castPolicy(c){const type=c.space==="architecture"?c.cast:(architectureCasts.has(c.cast)?"auto":c.cast);return (people[type]||people.auto)+(type==="custom"&&c.castNote?"; yêu cầu: "+c.castNote:"")+"; keep people contextually plausible and subordinate to architectural and landscape design, never invent paths or features.";}
const AI_TARGET_GUIDANCE={"ChatGPT Images":"Direct natural-language image instructions and strict reference preservation.","GPT Image 2.5":"Precise visual edit boundaries and preservation constraints.","Nano Banana Pro":"Explicit reference hierarchy and material fidelity.","Nano Banana 2":"Concise consistent image-edit instructions.","FLUX.2 Pro":"Photographic scene and material realism.","Midjourney":"Concise visual art direction without unverified parameters.","Seedream 5.0":"Structured camera, materials and visual continuity.","Adobe Firefly":"Clear image edit scope and visual fidelity.","Ideogram":"Strong composition and spatial detail.","Lovart":"Art direction, camera and reference hierarchy.","Nano Banana":"Clear references and conservative geometry."};
function targetGuidance(c){const target=String(c.aiTarget||"ChatGPT Images").trim().slice(0,100);return "TARGET AI PLATFORM: "+target+". PROMPT ADAPTATION: "+(AI_TARGET_GUIDANCE[target]||"Respect target platform conventions while retaining MASTER and continuity locks.");}
export function compileMultiShot(c){
 const total=counts[c.layout];if(!total)throw Error("Bố cục không hợp lệ");
 if(!c.master)throw Error("Thiếu MASTER IMAGE");
 if(!spaces[c.space])throw Error("Chuyên ngành không hợp lệ");
 if(c.shots.length>total)throw Error("Số SHOT vượt quá số ô");
 const expert=c.space==="architecture"?"Tadao Ando — tư duy hình khối, tỷ lệ, kết cấu, ánh sáng và công trình trong bối cảnh; Iwan Baan — nhiếp ảnh kiến trúc và con người.":"Antonio Citterio — tỷ lệ, công năng, vật liệu và trật tự nội thất; François Halard — nhiếp ảnh nội thất, ánh sáng và chân dung.";
 const specified=c.shots.map((s,i)=>s.mode==="auto"?"SHOT "+String(i+1).padStart(2,"0")+" — AI TỰ ĐỀ XUẤT: Chọn góc đẹp, khác biệt, có bằng chứng từ MASTER; không trùng các SHOT khác.":"SHOT "+String(i+1).padStart(2,"0")+" — KIẾN TRÚC SƯ CHỈ ĐỊNH (HARD LOCK): Góc "+s.angle+"; khu vực ưu tiên: "+(EXPERT09_ZONES[c.space]?.[s.zone]||zoneText(c))+"; khu vực: "+(s.subject||"AI chọn trong phạm vi ảnh")+"; nhân vật: "+(people[s.person]||people.auto)+"; hành động: "+(s.action||"tự nhiên, phù hợp cảnh")+"; ghi chú: "+(s.note||"không có")+".").join("\n");
 const remaining=Array.from({length:total-c.shots.length},(_,i)=>"SHOT "+String(c.shots.length+i+1).padStart(2,"0")+" — AI TỰ ĐỀ XUẤT: Góc khác biệt, có giá trị hình ảnh, ưu tiên dữ liệu nhìn thấy; không trùng góc đã chọn.").join("\n");
 return [
 "HOANGGIA AI — EXPERT 09 · MULTI-SHOT STORYBOARD",
 targetGuidance(c),
 "TASK: Generate EXACTLY ONE finished composite image with "+total+" distinct photographic panels arranged "+c.layout.replace("x","×")+". No separate images, no contact-sheet labels, no textual captions unless specifically requested.",
 "MASTER IMAGE (attach separately): "+c.master+". MASTER is the sole source of truth for scene geometry, architecture, furniture, materials, lighting and identity of the space. Filenames are not visual evidence.",
 "DOMAIN: "+spaces[c.space]+".",
 "BRAIN 01/02 — SPATIAL DESIGN: "+expert,
 "BRAIN 03 — PHOTOGRAPHY: Use expert architectural/interior photography reasoning; natural perspective, controlled lens, coherent light, human scale, no fisheye or distorted verticals.",
 "BRAIN 04 — ART DIRECTION & MODELING: Visual direction inspired by Peter Lindbergh's natural storytelling; model posing informed by David Gandy and Liu Wen's professional editorial practices. These are professional principles, NOT requests to reproduce these individuals' likenesses.",
 "PRIORITY AREA: "+zoneText(c)+(c.zoneNote?"; architect note: "+c.zoneNote:"")+".",
 "CHARACTER POLICY: "+castPolicy(c)+". If FACE ID and BODY TEXT are missing, suggest fictional adults with natural appearance, consistent across all panels; never copy an actual model's face.",
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

export function compileMultiView(c){
 const n=Number(c.viewCount);
 if(!Number.isInteger(n)||n<1||n>12)throw Error("Số góc chụp không hợp lệ (1–12)");
 if(!c.master)throw Error("Thiếu MASTER IMAGE");
 if(!spaces[c.space])throw Error("Chuyên ngành không hợp lệ");
 if(c.shots.length>n)throw Error("Số SHOT vượt quá số góc");
 const master="MASTER IMAGE: "+c.master+" (attach image separately). Master is the sole spatial source of truth; do not infer hidden geometry from a filename.";
 const brains=c.space==="interior"
 ?"ARCHITECTURE BRAIN: preserve floor plan, walls, ceiling, openings and spatial axes. INTERIOR DESIGN BRAIN: preserve furniture identities, placement, proportions, palette, materials and lighting. PHOTOGRAPHY BRAIN: François Halard-inspired interior photography, human scale, controlled verticals, realistic lens and light."
 :"ARCHITECTURE BRAIN: Tadao Ando-inspired reading of massing, openings, context and structural logic. INTERIOR DESIGN BRAIN: preserve visible fit-out, furniture, materials and continuity. PHOTOGRAPHY BRAIN: Iwan Baan-inspired architectural photography, human context, perspective and natural light.";
 const common=[
 targetGuidance(c),
 "HOANGGIA AI EXPERT 09 — MULTI-VIEW CREATIVE — CONSISTENCY MASTER",
 master,"DOMAIN: "+spaces[c.space],brains,
 "ART DIRECTION BRAIN: direct male/female adult models' placement, posture, scale, gaze, interactions and blocking without obscuring design; use professional editorial practices, not real celebrity likenesses.",
 "PRIORITY ZONE: "+zoneText(c)+(c.zoneNote?"; "+c.zoneNote:""),
 "CAST: "+castPolicy(c),
 c.face?"FACE ID FILE: "+c.face+"; use attached portrait only for face identity, not architecture.":"FACE ID: fictional consistent adult face if a character is used.",
 c.bodyText?"BODY TEXT (user-reviewed): "+c.bodyText:"BODY: natural adult proportions, realistic posture and scale; no BODY image inferred or transmitted.",
 c.outfit?"OUTFIT FILE: "+c.outfit+"; clothing only, no face/body derivation.":"OUTFIT: consistent understated editorial clothing.",
 "GLOBAL SPATIAL LOCK: all images depict the SAME exact project, objects, finishes, furniture positions, lighting setup, time of day, and character identity/wardrobe. Only viewpoint, focal length, framing and naturally compatible action may vary.",
 "EVIDENCE SAFETY: a single master image cannot verify reverse angles or hidden surfaces. Avoid inventing unseen rooms, doors, windows, rear walls or furniture. If a requested angle is not visually supported, use a conservative view within observed spatial evidence; do not claim geometric certainty.",
 "SERIES PLAN: "+n+" independent numbered shot prompts follow. Each prompt generates EXACTLY ONE image, NOT a collage, grid or contact sheet.",
 c.brief?"ADDITIONAL INTENT: "+c.brief:""
 ].filter(Boolean).join("\n");
 const defaults=c.space==="interior"?[
 ["Toàn cảnh","Phòng khách và mối liên hệ với khu ăn"],
 ["Góc chéo 2/3","Sofa, bàn trà và hệ vách"],
 ["Góc nhìn xuyên lớp","Từ phòng khách hướng về khu ăn"],
 ["Cận cảnh","Khu bàn ăn, đèn trang trí và chi tiết vật liệu"],
 ["Góc 45°","Tương quan cửa kính, sofa và bàn"],
 ["Góc thấp","Chiều sâu đồ nội thất"],
 ["Chính diện","Trục không gian chính"],
 ["Góc cao","Bố cục tổng thể"],
 ["Góc tự do","Chi tiết có giá trị thị giác"]
 ]:[
 ["Toàn cảnh","Công trình trong bối cảnh"],
 ["Góc chéo 2/3","Hình khối và mặt đứng"],
 ["Góc nhìn xuyên lớp","Các lớp không gian và lối tiếp cận"],
 ["Cận cảnh","Vật liệu và chi tiết kiến trúc"],
 ["Góc thấp","Nhịp kết cấu và tỷ lệ người"],
 ["Góc 45°","Giao điểm khối tích"],
 ["Chính diện","Mặt đứng chính"],
 ["Góc cao","Tổ chức khối"],
 ["Góc tự do","Điểm nhấn có bằng chứng thị giác"]
 ];
 const prompts=Array.from({length:n},(_,i)=>{
 const s=c.shots[i];const manualAngles=new Set(c.shots.filter(x=>x.mode!=="auto").map(x=>x.angle));const candidates=defaults.filter(x=>!manualAngles.has(x[0]));const aiIndex=c.shots.slice(0,i).filter(x=>x.mode==="auto").length+Math.max(0,i-c.shots.length);const d=candidates[aiIndex%candidates.length]||defaults[i%defaults.length];
 const spec=s && s.mode!=="auto"
 ?"ARCHITECT LOCKED SHOT: "+(s.angle||"Góc tự do")+"; PRIORITY ZONE: "+(EXPERT09_ZONES[c.space]?.[s.zone]||zoneText(c))+"; SUBJECT/ZONE: "+(s.subject||"within visible evidence")+"; PERSON: "+(people[s.person]||people.auto)+"; ACTION: "+(s.action||"natural")+"; NOTES: "+(s.note||"none")
 :"EXPERT-PROPOSED SHOT: "+d[0]+"; PRIORITY ZONE: "+(s&&EXPERT09_ZONES[c.space]?.[s.zone]||zoneText(c))+"; SUBJECT/ZONE: "+d[1]+"; adjust to MASTER evidence, prioritize a distinct and attractive composition; do not duplicate other shots.";
 return "IMAGE "+String(i+1).padStart(2,"0")+" / "+n+" — STANDALONE PROMPT\n"+common+"\n"+spec+"\nOUTPUT THIS IMAGE ONLY. Photorealistic architectural editorial photograph, accurate verticals, plausible occlusion and perspective, natural material response, no changes to the original design.";
 });
 return prompts.join("\n\n"+("═".repeat(38))+"\n\n");
}
