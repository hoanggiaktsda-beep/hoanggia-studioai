/*
 * HOANGGIA AI — PETER ZUMTHOR MATERIAL DECISION ENGINE
 * Independent material reasoning only.
 */

const MATERIAL_PROFILES = {
  "Gỗ / veneer": {
    substrate: "solid wood, veneer over stable board, or existing timber substrate",
    texture: "read grain direction, pore scale, cut pattern and panel continuity",
    finish: "matte to low-sheen finish with believable pore response",
    junction: "respect edge banding, veneer return, reveals and panel joints",
    aging: "allow restrained tonal variation, grain irregularity and subtle wear"
  },
  "Đá / mặt bàn": {
    substrate: "rigid stone slab or existing stone substrate with structural support",
    texture: "read slab scale, mineral structure, vein direction and cut continuity",
    finish: "honed, matte, satin or polished only when physically consistent with the reference",
    junction: "preserve slab thickness, mitres, seams, edge profiles and support",
    aging: "allow natural mineral variation, tiny tonal shifts and restrained edge wear"
  },
  "Da / vải": {
    substrate: "upholstery body with believable padding and tension beneath the surface",
    texture: "read hide/fabric scale, grain, weave, nap and direction",
    finish: "control sheen, softness and compression response rather than applying flat color",
    junction: "preserve seams, piping, folds, tension zones and material transitions",
    aging: "allow subtle creasing, tonal variation and contact wear without artificial distressing"
  },
  "Kim loại": {
    substrate: "rigid metal component with believable thickness and support",
    texture: "read brushed, polished, bead-blasted or coated surface scale",
    finish: "control reflectance and roughness as a physical finish, not a color overlay",
    junction: "preserve bends, welds, fasteners, reveals and contact points when visible",
    aging: "allow restrained patina or micro-variation only when compatible with the selected finish"
  },
  "Tường": {
    substrate: "existing wall assembly and its actual plane",
    texture: "read plaster, paint, mineral, limewash or panel scale across the full plane",
    finish: "define sheen and tactile depth without changing wall geometry",
    junction: "preserve corners, skirtings, reveals, openings and termination lines",
    aging: "allow subtle tonal and tactile variation so the plane does not look digitally perfect"
  },
  "Sàn": {
    substrate: "existing floor build-up and structural plane",
    texture: "read plank, tile, slab or aggregate module at architectural scale",
    finish: "match foot-traffic wear, roughness and reflectance to the selected material",
    junction: "preserve thresholds, perimeter edges, grout lines and transitions",
    aging: "introduce restrained use variation without changing module geometry"
  },
  "Trần": {
    substrate: "existing ceiling plane or ceiling finish system",
    texture: "read surface continuity and texture scale at the room's viewing distance",
    finish: "avoid excessive gloss; keep reflectance appropriate to ceiling function",
    junction: "preserve coves, shadow gaps, service openings and perimeter details",
    aging: "keep variation subtle and subordinate to the architecture"
  },
  "Sofa": {
    substrate: "existing upholstery or furniture body; do not redesign its silhouette",
    texture: "read upholstery grain, weave, nap or leather character at object scale",
    finish: "match sheen and softness to the supplied/reference material",
    junction: "preserve seams, piping, folds and edge transitions",
    aging: "allow restrained natural compression and surface variation"
  },
  "Ghế đơn": {
    substrate: "existing upholstery or furniture body; geometry remains locked",
    texture: "read grain/weave/nap at human-contact scale",
    finish: "control sheen and tactile response without changing the object form",
    junction: "preserve upholstery transitions, seams and visible construction",
    aging: "use subtle contact variation only"
  },
  "Bàn trà": {
    substrate: "existing tabletop/body substrate; preserve dimensions and construction",
    texture: "read stone, wood, glass or metal texture at furniture scale",
    finish: "match roughness, sheen and edge response to the specified material",
    junction: "preserve tabletop edges, joints and support transitions",
    aging: "allow restrained surface variation without redesigning the table"
  },
  "Khác": {
    substrate: "infer only from visible evidence; never invent unsupported construction",
    texture: "match texture scale to the physical size of the target surface",
    finish: "specify roughness, sheen and reflectance from the intended material",
    junction: "preserve visible boundaries and construction logic",
    aging: "use restrained natural variation rather than decorative distressing"
  }
};

const GENERIC_PROFILE = {
  substrate: "existing physical substrate and construction",
  texture: "material texture must remain proportional to the actual surface",
  finish: "roughness, sheen and reflectance must describe a physical finish",
  junction: "preserve visible seams, edges, reveals and transitions",
  aging: "allow restrained natural variation without inventing damage"
};

