"use client";

// Home for an employee account (app role "employee", migration 0022): only their own talk history. They still sign
// at talks on the presenter's phone; this is where they can look back at what they attended. The database shows them
// nothing else of the company (no roster, no other people's signatures, no reports).
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/session";
import { myTalks, type MyTalk } from "@/lib/data/members";
import type { Membership } from "@/lib/data/types";
import { Button, ErrorNotice, Eyebrow, GroupHeading, Loading, Notice, Shell, Title } from "./ui";

const STATUS: Record<MyTalk["status"], { label: string; tone: string }> = {
  signed: { label: "Signed", tone: "bg-ok-bg text-ok-text" },
  not_signed: { label: "Not signed", tone: "bg-caution-bg text-caution-text" },
  absent: { label: "Absent", tone: "bg-line text-muted" },
};
const day = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

export function EmployeeHome({ m }: { m: Membership }) {
  const s = useSession();
  const co = m.company;
  const [talks, setTalks] = useState<MyTalk[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    myTalks(co.id).then((t) => live && setTalks(t)).catch((e) => live && setError(e instanceof Error ? e.message : String(e)));
    return () => { live = false; };
  }, [co.id, attempt]);

  const signed = talks?.filter((t) => t.status === "signed").length ?? 0;
  return (
    <Shell>
      {s.memberships.length > 1 && (
        <select aria-label="Company" className="rounded-full border border-line bg-surface px-3 py-1 text-sm font-semibold" value={co.id} onChange={(e) => s.setCurrent(e.target.value)}>
          {s.memberships.map((x) => <option key={x.company.id} value={x.company.id}>{x.company.name}</option>)}
        </select>
      )}
      <Eyebrow>{co.name}</Eyebrow>
      <Title>My safety talks</Title>
      <p className="mt-1 text-sm text-muted">Talks you were on, and whether you signed. You sign at each talk on the presenter&apos;s phone, the same as always.</p>

      {error ? (
        <div className="mt-4"><ErrorNotice what="Couldn't load your talks." detail={error} onRetry={() => { setError(null); setAttempt((a) => a + 1); }} /></div>
      ) : !talks ? <Loading /> : talks.length === 0 ? (
        <div className="mt-4"><Notice>No talks to show yet. If you&apos;ve been to talks, ask your admin to link your account to your name on the roster.</Notice></div>
      ) : (
        <>
          <p className="mt-4 text-sm tabular-nums"><b>{signed}</b> signed of <b>{talks.length}</b> talk{talks.length === 1 ? "" : "s"}.</p>
          <GroupHeading>History</GroupHeading>
          <ul className="mt-3 flex flex-col gap-2">
            {talks.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 rounded-xl bg-surface px-4 py-3">
                <span className="min-w-0">
                  <b className="block">{t.title}</b>
                  <small className="text-muted">{day(t.held_at)}{t.jobsite_name ? ` · ${t.jobsite_name}` : ""}</small>
                </span>
                <span className={`shrink-0 rounded px-2 py-0.5 font-display text-xs font-semibold ${STATUS[t.status].tone}`}>{STATUS[t.status].label}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-sm text-muted">
        <span>Signed in as {s.user?.email}</span>
        <div className="flex gap-2">
          <Link href="/setup/" className="rounded-md border border-line px-2.5 py-1.5 font-semibold text-fg">New company</Link>
          <Button size="sm" variant="ghost" onClick={() => s.signOut()}>Sign out</Button>
        </div>
      </div>
    </Shell>
  );
}
