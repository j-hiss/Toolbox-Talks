// "Tailor with AI": asks the tailor-talk server function for a draft (owners and admins; 20 a day per company).
// The draft comes back already checked (src/core/aiTailor.ts) and is never saved here: the admin edits and saves it.
import { supabase } from "@/lib/supabase";
import type { TailorAsk, TalkTextLike } from "@/core/aiTailor";

/** Only the company, the library talk id and the notes go up: the function looks up the talk and the company itself. */
export async function tailorTalk(r: TailorAsk): Promise<TalkTextLike> {
  const { data, error } = await supabase().functions.invoke("tailor-talk", { body: r });
  if (error) {
    // The function answers with { error: "plain words" }; show that rather than a status code.
    const ctx = (error as { context?: Response }).context;
    const body = ctx && typeof ctx.json === "function" ? await ctx.json().catch(() => null) : null;
    throw new Error(body?.error ?? "AI drafting isn't available right now. Try again, or write the talk yourself.");
  }
  return (data as { talk: TalkTextLike }).talk;
}
