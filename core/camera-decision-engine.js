/*
 * HOANGGIA AI — IWAN BAAN CAMERA DECISION ENGINE
 *
 * Independent camera-only reasoning system.
 * Inspired by publicly documented architectural-photography principles
 * associated with Iwan Baan; not a simulation, endorsement, or impersonation.
 */

const PROFILES = {
  "Toàn cảnh": {
    intent: "Explain the room as a coherent architectural whole while preserving spatial relationships.",
    position: "Use a position that reveals the primary room axis and the relationship between foreground, middle ground and background.",
    height: "Use a believable architectural eye-level or slightly elevated position when it clarifies the room without flattening it.",
    lens: "Prefer the narrowest useful wide field of view; avoid stretching the near corners.",
    framing: "Give architecture enough breathing room; keep the dominant subject anchored within the spatial hierarchy."
  },
  "Góc sofa": {
    intent: "Reveal the sofa's relationship to the room, circulation and surrounding architecture.",
    position: "Place the camera where sofa, adjacent circulation and major architectural anchors read in one spatial relationship.",
    height: "Use a natural seated-to-standing transition height rather than an arbitrary high camera.",
    lens: "Prefer a moderate architectural lens that preserves believable sofa proportions.",
    framing: "Use foreground furniture as depth information, not as a cropped obstacle."
  },
  "Góc bàn ăn": {
    intent: "Explain the dining zone as part of the room rather than as an isolated product shot.",
    position: "Find a position that connects dining table, circulation and architectural backdrop.",
    height: "Use a natural human-context height that keeps the table plane believable.",
    lens: "Use moderate FOV before widening; protect table and chair proportions at the frame edges.",
    framing: "Maintain clear foreground, dining subject and architectural background hierarchy."
  },
  "Góc phòng": {
    intent: "Reveal the strongest spatial diagonal and depth of the room.",
    position: "Use a corner or oblique position only when it genuinely improves spatial comprehension.",
    height: "Choose height to preserve both floor-plane readability and vertical architectural scale.",
    lens: "Use controlled wide perspective, never fisheye.",
    framing: "Use diagonals and overlapping planes to create depth without inventing space."
  },
  "Cận vật liệu": {
    intent: "Show material detail while retaining enough architectural context to explain scale and placement.",
    position: "Move only as close as needed to make the requested material legible.",
    height: "Set height from the target surface and intended human reading angle.",
    lens: "Prefer a normal-to-short-telephoto feel when possible; avoid exaggerated wide-angle close-ups.",
    framing: "Crop deliberately around the material boundary and meaningful construction junctions."
  },
  "Góc mới theo yêu cầu": {
    intent: "Translate the user's requested spatial story into a physically plausible camera setup.",
    position: "Infer only the camera position required by the stated view; do not relocate scene objects.",
    height: "Select height from the requested narrative and human/architectural context.",
    lens: "Choose the minimum FOV necessary to include the requested spatial information.",
    framing: "Prioritize the requested subject while preserving believable context and depth."
  }
};

function value(decisions, params, key, fallback = "") {
  return decisions?.[key] || params?.[key] || fallback;
}

export function cameraDecisionEngine({
  target = "Toàn cảnh",
  brief = "",
  decisions = {},
  params = {},
  analysis = {}
} = {}) {
  const profile = PROFILES[target] || PROFILES["Góc mới theo yêu cầu"];
  const view = value(decisions, params, "view", "Apply the requested spatial view.");
  const lens = value(decisions, params, "lens", "Kiến trúc tự nhiên");
  const height = value(decisions, params, "height", "Ngang tầm mắt");
  const perspective = value(params, decisions, "perspective", "Kiến trúc tự nhiên");
  const composition = value(params, decisions, "composition", "Giữ thứ bậc thiết kế");

  const decisionSequence = [
    "1. SPATIAL INTENT — define what spatial relationship the frame must communicate.",
    "2. POSITION — locate the camera without moving any scene object.",
    "3. HEIGHT — choose a believable architectural/human-context camera height.",
    "4. LENS / FOV — use the narrowest useful field of view before widening.",
    "5. PERSPECTIVE — preserve believable depth, scale and vanishing-point behavior.",
    "6. FRAMING — establish foreground, subject and background hierarchy.",
    "7. VERTICAL CONTROL — keep architectural verticals and horizontal references credible.",
    "8. DEPTH — build readable near/mid/far layers without inventing room volume.",
    "9. NARRATIVE — make the frame explain architecture and lived spatial relationships.",
    "10. PRESERVATION — change only the camera; lock furniture, materials, lighting and architecture."
  ];

  const checks = [
    `Spatial intent: ${profile.intent}`,
    `Position: ${profile.position}`,
    `Height: ${profile.height}`,
    `Lens/FOV: ${profile.lens}`,
    `Perspective: ${perspective}; ${lens}`,
    `Framing: ${profile.framing}; ${composition}`,
    "Vertical control: keep walls, doors, windows and built-in verticals structurally credible.",
    "Depth: preserve actual room dimensions and object positions; use overlap and perspective rather than invented geometry.",
    "Narrative: use the camera to reveal the requested architectural relationship, not to redesign the scene."
  ];

  const expertQuestions = [
    "What exact spatial relationship must the new frame reveal?",
    "Where can the camera physically stand without relocating objects?",
    "What camera height best communicates human scale and architectural proportion?",
    "What is the narrowest useful lens/FOV for the requested composition?",
    "Where are the dominant vanishing points and how should they remain believable?",
    "Which foreground, middle-ground and background layers create depth?",
    "Do verticals require perspective correction, and can that be achieved without changing architecture?",
    "What should remain visually secondary so the requested subject stays legible?",
    "Which scene elements must remain completely unchanged?"
  ];

  const qualityGates = [
    "No fisheye distortion unless explicitly requested.",
    "No exaggerated wide-angle stretching at frame edges.",
    "No leaning architectural verticals when correction is required.",
    "No invented room depth, openings, windows or object positions.",
    "No camera move that requires moving furniture or architectural elements.",
    "No furniture, material or lighting redesign to manufacture the composition.",
    "No impossible camera placement through walls, objects or built-ins.",
    "No arbitrary depth-of-field blur that hides architectural relationships."
  ];

  return {
    profile,
    decisionSequence,
    checks,
    expertQuestions,
    qualityGates,
    applied: [
      `VIEW: ${view}`,
      `LENS: ${lens}`,
      `HEIGHT: ${height}`,
      `PERSPECTIVE: ${perspective}`,
      `COMPOSITION: ${composition}`
    ],
    reasoning: [
      `USER INTENT: ${brief.trim() || "No additional direction."}`,
      `TARGET VIEW: ${target}`,
      ...checks
    ]
  };
}
