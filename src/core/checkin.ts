// Crew self check-in (migration 0043): the presenter shows a QR code during a talk and each crew member signs on
// their own phone. Pure module: the link, who can check in, and taking the waiting signatures into the talk draft.
//
// - Only people on this talk's roster who are marked here can check in; walk-ins and anyone marked absent sign on the
//   presenter's phone as before.
// - A signature from a phone goes into the draft exactly like one signed on the presenter's phone, with the time the
//   person tapped the signing statement. It never replaces a signature already in the draft.
import type { Signature } from "./record";

/** The QR code's link. The secret is after "#", so it never reaches a server log. */
export function checkinLink(origin: string, secret: string): string {
  return `${origin.replace(/\/+$/, "")}/checkin/#${secret}`;
}

/** The secret from a scanned link's "#", or null. */
export function secretFromHash(hash: string): string | null {
  const s = hash.replace(/^#/, "").trim().toLowerCase();
  return /^[0-9a-f]{64}$/.test(s) ? s : null;
}

export type CheckinEntry = { key: string; name: string };

/** Who can check in: people on the roster, marked here, not yet signed. Walk-ins sign on the presenter's phone. */
export function checkinRoster(roster: { key: string; name: string; personId: string | null }[], present: Record<string, boolean>, signatures: Record<string, Signature>): CheckinEntry[] {
  return roster.filter((r) => r.personId && present[r.key] !== false && !signatures[r.key]).map((r) => ({ key: r.key, name: r.name }));
}

/** A new code is open for these names: they may sign by phone again, so they come off the taken list. */
export function reopenTaken(taken: string[], keys: string[]): string[] {
  const open = new Set(keys);
  return taken.filter((k) => !open.has(k));
}

export type WaitingSignature = { roster_key: string; name: string; image: string; signed_at: string; confirmed_at: string };

/**
 * Take waiting phone signatures into the draft, once each. Keeps any signature the draft already has, only for people
 * still on the roster and still marked here, and never brings back one the talk already took (`taken`): so marking
 * someone "Isn't here" after they signed by phone sticks. Returns the new maps, the names added and the new `taken`.
 */
export function mergeCheckins(
  rosterKeys: string[], signatures: Record<string, Signature>, present: Record<string, boolean>, waiting: WaitingSignature[], taken: string[] = [],
): { signatures: Record<string, Signature>; added: string[]; taken: string[] } {
  const keys = new Set(rosterKeys);
  const done = new Set(taken);
  const out = { signatures: { ...signatures }, added: [] as string[] };
  for (const w of waiting) {
    if (done.has(w.roster_key)) continue;
    done.add(w.roster_key);
    if (!keys.has(w.roster_key) || present[w.roster_key] === false || out.signatures[w.roster_key]) continue;
    out.signatures[w.roster_key] = { image: w.image, signedAt: w.signed_at, confirmedAt: w.confirmed_at };
    out.added.push(w.name);
  }
  return { ...out, taken: [...done] };
}
