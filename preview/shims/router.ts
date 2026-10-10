// In-page router for the preview. The real app uses Next.js routes; the preview is a single page, so "pages" are
// swapped in memory. A trailing #fragment (like /admin/#jobsites) still goes to location.hash for the admin tabs.
import { useSyncExternalStore } from "react";

// The preview can ask to open on a page after a reload (preview "View as → Trainer").
let path = (() => { try { const p = sessionStorage.getItem("tt-preview-start"); sessionStorage.removeItem("tt-preview-start"); return p || "/"; } catch { return "/"; } })();
const listeners = new Set<() => void>();

export function currentPath() { return path; }

export function navigate(href: string) {
  const [p, hash] = href.split("#");
  const next = normalize(p || path);
  const changed = next !== path;
  path = next;
  if (hash !== undefined) {
    if (window.location.hash.slice(1) !== hash) window.location.hash = hash;
  } else if (changed && window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
  if (changed) {
    window.scrollTo(0, 0);
    listeners.forEach((l) => l());
  }
}

function normalize(p: string) {
  if (!p.startsWith("/")) p = "/" + p;
  return p.endsWith("/") ? p : p + "/";
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
export function usePreviewPath() {
  return useSyncExternalStore(subscribe, currentPath, currentPath);
}
