// Demo version of src/lib/data/ai.ts. The preview has no server or AI key, so it returns a fixed example draft: the
// library talk with the company's notes worked into the opening line, run through the same checks as the real one.
import type * as Real from "@/../src/lib/data/ai";
import { checkTailored, type TailorAsk, type TalkTextLike } from "@/core/aiTailor";
import { TALKS } from "@/content/talks";
import { tick } from "./store";

export async function tailorTalk(r: TailorAsk): Promise<TalkTextLike> {
  await tick(); await new Promise((res) => setTimeout(res, 400));
  const lib = TALKS.find((t) => t.id === r.baseId);
  if (!lib) throw new Error("Pick a library talk.");
  const talk = lib.content.en;
  const draft = { ...talk, title: `${talk.title} (example AI draft)`, hook: r.notes.trim() ? `${talk.hook} On our jobs: ${r.notes.trim().slice(0, 160)}` : talk.hook };
  const checked = checkTailored(JSON.stringify(draft), talk, lib.sources.map((s) => s.label), r.notes);
  if ("problem" in checked) throw new Error(checked.problem);
  return checked.talk;
}

const _sameShape = { tailorTalk } satisfies Omit<typeof Real, never>;
void _sameShape;
