import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection, materialDecisionEngine} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {cameraDecisionEngine} from "./camera-decision-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";
import {lightingDecisionEngine} from "./lighting-engine.js";
import {expertDecision} from "./expert-decision-layer.js";

const DESIGN_INTENT_LIBRARY = {
  style: {
    "Modern Luxury": "Contemporary luxury with restrained geometry, premium materials, precise detailing and controlled visual hierarchy.",
    "Minimal Luxury": "Reduced composition, clean planes, few material families, refined detailing and luxury expressed through proportion and finish.",
    "Contemporary": "Current architectural language with clean lines, balanced asymmetry, practical detailing and restrained ornament.",
    "Modernist": "Function-led geometry, structural clarity, honest materials and minimal decorative noise.",
    "Minimalist": "Essential forms only, visual calm, negative space, controlled palette and no unnecessary ornament.",
    "Luxury Minimalism": "Minimal composition elevated by premium materials, precise junctions, subtle contrast and exceptional detailing.",
    "Luxury Mix Minimalist": "Luxury material richness combined with minimalist massing, clean silhouettes and controlled decoration.",
    "Modern Classic": "Classical proportion and symmetry interpreted through contemporary geometry, detailing and material restraint.",
    "Neo-classic Contemporary": "Classical order simplified into contemporary forms, balanced symmetry, refined moulding and modern material language.",
    "Transitional": "Balanced bridge between traditional proportion and contemporary simplicity, avoiding stylistic extremes.",
    "Industrial": "Exposed construction language, robust materials, functional detailing and controlled rawness.",
    "Soft Industrial": "Industrial structure softened by warm timber, textiles, refined lighting and comfortable proportions.",
    "Brutalist": "Mass, monolithic geometry, strong shadow, raw material expression and architectural weight.",
    "Neo Brutalism": "Brutalist massing translated into a cleaner contemporary language with precise details and controlled material contrast.",
    "Biophilic": "Integration of vegetation, natural materials, daylight and organic rhythms while preserving functional circulation.",
    "Organic Modern": "Soft geometry, natural materials, tactile surfaces and calm contemporary proportions.",
    "Organic Contemporary": "Contemporary architecture softened by flowing forms, natural textures and restrained organic references.",
    "Japandi": "Japanese restraint combined with Scandinavian warmth, natural materials, low visual noise and human-scaled simplicity.",
    "Japanese Minimalism": "Ma, proportion, quiet material transitions, disciplined storage and carefully controlled emptiness.",
    "Wabi-Sabi": "Natural irregularity, tactile aging, imperfect surfaces and understated composition without artificial distressing.",
    "Zen": "Calm spatial rhythm, visual silence, natural materials, filtered light and deliberate emptiness.",
    "Muji": "Simple functional forms, warm neutral materials, modular clarity and low visual distraction.",
    "Scandinavian": "Light, functional interiors, natural timber, soft textiles, daylight and practical human comfort.",
    "Modern Korean": "Quiet contemporary composition, neutral palette, refined joinery, soft lighting and restrained object density.",
    "Contemporary Asian": "Contemporary spatial clarity enriched with Asian material, craft and proportion references.",
    "Tropical Asian": "Climate-responsive openness, natural ventilation cues, vegetation, timber and filtered tropical light.",
    "Classic European": "Formal proportion, symmetry, layered detailing and European classical material vocabulary.",
    "Neoclassical": "Classical order, symmetry, restrained ornament and elegant architectural proportions.",
    "French Classic": "Elegant symmetry, refined moulding, lightness, patina and sophisticated material layering.",
    "Parisian": "Historic architectural character balanced with contemporary furniture, restrained luxury and curated eclecticism.",
    "Italian Contemporary": "Sculptural modern furniture, precise proportion, sophisticated materials and Italian spatial refinement.",
    "Italian Luxury": "High-end Italian materiality, sculptural silhouettes, craftsmanship and controlled opulence.",
    "Art Deco": "Geometric rhythm, symmetry, rich materials, graphic contrast and refined ornamental accents.",
    "Art Nouveau": "Organic curves, botanical motifs, crafted detailing and flowing decorative geometry.",
    "Mid-Century Modern": "Human-scaled furniture, clean geometry, timber, functional forms and restrained retro character.",
    "Hollywood Regency": "Glamour, contrast, reflective surfaces, sculptural furniture and controlled theatricality.",
    "Eclectic Luxury": "Curated combination of distinct design languages unified through proportion, palette and material hierarchy.",
    "Maximalism": "Layered color, pattern, art and objects with intentional visual hierarchy rather than uncontrolled density.",
    "Mediterranean": "Sun-washed materials, mineral surfaces, warm timber, arches or softened geometry and relaxed spatial rhythm.",
    "Coastal": "Light atmosphere, natural textures, relaxed forms and restrained maritime references.",
    "Tropical": "Vegetation, natural textures, climate-responsive openness and strong indoor-outdoor relationship.",
    "California Modern": "Indoor-outdoor continuity, warm minimalism, natural materials and relaxed contemporary luxury.",
    "Moroccan": "Crafted texture, geometric pattern, warm mineral palette and layered artisanal details.",
    "Colonial Contemporary": "Traditional regional proportion interpreted with contemporary planning, materials and restrained detailing.",
    "Rustic Modern": "Natural roughness balanced by clean contemporary geometry and precise construction.",
    "Farmhouse Modern": "Practical familiar forms, natural materials, warm palette and contemporary detailing.",
    "Craftsman": "Visible craftsmanship, timber expression, built-in detailing and human-scaled material richness.",
    "Mountain Modern": "Strong material presence, timber and stone, framed views and contemporary shelter-like geometry.",
    "Gallery Minimal": "Museum-like calm, negative space, controlled lighting and architecture used as a backdrop for selected objects.",
    "Artistic Contemporary": "Contemporary architecture treated as an artistic composition with deliberate focal points and material contrast.",
    "Conceptual Interior": "A clear conceptual idea governs form, material, light and composition while maintaining spatial coherence.",
    "Experimental": "Controlled departure from conventional form, material or composition with deliberate visual logic.",
    "Editorial Luxury": "Highly curated, photographic composition with refined materials, strong styling hierarchy and controlled visual drama.",
    "Fashion Interior": "Runway/editorial sensibility translated into spatial composition, sculptural forms and strong material/lighting direction.",
    "Retro Contemporary": "Selected historical references reinterpreted through current proportions, materials and technology.",
    "Vintage Modern": "Vintage character integrated with modern geometry, comfort, detailing and controlled patina.",
    "Futuristic": "Forward-looking geometry, advanced material cues, integrated technology and precise controlled lighting.",
    "Tech Luxury": "Premium architectural language combined with discreet technology, precision detailing and sophisticated lighting."
  },
  lighting: {
    "Daylight / ánh sáng ban ngày": "Natural daylight becomes the primary source, with believable direction, exposure and soft environmental bounce.",
    "Morning light / nắng sớm": "Low-angle morning sun with longer shadows, gentle warmth and gradual falloff.",
    "Midday hard light / nắng trưa": "Higher-angle, harder daylight with clearer shadow edges and stronger contrast.",
    "Late afternoon / nắng chiều": "Lower warm sunlight, elongated shadows and richer directional depth.",
    "Golden hour / hoàng hôn vàng": "Warm low-angle sunlight with long soft-edged shadows, luminous highlights and restrained exposure.",
    "Blue hour / giờ xanh": "Cool ambient exterior light with controlled warm interior sources and balanced mixed-color contrast.",
    "Overcast / trời âm u": "Broad soft skylight, low shadow contrast and diffuse natural illumination.",
    "Window light / ánh sáng cửa sổ": "Daylight shaped by openings, with directional falloff and physically coherent interior shadow.",
    "Skylight / ánh sáng mái": "Top-down diffuse daylight with natural gradients and controlled architectural shadow.",
    "Diffused daylight / ánh sáng tán xạ": "Soft broad illumination with reduced specular contrast and gentle material response.",
    "Sunbeam / tia nắng xuyên không gian": "Visible directional sunlight entering through an opening, with believable volumetric presence only when atmospheric conditions support it.",
    "Ambient / general lighting": "Even architectural base illumination supporting visibility without flattening spatial hierarchy.",
    "Downlight": "Controlled overhead pools of light with realistic beam spread, falloff and ceiling integration.",
    "Spotlight": "Focused beam used to establish a precise visual target while preserving surrounding darkness and depth.",
    "Track light": "Adjustable directional fixtures creating controlled accent hierarchy with believable source positions.",
    "Linear light": "Continuous architectural light source with clean distribution and realistic integration into reveals or profiles.",
    "Cove / indirect light": "Hidden reflected illumination with soft gradients and no implausible visible source.",
    "Wall washer": "Grazing or broad directional illumination that reveals wall texture and architectural planes.",
    "Up-light": "Light directed upward to activate ceiling or vertical surfaces through reflected bounce.",
    "Under-cabinet / concealed light": "Localized concealed task/accent illumination with physically plausible contact and falloff.",
    "Decorative pendant": "Visible decorative source contributing both illumination and spatial identity.",
    "Table / floor lamp": "Localized practical light with believable shade behavior, source placement and nearby shadow.",
    "Architectural accent lighting": "Precisely controlled light used to reveal architectural features without redesigning them.",
    "Cinematic three-point": "Key, fill and rim logic adapted to interior space while preserving believable architectural source motivation.",
    "Key + fill + rim": "Primary key establishes form, restrained fill protects shadow detail, rim separates selected subject without flattening.",
    "Low-key cinematic": "Dark tonal base with selective illumination, deep controlled shadows and strong subject hierarchy.",
    "High-key cinematic": "Bright, low-contrast illumination with open shadow detail and clean tonal separation.",
    "Rembrandt": "Directional key light creating characteristic triangular facial-style modeling translated cautiously to objects and spatial planes.",
    "Butterfly / Paramount": "Centered elevated key creating symmetrical downward modeling, used as a stylistic photographic reference rather than a literal fixture.",
    "Side light": "Lateral illumination emphasizing texture, depth and form through directional shadow.",
    "Backlight / rim light": "Rear or edge illumination creating separation while retaining believable source logic.",
    "Practical lighting": "Visible fixtures in the scene motivate the illumination and maintain believable intensity and falloff.",
    "Volumetric / atmospheric": "Directional light interacts subtly with atmosphere; avoid artificial haze unless physically justified.",
    "Film noir": "Strong directional contrast, selective highlights and deep shadow with controlled architectural readability.",
    "Warm atmospheric": "Warm color temperature and soft gradients create intimate depth without over-saturating materials.",
    "Cool atmospheric": "Cooler ambient tone with restrained contrast and clear material readability.",
    "Warm / cool contrast": "Warm and cool sources are deliberately separated to create depth and spatial hierarchy.",
    "Chiaroscuro": "Strong light-dark modeling with controlled transition, preserving material and geometric readability.",
    "Gallery lighting": "Even, precise illumination prioritizing artwork/material/object readability and restrained reflections.",
    "Art installation lighting": "Highly intentional accent hierarchy treating light as part of the visual composition.",
    "High contrast artistic": "Controlled dramatic contrast used as a compositional device without clipping detail.",
    "Soft editorial": "Soft, polished illumination with gentle shadows and premium photographic material response.",
    "Dreamy diffused": "Low-contrast diffuse light with gentle highlights and atmosphere while retaining physical credibility.",
    "Dramatic directional": "Strong directional source with deliberate shadow geometry and clear focal hierarchy.",
    "Night interior mood": "Dark exterior context with motivated practical and architectural sources defining interior atmosphere.",
    "Natural + architectural": "Daylight remains spatially credible while architectural fixtures reinforce hierarchy.",
    "Natural + decorative": "Natural daylight establishes base exposure while decorative fixtures create localized warmth and identity.",
    "Daylight + warm artificial": "Cooler daylight balanced with warm practical/architectural sources for layered depth.",
    "Daylight + cool artificial": "Daylight integrated with cooler artificial sources while preserving believable color separation.",
    "Sunset + practical lights": "Warm declining daylight transitions into motivated interior practicals with controlled mixed color.",
    "Mixed color temperature": "Different color temperatures are retained intentionally, with coherent source motivation and material response."
  },
  view: {
    "Eye-level / tầm mắt": "Human eye-level viewpoint with believable spatial proportions and natural vertical relationships.",
    "Human eye 3/4": "Three-quarter human viewpoint revealing two or more spatial planes without excessive distortion.",
    "Three-quarter interior": "Oblique view that communicates furniture, architecture and depth relationships simultaneously.",
    "Corner view / góc phòng": "Corner-based composition maximizing readable spatial depth while keeping perspective controlled.",
    "Axial / trục chính": "Camera aligned to a principal architectural axis to clarify symmetry, circulation and hierarchy.",
    "Straight-on / chính diện": "Front-facing composition prioritizing direct reading of a wall, furniture group or architectural elevation.",
    "Symmetrical frontal / đối xứng": "Centered symmetrical framing with deliberate balance and controlled verticals.",
    "Diagonal / chéo không gian": "Diagonal composition creates depth and directional movement through the room.",
    "Wide architectural": "Broad architectural framing that explains spatial relationships without exaggerated perspective.",
    "Ultra-wide spatial": "Very broad spatial coverage with careful distortion control and believable edge geometry.",
    "Low angle / góc thấp": "Lower viewpoint increasing perceived verticality and architectural presence.",
    "High angle / góc cao": "Elevated viewpoint revealing plan relationships while retaining believable scale.",
    "Bird's-eye / nhìn từ trên": "Strong elevated overview emphasizing spatial organization rather than eye-level experience.",
    "Detail / material close-up": "Closer framing prioritizing material, joint, texture or craft detail.",
    "Furniture hero / hero đồ nội thất": "Composition makes the selected furniture the visual subject while preserving surrounding spatial context.",
    "Built-in / architectural detail": "Framing isolates a built-in or architectural element while preserving its construction relationship.",
    "Threshold / doorway view": "Viewpoint from a threshold establishes depth through layered spatial boundaries.",
    "Through-space / nhìn xuyên lớp": "Layered foreground, middle ground and background create depth and spatial narrative.",
    "Establishing shot": "Cinematic orientation shot establishing location, scale and spatial relationships.",
    "Master shot": "Comprehensive cinematic composition containing the principal action/space relationship.",
    "Wide shot": "Wide cinematic framing balancing environment and subject.",
    "Medium wide shot": "Moderately wide framing retaining environment while increasing subject emphasis.",
    "Medium shot": "Balanced subject framing with enough environmental context to explain space.",
    "Medium close-up": "Tighter framing emphasizing a selected object while retaining contextual cues.",
    "Close-up": "Close framing focused on a specific object or detail.",
    "Extreme close-up": "Very tight detail framing prioritizing texture, craft or small design elements.",
    "Over-the-shoulder": "Foreground human-context framing with the space or object observed beyond.",
    "POV": "Subjective viewpoint establishing an implied human observer position.",
    "Low-angle cinematic": "Dramatic low viewpoint emphasizing scale and vertical presence.",
    "High-angle cinematic": "Elevated cinematic viewpoint emphasizing composition and spatial relationship.",
    "Dutch angle": "Intentional camera roll creating visual tension; use only when stylistically requested.",
    "Tracking / moving-camera feel": "Composition suggests a moving camera while maintaining spatial continuity and believable perspective.",
    "Symmetrical cinematic": "Cinematic symmetry used as a strong compositional structure.",
    "Negative-space composition": "Deliberate empty space supports subject hierarchy and visual rhythm.",
    "Editorial hero": "Highly curated hero framing balancing subject, architecture, negative space and photographic hierarchy.",
    "Fine-art composition": "Image treated as a deliberate fine-art composition with controlled geometry, light and visual silence.",
    "Gallery perspective": "Calm museum-like viewpoint emphasizing proportion, object presence and spatial clarity.",
    "Abstract architectural crop": "Selective crop emphasizes geometry, material or light rather than the entire room.",
    "Minimal composition": "Reduced framing with strong negative space and limited visual competition.",
    "Layered foreground / middle / background": "Explicit depth layering creates spatial narrative and visual recession.",
    "Reflection view": "Reflective surface becomes a compositional layer while preserving physical reflection logic.",
    "Framed view": "Doorways, openings or architectural edges act as a natural frame around the subject.",
    "Graphic geometry": "Strong lines, planes and shapes organize the frame as a graphic composition.",
    "Human-context view": "Architecture is understood through believable human scale and contextual presence.",
    "Intimate observational view": "Closer, less formal viewpoint emphasizing lived spatial experience.",
    "Architectural portrait": "Architecture is photographed as the primary subject with deliberate formal composition."
  },
  camera: {
    "Canon EOS R1": "Full-frame Canon mirrorless reference with fast professional handling; use a natural architectural rendering profile rather than inventing exact lens metadata.",
    "Canon EOS R5 Mark II": "High-resolution full-frame mirrorless reference suited to detailed architectural imagery and controlled perspective.",
    "Sony Alpha 1 II": "High-resolution full-frame mirrorless reference for crisp detail, dynamic range and flexible architectural capture.",
    "Sony Alpha 7R V": "High-resolution full-frame reference emphasizing detailed architectural and material rendering.",
    "Sony Alpha 7 IV": "Balanced full-frame reference with natural perspective and practical dynamic range.",
    "Nikon Z9": "Professional full-frame reference emphasizing high detail, dynamic range and controlled architectural capture.",
    "Nikon Z8": "High-resolution full-frame reference for detailed interiors and flexible framing.",
    "Nikon Z6III": "Full-frame reference with balanced detail and natural rendering.",
    "Fujifilm GFX100 II": "Large-sensor medium-format reference emphasizing fine detail, tonal depth and controlled perspective.",
    "Fujifilm GFX100S II": "Medium-format reference for detailed, calm tonal rendering and refined material texture.",
    "Leica SL3": "High-resolution full-frame reference emphasizing restrained rendering and precise optical character.",
    "Panasonic Lumix S1RII": "High-resolution full-frame reference for detailed architectural capture.",
    "Hasselblad X2D II 100C": "Medium-format reference emphasizing exceptional tonal depth, fine texture and deliberate architectural composition.",
    "Hasselblad X2D 100C": "Medium-format reference emphasizing high-resolution detail, tonal gradation and material fidelity.",
    "Hasselblad CFV 100C": "Medium-format digital-back reference suited to deliberate, high-detail architectural imagery.",
    "Phase One XF IQ4": "High-end medium-format reference emphasizing maximum detail, tonal latitude and precise material reproduction.",
    "ARRI ALEXA 35 Xtreme": "Cinema-camera reference emphasizing cinematic highlight roll-off, color separation and controlled motion-picture character.",
    "ARRI ALEXA 35": "Super 35 cinema reference with cinematic tonal response and controlled highlight behavior.",
    "ARRI ALEXA 265": "Large-format cinema reference emphasizing rich tonal depth, cinematic separation and natural perspective.",
    "ARRI ALEXA Mini LF": "Large-format cinema reference for refined depth, natural perspective and cinematic spatial storytelling.",
    "ARRI ALEXA LF": "Large-format cinema reference emphasizing cinematic depth and controlled perspective.",
    "ARRI ALEXA 35 Live": "Live-production cinema reference with cinematic color and controlled exposure response.",
    "Sony BURANO": "Full-frame cinema reference combining cinematic latitude, natural perspective and production-oriented image character.",
    "Sony VENICE 2": "Large-format cinema reference emphasizing cinematic dynamic range, color separation and nuanced highlight roll-off.",
    "Canon EOS C400": "Full-frame cinema reference for controlled motion-picture rendering and flexible lens language.",
    "Canon EOS C80": "Full-frame cinema reference with cinematic color response and practical production flexibility.",
    "RED V-RAPTOR XL": "High-resolution cinema reference emphasizing crisp detail, dynamic range and cinematic image character.",
    "RED V-RAPTOR": "High-resolution cinema reference with flexible framing and strong detail retention.",
    "35mm film camera": "Analog 35mm reference with organic grain, highlight behavior and restrained color response.",
    "Medium-format film camera": "Analog medium-format reference with high detail, tonal depth and organic film character.",
    "Large-format film camera": "Large-format analog reference emphasizing controlled perspective, fine detail and deliberate composition.",
    "4x5 large format": "Large-format reference emphasizing perspective control, plane-of-focus discipline and architectural precision.",
    "8x10 large format": "Very large-format reference emphasizing exceptional perspective discipline, detail and contemplative composition.",
    "24mm architectural wide": "Wide architectural focal-length reference with strong spatial coverage; control edge distortion and keep verticals believable.",
    "28mm natural wide": "Moderately wide perspective balancing room coverage with natural-looking geometry.",
    "35mm balanced": "Balanced focal-length reference for interiors with moderate spatial context and restrained distortion.",
    "50mm normal perspective": "Normal-lens reference producing familiar spatial relationships and restrained perspective exaggeration.",
    "65mm editorial": "Short-telephoto editorial reference compressing space slightly while emphasizing selected subjects.",
    "85mm detail / compression": "Short-telephoto reference for detail, separation and gentle spatial compression.",
    "Tilt-shift architectural lens": "Perspective-control reference prioritizing straight verticals and disciplined architectural geometry.",
    "Ultra-wide 14–20mm": "Ultra-wide reference for tight interiors; use carefully to avoid exaggerated scale and edge stretching.",
    "24–70mm zoom workflow": "Flexible zoom workflow allowing framing changes while preserving coherent perspective and realistic geometry.",
    "70–200mm compression": "Telephoto compression reference for selective detail and layered spatial relationships."
  }
};

