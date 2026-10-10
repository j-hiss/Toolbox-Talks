"use client";

// Admin setup: people, teams, jobsites, the roles that can give talks, the talks the plan uses, the weekly plan, the
// safety log, and company info.
// Owners and admins only.
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useSession } from "@/lib/session";
import {
  addJobsite, addPerson, addRole, addRoles, addTeam, deactivateJobsite, deactivatePerson, deleteRole, deleteTeam, listJobsites,
  listPeople, listRoles, listTeams, updateCompany, updateJobsite, updatePerson, updateRole, updateTeam,
} from "@/lib/data/company";
import { companyWorkSetting, WORK_SETTINGS, type WorkSetting } from "@/core/worksetting";
import { missingStarterTitles } from "@/content/jobTitles";
import { NO_TITLE } from "@/core/presenters";
import { INDUSTRIES } from "@/core/industries";
import type { Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { getLocation, LocationError } from "@/lib/location";
import { mapsLink } from "@/core/geo";
import { buildPlan, periodEnd, talksInPlan, weekNumbers } from "@/core/plan";
import { climateFor } from "@/core/climate";
import { canChangeWeek } from "@/core/makeup";
import { weekLabel, isoDay, mondayOf, parseDay, periodLabel } from "@/core/weeks";
import { useTalkLookup, useTalks } from "@/lib/library";
import { isOwnTalk } from "@/core/ownTalks";
import { usePlan } from "@/lib/usePlan";
import { clearOverride, setOverride } from "@/lib/data/plan";
import { listRecordedWeeks } from "@/lib/data/records";
import { RequireCompany } from "@/components/Guard";
import { CompanyForm } from "@/components/CompanyForm";
import { Button, ConfirmButton, Eyebrow, Field, GroupHeading, Loading, Notice, Sheet, Shell, Title, inputClass, Avatar } from "@/components/ui";
import { toast } from "@/components/toast";
import { ImportPeople } from "@/components/ImportPeople";
import { TalkPicker } from "@/components/TalkPicker";
import { OwnTalks } from "@/components/OwnTalks";
import { CadencePicker } from "@/components/CadencePicker";
import { RepeatPicker } from "@/components/RepeatPicker";
import { saveFile } from "@/lib/download";
import { appWebAddress, jobsiteSticker } from "@/lib/sticker";
import { SafetyLog } from "@/components/SafetyLog";
import { InjuryLog } from "@/components/InjuryLog";
import { BrandEditor } from "@/components/BrandEditor";
import { AppAccess } from "@/components/AppAccess";
import { Training } from "@/components/Training";

const TABS = [
  { id: "people", label: "People", group: "people" },
  { id: "teams", label: "Teams", group: "people" },
  { id: "jobsites", label: "Jobsites", group: "people" },
  { id: "roles", label: "Job titles", group: "people" },
  { id: "access", label: "App access", group: "people" },
  { id: "training", label: "Training", group: "people" },
  { id: "talks", label: "Talks", group: "program" },
  { id: "plan", label: "Plan", group: "program" },
  { id: "safety", label: "Safety log", group: "program" },
  { id: "injuries", label: "Injury log", group: "program" },
  { id: "company", label: "Company", group: "program" },
  { id: "brand", label: "Brand", group: "program" },
] as const;
// Two short labelled rows instead of one wrapped block of chips.
const TAB_GROUPS = [
  { id: "people", label: "People and places" },
  { id: "program", label: "Program" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  return <RequireCompany admin>{(m) => <Admin m={m} />}</RequireCompany>;
}

// The open tab lives in the URL hash (#people, #teams, ...) so a link can open a tab directly.
const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};
function useHashTab(): [TabId, (t: TabId) => void] {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const tab = (TABS.find((t) => t.id === hash)?.id ?? "people") as TabId;
  return [tab, (t) => { window.location.hash = t; }];
}

function Admin({ m }: { m: Membership }) {
  const s = useSession();
  const companyId = m.company.id;
  const [tab, setTab] = useHashTab();
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [teams, setTeams] = useState<Team[] | null>(null);
  const [people, setPeople] = useState<Person[] | null>(null);
  const [jobsites, setJobsites] = useState<Jobsite[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [version, setVersion] = useState(0);

  useEffect(() => {
    let live = true;
    Promise.all([listRoles(companyId), listTeams(companyId), listPeople(companyId), listJobsites(companyId)])
      .then(([r, t, p, j]) => { if (live) { setRoles(r); setTeams(t); setPeople(p); setJobsites(j); setError(null); } })
      .catch((e) => { if (live) setError(e instanceof Error ? e.message : String(e)); });
    return () => { live = false; };
  }, [companyId, version]);

  /** Run a change, then reload. Says "Saved" (or the given message; null for none). Errors show as a red message. */
  const act: Act = (fn, msg = "Saved") => async () => {
    try {
      await fn();
      setVersion((v) => v + 1);
      setError(null);
      if (msg) toast(msg);
    } catch (e) {
      const text = e instanceof Error ? e.message : String(e);
      setError(text);
      toast(text, { tone: "error" });
    }
  };

  return (
    <Shell>
      <Eyebrow>Admin · {m.company.name}</Eyebrow>
      <Title>Company setup</Title>

      <div role="tablist" aria-label="Admin sections" className="mt-4 flex flex-col gap-2">
        {TAB_GROUPS.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-1.5">
            <span className="w-full text-sm font-medium text-muted">{g.label}</span>
            {TABS.filter((t) => t.group === g.id).map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`min-h-11 rounded-full border px-3.5 text-[15px] font-semibold ${tab === t.id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-fg"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {error && <div className="mt-4"><Notice tone="error">{error}</Notice></div>}

      <div className="mt-5">
        {tab === "talks" ? (
          <TalksTab m={m} />
        ) : tab === "plan" ? (
          <PlanTab m={m} />
        ) : tab === "brand" ? (
          <BrandEditor
            saved={m.company.theme}
            onSave={async (theme) => {
              try {
                await updateCompany(companyId, { theme });
                await s.refresh();
                toast("Colors saved");
              } catch (e) {
                toast(e instanceof Error ? e.message : String(e), { tone: "error" });
              }
            }}
          />
        ) : tab === "company" ? (
          <>
            <CompanyForm
              initial={{ ...m.company, makeup_weeks: m.company.makeup_weeks ?? 4 }}
              submitLabel="Save company info"
              onSubmit={async (c) => { await updateCompany(companyId, c); await s.refresh(); }}
            />
            <DailyToggle companyId={companyId} on={!!m.company.daily_enabled} refresh={s.refresh} />
          </>
        ) : !roles || !teams || !people || !jobsites ? (
          <Loading />
        ) : tab === "people" ? (
          <PeopleTab companyId={companyId} people={people} roles={roles} teams={teams} act={act} />
        ) : tab === "teams" ? (
          <TeamsTab companyId={companyId} people={people} teams={teams} act={act} />
        ) : tab === "jobsites" ? (
          <JobsitesTab companyId={companyId} company={m.company} jobsites={jobsites} act={act} />
        ) : tab === "training" ? (
          <Training companyId={companyId} people={people} roles={roles} />
        ) : tab === "access" ? (
          <AppAccess companyId={companyId} myAccess={m.access} myUserId={s.user?.id ?? null} people={people} />
        ) : tab === "injuries" ? (
          <InjuryLog company={m.company} people={people} roles={roles} />
        ) : tab === "safety" ? (
          <SafetyLog company={m.company} state={climateFor(m.company.zip).state} jobsites={jobsites} people={people} />
        ) : (
          <RolesTab company={m.company} people={people} roles={roles} act={act} />
        )}
      </div>
    </Shell>
  );
}

type Act = (fn: () => Promise<void>, msg?: string | null) => () => Promise<void>;
const CREW = "";

function PeopleTab({ companyId, people, roles, teams, act }: { companyId: string; people: Person[]; roles: Role[]; teams: Team[]; act: Act }) {
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState(CREW);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [adding, setAdding] = useState(people.length === 0);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Person | null>(null);
  const [importing, setImporting] = useState(false);
  const roleOptions = <><option value={CREW}>{NO_TITLE}</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</>;
  const teamOptions = <><option value="">No team</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</>;
  const roleName = (p: Person) => roles.find((r) => r.id === p.role_id)?.name ?? NO_TITLE;
  const isLead = (p: Person) => teams.some((t) => t.lead_person_id === p.id);
  const shown = people.filter((p) => !q.trim() || p.full_name.toLowerCase().includes(q.trim().toLowerCase()));
  const groups = [...teams.map((t) => ({ id: t.id, name: t.name })), { id: "", name: "No team" }]
    .map((g) => ({ ...g, people: shown.filter((p) => (p.team_id ?? "") === g.id).sort((a, b) => Number(isLead(b)) - Number(isLead(a)) || a.full_name.localeCompare(b.full_name)) }))
    .filter((g) => g.people.length > 0);

  const remove = (p: Person) => act(async () => {
    // Capture what removing clears (team, team-lead spots) before it happens, so Undo can put it back.
    const leadOf = teams.filter((t) => t.lead_person_id === p.id).map((t) => t.id);
    const teamId = p.team_id;
    await deactivatePerson(companyId, p.id);
    setEditing(null);
    toast(`${p.full_name} removed`, {
      action: {
        label: "Undo",
        run: act(async () => {
          await updatePerson(companyId, p.id, { active: true, team_id: teamId });
          for (const t of leadOf) await updateTeam(companyId, t, { lead_person_id: p.id });
        }, `${p.full_name} is back`),
      },
    });
  }, null)();

  return (
    <>
      <div className="flex gap-2">
        <input type="search" aria-label="Search people" placeholder={`Search ${people.length} people`} className={inputClass} value={q} onChange={(e) => setQ(e.target.value)} />
        {!adding && <Button size="sm" className="shrink-0" onClick={() => setAdding(true)}>+ Add</Button>}
      </div>
      <button className="mt-2 min-h-11 text-sm font-semibold text-brand-text underline underline-offset-2" onClick={() => setImporting(true)}>Import from a spreadsheet (Excel or CSV)</button>
      <ImportPeople companyId={companyId} open={importing} onClose={() => setImporting(false)} onDone={act(async () => {}, null)} />
      {adding && (
        <form
          className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-surface p-3"
          onSubmit={(e) => {
            e.preventDefault();
            const n = name.trim();
            if (!n) return;
            act(async () => { await addPerson(companyId, { full_name: n, role_id: roleId || null, team_id: teamId || null }); setName(""); }, `${n} added`)();
          }}
        >
          <Field label="Add a person" id="np-name">
            <input id="np-name" placeholder="Full name" autoComplete="off" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-2">
            <select aria-label="Job title" className={`${inputClass} flex-1 basis-36`} value={roleId} onChange={(e) => setRoleId(e.target.value)}>{roleOptions}</select>
            <select aria-label="Team" className={`${inputClass} flex-1 basis-36`} value={teamId} onChange={(e) => setTeamId(e.target.value)}>{teamOptions}</select>
          </div>
          <div className="flex gap-2">
            <Button size="sm" type="submit">Add person</Button>
            {people.length > 0 && <Button size="sm" variant="ghost" type="button" onClick={() => setAdding(false)}>Done adding</Button>}
          </div>
          <p className="text-xs text-muted">Team members sign at talks. Anyone with a job title that presents can also give talks.</p>
        </form>
      )}

      {people.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No one yet. Add your team members above.</p>
      ) : shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No one matches &quot;{q}&quot;.</p>
      ) : groups.map((g) => (
        <section key={g.id || "none"}>
          <GroupHeading aside={`${g.people.length}`}>{g.name}</GroupHeading>
          <ul className="mt-2 divide-y divide-line overflow-hidden rounded-xl bg-surface shadow-card">
            {g.people.map((p) => (
              <li key={p.id}>
                <button className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left hover:bg-bg" onClick={() => setEditing(p)}>
                  <Avatar name={p.full_name} size={36} />
                  <span className="min-w-0 flex-1">
                    <b className="block truncate">{p.full_name}</b>
                    <small className="text-muted">{isLead(p) ? "Team lead · " : ""}{roleName(p)}</small>
                  </span>
                  <span aria-hidden className="text-xl text-muted">›</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="mt-4 text-xs text-muted">Removing someone takes them off rosters. Their past signed records stay.</p>

      <Sheet title="Edit person" open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <form
            key={editing.id}
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const full_name = String(f.get("name") ?? "").trim();
              if (!full_name) return;
              const patch = { full_name, role_id: String(f.get("role") ?? "") || null, team_id: String(f.get("team") ?? "") || null };
              act(async () => { await updatePerson(companyId, editing.id, patch); setEditing(null); })();
            }}
          >
            <Field label="Name" id="ep-name"><input id="ep-name" name="name" defaultValue={editing.full_name} className={`${inputClass} font-semibold`} /></Field>
            <Field label="Job title" id="ep-role"><select id="ep-role" name="role" defaultValue={editing.role_id ?? CREW} className={inputClass}>{roleOptions}</select></Field>
            <Field label="Team" id="ep-team"><select id="ep-team" name="team" defaultValue={editing.team_id ?? ""} className={inputClass}>{teamOptions}</select></Field>
            <Button type="submit">Save</Button>
            <Button type="button" size="sm" variant="danger" onClick={() => remove(editing)}>Remove {editing.full_name}</Button>
          </form>
        )}
      </Sheet>
    </>
  );
}

function TeamsTab({ companyId, people, teams, act }: { companyId: string; people: Person[]; teams: Team[]; act: Act }) {
  const [name, setName] = useState("");
  return (
    <>
      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); const n = name.trim(); if (n) act(async () => { await addTeam(companyId, n); setName(""); })(); }}
      >
        <input aria-label="New team name" placeholder="Team name, like Crew 3" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        <Button size="sm" type="submit">Add team</Button>
      </form>
      {teams.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No teams yet. Add one, then put people on it from the People tab.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {teams.map((t) => {
            const members = people.filter((p) => p.team_id === t.id);
            return (
              <li key={t.id} className="flex flex-col gap-2 rounded-xl bg-surface shadow-card p-3">
                <input
                  aria-label="Team name"
                  defaultValue={t.name}
                  className={`${inputClass} font-semibold`}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== t.name) act(() => updateTeam(companyId, t.id, { name: v }))();
                    else e.target.value = t.name;
                  }}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor={`lead-${t.id}`} className="text-sm text-muted">Team lead</label>
                  <select id={`lead-${t.id}`} className={`${inputClass} flex-1 basis-40`} value={t.lead_person_id ?? ""} onChange={(e) => act(() => updateTeam(companyId, t.id, { lead_person_id: e.target.value || null }))()}>
                    <option value="">{members.length ? "No lead set" : "Add people to this team first"}</option>
                    {members.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                  <span className="text-sm text-muted tabular-nums">{members.length} {members.length === 1 ? "person" : "people"}</span>
                  <ConfirmButton label="Remove" confirmLabel="Confirm" onConfirm={act(() => deleteTeam(companyId, t.id))} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted">Removing a team leaves its people in the company with no team.</p>
    </>
  );
}

// Job titles (the roles table). Each title either presents (shows in "Presented by") or signs only. Starter titles for
// the company's industry come from src/content/jobTitles.ts; who presents: src/core/presenters.ts.
function RolesTab({ company, people, roles, act }: { company: Membership["company"]; people: Person[]; roles: Role[]; act: Act }) {
  const companyId = company.id;
  const [name, setName] = useState("");
  const [presents, setPresents] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const missing = missingStarterTitles(company.industry, roles);
  const industry = INDUSTRIES.find((i) => i.id === company.industry)?.name.toLowerCase() ?? "your industry";
  const sorted = [...roles].sort((a, b) => Number(b.presents) - Number(a.presents) || a.name.localeCompare(b.name));
  return (
    <>
      <p className="text-sm text-muted">Everyone&apos;s job, from Owner to Laborer. Titles marked <b>Gives talks</b> appear in the &quot;Presented by&quot; list, and so does each team&apos;s lead. Someone with no title shows as &quot;{NO_TITLE}&quot; and signs only.</p>
      {missing.length > 0 && (
        <div className="mt-3 rounded-lg border border-dashed border-line bg-surface p-3 text-sm">
          <p><b>Starter titles for {industry}:</b> {missing.map((t) => t.name).join(", ")}.</p>
          <Button size="sm" className="mt-2" onClick={act(() => addRoles(companyId, missing), `Added ${missing.length} job title${missing.length === 1 ? "" : "s"}`)}>Add {missing.length === 1 ? "it" : `all ${missing.length}`}</Button>
        </div>
      )}
      <ul className="mt-4 flex flex-col gap-1.5">
        {sorted.map((r) => {
          const used = people.filter((p) => p.role_id === r.id).length;
          return (
            <li key={r.id} className="flex items-center gap-2 rounded-lg bg-surface shadow-card py-1.5 pl-3 pr-1 text-sm">
              <span className="min-w-0 flex-1"><b>{r.name}</b>{used > 0 && <span className="text-muted tabular-nums"> · {used}</span>}</span>
              <label className="flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold">
                <input type="checkbox" className="h-5 w-5" checked={r.presents} aria-label={`${r.name} gives talks`}
                  onChange={(e) => act(() => updateRole(companyId, r.id, { presents: e.target.checked }), null)()} />
                Gives talks
              </label>
              <button
                aria-label={`Remove ${r.name}`}
                className="h-11 w-11 shrink-0 rounded-full text-lg text-muted hover:text-warn-text"
                onClick={() => {
                  if (used) { setMsg(`${used} ${used === 1 ? "person has" : "people have"} the ${r.name} title. Change theirs first.`); return; }
                  setMsg(null);
                  act(() => deleteRole(companyId, r.id))();
                }}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
      {msg && <div className="mt-3"><Notice tone="error">{msg}</Notice></div>}
      <form
        className="mt-4 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          if (roles.some((r) => r.name.toLowerCase() === n.toLowerCase()) || n.toLowerCase() === NO_TITLE.toLowerCase()) { setMsg(`${n} is already a job title.`); return; }
          setMsg(null);
          act(async () => { await addRole(companyId, n, presents); setName(""); setPresents(false); })();
        }}
      >
        <div className="flex gap-2">
          <input aria-label="New job title" placeholder="Add a job title, like Estimator" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          <Button size="sm" type="submit">Add</Button>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5" checked={presents} onChange={(e) => setPresents(e.target.checked)} /> Gives talks</label>
      </form>
    </>
  );
}

function JobsitesTab({ companyId, company, jobsites, act }: { companyId: string; company: Membership["company"]; jobsites: Jobsite[]; act: Act }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [kind, setKind] = useState<Jobsite["kind"]>("site");
  const [fix, setFix] = useState<{ latitude: number; longitude: number; accuracyMeters: number } | null>(null);
  const [locating, setLocating] = useState<string | null>(null); // which form is waiting on GPS: "new" or a jobsite id
  const [msg, setMsg] = useState<string | null>(null);

  const locate = async (target: string): Promise<{ latitude: number; longitude: number; accuracyMeters: number } | null> => {
    setMsg(null);
    setLocating(target);
    try {
      return await getLocation();
    } catch (e) {
      setMsg(e instanceof LocationError ? e.message : String(e));
      return null;
    } finally {
      setLocating(null);
    }
  };

  return (
    <>
      <p className="text-sm text-muted">
        Add the places talks happen: jobsites, and your office or shop. Stand there and tap &quot;Use my location&quot; so the app can
        find the nearest one later. GPS is optional.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) { setMsg("Give the jobsite a name."); return; }
          act(async () => {
            await addJobsite(companyId, { name: n, kind, address: address.trim(), latitude: fix?.latitude ?? null, longitude: fix?.longitude ?? null });
            setName(""); setAddress(""); setFix(null); setMsg(null); setKind("site");
          })();
        }}
      >
        <Field label="Add a place" id="js-name">
          <input id="js-name" placeholder={kind === "office" ? "Name, like Main office or Shop" : "Name, like Smith reroof or Plant 2"} className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <KindToggle value={kind} onChange={setKind} />
        <input aria-label="Address" placeholder="Address (optional)" autoComplete="street-address" className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="ghost" type="button" disabled={locating !== null} onClick={async () => { const f = await locate("new"); if (f) setFix(f); }}>
            {locating === "new" ? "Finding you…" : fix ? "Update location" : "Use my location"}
          </Button>
          {fix && <span className="text-sm text-muted tabular-nums">GPS set · within {Math.round(fix.accuracyMeters * 3.28084)} ft</span>}
          <Button size="sm" type="submit" className="ml-auto">Add</Button>
        </div>
      </form>
      {msg && <div className="mt-3"><Notice tone="error">{msg}</Notice></div>}

      <GroupHeading aside={`${jobsites.length}`}>Active places</GroupHeading>
      {jobsites.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Nothing added yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {jobsites.map((j) => {
            const hasGps = j.latitude != null && j.longitude != null;
            return (
              <li key={j.id} className="flex flex-col gap-2 rounded-xl bg-surface shadow-card p-3">
                <input
                  aria-label="Jobsite name"
                  defaultValue={j.name}
                  className={`${inputClass} font-semibold`}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== j.name) act(() => updateJobsite(companyId, j.id, { name: v }))();
                    else e.target.value = j.name;
                  }}
                />
                <KindToggle value={j.kind ?? "site"} onChange={(k) => act(() => updateJobsite(companyId, j.id, { kind: k }))()} />
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-muted">Where the team works here (words the weather notes)</span>
                  <select
                    className={inputClass}
                    value={j.work_setting ?? ""}
                    onChange={(e) => act(() => updateJobsite(companyId, j.id, { work_setting: (e.target.value || null) as WorkSetting | null }))()}
                  >
                    <option value="">Company setting: {WORK_SETTINGS.find((w) => w.id === companyWorkSetting(company))?.name.toLowerCase()}</option>
                    {WORK_SETTINGS.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </label>
                <input
                  aria-label={`Address for ${j.name}`}
                  defaultValue={j.address}
                  placeholder="Address"
                  className={inputClass}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== j.address) act(() => updateJobsite(companyId, j.id, { address: v }))();
                  }}
                />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {hasGps ? (
                    <a className="font-semibold text-brand-text underline underline-offset-2" href={mapsLink({ latitude: j.latitude!, longitude: j.longitude! })} target="_blank" rel="noreferrer">
                      GPS set · open in Maps
                    </a>
                  ) : (
                    <span className="text-muted">No GPS point (optional)</span>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={locating !== null}
                    onClick={async () => {
                      const f = await locate(j.id);
                      if (f) act(() => updateJobsite(companyId, j.id, { latitude: f.latitude, longitude: f.longitude }))();
                    }}
                  >
                    {locating === j.id ? "Finding you…" : hasGps ? "Re-pin to my location" : "Pin to my location"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={async () => {
                    // A printable QR sticker for the site (src/lib/sticker.ts): scan it to pick this jobsite.
                    const origin = appWebAddress();
                    if (!origin) { setMsg("QR stickers need the app's web address. Set it once the website is live (NEXT_PUBLIC_APP_URL)."); return; }
                    try {
                      const blob = await jobsiteSticker(j, company.name, origin);
                      const res = await saveFile(`QR sticker - ${j.name}.pdf`, blob);
                      if (res !== "canceled") toast("QR sticker ready to print");
                    } catch (e) { setMsg(e instanceof Error ? e.message : String(e)); }
                  }}>QR sticker</Button>
                  <span className="ml-auto"><Button size="sm" variant="ghost" onClick={act(async () => {
                    await deactivateJobsite(companyId, j.id);
                    toast(`${j.name} removed`, { action: { label: "Undo", run: act(() => updateJobsite(companyId, j.id, { active: true }), `${j.name} is back`) } });
                  }, null)}>Remove</Button></span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted">Removing a place hides it from new talks. Past records keep it.</p>
    </>
  );
}

function KindToggle({ value, onChange }: { value: Jobsite["kind"]; onChange: (k: Jobsite["kind"]) => void }) {
  const opt = (k: Jobsite["kind"], label: string) => (
    <button
      type="button"
      aria-pressed={value === k}
      onClick={() => value !== k && onChange(k)}
      className={`rounded-full border px-3 py-1 text-sm font-semibold ${value === k ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface"}`}
    >
      {label}
    </button>
  );
  return <div className="flex gap-1.5" role="group" aria-label="Kind of place">{opt("site", "Jobsite")}{opt("office", "Office or shop")}</div>;
}

// Which talks the plan draws from (src/components/TalkPicker.tsx). The plan hook is the same one every screen uses.
function TalksTab({ m }: { m: Membership }) {
  const { input, lists, reload } = usePlan(m.company);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  // A fresh picker whenever the saved lists change (loaded, saved, undone), so its checkboxes match what's saved.
  return (
    <>
      <OwnTalks companyId={m.company.id} company={m.company} />
      <div className="mt-6">
        <GroupHeading>Talks in your plan</GroupHeading>
        <div className="mt-2">
          <TalkPicker key={JSON.stringify(lists)} companyId={m.company.id} industry={m.company.industry} input={input} lists={lists}
            reload={reload} msg={msg} setMsg={setMsg} />
        </div>
      </div>
    </>
  );
}

// The weekly plan. One talk per week for the whole company; every crew gives the same one. An admin can swap a
// week's talk until the week is over or someone has given it. The database enforces the same lock.
function PlanTab({ m }: { m: Membership }) {
  const co = m.company;
  const { plan, week, input, cadences, repeats, reload } = usePlan(co);
  const findTalk = useTalkLookup();
  const ownTalks = useTalks().filter((t) => isOwnTalk(t.id));
  // What the plan itself gives each week, before any swap: picking that talk again removes the swap.
  const planned = useMemo(() => new Map(buildPlan({ ...input, overrides: {} }).map((w) => [w.key, w.talkId])), [input]);
  const [recorded, setRecorded] = useState<string[] | null>(null);
  const [msg, setMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const [cadenceMsg, setCadenceMsg] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const thisMonday = isoDay(mondayOf(new Date()));
  // The current talk period can have started before this Monday (every 2 or 4 weeks).
  const from = week?.key ?? thisMonday;

  useEffect(() => {
    let live = true;
    listRecordedWeeks(co.id, from)
      .then((w) => live && setRecorded(w))
      .catch((e) => live && setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) }));
    return () => { live = false; };
  }, [co.id, from, version]);

  const title = (id: string) => findTalk(id)?.content.en.title ?? id;
  // A week can take any talk in the plan, any of the company's own talks, or keep the one it has.
  const choices = (key: string, current: string) => {
    const inPlan = talksInPlan(input, key);
    const own = ownTalks.filter((t) => !inPlan.some((x) => x.id === t.id));
    const keep = [...inPlan, ...own].some((t) => t.id === current) ? [] : [{ id: current, title: title(current) }];
    return { inPlan, own, keep };
  };
  const weeks = plan.filter((w) => isoDay(periodEnd(w)) > thisMonday);
  const unit = plan.some((w) => w.weeks > 1) ? "talk period" : "week";

  const change = async (key: string, talkId: string, planned: string) => {
    setBusy(key);
    setMsg(null);
    try {
      if (talkId === planned) await clearOverride(co.id, key);
      else await setOverride(co.id, key, talkId);
      reload();
      const w = plan.find((x) => x.key === key);
      setMsg({ tone: "ok", text: `${w ? periodLabel(w.monday, w.weeks) : weekLabel(parseDay(key))}: ${title(talkId)}${talkId === planned ? " (back to the plan)" : ""}.` });
    } catch (e) {
      setMsg({ tone: "error", text: e instanceof Error ? e.message : String(e) });
    }
    setVersion((v) => v + 1);
    setBusy(null);
  };

  if (!recorded) return msg ? <Notice tone="error">{msg.text}</Notice> : <Loading />;
  return (
    <>
      <CadencePicker key={JSON.stringify(cadences)} companyId={co.id} industry={co.industry} state={climateFor(co.zip).state}
        input={input} cadences={cadences} reload={reload} msg={cadenceMsg} setMsg={setCadenceMsg} />
      <RepeatPicker companyId={co.id} input={input} repeats={repeats} reload={reload} />
      <p className="mt-4 text-sm text-muted">
        Every team gives the same talk each {unit}, as many times as needed. You can swap a {unit}&apos;s talk until someone
        gives it; then it&apos;s locked. Missed talks are made up from Home.
      </p>
      {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      <ul className="mt-4 flex flex-col gap-2">
        {weeks.map((w) => {
          const locked = !canChangeWeek(w.key, recorded, new Date(), w.weeks);
          const base = planned.get(w.key) ?? w.talkId;
          const isNow = week?.key === w.key;
          return (
            <li key={w.key} className={`rounded-lg border p-3 ${isNow ? "border-brand bg-surface" : "border-line bg-surface"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <b>{weekNumbers(w)} · {periodLabel(w.monday, w.weeks)}</b>
                <span className="flex gap-1.5">
                  {isNow && <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-text">{w.weeks > 1 ? "Now" : "This week"}</span>}
                  {locked && <span className="rounded bg-fg px-2 py-0.5 text-xs font-semibold text-bg">Given · locked</span>}
                  {!locked && w.changed && <span className="rounded border border-line px-2 py-0.5 text-xs font-semibold">Swapped</span>}
                </span>
              </div>
              {locked ? (
                <p className="mt-1 font-semibold">{title(w.talkId)}</p>
              ) : (
                <select
                  aria-label={`Talk for ${weekNumbers(w).toLowerCase()}`}
                  className={`${inputClass} mt-2`}
                  value={w.talkId}
                  disabled={busy !== null}
                  onChange={(e) => change(w.key, e.target.value, base)}
                >
                  {(() => {
                    const c = choices(w.key, w.talkId);
                    const opt = (t: { id: string; content: { en: { title: string } } }) => <option key={t.id} value={t.id}>{t.content.en.title}{t.id === base ? " (planned)" : ""}</option>;
                    return (
                      <>
                        {c.keep.map((k) => <option key={k.id} value={k.id}>{k.title}</option>)}
                        {c.own.length > 0 ? <optgroup label="In your plan">{c.inPlan.map(opt)}</optgroup> : c.inPlan.map(opt)}
                        {c.own.length > 0 && <optgroup label="Your own talks">{c.own.map(opt)}</optgroup>}
                      </>
                    );
                  })()}
                </select>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

/** Admin → Company: daily pre-task plans on or off (src/core/pretask.ts). Separate from the weekly talk. */
function DailyToggle({ companyId, on, refresh }: { companyId: string; on: boolean; refresh: () => Promise<void> | void }) {
  const [value, setValue] = useState(on);
  return (
    <section className="mt-6 rounded-lg bg-surface shadow-card p-3">
      <label className="flex min-h-11 items-start justify-between gap-3">
        <span>
          <b className="block">Daily pre-task plans</b>
          <small className="block text-muted">Teams plan the day before work: tasks, hazards and controls, PPE, equipment reminders, emergency plan, and everyone signs. Kept as their own records. They never count toward the weekly talk.</small>
        </span>
        <input type="checkbox" className="mt-1 size-6 shrink-0 accent-[var(--brand)]" checked={value}
          onChange={async (e) => {
            const next = e.target.checked;
            setValue(next);
            try { await updateCompany(companyId, { daily_enabled: next }); await refresh(); toast(next ? "Daily pre-task plans are on" : "Daily pre-task plans are off"); }
            catch (err) { setValue(!next); toast(err instanceof Error ? err.message : String(err), { tone: "error" }); }
          }} />
      </label>
    </section>
  );
}
