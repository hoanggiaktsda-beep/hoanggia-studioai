import {analyzeBrief} from "./architectural-brain.js";
import {materialDirection, materialDecisionEngine} from "./material-engine.js";
import {cameraDirection} from "./camera-engine.js";
import {cameraDecisionEngine} from "./camera-decision-engine.js";
import {furnitureDirection} from "./furniture-engine.js";
import {editModeDirection} from "./edit-engine.js";
import {lightingDecisionEngine} from "./lighting-engine.js";
import {expertDecision} from "./expert-decision-layer.js";

function scopedEvidence(mode, brief, target, params = {}) {
  const text = (brief || "").trim();
  const scopedParams = {
    Furniture: { style: params.style || "" },
    Material: { style: params.style || "" },
    Lighting: { lighting: params.lighting || "" },
    Camera: { view: params.view || "", camera: params.camera || "" }
  }[mode] || {};

  const lines = [
    `USER INTENT: ${text || "No additional direction."}`,
    `TARGET: ${target || "Unspecified"}`,
    `RELEVANT DESIGN INTENT: ${Object.entries(scopedParams).filter(([,v]) => v).map(([k,v]) => `${k}=${v}`).join(" | ") || "None"}`
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
  referenceRoles = "",
  aiTarget = "ChatGPT",
  aiProfile = ""
}) {
  const relevantParams = { Furniture: { style: params.style || "" }, Material: { style: params.style || "" }, Lighting: { lighting: params.lighting || "" }, Camera: { view: params.view || "", camera: params.camera || "" } }[mode] || {};
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
    "EXPERT",
    expert.name + " — " + expert.role,
    "FOCUS",
    expert.scope,
    "",
    "TASK",
    mode === "Furniture" ? "Replace only the selected furniture: " + target :
    mode === "Material" ? "Change only the selected material surface: " + target :
    mode === "Lighting" ? "Change only the selected lighting system: " + target :
    "Change only the camera view: " + target,
    "",
    "DESIGN LOGIC",
    expert.principles.map(x => "• " + x).join("\n"),
    "",
    "PROCESS",
    expert.protocol.map((x,i) => (i + 1) + ". " + x).join("\n"),
    "",
    "DECISIONS",
    decisionLines || "• Apply expert principles to the user's intent."
  );

  if (mode === "Furniture") {
    const f = furnitureDirection(target, replacement, brief, relevantParams, decisions, model, referenceRoles);
    body.push(
      "",
      "REFERENCE",
      "• Use supplied model images only for the selected furniture.",
      "• Reconcile multiple views into one coherent model.",
      "• Preserve identity, silhouette and construction according to the selected decisions.",
      "",
      "EXECUTION",
      "• " + f.editRule,
      "• " + f.realism,
      "• " + f.referenceRule
    );
  } else if (mode === "Material") {
    const m = materialDirection(analysis);
    const md = materialDecisionEngine({target, brief, decisions, analysis, material: replacement, referenceRoles});
    body.push(
      "",
      "EXECUTION",
      "• " + m.rule,
      "• " + m.realism.join("\n• "),
      ...md.checks.map(x => "• " + x)
    );
  } else if (mode === "Lighting") {
    const ld = lightingDecisionEngine({target, brief, decisions, analysis, referenceRoles});
    body.push(
      "",
      "EXECUTION",
      "• Design source, direction, intensity, temperature, falloff, contrast, shadow and bounce.",
      "• " + ld.checks.join("\n• ")
    );
  } else {
    const cd = cameraDecisionEngine({target, brief, decisions, params: relevantParams, analysis});
    body.push(
      "",
      "EXECUTION",
      "• Determine position, height, lens/FOV, perspective, framing, verticals and depth.",
      "• " + cd.checks.join("\n• ")
    );
  }

  body.push(
    "",
    "CONTEXT",
    "• User intent: " + ((brief || "").trim() || "No additional direction."),
    "• Design intent: " + (Object.entries(relevantParams).filter(([,v]) => v).map(([k,v]) => k + "=" + v).join(" | ") || "None"),
    "",
    "PRESERVE",
    ...modeData.safeguards.map(x => "• " + x),
    ...expert.qualityGates.map(x => "• " + x),
    "• Keep all non-target domains unchanged.",
    "• Do not solve problems by changing another expert's domain.",
    "",
    "AI FORMAT",
    "• Target platform: " + aiTarget,
    "• " + (aiProfile || "Use concise production-ready image-editing instructions."),
    "",
    "OUTPUT",
    "Return one concise production-ready image-editing prompt only. Do not generate the image."
  );

  return {analysis, reasoning, prompt: body.join("\n")};
}
