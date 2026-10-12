"use client";

// Trainer portal (/trainer/): for an outside trainer a company invited. Shows each company that invited this email
// and the people it gave the trainer (name and job title only). The trainer sends in a card for a person; it waits until
// the company's owner or admin approves it. Nothing else of the company is visible here. Data: src/lib/data/trainers.ts.
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { groupRoster, sortSubmissions, SUBMISSION_LABEL, type RosterCompany, type Submission } from "@/core/trainers";
import { certTypeName } from "@/content/certTypes";
import { myTrainerRoster, mySubmissions, submitCert } from "@/lib/data/trainers";
import { discardCard, flushCards, onCardOutboxChange, saveCard, waitingCards, type QueuedCard } from "@/lib/cardOutbox";
import { useSession } from "@/lib/session";
import { trainerClients } from "@/lib/data/partnerClients";
import { trainerTotals, type TrainerClient } from "@/core/partnerClients";
import { InviteLinkPanel, MoveToOrg, OrgPanel, useOrgs } from "@/components/PartnerTools";
import { FindCompanies, PartnerPlanPanel, TrainerCertificates, TrainerClasses, usePartnerAccount } from "@/components/TrainerTools";
import { CardForm } from "@/components/CardForm";
import { CourseManager, useTrainingsFor } from "@/components/OwnCourses";
import { myOwnCourses, type TrainingCourse } from "@/core/courses";
import { myTrainerCourses } from "@/lib/data/courses";
import { NotConfigured } from "@/components/Guard";
import { Button, ConfirmButton, ErrorNotice, Eyebrow, GroupHeading, Loading, Notice, Sheet, Shell, Title } from "@/components/ui";
import { toast } from "@/components/toast";

const day = (iso: string | null) => (iso ? new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");
const TONE = { pending: "text-caution-text", approved: "text-ok", declined: "text-warn-text" } as const;

export default function TrainerPage() {
  const s = useSession();
  const router = useRouter();
  useEffect(() => { if (s.status === "signed-out") router.replace("/sign-in/"); }, [s.status, router]);
  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status !== "signed-in") return <Shell tabs={false}><Loading /></Shell>;
  return <Portal userId={s.user?.id ?? null} email={s.user?.email ?? ""} member={s.memberships.length > 0} partner={s.partner} signOut={s.signOut} />;
}

