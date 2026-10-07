/*
 * HOANGGIA AI — CITTERIO FURNITURE DECISION ENGINE
 *
 * Domain boundary:
 * This engine decides ONLY furniture intervention.
 * It does not decide material, lighting, camera or architecture.
 *
 * The logic is an architectural/industrial-design lens inspired by publicly
 * documented principles associated with Antonio Citterio, not a simulation
 * or impersonation of the person.
 */

const PROFILES = {
  "Sofa": {
    anatomy: ["seat count", "overall width/depth/height", "backrest height", "armrest form", "seat cushions", "base/legs"],
    ergonomics: ["seat height", "seat depth", "back support", "arm support", "clearance around seating"],
    circulation: ["primary passage", "distance to coffee table", "wall clearance", "adjacent-seat clearance"],
    construction: ["frame", "joinery", "upholstery build-up", "cushion support", "base/legs"],
    checks: ["preserve seating capacity unless explicitly requested", "keep realistic seat-to-table and seat-to-wall clearances", "maintain believable cushion thickness and upholstery tension"]
  },
  "Ghế đơn": {
    anatomy: ["seat width/depth", "backrest", "armrests", "base/legs", "upholstery"],
    ergonomics: ["seat height", "seat depth", "back angle", "arm height"],
    circulation: ["front clearance", "side clearance", "relationship to sofa/table"],
    construction: ["frame", "support", "upholstery", "base/legs"],
    checks: ["keep ergonomic sitting proportions", "match floor contact and orientation", "preserve arm/back relationship when a reference is specified"]
  },
  "Bàn trà": {
    anatomy: ["length/width/diameter", "height", "top thickness", "edge profile", "base/legs"],
    ergonomics: ["usable reach", "height relative to seating"],
    circulation: ["clearance from sofa", "walking path around table"],
    construction: ["top", "edge", "base", "support"],
    checks: ["maintain believable distance from sofa", "keep tabletop thickness realistic", "match floor contact and perspective"]
  },
  "Bàn ăn": {
    anatomy: ["table length/width", "height", "top thickness", "base/legs", "seating capacity"],
    ergonomics: ["table height", "leg/knee clearance", "usable dining depth"],
    circulation: ["chair pull-out zone", "walkway behind chairs"],
    construction: ["top", "apron/support", "base/legs", "load-bearing logic"],
    checks: ["preserve practical dining clearance", "maintain seating capacity unless explicitly requested", "keep leg/base geometry structurally believable"]
  },
  "Ghế ăn": {
    anatomy: ["seat height", "seat/back width", "backrest", "legs/base", "upholstery"],
    ergonomics: ["seat height", "back support", "leg/knee relationship to table"],
    circulation: ["chair spacing", "pull-out clearance", "walkway behind chair"],
    construction: ["frame", "back", "seat", "legs/joints"],
    checks: ["match dining table height", "preserve believable spacing between chairs", "maintain floor contact"]
  },
  "Giường": {
    anatomy: ["mattress size", "bed frame", "headboard", "side rails", "legs/base"],
    ergonomics: ["bed height", "access on each side", "headboard relationship"],
    circulation: ["bedside clearance", "foot clearance", "door/circulation relationship"],
    construction: ["frame", "slats/support", "headboard", "base"],
    checks: ["preserve mattress proportion", "maintain practical bedside clearances", "keep bedding physically supported"]
  },
  "Tủ / kệ": {
    anatomy: ["overall width/depth/height", "modules", "doors/drawers", "shelves", "base"],
    ergonomics: ["reach height", "door/drawer access"],
    circulation: ["front opening zone", "side clearance"],
    construction: ["carcass", "shelves", "doors/drawers", "base/wall fixing"],
    checks: ["preserve wall alignment and floor contact", "keep doors/drawers physically operable", "avoid impossible intersections with architecture"]
  },
  "Đèn": {
    anatomy: ["fixture type", "scale", "shade/body", "mounting", "light source"],
    ergonomics: ["human clearance", "task-light relationship"],
    circulation: ["head clearance", "passage clearance"],
    construction: ["mounting", "support", "cable/source logic"],
    checks: ["preserve mounting logic", "match scale to room and furniture", "keep light emission physically believable"]
  },
  "Khác": {
    anatomy: ["overall silhouette", "dimensions", "support/base", "functional parts"],
    ergonomics: ["human interaction with the object"],
    circulation: ["clearance required to use and pass"],
    construction: ["support", "joints", "load path", "contact with floor/wall"],
    checks: ["infer functional proportions from the image and description without inventing decorative redesign"]
  }
};

