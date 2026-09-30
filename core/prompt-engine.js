import { analyzeBrief } from "./architectural-brain.js";
import { materialDirection } from "./material-engine.js";
import { cameraDirection } from "./camera-engine.js";

export function buildDirection({ brief, mode, output, camera }) {
  const analysis = analyzeBrief(brief, mode, output, camera);
  const materials = materialDirection(analysis);
  const cam = cameraDirection(analysis, camera);

  const prompt = [
    "HOANGGIA AI — PRODUCTION PROMPT",
    "",
    "DESIGN INTENT",
    brief.trim(),
    "",
    "ARCHITECTURAL REASONING",
    "Function: " + analysis.function,
    "Circulation: " + analysis.circulation,
    "Proportion: " + analysis.proportion,
    "Style: " + analysis.style,
    "",
    "MATERIAL DIRECTION",
    materials.hierarchy.map(x => "• " + x).join("\n"),
    "Material rule: " + materials.rule,
    "",
    "LIGHTING",
    analysis.lighting,
    "",
    "CAMERA",
    cam,
    "",
    "CONSTRUCTION REALISM",
    ...materials.realism.map(x => "• " + x),
    "",
    "AI CONSTRAINTS",
    ...analysis.constraints.map(x => "• " + x)
  ].join("\n");

  return { analysis, prompt };
}
