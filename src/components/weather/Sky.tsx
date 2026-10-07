// The weather sky and icons. Everything is drawn in the app (SVG + CSS animations in globals.css, "wx-*"); nothing
// is downloaded. Movement uses transform and opacity only, so it stays smooth on a phone, and stops with reduced motion.
import type { SkyKind, WindLevel } from "@/core/conditions";
import type { SkyPhase } from "@/core/sun";

export const SKY_WORDS: Record<SkyKind, string> = { clear: "Clear", partly: "Partly cloudy", cloudy: "Cloudy", fog: "Fog", rain: "Rain", thunder: "Thunderstorms" };

// Sky colors: [top, middle, bottom] for each sky and time of day. Dawn and dusk warm the horizon; storms stay dark
// but still pick up a little color low in the sky at sunrise and sunset.
const DAY: Record<SkyKind, [string, string, string]> = {
  clear: ["#1F6FD1", "#4F97E3", "#9CCBF3"],
  partly: ["#2E6DB8", "#5B8FC9", "#A7C2DE"],
  cloudy: ["#4D5B6F", "#6D7A8D", "#9BA6B5"],
  fog: ["#5A6672", "#7C8792", "#A4ADB7"],
  rain: ["#2C3B51", "#45566E", "#6B7C94"],
  thunder: ["#161B28", "#262C3D", "#3E455B"],
};
const NIGHT: Record<SkyKind, [string, string, string]> = {
  clear: ["#060E24", "#0E1D40", "#22386A"],
  partly: ["#0D1834", "#18284C", "#33466E"],
  cloudy: ["#181F2B", "#252E3C", "#3B4555"],
  fog: ["#232A33", "#323B46", "#4A5460"],
  rain: ["#10161F", "#1C2533", "#2E3A4E"],
  thunder: ["#0C0F18", "#181C29", "#2B3044"],
};
const DAWN = { clear: ["#2B3F7E", "#B4708E", "#F4B27A"], soft: ["#3A4566", "#8B6F82", "#D59A7A"] };
const DUSK = { clear: ["#1E2A63", "#A2507A", "#F39A55"], soft: ["#2F3555", "#7D5872", "#C98466"] };

export function skyBackground(kind: SkyKind, phase: SkyPhase): string {
  const open = kind === "clear" || kind === "partly";
  const [a, b, c] =
    phase === "dawn" ? (open ? DAWN.clear : kind === "thunder" ? DAY.thunder : DAWN.soft)
    : phase === "dusk" ? (open ? DUSK.clear : kind === "thunder" ? DAY.thunder : DUSK.soft)
    : phase === "night" ? NIGHT[kind] : DAY[kind];
  return `linear-gradient(170deg, ${a} 0%, ${b} 55%, ${c} 100%)`;
}


type CloudTone = "light" | "gray" | "storm";
const CLOUD_TONES: Record<CloudTone, [string, string, string]> = {
  // highlight, body, underside
  light: ["#FFFFFF", "#EEF2F7", "#C3CCD8"],
  gray: ["#E4E9F0", "#B5BFCC", "#7F8B9C"],
  storm: ["#A3ADBF", "#636D82", "#2E3445"],
};
/** How much faster things move, and how far rain leans, for each wind level. */
const WIND_FX: Record<WindLevel, { speed: number; slant: number; streaks: number; debris: number }> = {
  calm: { speed: 1, slant: 6, streaks: 0, debris: 0 },
  breezy: { speed: 1.5, slant: 14, streaks: 2, debris: 0 },
  windy: { speed: 2.4, slant: 24, streaks: 4, debris: 3 },
  high: { speed: 3.6, slant: 36, streaks: 7, debris: 6 },
};

/** One soft, shaded cumulus made of overlapping puffs (each puff lit from the upper left). */
function Cloud({ tone }: { tone: CloudTone }) {
  const id = `wx-cl-${tone}`;
  return (
    <g>
      <ellipse cx="40" cy="20" rx="50" ry="13" fill={`url(#${id})`} />
      {[[0, 6, 20], [22, -8, 26], [50, -2, 22], [72, 8, 15], [36, 10, 20]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={`url(#${id})`} />
      ))}
    </g>
  );
}