const DEFAULT_RULES = {
  replacement: "Chỉ thay thế đúng sản phẩm nội thất đã chọn.",
  identity: "Khi có nhiều ảnh model, hợp nhất chúng thành một nhận diện sản phẩm nhất quán.",
  proportion: "Giữ tỷ lệ nguyên bản của model trừ khi KTS chủ động cho phép điều chỉnh.",
  placement: "Dùng footprint và vị trí của đồ cũ làm neo không gian, trừ khi KTS yêu cầu vị trí mới.",
  construction: "Giữ cấu tạo, mối nối, hệ đỡ và tiếp xúc vật lý hợp lý.",
  preservation: "Bảo toàn toàn bộ vật thể không thuộc mục tiêu và kiến trúc xung quanh."
};

const SPATIAL_ORIENTATION_RULES = [
  "Ảnh model là Reference View để nhận dạng hình học, cấu tạo, vật liệu và tỷ lệ; KHÔNG phải hướng đặt trong ảnh đích.",
  "Tự phân tích diện ảnh: FRONT / REAR / LEFT / RIGHT / LONG SIDE / SHORT SIDE / 3-4 / TOP / BOTTOM / UNKNOWN.",
  "Nếu KTS xác nhận diện ảnh thủ công, dữ liệu KTS có ưu tiên tuyệt đối.",
  "Xác lập hệ trục LENGTH–WIDTH–HEIGHT từ toàn bộ ảnh tham chiếu và kích thước được cung cấp.",
  "Đọc trục, footprint, hướng và perspective của đồ cũ trong ảnh không gian.",
  "Map trục model vào trục đồ cũ rồi chiếu theo camera/perspective của ảnh gốc; Reference camera is NOT target camera.",
  "Nếu trục dài/rộng mâu thuẫn với đồ cũ, đánh dấu ORIENTATION CONFLICT và sửa trước khi xuất."
];

function normalize(text = "") {
  return String(text).trim().toLowerCase();
}

function hasReference(replacement = "", brief = "", model = {}) {
  const text = normalize([replacement, brief, JSON.stringify(model)].join(" "));
  return /reference|tham chiếu|model cung cấp|ảnh model|provided model|model standardization/.test(text);
}

function decisionValue(decisions, key) {
  return decisions?.[key] || "";
}

function resolvePolicy(params = {}, decisions = {}) {
  return {
    replacementMethod: params.replacementMethod || decisionValue(decisions, "intervention") || "Thay đúng model cung cấp",
    identityLock: params.identityLock || decisionValue(decisions, "identity") || "Giữ 100% hình dáng + cấu tạo",
    scalePolicy: params.scalePolicy || decisionValue(decisions, "fit") || "Giữ nguyên tỷ lệ model",
    placementPolicy: params.placementPolicy || decisionValue(decisions, "placement") || "Giữ đúng vị trí đồ cũ",
    construction: params.construction || decisionValue(decisions, "construction") || "Bảo toàn cấu tạo nguyên bản",
    modelMaterial: params.modelMaterial || "Giữ nguyên vật liệu model",
    priority: params.modelPriority || ""
  };
}

function classifyIntervention(policy) {
  const replacement = normalize(policy.replacementMethod);
  const identity = normalize(policy.identityLock);
  const scale = normalize(policy.scalePolicy);

  return {
    exactModel: replacement.includes("đúng model"),
    equivalentModel: replacement.includes("tương đương"),
    refineExisting: replacement.includes("tinh chỉnh"),
    absoluteIdentity: identity.includes("tuyệt đối"),
    flexibleSilhouette: identity.includes("ngôn ngữ"),
    fitAdjustment: !scale.includes("giữ nguyên")
  };
}

