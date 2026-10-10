// Demo version of src/lib/data/ai.ts. The preview has no server or AI key, so it returns a fixed example draft: the
// library talk with the company's notes worked into the opening line, run through the same checks as the real one.
import type * as Real from "@/../src/lib/data/ai";
import { checkTailored, type TailorRequest, type TalkTextLike } from "@/core/aiTailor";
import { tick } from "./store";

export async function tailorTalk(r: TailorRequest): Promise<TalkTextLike> {
  await tick(); await new Promise((res) => setTimeout(res, 400));
  const draft = { ...r.talk, title: `${r.talk.title} (example AI draft)`, hook: r.notes.trim() ? `${r.talk.hook} On our jobs: ${r.notes.trim().replace(/\d+/g, "").slice(0, 160)}` : r.talk.hook };
  const checked = checkTailored(JSON.stringify(draft), r.talk, r.sources);
  if ("problem" in checked) throw new Error(checked.problem);
  return checked.talk;
}

const _sameShape = { tailorTalk } satisfies Omit<typeof Real, never>;
void _sameShape;
