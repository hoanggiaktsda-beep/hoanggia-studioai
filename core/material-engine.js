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
