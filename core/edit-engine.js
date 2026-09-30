const MODES={
 Furniture:{label:"Furniture Replacement",instruction:"Replace only the selected furniture while preserving the surrounding interior."},
 Material:{label:"Material Change",instruction:"Change only the specified material system while preserving geometry, proportion and spatial composition."},
 Lighting:{label:"Lighting Change",instruction:"Recompose light only: source, direction, temperature, intensity, contrast and bounce."},
 Camera:{label:"Camera / View Change",instruction:"Change viewpoint only: position, height, lens feel, framing and perspective."}
};
export function editModeDirection(mode,target,brief,params={}){
 const config=MODES[mode]||MODES.Furniture;
 const safeguards={
 Furniture:["Replace only the target furniture.","Preserve all non-target objects, architecture and original camera.","Match scale, floor contact, perspective, occlusion, lighting and shadows.","Do not invent a different furniture model when a reference is supplied."],
 Material:["Lock object geometry, dimensions, joints and proportions.","Change only the requested material boundary.","Match texture scale, grain/veining, roughness, reflectivity and edge behavior.","Preserve existing junctions, reveals and construction logic."],
 Lighting:["Do not redesign furniture or architecture to create a lighting effect.","Reason in key/fill/ambient terms and preserve believable source logic.","Match shadow density, contact shadows, bounce light, exposure and color temperature.","Do not flatten material response or over-light the scene."],
 Camera:["Do not relocate or redesign objects merely to suit the new view.","Reason from camera height, lens/FOV, yaw, pitch, framing and vanishing points.","Keep architectural verticals and perspective believable.","Preserve material identity and design intent."]
 }[mode];
 return {mode,label:config.label,instruction:config.instruction,target:target||"Unspecified",safeguards,params,detectedIntent:(brief||"").trim()||"No additional direction."};
}
export {MODES};