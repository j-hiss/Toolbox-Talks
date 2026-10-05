"use client";

// Admin setup: people, teams, jobsites, the roles that can give talks, and company info. Owners and admins only.
import { useEffect, useState, useSyncExternalStore } from "react";
import { useSession } from "@/lib/session";
import {
  addJobsite, addPerson, addRole, addTeam, deactivateJobsite, deactivatePerson, deleteRole, deleteTeam, listJobsites,
  listPeople, listRoles, listTeams, updateCompany, updateJobsite, updatePerson, updateTeam,
} from "@/lib/data/company";
import type { Jobsite, Membership, Person, Role, Team } from "@/lib/data/types";
import { getLocation, LocationError } from "@/lib/location";
import { mapsLink } from "@/core/geo";
import { RequireCompany } from "@/components/Guard";
import { CompanyForm } from "@/components/CompanyForm";
import { Button, ConfirmButton, Eyebrow, Field, GroupHeading, Loading, NavLink, Notice, Shell, Title, inputClass } from "@/components/ui";

const TABS = [
  { id: "people", label: "People" },
  { id: "teams", label: "Teams" },
  { id: "jobsites", label: "Jobsites" },
  { id: "roles", label: "Roles" },
  { id: "company", label: "Company" },
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

  /** Run a change, then reload. Errors show at the top instead of failing silently. */
  const act = (fn: () => Promise<void>) => async () => {
    try { await fn(); setVersion((v) => v + 1); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
  };

  return (
    <Shell nav={<NavLink href="/">Done</NavLink>}>
      <Eyebrow>Admin · {m.company.name}</Eyebrow>
      <Title>Company setup</Title>

      <div role="tablist" className="mt-4 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-[3px] px-3.5 py-2 font-display text-lg font-bold uppercase tracking-wide ${tab === t.id ? "border-hivis text-fg" : "border-transparent text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <div className="mt-4"><Notice tone="error">{error}</Notice></div>}

      <div className="mt-5">
        {tab === "company" ? (
          <CompanyForm
            initial={{ ...m.company }}
            submitLabel="Save company info"
            onSubmit={async (c) => { await updateCompany(companyId, c); await s.refresh(); }}
          />
        ) : !roles || !teams || !people || !jobsites ? (
          <Loading />
        ) : tab === "people" ? (
          <PeopleTab companyId={companyId} people={people} roles={roles} teams={teams} act={act} />
        ) : tab === "teams" ? (
          <TeamsTab companyId={companyId} people={people} teams={teams} act={act} />
        ) : tab === "jobsites" ? (
          <JobsitesTab companyId={companyId} jobsites={jobsites} act={act} />
        ) : (
          <RolesTab companyId={companyId} people={people} roles={roles} act={act} />
        )}
      </div>
    </Shell>
  );
}

type Act = (fn: () => Promise<void>) => () => Promise<void>;
const CREW = "";

