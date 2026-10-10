// Check a record from its PDF (migration 0030). Pure module.
//
// Every saved record has a 16-character code, printed on its PDF with a QR code. Scanning it opens /verify/#CODE,
// which asks the database what was saved under that code: company, talk, date, and the counts. No names. The code
// rides after "#", so it never reaches a web server or its logs.

/** Same alphabet as private.new_verify_code(): no 0/O or 1/I/L, so a code read off paper types back correctly. */
const CODE = /^[2-9A-HJKMNP-Z]{16}$/;

/** A code as typed or scanned (any case, dashes or spaces), cleaned, or null if it can't be one. */
export function cleanCode(input: string): string | null {
  const c = input.replace(/[^0-9a-z]/gi, "").toUpperCase();
  return CODE.test(c) ? c : null;
}

/** Printed in groups of four: 7KQ2-M9TX-4HPA-ZC3N. */
export function formatCode(code: string): string {
  return code.replace(/(.{4})(?=.)/g, "$1-");
}

/** The link in the QR code. */
export function verifyLink(origin: string, code: string): string {
  const c = cleanCode(code);
  if (!c) throw new Error("Not a verification code");
  return `${origin.replace(/\/+$/, "")}/verify/#${c}`;
}

/** What /verify shows for a code. Counts only. */
export type VerifiedRecord = {
  company: string; kind: "weekly" | "daily"; title: string; title_en: string; language: string;
  held_at: string; saved_at: string; week_start: string | null; week_number: number | null; makeup_for_week: string | null;
  presenter_signed: boolean; roster: number; signed: number; not_signed: number; absent: number;
};

/** One honest line about the counts, the same words the PDF uses. */
export function verifySummary(v: Pick<VerifiedRecord, "roster" | "signed" | "not_signed" | "absent" | "presenter_signed">): string {
  const parts = [`${v.signed} signed`, `${v.not_signed} didn't sign`, `${v.absent} absent`];
  return `${v.roster} on the roster: ${parts.join(", ")}. Presenter ${v.presenter_signed ? "signed" : "did not sign"}.`;
}
