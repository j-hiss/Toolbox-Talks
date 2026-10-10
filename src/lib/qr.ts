// A QR code drawn into a PDF as squares (vector), so it prints sharp at any size and the file stays small.
// Used by the jobsite sticker and the record PDF's "check this record" box.
import type { jsPDF } from "jspdf";
import QRCode from "qrcode";

/** Draws `text` as a QR code with its quiet zone inside a `size` × `size` box at (x, y). */
export function drawQr(doc: jsPDF, text: string, x: number, y: number, size: number): void {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qr.modules.size, cell = size / (n + 4), x0 = x + 2 * cell, y0 = y + 2 * cell;
  doc.setFillColor(0, 0, 0);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) if (qr.modules.get(row, col)) doc.rect(x0 + col * cell, y0 + row * cell, cell + 0.2, cell + 0.2, "F");
  }
}
