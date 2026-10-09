"use client";

// Admin → People → Import from spreadsheet. Pick a .xlsx or .csv, check the preview (what gets added, updated or
// skipped, and any new crews or roles), then import. Matching rules live in src/core/importPeople.ts.
import { useState } from "react";
import { parseCsv, planImport, templateCsv, type ImportPlan } from "@/core/importPeople";
import { addPerson, addRoles, addTeam, listAllPeople, listRoles, listTeams, updatePerson } from "@/lib/data/company";
import { NO_TITLE } from "@/core/presenters";
import { saveFile } from "@/lib/download";
import { Button, Notice, Sheet } from "./ui";
import { toast } from "./toast";

async function readTable(file: File): Promise<unknown[][]> {
  if (/\.csv$/i.test(file.name) || file.type === "text/csv") return parseCsv(await file.text());
  if (/\.xlsx$/i.test(file.name)) {
    const { readSheet } = await import("read-excel-file/browser"); // loaded only when importing
    return (await readSheet(file)) as unknown[][];
  }
  throw new Error("Use an Excel file (.xlsx) or a CSV file (.csv). Older .xls files: open in Excel and Save As .xlsx.");
}

export function ImportPeople({ companyId, open, onClose, onDone }: { companyId: string; open: boolean; onClose: () => void; onDone: () => void }) {
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const reset = () => { setPlan(null); setFileName(""); setError(null); setBusy(null); };
  const close = () => { reset(); onClose(); };

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy("Reading the file…");
    try {
      const [table, people, teams, roles] = await Promise.all([readTable(file), listAllPeople(companyId), listTeams(companyId), listRoles(companyId)]);
      const p = planImport(table, people, teams.map((t) => ({ id: t.id, name: t.name })), roles.map((r) => ({ id: r.id, name: r.name })));
      if (p.missingColumns.length) throw new Error(`The first row needs a "Name" column. Download the template to see the layout.`);
      if (p.rows.length === 0) throw new Error("No rows found under the header.");
      setPlan(p);
      setFileName(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBusy(null);
  };

  const run = async () => {
    if (!plan) return;
    try {
      setBusy("Adding teams and job titles…");
      for (const t of plan.newTeams) await addTeam(companyId, t);
      await addRoles(companyId, plan.newRoles.map((name) => ({ name, presents: false }))); // new titles sign only until turned on
      const [teams, roles] = await Promise.all([listTeams(companyId), listRoles(companyId)]);
      const teamId = (n: string) => (n ? teams.find((t) => t.name.toLowerCase() === n.toLowerCase())?.id ?? null : null);
      const roleId = (n: string) => (n ? roles.find((r) => r.name.toLowerCase() === n.toLowerCase())?.id ?? null : null);
      const todo = plan.rows.filter((r) => r.action !== "skip");
      let done = 0;
      for (const r of todo) {
        setBusy(`Saving ${++done} of ${todo.length}…`);
        const fields = {
          full_name: r.name, role_id: roleId(r.role), team_id: teamId(r.team),
          employee_id: r.employeeId || null, phone: r.phone || null, preferred_language: r.language,
        };
        if (r.action === "update" && r.matchId) await updatePerson(companyId, r.matchId, { ...fields, active: true });
        else await addPerson(companyId, fields);
      }
      toast(`Imported: ${plan.counts.add} added, ${plan.counts.update} updated${plan.counts.skip ? `, ${plan.counts.skip} skipped` : ""}`);
      onDone();
      close();
    } catch (e) {
      setError(`Stopped partway: ${e instanceof Error ? e.message : String(e)}. Rows already saved are kept; importing the same file again picks up where it stopped.`);
      setBusy(null);
    }
  };

  return (
    <Sheet title="Import people" open={open} onClose={close}>
      {!plan ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm">Upload your team member list from Excel or a CSV. The first row names the columns: <b>Name</b> (required), Job title, Team (or Crew), Employee ID, Phone, Preferred language.</p>
          <p className="text-sm text-muted">Re-uploading the same list updates people with a matching Employee ID instead of adding them twice. New teams and job titles are created for you.</p>
          <label className={`flex min-h-14 cursor-pointer items-center justify-center rounded-lg bg-action px-4 font-display text-xl font-semibold text-action-ink ${busy ? "opacity-50" : ""}`}>
            {busy ?? "Choose a file"}
            <input type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="sr-only" disabled={!!busy}
              onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          <Button size="sm" variant="ghost" onClick={() => void saveFile("People import template.csv", new Blob([templateCsv()], { type: "text/csv" })).catch((e) => setError(String(e?.message ?? e)))}>
            Download the template
          </Button>
          {error && <Notice tone="error">{error}</Notice>}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted">{fileName}</p>
          <p className="tabular-nums"><b>{plan.counts.add}</b> to add · <b>{plan.counts.update}</b> to update · <b className={plan.counts.skip ? "text-warn-text" : ""}>{plan.counts.skip}</b> skipped</p>
          {(plan.newTeams.length > 0 || plan.newRoles.length > 0) && (
            <Notice>
              {plan.newTeams.length > 0 && <>New teams: <b>{plan.newTeams.join(", ")}</b>. </>}
              {plan.newRoles.length > 0 && <>New job titles: <b>{plan.newRoles.join(", ")}</b> (they sign only; turn on &quot;Gives talks&quot; in Job titles if they present).</>}
            </Notice>
          )}
          <ul className="flex max-h-[45vh] flex-col divide-y divide-line overflow-y-auto rounded-xl bg-surface text-sm">
            {plan.rows.map((r) => (
              <li key={r.line} className={`px-3 py-2 ${r.action === "skip" ? "bg-warn-bg" : ""}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <b className="truncate">{r.name || "(no name)"}</b>
                  <span className={`shrink-0 text-xs font-semibold ${r.action === "skip" ? "text-warn-text" : r.action === "update" ? "text-muted" : "text-ok-text"}`}>
                    {r.action === "add" ? "Add" : r.action === "update" ? "Update" : "Skip"} · row {r.line}
                  </span>
                </div>
                <small className="text-muted">{[r.role || NO_TITLE, r.team || "No team", r.employeeId && `ID ${r.employeeId}`].filter(Boolean).join(" · ")}</small>
                {[...r.problems, ...r.notes].map((n) => <small key={n} className={`block ${r.problems.includes(n) ? "font-semibold text-warn-text" : "text-muted"}`}>{n}</small>)}
              </li>
            ))}
          </ul>
          {error && <Notice tone="error">{error}</Notice>}
          <Button onClick={() => void run()} disabled={!!busy || plan.counts.add + plan.counts.update === 0}>
            {busy ?? `Import ${plan.counts.add + plan.counts.update} people`}
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} disabled={!!busy}>Choose a different file</Button>
        </div>
      )}
    </Sheet>
  );
}
