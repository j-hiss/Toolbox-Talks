// Tiny PNG maker for test data (no extra packages): example signatures and a stand-in "crew photo".
// Nothing here is a real person's signature or picture.
import { deflateSync } from "node:zlib";

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
const crc32 = (b: Uint8Array) => { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };

function chunk(type: string, data: Uint8Array): Buffer {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), Buffer.from(data)]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

/** RGBA pixels → PNG bytes. */
export function encodePng(width: number, height: number, rgba: Uint8Array): Buffer {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0; // no filter
    Buffer.from(rgba.buffer, rgba.byteOffset + y * width * 4, width * 4).copy(raw, y * (width * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0; // 8-bit RGBA
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", new Uint8Array())]);
}

export const dataUrl = (png: Buffer) => `data:image/png;base64,${png.toString("base64")}`;

class Canvas {
  px: Uint8Array;
  constructor(public w: number, public h: number) { this.px = new Uint8Array(w * h * 4); }
  dot(x: number, y: number, r: number, c: [number, number, number, number]) {
    for (let j = Math.floor(y - r); j <= y + r; j++) for (let i = Math.floor(x - r); i <= x + r; i++) {
      if (i < 0 || j < 0 || i >= this.w || j >= this.h || (i - x) ** 2 + (j - y) ** 2 > r * r) continue;
      this.px.set(c, (j * this.w + i) * 4);
    }
  }
  rect(x: number, y: number, w: number, h: number, c: [number, number, number, number]) {
    for (let j = Math.max(0, Math.floor(y)); j < Math.min(this.h, y + h); j++) for (let i = Math.max(0, Math.floor(x)); i < Math.min(this.w, x + w); i++) this.px.set(c, (j * this.w + i) * 4);
  }
  line(x0: number, y0: number, x1: number, y1: number, r: number, c: [number, number, number, number]) {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
    for (let s = 0; s <= n; s++) this.dot(x0 + ((x1 - x0) * s) / n, y0 + ((y1 - y0) * s) / n, r, c);
  }
  png() { return encodePng(this.w, this.h, this.px); }
}

/** A made-up scribble, different for every seed, on a transparent background (like the signature pad). */
export function exampleSignature(rand: () => number): string {
  const c = new Canvas(300, 90);
  const ink: [number, number, number, number] = [20, 24, 32, 255];
  let x = 18 + rand() * 10, y = 55;
  const strokes = 7 + Math.floor(rand() * 6);
  for (let s = 0; s < strokes; s++) {
    const nx = Math.min(285, x + 14 + rand() * 30), ny = 20 + rand() * 55;
    c.line(x, y, nx, ny, 1.6, ink);
    x = nx; y = ny;
  }
  c.line(20, 72, 120 + rand() * 120, 70 + rand() * 6, 1.2, ink); // underline flourish
  return dataUrl(c.png());
}

/** A stand-in "crew photo": sky, ground and simple figures in hi-vis colors. Clearly not a real photo. */
export function examplePhoto(rand: () => number): string {
  const W = 480, H = 320, c = new Canvas(W, H);
  for (let y = 0; y < H; y++) {
    const sky: [number, number, number, number] = [120 + (y * 60) / H, 170 + (y * 40) / H, 220, 255];
    c.rect(0, y, W, 1, y < H * 0.62 ? sky : [150, 140, 120, 255]);
  }
  const vests: [number, number, number, number][] = [[245, 183, 0, 255], [230, 110, 30, 255], [190, 220, 40, 255]];
  const n = 3 + Math.floor(rand() * 4);
  for (let i = 0; i < n; i++) {
    const x = 50 + (i * (W - 100)) / Math.max(1, n - 1) + (rand() - 0.5) * 20, base = H * 0.62 + 30 + rand() * 20;
    c.rect(x - 16, base - 70, 32, 70, vests[i % vests.length]);          // body (vest)
    c.dot(x, base - 86, 14, [205, 160, 125, 255]);                        // head
    c.rect(x - 16, base - 104, 32, 10, [250, 250, 250, 255]);             // hard hat
    c.rect(x - 14, base, 10, 30, [60, 70, 90, 255]); c.rect(x + 4, base, 10, 30, [60, 70, 90, 255]); // legs
  }
  return dataUrl(c.png());
}
