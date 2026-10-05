"use client";

// Gate for every signed-in screen: handles loading, missing setup, signed-out, and "no company yet".
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/session";
import { canAdmin, type Membership } from "@/lib/data/types";
import { Loading, Notice, Shell } from "./ui";

export function RequireCompany({ admin = false, children }: { admin?: boolean; children: (m: Membership) => React.ReactNode }) {
  const s = useSession();
  const router = useRouter();

  useEffect(() => {
    if (s.status === "signed-out") router.replace("/sign-in/");
    else if (s.status === "signed-in" && !s.error && s.memberships.length === 0) router.replace("/setup/");
  }, [s.status, s.error, s.memberships.length, router]);

  if (s.status === "not-configured") return <NotConfigured message={s.error} />;
  if (s.status === "signed-in" && s.error) {
    return (
      <Shell tabs={false}>
        <Notice tone="error">Couldn&apos;t load your company: {s.error}. Check your connection and reload.</Notice>
      </Shell>
    );
  }
  if (s.status !== "signed-in" || !s.current) return <Shell tabs={false}><Loading /></Shell>;
  if (admin && !canAdmin(s.current.access)) {
    return (
      <Shell tabs={false}>
        <Notice tone="error">Only owners and admins can change company setup. Ask your safety manager.</Notice>
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
