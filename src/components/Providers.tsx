"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "@/lib/session";
import { applyTheme, rememberedTheme } from "@/lib/theme";
import { Toaster } from "./toast";
import { startOfflineApp } from "@/lib/offlineApp";

/** Keeps the page in the current company's colors (Admin → Brand). */
function CompanyColors() {
  const s = useSession();
  const hasCompany = !!s.current;
  const theme = s.current?.company.theme;
  useEffect(() => { applyTheme(rememberedTheme(), false); }, []);
  useEffect(() => { if (hasCompany) applyTheme(theme ?? null); }, [hasCompany, theme]);
  return null;
}

/** Website and installed web app: keep this build's files on the device so it opens with no signal. */
function OfflineApp() {
  useEffect(() => { startOfflineApp(); }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><CompanyColors /><OfflineApp />{children}<Toaster /></SessionProvider>;
}
