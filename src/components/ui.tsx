"use client";

// Small shared UI pieces, styled from the prototype's tokens (globals.css). Phone-first: big tap targets.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSession } from "@/lib/session";
import { canAdmin } from "@/lib/data/types";
import { pending, onOutboxChange } from "@/lib/outbox";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger"; size?: "md" | "sm" };

export function Button({ variant = "primary", size = "md", className = "", ...rest }: BtnProps) {
  const base = "rounded-lg font-bold transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";
  const sizes = size === "sm" ? "px-3 py-2 text-sm" : "w-full px-4 py-4 font-display text-xl font-extrabold uppercase tracking-wide";
  const variants = {
    primary: "bg-hivis text-hivis-ink",
    ghost: "border border-line bg-transparent text-fg hover:border-fg",
    danger: "border border-warn bg-transparent text-warn",
  }[variant];
  return <button className={`${base} ${sizes} ${variants} ${className}`} {...rest} />;
}

/** A destructive button that needs a second tap within 4 seconds. The viewer's frame has no confirm() dialog. */
export function ConfirmButton({ label, confirmLabel = "Tap again to confirm", onConfirm, disabled }: { label: string; confirmLabel?: string; onConfirm: () => void; disabled?: boolean }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return (
    <Button
      size="sm"
      variant={armed ? "danger" : "ghost"}
      disabled={disabled}
      onClick={() => {
        if (armed) { setArmed(false); onConfirm(); return; }
        setArmed(true);
        timer.current = setTimeout(() => setArmed(false), 4000);
      }}
    >
      {armed ? confirmLabel : label}
    </Button>
  );
}

export function Field({ label, hint, id, children }: { label: string; hint?: string; id: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label} {hint && <small className="font-normal text-muted">{hint}</small>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full min-w-0 rounded-lg border border-line bg-surface px-3 py-3 text-base text-fg placeholder:text-muted focus:border-fg focus:outline-none";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="font-display text-sm font-bold uppercase tracking-widest text-muted">{children}</p>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-balance">{children}</h1>;
}

export function GroupHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mt-8 flex items-baseline justify-between gap-3 border-b-2 border-hivis pb-1">
      <h2 className="font-display text-sm font-bold uppercase tracking-widest text-muted">{children}</h2>
      {aside && <span className="text-sm font-bold text-muted">{aside}</span>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "ok"; children: React.ReactNode }) {
  const tones = { info: "border-hivis bg-surface", error: "border-warn bg-warn-bg", ok: "border-ok bg-surface" }[tone];
  return <div role={tone === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-sm ${tones}`}>{children}</div>;
}

export function Stripe() {
  return (
    <span
      aria-hidden
      className="inline-block h-[18px] w-7 shrink-0 rounded-sm"
      style={{ background: "repeating-linear-gradient(-45deg, var(--hivis) 0 6px, var(--fg) 6px 12px)" }}
    />
  );
}

/**
 * The page frame: header (logo, offline/upload status, page links) and, on the main screens, the bottom tab bar.
 * Focused flows (giving a talk, sign-in, setup) pass tabs={false}.
 */
export function Shell({ children, nav, tabs = true }: { children: React.ReactNode; nav?: React.ReactNode; tabs?: boolean }) {
  return (
    <div className={`mx-auto max-w-xl px-4 ${tabs ? "pb-28" : "pb-10"}`}>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur">
        <Link href="/" className="flex items-center gap-2.5">
          <Stripe />
          <span className="font-display text-2xl font-extrabold uppercase tracking-wide">Toolbox Talks</span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ConnectionPill />
          {nav && <nav className="flex gap-1.5">{nav}</nav>}
        </div>
      </header>
      <main className="page-in pt-5">{children}</main>
      {tabs && <TabBar />}
    </div>
  );
}

// Online/offline, plus how many talks are waiting on this phone. Silent when everything is fine.
const subscribeOnline = (cb: () => void) => {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => { window.removeEventListener("online", cb); window.removeEventListener("offline", cb); };
};
function ConnectionPill() {
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const s = useSession();
  const companyId = s.current?.company.id;
  const waiting = useSyncExternalStore(onOutboxChange, () => (companyId ? pending(companyId).length : 0), () => 0);
  if (online && waiting === 0) return null;
  return (
    <Link href="/records/" className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${online ? "bg-hivis text-hivis-ink" : "bg-fg text-bg"}`}>
      <span aria-hidden className={`h-2 w-2 rounded-full ${online ? "bg-hivis-ink" : "bg-hivis"}`} />
      {online ? `${waiting} to upload` : waiting ? `Offline · ${waiting} saved here` : "Offline"}
    </Link>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  talk: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h5" /></>,
  records: <><path d="M4 6h16M4 12h16M4 18h10" /></>,
  reports: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  admin: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
};

function TabBar() {
  const s = useSession();
  const path = (usePathname() || "/").replace(/\/?$/, "/");
  const admin = canAdmin(s.current?.access);
  const tabs = [
    { href: "/", label: "Home", icon: "home" },
    { href: "/talk/", label: "Talk", icon: "talk" },
    { href: "/records/", label: "Records", icon: "records" },
    ...(admin ? [{ href: "/reports/", label: "Reports", icon: "reports" }, { href: "/admin/", label: "Admin", icon: "admin" }] : []),
  ];
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href) || (href === "/records/" && path.startsWith("/record/")));
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur">
      <ul className="mx-auto flex max-w-xl">
        {tabs.map((t) => {
          const on = active(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 pt-1.5 pb-1 text-[11px] font-bold ${on ? "text-fg" : "text-muted"}`}
              >
                <span className={`flex h-7 w-12 items-center justify-center rounded-full ${on ? "bg-hivis text-hivis-ink" : ""}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    {ICONS[t.icon]}
                  </svg>
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md border border-line px-2.5 py-1.5 text-sm font-bold hover:border-fg">
      {children}
    </Link>
  );
}

/** Gray placeholder blocks in the shape of a list while data loads. */
export function Loading({ label = "Loading…", rows = 3 }: { label?: string; rows?: number }) {
  return (
    <div role="status" aria-label={label} className="mt-4 flex flex-col gap-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton h-16 rounded-lg" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

/** Red count of flagged people (not signed or absent, plus an unsigned presenter). Shows nothing at zero. */
export function FlagChip({ n }: { n: number }) {
  return n > 0 ? <span className="whitespace-nowrap rounded bg-warn px-2 py-0.5 font-display text-xs font-bold uppercase text-white">{n} flagged</span> : null;
}

export const STATUS_CHIP: Record<"signed" | "not_signed" | "absent", string> = {
  signed: "border border-ok text-ok",
  not_signed: "bg-warn text-white",
  absent: "bg-warn text-white",
};

/** "Makeup for the week of Sep 21 · Out sick". The record's own date stays its real date. */
export function MakeupTag({ weekStart, reason }: { weekStart: string; reason: string | null }) {
  const [y, m, d] = weekStart.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <span className="mt-1 block text-sm">
      <span className="mr-1.5 rounded border border-fg px-1.5 py-0.5 font-display text-xs font-bold uppercase">Makeup</span>
      for the week of {label}{reason ? ` · ${reason}` : ""}
    </span>
  );
}

/** A panel that slides up from the bottom (a dialog on a computer). Escape or tapping outside closes it. */
export function Sheet({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("input, select, button")?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-in max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-bg p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line sm:hidden" aria-hidden />
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-extrabold uppercase">{title}</h2>
          <button className="min-h-11 min-w-11 rounded-md text-2xl leading-none text-muted" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
