// Demo version of src/lib/data/digest.ts: the weekly email on/off kept in this browser (owners, admins and office);
// the preview never sends email, so the send log stays empty.
import type * as Real from "@/../src/lib/data/digest";
import { db, save, tick } from "./store";

const offs = () => ((db() as unknown as { digestOff?: { company_id: string; user_id: string }[] }).digestOff ??= []);
const me = () => db().session?.user.id ?? "";
const allowed = (co: string) => ["owner", "admin", "office"].includes(db().members.find((m) => m.company_id === co && m.user_id === me())?.access ?? "");

export async function weeklyEmailOn(companyId: string): Promise<boolean> {
  await tick(); return !offs().some((o) => o.company_id === companyId && o.user_id === me());
}
export async function setWeeklyEmail(companyId: string, on: boolean): Promise<void> {
  await tick();
  if (!allowed(companyId)) throw new Error("The weekly email goes to owners, admins and office.");
  const rest = offs().filter((o) => !(o.company_id === companyId && o.user_id === me()));
  (db() as unknown as { digestOff: { company_id: string; user_id: string }[] }).digestOff = on ? rest : [...rest, { company_id: companyId, user_id: me() }];
  save();
}
export async function digestLog(): Promise<Real.DigestLogRow[]> { await tick(); return []; }

const _sameShape = { weeklyEmailOn, setWeeklyEmail, digestLog } satisfies Omit<typeof Real, never>;
void _sameShape;
