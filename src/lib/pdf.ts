// The PDF record of one saved talk. The one PDF builder (see BLUEPRINT-reuse-map.md). Origin: prototype buildPdf.
//
// Built only from the saved record (talk text that was read, roster, statuses, signatures, times), so a PDF made
// today matches what was signed. Company header details come from the company's current info.
import { jsPDF } from "jspdf";
import { countStatuses, STATUS_LABEL } from "@/core/attendance";
import { INDUSTRIES } from "@/core/industries";
import { LANGUAGES } from "@/core/languages";
import { parseDay, periodLabel, weekLabel } from "@/core/weeks";
import { weekNumbers } from "@/core/plan";
import type { Company, Issue, TalkRecord } from "@/lib/data/types";
import { HEAT_LABEL, type HeatLevel } from "@/core/heat";
import { normalizeTheme, printBrand, rgb } from "@/core/theme";
import { DOCUMENT_KINDS, type SafetyProfile } from "@/core/profile";
import { formatCode, verifyLink } from "@/core/verify";
import { EMPLOYEE_ACCESS, FALSIFYING, KINDS, OUTCOMES, incidentGaps, caseLabel, logTotals, nameOnLog, postingWindow, type InjuryCase, type InjurySummary } from "@/core/oshaLog";
import { drawQr } from "./qr";
import { appWebAddress } from "./webAddress";

export const PDF_FOOTER = "Documents a safety meeting. Does not by itself certify OSHA compliance.";

const RED: [number, number, number] = [180, 35, 27];
const GREEN: [number, number, number] = [31, 122, 69];
const GREY = 110;

/** "Oct 6, 2026" and "7:02 AM EDT": every signature line carries both. */
export function stampParts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" }),
  };
}

export function pdfFileName(r: Pick<TalkRecord, "week_number" | "title" | "held_at" | "makeup_for_week"> & { kind?: TalkRecord["kind"]; team_name?: string }): string {
  const day = new Date(r.held_at);
  const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
  if (r.kind === "daily") return `Daily Pre-Task Plan - ${r.team_name ? `${r.team_name.replace(/[^\w\s-]/g, "").trim()} - ` : ""}${iso}.pdf`;
  const week = r.week_number ? `Week ${String(r.week_number).padStart(2, "0")} - ` : "";
  const makeup = r.makeup_for_week ? "Makeup - " : "";
  return `${week}${makeup}Toolbox Talk - ${r.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim()} - ${iso}.pdf`;
}

const PAGE = { W: 612, H: 792, M: 48 } as const;

/**
 * The company header every PDF starts with: a band in the company's brand color (Admin → Brand; decoration only,
 * content never depends on it), the name, a label on the right, address, phone, email and licenses, and a rule.
 * Returns the y where the content starts.
 */
/**
 * A signature line. A signed line ends in a small dot in the company's brand color (the product's "signature line",
 * look book 2026-10-09); the printed status next to it stays the record of what happened.
 */
function sigLine(doc: jsPDF, co: Company, x: number, y: number, signed: boolean) {
  doc.setDrawColor(120); doc.setLineWidth(0.6); doc.line(x, y, x + 150, y);
  if (signed) { doc.setFillColor(...rgb(printBrand(normalizeTheme(co.theme)))); doc.circle(x + 155, y, 1.8, "F"); }
}

/** The company fields a PDF header prints. A shared profile copy (src/core/share.ts) carries just these. */
export type HeaderCompany = Pick<Company, "name" | "licenses" | "address" | "phone" | "email" | "theme">;

