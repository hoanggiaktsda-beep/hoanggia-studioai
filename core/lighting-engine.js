/*
 * HOANGGIA AI — INGO MAURER LIGHTING DECISION ENGINE
 * Independent lighting reasoning only.
 */

const SOURCE_PROFILES = {
  "Toàn cảnh": {
    source: "read daylight, architectural and decorative sources as separate systems",
    direction: "establish a coherent dominant direction before secondary fill",
    role: "balance functional visibility with a clear atmospheric hierarchy"
  },
  "Đèn trần": {
    source: "ceiling-mounted or recessed source with plausible fixture origin",
    direction: "define beam spread and downward contribution without flattening the room",
    role: "functional or architectural layer, depending on the user's brief"
  },
  "Đèn hắt": {
    source: "concealed linear or indirect source with a believable cavity/reflection path",
    direction: "graze or bounce from the intended architectural surface",
    role: "secondary/accent layer that reveals depth"
  },
  "Đèn trang trí": {
    source: "visible decorative emitter with physically plausible housing and emission",
    direction: "use local pools of light and controlled falloff",
    role: "accent and emotional focus rather than general illumination"
  },
  "Ánh sáng tự nhiên": {
    source: "sun/sky/daylight entering through existing openings",
    direction: "derive direction from the actual opening and time-of-day intent",
    role: "primary environmental layer when explicitly requested"
  },
  "Vùng ánh sáng": {
    source: "localized lighting intervention inside the existing scene",
    direction: "shape a defined pool, gradient or accent zone",
    role: "focus attention without moving objects"
  },
  "Khác": {
    source: "infer only from the user's brief and visible scene evidence",
    direction: "choose one coherent dominant direction before adding secondary sources",
    role: "follow the requested lighting function and atmosphere"
  }
};

const GENERIC_PROFILE = {
  source: "existing or explicitly requested physical light source",
  direction: "establish a coherent dominant direction",
  role: "support the requested functional and atmospheric hierarchy"
};

function profileFor(target) {
  return SOURCE_PROFILES[target] || GENERIC_PROFILE;
}

function selectedValue(decisions, key, fallback) {
  return decisions && decisions[key] ? decisions[key] : fallback;
}

export function lightingDirection() {
  return {
    hierarchy: [
      "Separate daylight, architectural and decorative sources before changing intensity.",
      "Protect a primary light role and use secondary sources only when they have a clear purpose.",
      "Use light to reveal form and space without redesigning the objects being illuminated."
    ],
    realism: [
      "Every visible emitter needs a plausible physical origin.",
      "Shadow direction, reflection direction and light falloff must agree.",
      "Avoid uniform illumination, clipped highlights and artificial glow."
    ]
  };
}

export function lightingDecisionEngine({
  target = "Toàn cảnh",
  brief = "",
  decisions = {},
  analysis = {},
  referenceRoles = ""
} = {}) {
  const profile = profileFor(target);
  const mood = selectedValue(decisions, "mood",
    "Define the requested atmosphere without changing architecture, furniture, materials or camera.");
  const source = selectedValue(decisions, "source",
    "Separate daylight, architectural and decorative sources and give each a clear role.");
  const contrast = selectedValue(decisions, "contrast",
    "Protect meaningful shadows and gradients; avoid uniformly illuminated AI lighting.");

  const decisionSequence = [
    "1. LIGHT SOURCE — identify every relevant source and distinguish daylight, architectural, decorative and ambient contribution.",
    "2. HIERARCHY — decide primary, secondary and accent roles before changing intensity.",
    "3. DIRECTION — establish where the dominant light originates and keep its geometry coherent.",
    "4. FALLOFF — control beam spread, distance response, softness and bounce instead of using flat brightness.",
    "5. CONTRAST — preserve a readable relationship between illuminated zones and shadow zones.",
    "6. SHADOW — make shadow direction, softness, contact and occlusion physically consistent with the source.",
    "7. REFLECTION / BOUNCE — account for reflected light and visible source reflections without redesigning materials.",
    "8. ATMOSPHERE — shape mood, focus and emotional temperature through light alone.",
    "9. PRESERVATION — lock furniture, materials, architecture, camera and non-target light sources."
  ];

  const expertQuestions = [
    "What is the actual or requested light source, and where can it physically originate?",
    "Which source is primary, which are secondary, and which are only accents?",
    "What direction should the dominant light travel through the room?",
    "How quickly should intensity fall off with distance and surface orientation?",
    "Where should shadows remain visible instead of being filled away?",
    "Do contact shadows, cast shadows and reflections agree with the source direction?",
    "What bounce or reflected contribution is physically plausible without changing the material system?",
    "Which area should become the visual focus, and can that be achieved through light alone?",
    "What must remain unchanged because it belongs to another expert domain?"
  ];

  const checks = [
    "Source: " + profile.source,
    "Direction: " + profile.direction,
    "Role: " + profile.role,
    "Mood: " + mood,
    "Source hierarchy: " + source,
    "Contrast: " + contrast,
    "Reference discipline: " + (referenceRoles || "Use references only as lighting evidence; do not borrow furniture, material or camera decisions.")
  ];

  const qualityGates = [
    "Do not invent emitters, fixtures or openings that are not supported by the brief or visible scene.",
    "Do not create contradictory shadow directions.",
    "Do not add glowing edges or bloom without a plausible luminous source.",
    "Do not flatten the scene with uniform ambient illumination.",
    "Do not clip highlights merely to make the scene look brighter.",
    "Do not change furniture placement, silhouette, material selection, architecture or camera to improve the lighting.",
    "Do not use lighting to hide geometry errors or compensate for an unrelated domain.",
    "If source evidence is insufficient, prefer a conservative physically coherent lighting interpretation."
  ];

  return {
    target, brief, decisionSequence, expertQuestions, checks, qualityGates,
    profile, analysisLight: analysis.lighting || [],
    reasoning: {
      source: profile.source,
      hierarchy: source,
      direction: profile.direction,
      falloff: "Control distance response, beam spread and softness physically.",
      contrast,
      shadow: "Preserve cast, contact and occlusion shadows consistent with source direction.",
      reflectionBounce: "Use plausible reflected contribution without redesigning material properties.",
      atmosphere: mood,
      preservation: "Lock all non-lighting domains."
    }
  };
}


