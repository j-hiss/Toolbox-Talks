"use client";

// First-time setup: a signed-in user with no company creates one and becomes its owner.
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { createCompany } from "@/lib/data/company";
import { CompanyForm, blankCompany } from "@/components/CompanyForm";
import { NotConfigured } from "@/components/Guard";
import { Eyebrow, Loading, NavLink, Shell, Title } from "@/components/ui";

export default function Setup() {
  const s = useSession();
  const router = useRouter();

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
      <CompanyForm
        initial={blankCompany()}
        submitLabel="Create company"
        onSubmit={async (c) => {
          const id = await createCompany(c);
          await s.refresh();
          s.setCurrent(id);
          router.replace("/admin/#people");
        }}
      />
    </Shell>
  );
}
