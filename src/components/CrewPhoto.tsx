"use client";

// Optional photo of the crew at the talk. Taken on the review screen, kept on the phone with the draft (works with
// no signal), uploaded with the record as a private file.
import { useRef, useState } from "react";
import type { TalkDraft } from "@/lib/draft";
import { shrinkPhoto } from "@/lib/photo";
import { Button } from "./ui";

export function CrewPhoto({ draft, update }: { draft: TalkDraft; update: (p: Partial<TalkDraft>) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setError(null);
    try { update({ photo: { image: await shrinkPhoto(file), takenAt: new Date().toISOString() } }); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't use that photo. Try again."); }
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-base font-semibold">Crew photo</h2>
        <span className="text-sm text-muted">Optional</span>
      </div>
      <input ref={input} type="file" accept="image/*" capture="environment" className="sr-only" aria-label="Take a crew photo" onChange={(e) => take(e.target.files?.[0])} />
      {draft.photo ? (
        <div className="mt-2 overflow-hidden rounded-xl bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.photo.image} alt="Crew photo for this talk" className="max-h-72 w-full object-cover" />
          <div className="flex items-center gap-2 p-3">
            <span className="flex-1 text-sm text-muted">Taken {new Date(draft.photo.takenAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => input.current?.click()}>Retake</Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => update({ photo: null })}>Remove</Button>
          </div>
        </div>
      ) : (
        <button
          className="mt-2 flex min-h-14 w-full items-center gap-3 rounded-xl bg-surface px-4 text-left ring-1 ring-line"
          disabled={busy}
          onClick={() => input.current?.click()}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-brand-text">
            <path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" />
          </svg>
          <span className="flex-1"><b className="block font-semibold">{busy ? "Processing…" : "Take a crew photo"}</b><small className="text-muted">Shows who was there. Kept private with the record.</small></span>
        </button>
      )}
      {error && <p className="mt-2 text-sm text-warn-text" role="alert">{error}</p>}
    </section>
  );
}
