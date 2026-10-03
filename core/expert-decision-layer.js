/*
 * HOANGGIA AI — EXPERT DECISION SYSTEMS
 *
 * Five independent expert lenses. They never exchange decisions.
 * Each expert reads only the user's intent + scene/reference evidence
 * relevant to its own domain, then returns a production constraint set.
 *
 * These are design lenses inspired by publicly documented bodies of work,
 * not literal simulations, endorsements, or impersonations.
 */

export const EXPERTS = {
  Furniture: {
    name: "Antonio Citterio",
    role: "Kiến trúc sư + nhà thiết kế nội thất / công nghiệp",
    label: "GÓC NHÌN NỘI THẤT CITTERIO",
    source: "Tỷ lệ · công năng · tự do không gian · logic cấu tạo",
    scope: "Chỉ quyết định về đồ nội thất: typology, silhouette, tỷ lệ, công năng, công thái học, cấu tạo, vị trí và tiếp xúc.",
    lockedDomains: ["material", "lighting", "camera", "architecture"],
    principles: [
      "Treat furniture as architecture at human scale: proportion, comfort, circulation and spatial freedom come before styling.",
      "Read silhouette, structure, joints, support and material transitions as one coherent object.",
      "Prefer precise, restrained forms whose construction logic remains legible.",
      "Adapt the furniture to the room without destroying the identity of the selected model."
    ],
    decisions: {
      intervention: "Treat the selected intervention type as the boundary of the furniture edit; do not expand the task into redesign.",
      identity: "Use the selected identity level as the hard recognition boundary for silhouette, structure and distinctive details.",
      fit: "Resolve size only within the selected fit policy, validating human scale, ergonomics and relationship to surrounding furniture.",
      placement: "Resolve placement only within the selected circulation policy, preserving the surrounding scene and avoiding unnecessary relocation.",
      construction: "Preserve the selected level of construction fidelity, including support, joints, thickness, contact and visible structural logic."
    },
    protocol: [
      "IDENTIFY: determine the exact target object and its functional typology.",
      "RECONSTRUCT: read every supplied reference image as a view of the same model and reconcile silhouette, structure and distinctive details.",
      "FIT: place the model using believable human scale, floor contact, circulation and clearances.",
      "PRESERVE: keep model identity locked at the user's selected preservation level.",
      "DELIVER: describe only the furniture intervention; do not redesign material, lighting or camera."
    ],
    qualityGates: [
      "No generic replacement when a supplied model is provided.",
      "No mixed parts from unrelated references.",
      "No impossible seat/table/bed heights, intersections or unsupported geometry.",
      "No change to non-target furniture or architecture."
    ]
  },

  Material: {
    name: "Peter Zumthor",
    role: "Kiến trúc sư",
    label: "GÓC NHÌN VẬT LIỆU ZUMTHOR",
    source: "Hiện diện vật liệu · tương thích · không khí · chiều sâu xúc giác",
    scope: "Chỉ quyết định về vật liệu: boundary, substrate, texture, grain/vein, thickness, finish, reflectance, junction và tactile atmosphere.",
    lockedDomains: ["furniture_design", "lighting_design", "camera", "architecture_geometry"],
    principles: [
      "Choose materials by physical and atmospheric compatibility, not by isolated appearance.",
      "Evaluate grain, weight, texture, temperature, reflectance and the way adjacent materials react to each other.",
      "Preserve material thickness, junctions, reveals and shadow gaps so the material feels constructed rather than pasted on.",
      "Let material hierarchy reinforce the architecture and atmosphere of the room."
    ],
    decisions: {
      boundary: "Define the exact material boundary first and keep geometry and construction outside that boundary locked.",
      finish: "Control roughness, sheen, texture scale, grain or vein direction and edge response as one material system.",
      junction: "Resolve seams, corners, edge returns, reveals and material continuity without redesigning the object."
    },
    protocol: [
      "BOUNDARY: isolate the exact surface, layer or material system allowed to change.",
      "SUBSTRATE: identify what physically carries the visible finish; do not replace construction to fake appearance.",
      "TEXTURE SCALE: establish grain, pore, weave, vein or aggregate scale from the real target dimensions.",
      "FINISH: determine roughness, sheen, reflectance, color depth and micro-surface response.",
      "JUNCTION: resolve seams, corners, edge returns, reveals, thickness and transitions.",
      "AGING / IMPERFECTION: allow restrained natural variation only where physically plausible.",
      "ATMOSPHERE: evaluate tactile and reflective character without changing the lighting design.",
      "PRESERVATION: lock geometry, furniture identity, lighting, camera and non-target materials."
    ],
    qualityGates: [
      "No texture pasted beyond the explicit material boundary.",
      "No substrate, thickness or geometry change unless construction change is explicitly requested.",
      "No texture scale that contradicts the physical size of the target.",
      "No broken grain/vein/weave/module direction at visible joins.",
      "No invented cracks, stains, patina or distressing unsupported by the material brief.",
      "No color-only overlay: preserve roughness, depth, edge response and reflectance.",
      "No furniture silhouette, lighting, camera or architecture redesign."
    ]
  },

  Lighting: {
    name: "Ingo Maurer",
    role: "Nhà thiết kế ánh sáng",
    label: "GÓC NHÌN ÁNH SÁNG MAURER",
    source: "Ánh sáng như không khí · logic nguồn sáng · thi vị + công nghệ",
    scope: "Chỉ quyết định về ánh sáng: source, direction, hierarchy, intensity, color temperature, contrast, shadow, bounce và visual focus.",
    lockedDomains: ["furniture_design", "material_selection", "camera", "architecture_geometry"],
    principles: [
      "Treat light as a designed experience, not merely brightness.",
      "Balance functional visibility with atmosphere, shadow, contrast and emotional focus.",
      "Keep every visible source, reflection and shadow physically believable.",
      "Use light to reveal material, form and spatial hierarchy without flattening the scene."
    ],
    decisions: {
      mood: "Define the intended atmosphere first, then shape it through light rather than object or material changes.",
      source: "Separate daylight, architectural and decorative sources and give each a clear role.",
      contrast: "Protect meaningful shadows, gradients and falloff; avoid the uniformly illuminated AI look."
    },
    protocol: [
      "LIGHT SOURCE: identify daylight, architectural, decorative and ambient sources before changing intensity.",
      "HIERARCHY: assign primary, secondary and accent roles without changing objects.",
      "DIRECTION: establish a coherent dominant light origin and path.",
      "FALLOFF: control beam spread, distance response and softness rather than flat brightness.",
      "CONTRAST: preserve meaningful gradients between illuminated and shadow zones.",
      "SHADOW: keep cast, contact and occlusion shadows consistent with source direction.",
      "REFLECTION / BOUNCE: account for plausible reflected contribution without redesigning materials.",
      "ATMOSPHERE: shape mood and visual focus through light alone.",
      "PRESERVATION: lock furniture, materials, architecture, camera and non-target light sources."
    ],
    qualityGates: [
      "No invented emitters, fixtures or openings unsupported by the brief or scene.",
      "No contradictory shadow directions.",
      "No glowing edges or bloom without a plausible luminous source.",
      "No flat uniform illumination or clipped highlights.",
      "No lighting used to hide geometry errors or solve another domain.",
      "No furniture, material, architecture or camera redesign."
    ]
  },

  Camera: {
    name: "Iwan Baan",
    role: "Nhiếp ảnh gia kiến trúc",
    label: "GÓC NHÌN MÁY ẢNH BAAN",
    source: "Kiến trúc · bối cảnh con người · câu chuyện · cảm nhận không gian",
    scope: "Chỉ quyết định về máy ảnh: spatial intent, position, height, yaw, pitch, lens/FOV, framing, perspective, verticals, depth và narrative.",
    lockedDomains: ["furniture_design", "material_selection", "lighting_design", "architecture_geometry"],
    principles: [
      "Photograph architecture as lived space and spatial context, not as a sterile catalog object.",
      "Choose viewpoint, height and lens to explain spatial relationships, hierarchy and human scale.",
      "Preserve believable perspective, verticals, depth and the actual proportions of the built environment.",
      "Use framing as a narrative tool while changing only the camera and never staging the scene."
    ],
    decisions: {
      view: "Define the spatial story the frame must communicate before choosing camera position and framing.",
      lens: "Use the narrowest useful FOV that reveals the intended relationship while protecting spatial truth.",
      height: "Choose camera height and framing from human scale and architectural narrative rather than arbitrary presets."
    },
    protocol: [
      "SPATIAL INTENT: define the exact architectural relationship the frame must reveal.",
      "POSITION: locate the camera without relocating furniture, architecture or other scene elements.",
      "HEIGHT: choose a believable human-context height that supports the spatial narrative.",
      "LENS / FOV: select the narrowest useful field of view before introducing controlled wide perspective.",
      "PERSPECTIVE: preserve believable depth, scale and vanishing-point behavior.",
      "FRAMING: establish foreground, subject and background hierarchy.",
      "VERTICAL CONTROL: keep walls, openings and built-ins geometrically credible; correct perspective without redesigning architecture.",
      "DEPTH: use real overlap and perspective to communicate near/mid/far layers; never invent room volume.",
      "NARRATIVE: make the frame explain architecture, context and spatial relationships.",
      "PRESERVATION: lock furniture, materials, lighting and architecture; only the camera may change."
    ],
    qualityGates: [
      "No fisheye distortion unless explicitly requested.",
      "No exaggerated wide-angle stretching at frame edges.",
      "No leaning architectural verticals when correction is required.",
      "No invented room depth, openings or changed object positions.",
      "No impossible camera placement through walls, objects or built-ins.",
      "No furniture, material or lighting redesign to manufacture the composition.",
      "No arbitrary depth-of-field blur that hides important spatial relationships."
    ]
  },

  Removal: {
    name: "John Knoll",
    role: "Chuyên gia chỉnh sửa hình ảnh · Object Removal · Scene Reconstruction",
    label: "GÓC NHÌN CHỈNH SỬA KNOLL",
    source: "Object removal · compositing · reconstruction · cleanup",
    scope: "Chỉ loại bỏ vật thể được chỉ định và phục hồi vùng nền bị che khuất. Không thay thế vật thể, không thiết kế lại không gian.",
    lockedDomains: ["furniture_replacement", "material_design", "lighting_design", "camera", "architecture_geometry"],
    principles: [
      "Remove only explicitly selected objects and treat every unselected element as locked.",
      "Reconstruct occluded background from surrounding visual evidence rather than inventing a new design.",
      "Remove only shadows and reflections attributable to the removed object.",
      "Maintain material continuity, joints, perspective, texture scale and lighting continuity across the reconstructed region."
    ],
    decisions: {
      object: "Identify exactly the object or objects authorized for removal; when Khác is selected, use the user's custom description as the authority.",
      scope: "Keep removal inside the selected object boundary and only include attached accessories when explicitly authorized.",
      reconstruction: "Rebuild only the newly exposed region using nearby visual evidence and the simplest physically plausible continuation.",
      cleanup: "Remove object-specific contact shadows and reflections only to the selected cleanup level.",
      preservation: "Treat architecture, camera, lighting, materials and every unselected object as hard locks."
    },
    protocol: [
      "OBJECT IDENTIFICATION: identify the exact selected object, location and distinguishing features.",
      "BOUNDARY / MASK: isolate only the authorized object and directly attached pixels.",
      "OCCLUSION: determine which floor, wall, baseboard or other existing surface was hidden by the object.",
      "REMOVE: eliminate the selected object completely without inserting a replacement.",
      "BACKGROUND RECONSTRUCTION: continue existing surfaces from surrounding evidence with correct perspective and material continuity.",
      "SHADOW / REFLECTION CLEANUP: remove only effects caused by the deleted object.",
      "EDGE CONTINUITY: verify seams, joints, grain, texture, lines and boundaries through the reconstructed area.",
      "PRESERVATION: compare all unselected elements against the source and keep them unchanged.",
      "DELIVER: produce a removal-only instruction with no redesign or unrelated cleanup."
    ],
    qualityGates: [
      "No residual fragments, feet, edges, shadows or reflections from the selected object.",
      "No replacement furniture, decor or invented object in the cleared area.",
      "No invented architecture or complex detail when source evidence is insufficient.",
      "No broken floor, wall, baseboard, joint, grain, texture or perspective continuity.",
      "No changes to unselected objects, materials, lighting, camera or architecture.",
      "When evidence is uncertain, use minimal plausible reconstruction continuous with surrounding surfaces."
    ]
  },

  SpaceSync: {
    name: "Đồng bộ hóa không gian",
    role: "Hệ thống tổng hợp 4 Expert thiết kế — Citterio · Zumthor · Maurer · Baan",
    label: "GÓC NHÌN ĐỒNG BỘ KHÔNG GIAN",
    source: "Tổng hợp: tỷ lệ & công năng · hiện diện vật liệu · ánh sáng · kiến trúc & nhiếp ảnh",
    scope: "Tổng hợp có chủ đích từ 4 Expert độc lập trước đó để đọc và đồng bộ toàn bộ không gian như một hệ thống. Không phải Expert thứ 5 độc lập về trường phái; đây là lớp tổng hợp các nguyên tắc Citterio, Zumthor, Maurer và Baan.",
    lockedDomains: [],
    composedOf: ["Furniture — Antonio Citterio", "Material — Peter Zumthor", "Lighting — Ingo Maurer", "Camera — Iwan Baan"],
    principles: [
      "Citterio: kiểm soát tỷ lệ, công năng, ergonomics, silhouette, cấu tạo và tự do lưu thông của nội thất.",
      "Zumthor: kiểm soát quan hệ vật liệu, texture, chiều sâu, mối nối, phản xạ và sự hiện diện xúc giác.",
      "Maurer: kiểm soát nguồn sáng, hướng sáng, tương phản, bóng đổ, phản xạ và không khí của không gian.",
      "Baan: kiểm soát vị trí nhìn, chiều cao, tiêu cự, phối cảnh, khung hình và câu chuyện không gian.",
      "Tổng hợp 4 lớp thành một hệ đồng bộ: không tối ưu một lớp nếu làm phá vỡ sự cân bằng của các lớp còn lại."
    ],
    decisions: {
      alignment: "Đồng bộ trục kiến trúc, vị trí nội thất, điểm nhấn vật liệu, nguồn sáng và logic khung nhìn.",
      proportion: "Cân bằng tỷ lệ nội thất theo thể tích kiến trúc, vật liệu và cảm nhận qua góc nhìn.",
      circulation: "Bảo vệ công năng, ergonomics, khoảng lưu thông và khoảng thở của toàn bộ không gian.",
      material: "Điều phối hierarchy vật liệu, texture, mối nối và phản xạ để hỗ trợ hình khối và ánh sáng.",
      lighting: "Điều phối nguồn sáng, tương phản, bóng đổ và phản xạ để làm rõ hình khối và vật liệu.",
      camera: "Điều phối viewpoint, chiều cao, lens, perspective và framing để thể hiện đúng hệ không gian.",
      hierarchy: "Thiết lập hierarchy chung giữa kiến trúc, nội thất, vật liệu, ánh sáng và góc nhìn."
    },
    protocol: [
      "01 — CITTERIO / NỘI THẤT: đọc tỷ lệ, công năng, ergonomics, cấu tạo và lưu thông.",
      "02 — ZUMTHOR / VẬT LIỆU: đọc chất liệu, texture, chiều sâu, mối nối và phản ứng giữa các bề mặt.",
      "03 — MAURER / ÁNH SÁNG: đọc nguồn sáng, hướng sáng, tương phản, bóng đổ, phản xạ và atmosphere.",
      "04 — BAAN / GÓC NHÌN: đọc viewpoint, chiều cao, lens, perspective, framing và narrative.",
      "05 — SYNCHRONIZE: đối chiếu 4 lớp và giải quyết xung đột bằng quan hệ không gian, không bằng cách xóa bỏ identity của từng lớp.",
      "06 — HIERARCHY: xác định vai trò chính, phụ và nền cho toàn bộ không gian.",
      "07 — PRESERVE: giữ kiến trúc, công năng, identity và các chi tiết được chỉ định.",
      "08 — DELIVER: xuất một yêu cầu chỉnh sửa thống nhất, trong đó 4 Expert hỗ trợ nhau nhưng không biến thành 4 thay đổi rời rạc."
    ],
    qualityGates: [
      "Không được gọi đây là một trường phái hay cá nhân thiết kế thứ năm.",
      "Mọi quyết định tổng hợp phải truy được về ít nhất một trong 4 Expert: Citterio, Zumthor, Maurer hoặc Baan.",
      "Không để nội thất, vật liệu, ánh sáng hoặc camera phá vỡ tỷ lệ và logic của các lớp còn lại.",
      "Không dùng đồng bộ hóa để tự ý thay đổi kiến trúc hoặc tạo ra hình học không có trong ảnh.",
      "Giữ identity của các thành phần được cung cấp và chỉ điều chỉnh quan hệ giữa chúng khi cần.",
      "Nếu 4 lớp xung đột, ưu tiên giải pháp cân bằng toàn không gian thay vì tối ưu riêng một lớp."
    ]
  }
};

export function expertFor(mode) {
  return EXPERTS[mode] || EXPERTS.Furniture;
}

export function expertDecision(mode, decisions = {}) {
  const expert = expertFor(mode);
  const applied = Object.entries(decisions)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      const logic = expert.decisions[key];
      return logic ? `${key.toUpperCase()}: ${value} — ${logic}` : `${key.toUpperCase()}: ${value}`;
    });

  return {
    ...expert,
    applied,
    instruction: applied.length ? applied.join("\n") : expert.principles.join("\n"),
    protocol: expert.protocol,
    qualityGates: expert.qualityGates
  };
}
