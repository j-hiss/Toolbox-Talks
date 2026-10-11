"use client";

// "Your checklists" on the Inspections screen: the company's own checklists (src/core/ownChecklists.ts, migration
// 0045). Owners and admins make, change (a new version) and retire them; everyone who runs inspections sees them with
// the app's. Loaded once and kept on the phone, so they still run with no signal.
import { useCallback, useEffect, useState } from "react";
import { WHEN_LABEL, type ChecklistWhen } from "@/core/inspections";
import { asChecklist, itemsFromLines, latestOwnChecklists, linesFromItems, newChecklistKey, ownChecklistProblem, type OwnChecklistRow } from "@/core/ownChecklists";
import { listOwnChecklists, retireOwnChecklist, saveOwnChecklist } from "@/lib/data/ownChecklists";
import { Button, ConfirmButton, Field, Notice, Sheet, inputClass } from "./ui";
import { toast } from "./toast";

const cacheKey = (companyId: string) => `tt-own-checklists:${companyId}`;

/** The company's own checklists (latest versions), the last copy this phone saw while offline. */
export function useOwnChecklists(companyId: string): { rows: OwnChecklistRow[]; reload: () => void } {
  const [rows, setRows] = useState<OwnChecklistRow[]>(() => {
    try { return JSON.parse(localStorage.getItem(cacheKey(companyId)) ?? "[]"); } catch { return []; }
  });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    listOwnChecklists(companyId).then((all) => {
      const latest = latestOwnChecklists(all);
      try { localStorage.setItem(cacheKey(companyId), JSON.stringify(latest)); } catch { /* fine */ }
      if (live) setRows(latest);
    }).catch(() => { /* offline: keep the saved copy */ });
    return () => { live = false; };
  }, [companyId, tick]);
  return { rows, reload: useCallback(() => setTick((t) => t + 1), []) };
}

/** Saved own checklists as runnable checklists. */
export const ownAsChecklists = (rows: OwnChecklistRow[]) => rows.map(asChecklist);

type Edit = { key: string; version: number; title: string; how_often: ChecklistWhen; rule: string; lines: string; prev: OwnChecklistRow | null };

/** Admin tools: make a checklist, change or retire one. */
export function OwnChecklistTools({ companyId, rows, onChanged }: { companyId: string; rows: OwnChecklistRow[]; onChanged: () => void }) {
  const [edit, setEdit] = useState<Edit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const start = (r: OwnChecklistRow | null) => {
    setError(null);
    setEdit(r ? { key: r.checklist_key, version: r.version + 1, title: r.title, how_often: r.how_often, rule: r.rule, lines: linesFromItems(r.items), prev: r }
      : { key: newChecklistKey(), version: 1, title: "", how_often: "daily", rule: "", lines: "", prev: null });
  };
  const save = async () => {
    if (!edit) return;
    const d = { title: edit.title, how_often: edit.how_often, rule: edit.rule, items: itemsFromLines(edit.lines, edit.prev?.items ?? []) };
    const p = ownChecklistProblem(d);
    if (p) { setError(p); return; }
    setBusy(true); setError(null);
    try { await saveOwnChecklist(companyId, edit.key, edit.version, d); toast(edit.prev ? `${d.title.trim()} updated (version ${edit.version}).` : `${d.title.trim()} added to your checklists.`); setEdit(null); onChanged(); }
    catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    setBusy(false);
  };
  const retire = async (r: OwnChecklistRow) => {
    try { await retireOwnChecklist(companyId, r); toast(`${r.title} retired. Inspections already saved keep it.`); onChanged(); }
    catch (e) { toast(e instanceof Error ? e.message : String(e), { tone: "error" }); }
  };
  return (
    <div className="mt-2">
      <Button type="button" size="sm" variant="soft" onClick={() => start(null)}>Make your own checklist</Button>
      {rows.length > 0 && (
        <ul aria-label="Change your checklists" className="mt-2 flex flex-col gap-1 text-sm">
          {rows.map((r) => (
            <li key={r.checklist_key} className="flex flex-wrap items-center gap-2">
              <span className="min-w-0 flex-1">{r.title} <small className="text-muted">· version {r.version}</small></span>
              <Button type="button" size="sm" variant="ghost" onClick={() => start(r)}>Change</Button>
              <ConfirmButton label="Retire" confirmLabel="Tap again to retire" onConfirm={() => void retire(r)} />
            </li>
          ))}
        </ul>
      )}
      <Sheet title={edit?.prev ? `Change ${edit.prev.title}` : "Make your own checklist"} open={!!edit} onClose={() => setEdit(null)}>
        {edit && (
          <div className="flex flex-col gap-3">
            <Field label="Name" id="oc-title"><input id="oc-title" className={inputClass} maxLength={120} value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="Example: Crane setup" /></Field>
            <Field label="How often" id="oc-when">
              <select id="oc-when" className={inputClass} value={edit.how_often} onChange={(e) => setEdit({ ...edit, how_often: e.target.value as ChecklistWhen })}>
                {(Object.keys(WHEN_LABEL) as ChecklistWhen[]).map((w) => <option key={w} value={w}>{WHEN_LABEL[w]}</option>)}
              </select>
            </Field>
            <Field label="Rule or reason (optional)" hint="Shown on the card and the PDF" id="oc-rule"><input id="oc-rule" className={inputClass} maxLength={300} value={edit.rule} onChange={(e) => setEdit({ ...edit, rule: e.target.value })} placeholder="Example: Manufacturer's daily inspection" /></Field>
            <Field label="What to check, one per line" hint="Add a rule after | if you like: Load chart in the cab | 1926.1417(c)" id="oc-items">
              <textarea id="oc-items" rows={8} className={inputClass} value={edit.lines} onChange={(e) => setEdit({ ...edit, lines: e.target.value })} />
            </Field>
            <p className="text-xs text-muted">Each item is marked pass, fail or not applicable when it&apos;s run. Saving makes a new version; inspections already saved keep the items they checked.</p>
            {error && <Notice tone="error">{error}</Notice>}
            <Button type="button" disabled={busy} onClick={save}>{busy ? "Saving…" : edit.prev ? "Save changes" : "Add checklist"}</Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
