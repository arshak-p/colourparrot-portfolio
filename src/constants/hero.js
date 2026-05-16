// Total number of animation frames
export const TOTAL_FRAMES = 224;

// Builds the public URL path for a given frame number (1-indexed)
export const getFramePath = (n) =>
  `/frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`;
