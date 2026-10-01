/*
 * HOANGGIA AI — 4 EXPERT DECISION SYSTEMS
 *
 * Four independent expert lenses. They never exchange decisions.
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
      direction: "Establish the furniture typology and silhouette before refining proportion, comfort and detail.",
      fit: "Check footprint, clearances, seat depth/height and relationship to surrounding architecture.",
      character: "Keep the form restrained; luxury comes from proportion, material discipline and construction clarity."
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
      change: "Define the exact material boundary first; change the surface without erasing the object's construction.",
      finish: "Control roughness, sheen, texture scale, grain/vein direction and edge response as one material system.",
      character: "Prefer depth and tactile coherence over excessive contrast or decorative noise."
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
      mood: "Define the emotional atmosphere first, then build the light hierarchy.",
      source: "Separate daylight, architectural and decorative sources and give each a clear role.",
      contrast: "Protect meaningful shadows and gradients; avoid the uniformly illuminated AI look."
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
      view: "Define the spatial story the frame must communicate before choosing a camera position.",
      lens: "Use the narrowest useful FOV before widening; protect near-edge proportions and spatial truth.",
      height: "Choose camera height from human scale and architectural narrative rather than arbitrary presets."
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