function designIntentMeaning(params = {}) {
  return {
    style: DESIGN_INTENT_LIBRARY.style[params.style] || (params.style || ""),
    lighting: DESIGN_INTENT_LIBRARY.lighting[params.lighting] || (params.lighting || ""),
    view: DESIGN_INTENT_LIBRARY.view[params.view] || (params.view || ""),
    camera: DESIGN_INTENT_LIBRARY.camera[params.camera] || (params.camera || "")
  };
}

function scopedEvidence(mode, brief, target, params = {}) {
  const text = (brief || "").trim();
  const scopedParams = {
    Furniture: { style: params.style || "" },
    Material: { style: params.style || "" },
    Lighting: { lighting: params.lighting || "" },
    Camera: { view: params.view || "", camera: params.camera || "" }
  }[mode] || {};

  const meanings = designIntentMeaning(params);
  const scopedMeaning = {
    Furniture: { style: meanings.style },
    Material: { style: meanings.style },
    Lighting: { lighting: meanings.lighting },
    Camera: { view: meanings.view, camera: meanings.camera }
  }[mode] || {};

  const lines = [
    `USER INTENT: ${text || "Không có yêu cầu bổ sung."}`,
    `TARGET: ${target || "Chưa xác định"}`,
    `RELEVANT DESIGN INTENT: ${Object.entries(scopedParams).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(" | ") || "Không có"}`,
    `DESIGN INTENT MEANING: ${Object.entries(scopedMeaning).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(" | ") || "Không có"}`
  ];

  const scope = {
    Furniture: "Read scene evidence only to fit the target furniture. Do not infer new material, lighting or camera decisions.",
    Material: "Read scene evidence only to locate and construct the target material system. Do not infer new furniture, lighting or camera decisions.",
    Lighting: "Read scene evidence only to understand existing light sources and the target lighting change. Do not infer new furniture, material or camera decisions.",
    Camera: "Read scene evidence only to understand spatial relationships needed for the target view. Do not infer new furniture, material or lighting decisions."
  }[mode] || "";

  return [...lines, `EXPERT SCOPE: ${scope}`];
}

