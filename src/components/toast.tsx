"use client";

// Small "Saved" style messages under the header (never over the action buttons at the bottom), optionally with
// one action (Undo). They clear when you move to another screen.
// Call toast("Saved") from anywhere; <Toaster /> (in Providers) shows them. One at a time; a new one replaces the old.
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

type Toast = { id: number; text: string; tone: "ok" | "error"; action?: { label: string; run: () => void } };

let current: Toast | null = null;
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function toast(text: string, opts: { tone?: "ok" | "error"; action?: Toast["action"] } = {}) {
  current = { id: nextId++, text, tone: opts.tone ?? "ok", action: opts.action };
  emit();
}
export function dismissToast() { current = null; emit(); }

/** A short buzz on phones that support it (Android, and the native apps). Never required for meaning. */
export function buzz(ms = 12) {
  try { navigator.vibrate?.(ms); } catch { /* not supported */ }
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export function Toaster() {
  const t = useSyncExternalStore(subscribe, () => current, () => null);
  const path = usePathname();
  const lastPath = useRef(path);
  useEffect(() => {
    if (lastPath.current !== path) { lastPath.current = path; dismissToast(); }
  }, [path]);
  useEffect(() => {
    if (!t) return;
    const timer = setTimeout(() => { if (current?.id === t.id) dismissToast(); }, t.action ? 6000 : 2600);
    return () => clearTimeout(timer);
  }, [t]);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(4.25rem+env(safe-area-inset-top,0px))] z-40 flex justify-center px-4">
      {t && (
        <div
          key={t.id}
          role={t.tone === "error" ? "alert" : "status"}
          className={`toast-in pointer-events-auto flex max-w-md items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold shadow-lg ${t.tone === "error" ? "bg-warn text-warn-ink" : "bg-fg text-bg"}`}
        >
          <span>{t.text}</span>
          {t.action && (
            <button className="ml-auto rounded px-2 py-1 font-semibold underline underline-offset-2" onClick={() => { t.action!.run(); dismissToast(); }}>
              {t.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
