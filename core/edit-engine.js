const MODES={
 Furniture:{label:"Thay thế sản phẩm nội thất",instruction:"Chỉ thay đúng sản phẩm được chọn và bảo toàn không gian xung quanh. Ảnh model chỉ là bằng chứng nhận diện, không quyết định hướng đặt trong ảnh đích."},
 Material:{label:"Material Change",instruction:"Change only the specified material system while preserving geometry, proportion and spatial composition."},
 Lighting:{label:"Lighting Change",instruction:"Recompose light only: source, direction, temperature, intensity, contrast and bounce."},
 Camera:{label:"Camera / View Change",instruction:"Change viewpoint only: position, height, lens feel, framing and perspective."},
 Removal:{label:"Object Removal / Scene Cleanup",instruction:"Remove only the selected objects and reconstruct only the newly exposed background from surrounding visual evidence."},
 AspectRatio:{label:"Aspect Ratio / Canvas Expansion",instruction:"Convert the source frame to the selected aspect ratio by controlled canvas expansion or minimal crop without changing the original camera or design."},
 ReferenceReplica:{label:"Reference Replica / Product Override",instruction:"Replicate the supplied reference with maximum visual fidelity and allow only the explicitly authorized supplied product to differ."},
 SpaceSync:{label:"Spatial Synchronization",instruction:"Synchronize the whole space through alignment, circulation, proportion, sightlines, continuity and hierarchy without inventing architecture."}
};
export function editModeDirection(mode,target,brief,params={},decisions={}){
 const config=MODES[mode]||MODES.Furniture;
 const safeguards={
 Furniture:[
  "Chỉ thay sản phẩm mục tiêu; coi toàn bộ ảnh model cung cấp là các góc nhìn của cùng một sản phẩm.",
  "REFERENCE VIEW ≠ PLACEMENT ORIENTATION: không sao chép hướng chụp/camera của ảnh model sang ảnh đích.",
  "Phân tích từng ảnh model để xác định diện FRONT / REAR / LEFT / RIGHT / LONG SIDE / SHORT SIDE / 3-4 / TOP / BOTTOM / UNKNOWN; nếu KTS khai báo diện thủ công thì ưu tiên tuyệt đối dữ liệu KTS.",
  "Xác định hệ trục LENGTH–WIDTH–HEIGHT của model, sau đó map vào trục, footprint và hướng của đồ cũ trong ảnh không gian.",
  "Giữ camera/perspective của ảnh gốc; xoay vật thể theo không gian đích, không xoay không gian để khớp ảnh model.",
  "ORIENTATION QUALITY GATE: nếu trục dài/rộng của model mâu thuẫn với đồ cũ hoặc perspective mục tiêu, phải sửa trước khi xuất.",
  "Bảo toàn toàn bộ vật thể không thuộc mục tiêu, kiến trúc, built-in và camera gốc.",
  "Khớp tỷ lệ model, tiếp xúc sàn, perspective, occlusion, ánh sáng và contact shadow với không gian hiện hữu.",
  "Resolve geometry consistently across all supplied reference views; never mix unrelated models or invent missing structural parts.",
  "Preserve the selected model's silhouette, construction logic and distinctive details unless the user explicitly requests a change.",
  "If scale must adapt to the room, adjust placement and fit only within the user's selected intervention level; do not redesign the model.",
  "Do not change material, lighting or camera as independent design decisions in Furniture mode."
],
 Material:["Lock object geometry, dimensions, joints and proportions.","Change only the requested material boundary.","Match texture scale, grain/veining, roughness, reflectivity and edge behavior.","Preserve existing junctions, reveals and construction logic."],
 Lighting:["Do not redesign furniture or architecture to create a lighting effect.","Reason in key/fill/ambient terms and preserve believable source logic.","Match shadow density, contact shadows, bounce light, exposure and color temperature.","Do not flatten material response or over-light the scene."],
 Camera:["Do not relocate or redesign objects merely to suit the new view.","Reason from camera height, lens/FOV, yaw, pitch, framing and vanishing points.","Keep architectural verticals and perspective believable.","Preserve material identity and design intent."],
 Removal:["Remove only explicitly selected objects.","Reconstruct only occluded background using surrounding visual evidence.","Remove only object-specific contact shadows and reflections.","Preserve architecture, geometry, materials, lighting, camera, perspective and every unselected object.","Never replace removed objects or redesign the cleared area."],
 AspectRatio:["Change only the frame boundary/aspect ratio.","Prefer canvas expansion when cropping would remove important content.","Never stretch or squash the source image.","Preserve camera position, lens/FOV, perspective, architecture, furniture, materials and lighting.","Outpaint only missing frame areas using surrounding visual evidence."],
 ReferenceReplica:["Reference image is the source of truth for all visible scene properties.","Change only the explicitly authorized product target.","Match reference architecture, composition, materials, lighting, camera, perspective, framing and unselected objects.","Preserve supplied replacement product identity; adapt only scale, contact, occlusion and integration.","No redesign, restyle, improvement, invented content or unrelated change."],
  SpaceSync:["Read the entire scene as one spatial system before making any coordination decision.","Synchronize axes, scale, circulation, sightlines, hierarchy, rhythm and negative space.","Resolve conflicts through spatial coordination before changing individual design domains.","Preserve architecture, function and identity unless the brief explicitly authorizes a change."]
 }[mode];
 return {mode,label:config.label,instruction:config.instruction,target:target||"Unspecified",safeguards,params,decisions,detectedIntent:(brief||"").trim()||"No additional direction."};
}
export {MODES};