function Portal({ userId, email, member, partner, signOut }: { userId: string | null; email: string; member: boolean; partner: boolean; signOut: () => Promise<void> }) {
  const [roster, setRoster] = useState<RosterCompany[] | null>(null);
  const [clients, setClients] = useState<TrainerClient[]>([]);
  const { orgs, reload: reloadOrgs } = useOrgs("training");
  const { account, credits } = usePartnerAccount("trainer");
  const [tab, setTab] = useState<"clients" | "classes" | "trainings" | "certificates" | "find" | "account">("clients");
  const [courseList, setCourseList] = useState<TrainingCourse[]>([]);
  const [courseTick, setCourseTick] = useState(0);
  useEffect(() => { let live = true; myTrainerCourses().then((c) => live && setCourseList(c)).catch(() => live && setCourseList([])); return () => { live = false; }; }, [courseTick]);
  const ownCourses = myOwnCourses(courseList, userId ?? "", orgs.map((o) => o.id));
  const mine = ownCourses.map((c) => c.code);
  const [sent, setSent] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<{ co: RosterCompany; person: RosterCompany["people"][number] } | null>(null);
  const load = useCallback(() => {
    Promise.all([myTrainerRoster(), mySubmissions(), trainerClients().catch(() => [] as TrainerClient[])])
      .then(([r, s, c]) => { setRoster(groupRoster(r)); setSent(s); setClients(c); setError(null); })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);
  useEffect(load, [load]);

  // Cards saved on this phone (no signal when they were sent). Sent again when the page opens and when signal returns.
  const [waiting, setWaiting] = useState<QueuedCard[]>(() => waitingCards(userId));
  const [sending, setSending] = useState(false);
  const sendWaiting = useCallback(async () => {
    setSending(true);
    const r = await flushCards(userId, (c, file) => submitCert(c.companyId, c.trainerId, c.cert, file, c.clientId));
    setSending(false);
    if (r.sent) load();
    return r;
  }, [userId, load]);
  useEffect(() => {
    const off = onCardOutboxChange(() => setWaiting(waitingCards(userId)));
    const first = setTimeout(() => { void sendWaiting(); }, 0);
    const online = () => { void sendWaiting(); };
    window.addEventListener("online", online);
    return () => { off(); clearTimeout(first); window.removeEventListener("online", online); };
  }, [userId, sendWaiting]);

  if (error) return <Shell tabs={false}><ErrorNotice what="Couldn't load the trainer portal." detail={error} onRetry={load} /></Shell>;
  if (!roster) return <Shell tabs={false}><Loading /></Shell>;
  const personName = (companyId: string, id: string) => roster.find((c) => c.companyId === companyId)?.people.find((p) => p.id === id)?.name ?? "Someone no longer shared with you";
  const companyName = (id: string) => roster.find((c) => c.companyId === id)?.companyName ?? "";

  return (
    <Shell tabs={false}>
      <Eyebrow>Trainer · {email}</Eyebrow>
      <Title>Trainer portal</Title>
      <p className="mt-1 text-sm text-muted">Send in training cards for the people each company shared with you. A card counts once the company approves it.</p>
      <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
        {member && <Link href="/" className="underline">← Back to your company</Link>}
        {partner && <Link href="/partner/" className="underline">Partner portal</Link>}
      </div>
      <div role="tablist" aria-label="Trainer sections" className="mt-4 flex flex-wrap gap-2">
        {([["clients", "Clients"], ["classes", "Classes"], ["trainings", "Your trainings"], ["certificates", "Certificates"], ["find", "Find companies"], ["account", "Your account"]] as const).map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
            className={`min-h-11 rounded-full border px-3.5 text-[15px] font-semibold ${tab === id ? "border-brand bg-brand text-brand-ink" : "border-line bg-surface text-fg"}`}>{label}</button>
        ))}
      </div>
      {tab === "classes" && <TrainerClasses roster={roster} onChanged={load} mine={mine} />}
      {tab === "trainings" && <>
        <CourseManager ownerKind="me" owner={null} courses={ownCourses.filter((c) => c.owner_user === userId)} canEdit reload={() => setCourseTick((t) => t + 1)}
          intro="Trainings you made that aren't on the common list: a manufacturer's install course, an equipment checkout, your own class. Give them to any client: in a class, or by sending a card. Each card carries the training's name, and the client approves it like any other card." />
        {orgs.map((o) => {
          const admin = o.members.some((m) => m.email === email.toLowerCase() && m.role === "admin");
          return <CourseManager key={o.id} ownerKind="org" owner={o.id} heading={`${o.name} trainings`} courses={ownCourses.filter((c) => c.owner_org === o.id)} canEdit={admin} reload={() => setCourseTick((t) => t + 1)}
            intro={`Shared by everyone in ${o.name}. Staff give them to clients that are in the organization's shared list.${admin ? "" : " Only the organization's admins make or change them."}`} />;
        })}
      </>}
      {tab === "certificates" && <TrainerCertificates />}
      {tab === "find" && <FindCompanies account={account} myName={orgs[0]?.name ?? ""} />}
      {tab === "account" && (
        <>
          <PartnerPlanPanel kind="trainer" account={account} credits={credits} />
          <OrgPanel kind="training" orgs={orgs} reload={() => { reloadOrgs(); load(); }} myEmail={email} />
          <InviteLinkPanel kind="training" defaultName={email} orgs={orgs} />
        </>
      )}
      {tab === "clients" && <>

      {waiting.length > 0 && (
        <section aria-label="Saved on this phone" className="mt-4">
          <Notice tone="caution">
            <b>{waiting.length === 1 ? "1 card is" : `${waiting.length} cards are`} saved on this phone, waiting for signal.</b> They send by themselves when the connection is back.
          </Notice>
          <ul className="mt-2 flex flex-col gap-1.5">
            {waiting.map((c) => (
              <li key={c.clientId} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm">
                <span className="min-w-0"><b className="block truncate">{c.label}</b>{c.lastError && <small className="block text-warn-text">Last try: {c.lastError}</small>}</span>
                <ConfirmButton label="Don't send" onConfirm={() => discardCard(c.clientId)} />
              </li>
            ))}
          </ul>
          <Button size="sm" variant="ghost" className="mt-2" disabled={sending} onClick={() => sendWaiting()}>{sending ? "Sending…" : "Send now"}</Button>
        </section>
      )}

      {clients.length > 0 && (() => { const t = trainerTotals(clients); return (
        <section aria-label="Your clients" className="mt-4">
          <GroupHeading aside={`${t.clients}`}>Your clients</GroupHeading>
          <p className="mt-1 text-sm text-muted">{t.people} {t.people === 1 ? "person" : "people"} shared with you · {t.waiting} {t.waiting === 1 ? "card" : "cards"} waiting for approval{t.declined ? ` · ${t.declined} declined` : ""}</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {clients.map((c) => (
              <li key={c.link_id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2 text-sm shadow-card">
                <span className="min-w-0"><b className="block">{c.company_name}</b><small className="text-muted tabular-nums">{c.people} shared · {c.waiting} waiting · {c.approved} approved{c.declined ? ` · ${c.declined} declined` : ""}{c.org_name ? ` · ${c.org_name}` : ""}</small></span>
                {c.mine && <MoveToOrg kind="trainer" linkId={c.link_id} current={c.org_id} orgs={orgs} onMoved={load} />}
              </li>
            ))}
          </ul>
        </section>); })()}

      {roster.length === 0 && <div className="mt-4"><Notice>No company has invited {email || "this email"} as a trainer yet, or access was ended. Ask the company to invite this email in Admin → Training.</Notice></div>}
      {roster.map((co) => (
        <section key={co.companyId} aria-label={co.companyName}>
          <GroupHeading aside={`${co.people.length}`}>{co.companyName}</GroupHeading>
          {co.people.length === 0 ? <p className="mt-2 text-sm text-muted">The company hasn&apos;t shared anyone with you yet.</p> : (
            <ul className="mt-3 flex flex-col gap-1.5">
              {co.people.map((p) => {
                const pending = sent.filter((x) => x.company_id === co.companyId && x.person_id === p.id && x.status === "pending").length;
                return (
                  <li key={p.id}>
                    <button className="flex w-full items-center justify-between gap-2 rounded-lg bg-surface px-3 py-2.5 text-left text-sm shadow-card" onClick={() => setOpen({ co, person: p })} aria-label={`Send a card for ${p.name}`}>
                      <span className="min-w-0"><b className="block truncate">{p.name}</b><small className="text-muted">{p.title || "Team member"}</small></span>
                      <small className="shrink-0 font-semibold text-brand-text">{pending ? `${pending} waiting · ` : ""}Send a card ›</small>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}

      {sent.length > 0 && (
        <section aria-label="Cards you sent">
          <GroupHeading aside={`${sent.length}`}>Cards you sent</GroupHeading>
          <ul className="mt-3 flex flex-col gap-1.5">
            {sortSubmissions(sent).map((x) => (
              <li key={x.id} className="rounded-lg bg-surface px-3 py-2 text-sm">
                <b>{certTypeName(x.cert_type, x.custom_name)}</b> for {personName(x.company_id, x.person_id)} <small className="text-muted">· {companyName(x.company_id)}</small>
                <small className={`block font-semibold ${TONE[x.status]}`}>{SUBMISSION_LABEL[x.status]}{x.status === "declined" ? `: ${x.decline_reason}` : ""}<span className="font-normal text-muted"> · sent {day(x.submitted_at)}</span></small>
              </li>
            ))}
          </ul>
        </section>
      )}

      </>}

      <div className="mt-8"><Button variant="ghost" onClick={() => signOut()}>Sign out</Button></div>
      <p className="mt-4 text-xs text-muted">You see only the names and job titles a company shares with you. Cards you send are kept by that company, even if your access ends.</p>

      {open && (
        <Sheet title={open.person.name} open onClose={() => setOpen(null)}>
          <p className="text-sm text-muted">{open.co.companyName}{open.person.title ? ` · ${open.person.title}` : ""}</p>
          <p className="mt-2 text-sm">Type the dates printed on the card. The company sees it as waiting until they approve it.</p>
          <TrainerCardForm companyId={open.co.companyId} mine={mine} onSave={async (c, file) => {
            // Saved on the phone first, so a dropped connection never loses it or sends it twice.
            const saved = await saveCard({ companyId: open.co.companyId, trainerId: open.co.trainerId, userId, cert: { personId: open.person.id, ...c },
              label: `${certTypeName(c.certType, c.customName, courseList)} for ${open.person.name}` }, file);
            await sendWaiting();
            const stillWaiting = waitingCards(userId).some((x) => x.clientId === saved.clientId);
            toast(stillWaiting ? "Saved on this phone. It sends when there's signal." : `Sent to ${open.co.companyName} for approval`);
          }} />
        </Sheet>
      )}
    </Shell>
  );
}

/** The card form for a client: the client's own trainings and this trainer's appear beside the common ones. */
function TrainerCardForm({ companyId, mine, onSave }: { companyId: string; mine: string[]; onSave: React.ComponentProps<typeof CardForm>["onSave"] }) {
  const courses = useTrainingsFor(companyId).filter((c) => c.owner_company === companyId || mine.includes(c.code));
  return <CardForm saveLabel="Send for approval" courses={courses} onSave={onSave} />;
}
