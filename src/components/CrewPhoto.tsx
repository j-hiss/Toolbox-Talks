"use client";

// Optional photos on the review screen: the crew at the talk, or a paper sign-in sheet (for when the phone couldn't
// go around). Kept on the phone with the draft (works with no signal), uploaded with the record as private files.
// A sheet photo is evidence only: it never marks anyone as signed.
import { useRef, useState } from "react";
import type { TalkDraft } from "@/lib/draft";
import { SHEET_MAX_SIDE, shrinkPhoto } from "@/lib/photo";
import { Button } from "./ui";

const KINDS = {
  photo: {
    heading: "Crew photo", take: "Take a crew photo", sub: "Shows who was there. Kept private with the record.",
    alt: "Crew photo for this talk", label: "Take a crew photo",
  },
  sheet: {
    heading: "Paper sign-in sheet", take: "Add a photo of a paper sheet",
    sub: "If the phone couldn't go around. Kept with the record. Anyone who didn't sign on the phone still shows as Not signed.",
    alt: "Paper sign-in sheet for this talk", label: "Take a photo of the paper sign-in sheet",
  },
} as const;

export function CrewPhoto({ draft, update, kind = "photo" }: { draft: TalkDraft; update: (p: Partial<TalkDraft>) => void; kind?: "photo" | "sheet" }) {
  const k = KINDS[kind];
  const current = draft[kind];
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const take = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true); setError(null);
    try { update({ [kind]: { image: await shrinkPhoto(file, kind === "sheet" ? SHEET_MAX_SIDE : undefined), takenAt: new Date().toISOString() } }); }
    catch (e) { setError(e instanceof Error ? e.message : "Couldn't use that photo. Try again."); }
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-base font-semibold">{k.heading}</h2>
        <span className="text-sm text-muted">Optional</span>
      </div>
      <input ref={input} type="file" accept="image/*" capture="environment" className="sr-only" aria-label={k.label} onChange={(e) => take(e.target.files?.[0])} />
      {current ? (
        <div className="mt-2 overflow-hidden rounded-xl bg-surface">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.image} alt={k.alt} className={`max-h-72 w-full ${kind === "sheet" ? "object-contain bg-white" : "object-cover"}`} />
          <div className="flex items-center gap-2 p-3">
            <span className="flex-1 text-sm text-muted">Taken {new Date(current.takenAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => input.current?.click()}>Retake</Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => update({ [kind]: null })}>Remove</Button>
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
          <span className="flex-1"><b className="block font-semibold">{busy ? "Processing…" : k.take}</b><small className="text-muted">{k.sub}</small></span>
        </button>
      )}
      {error && <p className="mt-2 text-sm text-warn-text" role="alert">{error}</p>}
    </section>
  );
}