type CloudSpot = { y: number; scale: number; layer: 0 | 1 | 2; offset: number };
// layer 0 = far (blurred, faint, slow), 1 = middle, 2 = near (crisp, fast). offset = where along its trip it starts.
const CLOUDS: Record<SkyKind, CloudSpot[]> = {
  clear: [],
  partly: [{ y: 30, scale: 1.3, layer: 1, offset: 0.55 }, { y: 70, scale: 0.9, layer: 0, offset: 0.2 }, { y: 6, scale: 1, layer: 2, offset: 0.85 }],
  cloudy: [{ y: 10, scale: 1.6, layer: 0, offset: 0.1 }, { y: 40, scale: 1.3, layer: 0, offset: 0.6 }, { y: 20, scale: 1.4, layer: 1, offset: 0.35 },
    { y: 70, scale: 1.1, layer: 1, offset: 0.8 }, { y: 0, scale: 1.2, layer: 2, offset: 0.5 }, { y: 95, scale: 0.9, layer: 2, offset: 0.05 }],
  fog: [{ y: 10, scale: 1.6, layer: 0, offset: 0.3 }, { y: 50, scale: 1.4, layer: 0, offset: 0.75 }, { y: 30, scale: 1.2, layer: 1, offset: 0.5 }],
  rain: [{ y: -10, scale: 1.8, layer: 0, offset: 0.15 }, { y: 20, scale: 1.5, layer: 0, offset: 0.65 }, { y: 0, scale: 1.4, layer: 1, offset: 0.4 },
    { y: 35, scale: 1.2, layer: 1, offset: 0.9 }, { y: -6, scale: 1.3, layer: 2, offset: 0.7 }, { y: 30, scale: 1.0, layer: 2, offset: 0.2 }],
  thunder: [{ y: -14, scale: 2, layer: 0, offset: 0.1 }, { y: 16, scale: 1.7, layer: 0, offset: 0.6 }, { y: -4, scale: 1.5, layer: 1, offset: 0.35 },
    { y: 30, scale: 1.3, layer: 1, offset: 0.85 }, { y: -10, scale: 1.4, layer: 2, offset: 0.55 }, { y: 26, scale: 1.1, layer: 2, offset: 0.15 }, { y: 4, scale: 1.2, layer: 2, offset: 0.95 }],
};
const LAYER = [
  { dur: 150, opacity: 0.55, blur: "url(#wx-blur-far)" },
  { dur: 95, opacity: 0.85, blur: "url(#wx-blur-soft)" },
  { dur: 62, opacity: 0.95, blur: undefined },
];

// Lightning: a jagged main stroke with a branch, drawn at two places on different, irregular timings.
const BOLTS = [
  { d: "M262 40 252 66 262 70 246 98 256 101 238 136", branch: "M252 66 236 80 240 88 226 104", flash: "wx-flash-a", cx: 252 },
  { d: "M148 30 156 54 146 58 160 84 150 88 166 120", branch: "M156 84 172 96 168 104 182 118", flash: "wx-flash-b", cx: 156 },
];

