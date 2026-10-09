// Shrinks a camera photo on the phone before it's kept: longest side 1280 px, JPEG. Keeps the offline outbox small
// (a few hundred KB instead of several MB) and drops the photo's hidden metadata (its own GPS, camera details);
// the record already has its own time and location.
export const PHOTO_MAX_SIDE = 1280;
export const PHOTO_QUALITY = 0.72;
/** A paper sign-in sheet keeps more detail so handwritten names stay readable. */
export const SHEET_MAX_SIDE = 2000;

/** Width and height that fit inside max x max, keeping the shape. Never enlarges. */
export function fitWithin(w: number, h: number, max = PHOTO_MAX_SIDE): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(w, h));
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

export async function shrinkPhoto(file: Blob, max = PHOTO_MAX_SIDE): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, max);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("This phone couldn't process the photo.");
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", PHOTO_QUALITY);
  } finally {
    URL.revokeObjectURL(url);
  }
}
