"use client";

// A small radar map centered on the jobsite: a street map with the last 50 minutes of rain radar playing on top,
// like a weather app. Tile math in src/core/maptiles.ts; where the pictures come from in src/lib/radar.ts.
// Plays on its own unless the phone asks for reduced motion; pause, step back and zoom are a tap away.
import { useEffect, useRef, useState } from "react";
import { milesAcross, tileXY, tilesFor } from "@/core/maptiles";
import type { Ring } from "@/core/conditions";
import { BASEMAP, RADAR, RADAR_FRAMES, radarLatest } from "@/lib/radar";

const LAST = RADAR_FRAMES.length - 1;

/** A weather service warning area to outline on the map. */
export type MapArea = { event: string; rings: Ring[]; loud: boolean };

export function RadarMap({ latitude, longitude, height = 230, areas = [] }: { latitude: number; longitude: number; height?: number; areas?: MapArea[] }) {
  const HEIGHT = height;
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(358);
  const [z, setZ] = useState(8);
  const [frame, setFrame] = useState(LAST);
  const [playing, setPlaying] = useState(() => typeof window === "undefined" || !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  const [baseFailed, setBaseFailed] = useState(0);
  const [radarFailed, setRadarFailed] = useState(0);
  const [scanAt, setScanAt] = useState<Date | null>(null);
  useEffect(() => { let live = true; radarLatest().then((d) => live && setScanAt(d)); return () => { live = false; }; }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The loop: one frame every half second, then a pause on the latest scan.
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setFrame((f) => (f + 1) % RADAR_FRAMES.length), frame === LAST ? 1600 : 450);
    return () => clearTimeout(t);
  }, [playing, frame]);

  const tiles = tilesFor(latitude, longitude, z, width, HEIGHT);
  const offline = baseFailed >= tiles.length && tiles.length > 0;
  const minsAgo = RADAR_FRAMES[frame];
  const label = scanAt
    ? new Date(scanAt.getTime() - minsAgo * 60_000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : minsAgo === 0 ? "Latest" : `${minsAgo} min earlier`;
  // Warning areas, placed with the same tile math as the map (pixels from the center).
  const c = tileXY(latitude, longitude, z);
  const toPx = ([lat, lon]: [number, number]) => { const p = tileXY(lat, lon, z); return `${(width / 2 + (p.x - c.x) * 256).toFixed(1)},${(HEIGHT / 2 + (p.y - c.y) * 256).toFixed(1)}`; };
  const miles = Math.round(milesAcross(latitude, z, width));

  return (
    <div className="px-3 pb-3">
      <div ref={box} className="relative overflow-hidden rounded-xl bg-[#DCE3EA]" style={{ height: HEIGHT }} aria-label={`Radar map around the jobsite, about ${miles} miles across. ${label}.`} role="img">
        {/* Street map */}
        {tiles.map((t) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={`b-${t.z}-${t.x}-${t.y}`} src={BASEMAP.tile(t.z, t.x, t.y)} alt="" width={256} height={256} draggable={false} loading="eager"
            className="wx-basemap pointer-events-none absolute max-w-none select-none" style={{ left: t.left, top: t.top }}
            onError={() => setBaseFailed((n) => n + 1)} />
        ))}
        {/* Radar: every frame is loaded up front and only the current one shows, so the loop never flickers */}
        {RADAR_FRAMES.map((m, i) => (
          <div key={m} className="pointer-events-none absolute inset-0 transition-opacity duration-150" style={{ opacity: i === frame ? 0.78 : 0 }}>
            {tiles.map((t) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={`r-${m}-${t.z}-${t.x}-${t.y}`} src={RADAR.tile(m, t.z, t.x, t.y)} alt="" width={256} height={256} draggable={false}
                className="absolute max-w-none select-none" style={{ left: t.left, top: t.top }} onError={() => setRadarFailed((n) => n + 1)} />
            ))}
          </div>
        ))}

        {/* Weather service warning areas */}
        {areas.length > 0 && (
          <svg className="pointer-events-none absolute inset-0" width={width} height={HEIGHT} aria-hidden>
            {areas.flatMap((a, ai) => a.rings.map((r, ri) => (
              <polygon key={`${ai}-${ri}`} points={r.map(toPx).join(" ")} fill={a.loud ? "rgba(214,0,0,0.16)" : "rgba(245,183,0,0.16)"}
                stroke={a.loud ? "#E00000" : "#E0A800"} strokeWidth="2.5" strokeLinejoin="round" strokeDasharray={a.loud ? undefined : "6 4"} className={a.loud ? "wx-area" : undefined} />
            )))}
          </svg>
        )}

        {/* The jobsite */}
        <span className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: "50%", top: "50%" }} aria-hidden>
          <span className="wx-ping absolute inset-0 rounded-full bg-brand/50" />
          <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-white bg-brand shadow" />
        </span>

        {/* Zoom */}
        <div className="absolute top-2 right-2 flex flex-col overflow-hidden rounded-lg bg-white/90 text-[#14202E] shadow">
          <button className="h-9 w-9 text-lg font-semibold disabled:opacity-30" onClick={() => setZ((v) => Math.min(RADAR.maxZoom, v + 1))} disabled={z >= RADAR.maxZoom} aria-label="Zoom in">+</button>
          <button className="h-9 w-9 border-t border-black/10 text-lg font-semibold disabled:opacity-30" onClick={() => setZ((v) => Math.max(RADAR.minZoom, v - 1))} disabled={z <= RADAR.minZoom} aria-label="Zoom out">−</button>
        </div>

        {/* Rain scale */}
        <div className="absolute top-2 left-2 rounded-md bg-white/90 px-2 py-1 text-[10px] text-[#14202E] shadow">
          <span className="block h-1.5 w-24 rounded-full" style={{ background: "linear-gradient(90deg,#04E9E7,#019FF4,#02FD02,#008E00,#FDF802,#E5BC00,#FD9500,#FD0000,#D40000,#F800FD)" }} />
          <span className="mt-0.5 flex justify-between"><span>Light</span><span>Heavy</span></span>
          {areas.length > 0 && (
            <span className="mt-1 flex items-center gap-1.5 border-t border-black/10 pt-1">
              <span className="inline-block h-2.5 w-3.5 rounded-sm border-2 border-[#E00000] bg-[#E00000]/15" />
              {areas.length === 1 ? areas[0].event : "Warning areas"}
            </span>
          )}
        </div>

        {/* Play, timeline */}
        <div className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-lg bg-[#14202E]/80 px-2 py-1.5 text-white backdrop-blur-sm">
          <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause radar" : "Play radar"}>
            {playing
              ? <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" /><rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" /></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>}
          </button>
          <div className="flex flex-1 items-center gap-0.5" role="group" aria-label="Radar time">
            {RADAR_FRAMES.map((m, i) => (
              <button key={m} className="flex h-8 flex-1 items-center" onClick={() => { setPlaying(false); setFrame(i); }} aria-label={m === 0 ? "Latest radar" : `${m} minutes earlier`}>
                <span className={`block h-1.5 w-full rounded-full ${i <= frame ? "bg-white" : "bg-white/25"}`} />
              </button>
            ))}
          </div>
          <span className="w-[86px] shrink-0 text-right text-xs tabular-nums">{label}{scanAt && minsAgo === 0 ? <span className="block text-[10px] opacity-75">latest scan</span> : null}</span>
        </div>

        {offline && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#DCE3EA] p-6 text-center text-sm text-[#3D4A5A]">
            The radar map needs signal. It comes back on its own when you&apos;re connected.
          </div>
        )}
      </div>
      <p className="mt-1.5 text-[11px] text-muted">
        About {miles} miles across. {RADAR.credit}. Map {BASEMAP.credit}.
        {!offline && radarFailed >= tiles.length * RADAR_FRAMES.length && tiles.length > 0 ? " Radar couldn't load just now." : ""}
      </p>
    </div>
  );
}
