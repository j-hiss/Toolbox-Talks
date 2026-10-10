// Check a record from its PDF (migration 0030). Works signed out: verify_record is open to anyone with a code and
// returns counts only. Rules and the code format: src/core/verify.ts.
import { supabase } from "@/lib/supabase";
import type { VerifiedRecord } from "@/core/verify";

/** What was saved under this (already cleaned) code, or null when no record has it. */
export async function verifyRecord(code: string): Promise<VerifiedRecord | null> {
  const { data, error } = await supabase().rpc("verify_record", { code });
  if (error) throw new Error(error.message);
  return (data as VerifiedRecord | null) ?? null;
}

export type VerifiedInspection = { company: string; title: string; rule: string; inspected_at: string; saved_at: string; items: number; passed: number; failed: number; na: number };

/** What was saved for an inspection under this (cleaned) code, or null. */
export async function verifyInspection(code: string): Promise<VerifiedInspection | null> {
  const { data, error } = await supabase().rpc("verify_inspection", { code });
  if (error) throw new Error(error.message);
  return (data as VerifiedInspection | null) ?? null;
}
