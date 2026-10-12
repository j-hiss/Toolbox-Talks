"use client";

// The kind-of-talk badges (src/core/recordType.ts), with icons: Weekly talk, Makeup, Daily plan, plus Own talk and
// Swapped. Small, one row; the same on the Records list and the saved record.
import { recordBadges, type RecordBadge, type RecordTypeInput } from "@/core/recordType";

const TONE: Record<RecordBadge["id"], string> = {
  weekly: "bg-fg/[0.06] text-fg",
  makeup: "bg-caution-bg text-caution-text",
  daily: "bg-brand-soft text-brand-text",
  own: "bg-fg/[0.06] text-fg",
  swapped: "bg-fg/[0.06] text-fg",
};
const PATH: Record<RecordBadge["id"], React.ReactNode> = {
  weekly: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  makeup: <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4M12 8v4l3 2" />,
  daily: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  own: <path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />,
  swapped: <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />,
};

export function RecordBadges({ r, className = "" }: { r: RecordTypeInput; className?: string }) {
  return (
    <span className={`flex flex-wrap gap-1 ${className}`} aria-label={`Type: ${recordBadges(r).map((b) => b.label).join(", ")}`}>
      {recordBadges(r).map((b) => (
        <span key={b.id} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${TONE[b.id]}`}>
          <svg aria-hidden viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{PATH[b.id]}</svg>
          {b.label}
        </span>
      ))}
    </span>
  );
}
