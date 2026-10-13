// How a phone number prints (PDF headers). Pure. A US number typed as digits (10, or 11 starting with 1) prints as
// (239) 555-0100; anything else prints exactly as typed, so an extension or a foreign number is never mangled.
export function formatPhone(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!/^[\d\s().+-]+$/.test(s)) return s;
  const d = s.replace(/\D/g, "");
  const ten = d.length === 11 && d.startsWith("1") ? d.slice(1) : d;
  return ten.length === 10 ? `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}` : s;
}

/** A license line as it prints: a bare number gets a "License #" label; anything with words prints as typed. */
export const licenseLabel = (l: string) => (/[a-z]/i.test(l) ? l : `License #${l.replace(/^#\s*/, "")}`);
