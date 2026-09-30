const MODES = {
  "Furniture": {
    label: "Furniture Replacement",
    instruction: "Replace only the selected furniture while preserving the surrounding interior.",
    defaultTarget: "Sofa"
  },
  "Material": {
    label: "Material Change",
    instruction: "Change only the specified material or finish while preserving geometry, furniture form and spatial composition.",
    defaultTarget: "Surface / material"
  },
  "Lighting": {
    label: "Lighting Change",
    instruction: "Change the lighting atmosphere and light sources while preserving architecture, furniture geometry and materials unless explicitly requested.",
    defaultTarget: "Lighting"
  },
  "Camera": {
    label: "Camera / View Change",
    instruction: "Change the requested camera position, lens feel, framing or viewpoint while preserving the designed space and objects.",
    defaultTarget: "Camera"
  }
};

export function editModeDirection(mode, target, brief) {
  const config = MODES[mode] || MODES.Furniture;
  const text = (brief || "").toLowerCase();
  const safeguards = [];

  if (mode === "Material") {
    safeguards.push(
      "Do not change furniture geometry, dimensions, proportions or construction unless explicitly requested.",
      "Preserve the existing material boundaries and apply the new finish only to the requested target surfaces.",
      "Maintain realistic texture scale, grain direction, roughness, reflectivity, edge behavior and junctions."
    );
  }

  if (mode === "Lighting") {
    safeguards.push(
      "Do not redesign furniture or architecture to create the lighting effect.",
      "Preserve material appearance while adapting highlights, shadows, ambient bounce and color temperature consistently.",
      "Maintain physically believable light direction, intensity, falloff and contact shadows."
    );
  }

  if (mode === "Camera") {
    safeguards.push(
      "Do not redesign or relocate objects merely to suit the new view.",
      "Preserve the same design intent, dimensions and material identity from the original scene.",
      "Keep verticals, perspective and lens behavior architecturally believable unless distortion is explicitly requested."
    );
  }

  if (mode === "Furniture") {
    safeguards.push(
      "Replace only the target furniture.",
      "Preserve all non-target objects, architecture and the original camera.",
      "Match scale, floor contact, perspective, occlusion, lighting and shadows."
    );
  }

  return {
    mode,
    label: config.label,
    target: target || config.defaultTarget,
    instruction: config.instruction,
    safeguards,
    detectedIntent: text || "No additional direction."
  };
}

export { MODES };
