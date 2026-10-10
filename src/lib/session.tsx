"use client";

// Who is signed in, which companies they belong to, and which one they're working in.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { myMemberships } from "@/lib/data/company";
import { acceptInvites } from "@/lib/data/members";
import { amTrainer } from "@/lib/data/trainers";
import { amPartner } from "@/lib/data/partners";
import { setOutboxUser } from "@/lib/outbox";
import type { Membership } from "@/lib/data/types";

type SessionState = {
  status: "loading" | "signed-out" | "signed-in" | "not-configured";
  user: User | null;
  memberships: Membership[];
  /** Trainer for at least one company (trainer portal, migration 0026). A trainer isn't a member. */
  trainer: boolean;
  /** Insurance partner of at least one company (pilot, migration 0027). Not a member. */
  partner: boolean;
  current: Membership | null;
  error: string | null;
  setCurrent: (companyId: string) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);
const CURRENT_KEY = "tt-current-company";

function readCurrentId(): string | null {
  try { return localStorage.getItem(CURRENT_KEY); } catch { return null; }
}
function writeCurrentId(id: string) {
  try { localStorage.setItem(CURRENT_KEY, id); } catch { /* private mode: fine, just not remembered */ }
}

function configProblem(): string | null {
  try {
    supabase();
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [configError] = useState(configProblem);
  const [status, setStatus] = useState<SessionState["status"]>(configError ? "not-configured" : "loading");
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [trainer, setTrainer] = useState(false);
  const [partner, setPartner] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (u: User | null) => {
    setUser(u);
    setOutboxUser(u?.id ?? null); // only this account's saved talks are listed and uploaded
    if (!u) {
      setMemberships([]);
      setTrainer(false);
      setPartner(false);
      setStatus("signed-out");
      return;
    }
    try {
      // Join any company that invited this email (Admin → App access). Never blocks signing in.
      try { await acceptInvites(); } catch { /* offline or not yet migrated: try again next sign-in */ }
      // A database without 0026/0027 just means not a trainer or partner.
      const [ms, tr, pa] = await Promise.all([myMemberships(u.id), amTrainer(u.id).catch(() => false), amPartner(u.id).catch(() => false)]);
      setMemberships(ms);
      setTrainer(tr);
      setPartner(pa);
      setError(null);
      const saved = readCurrentId();
      setCurrentId(ms.find((m) => m.company.id === saved)?.company.id ?? ms[0]?.company.id ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setStatus("signed-in");
  }, []);

  useEffect(() => {
    if (configError) return;
    const client = supabase();
    client.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    const { data: sub } = client.auth.onAuthStateChange((event, s) => {
      // Deferred: calling Supabase from inside this callback can deadlock the auth client.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") setTimeout(() => load(s?.user ?? null), 0);
    });
    return () => sub.subscription.unsubscribe();
  }, [load, configError]);

  const value = useMemo<SessionState>(
    () => ({
      status,
      user,
      memberships,
      trainer,
      partner,
      current: memberships.find((m) => m.company.id === currentId) ?? null,
      error: configError ?? error,
      setCurrent: (id) => {
        writeCurrentId(id);
        setCurrentId(id);
      },
      refresh: async () => {
        const { data } = await supabase().auth.getSession();
        await load(data.session?.user ?? null);
      },
      signOut: async () => {
        await supabase().auth.signOut();
      },
    }),
    [status, user, memberships, trainer, partner, currentId, error, configError, load],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const s = useContext(SessionContext);
  if (!s) throw new Error("useSession must be used inside <SessionProvider>");
  return s;
}
