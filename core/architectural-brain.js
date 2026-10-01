export const BRAIN = {
  role: "Neutral scene-context analyzer for the selected expert",
  principles: [
    "Reason before describing. Infer function, human scale, circulation, proportion and hierarchy before visual styling.",
    "Preserve existing architecture, walls, openings, ceiling height and original camera unless the user explicitly requests a change.",
    "Prioritise buildability, believable junctions, material thickness, joinery and realistic furniture proportions.",
    "Do not make cross-domain design decisions. The active expert alone owns the selected intervention domain.",
    "Avoid generic AI furniture, warped geometry, impossible construction, random luxury decoration and excessive styling."
  ],
  stages: [
    "TARGET FURNITURE",
    "REFERENCE MATCH",
    "SCALE + POSITION",
    "MATERIAL + COLOR",
    "LIGHT + SHADOW MATCH",
    "PERSPECTIVE MATCH",
    "ARCHITECTURE LOCK",
    "NON-TARGET PRESERVATION"
  ]
};

export function analyzeBrief(brief, mode, output, camera) {
  const text = brief.trim();
  const lower = text.toLowerCase();
  const inferred = {
    function: { Furniture: "Furniture-only intervention.", Material: "Material-only intervention.", Lighting: "Lighting-only intervention.", Camera: "Camera-only intervention.", SpaceSync: "Whole-space synchronization intervention." }[mode] || "Selected-domain intervention.",
    circulation: "Maintain clear primary circulation and believable furniture clearances.",
    proportion: "Use human-scale proportions and coherent relationships between furniture, openings and ceiling.",
    style: output === "Editorial" ? "Editorial architectural direction" : output === "Conceptual" ? "Conceptual but physically coherent" : "Refined, photoreal architectural visualization",
    materials: inferMaterials(lower),
    lighting: inferLighting(lower),
    camera: camera === "Preserve original camera" ? "Preserve original camera, framing and perspective." : camera,
    constraints: BRAIN.principles
  };
  return inferred;
}

function inferMaterials(text) {
  const found = [];
  const map = [
    ["veneer", "natural wood veneer"],
    ["gỗ", "natural wood / veneer"],
    ["đá", "natural stone"],
    ["travertine", "travertine"],
    ["marble", "marble / natural stone"],
    ["da bò", "genuine leather / cowhide"],
    ["da", "genuine leather"],
    ["kim loại", "refined metal accents"],
    ["kính", "architectural glass"]
  ];
  map.forEach(([key,value]) => { if (text.includes(key) && !found.includes(value)) found.push(value); });
  return found.length ? found : ["Controlled premium material palette with one primary, one secondary and restrained accents."];
}

function inferLighting(text) {
  if (text.includes("ấm") || text.includes("warm")) return "Warm layered lighting with controlled indirect light and realistic shadow depth.";
  if (text.includes("tự nhiên") || text.includes("daylight")) return "Natural daylight first, supported by subtle architectural lighting.";
  return "Layered architectural lighting with believable daylight, practical sources and controlled contrast.";
}
