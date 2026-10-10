// Who has to keep the OSHA log and file it online, and the files OSHA's Injury Tracking Application (ITA) takes.
// Pure module. Works the same for every industry: the answer comes from the company's NAICS code and headcount,
// never from which industry it picked in the app.
//
// Checked on 2026-10-10 against the rule text and OSHA's ITA CSV specifications:
// - 1904.1: a company with 10 or fewer employees at all times in the last calendar year doesn't keep the log
//   unless OSHA or the Bureau of Labor Statistics asks in writing. 1904.2 + Appendix A to Subpart B: partially
//   exempt industries (also unless asked). Serious-injury reporting (1904.39) applies to everyone either way.
// - 1904.41(a)(1)(i): 20-249 employees and an Appendix A (Subpart E) industry → submit the 300A online each year.
//   (a)(1)(ii): 250+ employees and the log is required → submit the 300A. (a)(2): 100+ employees and an Appendix B
//   industry → also submit the 300 and 301, without the employee's name and address, the doctor's name, or the
//   treatment facility (1904.41(b)). Due March 2 of the next year (1904.41(c)). Every person employed at any time in
//   the year counts as one employee (1904.41(b)(2)).
// - OSHA's lists use 2012 NAICS codes, matched here by prefix. A newer code may need checking on OSHA's site.
// This tells a company what the rule appears to ask of it. It isn't legal advice and never says it is compliant.
import { csvCell } from "./csv";
import { KINDS, OUTCOMES, caseLabel, logTotals, nameInNarrative, type InjuryCase, type InjurySummary } from "./oshaLog";

/** Appendix A to Subpart B of Part 1904: partially exempt industries. */
export const PARTIALLY_EXEMPT = ["4412", "4431", "4461", "4471", "4481", "4482", "4483", "4511", "4512", "4531", "4532", "4812", "4861", "4862", "4869", "4879", "4885", "5111", "5112", "5121", "5122", "5151", "5172", "5173", "5179", "5181", "5182", "5191", "5211", "5221", "5222", "5223", "5231", "5232", "5239", "5241", "5242", "5251", "5259", "5312", "5331", "5411", "5412", "5413", "5414", "5415", "5416", "5417", "5418", "5511", "5611", "5614", "5615", "5616", "6111", "6112", "6113", "6114", "6115", "6116", "6117", "6211", "6212", "6213", "6214", "6215", "6244", "7114", "7115", "7213", "7221", "7222", "7224", "7225" /* 7221 and 7222 merged into 7225 in NAICS 2012 */, "8112", "8114", "8121", "8122", "8131", "8132", "8133", "8134", "8139"];

/** Appendix A to Subpart E: 300A online for 20-249 employees. "31-33" is written as its three sectors. */
export const APPENDIX_A = ["11", "22", "23", "31", "32", "33", "42", "4413", "4421", "4422", "4441", "4442", "4451", "4452", "4522", "4523", "4533", "4542", "4543", "4811", "4841", "4842", "4851", "4852", "4853", "4854", "4855", "4859", "4871", "4881", "4882", "4883", "4884", "4889", "4911", "4921", "4922", "4931", "5152", "5311", "5321", "5322", "5323", "5617", "5621", "5622", "5629", "6219", "6221", "6222", "6223", "6231", "6232", "6233", "6239", "6242", "6243", "7111", "7112", "7121", "7131", "7132", "7211", "7212", "7223", "8113", "8123"];

/** Appendix B to Subpart E: 300 and 301 online too, for 100+ employees. */
export const APPENDIX_B = ["1111", "1112", "1113", "1114", "1119", "1121", "1122", "1123", "1129", "1133", "1141", "1142", "1151", "1152", "1153", "2213", "2381", "3111", "3113", "3114", "3115", "3116", "3117", "3118", "3119", "3121", "3161", "3162", "3211", "3212", "3219", "3261", "3262", "3271", "3272", "3273", "3279", "3312", "3314", "3315", "3321", "3323", "3324", "3325", "3326", "3327", "3328", "3331", "3335", "3361", "3362", "3363", "3366", "3371", "3372", "3379", "4231", "4233", "4235", "4239", "4244", "4248", "4413", "4422", "4441", "4442", "4451", "4522", "4523", "4533", "4543", "4811", "4841", "4842", "4851", "4852", "4853", "4854", "4859", "4871", "4881", "4883", "4889", "4911", "4921", "4931", "5322", "5621", "5622", "6219", "6221", "6222", "6223", "6231", "6232", "6233", "6239", "6243", "7111", "7112", "7131", "7211", "7212", "7223"];