function companyHeader(doc: jsPDF, co: HeaderCompany, label: string, top: number = PAGE.M, W: number = PAGE.W, M: number = PAGE.M): number {
  const CW = W - 2 * M;
  let y = top;
  doc.setFillColor(...rgb(printBrand(normalizeTheme(co.theme)))); doc.rect(0, 0, W, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text(co.name || "Company name not set", M, y + 4);
  doc.setFontSize(9); doc.setTextColor(GREY); doc.text(label, W - M, y + 4, { align: "right" });
  y += 18; doc.setTextColor(60); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  const coLines = [co.address, [co.phone, co.email].filter(Boolean).join("  ·  "), (co.licenses || "").split(/\n+/).map((s) => s.trim()).filter(Boolean).join("  ·  ")].filter(Boolean);
  coLines.forEach((l) => doc.splitTextToSize(l, CW).forEach((x: string) => { doc.text(x, M, y); y += 11; }));
  doc.setTextColor(0); y += 6; doc.setDrawColor(30); doc.setLineWidth(1.2); doc.line(M, y, W - M, y); doc.setLineWidth(0.6); y += 26;
  return y;
}

/**
 * `origin` is the app's web address for the "check this record" QR code (defaults to appWebAddress()). A record not
 * uploaded yet has no code, so its PDF says so instead.
 */
export function buildRecordPdf(r: TalkRecord, co: Company, issues: Issue[] = [], origin: string | null = appWebAddress()): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = 612, H = 792, M = 48, CW = W - 2 * M;
  let y = M;
  let page = 1;

  const footer = () => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(GREY);
    doc.text(`${co.name ? co.name + " · " : ""}Record ${r.id} · Page ${page}`, M, H - 28);
    if (r.verify_code) doc.text(`Check code ${formatCode(r.verify_code)}${origin ? ` at ${origin.replace(/^https?:\/\//, "").replace(/\/+$/, "")}/verify` : ""}`, M, H - 18);
    doc.text(PDF_FOOTER, W - M, H - 28, { align: "right" });
    doc.setTextColor(0);
    page++;
  };
  const newPageIf = (h: number) => {
    if (y + h <= H - M - 24) return false;
    footer(); doc.addPage(); y = M;
    return true;
  };
  const kv = (k: string, v: string, x: number, w: number) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text(k.toUpperCase(), x, y);
    doc.setTextColor(0); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const ls = doc.splitTextToSize(v || "-", w);
    doc.text(ls, x, y + 12);
    return 12 + ls.length * 12;
  };
  const image = (src: string | null, x: number, top: number) => {
    if (!src) return false;
    try { doc.addImage(src, "PNG", x, top, 150, 38); return true; } catch { return false; }
  };

  // Company header ------------------------------------------------------------------------------------------------
  y = companyHeader(doc, co, r.kind === "daily" ? "DAILY PRE-TASK PLAN RECORD" : "TOOLBOX TALK RECORD", y);

  // Week line and title -------------------------------------------------------------------------------------------
  // Weekly companies: "WEEK 12 OF 52 · WEEK OF OCT 5 – OCT 9". Every 2 or 4 weeks: the whole talk period.
  const len = r.period_weeks ?? 1;
  const heldWeek = r.week_start ? periodLabel(parseDay(r.week_start), len, "en-US") : "";
  const weekNo = r.week_number ? weekNumbers({ n: r.week_number, weeks: len }).toUpperCase() : "";
  const weekOf = len > 1 ? "PERIOD" : "WEEK OF";
  doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(GREY);
  if (r.kind === "daily") {
    doc.text("DAILY PLAN  ·  SEPARATE FROM THE WEEKLY TOOLBOX TALK", M, y); y += 20;
  } else if (r.makeup_for_week) {
    doc.setTextColor(...RED);
    doc.text(`MAKEUP FOR THE WEEK OF ${weekLabel(parseDay(r.makeup_for_week), "en-US").toUpperCase()}`, M, y); y += 14;
    doc.setTextColor(GREY);
    if (r.week_number) { doc.text(`GIVEN IN ${weekNo} OF 52  ·  ${weekOf} ${heldWeek.toUpperCase()}`, M, y); y += 14; }
    doc.setFont("helvetica", "normal"); doc.setTextColor(0);
    doc.splitTextToSize(`Reason: ${r.makeup_reason ?? ""}`, CW).forEach((l: string) => { doc.text(l, M, y); y += 13; });
    y += 18;
  } else if (r.week_number) {
    const kind = r.scheduled_talk_id && r.scheduled_talk_id !== r.talk_id ? "DIFFERENT FROM THE PLAN" : "SCHEDULED TALK";
    doc.text(`${weekNo} OF 52  ·  ${weekOf} ${heldWeek.toUpperCase()}  ·  ${kind}`, M, y); y += 20;
  }
  doc.setTextColor(0); doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.splitTextToSize(r.content.title || r.title, CW).forEach((l: string) => { doc.text(l, M, y); y += 24; });
  if (r.language !== "en" && r.title !== r.content.title) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90); doc.text(`English title: ${r.title}`, M, y); doc.setTextColor(0); y += 14;
  }
  y += 10;

  // Details -------------------------------------------------------------------------------------------------------
  const held = stampParts(r.held_at);
  const lang = LANGUAGES.find((l) => l.id === r.language)?.label ?? r.language;
  const industry = INDUSTRIES.find((i) => i.id === co.industry)?.name;
  const colW = (CW - 24) / 2, x2 = M + colW + 24;
  const pairs: [string, string][] = [
    ["Date and time", `${held.date}, ${held.time}`],
    ["Where", r.jobsite_name],
    ["Team", r.team_name],
    ["Team lead", r.team_lead_name],
    ["Presented by", r.presenter_name ? `${r.presenter_name}${r.presenter_role ? `, ${r.presenter_role}` : ""}` : ""],
    ["Language presented", `${lang}${industry ? `  ·  ${industry}` : ""}`],
  ];
  if (r.latitude != null && r.longitude != null) pairs.push(["GPS at time of talk", `${r.latitude.toFixed(5)}, ${r.longitude.toFixed(5)}`]);
  for (let i = 0; i < pairs.length; i += 2) {
    const h1 = kv(pairs[i][0], pairs[i][1], M, colW);
    const h2 = pairs[i + 1] ? kv(pairs[i + 1][0], pairs[i + 1][1], x2, colW) : 0;
    y += Math.max(h1, h2) + 8;
  }

  // Attendance summary --------------------------------------------------------------------------------------------
  const c = countStatuses(r.attendees);
  const flagged = c.flagged + (r.presenter_signature ? 0 : 1);
  y += 2;
  if (flagged) doc.setFillColor(251, 230, 228); else doc.setFillColor(236, 244, 238);
  doc.roundedRect(M, y, CW, 26, 3, 3, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(`Attendance: ${c.signed} signed  ·  ${c.not_signed} not signed  ·  ${c.absent} absent`, M + 10, y + 17);
  if (flagged) { doc.setTextColor(...RED); doc.text(`${flagged} FLAGGED`, W - M - 10, y + 17, { align: "right" }); doc.setTextColor(0); }
  y += 44;

  // What was read -------------------------------------------------------------------------------------------------
  const t = r.content;
  doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text("Topics covered", M, y); y += 16; doc.setFontSize(10);
  const para = (txt: string, bold: boolean, indent = 0) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    const ls = doc.splitTextToSize(txt, CW - indent);
    newPageIf(ls.length * 13);
    ls.forEach((l: string) => { doc.text(l, M + indent, y); y += 13; });
  };
  para(t.hook, true); y += 4;
  t.sections.forEach((s) => {
    newPageIf(30); para(s.heading, true);
    s.items.forEach((it) => { newPageIf(14); doc.setFont("helvetica", "normal"); doc.text("•", M + 6, y); para(it, false, 18); });
    y += 4;
  });
  para(`Team discussion: ${t.ask}`, false); y += 10;

  // Since last talk: safety-log summaries read with this talk, each checked off by the presenter ---------------------
  const sl = r.content.since_last;
  if (sl) {
    newPageIf(40);
    para("Since last talk (from the company's safety log)", true);
    if (sl.status === "unavailable") para("The safety log couldn't be loaded when this talk was given (no connection).", false);
    else if (sl.items.length === 0) para("No new inspections, citations, incidents or near misses logged.", false);
    sl.items.forEach((it) => {
      newPageIf(30);
      para(it.heading, true);
      para(it.text, false, 12);
      para(`Reviewed with the team ${new Date(it.reviewed_with_crew_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`, false, 12);
    });
    y += 8;
  }

  // Site notes, heat, and what the crew raised ----------------------------------------------------------------------
  if (r.site_notes) { newPageIf(40); para("Today on this site", true); para(r.site_notes, false); y += 8; }
  if (r.heat) {
    newPageIf(40);
    const h = r.heat;
    para(`Heat check: heat index up to ${h.max_heat_index_f}°F (${HEAT_LABEL[h.level as HeatLevel] ?? h.level}), forecast from ${h.source === "NWS" ? "the National Weather Service" : h.source}.`, true);
    if (h.reminder_read && h.reminder) {
      para(`${h.reminder.title} (read with this talk):`, false);
      h.reminder.items.forEach((it) => { newPageIf(14); doc.setFont("helvetica", "normal"); doc.text("•", M + 6, y); para(it, false, 18); });
    }
    y += 8;
  }
  if (issues.length) {
    newPageIf(40);
    para(`Raised by the team (${issues.length})`, true);
    issues.forEach((i) => {
      newPageIf(28);
      doc.setFont("helvetica", "normal"); doc.text("•", M + 6, y);
      para(i.description, false, 18);
      doc.setTextColor(90);
      para(`Owner: ${i.owner_name || "none"}${i.due_date ? `  ·  fix by ${i.due_date}` : ""}  ·  status when printed: ${i.status === "fixed" ? `fixed ${new Date(i.fixed_at!).toLocaleDateString("en-US")}${i.fixed_note ? ` (${i.fixed_note})` : ""}` : "open"}`, false, 18);
      doc.setTextColor(0);
    });
    y += 8;
  }

  // Sign-in sheet -------------------------------------------------------------------------------------------------
  const COL = { n: M, name: M + 18, status: M + 178, sig: M + 245, when: W - M };
  const sheetHead = (cont: boolean) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.text(`Sign-in sheet${cont ? " (continued)" : ""}`, M, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80); y += 13;
    const sub = [r.week_number ? `${weekNumbers({ n: r.week_number, weeks: r.period_weeks ?? 1 })} of 52` : "", r.makeup_for_week ? `Makeup for the week of ${weekLabel(parseDay(r.makeup_for_week), "en-US")}` : "", r.title, held.date, r.team_name]
      .filter(Boolean).join("  ·  ");
    doc.text(doc.splitTextToSize(sub, CW), M, y); doc.setTextColor(0); y += 18;
    if (!cont && r.signing_statement) {
      // What each person tapped before signing, exactly as shown on the phone.
      const st = r.signing_statement;
      const said = st.language !== "en" && st.text !== st.en ? `"${st.text}" ("${st.en}")` : `"${st.en}"`;
      doc.setFont("helvetica", "italic"); doc.setFontSize(8.5); doc.setTextColor(70);
      const lines = doc.splitTextToSize(`Before signing, each person tapped: ${said}`, CW);
      doc.text(lines, M, y - 4); y += lines.length * 11 + 6; doc.setTextColor(0);
    }
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY);
    doc.text("#", COL.n, y); doc.text("NAME / ROLE", COL.name, y); doc.text("STATUS", COL.status, y); doc.text("SIGNATURE", COL.sig + 3, y);
    doc.text("DATE AND TIME SIGNED", COL.when, y, { align: "right" });
    doc.setTextColor(0); y += 6;
  };
  newPageIf(120); doc.setDrawColor(200); doc.line(M, y, W - M, y); y += 22; sheetHead(false);
  const rowH = 50;
  const stampCell = (iso: string | null, top: number) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    if (!iso) { doc.text("-", COL.when, top + 22, { align: "right" }); return; }
    const s = stampParts(iso);
    doc.text(s.date, COL.when, top + 16, { align: "right" });
    doc.text(s.time, COL.when, top + 28, { align: "right" });
  };
  r.attendees.forEach((a, i) => {
    if (newPageIf(rowH)) sheetHead(true);
    const flag = a.status !== "signed";
    if (flag) { doc.setFillColor(251, 230, 228); doc.rect(M - 6, y, CW + 12, rowH - 4, "F"); }
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(String(i + 1), COL.n, y + 20);
    doc.setFont("helvetica", "bold"); doc.text(doc.splitTextToSize(a.name, 155)[0] ?? "", COL.name, y + 18);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(100);
    doc.text(doc.splitTextToSize([a.role, a.team_name, a.company_name].filter(Boolean).join(" · "), 155)[0] ?? "", COL.name, y + 30); doc.setTextColor(0);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...(flag ? RED : GREEN));
    doc.text(STATUS_LABEL[a.status].toUpperCase(), COL.status, y + 22); doc.setTextColor(0);
    image(a.signature, COL.sig, y + 2);
    sigLine(doc, co, COL.sig, y + 40, a.status === "signed");
    stampCell(a.signed_at, y);
    if (a.confirmed_at) {
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(110);
      doc.text(`statement tapped ${stampParts(a.confirmed_at).time}`, COL.when, y + 39, { align: "right" }); doc.setTextColor(0);
    }
    y += rowH;
  });
  if (r.attendees.length === 0) { doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.text("No one on the roster.", M, y + 12); y += 24; }

  // Presenter -----------------------------------------------------------------------------------------------------
  y += 12; newPageIf(90);
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("TALK DELIVERED BY", M, y); doc.setTextColor(0); y += 14;
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(r.presenter_name || "________________________", M, y + 16);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(90); doc.text(r.presenter_role || "", M, y + 29); doc.setTextColor(0);
  if (!image(r.presenter_signature, COL.sig, y - 4)) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...RED); doc.text("NOT SIGNED", COL.sig + 3, y + 22); doc.setTextColor(0);
  }
  sigLine(doc, co, COL.sig, y + 36, !!r.presenter_signature);
  stampCell(r.presenter_signed_at, y - 4);

  // Check this record ------------------------------------------------------------------------------------------------
  // Anyone holding this paper can scan the code and see what was saved, straight from the database (counts, no names).
  y += 52; newPageIf(110);
  doc.setDrawColor(200); doc.roundedRect(M, y, CW, 96, 6, 6, "S");
  const QR = 80;
  if (r.verify_code && origin) drawQr(doc, verifyLink(origin, r.verify_code), M + 8, y + 8, QR);
  const tx = r.verify_code && origin ? M + QR + 20 : M + 14;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("CHECK THIS RECORD", tx, y + 22); doc.setTextColor(0);
  if (r.verify_code) {
    doc.setFont("courier", "bold"); doc.setFontSize(15); doc.text(formatCode(r.verify_code), tx, y + 42);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.text(doc.splitTextToSize(
      `${origin ? "Scan the code, or open " + origin.replace(/^https?:\/\//, "").replace(/\/+$/, "") + "/verify and type the code. " : "Type this code on the app's verify page. "}`
      + "It shows what was saved for this talk: company, talk, date and how many signed, didn't sign or were absent. No names.",
      CW - (tx - M) - 12), tx, y + 58);
  } else {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.text(doc.splitTextToSize("This record hasn't uploaded yet. Its check code appears on the PDF once it does.", CW - 28), tx, y + 40);
  }
  y += 56; // the photo block below adds its own space

  // Crew photo and paper sign-in sheet (both optional) --------------------------------------------------------------
  const photoBlock = (img: string, label: string, takenAt: string | null | undefined, maxH: number, note?: string) => {
    try {
      const p = doc.getImageProperties(img);
      const scale = Math.min(CW / p.width, maxH / p.height);
      const w = p.width * scale, h = p.height * scale;
      y += 52; newPageIf(h + (note ? 44 : 30));
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY);
      const when = takenAt ? stampParts(takenAt) : null;
      doc.text(`${label}${when ? ` · TAKEN ${when.date.toUpperCase()} ${when.time}` : ""}`, M, y); doc.setTextColor(0); y += 8;
      if (note) { doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.text(note, M, y + 4); y += 14; }
      doc.addImage(img, /^data:image\/png/i.test(img) ? "PNG" : "JPEG", M, y, w, h);
      y += h;
    } catch { /* an unreadable photo never blocks the record */ }
  };
  if (r.photo) photoBlock(r.photo, "TEAM PHOTO", r.photo_taken_at, 300);
  if (r.sheet) photoBlock(r.sheet, "PAPER SIGN-IN SHEET (PHOTO)", r.sheet_taken_at, 560,
    "Kept as evidence. The statuses above come from signatures on the phone; this sheet doesn't change them.");
  footer();
  return doc;
}

