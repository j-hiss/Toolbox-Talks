"use client";

// Report charts, hand-built in SVG/HTML on the app's tokens (no chart library). Rules from the data-viz method:
// 2px lines, end dots with a surface ring, hairline grid, legend for 2+ series, text in ink (never the series color),
// a hover/focus readout that never gates (every value is also in the week list or table), tap works on phones.
import { useEffect, useRef, useState } from "react";
import type { Tally } from "@/core/compliance";
import { pct, score } from "@/core/compliance";

// ---------------------------------------------------------------------------------------------------------------
export type TrendPoint = { key: string; label: string; score: number | null; onTime: number | null };

const SERIES = [
  { id: "score", name: "Compliance", color: "var(--series-1)" },
  { id: "onTime", name: "On time", color: "var(--series-2)" },
] as const;

export function TrendChart({ points }: { points: TrendPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(340); // drawn at the real pixel width so text stays readable on a phone
  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 190, L = 38, R = 46, T = 12, B = 26;
  const x = (i: number) => L + (points.length === 1 ? (W - L - R) / 2 : (i * (W - L - R)) / (points.length - 1));
  const y = (v: number) => T + (1 - v) * (H - T - B);
  const path = (k: "score" | "onTime") => {
    let d = "";
    let pen = false;
    points.forEach((p, i) => {
      const v = p[k];
      if (v === null) { pen = false; return; }
      d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
      pen = true;
    });
    return d;
  };
  const lastIdx = (k: "score" | "onTime") => { for (let i = points.length - 1; i >= 0; i--) if (points[i][k] !== null) return i; return -1; };
  const pick = (clientX: number) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box || !box.width) return;
    const sx = ((clientX - box.left) / box.width) * W;
    let best = 0;
    points.forEach((_, i) => { if (Math.abs(x(i) - sx) < Math.abs(x(best) - sx)) best = i; });
    setHover(best);
  };
  const tickEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor((W - L - R) / 56))));
  const h = hover !== null ? points[hover] : null;
  const ends = SERIES.map((s) => ({ s, i: lastIdx(s.id) })).filter((e) => e.i >= 0);
  // Keep the two end labels from colliding: if they'd overlap, drop the lower one's label (legend still names it).
  const endY = ends.map((e) => y(points[e.i][e.s.id]!));
  const collide = endY.length === 2 && Math.abs(endY[0] - endY[1]) < 14;

  return (
    <figure className="m-0">
      <ul className="flex flex-wrap gap-x-4 text-sm" aria-label="Legend">
        {SERIES.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <svg width="18" height="8" aria-hidden><line x1="1" y1="4" x2="17" y2="4" stroke={s.color} strokeWidth="2" strokeLinecap="round" /></svg>
            {s.name}
          </li>
        ))}
      </ul>
      <div className="relative mt-1" ref={wrap}>
        <svg
          ref={ref}
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block max-w-full touch-none select-none"
          role="img"
          aria-label={`Weekly compliance trend, ${points.length} weeks. Latest: ${pct(points.at(-1)?.score ?? null)} compliance, ${pct(points.at(-1)?.onTime ?? null)} on time.`}
          tabIndex={0}
          onPointerMove={(e) => pick(e.clientX)}
          onPointerDown={(e) => pick(e.clientX)}
          onPointerLeave={() => setHover(null)}
          onBlur={() => setHover(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setHover((v) => Math.max(0, (v ?? points.length) - 1));
            if (e.key === "ArrowRight") setHover((v) => Math.min(points.length - 1, (v ?? -1) + 1));
          }}
        >
          {[0, 0.5, 1].map((v) => (
            <g key={v}>
              <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="var(--grid)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <text x={L - 6} y={y(v) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" className="tabular-nums">{v * 100}%</text>
            </g>
          ))}
          {points.map((p, i) => ((i % tickEvery === 0 && (points.length - 1 - i) * ((W - L - R) / Math.max(1, points.length - 1)) >= 52) || i === points.length - 1) && (
            <text key={p.key} x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--muted)">{p.label}</text>
          ))}
          {/* the gap between the lines = people-weeks closed by a makeup */}
          {points.map((p, i) => {
            const n = points[i + 1];
            if (!n || p.score === null || p.onTime === null || n.score === null || n.onTime === null) return null;
            return <polygon key={`gap-${p.key}`} points={`${x(i)},${y(p.score)} ${x(i + 1)},${y(n.score)} ${x(i + 1)},${y(n.onTime)} ${x(i)},${y(p.onTime)}`} fill="var(--series-1)" fillOpacity="0.1" />;
          })}
          {h && <line x1={x(hover!)} x2={x(hover!)} y1={T} y2={H - B} stroke="var(--muted)" strokeWidth="1" vectorEffect="non-scaling-stroke" />}
          {SERIES.map((s) => (
            <path key={s.id} d={path(s.id)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          ))}
          {/* single isolated points (a week between gaps) still show as dots */}
          {SERIES.map((s) => points.map((p, i) => {
            const v = p[s.id];
            const isolated = v !== null && (i === 0 || points[i - 1][s.id] === null) && (i === points.length - 1 || points[i + 1][s.id] === null);
            const show = isolated || i === hover || i === lastIdx(s.id);
            return show && v !== null ? <circle key={`${s.id}-${i}`} cx={x(i)} cy={y(v)} r="4.5" fill={s.color} stroke="var(--surface)" strokeWidth="2" /> : null;
          }))}
          {ends.map((e, j) => (collide && j === (endY[0] > endY[1] ? 0 : 1)) ? null : (
            <text key={e.s.id} x={x(e.i) + 8} y={endY[j] + 4} fontSize="12" fontWeight="700" fill="var(--fg)" className="tabular-nums">{pct(points[e.i][e.s.id])}</text>
          ))}
        </svg>
        {h && (
          <div
            className="pointer-events-none absolute top-0 rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs shadow"
            style={{ left: `${(x(hover!) / W) * 100}%`, transform: `translateX(${hover! > points.length / 2 ? "-105%" : "5%"})` }}
            role="status"
          >
            <p className="text-muted">Week of {h.label}</p>
            {SERIES.map((s) => (
              <p key={s.id} className="flex items-center gap-1.5 tabular-nums">
                <svg width="12" height="6" aria-hidden><line x1="1" y1="3" x2="11" y2="3" stroke={s.color} strokeWidth="2" /></svg>
                <b className="text-sm">{pct(h[s.id])}</b> <span className="text-muted">{s.name}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </figure>
  );
}

// ---------------------------------------------------------------------------------------------------------------
export type Band = "good" | "warn" | "bad";
export const BANDS: { band: Band; label: string; bg: string }[] = [
  { band: "good", label: "95% and up", bg: "var(--band-good)" },
  { band: "warn", label: "80–94%", bg: "var(--band-warn)" },
  { band: "bad", label: "Under 80%", bg: "var(--band-bad)" },
];
export const bandOf = (v: number | null): Band | null => (v === null ? null : v >= 0.95 ? "good" : v >= 0.8 ? "warn" : "bad");

export function BandLegend() {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      {BANDS.map((b) => (
        <li key={b.band} className="flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-line" style={{ background: b.bg }} />{b.label}
        </li>
      ))}
      <li className="flex items-center gap-1.5"><span aria-hidden className="inline-block h-3 w-3 rounded-sm border border-dashed border-muted" />This week, in progress</li>
    </ul>
  );
}

/** Team × week grid. Each cell shows its score; tap one for the detail line underneath. */
export function TeamGrid({ rows, weeks, currentKey }: {
  rows: { name: string; cells: { key: string; tally: Tally }[] }[];
  weeks: { key: string; label: string }[];   // oldest first
  currentKey: string;
}) {
  const [sel, setSel] = useState<{ row: number; key: string } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  // Newest weeks are on the right: start scrolled there so the phone shows recent weeks first.
  useEffect(() => { const el = scroller.current; if (el) el.scrollLeft = el.scrollWidth; }, [weeks.length]);
  const detail = (t: Tally) => {
    const parts = [`${t.on_time} on time`, t.made_up && `${t.made_up} made up`, t.open && `${t.open} open`, t.missed && `${t.missed} missed`, t.due && `${t.due} not yet`].filter(Boolean);
    return `${t.on_time + t.made_up} of ${t.expected} signed (${parts.join(", ")})`;
  };
  const s = sel ? rows[sel.row]?.cells.find((c) => c.key === sel.key) : null;
  return (
    <div>
      <div className="overflow-x-auto" ref={scroller}>
        <table className="border-separate border-spacing-[2px] text-xs tabular-nums">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-bg pr-2 text-left font-normal text-muted">Team</th>
              {weeks.map((w) => <th key={w.key} scope="col" className="min-w-11 px-0.5 font-normal text-muted">{w.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.name}>
                <th scope="row" className="sticky left-0 z-10 max-w-28 truncate bg-bg pr-2 text-left font-bold">{r.name}</th>
                {weeks.map((w) => {
                  const c = r.cells.find((x) => x.key === w.key);
                  const t = c?.tally;
                  const now = w.key === currentKey;
                  const band = !t || now ? null : bandOf(score(t));
                  const bg = band ? BANDS.find((b) => b.band === band)!.bg : "transparent";
                  const text = !t || t.expected === 0 ? "–" : now ? `${t.on_time}/${t.expected}` : pct(score(t));
                  const on = sel?.row === ri && sel.key === w.key;
                  return (
                    <td key={w.key} className="p-0">
                      <button
                        className={`h-9 w-full min-w-11 rounded text-center font-bold ${now ? "border border-dashed border-muted" : ""} ${on ? "outline-2 outline-fg" : ""} ${!t || t.expected === 0 ? "text-muted" : ""}`}
                        style={{ background: bg }}
                        aria-label={`${r.name}, week of ${w.label}: ${t && t.expected ? detail(t) : "no one expected"}`}
                        disabled={!t || t.expected === 0}
                        onClick={() => setSel(on ? null : { row: ri, key: w.key })}
                      >
                        {text}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BandLegend />
      {s && sel && (
        <p className="mt-2 text-sm" role="status"><b>{rows[sel.row].name}</b>, week of {weeks.find((w) => w.key === sel.key)?.label}: {detail(s.tally)}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------------
/** One-series horizontal bars, value at the tip. */
export function HBars({ items, unit }: { items: { label: string; n: number }[]; unit: (n: number) => string }) {
  const max = Math.max(1, ...items.map((i) => i.n));
  return (
    <ul className="flex flex-col gap-2">
      {items.map((i) => (
        <li key={i.label} className="text-sm">
          <p>{i.label}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="h-4 rounded-r" style={{ width: `${Math.max(2, (i.n / max) * 80)}%`, background: "var(--series-1)" }} aria-hidden />
            <b className="tabular-nums">{unit(i.n)}</b>
          </div>
        </li>
      ))}
    </ul>
  );
}