function PeopleTab({ companyId, people, roles, teams, act }: { companyId: string; people: Person[]; roles: Role[]; teams: Team[]; act: Act }) {
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState(CREW);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const roleOptions = <><option value={CREW}>Crew member</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</>;
  const teamOptions = <><option value="">No team</option>{teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</>;

  return (
    <>
      <p className="text-sm text-muted">Crew members sign in at talks. Everyone with another role can also give talks. Spreadsheet import is coming.</p>
      <form
        className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          act(async () => { await addPerson(companyId, { full_name: n, role_id: roleId || null, team_id: teamId || null }); setName(""); })();
        }}
      >
        <Field label="Add a person" id="np-name">
          <input id="np-name" placeholder="Full name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Role" className={`${inputClass} flex-1 basis-36`} value={roleId} onChange={(e) => setRoleId(e.target.value)}>{roleOptions}</select>
          <select aria-label="Team" className={`${inputClass} flex-1 basis-36`} value={teamId} onChange={(e) => setTeamId(e.target.value)}>{teamOptions}</select>
          <Button size="sm" type="submit">Add person</Button>
        </div>
      </form>

      <GroupHeading aside={`${people.length} ${people.length === 1 ? "person" : "people"}`}>Everyone</GroupHeading>
      {people.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No one yet. Add your crew above.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {people.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-3">
              <input
                aria-label="Name"
                defaultValue={p.full_name}
                className={`${inputClass} font-bold`}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v && v !== p.full_name) act(() => updatePerson(companyId, p.id, { full_name: v }))();
                  else e.target.value = p.full_name;
                }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <select aria-label={`Role for ${p.full_name}`} className={`${inputClass} flex-1 basis-36`} value={p.role_id ?? CREW} onChange={(e) => act(() => updatePerson(companyId, p.id, { role_id: e.target.value || null }))()}>{roleOptions}</select>
                <select aria-label={`Team for ${p.full_name}`} className={`${inputClass} flex-1 basis-36`} value={p.team_id ?? ""} onChange={(e) => act(() => updatePerson(companyId, p.id, { team_id: e.target.value || null }))()}>{teamOptions}</select>
                <ConfirmButton label="Remove" confirmLabel="Confirm" onConfirm={act(() => deactivatePerson(companyId, p.id))} />
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted">Removing someone takes them off rosters. Their past signed records stay.</p>
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
              <li key={t.id} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-3">
                <input
                  aria-label="Team name"
                  defaultValue={t.name}
                  className={`${inputClass} font-bold`}
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

function RolesTab({ companyId, people, roles, act }: { companyId: string; people: Person[]; roles: Role[]; act: Act }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <>
      <p className="text-sm text-muted">Anyone with one of these roles appears in the &quot;Presented by&quot; list. &quot;Crew member&quot; is always there and signs only.</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {roles.map((r) => {
          const used = people.filter((p) => p.role_id === r.id).length;
          return (
            <li key={r.id} className="inline-flex items-center gap-1 rounded-full border border-line bg-surface py-1 pl-3 pr-1 text-sm font-bold">
              {r.name}
              {used > 0 && <span className="font-normal text-muted tabular-nums">· {used}</span>}
              <button
                aria-label={`Remove ${r.name}`}
                className="h-8 w-8 rounded-full text-lg text-muted hover:text-warn"
                onClick={() => {
                  if (used) { setMsg(`${used} ${used === 1 ? "person has" : "people have"} the ${r.name} role. Change their role first.`); return; }
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
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) return;
          if (roles.some((r) => r.name.toLowerCase() === n.toLowerCase()) || n.toLowerCase() === "crew member") { setMsg(`${n} is already a role.`); return; }
          setMsg(null);
          act(async () => { await addRole(companyId, n); setName(""); })();
        }}
      >
        <input aria-label="New role" placeholder="Add a role, like Project Manager" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        <Button size="sm" type="submit">Add</Button>
      </form>
    </>
  );
}

function JobsitesTab({ companyId, jobsites, act }: { companyId: string; jobsites: Jobsite[]; act: Act }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
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
        Add the places your crews work. Stand on site and tap &quot;Use my location&quot; so the app can find the nearest jobsite later.
      </p>
      <form
        className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          const n = name.trim();
          if (!n) { setMsg("Give the jobsite a name."); return; }
          act(async () => {
            await addJobsite(companyId, { name: n, address: address.trim(), latitude: fix?.latitude ?? null, longitude: fix?.longitude ?? null });
            setName(""); setAddress(""); setFix(null); setMsg(null);
          })();
        }}
      >
        <Field label="Add a jobsite" id="js-name">
          <input id="js-name" placeholder="Name, like Smith reroof or Plant 2" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <input aria-label="Address" placeholder="Address (optional)" autoComplete="street-address" className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="ghost" type="button" disabled={locating !== null} onClick={async () => { const f = await locate("new"); if (f) setFix(f); }}>
            {locating === "new" ? "Finding you…" : fix ? "Update location" : "Use my location"}
          </Button>
          {fix && <span className="text-sm text-muted tabular-nums">GPS set · within {Math.round(fix.accuracyMeters * 3.28084)} ft</span>}
          <Button size="sm" type="submit" className="ml-auto">Add jobsite</Button>
        </div>
      </form>
      {msg && <div className="mt-3"><Notice tone="error">{msg}</Notice></div>}

      <GroupHeading aside={`${jobsites.length}`}>Active jobsites</GroupHeading>
      {jobsites.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No jobsites yet.</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {jobsites.map((j) => {
            const hasGps = j.latitude != null && j.longitude != null;
            return (
              <li key={j.id} className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-3">
                <input
                  aria-label="Jobsite name"
                  defaultValue={j.name}
                  className={`${inputClass} font-bold`}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v && v !== j.name) act(() => updateJobsite(companyId, j.id, { name: v }))();
                    else e.target.value = j.name;
                  }}
                />
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
                    <a className="font-bold underline" href={mapsLink({ latitude: j.latitude!, longitude: j.longitude! })} target="_blank" rel="noreferrer">
                      GPS set · open in Maps
                    </a>
                  ) : (
                    <span className="text-warn font-bold">No GPS point yet</span>
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
                  <span className="ml-auto"><ConfirmButton label="Remove" confirmLabel="Confirm" onConfirm={act(() => deactivateJobsite(companyId, j.id))} /></span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted">Removing a jobsite hides it from new talks. Past records keep it.</p>
    </>
  );
}
