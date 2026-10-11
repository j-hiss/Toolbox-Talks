"use client";

// First-time setup: a signed-in user with no company creates one and becomes its owner.
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { addRoles, createCompany, listRoles } from "@/lib/data/company";
import { missingStarterTitles } from "@/content/jobTitles";
import { CompanyForm, blankCompany } from "@/components/CompanyForm";
import { NotConfigured } from "@/components/Guard";
import { Eyebrow, Loading, NavLink, Notice, Shell, Title } from "@/components/ui";
import { recordStoredReferral, useReferralFromLink } from "@/components/ReferralOffer";

export default function Setup() {
  const s = useSession();
  const router = useRouter();
  const ref = useReferralFromLink();

  useEffect(() => {
    if (s.status === "signed-out") router.replace("/sign-in/");
  }, [s.status, router]);

  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status !== "signed-in") return <Shell tabs={false}><Loading /></Shell>;

  return (
    <Shell tabs={false} nav={s.memberships.length ? <NavLink href="/">Cancel</NavLink> : undefined}>
      <Eyebrow>Set up</Eyebrow>
      <Title>Your company</Title>
      <p className="mt-2 mb-5 text-muted">
        This prints at the top of every signed record. You can change any of it later in Admin.
      </p>
      {ref && <div className="mb-5"><Notice>Recommended by <b>{ref.name}</b>. After setup you can add them as your {ref.kind === "training" ? "trainer" : "insurance partner"}; nothing is shared until you choose.</Notice></div>}
      <CompanyForm
        initial={blankCompany()}
        submitLabel="Create company"
        onSubmit={async (c) => {
          const id = await createCompany(c);
          await recordStoredReferral(id);
          // The industry's starter job titles. Not essential: if this fails, Admin → Job titles offers them again.
          try { await addRoles(id, missingStarterTitles(c.industry, await listRoles(id))); } catch { /* offered later */ }
          await s.refresh();
          s.setCurrent(id);
          router.replace("/admin/#people");
        }}
      />
    </Shell>
  );
}
