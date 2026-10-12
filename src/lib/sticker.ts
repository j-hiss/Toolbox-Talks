"use client";

// Jobsite QR sticker: a one-page PDF to print and post at the site. Two codes, each only a link: the presenter's opens
// the app with that jobsite picked for today's talk (src/core/sitelink.ts); the other lets anyone report a hazard or
// near miss at that jobsite with no account (src/core/hazards.ts, migration 0055).
import { jsPDF } from "jspdf";
import { drawQr } from "./qr";
import { jobsiteLink } from "@/core/sitelink";
import { hazardLink } from "@/core/hazards";

/** Where the app lives on the web (moved to webAddress.ts so other links can share it). */
export { appWebAddress } from "./webAddress";

export async function jobsiteSticker(site: { id: string; name: string; address: string }, companyName: string, origin: string): Promise<Blob> {
  const link = jobsiteLink(origin, site.id);
  const report = hazardLink(origin, site.id);
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = doc.internal.pageSize.getWidth();
  const center = (text: string, y: number, x = W / 2) => doc.text(text, x, y, { align: "center" });

  doc.setFont("helvetica", "bold"); doc.setFontSize(30);
  center("Toolbox talk jobsite", 80);

  // Two codes: the foreman's (sets today's jobsite) and anyone's (report a hazard or near miss, no account).
  const size = 230, gap = 40, left = (W - 2 * size - gap) / 2, top = 120;
  const colL = left + size / 2, colR = left + size + gap + size / 2;
  doc.setFontSize(17); doc.setFont("helvetica", "bold");
  center("Foreman", top, colL); center("Anyone: see something unsafe?", top, colR);
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  center("Scan to set this jobsite for today's talk.", top + 18, colL);
  center("Scan to report it. No app, no account.", top + 18, colR);
  drawQr(doc, link, left, top + 32, size);
  drawQr(doc, report, left + size + gap, top + 32, size);

  doc.setFont("helvetica", "bold"); doc.setFontSize(26);
  const nameLines = doc.splitTextToSize(site.name, W - 120) as string[];
  nameLines.slice(0, 2).forEach((l, i) => center(l, 470 + i * 30));
  let y = 470 + Math.min(nameLines.length, 2) * 30;
  if (site.address) { doc.setFont("helvetica", "normal"); doc.setFontSize(15); center(site.address, y + 4); y += 28; }
  doc.setFontSize(12); doc.setTextColor(90);
  center(companyName, y + 14);
  doc.setFontSize(9);
  center("The foreman's code only opens the app on the presenter's phone. The report code works on any phone; your name is optional.", 736);
  center(`${link}   ·   ${report}`, 752);
  return doc.output("blob");
}