// Safety program summary ------------------------------------------------------------------------------------------
// The renewal packet (12 months) and the monthly "program stayed on" summary, built from the company safety profile
// (src/core/profile.ts). Counts and rates only: no names, no signatures. Missed weeks are listed, never hidden.

const fmtDay = (iso: string) => parseDay(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtMonth = (ym: string) => parseDay(`${ym}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
const pctText = (v: number | null) => (v === null ? "-" : `${Math.round(v * 100)}%`);

export function profilePdfFileName(kind: "renewal" | "monthly", p: Pick<SafetyProfile, "from" | "to">, co: Pick<Company, "name">): string {
  const name = (co.name || "Company").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();
  return `${name} - ${kind === "renewal" ? "Safety Program Summary" : "Monthly Program Summary"} - ${p.from} to ${p.to}.pdf`;
}

export function buildProfilePdf(p: SafetyProfile, co: HeaderCompany, opts: { kind: "renewal" | "monthly"; florida: boolean; crew: number; generatedAt?: Date }): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const { W, H, M } = PAGE, CW = W - 2 * M;
  let page = 1;
  const footer = () => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(GREY);
    doc.text(`${co.name ? co.name + " · " : ""}Safety program summary · Page ${page}`, M, H - 28);
    doc.text(PDF_FOOTER, W - M, H - 28, { align: "right" });
    doc.setTextColor(0);
    page++;
  };
  let y = companyHeader(doc, co, opts.kind === "renewal" ? "SAFETY PROGRAM SUMMARY" : "MONTHLY PROGRAM SUMMARY");
  const newPageIf = (h: number) => { if (y + h <= H - M - 24) return; footer(); doc.addPage(); y = M; };
  const heading = (t: string) => { newPageIf(40); doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(0); doc.text(t, M, y); y += 16; };
  const para = (t: string, size = 9.5, color = 40) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size); doc.setTextColor(color);
    (doc.splitTextToSize(t, CW) as string[]).forEach((l) => { newPageIf(13); doc.text(l, M, y); y += 13; });
    doc.setTextColor(0);
  };
  const s = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

  // Title and range
  doc.setFont("helvetica", "bold"); doc.setFontSize(20);
  doc.text(opts.kind === "renewal" ? "Safety program summary" : "Monthly program summary", M, y); y += 20;
  para(`${fmtDay(p.from)} to ${fmtDay(p.to)} · ${s(opts.crew, "team member", "team members")} on the roster`, 10, 70);
  para(`What ${co.name || "the company"} did to keep its teams safe in this period, counted from its own signed, dated records. Counts and rates only: no worker names, signatures or personal details are included.`, 9.5, 40);
  y += 10;

  // Key figures: six boxes, 3 across
  const figs: [string, string, string][] = [
    ["Weekly talks held", p.periodsEnded ? `${p.periodsWithTalk} of ${p.periodsEnded}` : "-", p.periodsMissed ? `${s(p.periodsMissed, "week")} with no talk` : p.periodsEnded ? "no missed weeks" : "no full weeks yet"],
    ["Team sign-in rate", pctText(p.signIn), p.onTime === null ? "" : `${pctText(p.onTime)} on time, rest made up`],
    ["Toolbox talks given", String(p.talks), `${s(p.topics, "topic")}${p.makeups ? `, ${s(p.makeups, "makeup")}` : ""}`],
    ["Daily pre-task plans", String(p.dailyDays), "days with a signed plan"],
    ["Inspections logged", String(p.log.inspections + p.log.walkarounds), `${s(p.log.walkarounds, "walk-around")} included`],
    ["Team-raised issues fixed", `${p.issues.fixed} of ${p.issues.raised}`, p.issues.medianDaysToFix === null ? "" : `typically ${s(p.issues.medianDaysToFix, "day")} to fix`],
  ];
  const bw = (CW - 2 * 12) / 3, bh = 58;
  figs.forEach(([label, value, note], i) => {
    const x = M + (i % 3) * (bw + 12), top = y + Math.floor(i / 3) * (bh + 10);
    doc.setDrawColor(200); doc.setLineWidth(0.6); doc.roundedRect(x, top, bw, bh, 4, 4, "S");
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(GREY); doc.text(label.toUpperCase(), x + 10, top + 15);
    doc.setFontSize(17); doc.setTextColor(0); doc.text(value, x + 10, top + 36);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(90); doc.text(doc.splitTextToSize(note, bw - 20)[0] ?? "", x + 10, top + 49);
  });
  y += 2 * bh + 10 + 22; doc.setTextColor(0);

  if (p.missedKeys.length) {
    doc.setTextColor(...RED); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
    newPageIf(14); doc.text("Weeks with no talk recorded", M, y); y += 13; doc.setTextColor(0);
    para(p.missedKeys.map((k) => weekLabel(parseDay(k), "en-US")).join("  ·  "));
    y += 8;
  }

  // Month by month
  if (p.months.length) {
    heading("Month by month");
    const cols = [M, M + 150, M + 235, M + 300, M + 385, M + 470];
    const head = ["Month", "Weeks held", "Missed", "Talks", "Sign-in rate", "On time"];
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY);
    head.forEach((h, i) => doc.text(h.toUpperCase(), cols[i], y)); y += 6; doc.setDrawColor(210); doc.line(M, y, W - M, y); y += 12;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    for (const m of p.months) {
      newPageIf(16);
      doc.setTextColor(0);
      doc.text(fmtMonth(m.month), cols[0], y);
      doc.text(m.periods ? `${m.periods - m.missed} of ${m.periods}` : "-", cols[1], y);
      if (m.missed) doc.setTextColor(...RED);
      doc.text(String(m.missed), cols[2], y); doc.setTextColor(0);
      doc.text(String(m.talks), cols[3], y);
      doc.text(pctText(m.signIn), cols[4], y);
      doc.text(pctText(m.onTime), cols[5], y);
      y += 15;
    }
    y += 6;
    para("Sign-in rate: team members on the roster who signed each week's talk, on time or made up later, over weeks that are over. A makeup keeps its real date and counts as late.", 8.5, 90);
    y += 6;
  }

  if (p.languages.length) {
    const lang = (id: string) => LANGUAGES.find((l) => l.id === id)?.label ?? id;
    para(`Languages the talks were given in: ${p.languages.map((l) => `${lang(l.language)} (${l.talks})`).join(", ")}.`);
    y += 8;
  }

  // Safety log and issues
  heading("Safety log and team-raised issues");
  const cit = p.log.citations.length ? ` ${s(p.log.citations.length, "citation")} (${p.log.citations.map((c) => c.status.replace("_", " ")).join(", ")}; read to teams as alleged until final).` : " No citations logged.";
  para(`${s(p.log.inspections, "inspection")}, ${s(p.log.walkarounds, "walk-around")}, ${s(p.log.incidents, "incident")} and ${s(p.log.nearMisses, "near miss", "near misses")} logged.${cit} ${s(p.log.open, "entry", "entries")} still open.`);
  para(`${s(p.issues.raised, "issue")} raised by teams at talks or from findings; ${p.issues.fixed} fixed${p.issues.medianDaysToFix === null ? "" : `, typically in ${s(p.issues.medianDaysToFix, "day")}`}. ${s(p.issues.open, "issue")} open now${p.issues.overdue ? `, ${p.issues.overdue} past due` : ""}.`);
  y += 8;

  // Self-reported
  if (p.emr.length || p.documents.length) {
    heading("Reported by the company");
    if (p.emr.length) para(`Experience modification rate (EMR), self-reported from the company's rating worksheet: ${p.emr.map((e) => `${e.rating_year}: ${e.emr.toFixed(2)}`).join("  ·  ")}. Not computed or verified by the app.`);
    // Kinds and dates, never titles (free text; this PDF goes to agents and carriers).
    if (p.documents.length) para(`Documents on file: ${p.documents.map((d) => `${DOCUMENT_KINDS.find((k) => k.id === d.kind)?.name ?? "Document"} (${fmtDay(d.uploaded_at.slice(0, 10))})`).join(", ")}.`);
    y += 8;
  }

  // Program elements
  heading(opts.florida ? "Safety program elements (Florida, s. 440.1025, F.S.)" : "Safety program elements");
  para("Where the app's records show each element of the company's program. Whether a program qualifies for a premium credit is decided by the insurer.", 8.5, 90);
  y += 4;
  const statusWord = { records: "Shown by app records", some: "Partly shown by app records", outside: "Outside the app" } as const;
  for (const e of p.elements) {
    const lines = doc.splitTextToSize(e.evidence, CW - 170) as string[];
    newPageIf(16 + lines.length * 12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(0); doc.text(e.name, M, y);
    if (e.status === "records") doc.setTextColor(...GREEN); else if (e.status === "outside") doc.setTextColor(GREY); else doc.setTextColor(150, 100, 0);
    doc.setFontSize(8.5); doc.text(statusWord[e.status], W - M, y, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(60);
    lines.forEach((l, i) => doc.text(l, M + 12, y + 12 + i * 12));
    y += 18 + lines.length * 12;
  }
  doc.setTextColor(0);

  y += 6;
  para(`Generated ${stampParts((opts.generatedAt ?? new Date()).toISOString()).date} from records that can't be edited after they're saved. Individual signed records are available from the company on request.`, 8.5, 90);
  footer();
  return doc;
}

// OSHA 300 log, 300A summary and the confidential privacy case list (src/core/oshaLog.ts) --------------------------
const OSHA_FOOTER = "Built from the OSHA Form 300 and 300A columns. Shows what the company recorded; doesn't certify compliance.";
const fileCo = (co: Pick<Company, "name">) => (co.name || "Company").replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();
export const oshaFileName = (co: Pick<Company, "name">, year: number, what: "300" | "300A" | "privacy" | "301" | "ita-summary" | "ita-cases", caseNo?: string) =>
  what === "301" ? `${fileCo(co)} - OSHA 301 Incident Report - ${caseNo}.pdf`
  : what === "ita-summary" ? `${fileCo(co)} - OSHA online filing - 300A - ${year}.csv`
  : what === "ita-cases" ? `${fileCo(co)} - OSHA online filing - 300 and 301 cases - ${year}.csv`
  : `${fileCo(co)} - ${what === "300" ? "OSHA 300 Log" : what === "300A" ? "OSHA 300A Summary" : "Privacy Case List (confidential)"} - ${year}.pdf`;
/** The establishment's address as one line: the filing fields when set, else the free-text address. */
const summaryAddress = (s: InjurySummary | null) =>
  !s ? "" : [s.street, [s.city, [s.state, s.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")].filter(Boolean).join(", ") || s.address;
const longDay = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

/** The year's log, one line per case (latest versions, removed cases left off), page totals on every page. */
export function buildOsha300Pdf(cases: InjuryCase[], co: HeaderCompany, year: number, sum: InjurySummary | null): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter", orientation: "landscape" });
  const W = 792, H = 612, M = 36;
  // A B C D E F | G H I J | K L | M1-M6
  const cols: { key: string; w: number; head: string; align?: "center" }[] = [
    { key: "A", w: 44, head: "(A) Case no." }, { key: "B", w: 92, head: "(B) Employee's name" }, { key: "C", w: 72, head: "(C) Job title" },
    { key: "D", w: 50, head: "(D) Date of injury or onset of illness" }, { key: "E", w: 86, head: "(E) Where the event occurred" },
    { key: "F", w: 132, head: "(F) Describe injury or illness, parts of body affected, and object/substance that directly injured or made person ill" },
    ...OUTCOMES.map((o) => ({ key: o.col, w: 30, head: `(${o.col}) ${{ G: "Death", H: "Days away", I: "Transfer or restriction", J: "Other recordable" }[o.col]}`, align: "center" as const })),
    { key: "K", w: 30, head: "(K) Days away", align: "center" }, { key: "L", w: 30, head: "(L) Days job transfer or restriction", align: "center" },
    ...KINDS.map((k) => ({ key: `M${k.n}`, w: 12, head: `(${k.n})`, align: "center" as const })),
  ];
  const x: Record<string, number> = {}; let cx = M; for (const c of cols) { x[c.key] = cx; cx += c.w; }
  const right = cx;
  let page = 1;
  const head = () => {
    let y = companyHeader(doc, co, `OSHA 300 LOG · ${year}`, M, W, M) - 10;
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text(`Log of Work-Related Injuries and Illnesses · ${year}`, M, y);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(80);
    const est = [sum?.establishment, sum?.address].filter(Boolean).join(" · ");
    if (est) doc.text(`Establishment: ${est}`, right, y, { align: "right" });
    y += 11;
    doc.text("This log holds employee health information. Protect the confidentiality of employees as far as possible while it is used for safety and health purposes. Privacy cases show \"Privacy case\" instead of a name.", M, y);
    doc.setTextColor(0); y += 12;
    // Column headings: group labels, then each column's own heading.
    doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); doc.setTextColor(GREY);
    doc.text("IDENTIFY THE PERSON", x.A, y); doc.text("DESCRIBE THE CASE", x.D, y); doc.text("CLASSIFY (ONE BOX)", x.G, y);
    doc.text("DAYS", x.K, y); doc.text("TYPE (M)", x.M1, y);
    y += 4; doc.setDrawColor(30); doc.line(M, y, right, y); y += 8;
    doc.setFont("helvetica", "normal"); doc.setFontSize(6); doc.setTextColor(40);
    let tall = 0;
    for (const c of cols) {
      const lines = doc.splitTextToSize(c.head, c.w - 3) as string[];
      lines.forEach((l, i) => doc.text(l, c.align ? x[c.key] + c.w / 2 : x[c.key] + 1, y + i * 7, c.align ? { align: "center" } : undefined));
      tall = Math.max(tall, lines.length);
    }
    doc.setTextColor(0); y += tall * 7; doc.line(M, y, right, y);
    return y + 10;
  };
  const footer = () => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(GREY);
    doc.text(`${co.name || ""} · OSHA 300 log ${year} · Page ${page}`, M, H - 20);
    doc.text(OSHA_FOOTER, W - M, H - 20, { align: "right" }); doc.setTextColor(0);
    page++;
  };
  const list = [...cases].sort((a, b) => a.case_no - b.case_no);
  let y = head();
  let pageCases: InjuryCase[] = [];
  const pageTotals = (last: boolean) => {
    const t = logTotals(pageCases);
    doc.setDrawColor(30); doc.line(M, y - 6, right, y - 6);
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
    doc.text(last ? "Page totals (carry the year's totals to the 300A summary)" : "Page totals", x.F + cols[5].w - 4, y + 4, { align: "right" });
    const put = (k: string, v: number) => { const c = cols.find((cc) => cc.key === k)!; doc.text(String(v), x[k] + c.w / 2, y + 4, { align: "center" }); };
    (["G", "H", "I", "J", "K", "L"] as const).forEach((k) => put(k, t[k]));
    KINDS.forEach((k) => put(`M${k.n}`, t.M[k.n]));
    y += 14;
  };
  if (list.length === 0) {
    doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.text(`No recordable injuries or illnesses logged for ${year}.`, M, y + 4); y += 20;
  }
  for (const c of list) {
    doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    const cell = (k: string, t: string) => doc.splitTextToSize(t || "-", cols.find((cc) => cc.key === k)!.w - 4) as string[];
    const parts: Record<string, string[]> = {
      A: [caseLabel(c)], B: cell("B", nameOnLog(c)), C: cell("C", c.job_title), D: [longDay(c.injury_date)], E: cell("E", c.location), F: cell("F", c.description),
    };
    const rowH = Math.max(...Object.values(parts).map((l) => l.length)) * 8.5 + 6;
    if (y + rowH > H - M - 40) { pageTotals(false); footer(); doc.addPage(); pageCases = []; y = head(); }
    for (const [k, lines] of Object.entries(parts)) lines.forEach((l, i) => doc.text(l, x[k] + 1, y + i * 8.5));
    const mark = (k: string) => { const cc = cols.find((q) => q.key === k)!; doc.setFont("helvetica", "bold"); doc.text("X", x[k] + cc.w / 2, y, { align: "center" }); doc.setFont("helvetica", "normal"); };
    mark(OUTCOMES.find((o) => o.id === c.outcome)!.col);
    mark(`M${KINDS.find((k) => k.id === c.kind)!.n}`);
    const num = (k: string, v: number) => { const cc = cols.find((q) => q.key === k)!; doc.text(String(v), x[k] + cc.w / 2, y, { align: "center" }); };
    num("K", c.days_away); num("L", c.days_restricted);
    y += rowH; doc.setDrawColor(215); doc.line(M, y - 6, right, y - 6);
    pageCases.push(c);
  }
  y += 6; pageTotals(true);
  footer();
  return doc;
}

/** The 300A for a year: totals of every column, establishment and employment information, certification lines. */
export function buildOsha300APdf(cases: InjuryCase[], co: HeaderCompany, year: number, sum: InjurySummary | null): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const { W, H, M } = PAGE, CW = W - 2 * M;
  const t = logTotals(cases);
  let y = companyHeader(doc, co, `OSHA 300A SUMMARY · ${year}`);
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text(`Summary of Work-Related Injuries and Illnesses · ${year}`, M, y); y += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(70);
  doc.splitTextToSize("Every establishment covered by 29 CFR Part 1904 completes this summary, even with no recordable injuries or illnesses in the year. Review the log for completeness and accuracy first; the totals below come from it.", CW)
    .forEach((l: string) => { doc.text(l, M, y); y += 11; });
  doc.setTextColor(0); y += 12;
  const box = (label: string, v: number | string, bx: number, bw: number) => {
    doc.setDrawColor(190); doc.roundedRect(bx, y, bw, 52, 4, 4, "S");
    doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text(String(v), bx + bw / 2, y + 26, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(70);
    (doc.splitTextToSize(label, bw - 8) as string[]).forEach((l, i) => doc.text(l, bx + bw / 2, y + 38 + i * 8, { align: "center" }));
    doc.setTextColor(0);
  };
  const group = (title: string) => { doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(GREY); doc.text(title, M, y); doc.setTextColor(0); y += 8; };
  group("NUMBER OF CASES");
  const w4 = (CW - 3 * 8) / 4;
  [["(G) Total deaths", t.G], ["(H) Cases with days away from work", t.H], ["(I) Cases with job transfer or restriction", t.I], ["(J) Other recordable cases", t.J]]
    .forEach(([l, v], i) => box(l as string, v as number, M + i * (w4 + 8), w4));
  y += 68; group("NUMBER OF DAYS");
  const w2 = (CW - 8) / 2;
  box("(K) Total days away from work", t.K, M, w2); box("(L) Total days of job transfer or restriction", t.L, M + w2 + 8, w2);
  y += 68; group("INJURY AND ILLNESS TYPES (M)");
  const w6 = (CW - 5 * 8) / 6;
  KINDS.forEach((k, i) => box(`(${k.n}) ${k.label}`, t.M[k.n], M + i * (w6 + 8), w6));
  y += 76;
  const field = (k: string, v: string, fx: number, fw: number) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(GREY); doc.text(k.toUpperCase(), fx, y); doc.setTextColor(0);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const ls = (doc.splitTextToSize(v || "", fw) as string[]).slice(0, 2);
    ls.forEach((l, i) => doc.text(l, fx, y + 13 + i * 12));
    doc.setDrawColor(200); doc.line(fx, y + 17 + (Math.max(ls.length, 1) - 1) * 12, fx + fw, y + 17 + (Math.max(ls.length, 1) - 1) * 12);
  };
  const half = (CW - 24) / 2, x2 = M + half + 24;
  group("ESTABLISHMENT INFORMATION"); y += 6;
  field("Establishment name", sum?.establishment || co.name || "", M, half); field("Street, city, state, ZIP", summaryAddress(sum) || co.address || "", x2, half); y += 38;
  field("Industry description", sum?.industry || "", M, half); field("NAICS code, if known", sum?.naics || "", x2, half); y += 38;
  group("EMPLOYMENT INFORMATION"); y += 6;
  field("Annual average number of employees", sum?.avg_employees != null ? sum.avg_employees.toLocaleString("en-US") : "", M, half);
  field("Total hours worked by all employees last year", sum?.hours_worked != null ? sum.hours_worked.toLocaleString("en-US") : "", x2, half); y += 42;
  group("SIGN HERE"); y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.text(FALSIFYING, M, y); y += 13;
  doc.splitTextToSize("I certify that I have examined this document and that to the best of my knowledge the entries are true, accurate, and complete.", CW)
    .forEach((l: string) => { doc.text(l, M, y); y += 11; });
  y += 14;
  const q = (CW - 3 * 16) / 4;
  field("Company executive (signature)", "", M, q * 1.6); field("Name", sum?.certifier_name || "", M + q * 1.6 + 16, q * 1.2);
  field("Title", sum?.certifier_title || "", M + q * 2.8 + 32, q * 1.2 - 16); y += 34;
  field("Phone", sum?.certifier_phone || "", M, q * 1.6); field("Date", "", M + q * 1.6 + 16, q * 1.2); y += 40;
  const pw = postingWindow(year);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(`Post this summary from ${longDay(pw.from)} to ${longDay(pw.to)}.`, M, y); y += 13;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(60);
  doc.splitTextToSize(EMPLOYEE_ACCESS, CW).forEach((l: string) => { doc.text(l, M, y); y += 10; });
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GREY);
  doc.text(`${co.name || ""} · OSHA 300A summary ${year}`, M, H - 30);
  doc.text(OSHA_FOOTER, M, H - 20); doc.setTextColor(0); void W;
  return doc;
}