function buildReasoning(target, profile, policy, model = {}, referenceRoles = "") {
  const intervention = classifyIntervention(policy);
  const reference = hasReference("", "", model);

  const identity = reference || intervention.exactModel
    ? "The supplied model is the primary furniture identity; reconcile all supplied views into one consistent object and stop at the selected identity boundary."
    : "Follow the user's explicit furniture brief and the selected identity boundary without inventing unnecessary design changes.";

  const proportion = intervention.fitAdjustment
    ? "Adjust size only within the selected fit policy, then validate ergonomics, human scale and relationship to surrounding furniture."
    : "Keep the model's original proportions and do not resize it merely to fill the room.";

  const placement = normalize(policy.placementPolicy).includes("lưu thông")
    ? "Optimize position only enough to maintain believable circulation while preserving the furniture's design."
    : normalize(policy.placementPolicy).includes("footprint")
      ? "Keep the existing footprint as the placement anchor."
      : "Match the previous furniture position and contact with floor/wall/adjacent objects.";

  return {
    target,
    identity,
    proportion,
    placement,
    construction: "Validate the selected object profile against the chosen construction-fidelity level; preserve support, joints, thickness, contact and visible structural logic.",
    circulation: profile.circulation.join(", "),
    ergonomics: profile.ergonomics.join(", "),
    referenceRoles: referenceRoles || "No image-role metadata.",
    modelPriority: model.modelPriority || "Not specified."
  };
}

export function furnitureDirection(target, replacement = "", brief = "", params = {}, decisions = {}, model = {}, referenceRoles = "") {
  const profile = PROFILES[target] || PROFILES["Khác"];
  const policy = resolvePolicy(params, decisions);
  const intervention = classifyIntervention(policy);
  const reasoning = buildReasoning(target, profile, policy, model, referenceRoles);
  const reference = hasReference(replacement, brief, model);

  return {
    target,
    scope: "Chỉ nội thất / Furniture only",
    promptLanguage: "Vietnamese-first; giữ thuật ngữ kỹ thuật tiếng Anh khi cần.",
    spatialOrientation: SPATIAL_ORIENTATION_RULES,
    anatomy: profile.anatomy,
    ergonomics: profile.ergonomics,
    circulation: profile.circulation,
    construction: profile.construction,
    checks: profile.checks,
    policy,
    intervention,
    reasoning,
    referenceRule: reference
      ? "Treat all supplied model images as multiple views of one primary furniture model. Preserve silhouette, construction language and distinctive details at the user's selected lock level."
      : "Follow the user's furniture description while preserving the selected object's footprint and functional logic.",
    editRule: DEFAULT_RULES.replacement + " " + DEFAULT_RULES.preservation,
    realism: "Khớp tỷ lệ, perspective, điểm tiếp xúc, occlusion, seams, joints và bóng đổ với ảnh không gian gốc.",
    expertQuestions: [
      "What is the exact functional typology of the target object?",
      "Which silhouette and construction features identify the supplied model?",
      "What dimensions are functionally non-negotiable?",
      "What clearances are required for human use and circulation?",
      "Which parts must remain unchanged under the selected identity lock?",
      "Can the replacement be physically supported, contacted and constructed?",
      "Is any requested adjustment solving fit, or unnecessarily redesigning the model?"
    ],
    decisionSequence: [
      "1. TARGET — isolate the selected furniture object.",
      "2. IDENTITY — reconstruct one model identity from every supplied reference view.",
      "3. FUNCTION — preserve typology, capacity and ergonomic relationships.",
      "4. PROPORTION — validate dimensions against human scale and surrounding furniture.",
      "5. CIRCULATION — validate clearances and object footprint.",
      "6. CONSTRUCTION — validate frame, support, joints, thickness and floor/wall contact.",
      "7. PLACEMENT — integrate into the existing scene without moving unrelated objects.",
      "8. PRESERVATION — stop the intervention at the selected identity/fit boundary."
    ],
    qualityGates: [
      "Never mix components from unrelated reference models.",
      "Never change the furniture into a generic AI substitute when a supplied model exists.",
      "Never alter architecture or non-target objects to make the furniture fit.",
      "Never solve a furniture problem by changing material, lighting or camera.",
      "Never let a model-reference preference silently override the five explicit Furniture decisions.",
      "Never create impossible human-scale dimensions, unsupported structure or blocked circulation.",
      "Never add decorative details that are not justified by the supplied model or user brief.",
      "ORIENTATION GATE — Reference camera ≠ Target camera. Không lấy hướng chụp ảnh model làm hướng đặt sản phẩm.",
      "AXIS GATE — LENGTH / WIDTH / HEIGHT phải map đúng với trục đồ cũ; nếu mâu thuẫn phải sửa trước khi xuất."
    ]
  };
}
