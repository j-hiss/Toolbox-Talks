"use client";

// Admin → Brand: change any of the company's colors and see the whole app change as you go. Nothing is saved
// until "Save colors"; leaving the tab puts the saved colors back. The checks (src/core/theme.ts) say in plain
// words when a choice makes something hard to read or easy to confuse; they warn, they don't block.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_THEME, THEME_PRESETS, THEME_ROLES, normalizeHex, normalizeTheme, themeChanges, themeWarnings,
  type Theme, type ThemeRole,
} from "@/core/theme";
import { applyTheme } from "@/lib/theme";
import { Button, Mark } from "./ui";

type Props = { saved: Partial<Theme> | null | undefined; onSave: (changes: Partial<Theme>) => Promise<void> };

export function BrandEditor({ saved, onSave }: Props) {
  const savedTheme = useMemo(() => normalizeTheme(saved), [saved]);
  const [t, setT] = useState<Theme>(savedTheme);
  const [prevSaved, setPrevSaved] = useState(savedTheme);
  if (prevSaved !== savedTheme) { setPrevSaved(savedTheme); setT(savedTheme); }
  const [busy, setBusy] = useState(false);
  const savedRef = useRef(saved);
  useEffect(() => { savedRef.current = saved; }, [saved]);

  // Live: the whole app shows the colors being tried. Leaving puts the saved ones back.
  useEffect(() => { applyTheme(t, false); }, [t]);
  useEffect(() => () => applyTheme(savedRef.current ?? null, false), []);

  const warnings = themeWarnings(t);
  const flagged = new Set(warnings.flatMap((w) => w.roles));
  const dirty = THEME_ROLES.some(({ id }) => t[id] !== savedTheme[id]);
  const isDefault = THEME_ROLES.every(({ id }) => t[id] === DEFAULT_THEME[id]);
  const set = (id: ThemeRole, v: string) => setT((x) => ({ ...x, [id]: v }));

  const save = async () => {
    setBusy(true);
    try { await onSave(themeChanges(t)); } finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        Change any color and the app changes as you go. The default, Signal, uses the safety colors on signs and tags
        (blue for notice, orange to act, green for done, yellow for caution, red for missed), so it reads as safety in any trade.
        Everyone in your company sees what you save, on the app and the PDF header.
      </p>

      <div>
        <p className="text-sm font-semibold">Start from</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {THEME_PRESETS.map((p) => {
            const on = THEME_ROLES.every(({ id }) => t[id] === p.theme[id]);
            return (
              <button
                key={p.id}
                onClick={() => setT(p.theme)}
                aria-pressed={on}
                className={`flex min-h-11 items-center gap-2 rounded-full bg-surface py-1.5 pr-3.5 pl-2 text-sm font-semibold ${on ? "ring-2 ring-brand" : "ring-1 ring-line"}`}
              >
                <span aria-hidden className="flex">
                  {(["brand", "action", "done"] as const).map((r, i) => (
                    <span key={r} className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--fg)_22%,transparent)] ring-2 ring-surface" style={{ background: p.theme[r], marginLeft: i ? -6 : 0 }} />
                  ))}
                </span>
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      <Sample />

      <ul className="flex flex-col gap-2">
        {THEME_ROLES.map((r) => (
          <ColorRow key={r.id} id={r.id} label={r.label} hint={r.hint} value={t[r.id]} warn={flagged.has(r.id)} onChange={(v) => set(r.id, v)} />
        ))}
      </ul>

      {warnings.length > 0 ? (
        <div role="status" className="rounded-xl bg-caution-bg px-4 py-3 text-sm text-caution-text">
          <p className="font-semibold">Worth a second look</p>
          <ul className="mt-1 list-disc pl-5">
            {warnings.map((w) => <li key={w.text}>{w.text}</li>)}
          </ul>
          <p className="mt-1.5 opacity-80">You can still save. These are about teams reading the screen outdoors.</p>
        </div>
      ) : (
        <p role="status" className="rounded-xl bg-ok-bg px-4 py-3 text-sm text-ok-text">Every color passes the readability checks.</p>
      )}

      <div className="flex flex-col gap-2">
        <Button onClick={save} disabled={!dirty || busy}>{busy ? "Saving…" : dirty ? "Save colors" : "Saved"}</Button>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" className="flex-1" disabled={!dirty || busy} onClick={() => setT(savedTheme)}>Undo changes</Button>
          <Button size="sm" variant="ghost" className="flex-1" disabled={isDefault || busy} onClick={() => setT(DEFAULT_THEME)}>Back to default</Button>
        </div>
      </div>
    </div>
  );
}

/** One color: a swatch that opens the phone's color picker, plus the hex code for typing an exact brand color. */
function ColorRow({ id, label, hint, value, warn, onChange }: { id: ThemeRole; label: string; hint: string; value: string; warn: boolean; onChange: (v: string) => void }) {
  const [text, setText] = useState(value);
  const [prev, setPrev] = useState(value);
  if (prev !== value) { setPrev(value); setText(value); }
  const commit = () => {
    const v = normalizeHex(text);
    if (v) onChange(v); else setText(value);
  };
  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface shadow-card p-2.5 pr-3">
      <label className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-[12px] ring-1 ring-line" style={{ background: value }}>
        <span className="sr-only">{label} color</span>
        <input type="color" value={value.toLowerCase()} onChange={(e) => onChange(normalizeHex(e.target.value) ?? value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      </label>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}{warn && <span className="ml-1.5 rounded bg-caution-bg px-1.5 py-0.5 text-xs text-caution-text">check</span>}</span>
        <small className="block truncate text-muted">{hint}</small>
      </span>
      <input
        aria-label={`${label} hex code`}
        id={`brand-${id}`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        spellCheck={false}
        autoCapitalize="characters"
        className="w-[5.5rem] rounded-md border border-line bg-surface px-2 py-2 font-mono text-sm uppercase tabular-nums focus:border-brand focus:outline-none"
      />
    </li>
  );
}

/** A small slice of the app in the colors being tried: the week card, a button, and the status labels. */
function Sample() {
  return (
    <div aria-label="Sample" className="overflow-hidden rounded-2xl bg-bg p-3 ring-1 ring-line">
      <div className="overflow-hidden rounded-xl bg-surface shadow-card">
        <div className="flex items-center gap-2.5 bg-brand px-4 py-3 text-brand-ink">
          <Mark size={24} />
          <span className="text-sm opacity-80">Week 9 · Ladder setup and use</span>
        </div>
        <div className="flex flex-col gap-2.5 p-3">
          <span className="flex min-h-11 items-center justify-center rounded-lg bg-action text-[15px] font-semibold text-action-ink">Start this talk</span>
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <span className="rounded-full bg-ok-bg px-2.5 py-1 text-ok-text">✓ Signed</span>
            <span className="rounded-full bg-caution-bg px-2.5 py-1 text-caution-text">Makeup due</span>
            <span className="rounded bg-warn px-2 py-1 text-warn-ink">Missed</span>
            <span className="rounded-full px-2.5 py-1 text-brand-text ring-1 ring-line">Link</span>
          </div>
          <p className="text-sm text-muted">Lighter text, like dates and hints.</p>
        </div>
      </div>
    </div>
  );
}
