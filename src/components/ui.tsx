"use client";

// Small shared UI pieces, styled from the prototype's tokens (globals.css). Phone-first: big tap targets.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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

export function Shell({ children, nav }: { children: React.ReactNode; nav?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 pb-10">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <Stripe />
          <span className="font-display text-2xl font-extrabold uppercase tracking-wide">Toolbox Talks</span>
        </Link>
        {nav && <nav className="flex gap-1.5">{nav}</nav>}
      </header>
      <main className="pt-5">{children}</main>
    </div>
  );
}

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-md border border-line px-2.5 py-1.5 text-sm font-bold hover:border-fg">
      {children}
    </Link>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return <p className="py-10 text-center text-muted" role="status">{label}</p>;
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
