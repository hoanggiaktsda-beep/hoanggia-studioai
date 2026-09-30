import { analyzeBrief } from "./architectural-brain.js";
import { materialDirection } from "./material-engine.js";
import { cameraDirection } from "./camera-engine.js";
import { furnitureDirection } from "./furniture-engine.js";

export function buildDirection({ brief, mode, output, camera, target = "Khác", replacement = "" }) {
  const analysis = analyzeBrief(brief, mode, output, camera);
  const materials = materialDirection(analysis);
  const cam = cameraDirection(analysis, camera);
  const furniture = furnitureDirection(target, replacement, brief);

  const prompt = [
    "HOANGGIA AI — FURNITURE REPLACEMENT PROMPT",
    "",
    "EDIT INTENT",
    "Replace only the selected furniture in the provided interior image.",
    "Target: " + furniture.target,
    "Replacement: " + replacement,
    "",
    "FURNITURE-SPECIFIC REASONING",
    "Anatomy to control: " + furniture.anatomy.join(", "),
    ...furniture.checks.map(x => "• " + x),
    "Reference rule: " + furniture.referenceRule,
    "",
    "USER DIRECTION",
    brief.trim(),
    "",
    "MATERIAL + COLOR",
    materials.hierarchy.map(x => "• " + x).join("\n"),
    "Material rule: " + materials.rule,
    "",
    "SCALE + POSITION",
    "• Match the original furniture footprint and location unless a different size or position is explicitly requested.",
    "• Match human-scale proportions, surrounding clearances and relationship to adjacent furniture.",
    "",
    "PERSPECTIVE + INTEGRATION",
    "• " + furniture.realism,
    "• Match perspective, depth, occlusion and floor contact exactly to the original image.",
    "• Match existing light direction, color temperature, shadow softness and ambient bounce.",
    "",
    "CAMERA",
    cam,
    "",
    "ARCHITECTURE LOCK",
    "• Keep walls, floor, ceiling, windows, doors, openings and built-ins unchanged.",
    "• Keep the original camera angle, framing, focal perspective and image proportions.",
    "",
    "NON-TARGET LOCK",
    "• Preserve every non-target furniture item, decor object and architectural element.",
    "• Do not redesign, restyle or add unrelated objects.",
    "",
    "AI QUALITY CONTROL",
    "• No warped geometry.",
    "• No floating furniture.",
    "• No incorrect scale.",
    "• No duplicated legs, cushions, arms or structural parts.",
    "• No invented decorative details that conflict with the requested model.",
    "• The replacement must read as physically manufactured and naturally integrated into the scene."
  ].join("\n");

  return { analysis, furniture, prompt };
}