/** The separate, confidential list of privacy case numbers and names (1904.29(b)(6)). Never posted or shared. */
export function buildPrivacyListPdf(cases: InjuryCase[], co: HeaderCompany, year: number): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const { W, H, M } = PAGE, CW = W - 2 * M;
  let y = companyHeader(doc, co, `PRIVACY CASE LIST · ${year}`);
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(...RED); doc.text("CONFIDENTIAL", M, y); doc.setTextColor(0); y += 18;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  doc.splitTextToSize("Case numbers and names for the privacy cases on the OSHA 300 log. Keep this list separate from the log; don't post it or give it out with the log. It lets the company update these cases and answer a government request.", CW)
    .forEach((l: string) => { doc.text(l, M, y); y += 11; });
  y += 12;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY);
  doc.text("CASE NO.", M, y); doc.text("NAME", M + 80, y); doc.text("DATE", M + 300, y); doc.text("JOB TITLE", M + 380, y);
  doc.setTextColor(0); y += 6; doc.setDrawColor(30); doc.line(M, y, W - M, y); y += 14;
  const list = cases.filter((c) => c.privacy).sort((a, b) => a.case_no - b.case_no);
  // Every page says confidential, not just the last.
  const foot = () => { doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GREY); doc.text(`${co.name || ""} · Privacy case list ${year} · Confidential`, M, H - 28); doc.setTextColor(0); doc.setFontSize(10); };
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  for (const c of list) {
    if (y > H - M - 40) {
      foot(); doc.addPage(); y = M;
      doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(...RED); doc.text(`CONFIDENTIAL · PRIVACY CASE LIST ${year} (continued)`, M, y); doc.setTextColor(0); y += 24;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    }
    doc.text(caseLabel(c), M, y); doc.text(doc.splitTextToSize(c.employee_name, 210)[0] ?? "", M + 80, y); doc.text(longDay(c.injury_date), M + 300, y);
    doc.text(doc.splitTextToSize(c.job_title || "-", CW - 380)[0] ?? "", M + 380, y); y += 18;
  }
  if (!list.length) { doc.setFont("helvetica", "italic"); doc.text("No privacy cases this year.", M, y); }
  foot();
  return doc;
}