export function materialDirection(analysis) {
  return {
    hierarchy: analysis.materials,
    rule: "Material hierarchy must support architecture rather than decorate it.",
    realism: [
      "Preserve scale, grain direction, edge thickness and realistic roughness.",
      "Avoid repeating textures and overly perfect surfaces.",
      "Make junctions, reveals, shadow gaps and transitions physically believable."
    ]
  };
}

function profileFor(target) {
  return MATERIAL_PROFILES[target] || GENERIC_PROFILE;
}

function selectedValue(decisions, key, fallback) {
  return decisions && decisions[key] ? decisions[key] : fallback;
}

export function materialDecisionEngine({
  target = "Khác",
  brief = "",
  decisions = {},
  analysis = {},
  material = "",
  referenceRoles = ""
} = {}) {
  const profile = profileFor(target);
  const boundary = selectedValue(decisions, "change",
    "Change only the explicitly selected material surface/system; keep all adjacent non-target materials unchanged.");
  const finish = selectedValue(decisions, "finish",
    "Control roughness, sheen, reflectance and texture scale as one physical finish.");
  const character = selectedValue(decisions, "character",
    "Prefer tactile depth, material continuity and restrained natural variation over decorative contrast.");

  const decisionSequence = [
    "1. MATERIAL BOUNDARY — isolate the exact surface, layer or material system allowed to change.",
    "2. SUBSTRATE — identify what physically carries the finish; never replace a substrate just to fake appearance.",
    "3. TEXTURE SCALE — establish grain, pore, weave, vein or aggregate scale from the actual object/surface size.",
    "4. FINISH — determine roughness, sheen, reflectance, color depth and micro-surface response.",
    "5. JUNCTION — resolve seams, corners, edge returns, reveals, thickness and transitions into adjacent materials.",
    "6. AGING / IMPERFECTION — introduce restrained natural variation, wear and irregularity only where physically plausible.",
    "7. ATMOSPHERE — evaluate how the material's tactile and reflective character contributes to the existing space without changing its lighting design.",
    "8. PRESERVATION — lock geometry, furniture identity, lighting setup, camera and every non-target material."
  ];

  const expertQuestions = [
    "What is the exact material boundary, and where does the intervention stop?",
    "What substrate or construction is physically underneath the visible finish?",
    "What is the correct texture scale relative to the real object, panel or architectural plane?",
    "How should grain, vein, weave, pores or aggregate continue through corners and seams?",
    "What finish controls the relationship between roughness, sheen and reflectance?",
    "Which imperfections belong naturally to this material, and which would become artificial noise?",
    "How should the material meet adjacent materials without changing their identity?",
    "Does the requested material change alter only surface appearance, or is there explicit evidence that thickness/construction must change?",
    "What must remain completely unchanged because it belongs to a locked domain?"
  ];

  const checks = [
    "Boundary: " + boundary,
    "Substrate: " + profile.substrate,
    "Texture: " + profile.texture,
    "Finish: " + finish + ". " + profile.finish,
    "Junction: " + profile.junction,
    "Aging / imperfection: " + profile.aging,
    "Atmosphere: " + character,
    "Reference discipline: " + (referenceRoles || "Use references only as material evidence; do not borrow furniture, lighting or camera decisions.")
  ];

  const qualityGates = [
    "Do not spread the selected material beyond its explicit boundary.",
    "Do not alter substrate, thickness or geometry unless the user explicitly requests a construction change.",
    "Do not use texture scale that contradicts the physical size of the target.",
    "Continue grain, vein, weave or module direction coherently through visible joins.",
    "Do not invent seams, cracks, stains, patina or distressing that the material does not naturally require.",
    "Do not change furniture silhouette, lighting setup, camera or architecture to make the material look better.",
    "Do not flatten material into a color-only overlay; preserve roughness, depth, edge response and reflectance.",
    "If evidence is insufficient, prefer conservative material continuity over invented construction."
  ];

  return {
    target, material: material || "Infer the selected material from the user's brief/reference only.",
    decisionSequence, expertQuestions, checks, qualityGates, profile,
    analysisMaterials: analysis.materials || [],
    reasoning: {
      boundary, substrate: profile.substrate, textureScale: profile.texture,
      finish, junction: profile.junction, aging: profile.aging,
      atmosphere: character, preservation: "Lock all non-material domains."
    }
  };
}
