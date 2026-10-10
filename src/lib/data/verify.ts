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