const inList = (naics: string, list: string[]) => /^\d{2,6}$/.test(naics) && list.some((code) => naics.startsWith(code));

export type FilingDuty = {
  /** "keep" = keep the log; "small" = 10 or fewer all year; "exempt" = partially exempt industry; "unknown" = need the code. */
  log: "keep" | "small" | "exempt" | "unknown";
  file300A: boolean;
  file300_301: boolean;
  /** Plain-words reasons, each with its rule. */
  why: string[];
};

/**
 * What the rule appears to ask, from the 6-digit NAICS code and everyone employed at any time in the year. `maxAtOnce`
 * (the most employed at any one time) decides the 10-or-fewer exemption when known; else peak is used.
 */
export function filingDuty(naics: string, peak: number | null, maxAtOnce: number | null = null): FilingDuty {
  const why: string[] = [];
  if (!/^\d{6}$/.test(naics) || peak === null) {
    return { log: "unknown", file300A: false, file300_301: false, why: ["Add your 6-digit NAICS code and how many people worked for you at any time this year."] };
  }
  const small = (maxAtOnce ?? peak) <= 10;
  const exempt = inList(naics, PARTIALLY_EXEMPT);
  const log: FilingDuty["log"] = small ? "small" : exempt ? "exempt" : "keep";
  if (small) why.push("10 or fewer employees at all times: no log needed unless OSHA or the Bureau of Labor Statistics asks in writing (1904.1).");
  else if (exempt) why.push("Your industry is partially exempt: no log needed unless OSHA or the Bureau of Labor Statistics asks in writing (1904.2).");
  else why.push("Keep the OSHA 300 log, 301 reports and post the 300A each year (1904.1, 1904.2).");
  const keeps = log === "keep";
  const a = keeps && ((peak >= 20 && peak <= 249 && inList(naics, APPENDIX_A)) || peak >= 250);
  const b = keeps && peak >= 100 && inList(naics, APPENDIX_B);
  if (a) why.push(peak >= 250 ? "250 or more employees: file the 300A online by March 2 (1904.41(a)(1)(ii))." : "20 to 249 employees in a listed industry: file the 300A online by March 2 (1904.41(a)(1)(i)).");
  if (b) why.push("100 or more employees in a listed industry: also file the 300 log and 301 reports online (1904.41(a)(2)).");
  if (keeps && !a) why.push("No online filing for your size and industry unless OSHA asks (1904.41(a)(3)).");
  why.push("Report a death within 8 hours, and an in-patient hospitalization, amputation or loss of an eye within 24 hours, whatever your size (1904.39).");
  return { log, file300A: a, file300_301: b, why };
}

/** The ITA size code from everyone employed at any time in the year. */
export function sizeCode(peak: number): 1 | 21 | 22 | 3 {
  return peak < 20 ? 1 : peak < 100 ? 21 : peak < 250 ? 22 : 3;
}

const mmddyyyy = (d: string | null) => (d ? `${d.slice(5, 7)}/${d.slice(8, 10)}/${d.slice(0, 4)}` : "");
const hhmm = (t: string | null) => (t ? t.slice(0, 5) : "");
const row = (cells: unknown[]) => cells.map(csvCell).join(",");

export const ITA_SUMMARY_HEADERS = ["establishment_name", "ein_number", "company_name", "street_address", "city", "state", "zip", "naics_code", "industry_description", "size", "establishment_type", "year_filing_for", "annual_average_employees", "total_hours_worked", "no_injuries_illnesses", "total_deaths", "total_dafw_cases", "total_djtr_cases", "total_other_cases", "total_dafw_days", "total_djtr_days", "total_injuries", "total_skin_disorders", "total_respiratory_conditions", "total_poisonings", "total_hearing_loss", "total_other_illnesses", "change_reason"];

/** What OSHA's upload would reject, in plain words (empty = ready). Same checks as the ITA specification. */
export function itaSummaryProblems(s: InjurySummary | null, cases: InjuryCase[]): string[] {
  if (!s) return ["Save the summary details first."];
  const p: string[] = [];
  if (!s.establishment.trim()) p.push("Establishment name (it must match your OSHA account exactly).");
  if (!/^\d{9}$/.test(s.ein)) p.push("EIN: 9 digits, no dash.");
  if (!s.street.trim() || /\bp\.?\s*o\.?\s*box\b/i.test(s.street)) p.push("Street address (not a PO box).");
  if (!s.city.trim()) p.push("City.");
  if (!/^[A-Z]{2}$/.test(s.state)) p.push("State: 2 letters.");
  if (!/^\d{5}(\d{4})?$/.test(s.zip)) p.push("ZIP: 5 or 9 digits.");
  if (!/^\d{6}$/.test(s.naics)) p.push("NAICS code: 6 digits.");
  if (!s.peak_employees) p.push("Everyone employed at any time this year (for the size).");
  if (!s.avg_employees || s.avg_employees <= 0) p.push("Annual average number of employees (more than 0).");
  if (!s.hours_worked || s.hours_worked <= 0) p.push("Total hours worked (more than 0).");
  if (s.avg_employees && s.hours_worked && s.hours_worked / s.avg_employees >= 8760) p.push("Hours per employee is over a full year; check hours worked and the average.");
  const t = logTotals(cases);
  if (s.avg_employees && s.avg_employees <= t.G + t.H + t.I + t.J) p.push("The average number of employees should be more than the number of cases.");
  return p;
}

