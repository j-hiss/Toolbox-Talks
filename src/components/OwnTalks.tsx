"use client";

// Admin → Talks → Your own talks: write a talk for something the library doesn't cover (a client's site rules, a
// piece of equipment only you run, a near miss last week), or start from a library talk and make it yours.
// Rules live in src/core/ownTalks.ts; versions and who may write are enforced by the database (migration 0029).
// - Each save is a new version; records keep the exact words that were read.
// - Spanish is optional and stays a draft until someone who reads Spanish checks it and is named. Changing any
//   words sets it back to draft.
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TALKS as LIBRARY } from "@/content/talks";
import { copyFromLibrary, latestOwnTalks, newTalkKey, ownTalkProblem, tidyTalkText, type OwnTalkRow } from "@/core/ownTalks";
import type { TalkText } from "@/core/talks";
import { retireOwnTalk, saveOwnTalk } from "@/lib/data/ownTalks";
import { newDraft } from "@/lib/draft";
import { readChosenJobsite } from "@/components/JobsitePicker";
import { refreshOwnTalks, useOwnTalkRows } from "@/lib/library";
import { Button, ConfirmButton, Field, GroupHeading, Notice, Sheet, inputClass } from "@/components/ui";
import { toast } from "@/components/toast";
import { aiTailoring } from "@/lib/features";
import { tailorTalk } from "@/lib/data/ai";
import { MAX_NOTES } from "@/core/aiTailor";

const MINUTES = [3, 4, 5, 6, 8, 10, 15];
const blank = (): TalkText => ({ title: "", hook: "", sections: [{ heading: "", items: [""] }], ask: "" });

type Edit = {
  row: OwnTalkRow | null; // the version being edited, or null for a new talk
  key: string;
  basedOn: string | null;
  en: TalkText;
  es: TalkText | null;
  minutes: number;
  code: string;
  reviewed: boolean;
  reviewer: string;
  /** "ai" when this talk started as an AI draft; saved with each version so it's clear how it began. */
  source: "written" | "ai";
};

function editFrom(row: OwnTalkRow): Edit {
  return {
    row, key: row.talk_key, basedOn: row.based_on, en: row.content.en, es: row.es_status !== "none" ? row.content.es ?? null : null,
    minutes: row.minutes, code: row.code, reviewed: row.es_status === "reviewed", reviewer: row.es_reviewed_by, source: row.source ?? "written",
  };
}

