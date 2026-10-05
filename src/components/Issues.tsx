"use client";

// Issues the crew raised at talks: open ones first (overdue on top), tap one to reassign, change the fix-by date,
// or mark it fixed with a note. What was raised, when and at which talk never changes.
import { useEffect, useState } from "react";
import Link from "next/link";
import { listIssues, updateIssue } from "@/lib/data/issues";
import { listPeople } from "@/lib/data/company";
import type { Issue, Person } from "@/lib/data/types";
import { isoDay } from "@/core/weeks";
import { Button, Field, Loading, Notice, Sheet, inputClass } from "./ui";
import { toast } from "./toast";

const today = () => isoDay(new Date());
const short = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
export const isOverdue = (i: Pick<Issue, "status" | "due_date">) => i.status === "open" && !!i.due_date && i.due_date < today();

export function IssuesList({ companyId }: { companyId: string }) {
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState<"open" | "fixed">("open");
  const [editing, setEditing] = useState<Issue | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let live = true;
    Promise.all([listIssues(companyId), listPeople(companyId)])
      .then(([i, p]) => { if (live) { setIssues(i); setPeople(p); } })
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [companyId, version]);

  if (error) return <div className="mt-3"><Notice tone="error">Couldn&apos;t load issues: {error}</Notice></div>;
  if (!issues) return <Loading />;

  const open = issues.filter((i) => i.status === "open").sort((a, b) => (a.due_date ?? "9999").localeCompare(b.due_date ?? "9999"));
  const fixed = issues.filter((i) => i.status === "fixed").sort((a, b) => (b.fixed_at ?? "").localeCompare(a.fixed_at ?? ""));
  const list = show === "open" ? open : fixed;
  const overdue = open.filter(isOverdue).length;

  const save = async (id: string, patch: Parameters<typeof updateIssue>[2], msg: string) => {
    try {
      await updateIssue(companyId, id, patch);
      setEditing(null);
      setVersion((v) => v + 1);
      toast(msg, patch.status === "fixed" ? { action: { label: "Undo", run: () => void save(id, { status: "open" }, "Reopened") } } : {});
    } catch (e) {
      toast(e instanceof Error ? e.message : String(e), { tone: "error" });
    }
  };

  return (
    <>
      <div className="mt-3 flex items-center gap-1.5" role="group" aria-label="Show">
        {(["open", "fixed"] as const).map((k) => (
          <button key={k} aria-pressed={show === k} onClick={() => setShow(k)}
            className={`min-h-10 rounded-full border px-3.5 text-sm font-bold ${show === k ? "border-fg bg-fg text-bg" : "border-line bg-surface"}`}>
            {k === "open" ? `Open (${open.length})` : `Fixed (${fixed.length})`}
          </button>
        ))}
        {overdue > 0 && <span className="ml-auto rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">{overdue} overdue</span>}
      </div>
      {list.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{show === "open" ? "Nothing open. Issues the crew raises at a talk show up here." : "Nothing fixed yet."}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {list.map((i) => {
            const late = isOverdue(i);
            return (
              <li key={i.id}>
                <button onClick={() => setEditing(i)} className={`w-full rounded-lg border p-3 text-left ${late ? "border-warn bg-warn-bg" : "border-line bg-surface"}`}>
                  <b className="block break-words">{i.description}</b>
                  <small className="text-muted">
                    {i.owner_name || "No owner"}
                    {i.status === "open" ? (i.due_date ? ` · fix by ${short(i.due_date)}` : "") : ` · fixed ${short(i.fixed_at!)}${i.fixed_note ? `: ${i.fixed_note}` : ""}`}
                    {i.jobsite_name ? ` · ${i.jobsite_name}` : ""} · raised {short(i.raised_at)}
                  </small>
                  {late && <span className="mt-1 block font-display text-xs font-bold uppercase text-warn">Overdue</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet title={editing?.status === "fixed" ? "Fixed issue" : "Open issue"} open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <form
            key={editing.id}
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const owner = people.find((p) => p.id === f.get("owner"));
              const patch = { owner_person_id: owner?.id ?? null, owner_name: owner?.full_name ?? (f.get("owner") ? editing.owner_name : ""), due_date: String(f.get("due") || "") || null };
              void save(editing.id, patch, "Saved");
            }}
          >
            <p className="break-words text-lg font-bold">{editing.description}</p>
            <p className="text-sm text-muted">
              Raised {short(editing.raised_at)}{editing.raised_by_name ? ` by ${editing.raised_by_name}'s crew` : ""}{editing.jobsite_name ? ` at ${editing.jobsite_name}` : ""}
              {editing.record_id && <> · <Link className="underline" href={`/record/#${editing.record_id}`}>see the talk</Link></>}
            </p>
            {editing.status === "open" ? (
              <>
                <Field label="Owner" id="is-owner">
                  <select id="is-owner" name="owner" defaultValue={editing.owner_person_id ?? ""} className={inputClass}>
                    <option value="">No owner</option>
                    {people.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </Field>
                <Field label="Fix by" id="is-due"><input id="is-due" name="due" type="date" defaultValue={editing.due_date ?? ""} className={inputClass} /></Field>
                <Button size="sm" variant="ghost" type="submit">Save changes</Button>
                <FixForm onFix={(note) => void save(editing.id, { status: "fixed", fixed_note: note }, "Marked fixed")} />
              </>
            ) : (
              <>
                <p>Fixed {short(editing.fixed_at!)}{editing.fixed_note ? `: ${editing.fixed_note}` : ""}</p>
                <Button size="sm" variant="ghost" type="button" onClick={() => void save(editing.id, { status: "open" }, "Reopened")}>Reopen</Button>
              </>
            )}
          </form>
        )}
      </Sheet>
    </>
  );
}

function FixForm({ onFix }: { onFix: (note: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
      <Field label="What was done" id="is-note" hint="optional">
        <input id="is-note" className={inputClass} placeholder="Like: ladder replaced" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <Button type="button" onClick={() => onFix(note.trim())}>Mark fixed</Button>
    </div>
  );
}
