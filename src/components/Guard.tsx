"use client";

// Gate for every signed-in screen: handles loading, missing setup, signed-out, and "no company yet".
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { holdScan } from "@/lib/scan";
import { canAdmin, canPresent, canReport, isStaff, type Access, type Membership } from "@/lib/data/types";
import { Loading, Notice, Shell } from "./ui";

// What a screen needs (app roles, migration 0022). `admin` is the older spelling of need="admin".
type Need = "admin" | "present" | "report" | "staff";
const ALLOWED: Record<Need, (a: Access) => boolean> = { admin: canAdmin, present: canPresent, report: canReport, staff: isStaff };
const REFUSED: Record<Need, string> = {
  admin: "Only owners and admins can change company setup. Ask your safety manager.",
  present: "Your app access doesn't include giving talks. Ask an admin if you need it.",
  report: "Reports are for owners, admins and office staff. Ask an admin if you need them.",
  staff: "This part of the app is for your company's staff. Your own talk history is on Home.",
};

export function RequireCompany({ admin = false, need, children }: { admin?: boolean; need?: Need; children: (m: Membership) => React.ReactNode }) {
  const s = useSession();
  const router = useRouter();

  useEffect(() => {
    if (s.status === "signed-out") { holdScan(); router.replace("/sign-in/"); }
    else if (s.status === "signed-in" && !s.error && s.memberships.length === 0) router.replace(s.trainer ? "/trainer/" : s.partner ? "/partner/" : "/setup/");
  }, [s.status, s.error, s.memberships.length, s.trainer, s.partner, router]);

  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status === "signed-in" && s.error) {
    return (
      <Shell tabs={false}>
        <Notice tone="error">Couldn&apos;t load your company: {s.error}. Check your connection and reload.</Notice>
      </Shell>
    );
  }
  if (s.status !== "signed-in" || !s.current) return <Shell tabs={false}><Loading /></Shell>;
  const n: Need | undefined = need ?? (admin ? "admin" : undefined);
  if (n && !ALLOWED[n](s.current.access)) {
    return (
      <Shell>
        <Notice tone="error">{REFUSED[n]}</Notice>
      </Shell>
    );
  }
  return <>{children(s.current)}</>;
}

export function NotConfigured({ message }: { message: string | null }) {
  return (
    <Shell tabs={false}>
      <Notice tone="error">
        <p className="font-semibold">The app isn&apos;t connected to a database yet.</p>
        <p className="mt-1">{message}</p>
        <p className="mt-2">On your Mac: run <code>npm run db:start</code>, then <code>npx supabase status</code>, copy the API URL and anon key into <code>.env.local</code>, and restart <code>npm run dev</code>.</p>
      </Notice>
    </Shell>
  );
}
