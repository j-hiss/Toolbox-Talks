"use client";

// Hands a finished file to the person: the share sheet on phones (Save to Files, email, text), a download on a
// computer. The one file-saving path; the preview swaps it for its own (preview/demo/download.ts).

export type SaveResult = "shared" | "downloaded" | "canceled";

const isPhone = () => typeof navigator !== "undefined" && /iPhone|iPad|Android/i.test(navigator.userAgent);

export async function saveFile(name: string, blob: Blob): Promise<SaveResult> {
  const file = typeof File !== "undefined" ? new File([blob], name, { type: blob.type }) : null;
  if (file && isPhone() && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return "shared";
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return "canceled";
      // Share sheet not allowed here: fall through to a plain download.
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return "downloaded";
}
