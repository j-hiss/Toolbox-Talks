// Demo version of src/lib/data/courses.ts: your own trainings kept in this browser with the database's rules (owners
// and admins make a company's; a trainer makes their own; an organization's admins make its; a card or class carries
// the training's name at that moment; a retired training can't be given again).
import type * as Real from "@/../src/lib/data/courses";
import type { CourseDraft, CourseOwnerKind, TrainingCourse } from "@/core/courses";
import { courseProblem } from "@/core/courses";
import { db, save, tick } from "./store";

type OrgMember = { org_id: string; user_id: string | null; role: string; removed_at?: string | null };
type Trainer = { id: string; company_id: string; user_id: string | null; org_id?: string | null; removed_at: string | null };
type Extra = { trainingCourses?: TrainingCourse[]; partnerOrgMembers?: OrgMember[]; trainers?: Trainer[] };
const x = () => db() as unknown as Extra;
const courses = () => (x().trainingCourses ??= []);
const me = () => db().session?.user.id ?? "";
const access = (co: string) => db().members.find((m) => m.company_id === co && m.user_id === me())?.access;
const isAdmin = (co: string) => ["owner", "admin"].includes(access(co) ?? "");
const inOrg = (org: string | null) => !!org && (x().partnerOrgMembers ?? []).some((m) => m.org_id === org && m.user_id === me() && !m.removed_at);
const orgAdmin = (org: string | null) => !!org && (x().partnerOrgMembers ?? []).some((m) => m.org_id === org && m.user_id === me() && !m.removed_at && m.role === "admin");
const liveTrainers = (co: string) => (x().trainers ?? []).filter((t) => t.company_id === co && !t.removed_at);
const ownerTrains = (c: TrainingCourse, co: string) => liveTrainers(co).some((t) => (!!c.owner_user && t.user_id === c.owner_user) || (!!c.owner_org && t.org_id === c.owner_org));
const canChange = (c: TrainingCourse) => (!!c.owner_company && isAdmin(c.owner_company)) || c.owner_user === me() || orgAdmin(c.owner_org);
const CODE = "abcdefghijkmnpqrstuvwxyz23456789";

export async function trainingsForCompany(companyId: string): Promise<TrainingCourse[]> {
  await tick();
  const member = !!access(companyId);
  const trainer = liveTrainers(companyId).some((t) => t.user_id === me());
  return courses().filter((c) => (c.owner_company === companyId || ownerTrains(c, companyId))
    && (member || (trainer && (c.owner_company === companyId || c.owner_user === me() || inOrg(c.owner_org)))))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function myTrainerCourses(): Promise<TrainingCourse[]> {
  await tick();
  return courses().filter((c) => !c.owner_company && (c.owner_user === me() || inOrg(c.owner_org))).sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCourse(ownerKind: CourseOwnerKind, owner: string | null, code: string | null, d: CourseDraft): Promise<string> {
  await tick();
  const p = courseProblem(d); if (p) throw new Error(p);
  if (code) {
    const c = courses().find((y) => y.code === code);
    if (!c || !canChange(c)) throw new Error("Training not found.");
    Object.assign(c, { name: d.name.trim(), description: d.description.trim(), renew_months: d.renewMonths });
    save(); return code;
  }
  if (ownerKind === "company" && !isAdmin(owner ?? "")) throw new Error("Only owners and admins can make trainings.");
  if (ownerKind === "org" && !orgAdmin(owner)) throw new Error("Only the organization's admins can make its trainings.");
  const fresh = `c_${Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => CODE[b % 32]).join("")}`;
  courses().push({ code: fresh, owner_company: ownerKind === "company" ? owner : null, owner_user: ownerKind === "me" ? me() : null, owner_org: ownerKind === "org" ? owner : null,
    name: d.name.trim(), description: d.description.trim(), renew_months: d.renewMonths, retired: false });
  save(); return fresh;
}

export async function retireCourse(code: string, retire: boolean): Promise<void> {
  await tick();
  const c = courses().find((y) => y.code === code);
  if (!c || !canChange(c)) throw new Error("Training not found.");
  c.retired = retire; save();
}

/**
 * The name to stamp on a card, sent-in card or class made with a training (same rule as private.stamp_course).
 * `trainerId` is set when a trainer gives it. Returns `custom` unchanged for a built-in type.
 */
export function stampCourse(companyId: string, certType: string, custom: string, trainerId: string | null): string {
  if (!certType.startsWith("c_")) return custom;
  const c = courses().find((y) => y.code === certType);
  if (!c) throw new Error("That training doesn't exist.");
  if (c.retired) throw new Error("That training was retired.");
  const t = trainerId ? liveTrainers(companyId).find((y) => y.id === trainerId) : null;
  const ok = c.owner_company === companyId || (!!t && ((!!c.owner_user && t.user_id === c.owner_user) || (!!c.owner_org && t.org_id === c.owner_org)));
  if (!ok) throw new Error("That training can't be given here.");
  return c.name;
}

const _sameShape = { trainingsForCompany, myTrainerCourses, saveCourse, retireCourse } satisfies Omit<typeof Real, never>;
void _sameShape;
