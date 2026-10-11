// Demo version of src/lib/data/checkin.ts: check-ins kept in this browser. In the preview, the crew page and the
// presenter's screen share the same demo store, so you can scan (or open the link) in another tab and sign.
import type * as Real from "@/../src/lib/data/checkin";
import { nearOrFar, type CheckinEntry, type WaitingSignature } from "@/core/checkin";
import { db, save, tick } from "./store";
import { accountFor } from "./account";

type Session = { id: string; company_id: string; client_id: string; secret: string; roster: CheckinEntry[]; statement: string; title: string; created_at: string; expires_at: string; closed_at: string | null; spot?: Real.TalkSpot };
type Waiting = WaitingSignature & { session_id: string };
const store = () => db() as unknown as { checkins?: Session[]; checkinSigs?: Waiting[] };
// Check-ins are shared by two "phones" (tabs) in the preview, so they're reread from this browser's storage each time.
function fresh() {
  try {
    const saved = JSON.parse(localStorage.getItem("tt-preview-db") ?? "{}") as { checkins?: Session[]; checkinSigs?: Waiting[] };
    if (saved.checkins) store().checkins = saved.checkins;
    if (saved.checkinSigs) store().checkinSigs = saved.checkinSigs;
  } catch { /* keep what's in memory */ }
}
const sessions = () => (store().checkins ??= []);
const sigs = () => (store().checkinSigs ??= []);
const canPresent = (co: string) => ["owner", "admin", "presenter"].includes(db().members.find((m) => m.company_id === co && m.user_id === db().session?.user.id)?.access ?? "");
// Same as the database: a paused company's code looks like any closed code.
const live = (secret: string) => sessions().find((s) => s.secret === secret && !s.closed_at && Date.parse(s.expires_at) > Date.now() && !accountFor(s.company_id).paused_at);

export async function openCheckin(companyId: string, clientId: string, roster: CheckinEntry[], statement: string, title: string, spot: Real.TalkSpot): Promise<string> {
  await tick(); fresh();
  if (!canPresent(companyId)) throw new Error("Only presenters can start a check-in.");
  for (const s of sessions()) if (s.company_id === companyId && s.client_id === clientId && !s.closed_at) s.closed_at = new Date().toISOString(); // its signatures still wait
  const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
  sessions().push({ id: crypto.randomUUID(), company_id: companyId, client_id: clientId, secret, roster, statement, title, created_at: new Date().toISOString(), expires_at: new Date(Date.now() + 3600_000).toISOString(), closed_at: null, spot });
  save();
  return secret;
}
export async function waitingSignatures(companyId: string, clientId: string): Promise<WaitingSignature[]> {
  await tick(); fresh();
  const ids = sessions().filter((s) => s.company_id === companyId && s.client_id === clientId).map((s) => s.id);
  return sigs().filter((g) => ids.includes(g.session_id)).map(({ session_id: _s, ...w }) => { void _s; return w; });
}
export async function closeCheckin(companyId: string, clientId: string): Promise<void> {
  await tick(); fresh();
  const ids = sessions().filter((s) => s.company_id === companyId && s.client_id === clientId).map((s) => s.id);
  store().checkins = sessions().filter((s) => !ids.includes(s.id));
  store().checkinSigs = sigs().filter((g) => !ids.includes(g.session_id));
  save();
}
export async function takeCheckinSignatures(companyId: string, clientId: string, keys: string[]): Promise<void> {
  await tick(); fresh();
  const ids = sessions().filter((s) => s.company_id === companyId && s.client_id === clientId).map((s) => s.id);
  store().checkinSigs = sigs().filter((g) => !(ids.includes(g.session_id) && keys.includes(g.roster_key)));
  save();
}
export async function checkinView(token: string): Promise<Real.CheckinView | null> {
  await tick(); fresh();
  const s = live(token);
  if (!s) return null;
  return { company: String(db().companies.find((c) => c.id === s.company_id)?.name ?? ""), title: s.title, statement: s.statement, expires_at: s.expires_at,
    roster: s.roster.map((r) => ({ ...r, signed: sigs().some((g) => g.session_id === s.id && g.roster_key === r.key) })) };
}
export async function checkinSign(token: string, key: string, image: string, confirmedAt: string, at: { latitude: number; longitude: number; accuracyMeters: number } | null, denied: boolean): Promise<boolean> {
  await tick(); fresh();
  const s = live(token);
  const r = s?.roster.find((x) => x.key === key);
  if (!s || !r || image.length > 200000 || !/^data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/]*={0,2}$/.test(image) || (image.length - 22) % 4 !== 0 || sigs().some((g) => g.session_id === s.id && g.roster_key === key)) return false;
  const loc = nearOrFar(s.spot ?? null, at, denied); // same rule as the database
  sigs().push({ session_id: s.id, roster_key: key, name: r.name, image, signed_at: new Date().toISOString(), confirmed_at: confirmedAt, distance_m: loc.distance, location: loc.flag });
  save();
  return true;
}

const _sameShape = { openCheckin, waitingSignatures, closeCheckin, takeCheckinSignatures, checkinView, checkinSign } satisfies Omit<typeof Real, never>;
void _sameShape;
