"use client";

// Inspections: pick a checklist (what's due comes first), mark each item pass, fail or not applicable, add a note and a
// photo for anything wrong, sign, save. Saved on the phone first and uploaded when there's signal; never edited after.
// Failed items can raise a crew issue. Rules: src/core/inspections.ts. Checklists: src/content/checklists.ts.
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { CHECKLISTS } from "@/content/checklists";
import { WHEN_LABEL, checklistsFor, dueFor, inspectionProblem, type CheckedItem, type Checklist, type InspectionPayload, type InspectionSummary, type ItemResult } from "@/core/inspections";
import { canPresent, type Jobsite, type Membership, type Person } from "@/lib/data/types";
import type { IssuePayload, Signature } from "@/core/record";
import { getInspection, listInspections, saveInspection, type InspectionRecord } from "@/lib/data/inspections";
import { listJobsites, listPeople } from "@/lib/data/company";
import { createQueue } from "@/lib/queue";
import { shrinkPhoto } from "@/lib/photo";
import { saveFile } from "@/lib/download";
import { newDraft } from "@/lib/draft";
import { useSession } from "@/lib/session";
import { useTalkLookup } from "@/lib/library";
import { readChosenJobsite } from "@/components/JobsitePicker";
import { RequireCompany } from "@/components/Guard";
import { SignaturePad } from "@/components/SignaturePad";
import { TopicIcon } from "@/components/TopicIcon";
import { Button, ErrorNotice, Eyebrow, Field, GroupHeading, Loading, Notice, Shell, Title, inputClass, segmentClass, segmentedClass } from "@/components/ui";
import { toast } from "@/components/toast";

type Queued = { payload: InspectionPayload; issues: IssuePayload[] };
const queue = createQueue<Queued>("tt-inspections", "This phone is out of room for saved inspections. Connect to upload the waiting ones, then try again.");

export default function InspectPage() {
  return <RequireCompany need="staff">{(m) => <Inspect m={m} />}</RequireCompany>;
}

