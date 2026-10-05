// Spreadsheet import for people. Pure module: turns rows from a .csv or .xlsx into a checked plan the admin reviews
// before anything is saved. Re-uploading the same sheet updates people matched by Employee ID instead of adding
// duplicates. Unknown crews and roles are listed so the admin can confirm creating them.
import { LANGUAGES, type LanguageId } from "./languages";

export const IMPORT_COLUMNS = ["Name", "Role", "Team", "Employee ID", "Phone", "Preferred language"] as const;

const HEADER_ALIASES: Record<string, (typeof IMPORT_COLUMNS)[number]> = {
  name: "Name", "full name": "Name", employee: "Name", "employee name": "Name", worker: "Name",
  role: "Role", position: "Role", title: "Role", "job title": "Role",
  team: "Team", crew: "Team", "crew name": "Team", "team name": "Team",
  "employee id": "Employee ID", "employee #": "Employee ID", "employee number": "Employee ID", id: "Employee ID", "emp id": "Employee ID", "badge": "Employee ID",
  phone: "Phone", "phone number": "Phone", mobile: "Phone", cell: "Phone",
  "preferred language": "Preferred language", language: "Preferred language", lang: "Preferred language",
};

export type ExistingPerson = { id: string; full_name: string; employee_id: string | null; active: boolean };
export type Named = { id: string; name: string };

export type ImportRow = {
  line: number;                 // spreadsheet row number (header = 1)
  name: string;
  role: string;                 // "" = crew member
  team: string;                 // "" = no team
  employeeId: string;
  phone: string;
  language: LanguageId;
  action: "add" | "update" | "skip";
  matchId: string | null;       // existing person when updating
  problems: string[];           // a row with problems is skipped
  notes: string[];              // things worth knowing that don't block the row
};

export type ImportPlan = {
  rows: ImportRow[];
  newTeams: string[];
  newRoles: string[];
  counts: { add: number; update: number; skip: number };
  missingColumns: string[];
};

const clean = (v: unknown) => String(v ?? "").replace(/\s+/g, " ").trim();
const key = (v: string) => v.toLowerCase();

const ENGLISH_NAMES: Record<string, LanguageId> = {
  english: "en", spanish: "es", espanol: "es", "español": "es", portuguese: "pt", "português": "pt", portugues: "pt",
  "haitian creole": "ht", creole: "ht", "kreyòl": "ht", kreyol: "ht", vietnamese: "vi", "tiếng việt": "vi",
  chinese: "zh", mandarin: "zh", "中文": "zh",
};

function languageOf(v: string): { lang: LanguageId; known: boolean } {
  if (!v) return { lang: "en", known: true };
  const k = key(v);
  const hit = LANGUAGES.find((l) => l.id === k || key(l.label) === k)?.id ?? ENGLISH_NAMES[k];
  return hit ? { lang: hit, known: true } : { lang: "en", known: false };
}

/** `table` is the sheet as rows of cells, header row first. Blank rows are ignored. */
export function planImport(table: unknown[][], existing: ExistingPerson[], teams: Named[], roles: Named[]): ImportPlan {
  const [header = [], ...body] = table;
  const cols = header.map((h) => HEADER_ALIASES[key(clean(h))] ?? null);
  const at = (row: unknown[], c: (typeof IMPORT_COLUMNS)[number]) => { const i = cols.indexOf(c); return i < 0 ? "" : clean(row[i]); };
  const missingColumns = cols.includes("Name") ? [] : ["Name"];

  const byEmpId = new Map(existing.filter((p) => p.employee_id).map((p) => [key(p.employee_id!), p]));
  const byName = new Map(existing.filter((p) => p.active).map((p) => [key(p.full_name), p]));
  const teamNames = new Map(teams.map((t) => [key(t.name), t.name]));
  const roleNames = new Map([["crew member", ""], ...roles.map((r) => [key(r.name), r.name] as [string, string])]);
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const newTeams = new Map<string, string>();
  const newRoles = new Map<string, string>();

  const rows: ImportRow[] = [];
  body.forEach((cells, i) => {
    if (!cells || cells.every((c) => !clean(c))) return;
    const name = at(cells, "Name");
    const employeeId = at(cells, "Employee ID");
    const teamRaw = at(cells, "Team");
    const roleRaw = at(cells, "Role");
    const { lang, known } = languageOf(at(cells, "Preferred language"));
    const problems: string[] = [];
    const notes: string[] = [];
    if (!name) problems.push("No name");
    if (employeeId && seenIds.has(key(employeeId))) problems.push(`Employee ID ${employeeId} is on another row`);
    if (!employeeId && name && seenNames.has(key(name))) problems.push("Same name as another row (add an Employee ID to tell them apart)");
    if (!known) notes.push(`Language "${at(cells, "Preferred language")}" not recognized; using English`);

    const team = teamRaw ? teamNames.get(key(teamRaw)) ?? newTeams.get(key(teamRaw)) ?? teamRaw : "";
    if (teamRaw && !teamNames.has(key(teamRaw)) && !newTeams.has(key(teamRaw))) newTeams.set(key(teamRaw), teamRaw);
    const role = roleRaw ? roleNames.get(key(roleRaw)) ?? newRoles.get(key(roleRaw)) ?? roleRaw : "";
    if (roleRaw && !roleNames.has(key(roleRaw)) && !newRoles.has(key(roleRaw))) newRoles.set(key(roleRaw), roleRaw);

    const match = (employeeId && byEmpId.get(key(employeeId))) || (!employeeId && name ? byName.get(key(name)) : undefined) || null;
    if (match && !match.active) notes.push("Was removed; importing brings them back");
    if (match && !employeeId) notes.push("Matched by name");

    if (employeeId) seenIds.add(key(employeeId));
    if (name) seenNames.add(key(name));
    rows.push({
      line: i + 2, name, role, team, employeeId, phone: at(cells, "Phone"), language: lang,
      action: problems.length ? "skip" : match ? "update" : "add", matchId: match?.id ?? null, problems, notes,
    });
  });

  const counts = { add: 0, update: 0, skip: 0 };
  rows.forEach((r) => counts[r.action]++);
  return { rows, newTeams: [...newTeams.values()], newRoles: [...newRoles.values()], counts, missingColumns };
}

/** A minimal CSV reader (quotes, commas and line breaks inside quotes, CRLF). */
export function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const s = text.replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"' && s[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && s[i + 1] === "\n") i++;
      row.push(cell); out.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); out.push(row); }
  return out;
}

/** The blank template, with one labelled example row. */
export function templateCsv(): string {
  return `${IMPORT_COLUMNS.join(",")}\r\nExample Person (delete this row),Crew member,Crew 1,1001,555-0100,English\r\n`;
}
