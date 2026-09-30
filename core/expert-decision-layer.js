/*
 * HOANGGIA AI — Lớp quyết định chuyên gia
 *
 * Các expert lens lấy cảm hứng từ những tư duy thiết kế đã được công bố,
 * không mô phỏng cá nhân hay đại diện cho các chuyên gia được nêu tên.
 * Mỗi engine sử dụng một hệ quy chiếu độc lập và quyền quyết định cuối cùng
 * vẫn thuộc về người dùng.
 */

export const EXPERTS = {
  Furniture: {
    name: "Antonio Citterio",
    role: "Kiến trúc sư + nhà thiết kế nội thất / công nghiệp",
    label: "GÓC NHÌN NỘI THẤT CITTERIO",
    source: "Tỷ lệ · công năng · tự do không gian · logic cấu tạo",
    principles: [
      "Treat furniture as architecture at human scale: proportion, comfort, circulation and spatial freedom come before styling.",
      "Read silhouette, structure, joints, support and material transitions as one coherent object.",
      "Prefer precise, restrained forms whose construction logic remains legible.",
      "Adapt the furniture to the room without destroying the identity of the selected model."
    ],
    decisions: {
      direction: "Typology and silhouette first; then proportion, comfort and detailing.",
      fit: "Check footprint, clearances, seat depth/height and relationship to surrounding architecture.",
      character: "Use a restrained contemporary language; let material and proportion create the luxury rather than decoration."
    }
  },
  Material: {
    name: "Peter Zumthor",
    role: "Kiến trúc sư",
    label: "GÓC NHÌN VẬT LIỆU ZUMTHOR",
    source: "Hiện diện vật liệu · tương thích · không khí · chiều sâu xúc giác",
    principles: [
      "Choose materials by physical and atmospheric compatibility, not by isolated appearance.",
      "Evaluate grain, weight, texture, temperature, reflectance and the way adjacent materials react to each other.",
      "Preserve material thickness, junctions, reveals and shadow gaps so the material feels constructed rather than pasted on.",
      "Let material hierarchy reinforce the architecture and atmosphere of the room."
    ],
    decisions: {
      change: "Define the material boundary first; change the surface without erasing the object's construction.",
      finish: "Control roughness, sheen, texture scale and edge response as part of the material identity.",
      character: "Prefer depth and tactile coherence over excessive contrast or decorative noise."
    }
  },
  Lighting: {
    name: "Ingo Maurer",
    role: "Nhà thiết kế ánh sáng",
    label: "GÓC NHÌN ÁNH SÁNG MAURER",
    source: "Ánh sáng như không khí · logic nguồn sáng · thi vị + công nghệ",
    principles: [
      "Treat light as a designed experience, not merely brightness.",
      "Balance functional visibility with atmosphere, shadow, contrast and emotional focus.",
      "Keep every visible source, reflection and shadow physically believable.",
      "Use light to reveal material, form and spatial hierarchy without flattening the scene."
    ],
    decisions: {
      mood: "Define the emotional atmosphere first, then build the light hierarchy.",
      source: "Separate daylight, architectural and decorative sources and give each a clear role.",
      contrast: "Protect meaningful shadows and gradients; avoid the uniformly illuminated AI look."
    }
  },
  Camera: {
    name: "Iwan Baan",
    role: "Nhiếp ảnh gia kiến trúc",
    label: "GÓC NHÌN MÁY ẢNH BAAN",
    source: "Kiến trúc · bối cảnh con người · câu chuyện · cảm nhận không gian",
    principles: [
      "Photograph the space as architecture with a sense of life and context, not as a sterile catalog object.",
      "Choose viewpoint, height and lens to explain spatial relationships and hierarchy.",
      "Preserve believable perspective, verticals, depth and the actual proportions of the built environment.",
      "Frame the image so the architecture remains the story while selected furniture or material becomes the visual subject."
    ],
    decisions: {
      view: "Start from the spatial story: what relationship between architecture, furniture and circulation should the frame reveal?",
      lens: "Use the narrowest field of view that communicates the required space without exaggerated perspective.",
      height: "Set camera height from the architectural narrative rather than arbitrary eye-level defaults."
    }
  }
};

export function expertFor(mode) {
  return EXPERTS[mode] || EXPERTS.Furniture;
}

export function expertDecision(mode, decisions = {}) {
  const expert = expertFor(mode);
  const applied = Object.entries(decisions)
    .filter(([, value]) => value)
    .map(([key, value]) => {
      const logic = expert.decisions[key];
      return logic ? `${key.toUpperCase()}: ${value} — ${logic}` : `${key.toUpperCase()}: ${value}`;
    });
  return {
    ...expert,
    applied,
    instruction: applied.length ? applied.join("\n") : expert.principles.join("\n")
  };
}