const AI_PROMPT_ADAPTERS = {
  "ChatGPT Images": { format: "Yêu cầu chỉnh sửa ảnh trực tiếp, tự nhiên, nêu rõ đối tượng, thao tác, khóa bảo toàn và tiêu chí chân thực.", order: ["ĐỐI TƯỢNG","THAY ĐỔI","KHÓA BẢO TOÀN","TÍNH CHÂN THỰC","BỐI CẢNH"] },
  "GPT Image 2.5": { format: "Yêu cầu chỉnh sửa chính xác, cô lập đúng phạm vi can thiệp và bảo toàn toàn bộ phần ngoài phạm vi.", order: ["MỤC TIÊU","CAN THIỆP","RANH GIỚI","BẢO TOÀN","CHẤT LƯỢNG"] },
  "Nano Banana Pro": { format: "Yêu cầu xử lý nhiều ảnh tham chiếu, nhấn mạnh nhận diện model, tính nhất quán không gian và vật liệu.", order: ["MODEL / THAM CHIẾU","CAN THIỆP","NHẤT QUÁN KHÔNG GIAN","BẢO TOÀN","CHÂN THỰC"] },
  "Nano Banana 2": { format: "Yêu cầu ngắn gọn, rõ mục tiêu và ràng buộc, ưu tiên tính nhất quán đối tượng và hiện thực vật lý.", order: ["ĐỐI TƯỢNG","THAY ĐỔI","RÀNG BUỘC","BẢO TOÀN","CHÂN THỰC"] },
  "FLUX.2 Pro": { format: "Chỉ dẫn sản xuất súc tích, giữ liên tục bố cục, hình học và vật liệu trong khi giới hạn biến đổi.", order: ["BỐI CẢNH","CAN THIỆP","LIÊN TỤC HÌNH HỌC","BẢO TOÀN","ĐẦU RA"] },
  "Midjourney": { format: "Chỉ dẫn art direction cô đọng, ưu tiên bố cục, ngôn ngữ hình ảnh, vật liệu, không khí và ý đồ thị giác.", order: ["Ý ĐỒ HÌNH ẢNH","BỐ CỤC","ĐỐI TƯỢNG","VẬT LIỆU / KHÔNG KHÍ","BẢO TOÀN"] },
  "Seedream 5.0": { format: "Yêu cầu chỉnh sửa độ trung thực cao, xác định rõ đối tượng, nhận diện, không gian và các giới hạn biến đổi.", order: ["ĐỐI TƯỢNG","NHẬN DIỆN","CAN THIỆP","KHÓA","ĐỘ TRUNG THỰC"] },
  "Adobe Firefly": { format: "Chỉ dẫn chỉnh sửa rõ ràng, xác định vùng tác động và giới hạn bảo toàn phù hợp quy trình sản xuất.", order: ["VÙNG CHỈNH SỬA","THAY ĐỔI","BẢO TOÀN","KẾT QUẢ MONG MUỐN"] },
  "Ideogram": { format: "Yêu cầu ngắn gọn, cụ thể về bố cục và đối tượng; ưu tiên mô tả chính xác các chi tiết cần giữ.", order: ["ĐỐI TƯỢNG","BỐ CỤC","CHỈNH SỬA","CHI TIẾT","BẢO TOÀN"] },
  "Lovart": { format: "Chỉ thị sản xuất cô đọng cho quy trình thiết kế, tách rõ hành động, vật liệu/đối tượng và khóa bảo toàn.", order: ["MỤC TIÊU","HÀNH ĐỘNG","ĐIỀU KIỆN THIẾT KẾ","KHÓA","ĐẦU RA"] },
  "Nano Banana": { format: "Yêu cầu chỉnh sửa trực tiếp với phạm vi thay đổi chính xác và khóa bảo toàn mạnh.", order: ["CHỈNH SỬA","BẢO TOÀN","CHI TIẾT","CHẤT LƯỢNG","BỐI CẢNH"] },
  "Khác": { format: "Yêu cầu sản xuất sẵn sàng sử dụng, nêu rõ đối tượng, thay đổi, bảo toàn và tính chân thực.", order: ["ĐỐI TƯỢNG","THAY ĐỔI","BẢO TOÀN","CHẤT LƯỢNG","BỐI CẢNH"] }
};

