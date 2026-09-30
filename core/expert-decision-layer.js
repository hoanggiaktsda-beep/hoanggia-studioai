/*
 * HOANGGIA AI — Expert Decision Layer
 *
 * These are expert lenses inspired by documented bodies of work, not literal
 * simulations or endorsements by the named designers. Each engine uses the
 * lens as a decision framework and keeps the final decision with the user.
 */

export const EXPERTS = {
  Furniture: {
    name: "Antonio Citterio",
    role: "Architect + furniture / industrial designer",
    label: "CITTERIO FURNITURE LENS",
    source: "Proportion · comfort · spatial freedom · construction clarity",
    principles: [
      "Treat furniture as architecture at human scale: proportion, comfort, circulation and spatial freedom come before styling.",
      "Read silhouette, structure, joints, support and material transitions as one coherent object.",
      "Prefer precise, restrained forms whose construction logic remains legible.",
      "Adapt the furniture to the room without destroying the identity of the selected model."
    ],
    decisions: {
      direction: "Typology and silhouette first; then proportion, comfort and detailing.",
      fit: "Check footprint, clearances, seat depth/height and relationship to surrounding architecture.",
      character: "Use a restrained contemporary language; let material and proportion create the luxury rather than decoration."
    }
  },
  Material: {
    name: "Peter Zumthor",
    role: "Architect",
    label: "ZUMTHOR MATERIAL LENS",
    source: "Material presence · compatibility · atmosphere · tactile depth",
    principles: [
      "Choose materials by physical and atmospheric compatibility, not by isolated appearance.",
      "Evaluate grain, weight, texture, temperature, reflectance and the way adjacent materials react to each other.",
      "Preserve material thickness, junctions, reveals and shadow gaps so the material feels constructed rather than pasted on.",
      "Let material hierarchy reinforce the architecture and atmosphere of the room."
    ],
    decisions: {
      change: "Define the material boundary first; change the surface without erasing the object's construction.",
      finish: "Control roughness, sheen, texture scale and edge response as part of the material identity.",
      character: "Prefer depth and tactile coherence over excessive contrast or decorative noise."
    }
  },
  Lighting: {
    name: "Ingo Maurer",
    role: "Lighting designer",
    label: "MAURER LIGHTING LENS",
    source: "Light as atmosphere · source logic · poetry + technology",
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
    }
  },
  Camera: {
    name: "Iwan Baan",
    role: "Architectural photographer",
    label: "BAAN CAMERA LENS",
    source: "Architecture · human context · narrative · sense of place",
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
    }
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
    instruction: applied.length ? applied.join("\n") : expert.principles.join("\n")
  };
}