export function buildIndependentLightingPrompt({
  referenceName = "",
  targetName = "",
  brief = "",
  decisions = {},
  aiTarget = "ChatGPT Images"
} = {}) {
  if (!referenceName) throw new Error("EXPERT 03 cần HÌNH ẢNH THAM CHIẾU ánh sáng.");
  if (!targetName) throw new Error("EXPERT 03 cần HÌNH ẢNH NHẬN THAM CHIẾU.");

  const d = lightingDecisionEngine({
    target: decisions.target || "Toàn cảnh",
    brief,
    decisions,
    referenceRoles: "Chỉ dùng ảnh " + referenceName + " làm bằng chứng ánh sáng."
  });

  return [
    "HOANGGIA EDIT AI — EXPERT 03 / ÁNH SÁNG",
    "CHUYÊN GIA: Ingo Maurer · Lighting Intelligence",
    "TRẠNG THÁI: ĐỘC LẬP HOÀN TOÀN. Không nhận quyết định, ảnh tham chiếu hoặc dữ liệu chuyên môn từ Expert 01/02/04/05/06/07/08.",
    "",
    "ẢNH THAM CHIẾU ÁNH SÁNG: " + referenceName,
    "ẢNH NHẬN THAM CHIẾU: " + targetName,
    "",
    "NHIỆM VỤ:",
    "Phân tích hệ ánh sáng của ảnh tham chiếu và chuyển DUY NHẤT đặc tính ánh sáng sang ảnh nhận.",
    "Đọc: hướng sáng, nguồn sáng, độ mềm/cứng, cường độ, nhiệt độ màu, tương phản, phân bố sáng–tối, bóng đổ, phản xạ và bầu không khí.",
    "",
    "KHÓA BẢO TOÀN ẢNH NHẬN:",
    "- Giữ nguyên kiến trúc, hình học, nội thất, sản phẩm, vật liệu, tỷ lệ và kích thước.",
    "- Giữ nguyên camera, góc nhìn, phối cảnh, bố cục và vị trí vật thể.",
    "- Không sao chép nhân vật, đồ vật, vật liệu, kiến trúc hoặc bố cục từ ảnh tham chiếu ánh sáng.",
    "- Chỉ cập nhật phản ứng quang học cần thiết: vùng sáng/tối, bóng đổ, phản xạ, bounce light và exposure.",
    "",
    "QUY TRÌNH EXPERT 03:",
    ...d.decisionSequence,
    "",
    "KIỂM ĐỊNH:",
    ...d.qualityGates.map(x => "- " + x),
    brief.trim() ? "" : null,
    brief.trim() ? "YÊU CẦU BỔ SUNG CỦA KTS: " + brief.trim() : null,
    "",
    "ĐẦU RA DÀNH CHO: " + aiTarget
  ].filter(Boolean).join("\n");
}
