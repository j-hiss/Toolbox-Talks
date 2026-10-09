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
import { normalizeTheme, rgb } from "@/core/theme";

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

export function buildRecordPdf(r: TalkRecord, co: Company, issues: Issue[] = []): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const W = 612, H = 792, M = 48, CW = W - 2 * M;
  let y = M;
  let page = 1;

  const footer = () => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(GREY);
    doc.text(`${co.name ? co.name + " · " : ""}Record ${r.id} · Page ${page}`, M, H - 28);
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
  // A band in the company's brand color (Admin → Brand). Decoration only: the record's content never depends on it.
  doc.setFillColor(...rgb(normalizeTheme(co.theme).brand)); doc.rect(0, 0, W, 8, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text(co.name || "Company name not set", M, y + 4);
  doc.setFontSize(9); doc.setTextColor(GREY); doc.text(r.kind === "daily" ? "DAILY PRE-TASK PLAN RECORD" : "TOOLBOX TALK RECORD", W - M, y + 4, { align: "right" });
  y += 18; doc.setTextColor(60); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
  const coLines = [co.address, [co.phone, co.email].filter(Boolean).join("  ·  "), (co.licenses || "").split(/\n+/).map((s) => s.trim()).filter(Boolean).join("  ·  ")].filter(Boolean);
  coLines.forEach((l) => doc.splitTextToSize(l, CW).forEach((x: string) => { doc.text(x, M, y); y += 11; }));
  doc.setTextColor(0); y += 6; doc.setDrawColor(30); doc.setLineWidth(1.2); doc.line(M, y, W - M, y); doc.setLineWidth(0.6); y += 26;

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
    ["Crew", r.team_name],
    ["Crew lead", r.team_lead_name],
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
  para(`Crew discussion: ${t.ask}`, false); y += 10;

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
      para(`Reviewed with the crew ${new Date(it.reviewed_with_crew_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`, false, 12);
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
    para(`Raised by the crew (${issues.length})`, true);
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
    doc.setDrawColor(120); doc.line(COL.sig, y + 40, COL.sig + 150, y + 40);
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
  doc.setDrawColor(120); doc.line(COL.sig, y + 36, COL.sig + 150, y + 36);
  stampCell(r.presenter_signed_at, y - 4);

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
  if (r.photo) photoBlock(r.photo, "CREW PHOTO", r.photo_taken_at, 300);
  if (r.sheet) photoBlock(r.sheet, "PAPER SIGN-IN SHEET (PHOTO)", r.sheet_taken_at, 560,
    "Kept as evidence. The statuses above come from signatures on the phone; this sheet doesn't change them.");
  footer();
  return doc;
}
