// Spreadsheet export. Pure module. Writes CSV that opens cleanly in Excel and Google Sheets:
// - a byte-order mark first, so names like "Peña" or "Nguyễn" don't come out garbled in Excel;
// - quotes around anything with a comma, quote or line break;
// - a leading apostrophe on text that starts with = + - @ (or a tab/return), so a typed name can never run as a
//   spreadsheet formula when the file is opened (CSV injection).
const RISKY = /^[=+\-@\t\r]/;

export function csvCell(v: unknown): string {
  let s = v == null ? "" : String(v);
  if (RISKY.test(s) && !/^-?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: unknown[][]): string {
  return "\uFEFF" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