export function OwnTalks({ companyId }: { companyId: string }) {
  const rows = useOwnTalkRows();
  const talks = useMemo(() => latestOwnTalks(rows), [rows]);
  const [edit, setEdit] = useState<Edit | null>(null);
  const [from, setFrom] = useState("");
  const router = useRouter();

  const startNew = () => setEdit({ row: null, key: newTalkKey(), basedOn: null, en: blank(), es: null, minutes: 5, code: "", reviewed: false, reviewer: "", source: "written" });
  const startFrom = (id: string) => {
    const lib = LIBRARY.find((t) => t.id === id);
    if (!lib) return;
    const c = copyFromLibrary(lib);
    // A copied Spanish version starts as a draft: once the English changes, someone has to check it again.
    setEdit({ row: null, key: newTalkKey(), basedOn: lib.id, en: c.en, es: c.es ?? null, minutes: lib.minutes, code: lib.code, reviewed: false, reviewer: "", source: "written" });
    setFrom("");
  };
  const give = (key: string) => {
    newDraft(companyId, key, readChosenJobsite(companyId) ?? "");
    router.push("/talk/");
  };
  const retire = async (row: OwnTalkRow) => {
    try {
      await retireOwnTalk(companyId, row);
      await refreshOwnTalks();
      toast(`Retired "${row.title}". Records that used it keep its words.`);
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), { tone: "error" });
    }
  };

  return (
    <section>
      <GroupHeading aside={talks.length ? `${talks.length}` : undefined}>Your own talks</GroupHeading>
      <p className="mt-2 text-sm text-muted">
        For what the library doesn&apos;t cover: a client&apos;s site rules, equipment only you run, last week&apos;s near miss.
        Give one any day, swap it into a week in Plan, or tick it below to add it to the rotation.
      </p>
      {talks.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {talks.map((t) => (
            <li key={t.talk_key} className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <b className="block">{t.title}</b>
                  <span className="block text-xs text-muted">
                    {t.code.trim() || "Company talk"} · {t.minutes} min · version {t.version}
                    {t.es_status === "reviewed" ? ` · Spanish checked by ${t.es_reviewed_by}` : t.es_status === "draft" ? " · Spanish draft, not yet checked" : ""}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" type="button" onClick={() => give(t.talk_key)}>Give it now</Button>
                <Button size="sm" variant="ghost" type="button" onClick={() => setEdit(editFrom(t))}>Edit</Button>
                <ConfirmButton label="Retire" confirmLabel="Tap again to retire" onConfirm={() => void retire(t)} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={startNew}>Write a talk</Button>
        <select aria-label="Start from a library talk" className={`${inputClass} sm:max-w-72`} value={from} onChange={(e) => startFrom(e.target.value)}>
          <option value="">Start from a library talk…</option>
          {LIBRARY.map((t) => <option key={t.id} value={t.id}>{t.content.en.title}</option>)}
        </select>
      </div>
      {aiTailoring() && <TailorWithAi companyId={companyId} onDraft={setEdit} />}
      {edit && <Editor companyId={companyId} edit={edit} setEdit={setEdit} onClose={() => setEdit(null)} />}
    </section>
  );
}

/** The talk's words. For Spanish, `hint` is the English, shown greyed in each empty box as the thing to translate. */
function TextEditor({ t, onChange, label, hint }: { t: TalkText; onChange: (t: TalkText) => void; label: string; hint?: TalkText }) {
  const set = (p: Partial<TalkText>) => onChange({ ...t, ...p });
  const setSection = (i: number, p: Partial<TalkText["sections"][number]>) =>
    set({ sections: t.sections.map((s, j) => (j === i ? { ...s, ...p } : s)) });
  const id = (k: string) => `${label}-${k}`;
  return (
    <div className="flex flex-col gap-3">
      <Field label="Title" id={id("title")}>
        <input id={id("title")} className={inputClass} maxLength={120} placeholder={hint?.title} value={t.title} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Opening line" hint="why this matters today" id={id("hook")}>
        <textarea id={id("hook")} rows={2} className={inputClass} placeholder={hint?.hook} value={t.hook} onChange={(e) => set({ hook: e.target.value })} />
      </Field>
      {t.sections.map((s, i) => (
        <fieldset key={i} className="rounded-xl border border-line p-3">
          <legend className="px-1 text-sm font-semibold">Section {i + 1}</legend>
          <div className="flex flex-col gap-2">
            <input aria-label={`Section ${i + 1} heading`} placeholder={hint?.sections[i]?.heading ?? "Heading"} className={inputClass} value={s.heading} onChange={(e) => setSection(i, { heading: e.target.value })} />
            <textarea aria-label={`Section ${i + 1} points, one per line`} placeholder={hint?.sections[i]?.items.join("\n") ?? "One point per line"} rows={Math.max(3, s.items.length + 1)} className={inputClass}
              value={s.items.join("\n")} onChange={(e) => setSection(i, { items: e.target.value.split("\n") })} />
            {t.sections.length > 1 && (
              <button type="button" className="self-start text-sm font-semibold text-muted underline" onClick={() => set({ sections: t.sections.filter((_, j) => j !== i) })}>
                Remove section
              </button>
            )}
          </div>
        </fieldset>
      ))}
      {t.sections.length < 8 && (
        <Button size="sm" variant="ghost" type="button" onClick={() => set({ sections: [...t.sections, { heading: "", items: [""] }] })}>Add a section</Button>
      )}
      <Field label="Question for the crew" hint="asked at the end" id={id("ask")}>
        <textarea id={id("ask")} rows={2} className={inputClass} placeholder={hint?.ask} value={t.ask} onChange={(e) => set({ ask: e.target.value })} />
      </Field>
    </div>
  );
}

function Editor({ companyId, edit, setEdit, onClose }: { companyId: string; edit: Edit; setEdit: (e: Edit) => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<"en" | "es">("en");
  // Any change to the words means the Spanish has to be checked again.
  const change = (p: Partial<Edit>) => setEdit({ ...edit, ...p, ...(p.en || p.es !== undefined ? { reviewed: false } : {}) });
  const problem = ownTalkProblem(tidyTalkText(edit.en), edit.es ? tidyTalkText(edit.es) : null)
    ?? (edit.es && edit.reviewed && !edit.reviewer.trim() ? "Name who checked the Spanish." : null);

  const save = async () => {
    if (problem) { setError(problem); return; }
    setBusy(true); setError(null);
    const en = tidyTalkText(edit.en);
    const es = edit.es ? tidyTalkText(edit.es) : null;
    try {
      await saveOwnTalk(companyId, {
        talk_key: edit.key, version: (edit.row?.version ?? 0) + 1, title: en.title, minutes: edit.minutes, code: edit.code.trim(),
        content: es ? { en, es } : { en }, es_status: es ? (edit.reviewed ? "reviewed" : "draft") : "none",
        es_reviewed_by: es && edit.reviewed ? edit.reviewer.trim() : "", based_on: edit.basedOn, source: edit.source,
      });
      await refreshOwnTalks();
      toast(edit.row ? `Saved "${en.title}" as version ${edit.row.version + 1}.` : `Saved "${en.title}". Give it now, or add it to your plan below.`);
      onClose();
    } catch (e) {
      const offline = typeof navigator !== "undefined" && navigator.onLine === false;
      setError(offline ? "No signal. Your talk is still here; save again when you're connected." : e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  };

  return (
    <Sheet title={edit.row ? "Edit your talk" : "Write a talk"} open onClose={onClose}>
      <div className="flex flex-col gap-4">
        {edit.source === "ai" && !edit.row && (
          <Notice tone="caution">An AI draft from the library talk. Read every line before saving: you&apos;re the one confirming the safety wording. It&apos;s saved as AI-drafted.</Notice>
        )}
        {edit.basedOn && edit.source !== "ai" && <Notice>Started from the library talk &quot;{LIBRARY.find((t) => t.id === edit.basedOn)?.content.en.title ?? edit.basedOn}&quot;. Make it fit your work.</Notice>}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Minutes" id="own-minutes">
            <select id="own-minutes" className={inputClass} value={edit.minutes} onChange={(e) => change({ minutes: Number(e.target.value) })}>
              {MINUTES.map((n) => <option key={n} value={n}>{n} min</option>)}
            </select>
          </Field>
          <Field label="Rule or reference" hint="optional" id="own-code">
            <input id="own-code" className={inputClass} maxLength={60} placeholder="e.g. 1926.501" value={edit.code} onChange={(e) => change({ code: e.target.value })} />
          </Field>
        </div>

        <div role="tablist" aria-label="Language" className="grid grid-cols-2 gap-1 rounded-[14px] bg-fg/[0.06] p-1">
          {(["en", "es"] as const).map((l) => (
            <button key={l} type="button" role="tab" aria-selected={lang === l} onClick={() => setLang(l)}
              className={`min-h-10 rounded-[10px] text-[14px] font-semibold ${lang === l ? "bg-surface text-fg shadow-[0_1px_3px_rgba(0,0,0,0.14)]" : "text-muted"}`}>
              {l === "en" ? "English" : edit.es ? `Spanish · ${edit.reviewed ? "checked" : "draft"}` : "Spanish · optional"}
            </button>
          ))}
        </div>

        {lang === "en" ? (
          <TextEditor label="en" t={edit.en} onChange={(en) => change({ en })} />
        ) : !edit.es ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted">
              Add Spanish if someone on your team reads it well. Until that person checks it against the English and puts their
              name on it, it shows with a &quot;not yet checked&quot; warning.
            </p>
            <Button type="button" variant="ghost" onClick={() => change({ es: { title: "", hook: "", ask: "", sections: edit.en.sections.map((s) => ({ heading: "", items: s.items.map(() => "") })) } })}>
              Add Spanish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <TextEditor label="es" t={edit.es} hint={edit.en} onChange={(es) => change({ es })} />
            <label className="flex items-start gap-3 rounded-xl border border-line p-3">
              <input type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--brand)]" checked={edit.reviewed}
                onChange={(e) => setEdit({ ...edit, reviewed: e.target.checked })} />
              <span className="text-sm">Someone who reads Spanish well checked this against the English. Changing any words sets it back to draft.</span>
            </label>
            {edit.reviewed && (
              <Field label="Who checked it" id="own-reviewer">
                <input id="own-reviewer" className={inputClass} maxLength={120} value={edit.reviewer} onChange={(e) => setEdit({ ...edit, reviewer: e.target.value })} />
              </Field>
            )}
            <button type="button" className="self-start text-sm font-semibold text-muted underline" onClick={() => change({ es: null })}>Remove Spanish</button>
          </div>
        )}

        {error && <Notice tone="error">{error}</Notice>}
        <div className="sticky -bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] -mb-[calc(1rem+env(safe-area-inset-bottom,0px))] grid grid-cols-[1fr_auto] gap-2 border-t border-line bg-bg pb-[calc(1rem+env(safe-area-inset-bottom,0px))] pt-3">
          <Button type="button" className="whitespace-nowrap" disabled={busy} onClick={save}>{busy ? "Saving…" : edit.row ? `Save as version ${edit.row.version + 1}` : "Save talk"}</Button>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Sheet>
  );
}

/** Pick a library talk, say a little about the work, get a draft to check and save. Owners and admins; 20 a day. */
function TailorWithAi({ companyId, onDraft }: { companyId: string; onDraft: (e: Edit) => void }) {
  const [base, setBase] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const go = async () => {
    const lib = LIBRARY.find((t) => t.id === base);
    if (!lib) { setError("Pick a library talk first."); return; }
    setBusy(true); setError(null);
    try {
      const draft = await tailorTalk({ companyId, baseId: lib.id, notes: notes.slice(0, MAX_NOTES) });
      onDraft({ row: null, key: newTalkKey(), basedOn: lib.id, en: draft, es: null, minutes: lib.minutes, code: lib.code, reviewed: false, reviewer: "", source: "ai" });
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  return (
    <section aria-label="Tailor with AI" className="mt-4 rounded-xl border border-line p-3">
      <b className="block">Tailor a library talk with AI</b>
      <p className="mt-1 text-sm text-muted">Get a draft that fits your work. It keeps the source talk&apos;s rules and adds none; you check it and save it as your own.</p>
      <div className="mt-3 flex flex-col gap-2">
        <select aria-label="Library talk to tailor" className={inputClass} value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="">Pick a library talk…</option>
          {LIBRARY.map((t) => <option key={t.id} value={t.id}>{t.content.en.title}</option>)}
        </select>
        <textarea aria-label="About your work" rows={2} maxLength={MAX_NOTES} className={inputClass} placeholder="About your work (optional): equipment, sites, tasks" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {error && <Notice tone="error">{error}</Notice>}
        <Button type="button" variant="soft" disabled={busy || !base} onClick={go}>{busy ? "Drafting…" : "Draft it"}</Button>
      </div>
    </section>
  );
}
