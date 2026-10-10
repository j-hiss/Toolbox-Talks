// "Share with your agent": what a shared safety-profile link carries, and how its status reads. Pure module.
//
// A link shows a frozen copy made when the company created it, built here from the safety profile
// (src/core/profile.ts) and a short list of company header fields. Counts and rates only: every profile field is
// copied by name, so a new field can't slip into shared copies without someone adding it here on purpose.
// Database side: supabase/migrations/20261010000025_profile_shares.sql.
import type { SafetyProfile } from "./profile";
import type { Theme } from "./theme";

export const SHARE_DAYS = [7, 30, 90] as const;
export type ShareDays = (typeof SHARE_DAYS)[number];

/** The company header printed on the shared page and PDF. No people, no ids, no settings. */
export type ShareCompany = { name: string; licenses: string; address: string; phone: string; email: string; industry: string; theme: Partial<Theme> | null };

export type ShareSnapshot = { v: 1; kind: "renewal" | "monthly"; company: ShareCompany; profile: SafetyProfile; florida: boolean; crew: number };

/** A shared link as an admin sees it in the list. */
export type ShareRow = { id: string; label: string; period_from: string; period_to: string; created_at: string; expires_at: string; revoked_at: string | null; views: number; last_viewed_at: string | null };

/** What the share page gets back for a live link. */
export type OpenedShare = { label: string; period_from: string; period_to: string; created_at: string; expires_at: string; snapshot: ShareSnapshot };

export function shareSnapshot(p: SafetyProfile, co: Omit<ShareCompany, "theme"> & { theme?: Partial<Theme> | null }, opts: { kind: "renewal" | "monthly"; florida: boolean; crew: number }): ShareSnapshot {
  const profile = {
    from: p.from, to: p.to,
    talks: p.talks, makeups: p.makeups, topics: p.topics,
    languages: p.languages.map(({ language, talks }) => ({ language, talks })),
    periodsEnded: p.periodsEnded, periodsWithTalk: p.periodsWithTalk, periodsMissed: p.periodsMissed,
    missedKeys: [...p.missedKeys],
    total: { ...p.total }, signIn: p.signIn, onTime: p.onTime,
    months: p.months.map((m) => ({ ...m })),
    dailyDays: p.dailyDays,
    log: { ...p.log, citations: p.log.citations.map(({ status }) => ({ status })) },
    issues: { ...p.issues },
    elements: p.elements.map((e) => ({ ...e })),
    emr: p.emr.map(({ rating_year, emr, note, entered_at }) => ({ rating_year, emr, note, entered_at })),
    documents: p.documents.map(({ kind, title, uploaded_at }) => ({ kind, title, uploaded_at })),
  } satisfies Record<keyof SafetyProfile, unknown>;
  const company: ShareCompany = {
    name: co.name, licenses: co.licenses ?? "", address: co.address ?? "", phone: co.phone ?? "", email: co.email ?? "",
    industry: co.industry, theme: co.theme ?? null,
  };
  return { v: 1, kind: opts.kind, company, profile, florida: opts.florida, crew: opts.crew };
}

export type ShareStatus = "live" | "expired" | "off";

export function shareStatus(row: Pick<ShareRow, "expires_at" | "revoked_at">, now: Date): ShareStatus {
  if (row.revoked_at) return "off";
  return new Date(row.expires_at).getTime() > now.getTime() ? "live" : "expired";
}

const SECRET = /^[0-9a-f]{64}$/;

/**
 * The link to send. The secret rides after "#", so it never reaches a web server or its logs; only the share page
 * reads it, in the browser.
 */
export function shareLink(origin: string, secret: string): string {
  if (!SECRET.test(secret)) throw new Error("Not a share secret");
  return `${origin.replace(/\/+$/, "")}/share/#${secret}`;
}

/** The secret in an opened link's "#…", or null. */
export function secretFromHash(hash: string): string | null {
  const v = hash.replace(/^#/, "").trim().toLowerCase();
  return SECRET.test(v) ? v : null;
}

/** A month or less shares as the monthly summary; anything longer as the program summary (renewal packet). */
export function shareKind(p: Pick<SafetyProfile, "from" | "to">): "renewal" | "monthly" {
  const days = (Date.parse(`${p.to}T00:00:00Z`) - Date.parse(`${p.from}T00:00:00Z`)) / 86_400_000;
  return days <= 31 ? "monthly" : "renewal";
}
