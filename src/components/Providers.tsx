"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "@/lib/session";
import { applyTheme, rememberedTheme } from "@/lib/theme";
import { Toaster } from "./toast";

/** Keeps the page in the current company's colors (Admin → Brand). */
function CompanyColors() {
  const s = useSession();
  const hasCompany = !!s.current;
  const theme = s.current?.company.theme;
  useEffect(() => { applyTheme(rememberedTheme(), false); }, []);
  useEffect(() => { if (hasCompany) applyTheme(theme ?? null); }, [hasCompany, theme]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider><CompanyColors />{children}<Toaster /></SessionProvider>;
}
