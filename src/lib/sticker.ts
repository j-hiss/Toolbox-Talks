"use client";

// Jobsite QR sticker: a one-page PDF to print and post at the site. Scanning it with the presenter's phone camera
// opens the app with that jobsite picked for today's talk (src/core/sitelink.ts). It carries only a link.
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import { jobsiteLink } from "@/core/sitelink";

/**
 * Where the app lives on the web. A sticker needs a real web address: the phone apps run from an app-only address
 * that a camera can't open. Set NEXT_PUBLIC_APP_URL once the website is live; until then the website's own address
 * is used when it's a normal https address.
 */
export function appWebAddress(): string | null {
  const set = process.env.NEXT_PUBLIC_APP_URL;
  if (set && /^https?:\/\//.test(set)) return set;
  if (typeof location !== "undefined" && /^https?:$/.test(location.protocol) && location.origin !== "null") return location.origin;
  return null;
}

export async function jobsiteSticker(site: { id: string; name: string; address: string }, companyName: string, origin: string): Promise<Blob> {
  const link = jobsiteLink(origin, site.id);
  // Drawn as squares (vector), so it prints sharp at any size and the file stays small.
  const qr = QRCode.create(link, { errorCorrectionLevel: "M" });
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const center = (text: string, y: number) => doc.text(text, W / 2, y, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(30);
  center("Toolbox talk jobsite", 90);
  doc.setFont("helvetica", "normal"); doc.setFontSize(15);
  center("Foreman: scan with your phone camera to set this jobsite for today's talk.", 122);

  const size = 340, n = qr.modules.size, cell = size / (n + 4), x0 = (W - size) / 2 + 2 * cell, y0 = 150 + 2 * cell;
  doc.setFillColor(0, 0, 0);
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) if (qr.modules.get(row, col)) doc.rect(x0 + col * cell, y0 + row * cell, cell + 0.2, cell + 0.2, "F");
  }

  doc.setFont("helvetica", "bold"); doc.setFontSize(26);
  const nameLines = doc.splitTextToSize(site.name, W - 120) as string[];
  nameLines.slice(0, 2).forEach((l, i) => center(l, 540 + i * 30));
  let y = 540 + Math.min(nameLines.length, 2) * 30;
  if (site.address) { doc.setFont("helvetica", "normal"); doc.setFontSize(15); center(site.address, y + 4); y += 28; }
  doc.setFontSize(12); doc.setTextColor(90);
  center(companyName, y + 14);
  doc.setFontSize(9);
  center("Crew members don't scan this or sign in. It only opens the app on the presenter's phone.", 740);
  center(link, 756);
  return doc.output("blob");
}
