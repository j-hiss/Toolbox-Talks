"use client";

import { SessionProvider } from "@/lib/session";
import { Toaster } from "./toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}<Toaster /></SessionProvider>;
}