/**
 * Form 301 for one case (equivalent form): the employee, the doctor or other health care professional, and the case,
 * fields 1-18 in the form's order. Holds health information: give it out only as 1904.35 allows.
 */
export function buildOsha301Pdf(c: InjuryCase, co: HeaderCompany): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const { W, H, M } = PAGE, CW = W - 2 * M;
  let y = companyHeader(doc, co, `OSHA 301 · CASE ${caseLabel(c)}`);
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("Injury and Illness Incident Report", M, y); y += 14;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(70);
  doc.splitTextToSize("This report holds employee health information. Protect the confidentiality of employees as far as possible while it is used for safety and health purposes. Keep it for 5 years after the year it covers.", CW)
    .forEach((l: string) => { doc.text(l, M, y); y += 10; });
  doc.setTextColor(0); y += 10;
  const yn = (b: boolean | null) => (b === null ? "" : b ? "Yes" : "No");
  const t12 = (t: string | null) => { if (!t) return ""; const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
  const section = (title: string) => {
    if (y > H - M - 80) { doc.addPage(); y = M; }
    doc.setFillColor(238, 238, 234); doc.rect(M, y - 10, CW, 16, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.text(title, M + 6, y + 1); y += 20;
  };
  const item = (n: number, label: string, v: string, w = CW) => {
    doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(90);
    const lab = doc.splitTextToSize(`${n}) ${label}`, w) as string[];
    lab.forEach((l, i) => doc.text(l, M, y + i * 9)); doc.setTextColor(0);
    let yy = y + lab.length * 9 + 3;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
    const lines = doc.splitTextToSize(v || " ", w) as string[];
    if (yy + lines.length * 12 > H - M - 30) { doc.addPage(); y = M; yy = y + lab.length * 9 + 3; }
    lines.forEach((l, i) => doc.text(l, M, yy + i * 12));
    y = yy + Math.max(1, lines.length) * 12 + 2; doc.setDrawColor(215); doc.line(M, y, W - M, y); y += 12;
  };
  section("INFORMATION ABOUT THE EMPLOYEE");
  item(1, "Full name", c.employee_name);
  item(2, "Street, city, state, ZIP", c.employee_address);
  item(3, "Date of birth", c.birth_date ? longDay(c.birth_date) : "");
  item(4, "Date hired", c.hire_date ? longDay(c.hire_date) : "");
  item(5, "Sex", c.sex === "M" ? "Male" : c.sex === "F" ? "Female" : "");
  section("INFORMATION ABOUT THE PHYSICIAN OR OTHER HEALTH CARE PROFESSIONAL");
  item(6, "Name of physician or other health care professional", c.provider_name);
  item(7, "If treatment was given away from the worksite, where was it given? Facility, street, city, state, ZIP", c.provider_facility);
  item(8, "Was the employee treated in an emergency room?", yn(c.er_visit));
  item(9, "Was the employee hospitalized overnight as an in-patient?", yn(c.inpatient));
  section("INFORMATION ABOUT THE CASE");
  item(10, "Case number from the Log", caseLabel(c));
  item(11, "Date of injury or illness", longDay(c.injury_date));
  item(12, "Time employee began work", t12(c.time_started));
  item(13, "Time of event", c.time_unknown ? "Can't be determined" : t12(c.time_of_event));
  item(14, "What was the employee doing just before the incident occurred? Describe the activity, and the tools, equipment, or material the employee was using.", c.activity_before);
  item(15, "What happened? Tell us how the injury occurred.", c.what_happened);
  item(16, "What was the injury or illness? Tell us the part of the body that was affected and how it was affected.", c.injury_detail || c.description);
  item(17, "What object or substance directly harmed the employee?", c.object_substance);
  item(18, "If the employee died, when did death occur? Date of death", c.death_date ? longDay(c.death_date) : "");
  if (y > H - M - 90) { doc.addPage(); y = M; }
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("COMPLETED BY", M, y); doc.setTextColor(0); y += 13;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.text(`${c.completed_by || "________________________"}${c.completed_title ? ", " + c.completed_title : ""}${c.completed_phone ? " · " + c.completed_phone : ""}`, M, y); y += 14;
  const gaps = incidentGaps(c);
  if (gaps.length) {
    doc.setFontSize(8.5); doc.setTextColor(...RED);
    doc.splitTextToSize(`Still to fill in: ${gaps.join("; ")}.`, CW).forEach((l: string) => { doc.text(l, M, y); y += 10; });
    doc.setTextColor(0);
  }
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GREY);
  doc.text(`${co.name || ""} · OSHA 301 · ${caseLabel(c)}${c.privacy ? " · Privacy case: confidential" : ""}`, M, H - 30);
  doc.text(OSHA_FOOTER, M, H - 20); doc.setTextColor(0);
  return doc;
}

