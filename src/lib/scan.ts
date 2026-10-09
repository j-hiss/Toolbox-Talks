"use client";

// A jobsite QR scan survives the sign-in screen: if the presenter scans a sticker while signed out, the jobsite is
// held for this browser tab and picked once they're in (src/components/JobsitePicker.tsx).
import { siteFromSearch } from "@/core/sitelink";

const KEY = "tt-scanned-site";

/** Keep the scanned jobsite id from the current address, if there is one. */
export function holdScan(): void {
  const id = typeof location === "undefined" ? null : siteFromSearch(location.search);
  if (id) try { sessionStorage.setItem(KEY, id); } catch { /* not kept; they can pick the site by hand */ }
}

/** The scanned jobsite id (from the address, or held through sign-in), once. Clears the address and the hold. */
export function takeScan(): string | null {
  if (typeof location === "undefined") return null;
  let id = siteFromSearch(location.search);
  if (id) {
    const url = new URL(location.href); url.searchParams.delete("site");
    history.replaceState(history.state, "", url.pathname + url.search + url.hash);
  }
  try {
    id = id ?? siteFromSearch(`?site=${sessionStorage.getItem(KEY) ?? ""}`);
    sessionStorage.removeItem(KEY);
  } catch { /* no session storage */ }
  return id;
}
