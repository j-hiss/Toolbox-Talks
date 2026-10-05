// Demo version of src/lib/download.ts: inside the preview page, files go through the viewer's own
// "save file" prompt (the artifact downloads capability) instead of a browser download.
import type * as Real from "@/../src/lib/download";

export type SaveResult = Real.SaveResult;

type Downloads = { save(req: { filename: string; data: Blob }): Promise<{ status: string }> };
type ClaudeWindow = { claude?: { use(name: string): Promise<unknown> } };

export async function saveFile(name: string, blob: Blob): Promise<SaveResult> {
  const dl = (await (window as unknown as ClaudeWindow).claude?.use("downloads").catch(() => null)) as Downloads | null;
  if (!dl) throw new Error("Saving files isn't available in this view. It works in the real app.");
  try {
    await dl.save({ filename: name, data: blob });
    return "downloaded";
  } catch (e) {
    const code = (e as { code?: string })?.code;
    if (code === "declined") return "canceled";
    if (code === "rate_limited") throw new Error("A save is already waiting for your answer.");
    throw new Error("Couldn't save the file. Try again.");
  }
}

const _sameShape = { saveFile } satisfies Omit<typeof Real, never>;
void _sameShape;