export function Sky({ kind, phase, wind, heatDanger }: { kind: SkyKind; phase: SkyPhase; wind: WindLevel; heatDanger: boolean }) {
  const daytime = phase !== "night";
  const low = phase === "dawn" || phase === "dusk"; // the sun sits low and orange
  const fx = WIND_FX[wind];
  const tone: CloudTone = kind === "thunder" ? "storm" : kind === "rain" || kind === "cloudy" || kind === "fog" ? "gray" : "light";
  const showSun = daytime && (kind === "clear" || kind === "partly");
  const showMoon = !daytime && (kind === "clear" || kind === "partly");
  const rain = kind === "rain" || kind === "thunder";
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMin slice" aria-hidden>
      <defs>
        {(Object.keys(CLOUD_TONES) as CloudTone[]).map((t) => (
          <radialGradient key={t} id={`wx-cl-${t}`} cx="0.35" cy="0.25" r="0.85">
            <stop offset="0" stopColor={CLOUD_TONES[t][0]} />
            <stop offset="0.55" stopColor={CLOUD_TONES[t][1]} />
            <stop offset="1" stopColor={CLOUD_TONES[t][2]} />
          </radialGradient>
        ))}
        <filter id="wx-blur-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" /></filter>
        <filter id="wx-blur-far" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="wx-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5" /></filter>
        <radialGradient id="wx-sun-glow"><stop offset="0" stopColor={low ? "#FFD3A0" : "#FFF1B8"} stopOpacity="0.95" /><stop offset="0.45" stopColor={low ? "#FF9E5E" : "#FFE08A"} stopOpacity="0.35" /><stop offset="1" stopColor="#FFE08A" stopOpacity="0" /></radialGradient>
        <radialGradient id="wx-sun-core" cx="0.4" cy="0.35"><stop offset="0" stopColor={low ? "#FFE2B8" : "#FFF6CF"} /><stop offset="1" stopColor={low ? "#FF8A3D" : "#FFC93C"} /></radialGradient>
        <linearGradient id="wx-horizon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB37A" stopOpacity="0" /><stop offset="1" stopColor="#FFB37A" stopOpacity="0.45" /></linearGradient>
        <radialGradient id="wx-moon-glow"><stop offset="0" stopColor="#FFF8DC" stopOpacity="0.45" /><stop offset="1" stopColor="#FFF8DC" stopOpacity="0" /></radialGradient>
        <linearGradient id="wx-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity="0.9" /></linearGradient>
        {BOLTS.map((b) => (
          <radialGradient key={b.flash} id={`${b.flash}-g`} cx={b.cx / 400} cy="0.35" r="0.75">
            <stop offset="0" stopColor="#F2EEFF" stopOpacity="0.95" /><stop offset="0.5" stopColor="#C9C2FF" stopOpacity="0.35" /><stop offset="1" stopColor="#C9C2FF" stopOpacity="0" />
          </radialGradient>
        ))}
        {/* Wind streaks and debris fade out on the left, so they never run through the temperature */}
        <linearGradient id="wx-right-g" x1="0" y1="0" x2="1" y2="0"><stop offset="0.45" stopColor="#000" /><stop offset="0.68" stopColor="#fff" /></linearGradient>
        <mask id="wx-right" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="200"><rect width="400" height="200" fill="url(#wx-right-g)" /></mask>
        <linearGradient id="wx-heat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFB070" stopOpacity="0" /><stop offset="1" stopColor="#FF9A4D" stopOpacity="0.35" /></linearGradient>
      </defs>

      {/* Warm glow along the horizon at sunrise and sunset */}
      {low && <rect x="0" y="110" width="400" height="90" fill="url(#wx-horizon)" />}

      {/* Sun or moon, behind the clouds */}
      {showSun && (
        <g transform={low ? "translate(318 150)" : "translate(320 56)"}>
          <circle r="80" fill="url(#wx-sun-glow)" className="wx-pulse" />
          <g className="wx-spin" opacity="0.55">
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M0 -40 L3 -64 L-3 -64Z" fill="#FFF0B3" transform={`rotate(${i * 22.5})`} opacity={i % 2 ? 0.5 : 0.9} />
            ))}
          </g>
          <circle r="26" fill="url(#wx-sun-core)" />
          {kind === "clear" && (
            <g fill="#FFF6D6" className="wx-flare">
              <circle cx="-70" cy="44" r="7" opacity="0.18" /><circle cx="-112" cy="70" r="12" opacity="0.1" /><circle cx="-150" cy="94" r="4" opacity="0.22" />
            </g>
          )}
        </g>
      )}
      {showMoon && (
        <g>
          {[[30, 24], [70, 58], [118, 18], [176, 44], [214, 14], [250, 70], [372, 126], [104, 96], [196, 96], [292, 22]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="#fff" className="wx-twinkle" style={{ animationDelay: `${(i * 0.73) % 3}s` }} />
          ))}
          <circle cx="322" cy="54" r="46" fill="url(#wx-moon-glow)" />
          <path d="M322 30a24 24 0 1 0 20 38 19 19 0 1 1-20-38z" fill="#F5EDCD" />
        </g>
      )}

      {/* A darker cloud deck along the top for rain and storms */}
      {(kind === "rain" || kind === "thunder") && (
        <rect x="-20" y="-20" width="440" height="90" rx="40" fill={kind === "thunder" ? "#2A3040" : "#6A788C"} opacity="0.55" filter="url(#wx-blur-far)" />
      )}

      {/* Clouds keep crossing the sky; far ones blurred and slow, near ones crisp and faster, all faster in wind */}
      {CLOUDS[kind].map((cl, i) => {
        const L = LAYER[cl.layer], dur = L.dur / fx.speed;
        return (
          <g key={i} className="wx-cross" style={{ animationDuration: `${dur}s`, animationDelay: `${-cl.offset * dur}s` }}>
            <g transform={`translate(0 ${cl.y}) scale(${cl.scale})`} opacity={L.opacity} filter={L.blur}>
              <Cloud tone={tone} />
            </g>
          </g>
        );
      })}

      {/* Lightning: the sky lights up, then the bolt; two strikes on their own irregular rhythms */}
      {kind === "thunder" && BOLTS.map((b) => (
        <g key={b.flash}>
          <rect x="0" y="0" width="400" height="200" fill={`url(#${b.flash}-g)`} className={b.flash} />
          <g className={`${b.flash}-bolt`} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={b.d} stroke="#B9B2FF" strokeWidth="7" filter="url(#wx-glow)" />
            <path d={b.branch} stroke="#B9B2FF" strokeWidth="4" filter="url(#wx-glow)" />
            <path d={b.d} stroke="#FFFFFF" strokeWidth="2.2" />
            <path d={b.branch} stroke="#FFFFFF" strokeWidth="1.3" />
          </g>
        </g>
      ))}

      {/* Rain in two depths, leaning with the wind */}
      {rain && (
        <g transform={`skewX(${-fx.slant})`}>
          {[{ n: 34, w: 1, h: 11, op: 0.35, dur: 1.05 }, { n: 26, w: 1.6, h: 19, op: 0.75, dur: 0.62 }].map((layer, li) =>
            Array.from({ length: layer.n }, (_, i) => {
              const x = ((i * 47 + li * 23) % 520) - 40 + (li ? 9 : 0), d = ((i * 37 + li * 11) % 100) / 100;
              return (
                <rect key={`${li}-${i}`} x={x} y={-24} width={layer.w} height={layer.h} rx={layer.w / 2} fill="url(#wx-drop)" opacity={layer.op}
                  className="wx-fall" style={{ animationDuration: `${layer.dur + (i % 3) * 0.08}s`, animationDelay: `${-d * 1.2}s` }} />
              );
            }),
          )}
        </g>
      )}

      {/* Fog: soft banks sliding past */}
      {kind === "fog" && (
        <g fill="#fff" filter="url(#wx-blur-far)">
          {[60, 92, 124, 156, 182].map((y, i) => (
            <rect key={y} x="-80" y={y} width="320" height="16" rx="8" opacity={0.34 - i * 0.04} className="wx-fog" style={{ animationDelay: `${-i * 2.7}s`, animationDuration: `${12 + i * 3}s` }} />
          ))}
        </g>
      )}

      {/* Wind: gust lines and blowing debris, more and faster as the wind picks up */}
      <g mask="url(#wx-right)">
      {fx.streaks > 0 && (
        <g fill="none" stroke="#fff" strokeLinecap="round">
          {Array.from({ length: fx.streaks }, (_, i) => {
            const y = 30 + ((i * 41) % 150), len = 70 + (i % 3) * 30;
            return (
              <path key={i} d={`M-120 ${y} q${len / 2} -8 ${len} 0 t${len} 0`} strokeWidth={i % 2 ? 1.2 : 1.8} opacity={0.35 + (i % 3) * 0.12}
                className="wx-streak" style={{ animationDuration: `${(2.6 - fx.speed * 0.35 + (i % 3) * 0.4).toFixed(2)}s`, animationDelay: `${-i * 0.55}s` }} />
            );
          })}
        </g>
      )}
      {fx.debris > 0 && Array.from({ length: fx.debris }, (_, i) => (
        <g key={i} className="wx-debris" style={{ animationDuration: `${(3.4 - fx.speed * 0.4 + (i % 3) * 0.5).toFixed(2)}s`, animationDelay: `${-i * 0.8}s`, ["--wx-y" as string]: `${60 + ((i * 37) % 110)}px` }}>
          <path d="M0 0c3-4 9-4 10 0-3 4-8 4-10 0z" fill={["#7C8F4E", "#A27B3E", "#8B9A6A"][i % 3]} className="wx-tumble" />
        </g>
      ))}
      </g>

      {/* Heat shimmer near the ground on dangerous heat days */}
      {heatDanger && (
        <g>
          <rect x="0" y="140" width="400" height="60" fill="url(#wx-heat)" />
          {[150, 162, 174, 186].map((y, i) => (
            <path key={y} d={`M-40 ${y} q20 -4 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} fill="none" stroke="#FFF3E0"
              strokeWidth="1.2" opacity={0.22 - i * 0.03} className="wx-shimmer" style={{ animationDelay: `${-i * 0.6}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}

/** Gradients the hour icons share. Render once wherever SkyIcon is used. */
export function SkyIconDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <radialGradient id="wxi-sun" cx="0.38" cy="0.35"><stop offset="0" stopColor="#FFE9A0" /><stop offset="1" stopColor="#F5A300" /></radialGradient>
        <radialGradient id="wxi-moon" cx="0.35" cy="0.35"><stop offset="0" stopColor="#F4F1E3" /><stop offset="1" stopColor="#B9C2D6" /></radialGradient>
        <linearGradient id="wxi-cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#C7D0DC" /></linearGradient>
        <linearGradient id="wxi-cloud-gray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D7DEE7" /><stop offset="1" stopColor="#8C98AA" /></linearGradient>
        <linearGradient id="wxi-cloud-storm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8E98AA" /><stop offset="1" stopColor="#4A5367" /></linearGradient>
        <linearGradient id="wxi-drop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CC0FF" /><stop offset="1" stopColor="#2F7FE0" /></linearGradient>
        <linearGradient id="wxi-bolt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE76A" /><stop offset="1" stopColor="#F5A300" /></linearGradient>
      </defs>
    </svg>
  );
}

/** Small icon for the hour strip: shaded sun, moon, clouds, rain, lightning and fog. */
export function SkyIcon({ kind, daytime, size = 32 }: { kind: SkyKind; daytime: boolean; size?: number }) {
  const cloud = (fill: string, dx = 0, dy = 0) => (
    <path d="M9 22.5a5 5 0 0 1 .6-10A6.8 6.8 0 0 1 22.6 11a5.4 5.4 0 0 1 .4 11.5z" fill={`url(#${fill})`} stroke="rgba(0,0,0,0.08)" strokeWidth=".6" transform={`translate(${dx} ${dy})`} />
  );
  const sun = (cx: number, cy: number, r: number) => (
    <g>
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={cx - 0.8} y={cy - r - 4.6} width="1.6" height="3" rx=".8" fill="#F5B000" transform={`rotate(${i * 45} ${cx} ${cy})`} />)}
      <circle cx={cx} cy={cy} r={r} fill="url(#wxi-sun)" />
    </g>
  );
  const moon = (cx: number, cy: number, r: number) => <path d={`M${cx + 1} ${cy - r}a${r} ${r} 0 1 0 ${r * 0.9} ${r * 1.55} ${r * 0.8} ${r * 0.8} 0 1 1 ${-r * 0.9} ${-r * 1.55}z`} fill="url(#wxi-moon)" />;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label={SKY_WORDS[kind]}>
      {kind === "clear" && (daytime ? sun(16, 16, 6.5) : moon(15, 16, 8))}
      {kind === "partly" && <>{daytime ? sun(11.5, 11, 5) : moon(11, 11, 6)}{cloud("wxi-cloud", 2, 4)}</>}
      {kind === "cloudy" && <>{cloud("wxi-cloud-gray", -3, 0)}{cloud("wxi-cloud", 2, 4)}</>}
      {kind === "fog" && <>{cloud("wxi-cloud-gray", 0, -2)}<g stroke="#9AA6B6" strokeWidth="2" strokeLinecap="round"><path d="M6 24h20M9 28h16" /></g></>}
      {kind === "rain" && <>{cloud("wxi-cloud-gray", 0, -3)}{[[11, 23], [16, 25], [21, 23]].map(([x, y]) => <path key={x} d={`M${x} ${y}c-1.4 2.2-1.4 3.6 0 3.6s1.4-1.4 0-3.6z`} fill="url(#wxi-drop)" />)}</>}
      {kind === "thunder" && <>{cloud("wxi-cloud-storm", 0, -4)}<path d="M17 17.5 12.5 25h3.6l-1.6 5.5 6.2-8.3h-3.8l2-3.7z" fill="url(#wxi-bolt)" stroke="#8A5A00" strokeWidth=".5" strokeLinejoin="round" /><path d="M10 22l-1 2.4M23 22l-1 2.4" stroke="#5FAEF5" strokeWidth="1.6" strokeLinecap="round" /></>}
    </svg>
  );
}

/** Sun on the horizon with an arrow: up for sunrise, down for sunset. */
export function SunEventIcon({ rise, size = 28 }: { rise: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M8 22a8 8 0 0 1 16 0z" fill="url(#wxi-sun)" />
      <path d="M4 23h24" stroke="#F5A300" strokeWidth="1.8" strokeLinecap="round" />
      <path d={rise ? "M16 4v6M13 7l3-3 3 3" : "M16 4v6M13 7l3 3 3-3"} stroke="#F5A300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
