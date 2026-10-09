"use client";

// Small shared UI pieces, styled from the prototype's tokens (globals.css). Phone-first: big tap targets.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSession } from "@/lib/session";
import { canAdmin, canPresent, canReport, isStaff } from "@/lib/data/types";
import { pending, onOutboxChange } from "@/lib/outbox";
import { BRAND } from "@/content/brand";
import { Wordmark } from "./Logo";
import { BRAND_COLORS, markSvgInner } from "@/content/logo";

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "soft" | "ghost" | "danger"; size?: "md" | "sm" | "lg" };

export function Button({ variant = "primary", size = "md", className = "", ...rest }: BtnProps) {
  // Disabled buttons stay readable outdoors: a plain outline with dark text, not a faded color.
  const base = "font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:border disabled:border-dashed disabled:border-muted disabled:bg-surface disabled:text-muted disabled:shadow-none disabled:brightness-100 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-fg";
  // Pill buttons, like a premium consumer app: one filled blue for the main action, a tinted fill for the second one.
  const sizes = size === "sm" ? "min-h-11 rounded-full px-4 py-2 text-[15px]"
    : size === "lg" ? "min-h-16 w-full rounded-full px-6 py-4 font-display text-[19px] font-extrabold tracking-[-0.02em]" // the one big action on a screen
    : "min-h-[54px] w-full rounded-full px-5 py-3.5 text-[17px] tracking-[-0.02em]";
  const variants = {
    primary: "bg-action text-action-ink hover:brightness-110",
    soft: "bg-brand-soft text-brand-text hover:brightness-[0.97]",
    ghost: "bg-fg/[0.06] text-fg hover:bg-fg/[0.1]",
    danger: "border border-warn bg-surface text-warn-text",
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
      <label htmlFor={id} className="text-sm font-semibold">
        {label} {hint && <small className="font-normal text-muted">{hint}</small>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full min-w-0 rounded-md border border-line bg-surface px-3.5 py-3 text-[17px] text-fg placeholder:text-muted focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15";

/** A segmented control (range pickers, how-often): a grey track with the chosen segment raised in white. */
export const segmentedClass = "grid gap-1 rounded-[14px] bg-fg/[0.06] p-1";
export const segmentClass = (on: boolean) =>
  `min-h-10 rounded-[10px] px-2 text-[14px] font-semibold transition ${on ? "bg-surface text-fg shadow-[0_1px_3px_rgba(0,0,0,0.14)]" : "text-muted hover:text-fg"}`;

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted">{children}</p>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="mt-0.5 font-display text-[34px] font-bold leading-[1.08] tracking-[-0.025em] text-balance">{children}</h1>;
}

export function GroupHeading({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="mt-9 flex items-baseline justify-between gap-3 px-1">
      <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{children}</h2>
      {aside && <span className="text-sm font-medium tabular-nums text-muted">{aside}</span>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "ok" | "caution"; children: React.ReactNode }) {
  // A colored rule on the left says the kind of message; the fill stays light so text reads the same everywhere.
  // A soft tinted panel; the tint says the kind of message.
  const tones = { info: "bg-brand-soft", error: "bg-warn-bg text-fg", ok: "bg-ok-bg", caution: "bg-caution-bg text-fg" }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-2 rounded-lg px-4 py-3 text-[15px] leading-relaxed ${tones}`}>
      {tone === "caution" && <span aria-hidden className="font-bold">!</span>}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** A file picker that looks like a button (the browser's "Choose File / No file chosen" is hard to tap and read). */
export function FileButton({ label, accept, disabled, chosen, onFile }: { label: string; accept: string; disabled?: boolean; chosen?: string | null; onFile: (f: File | null) => void }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <label className={`flex min-h-11 cursor-pointer items-center rounded-md border border-line bg-surface px-3.5 text-sm font-semibold focus-within:outline-3 focus-within:outline-fg ${disabled ? "cursor-not-allowed border-dashed border-muted text-muted" : ""}`}>
        {label}
        <input type="file" accept={accept} disabled={disabled} className="sr-only" onChange={(e) => { onFile(e.target.files?.[0] ?? null); e.target.value = ""; }} />
      </label>
      {chosen && <span className="min-w-0 truncate text-sm text-muted">{chosen}</span>}
    </span>
  );
}

/** A plain-words error with a Try again button; the technical detail stays behind a disclosure. */
export function ErrorNotice({ what, detail, onRetry }: { what: string; detail: string; onRetry: () => void }) {
  return (
    <Notice tone="error">
      <p className="font-semibold">{what}</p>
      <p className="mt-1">Check your signal and try again.</p>
      <Button size="sm" variant="ghost" className="mt-2" onClick={onRetry}>Try again</Button>
      <details className="mt-2 text-xs text-muted"><summary className="cursor-pointer">Details</summary>{detail}</details>
    </Notice>
  );
}

/** The app mark (PLACEHOLDER, Salvant direction D): a lowercase s over the rule, in the brand's own fixed colors
 *  (deep forest tile, off-white s, green rule), the same as the app icon. See src/content/logo.ts. */
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <span aria-hidden className="flex shrink-0 items-center justify-center rounded-[22%]" style={{ width: size, height: size, background: BRAND_COLORS.forest }}>
      <svg width={size} height={size} viewBox="0 0 64 64" dangerouslySetInnerHTML={{ __html: markSvgInner(BRAND_COLORS.paper, BRAND_COLORS.green) }} />
    </span>
  );
}

/**
 * The page frame: header (logo, offline/upload status, page links) and, on the main screens, the app's navigation.
 * Phones and tablets in portrait get the bottom tab bar; a big screen (iPad landscape, the office computer, 1024px+)
 * gets a side menu instead and a wider page. Focused flows (giving a talk, sign-in, setup) pass tabs={false} and stay
 * one column, sized for a tablet at most. `wide` lets a screen use the full width on a computer (reports, admin).
 */
export function Shell({ children, nav, tabs = true, lockHeader = false, wide = false }: { children: React.ReactNode; nav?: React.ReactNode; tabs?: boolean; lockHeader?: boolean; wide?: boolean }) {
  const s = useSession();
  const name = s.current?.company.name ?? BRAND.name;
  const side = useTabs().length >= 2 && tabs;
  const width = !tabs ? "max-w-xl md:max-w-2xl" : wide ? "max-w-xl md:max-w-3xl lg:max-w-6xl" : "max-w-xl md:max-w-3xl lg:max-w-4xl";
  return (
    <div className={side ? "lg:pl-64" : ""}>
      {side && <SideNav name={name} />}
      <div className={`mx-auto px-4 md:px-8 ${width} ${tabs ? "pb-28 lg:pb-12" : "pb-10"}`}>
        <header className={`sticky top-[env(safe-area-inset-top,0px)] z-20 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 bg-bg/80 px-5 py-3 backdrop-blur-xl backdrop-saturate-[1.8] md:-mx-8 md:px-8 ${side ? "lg:justify-end lg:border-transparent" : ""}`}>
          {lockHeader ? (
            // Signing: the logo isn't a way out while a crew member holds the phone.
            <span className="flex min-w-0 items-center gap-2.5"><Mark size={28} /><span className="truncate text-[15px] font-semibold tracking-[-0.005em]">{name}</span></span>
          ) : (
            <Link href="/" className={`flex min-w-0 items-center gap-2.5 ${side ? "lg:hidden" : ""}`}>
              <Mark size={28} />
              <span className="truncate text-[15px] font-semibold tracking-[-0.005em]">{name}</span>
            </Link>
          )}
          <div className="flex items-center gap-1.5">
            <ConnectionPill />
            {nav && <nav className="flex gap-1.5">{nav}</nav>}
          </div>
        </header>
        <main className="page-in pt-6">{children}</main>
      </div>
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
    <Link href="/records/" className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${online ? "bg-caution-bg text-caution-text" : "bg-fg text-bg"}`}>
      <span aria-hidden className="h-2 w-2 rounded-full bg-caution" />
      {online ? `${waiting} to upload` : waiting ? `Offline · ${waiting} saved here` : "Offline"}
    </Link>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  home: <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  talk: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3h6v3H9zM8.5 11h7M8.5 15h5" /></>,
  records: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 14l2 2 4-4" /></>,
  reports: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  admin: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
};

/** The main screens this person can open. Tabs follow the app role: employees see only Home (their own history);
 *  office has no Talk; setup is for admins. One list for the bottom tab bar and the side menu. */
function useTabs() {
  const s = useSession();
  const access = s.current?.access;
  return [
    { href: "/", label: "Home", icon: "home", show: true },
    { href: "/talk/", label: "Talk", icon: "talk", show: canPresent(access) },
    { href: "/records/", label: "Records", icon: "records", show: isStaff(access) },
    { href: "/reports/", label: "Reports", icon: "reports", show: canReport(access) },
    { href: "/admin/", label: "Admin", icon: "admin", show: canAdmin(access) },
  ].filter((t) => t.show);
}

function useActive() {
  const path = (usePathname() || "/").replace(/\/?$/, "/");
  return (href: string) => (href === "/" ? path === "/" : path.startsWith(href) || (href === "/records/" && path.startsWith("/record/")));
}

function TabIcon({ icon, on, size = 22 }: { icon: string; on: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[icon]}
    </svg>
  );
}

/** The side menu on a big screen (1024px+): the same tabs, listed down the left edge under the company name. */
function SideNav({ name }: { name: string }) {
  const tabs = useTabs();
  const active = useActive();
  return (
    <nav aria-label="Menu" className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line/60 bg-surface/60 px-4 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] pb-6 backdrop-blur-xl lg:flex">
      <Link href="/" className="flex min-w-0 items-center gap-3 px-2">
        <Mark size={34} />
        <span className="block min-w-0 truncate text-[15px] font-semibold">{name}</span>
      </Link>
      <ul className="mt-8 flex flex-col gap-1">
        {tabs.map((t) => {
          const on = active(t.href);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold ${on ? "bg-brand-soft text-brand-text" : "text-muted hover:bg-fg/[0.05] hover:text-fg"}`}>
                <TabIcon icon={t.icon} on={on} size={20} />{t.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto px-2 text-fg"><Wordmark height={30} /><p className="mt-2 text-xs text-muted">{BRAND.tagline}</p></div>
    </nav>
  );
}

function TabBar() {
  const tabs = useTabs();
  const active = useActive();
  if (tabs.length < 2) return null; // an employee account has only Home
  return (
    // A translucent bar on the bottom edge, like a phone's own tab bar; the selected tab is in the brand color.
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t lg:hidden border-line/60 bg-surface/80 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-xl backdrop-saturate-[1.8]">
      <ul className="mx-auto flex max-w-xl px-2 md:max-w-2xl">
        {tabs.map((t) => {
          const on = active(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-0.5 pt-1.5 pb-1.5 text-[11px] font-medium tracking-normal ${on ? "text-brand-text" : "text-muted"}`}
              >
                <span className="flex h-7 items-center justify-center"><TabIcon icon={t.icon} on={on} /></span>
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
    <Link href={href} className="flex min-h-11 items-center rounded-full bg-fg/[0.06] px-4 py-1.5 text-[15px] font-medium text-brand-text">
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
  return n > 0 ? <span className="whitespace-nowrap rounded bg-warn px-2 py-0.5 text-xs font-semibold text-warn-ink">{n} flagged</span> : null;
}

export const STATUS_CHIP: Record<"signed" | "not_signed" | "absent", string> = {
  signed: "bg-ok-bg text-ok-text",
  not_signed: "bg-warn text-warn-ink",
  absent: "bg-warn text-warn-ink",
};

/** "Makeup for the week of Sep 21 · Out sick". The record's own date stays its real date. */
export function MakeupTag({ weekStart, reason }: { weekStart: string; reason: string | null }) {
  const [y, m, d] = weekStart.split("-").map(Number);
  const label = new Date(y, m - 1, d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return (
    <span className="mt-1 block text-sm">
      <span className="mr-1.5 rounded bg-caution-bg px-1.5 py-0.5 text-xs font-semibold text-caution-text">Makeup</span>
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
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          <button className="min-h-11 min-w-11 rounded-md text-2xl leading-none text-muted" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
