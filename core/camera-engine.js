export function cameraDirection(analysis, camera) {
  const presets = {
    "Preserve original camera": "LOCK original camera, lens feel, framing, perspective and major vanishing points.",
    "Eye level": "Eye-level architectural camera; natural perspective; avoid exaggerated wide-angle distortion.",
    "Wide architectural": "Moderately wide architectural lens; preserve verticals and spatial proportions; no fisheye distortion.",
    "Close material detail": "Controlled close-up focused on material, joinery and tactile detail with shallow but believable depth."
  };
  return presets[camera] || analysis.camera;
}
