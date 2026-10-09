// Training cards per person: which are current, expiring soon, expired, or missing for what their job title needs.
// Pure module. Expiry dates come from the card as typed by an admin; the app never works one out from a rule.
// Honest status: a required card with nothing on file is "missing", never hidden.
import { addDays, isoDay, parseDay } from "./weeks";

export type PersonCert = {
  id: string; person_id: string; cert_type: string; custom_name: string;
  issued_on: string | null; expires_on: string | null; withdrawn_at: string | null; entered_at: string;
};
export type CertRequirement = { role_id: string; cert_type: string };
export type CertState = "current" | "expiring" | "expired" | "missing";

/** Days before expiry when a card shows as "expiring". */
export const EXPIRING_DAYS = 30;

export function certState(c: Pick<PersonCert, "expires_on">, today: Date, soonDays = EXPIRING_DAYS): Exclude<CertState, "missing"> {
  if (!c.expires_on) return "current";
  const t = isoDay(today);
  if (c.expires_on < t) return "expired";
  return c.expires_on <= isoDay(addDays(parseDay(t), soonDays)) ? "expiring" : "current";
}

const key = (c: Pick<PersonCert, "cert_type" | "custom_name">) => (c.cert_type === "custom" ? `custom:${c.custom_name.trim().toLowerCase()}` : c.cert_type);

/** The card that counts for each type: not withdrawn, latest expiry (no expiry beats any date), then latest entered. */
export function latestCerts<C extends PersonCert>(certs: C[]): C[] {
  const best = new Map<string, C>();
  const rank = (c: PersonCert) => `${c.expires_on ?? "9999-12-31"}|${c.entered_at}`;
  for (const c of certs) {
    if (c.withdrawn_at) continue;
    const k = `${c.person_id}|${key(c)}`;
    const cur = best.get(k);
    if (!cur || rank(c) > rank(cur)) best.set(k, c);
  }
  return [...best.values()];
}

export type TrainingRow = { cert_type: string; name?: string; state: CertState; required: boolean; cert: PersonCert | null };

/** One person's training: every required type (missing when nothing is on file), then any other cards they hold. */
export function personTraining(personId: string, roleId: string | null, certs: PersonCert[], reqs: CertRequirement[], today: Date): TrainingRow[] {
  const mine = latestCerts(certs.filter((c) => c.person_id === personId));
  const needed = [...new Set(reqs.filter((r) => r.role_id === roleId).map((r) => r.cert_type))];
  const rows: TrainingRow[] = needed.map((t) => {
    const cert = mine.find((c) => c.cert_type === t) ?? null;
    return { cert_type: t, state: cert ? certState(cert, today) : "missing", required: true, cert };
  });
  for (const c of mine) {
    if (needed.includes(c.cert_type)) continue;
    rows.push({ cert_type: c.cert_type, name: c.custom_name || undefined, state: certState(c, today), required: false, cert: c });
  }
  const order: Record<CertState, number> = { expired: 0, missing: 1, expiring: 2, current: 3 };
  return rows.sort((a, b) => order[a.state] - order[b.state] || Number(b.required) - Number(a.required));
}

export type TrainingSummary = { current: number; expiring: number; expired: number; missing: number; people: number; needAttention: string[] };

/** Company counts over active people: cards current / expiring / expired, required cards missing, who needs attention. */
export function trainingSummary(people: { id: string; role_id: string | null }[], certs: PersonCert[], reqs: CertRequirement[], today: Date): TrainingSummary {
  const s: TrainingSummary = { current: 0, expiring: 0, expired: 0, missing: 0, people: people.length, needAttention: [] };
  for (const p of people) {
    const rows = personTraining(p.id, p.role_id, certs, reqs, today);
    for (const r of rows) s[r.state]++;
    if (rows.some((r) => r.state !== "current" && (r.required || r.state !== "missing"))) s.needAttention.push(p.id);
  }
  return s;
}