/** The establishment and 300A file for OSHA's upload: header row plus one row for this establishment and year. */
export function itaSummaryCsv(s: InjurySummary, cases: InjuryCase[], year: number): string {
  const t = logTotals(cases);
  const total = t.G + t.H + t.I + t.J;
  return [
    row(ITA_SUMMARY_HEADERS),
    row([s.establishment.trim(), s.ein, s.legal_name.trim(), s.street.trim(), s.city.trim(), s.state, s.zip, s.naics, s.industry.trim(),
      sizeCode(s.peak_employees ?? 0), s.establishment_type, year, Math.round(s.avg_employees ?? 0), Math.round(s.hours_worked ?? 0),
      total > 0 ? 1 : 2, t.G, t.H, t.I, t.J, t.K, t.L, t.M[1], t.M[2], t.M[3], t.M[4], t.M[5], t.M[6], ""]),
  ].join("\r\n") + "\r\n";
}

export const ITA_CASE_HEADERS = ["establishment_name", "year_of_filing", "case_number", "job_title", "date_of_incident", "incident_location", "incident_description", "incident_outcome", "dafw_num_away", "djtr_num_tr", "type_of_incident", "date_of_birth", "date_of_hire", "sex", "treatment_facility_type", "treatment_in_patient", "time_started_work", "time_of_incident", "time_unknown", "nar_before_incident", "nar_what_happened", "nar_injury_illness", "nar_object_substance", "date_of_death"];

/** Cases whose 301 isn't complete enough for OSHA's upload, by case number. */
export function itaCaseProblems(cases: InjuryCase[]): string[] {
  const out: string[] = [];
  for (const c of cases) {
    const miss: string[] = [];
    if (!c.birth_date) miss.push("date of birth");
    if (!c.hire_date) miss.push("date hired");
    if (c.er_visit === null) miss.push("emergency room");
    if (c.inpatient === null) miss.push("hospitalized");
    if (!c.activity_before.trim() || !c.what_happened.trim() || !c.injury_detail.trim() || !c.object_substance.trim()) miss.push("boxes 14 to 17");
    if (c.outcome === "death" && !c.death_date) miss.push("date of death");
    if (nameInNarrative(c)) miss.push("a name in boxes 14 to 17 (take it out)");
    if (miss.length) out.push(`${caseLabel(c)}: ${miss.join(", ")}`);
  }
  return out;
}

/**
 * The 300/301 case file for OSHA's upload. Leaves out what the rule leaves out: the employee's name and address, the
 * doctor's name and the treatment facility (1904.41(b)). Privacy cases go in like any other: no name is sent.
 */
export function itaCaseCsv(establishment: string, cases: InjuryCase[], year: number): string {
  const lines = [row(ITA_CASE_HEADERS)];
  for (const c of [...cases].sort((a, b) => a.case_no - b.case_no)) {
    lines.push(row([
      establishment.trim(), year, caseLabel(c), c.job_title, mmddyyyy(c.injury_date), c.location, c.description.slice(0, 255),
      OUTCOMES.findIndex((o) => o.id === c.outcome) + 1, c.days_away, c.days_restricted, KINDS.find((k) => k.id === c.kind)!.n,
      mmddyyyy(c.birth_date), mmddyyyy(c.hire_date), c.sex, c.er_visit ? 1 : 0, c.inpatient ? 1 : 0,
      hhmm(c.time_started), c.time_unknown ? "" : hhmm(c.time_of_event), c.time_unknown ? 1 : "",
      c.activity_before, c.what_happened, c.injury_detail, c.object_substance, mmddyyyy(c.death_date),
    ]));
  }
  return lines.join("\r\n") + "\r\n";
}

/** The filing deadline for a year's records. */
export const filingDue = (year: number) => `${year + 1}-03-02`;
