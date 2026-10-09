"use client";

// Admin → App access: who can sign in to this company and what they can do (app roles, migration 0022). Separate from
// job titles: a Foreman can be a presenter, an office manager can be office, a roofer can be an employee who only sees
// their own talk history. Joining is by invite: the person signs in with the invited email and is added. No server.
import { useEffect, useState } from "react";
import { cancelInvite, inviteMember, listInvites, listMembers, removeMember, setMemberAccess, type Invite, type Member } from "@/lib/data/members";
import type { Access, Person } from "@/lib/data/types";
import { Button, ConfirmButton, Field, GroupHeading, Loading, Notice, inputClass } from "./ui";
import { toast } from "./toast";

export const APP_ROLES: { id: Access; name: string; does: string }[] = [
  { id: "owner", name: "Owner", does: "Everything, including who is an owner or admin." },
  { id: "admin", name: "Admin", does: "Company setup, people, plan, reports, safety log and safety profile." },
  { id: "presenter", name: "Presenter", does: "Gives talks and daily plans; sees records and this week's plan." },
  { id: "office", name: "Office", does: "Sees reports and records and works the issues list. Doesn't give talks or change setup." },
  { id: "employee", name: "Employee", does: "Sees only their own talk history. Signs at talks on the presenter's phone, as always." },
];
const roleName = (a: Access) => APP_ROLES.find((r) => r.id === a)?.name ?? a;

export function AppAccess({ companyId, myAccess, myUserId, people }: { companyId: string; myAccess: Access; myUserId: string | null; people: Person[] }) {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<Access>("presenter");
  const [personId, setPersonId] = useState("");
  const isOwner = myAccess === "owner";
  // Admins hand out the three staff roles; only owners make owners and admins (the database enforces this too).
  const grantable = APP_ROLES.filter((r) => isOwner || !["owner", "admin"].includes(r.id));
  const canChange = (a: Access) => isOwner || !["owner", "admin"].includes(a);

  useEffect(() => {
    let live = true;
    Promise.all([listMembers(companyId), listInvites(companyId)])
      .then(([m, i]) => { if (live) { setMembers(m); setInvites(i); setError(null); } })
      .catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [companyId, version]);

  const run = async (fn: () => Promise<void>, ok: string) => {
    try { await fn(); setVersion((v) => v + 1); toast(ok); setError(null); }
    catch (e) { const t = e instanceof Error ? e.message : String(e); setError(t); toast(t, { tone: "error" }); }
  };
  const invitedPeople = new Set(invites.map((i) => i.person_id).filter(Boolean));
  const linkable = people.filter((p) => !p.user_id && !invitedPeople.has(p.id)).sort((a, b) => a.full_name.localeCompare(b.full_name));
  const personName = (id: string | null) => people.find((p) => p.id === id)?.full_name;
  const validEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());

  if (!members) return error ? <Notice tone="error">{error}</Notice> : <Loading />;
  return (
    <>
      <p className="text-sm text-muted">Who can sign in to this company, and what they can do. This is separate from job titles. Team members don&apos;t need an account to sign at talks.</p>
      <ul className="mt-3 flex flex-col gap-1 text-sm">
        {APP_ROLES.map((r) => <li key={r.id}><b>{r.name}:</b> <span className="text-muted">{r.does}</span></li>)}
      </ul>
      {error && <div className="mt-3"><Notice tone="error">{error}</Notice></div>}

      <GroupHeading aside={`${members.length}`}>People with access</GroupHeading>
      <ul className="mt-3 flex flex-col gap-2">
        {members.map((mb) => {
          const me = mb.user_id === myUserId;
          const person = people.find((p) => p.user_id === mb.user_id);
          return (
            <li key={mb.user_id} className="rounded-lg border border-line bg-surface p-3 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0">
                  <b className="block truncate">{mb.email || "Account"}{me ? " (you)" : ""}</b>
                  {person && <small className="text-muted">On the roster as {person.full_name}</small>}
                </span>
                {canChange(mb.access) && !me ? (
                  <select aria-label={`App role for ${mb.email || "this account"}`} className={`${inputClass} w-auto py-2`} value={mb.access}
                    onChange={(e) => run(() => setMemberAccess(companyId, mb.user_id, e.target.value as Access), `Now ${roleName(e.target.value as Access).toLowerCase()}`)}>
                    {grantable.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                ) : (
                  <span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand-text">{roleName(mb.access)}</span>
                )}
              </div>
              {canChange(mb.access) && !me && (
                <div className="mt-2">
                  <ConfirmButton label="Remove access" onConfirm={() => run(() => removeMember(companyId, mb.user_id), "Access removed. Their records stay.")} />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {invites.length > 0 && (
        <>
          <GroupHeading aside={`${invites.length}`}>Waiting to sign in</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {invites.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                <span className="min-w-0"><b className="block truncate">{i.email}</b><small className="text-muted">{roleName(i.access)}{i.person_id ? ` · ${personName(i.person_id) ?? "roster person"}` : ""}</small></span>
                {canChange(i.access) && <Button size="sm" variant="ghost" onClick={() => run(() => cancelInvite(companyId, i.id), "Invite canceled")}>Cancel</Button>}
              </li>
            ))}
          </ul>
        </>
      )}

      <GroupHeading>Invite someone</GroupHeading>
      <form className="mt-3 flex flex-col gap-3 rounded-lg border border-dashed border-line bg-surface p-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!validEmail) return;
          const addr = email.trim().toLowerCase();
          void run(async () => { await inviteMember(companyId, addr, access, access === "employee" ? personId || null : null); setEmail(""); setPersonId(""); },
            `Invited ${addr}. They sign in with that email and land in your company.`);
        }}>
        <Field label="Email" id="inv-email"><input id="inv-email" type="email" inputMode="email" autoComplete="off" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="App role" id="inv-role">
          <select id="inv-role" className={inputClass} value={access} onChange={(e) => setAccess(e.target.value as Access)}>
            {grantable.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </Field>
        {access === "employee" && (
          <Field label="Who they are on the roster" id="inv-person" hint="so they see their own talks">
            <select id="inv-person" className={inputClass} value={personId} onChange={(e) => setPersonId(e.target.value)}>
              <option value="">Choose a person</option>
              {linkable.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
            </select>
          </Field>
        )}
        <Button size="sm" type="submit" disabled={!validEmail || (access === "employee" && !personId)}>Send invite</Button>
        <p className="text-xs text-muted">No email is sent from the app. Tell them to open the app and sign in with this email; they&apos;re added the moment they do.</p>
      </form>
    </>
  );
}
