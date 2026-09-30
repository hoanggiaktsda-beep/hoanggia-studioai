const PROFILES = {
  "Sofa": {
    anatomy: ["seat count", "overall width/depth/height", "backrest height", "armrest form", "seat cushions", "base/legs"],
    checks: ["preserve seating capacity unless explicitly requested", "keep realistic seat-to-table and seat-to-wall clearances", "maintain believable cushion thickness and upholstery tension"]
  },
  "Armchair / ghế đơn": {
    anatomy: ["seat width/depth", "backrest", "armrests", "base/legs", "upholstery"],
    checks: ["keep ergonomic sitting proportions", "match floor contact and orientation", "preserve arm/back relationship when a reference is specified"]
  },
  "Bàn trà": {
    anatomy: ["length/width/diameter", "height", "top thickness", "edge profile", "base/legs"],
    checks: ["maintain believable distance from sofa", "keep tabletop thickness realistic", "match floor contact and perspective"]
  },
  "Bàn ăn": {
    anatomy: ["table length/width", "height", "top thickness", "base/legs", "seating capacity"],
    checks: ["preserve practical dining clearance", "maintain seating capacity unless explicitly requested", "keep leg/base geometry structurally believable"]
  },
  "Ghế ăn": {
    anatomy: ["seat height", "seat/back width", "backrest", "legs/base", "upholstery"],
    checks: ["match dining table height", "preserve believable spacing between chairs", "maintain floor contact"]
  },
  "Giường": {
    anatomy: ["mattress size", "bed frame", "headboard", "side rails", "legs/base"],
    checks: ["preserve mattress proportion", "maintain practical bedside clearances", "keep bedding physically supported"]
  },
  "Tủ / kệ": {
    anatomy: ["overall width/depth/height", "modules", "doors/drawers", "shelves", "base"],
    checks: ["preserve wall alignment and floor contact", "keep doors/drawers physically operable", "avoid impossible intersections with architecture"]
  },
  "Đèn": {
    anatomy: ["fixture type", "scale", "shade/body", "mounting", "light source"],
    checks: ["preserve mounting logic", "match scale to room and furniture", "keep light emission physically believable"]
  },
  "Khác": {
    anatomy: ["overall silhouette", "dimensions", "support/base", "material"],
    checks: ["infer the object's functional proportions from the image and description"]
  }
};

export function furnitureDirection(target, replacement, brief) {
  const profile = PROFILES[target] || PROFILES["Khác"];
  const text = (brief || "").trim();
  const reference = /ảnh tham chiếu|reference|mẫu tham chiếu/i.test((replacement + " " + text));
  return {
    target,
    anatomy: profile.anatomy,
    checks: profile.checks,
    referenceRule: reference
      ? "Treat the supplied/reference furniture as the primary design authority. Match its silhouette, construction language, material placement and distinctive details; do not invent a different model."
      : "Follow the requested furniture description while preserving the selected object's existing footprint unless a new size is explicitly requested.",
    editRule: "Edit only the selected furniture. Do not alter unrelated objects or the surrounding architecture.",
    realism: "Match scale, perspective, contact points, occlusion, material response, seams/joints and shadows to the original scene."
  };
}
