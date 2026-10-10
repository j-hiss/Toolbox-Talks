// Demo version of src/lib/data/shares.ts: links kept in this browser, owners and admins only, never deleted.
import type * as Real from "@/../src/lib/data/shares";
import type { OpenedShare, ShareDays, ShareRow, ShareSnapshot } from "@/core/share";
import { db, save, tick, uid } from "./store";

type DemoShare = Omit<ShareRow, "views" | "last_viewed_at"> & { company_id: string; secret: string; snapshot: ShareSnapshot; opens: string[] };
const shares = () => ((db() as { shares?: DemoShare[] }).shares ??= []);
function mustBeAdmin(companyId: string) {
  const me = db().session?.user.id;
  const a = db().members.find((m) => m.company_id === companyId && m.user_id === me)?.access;
  if (a !== "owner" && a !== "admin") throw new Error("Only owners and admins can share the safety profile.");
}
const hex = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");

export async function createShare(companyId: string, label: string, days: ShareDays, snapshot: ShareSnapshot): Promise<string> {
  await tick(); mustBeAdmin(companyId);
  if (!label.trim()) throw new Error("Say who the link is for.");
  const secret = hex(), now = new Date();
  shares().push({ id: uid(), company_id: companyId, secret, snapshot, label: label.trim(), period_from: snapshot.profile.from, period_to: snapshot.profile.to,
    created_at: now.toISOString(), expires_at: new Date(now.getTime() + days * 86_400_000).toISOString(), revoked_at: null, opens: [] });
  save();
  return secret;
}

export async function listShares(companyId: string): Promise<ShareRow[]> {
  await tick(); mustBeAdmin(companyId);
  return shares().filter((s) => s.company_id === companyId).sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(({ id, label, period_from, period_to, created_at, expires_at, revoked_at, opens }) =>
      ({ id, label, period_from, period_to, created_at, expires_at, revoked_at, views: opens.length, last_viewed_at: opens.at(-1) ?? null }));
}

export async function revokeShare(companyId: string, shareId: string): Promise<void> {
  await tick(); mustBeAdmin(companyId);
  const s = shares().find((x) => x.id === shareId && x.company_id === companyId);
  if (!s) throw new Error("Link not found.");
  s.revoked_at ??= new Date().toISOString();
  save();
}

export async function openShare(secret: string): Promise<OpenedShare | null> {
  await tick();
  const s = shares().find((x) => x.secret === secret && !x.revoked_at && new Date(x.expires_at) > new Date());
  if (!s) return null;
  // Like the database: the company's own admins checking the link aren't counted as opens.
  const me = db().session?.user.id;
  const admin = db().members.some((m) => m.company_id === s.company_id && m.user_id === me && (m.access === "owner" || m.access === "admin"));
  if (!admin) { s.opens.push(new Date().toISOString()); save(); }
  const { label, period_from, period_to, created_at, expires_at, snapshot } = s;
  return { label, period_from, period_to, created_at, expires_at, snapshot };
}

const _sameShape = { createShare, listShares, revokeShare, openShare } satisfies Omit<typeof Real, never>;
void _sameShape;