/**
 * An inspection's PDF, built only from the saved inspection: every item with its result and note, photos of what
 * failed, the inspector's signature and a check code. Documents that someone looked; not a certification.
 */
export function buildInspectionPdf(r: InspectionPdfInput, co: HeaderCompany, origin: string | null = appWebAddress()): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const { W, H, M } = PAGE, CW = W - 2 * M;
  let page = 1;
  const footer = () => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(GREY);
    doc.text(`${co.name ? co.name + " · " : ""}Inspection ${r.id} · Page ${page}`, M, H - 28);
    if (r.verify_code) doc.text(`Check code ${formatCode(r.verify_code)}${origin ? ` at ${origin.replace(/^https?:\/\//, "").replace(/\/+$/, "")}/verify` : ""}`, M, H - 18);
    doc.text("Documents an inspection. Does not by itself certify OSHA compliance.", W - M, H - 28, { align: "right" });
    doc.setTextColor(0); page++;
  };
  let y = companyHeader(doc, co, "INSPECTION RECORD");
  const next = (h: number) => { if (y + h > H - M - 30) { footer(); doc.addPage(); y = M; return true; } return false; };
  doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.text(r.title, M, y); y += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(80);
  doc.splitTextToSize(`Rule: ${r.rule}`, CW).forEach((l: string) => { doc.text(l, M, y); y += 11; });
  doc.setTextColor(0); y += 8;
  const held = stampParts(r.inspected_at);
  const pairs: [string, string][] = [["Date and time", `${held.date}, ${held.time}`], ["What was inspected", r.subject || "-"], ["Where", r.jobsite_name || "-"], ["Inspected by", r.inspector_name]];
  doc.setFontSize(8);
  pairs.forEach(([k, v], i) => {
    const x = i % 2 ? M + CW / 2 : M; if (i % 2 === 0 && i) y += 30;
    doc.setFont("helvetica", "bold"); doc.setTextColor(GREY); doc.text(k.toUpperCase(), x, y); doc.setTextColor(0);
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.text(doc.splitTextToSize(v, CW / 2 - 12)[0] ?? "", x, y + 13); doc.setFontSize(8);
  });
  y += 40;
  const fails = r.items.filter((i) => i.result === "fail").length, nas = r.items.filter((i) => i.result === "na").length;
  doc.setFillColor(...(fails ? ([251, 230, 228] as [number, number, number]) : ([228, 243, 234] as [number, number, number]))); doc.rect(M - 6, y - 12, CW + 12, 20, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text(`${r.items.length - fails - nas} pass  ·  ${fails} fail  ·  ${nas} not applicable`, M, y + 2);
  if (fails) { doc.setTextColor(...RED); doc.text(`${fails} TO FIX`, W - M, y + 2, { align: "right" }); doc.setTextColor(0); }
  y += 28;
  const RES = { pass: ["PASS", GREEN], fail: ["FAIL", RED], na: ["N/A", [110, 110, 110]] } as const;
  r.items.forEach((it, n) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    const text = doc.splitTextToSize(it.text, CW - 110) as string[];
    const note = it.note ? (doc.splitTextToSize(`Note: ${it.note}`, CW - 110) as string[]) : [];
    const rule = it.rule ? (doc.splitTextToSize(it.rule, CW - 110) as string[]) : [];
    const h = (text.length + note.length) * 12 + rule.length * 9 + 10;
    next(h);
    if (it.result === "fail") { doc.setFillColor(251, 230, 228); doc.rect(M - 6, y - 10, CW + 12, h, "F"); }
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text(String(n + 1), M, y);
    doc.setFontSize(9.5); text.forEach((l, i) => doc.text(l, M + 20, y + i * 12));
    let yy = y + text.length * 12;
    if (rule.length) { doc.setFontSize(7.5); doc.setTextColor(120); rule.forEach((l, i) => doc.text(l, M + 20, yy + i * 9 - 2)); doc.setTextColor(0); yy += rule.length * 9; }
    if (note.length) { doc.setFont("helvetica", "italic"); doc.setFontSize(9); note.forEach((l, i) => doc.text(l, M + 20, yy + i * 12)); doc.setFont("helvetica", "normal"); }
    const [label, color] = RES[it.result];
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(...(color as [number, number, number])); doc.text(label, W - M, y, { align: "right" }); doc.setTextColor(0);
    y += h; doc.setDrawColor(225); doc.line(M, y - 8, W - M, y - 8);
  });
  if (r.notes) { next(40); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("NOTES", M, y + 4); doc.setTextColor(0); y += 16; doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.splitTextToSize(r.notes, CW).forEach((l: string) => { next(12); doc.text(l, M, y); y += 12; }); }
  // Photos of failed items.
  for (const [n, it] of r.items.entries()) {
    if (!it.photo) continue;
    try {
      const p = doc.getImageProperties(it.photo); const scale = Math.min(CW / 2 / p.width, 200 / p.height);
      next(p.height * scale + 30); y += 10;
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text(`PHOTO · ITEM ${n + 1}`, M, y); doc.setTextColor(0); y += 6;
      doc.addImage(it.photo, /^data:image\/png/i.test(it.photo) ? "PNG" : "JPEG", M, y, p.width * scale, p.height * scale); y += p.height * scale + 8;
    } catch { /* an unreadable photo never blocks the record */ }
  }
  next(120); y += 14;
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("INSPECTED BY", M, y); doc.setTextColor(0); y += 14;
  doc.setFontSize(11); doc.text(r.inspector_name, M, y + 16);
  if (r.signature) { try { doc.addImage(r.signature, "PNG", M + 230, y - 4, 150, 38); } catch { /* keep going */ } }
  else { doc.setFontSize(9); doc.setTextColor(...RED); doc.text("NOT SIGNED", M + 233, y + 22); doc.setTextColor(0); }
  doc.setDrawColor(120); doc.line(M + 230, y + 36, M + 380, y + 36);
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.text(`${held.date} ${held.time}`, W - M, y + 22, { align: "right" });
  y += 60;
  if (r.verify_code && origin) {
    next(100); doc.setDrawColor(200); doc.roundedRect(M, y, CW, 92, 6, 6, "S");
    drawQr(doc, verifyLink(origin, r.verify_code), M + 8, y + 6, 80);
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(GREY); doc.text("CHECK THIS RECORD", M + 100, y + 22); doc.setTextColor(0);
    doc.setFont("courier", "bold"); doc.setFontSize(15); doc.text(formatCode(r.verify_code), M + 100, y + 42);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    doc.text(doc.splitTextToSize(`Scan the code, or open ${origin.replace(/^https?:\/\//, "").replace(/\/+$/, "")}/verify and type it, to see what was saved: the checklist, date and how many items passed and failed. No names.`, CW - 112), M + 100, y + 58);
  }
  footer();
  return doc;
}

export type InspectionPdfInput = {
  id: string; title: string; rule: string; subject: string; jobsite_name: string; inspector_name: string; inspected_at: string; notes: string;
  signature: string | null; verify_code: string | null;
  items: { text: string; rule?: string; result: "pass" | "fail" | "na"; note?: string; photo?: string | null }[];
};

export function inspectionPdfFileName(r: Pick<InspectionPdfInput, "title" | "subject" | "inspected_at">): string {
  const d = new Date(r.inspected_at);
  const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const clean = (s: string) => s.replace(/[^\w\s-]/g, "").replace(/\s+/g, " ").trim();
  return `Inspection - ${clean(r.title)}${r.subject ? ` - ${clean(r.subject)}` : ""} - ${iso}.pdf`;
}