const subscribeHash = (cb: () => void) => { window.addEventListener("hashchange", cb); return () => window.removeEventListener("hashchange", cb); };
const useHash = () => useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Inspect({ m }: { m: Membership }) {
  const s = useSession();
  const co = m.company;
  const hash = useHash();
  const [history, setHistory] = useState<InspectionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const userId = s.user?.id ?? null;
  const waiting = useSyncExternalStore(queue.onChange, () => JSON.stringify(queue.waiting(userId, (q) => q.payload.company_id === co.id)), () => "[]");
  const waitingItems = useMemo(() => JSON.parse(waiting) as ReturnType<typeof queue.waiting>, [waiting]);

  // Upload anything waiting as soon as the phone gets signal back.
  useEffect(() => {
    const retry = () => setVersion((v) => v + 1);
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);
  useEffect(() => {
    let live = true;
    void queue.flush(userId, (q) => saveInspection(q.payload, q.issues)).finally(() => {
      listInspections(co.id).then((h) => live && setHistory(h)).catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    });
    return () => { live = false; };
  }, [co.id, userId, version]);

  const lists = useMemo(() => checklistsFor(CHECKLISTS, co.industry), [co.industry]);
  const run = hash.startsWith("run=") ? lists.find((c) => c.id === hash.slice(4)) : undefined;
  const view = hash.startsWith("view=") ? hash.slice(5) : null;
  const go = (h: string) => { window.location.hash = h; window.scrollTo?.(0, 0); };

  if (run && canPresent(m.access)) return <Run m={m} list={run} userId={userId} onDone={() => { setVersion((v) => v + 1); }} back={() => go("")} />;
  if (view) return <View m={m} id={view} back={() => go("")} />;

  const last = (id: string) => {
    const done = [...waitingItems.map((q) => ({ checklist_id: q.item.payload.checklist_id, inspected_at: q.item.payload.inspected_at })), ...(history ?? [])].filter((h) => h.checklist_id === id);
    return done.sort((a, b) => b.inspected_at.localeCompare(a.inspected_at))[0]?.inspected_at ?? null;
  };
  const due = lists.filter((c) => dueFor(c, last(c.id)).due);
  const card = (c: Checklist) => <ChecklistCard key={c.id} c={c} state={dueFor(c, last(c.id))} onStart={canPresent(m.access) ? () => go(`run=${c.id}`) : undefined} />;

  return (
    <Shell>
      <Eyebrow>{co.name}</Eyebrow>
      <Title>Inspections</Title>
      <p className="mt-2 text-sm text-muted">Each checklist follows the rule that asks for it. Mark every item, explain anything that fails, sign, and it&apos;s saved, even with no signal.</p>
      {waitingItems.length > 0 && (
        <div className="mt-3"><Notice tone="caution">
          {waitingItems.length} inspection{waitingItems.length > 1 ? "s" : ""} saved on this phone, waiting to upload.
          {waitingItems.find((q) => q.lastError) && <> Last try: {waitingItems.find((q) => q.lastError)!.lastError}</>}
        </Notice></div>
      )}
      {error && <div className="mt-3"><ErrorNotice what="Couldn't load inspections." detail={error} onRetry={() => { setError(null); setVersion((v) => v + 1); }} /></div>}
      {due.length > 0 && (
        <>
          <GroupHeading aside={`${due.length}`}>Due now</GroupHeading>
          <ul className="mt-2 flex flex-col gap-2">{due.map(card)}</ul>
        </>
      )}
      <GroupHeading>Every job</GroupHeading>
      <ul className="mt-2 flex flex-col gap-2">{lists.filter((c) => c.industries.includes("all") && !due.includes(c)).map(card)}</ul>
      <GroupHeading>Your work</GroupHeading>
      <ul className="mt-2 flex flex-col gap-2">{lists.filter((c) => !c.industries.includes("all") && !due.includes(c)).map(card)}</ul>
      <GroupHeading aside={history ? `${history.length}` : undefined}>Recent</GroupHeading>
      {!history ? <Loading rows={2} /> : history.length === 0 ? <p className="mt-2 text-sm text-muted">No inspections saved yet.</p> : (
        <ul className="mt-2 flex flex-col gap-2">
          {history.slice(0, 50).map((h) => (
            <li key={h.id}>
              <button type="button" onClick={() => go(`view=${h.id}`)} aria-label={`Open ${h.title}${h.subject ? `, ${h.subject}` : ""}`}
                className="flex w-full items-center gap-3 rounded-xl bg-surface p-3 text-left shadow-card">
                <span className="min-w-0 flex-1">
                  <b className="block">{h.title}{h.subject ? ` · ${h.subject}` : ""}</b>
                  <small className="text-muted">{when(h.inspected_at)} · {h.inspector_name}{h.jobsite_name ? ` · ${h.jobsite_name}` : ""}</small>
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${h.failed_count ? "bg-warn text-warn-ink" : "bg-ok-bg text-ok"}`}>{h.failed_count ? `${h.failed_count} to fix` : "All clear"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-xs text-muted">Inspections document that someone looked. They don&apos;t by themselves certify OSHA compliance.</p>
    </Shell>
  );
}

function ChecklistCard({ c, state, onStart }: { c: Checklist; state: { due: boolean; label: string }; onStart?: () => void }) {
  const talk = useTalkLookup()(c.talkId);
  return (
    <li className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-card">
      {talk ? <TopicIcon talk={talk} size={36} /> : <span className="size-9 shrink-0" />}
      <span className="min-w-0 flex-1">
        <b className="block leading-snug">{c.title}</b>
        <small className="text-muted">{WHEN_LABEL[c.when]} · {c.items.length} checks · <span className={state.due ? "font-semibold text-warn-text" : ""}>{state.label}</span></small>
      </span>
      {onStart && <Button size="sm" variant={state.due ? "primary" : "soft"} type="button" onClick={onStart} aria-label={`Start ${c.title}`}>Start</Button>}
    </li>
  );
}

type Draft = { result: ItemResult | null; note: string; photo: string | null; issue: boolean };

function Run({ m, list, userId, onDone, back }: { m: Membership; list: Checklist; userId: string | null; onDone: () => void; back: () => void }) {
  const co = m.company;
  const router = useRouter();
  const [items, setItems] = useState<Draft[]>(() => list.items.map(() => ({ result: null, note: "", photo: null, issue: true })));
  const [subject, setSubject] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [sites, setSites] = useState<Jobsite[]>([]);
  const [siteId, setSiteId] = useState(() => readChosenJobsite(co.id) ?? "");
  const [personId, setPersonId] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [sig, setSig] = useState<Signature | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<{ fails: number; payload: InspectionPayload; uploaded: boolean } | null>(null);
  const clientId = useRef(crypto.randomUUID());

  useEffect(() => {
    let live = true;
    Promise.all([listPeople(co.id), listJobsites(co.id)]).then(([p, j]) => { if (live) { setPeople(p.filter((x) => x.active)); setSites(j); } }).catch(() => { /* offline: type the name */ });
    return () => { live = false; };
  }, [co.id]);

  const set = (i: number, p: Partial<Draft>) => { setError(null); setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...p } : x))); };
  const inspector = personId ? people.find((p) => p.id === personId)?.full_name ?? "" : name;
  const marked = items.filter((i) => i.result).length;
  const problem = inspectionProblem(items.map((d, i) => ({ ...d, text: list.items[i].text })), inspector, !!sig);
  const allPass = () => { setError(null); setItems((xs) => xs.map((x) => (x.result ? x : { ...x, result: "pass" }))); };

  const save = async () => {
    if (problem) { setError(problem); return; }
    setBusy(true); setError(null);
    const site = sites.find((s) => s.id === siteId);
    // A note or photo belongs to a failed item; switching it back to pass or n/a drops them.
    const checked: CheckedItem[] = list.items.map((it, i) => {
      const fail = items[i].result === "fail";
      return { ...it, result: items[i].result!, note: fail ? items[i].note.trim() : "", photo: fail ? items[i].photo : null };
    });
    const payload: InspectionPayload = {
      company_id: co.id, client_id: clientId.current, checklist_id: list.id, checklist_version: list.version, title: list.title, rule: list.rule,
      items: checked, subject: subject.trim(), jobsite_id: site?.id ?? null, jobsite_name: site?.name ?? "",
      inspector_person_id: personId || null, inspector_name: inspector.trim(), signature: sig!.image, notes: notes.trim(),
      inspected_at: new Date().toISOString(), latitude: null, longitude: null,
    };
    const issues: IssuePayload[] = list.items.flatMap((it, i) => (items[i].result === "fail" && items[i].issue ? [{
      client_id: crypto.randomUUID(), description: `${list.title}${subject.trim() ? ` (${subject.trim()})` : ""}: ${it.text}. ${items[i].note.trim()}`.slice(0, 1000),
      owner_person_id: null, owner_name: "", due_date: null, raised_by_name: inspector.trim(), raised_at: payload.inspected_at,
    } as IssuePayload] : []));
    try {
      queue.add(payload.client_id, userId, { payload, issues });
      await queue.flush(userId, (q) => saveInspection(q.payload, q.issues));
      // Uploaded only if it's no longer waiting (a flush already running may have started before this one was added).
      const uploaded = !queue.waiting(userId).some((q) => q.id === payload.client_id);
      setSaved({ fails: checked.filter((c) => c.result === "fail").length, payload, uploaded });
      onDone();
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };

  if (saved) {
    const talk = list.talkId;
    return (
      <Shell tabs={false}>
        <Eyebrow>Inspection saved</Eyebrow>
        <Title>{list.title}</Title>
        <div className="mt-4">
          {saved.fails ? <Notice tone="caution">{saved.fails} item{saved.fails > 1 ? "s" : ""} to fix. {items.some((d) => d.result === "fail" && d.issue) ? "They're on the issues list." : ""}</Notice>
            : <Notice tone="ok">Every item passed or doesn&apos;t apply.</Notice>}
        </div>
        {!saved.uploaded && <p className="mt-3 text-sm text-muted">Saved on this phone. It uploads when there&apos;s signal.</p>}
        <div className="mt-5 flex flex-col gap-2">
          {saved.fails > 0 && talk && canPresent(m.access) && (
            <Button type="button" onClick={() => { newDraft(co.id, talk, siteId); router.push("/talk/"); }}>Give the related talk now</Button>
          )}
          <Button type="button" variant="soft" onClick={back}>Back to inspections</Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell tabs={false} nav={<button type="button" className="min-h-11 text-sm font-semibold text-brand-text" onClick={back}>Cancel</button>}>
      <Eyebrow>{WHEN_LABEL[list.when]} · {list.rule}</Eyebrow>
      <Title>{list.title}</Title>
      <div className="mt-4 flex flex-col gap-3">
        <Field label="What are you inspecting?" hint="optional, e.g. Forklift 3, north scaffold" id="insp-subject">
          <input id="insp-subject" className={inputClass} maxLength={120} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </Field>
        {sites.length > 0 && (
          <Field label="Where" id="insp-site">
            <select id="insp-site" className={inputClass} value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              <option value="">Not at a jobsite</option>
              {sites.filter((s) => s.active !== false).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <GroupHeading aside={`${marked} of ${list.items.length}`}>Checks</GroupHeading>
      </div>
      <button type="button" className="mt-1 min-h-11 text-sm font-semibold text-brand-text underline" onClick={allPass}>Mark the rest as pass</button>
      <ol className="mt-2 flex flex-col gap-2">
        {list.items.map((it, i) => <ItemRow key={it.id} n={i + 1} text={it.text} rule={it.rule} d={items[i]} set={(p) => set(i, p)} />)}
      </ol>
      <div className="mt-5 flex flex-col gap-3">
        <Field label="Notes" hint="optional" id="insp-notes"><textarea id="insp-notes" rows={2} className={inputClass} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
        <Field label="Inspected by" id="insp-by">
          <select id="insp-by" className={inputClass} value={personId} onChange={(e) => setPersonId(e.target.value)}>
            <option value="">Someone not on the list</option>
            {people.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </Field>
        {!personId && <Field label="Name" id="insp-name"><input id="insp-name" className={inputClass} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></Field>}
        <SignaturePad label="Inspector's signature" value={sig} onChange={setSig} />
      </div>
      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}
      <div className="sticky bottom-0 mt-4 border-t border-line bg-bg py-3">
        <Button size="lg" type="button" className="w-full" disabled={busy} onClick={save}>{busy ? "Saving…" : problem && marked < list.items.length ? `Mark every item (${list.items.length - marked} left)` : "Save inspection"}</Button>
      </div>
    </Shell>
  );
}

function ItemRow({ n, text, rule, d, set }: { n: number; text: string; rule?: string; d: Draft; set: (p: Partial<Draft>) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const take = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    try { set({ photo: await shrinkPhoto(f) }); } catch { toast("Couldn't use that photo. Try again.", { tone: "error" }); }
    setBusy(false);
    if (input.current) input.current.value = "";
  };
  const choices: { id: ItemResult; label: string }[] = [{ id: "pass", label: "Pass" }, { id: "fail", label: "Fail" }, { id: "na", label: "N/A" }];
  return (
    <li className={`rounded-xl bg-surface p-3 shadow-card ${d.result === "fail" ? "ring-2 ring-warn" : ""}`}>
      <p className="font-semibold leading-snug"><span className="mr-1 text-muted tabular-nums">{n}.</span>{text}</p>
      {rule && <p className="mt-0.5 text-xs text-muted">{rule}</p>}
      <div className={`mt-2 grid-cols-3 ${segmentedClass}`} role="radiogroup" aria-label={`Result for item ${n}`}>
        {choices.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={d.result === c.id} onClick={() => set({ result: c.id })}
            className={`${segmentClass(d.result === c.id)} ${d.result === c.id && c.id === "fail" ? "!bg-warn !text-warn-ink" : ""} ${d.result === c.id && c.id === "pass" ? "!text-ok" : ""}`}>
            {c.label}
          </button>
        ))}
      </div>
      {d.result === "fail" && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea aria-label={`What's wrong with item ${n}`} rows={2} className={inputClass} placeholder="What's wrong?" value={d.note} onChange={(e) => set({ note: e.target.value })} />
          <input ref={input} type="file" accept="image/*" capture="environment" className="sr-only" aria-label={`Photo for item ${n}`} onChange={(e) => take(e.target.files?.[0])} />
          <div className="flex flex-wrap items-center gap-2">
            {d.photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <><img src={d.photo} alt={`Photo for item ${n}`} className="h-16 w-16 rounded-lg object-cover" /><Button size="sm" variant="ghost" type="button" onClick={() => set({ photo: null })}>Remove photo</Button></>
              : <Button size="sm" variant="ghost" type="button" disabled={busy} onClick={() => input.current?.click()}>{busy ? "Processing…" : "Add a photo"}</Button>}
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="size-5 accent-[var(--brand)]" checked={d.issue} onChange={(e) => set({ issue: e.target.checked })} />Put it on the issues list to fix</label>
        </div>
      )}
    </li>
  );
}

function View({ m, id, back }: { m: Membership; id: string; back: () => void }) {
  const [r, setR] = useState<InspectionRecord | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    getInspection(m.company.id, id).then((x) => live && setR(x)).catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [m.company.id, id]);
  const pdf = async () => {
    if (!r) return;
    try {
      const { buildInspectionPdf, inspectionPdfFileName } = await import("@/lib/pdf");
      const res = await saveFile(inspectionPdfFileName(r), buildInspectionPdf(r, m.company).output("blob"));
      if (res !== "canceled") toast("PDF ready.");
    } catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  const nav = <button type="button" className="min-h-11 text-sm font-semibold text-brand-text" onClick={back}>Inspections</button>;
  if (error) return <Shell nav={nav}><ErrorNotice what="Couldn't load this inspection." detail={error} onRetry={() => location.reload()} /></Shell>;
  if (r === undefined) return <Shell nav={nav}><Loading /></Shell>;
  if (r === null) return <Shell nav={nav}><Notice>This inspection isn&apos;t here. It may belong to another company.</Notice></Shell>;
  const label = { pass: "Pass", fail: "Fail", na: "N/A" } as const;
  return (
    <Shell nav={nav}>
      <Eyebrow>{when(r.inspected_at)}</Eyebrow>
      <Title>{r.title}</Title>
      <p className="mt-1 text-sm text-muted">{[r.subject, r.jobsite_name, `by ${r.inspector_name}`].filter(Boolean).join(" · ")}</p>
      <div className="mt-3">{r.failed_count ? <Notice tone="caution">{r.failed_count} to fix</Notice> : <Notice tone="ok">All clear</Notice>}</div>
      <ol className="mt-4 flex flex-col gap-2">
        {r.items.map((it, i) => (
          <li key={it.id} className={`rounded-xl bg-surface p-3 shadow-card ${it.result === "fail" ? "ring-2 ring-warn" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="leading-snug"><span className="mr-1 text-muted">{i + 1}.</span>{it.text}</p>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${it.result === "fail" ? "bg-warn text-warn-ink" : it.result === "pass" ? "bg-ok-bg text-ok" : "bg-fg/[0.06] text-muted"}`}>{label[it.result]}</span>
            </div>
            {it.note && <p className="mt-1 text-sm italic">{it.note}</p>}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {it.photo && <img src={it.photo} alt={`Photo for item ${i + 1}`} className="mt-2 max-h-56 rounded-lg" />}
          </li>
        ))}
      </ol>
      {r.notes && <p className="mt-3 text-sm"><b>Notes:</b> {r.notes}</p>}
      <div className="mt-5"><Button type="button" onClick={pdf}>Download PDF</Button></div>
    </Shell>
  );
}
