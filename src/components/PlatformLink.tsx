"use client";

// A way into the service console (/platform/) on Home, shown only to the people running the service (checked in the
// database, migration 0042). Customer companies never see it.
import { useEffect, useState } from "react";
import Link from "next/link";
import { amPlatformAdmin } from "@/lib/data/platform";

export function PlatformLink() {
  const [show, setShow] = useState(false);
  useEffect(() => { let live = true; amPlatformAdmin().then((a) => live && setShow(a)); return () => { live = false; }; }, []);
  if (!show) return null;
  return (
    <Link href="/platform/" className="mt-3 flex items-center justify-between rounded-xl border border-dashed border-line px-4 py-3">
      <span><b className="block">Service console</b><small className="text-muted">Every company using the app: plans, support, pauses</small></span>
      <span aria-hidden className="text-muted">›</span>
    </Link>
  );
}
