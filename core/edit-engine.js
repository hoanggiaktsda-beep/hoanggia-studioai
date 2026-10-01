const MODES={
 Furniture:{label:"Furniture Replacement",instruction:"Replace only the selected furniture while preserving the surrounding interior."},
 Material:{label:"Material Change",instruction:"Change only the specified material system while preserving geometry, proportion and spatial composition."},
 Lighting:{label:"Lighting Change",instruction:"Recompose light only: source, direction, temperature, intensity, contrast and bounce."},
 Camera:{label:"Camera / View Change",instruction:"Change viewpoint only: position, height, lens feel, framing and perspective."},
 SpaceSync:{label:"Spatial Synchronization",instruction:"Synchronize the whole space through alignment, circulation, proportion, sightlines, continuity and hierarchy without inventing architecture."}
};
export function editModeDirection(mode,target,brief,params={},decisions={}){
 const config=MODES[mode]||MODES.Furniture;
 const safeguards={
 Furniture:[
  "Replace only the target furniture; treat the supplied model images as one coherent model identity.",
  "Preserve all non-target objects, architecture, built-ins and original camera.",
  "Match model scale, floor contact, perspective, occlusion, lighting and contact shadows to the existing scene.",
  "Resolve geometry consistently across all supplied reference views; never mix unrelated models or invent missing structural parts.",
  "Preserve the selected model's silhouette, construction logic and distinctive details unless the user explicitly requests a change.",
  "If scale must adapt to the room, adjust placement and fit only within the user's selected intervention level; do not redesign the model.",
  "Do not change material, lighting or camera as independent design decisions in Furniture mode."
],
 Material:["Lock object geometry, dimensions, joints and proportions.","Change only the requested material boundary.","Match texture scale, grain/veining, roughness, reflectivity and edge behavior.","Preserve existing junctions, reveals and construction logic."],
 Lighting:["Do not redesign furniture or architecture to create a lighting effect.","Reason in key/fill/ambient terms and preserve believable source logic.","Match shadow density, contact shadows, bounce light, exposure and color temperature.","Do not flatten material response or over-light the scene."],
 Camera:["Do not relocate or redesign objects merely to suit the new view.","Reason from camera height, lens/FOV, yaw, pitch, framing and vanishing points.","Keep architectural verticals and perspective believable.","Preserve material identity and design intent."],
  SpaceSync:["Read the entire scene as one spatial system before making any coordination decision.","Synchronize axes, scale, circulation, sightlines, hierarchy, rhythm and negative space.","Resolve conflicts through spatial coordination before changing individual design domains.","Preserve architecture, function and identity unless the brief explicitly authorizes a change."]
 }[mode];
 return {mode,label:config.label,instruction:config.instruction,target:target||"Unspecified",safeguards,params,decisions,detectedIntent:(brief||"").trim()||"No additional direction."};
}
export {MODES};