export function buildDirection({
  brief,
  mode,
  output,
  camera,
  target = "Khác",
  replacement = "",
  params = {},
  decisions = {},
  model = {},
  referenceRoles = "",
  aiTarget = "ChatGPT",
  aiProfile = ""
}) {
  const intentMeaning = designIntentMeaning(params);
  const relevantParams = {
    Furniture: { style: params.style || "", styleMeaning: intentMeaning.style },
    Material: { style: params.style || "", styleMeaning: intentMeaning.style },
    Lighting: { lighting: params.lighting || "", lightingMeaning: intentMeaning.lighting },
    Camera: { view: params.view || "", viewMeaning: intentMeaning.view, camera: params.camera || "", cameraMeaning: intentMeaning.camera },
    SpaceSync: { style: params.style || "", styleMeaning: intentMeaning.style }
  }[mode] || {};
  const analysis = analyzeBrief(brief, mode, output, camera);
  const modeData = editModeDirection(mode, target, brief, params, decisions);
  const expert = expertDecision(mode, decisions);

  const reasoning = {
    target,
    authority: mode === "Furniture"
      ? "Scene A = spatial authority · Reference B = furniture design authority"
      : "Scene A = spatial authority · Reference = authority only for the selected expert domain",
    preserve: "Kiến trúc, các đối tượng không được chọn và mọi lĩnh vực ngoài phạm vi chỉnh sửa",
    expert: expert.name,
    expertRole: expert.role,
    independence: `Chỉ ${expert.name} quyết định trong phạm vi ${mode}. Các lĩnh vực khác được khóa.`
  };

  const decisionLines = Object.entries(decisions)
    .map(([k,v]) => "• " + k.toUpperCase() + ": " + v)
    .join("\n");

  const body = [];

  const adapter = AI_PROMPT_ADAPTERS[aiTarget] || AI_PROMPT_ADAPTERS["Khác"];

  body.push(
    "CHUYÊN GIA",
    expert.name + " — " + expert.role,
    "PHẠM VI CHUYÊN MÔN",
    expert.scope,
    "",
    "NHIỆM VỤ",
    mode === "Furniture" ? "Replace only the selected furniture: " + target :
    mode === "Material" ? "Change only the selected material surface: " + target :
    mode === "Lighting" ? "Change only the selected lighting system: " + target :
    "Change only the camera view: " + target,
    "",
    "LOGIC THIẾT KẾ",
    expert.principles.map(x => "• " + x).join("\n"),
    "",
    "QUY TRÌNH SUY LUẬN",
    expert.protocol.map((x,i) => (i + 1) + ". " + x).join("\n"),
    "",
    "QUYẾT ĐỊNH",
    decisionLines || "• Áp dụng nguyên tắc chuyên môn vào ý đồ của Ốc."
  );

  if (mode === "Furniture") {
    const f = furnitureDirection(target, replacement, brief, relevantParams, decisions, model, referenceRoles);
    body.push(
      "",
      "NGUỒN THAM CHIẾU",
      "• Chỉ sử dụng ảnh mẫu được cung cấp cho đúng đồ nội thất được chọn.",
      "• Tổng hợp nhiều góc nhìn thành một mẫu nội thất duy nhất, nhất quán.",
      "• Bảo toàn nhận diện, silhouette và cấu tạo theo các quyết định đã chọn.",
      "",
      "THỰC THI CHỈNH SỬA",
      "• " + f.editRule,
      "• " + f.realism,
      "• " + f.referenceRule
    );
  } else if (mode === "Material") {
    const m = materialDirection(analysis);
    const md = materialDecisionEngine({target, brief, decisions, analysis, material: replacement, referenceRoles});
    body.push(
      "",
      "THỰC THI CHỈNH SỬA",
      "• " + m.rule,
      "• " + m.realism.join("\n• "),
      ...md.checks.map(x => "• " + x)
    );
  } else if (mode === "Lighting") {
    const ld = lightingDecisionEngine({target, brief, decisions, analysis, referenceRoles});
    body.push(
      "",
      "THỰC THI CHỈNH SỬA",
      "• Xử lý nguồn sáng, hướng sáng, cường độ, nhiệt độ màu, độ suy giảm, tương phản, bóng đổ và ánh sáng phản xạ.",
      "• " + ld.checks.join("\n• ")
    );
  } else if (mode === "Camera") {
    const cd = cameraDecisionEngine({target, brief, decisions, params: relevantParams, analysis});
    body.push(
      "",
      "THỰC THI CHỈNH SỬA",
      "• Xác định vị trí, độ cao, tiêu cự/FOV, phối cảnh, bố cục, đường đứng và chiều sâu.",
      "• " + cd.checks.join("\n• ")
    );
  } else {
    body.push(
      "",
      "THỰC THI ĐỒNG BỘ KHÔNG GIAN",
      "• Điều phối trục kiến trúc, tỷ lệ, lưu thông, sightline, nhịp điệu, khoảng thở và hierarchy của toàn bộ không gian.",
      "• Không tối ưu một thành phần theo cách làm phá vỡ quan hệ với các thành phần còn lại.",
      "• Giữ identity, công năng và cấu tạo của từng thành phần; chỉ điều phối quan hệ không gian khi cần thiết."
    );
  }

  body.push(
    "",
    "BỐI CẢNH",
    "• Ý đồ của Ốc: " + ((brief || "").trim() || "Không có yêu cầu bổ sung."),
    "• Lựa chọn ý đồ thiết kế: " + (Object.entries(relevantParams).filter(([k,v]) => v && !k.endsWith("Meaning")).map(([k,v]) => k + "=" + v).join(" | ") || "Không có"),
    "• Ý nghĩa chuyên môn của ý đồ thiết kế: " + (Object.entries(relevantParams).filter(([k,v]) => v && k.endsWith("Meaning")).map(([k,v]) => k + "=" + v).join(" | ") || "Không có"),
    "",
    "KHÓA BẢO TOÀN",
    ...modeData.safeguards.map(x => "• " + x),
    ...expert.qualityGates.map(x => "• " + x),
    "• Giữ nguyên toàn bộ các lĩnh vực không nằm trong phạm vi chỉnh sửa.",
    "• Không giải quyết vấn đề bằng cách thay đổi phạm vi chuyên môn của chuyên gia khác.",
    "",
    "ĐỊNH DẠNG THEO NỀN TẢNG AI",
    "• Nền tảng AI: " + aiTarget,
    "• Cách định dạng: " + adapter.format,
    "• Cấu trúc: " + adapter.order.join(" → "),
    "• Bộ định dạng: " + (aiProfile || "Sử dụng cấu trúc phù hợp với nền tảng AI đã chọn."),
    "",
    "ĐẦU RA",
    "Chỉ trả về một yêu cầu chỉnh sửa ảnh hoàn chỉnh, rõ ràng và có thể sử dụng ngay. Không tạo ảnh."
  );

  return {analysis, reasoning, prompt: body.join("\n")};
}
