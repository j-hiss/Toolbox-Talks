// Your own trainings data (migration 0053). Written only through database functions, which check who may make or
// change one. Rules: src/core/courses.ts.
import { supabase } from "@/lib/supabase";
import type { CourseDraft, CourseOwnerKind, TrainingCourse } from "@/core/courses";

function check<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

const COLUMNS = "code, owner_company, owner_user, owner_org, name, description, renew_months, retired";

/**
 * The trainings that count for one company: its own and its trainers' (retired too). A trainer of the company gets
 * only the ones they can give. Company-scoped by the database function.
 */
export async function trainingsForCompany(companyId: string): Promise<TrainingCourse[]> {
  return check(await supabase().rpc("trainings_for_company", { co: companyId }).select(COLUMNS)) as TrainingCourse[];
}

/**
 * Trainer-made trainings this account can read (not a company's). Includes other trainers' when this account also
 * runs a company they train, so screens narrow it with myOwnCourses (src/core/courses.ts).
 */
export async function myTrainerCourses(): Promise<TrainingCourse[]> {
  return check(await supabase().from("training_courses").select(COLUMNS).is("owner_company", null).order("name")) as TrainingCourse[];
}

/** Make a training (code null) or change one. owner: the company id for "company", the organization id for "org". */
export async function saveCourse(ownerKind: CourseOwnerKind, owner: string | null, code: string | null, d: CourseDraft): Promise<string> {
  return check(await supabase().rpc("save_training_course", {
    owner_kind: ownerKind, owner, code, name: d.name.trim(), description: d.description.trim(), renew_months: d.renewMonths,
  })) as string;
}

export async function retireCourse(code: string, retire: boolean): Promise<void> {
  check(await supabase().rpc("retire_training_course", { code, retire }));
}
