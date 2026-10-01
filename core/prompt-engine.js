import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection, materialDecisionEngine} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";
import {expertDecision} from "./expert-decision-layer.js";

function scopedEvidence(mode, brief, target, params = {}) {
  const text = (brief || "").trim();
  const lines = [
    `USER INTENT: ${text || "No additional direction."}`,
    `TARGET: ${target || "Unspecified"}`,
    `MODE CONTROLS: ${Object.entries(params).map(([k,v]) => `${k}=${v}`).join(" | ") || "None"}`
  ];

  const scope = {
    Furniture: "Read scene evidence only to fit the target furniture. Do not infer new material, lighting or camera decisions.",
    Material: "Read scene evidence only to locate and construct the target material system. Do not infer new furniture, lighting or camera decisions.",
    Lighting: "Read scene evidence only to understand existing light sources and the target lighting change. Do not infer new furniture, material or camera decisions.",
    Camera: "Read scene evidence only to understand spatial relationships needed for the target view. Do not infer new furniture, material or lighting decisions."
  }[mode] || "";

  return [...lines, `EXPERT SCOPE: ${scope}`];
}

export function buildDirection({
  brief,
  mode,
  output,
  camera,
  target = "Khác",
  replacement = "",
  params = {},
  decisions = {},
  model = {},
  referenceRoles = ""
}) {
  const analysis = analyzeBrief(brief, mode, output, camera);
  const modeData = editModeDirection(mode, target, brief, params, decisions);
  const expert = expertDecision(mode, decisions);

  const reasoning = {
    target,
    authority: mode === "Furniture"
      ? "Scene A = spatial authority · Reference B = furniture design authority"
      : "Scene A = spatial authority · Reference = authority only for the selected expert domain",
    preserve: "Architecture, non-target objects and every domain outside the selected edit scope",
    expert: expert.name,
    expertRole: expert.role,
    independence: `Only ${expert.name} decides within the ${mode} domain. Other domains are locked.`
  };

  const decisionLines = Object.entries(decisions)
    .map(([k,v]) => "• " + k.toUpperCase() + ": " + v)
    .join("\n");

  const body = [];
  body.push(
    "HOANGGIA AI — " + expert.label,
    "",
    "EXPERT DECISION SYSTEM",
    "• Expert: " + expert.name + " — " + expert.role,
    "• Decision philosophy: " + expert.source,
    "• Scope: " + expert.scope,
    "• Independence: this expert cannot redesign another domain.",
    "• This is a design lens, not a literal simulation of the named expert.",
    "",
    "EXPERT PRINCIPLES",
    expert.principles.map(x => "• " + x).join("\n"),
    "",
    "EXPERT PROTOCOL",
    expert.protocol.map((x,i) => (i+1) + ". " + x).join("\n"),
    "",
    "DESIGN DECISIONS",
    decisionLines || "• Apply the expert principles to the user's intent.",
    "",
    "EXPERT DECISION LOGIC",
    expert.applied.length ? expert.applied.map(x => "• " + x).join("\n") : "• Apply the expert principles to the user's intent."
  );

  if (mode === "Furniture") {
    const f = furnitureDirection(target, replacement, brief, params, decisions, model, referenceRoles);
    body.push(
      "",
      "FURNITURE TARGET",
      "Replace only: " + target,
      "",
      "REFERENCE INTELLIGENCE",
      "• Scene A controls architecture, spatial context and non-target objects.",
      "• All supplied model images control only the selected furniture identity.",
      "• Reconcile multiple views into one coherent model; never mix unrelated models.",
      "",
      "FURNITURE DECISION SEQUENCE",
      f.decisionSequence.join("\n"),
      "",
      "FURNITURE REASONING",
      "• " + f.anatomy.join(", "),
      f.checks.map(x => "• " + x).join("\n"),
      "• " + f.referenceRule,
      "• " + f.editRule,
      "• " + f.realism,
      "",
      "FURNITURE EXPERT QUESTIONS",
      f.expertQuestions.map(x => "• " + x).join("\n")
    );
  } else if (mode === "Material") {
    const m = materialDirection(analysis);
    const md = materialDecisionEngine({target, brief, decisions, analysis, material: replacement, referenceRoles});
    body.push(
      "",
      "MATERIAL TARGET",
      "Change only: " + target,
      "",
      "MATERIAL INTELLIGENCE",
      m.hierarchy.map(x => "• " + x).join("\n"),
      "• " + m.rule,
      "• " + m.realism.join("\n• "),
      "",
      "MATERIAL DECISION SEQUENCE",
      md.decisionSequence.join("\n"),
      "",
      "MATERIAL REASONING",
      md.checks.map(x => "• " + x).join("\n"),
      "",
      "MATERIAL EXPERT QUESTIONS",
      md.expertQuestions.map(x => "• " + x).join("\n")
    );
  } else if (mode === "Lighting") {
    body.push(
      "",
      "LIGHTING TARGET",
      "• " + target,
      "",
      "LIGHTING INTELLIGENCE",
      "• Reason through source hierarchy, direction, falloff, exposure, bounce, contrast and contact shadows.",
      "• Preserve the physical origin of visible emitters, reflections and shadows."
    );
  } else {
    body.push(
      "",
      "VIEW TARGET",
      "• " + target,
      "",
      "CAMERA INTELLIGENCE",
      "• Reason through camera position, height, yaw, pitch, lens/FOV, framing and vanishing points.",
      "• Preserve actual room dimensions and object positions; camera change must not become a staging change."
    );
  }

  body.push(
    "",
    "SCOPED EVIDENCE",
    scopedEvidence(mode, brief, target, params).map(x => "• " + x).join("\n"),
    "",
    "USER INTENT",
    (brief || "").trim(),
    "",
    "PRESERVATION LOCK",
    ...modeData.safeguards.map(x => "• " + x),
    ...expert.qualityGates.map(x => "• QUALITY GATE: " + x),
    ...(mode === "Furniture" ? furnitureDirection(target, replacement, brief, params, decisions, model, referenceRoles).qualityGates.map(x => "• FURNITURE GATE: " + x) : []),
    ...(mode === "Material" ? materialDecisionEngine({target, brief, decisions, analysis, material: replacement, referenceRoles}).qualityGates.map(x => "• MATERIAL GATE: " + x) : []),
    "• Keep walls, floor, ceiling, windows, doors, openings and built-ins unchanged.",
    "• Preserve every non-target object unless explicitly included in the selected expert scope.",
    "",
    "MODEL / REFERENCE DATA",
    Object.keys(model).length ? Object.entries(model).map(([k,v]) => "• " + k + ": " + v).join("\n") : "• No standardized model data.",
    referenceRoles ? "• IMAGE ROLES: " + referenceRoles : "• No image-role metadata.",
    "",
    "AI QUALITY CONTROL",
    "• Photorealistic architectural visualization.",
    "• No warped geometry, impossible construction or invented unrelated details.",
    "• Preserve physically coherent scale, contact, occlusion and perspective.",
    "• Never solve a problem in a locked domain by changing that domain.",
    "",
    "OUTPUT RULE",
    "Return a production-ready image-editing prompt only. Do not generate the image."
  );

  return {analysis, reasoning, prompt: body.join("\n")};
}
