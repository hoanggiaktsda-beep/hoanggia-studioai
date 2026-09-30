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
      "BOUNDARY: identify exactly which surface or material system is allowed to change.",
      "READ: infer substrate, thickness, grain/vein direction, scale and adjacent material relationships.",
      "SPECIFY: define material family, finish, roughness, reflectance and texture behavior.",
      "CONNECT: preserve reveals, seams, edge thickness and junction logic.",
      "DELIVER: describe only the material intervention; do not redesign furniture, lighting or camera."
    ],
    qualityGates: [
      "No texture pasted across unrelated surfaces.",
      "No broken grain/vein direction at corners or joins.",
      "No impossible thickness, floating layers or fake edge treatment.",
      "No furniture silhouette, lighting or camera redesign."
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
      "READ: identify existing daylight, architectural and decorative sources.",
      "HIERARCHY: establish primary, secondary and accent light roles without changing objects.",
      "SHAPE: control direction, falloff, exposure, contrast, bounce and contact shadows.",
      "BELIEVE: keep visible emitters, reflections and shadow direction physically consistent.",
      "DELIVER: describe only the lighting intervention; do not redesign furniture, materials or camera."
    ],
    qualityGates: [
      "No contradictory shadow directions.",
      "No glowing edges or light sources without plausible origin.",
      "No flat uniform illumination or clipped highlights.",
      "No furniture, material or camera redesign."
    ]
  },

  Camera: {
    name: "Iwan Baan",
    role: "Nhiếp ảnh gia kiến trúc",
    label: "GÓC NHÌN MÁY ẢNH BAAN",
    source: "Kiến trúc · bối cảnh con người · câu chuyện · cảm nhận không gian",
    scope: "Chỉ quyết định về máy ảnh: position, height, yaw, pitch, lens/FOV, framing, perspective, verticals và spatial narrative.",
    lockedDomains: ["furniture_design", "material_selection", "lighting_design", "architecture_geometry"],
    principles: [
      "Photograph the space as architecture with a sense of life and context, not as a sterile catalog object.",
      "Choose viewpoint, height and lens to explain spatial relationships and hierarchy.",
      "Preserve believable perspective, verticals, depth and the actual proportions of the built environment.",
      "Frame the image so the architecture remains the story while selected furniture or material becomes the visual subject."
    ],
    decisions: {
      view: "Start from the spatial story: what relationship between architecture, furniture and circulation should the frame reveal?",
      lens: "Use the narrowest field of view that communicates the required space without exaggerated perspective.",
      height: "Set camera height from the architectural narrative rather than arbitrary eye-level defaults."
    },
    protocol: [
      "LOCATE: choose camera position from the spatial relationship the user wants to reveal.",
      "HEIGHT: set camera height according to architectural narrative and human context.",
      "LENS: choose the narrowest useful FOV before considering a wider lens.",
      "FRAME: control verticals, vanishing points, foreground, depth and subject hierarchy.",
      "DELIVER: describe only the camera intervention; do not move objects or redesign lighting/materials."
    ],
    qualityGates: [
      "No fisheye distortion unless explicitly requested.",
      "No leaning verticals when architectural correction is required.",
      "No invented room depth or changed object positions to manufacture the composition.",
      "No furniture, material or lighting redesign."
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
