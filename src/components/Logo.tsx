// The product's logo (PLACEHOLDER, direction D, chosen by Joe 2026-10-09): the name in heavy, wide letters with a
// level line under it and the keel hanging below. Drawn as outlines (src/content/logo.json), so it looks the same
// everywhere with no font loading. Colors follow the theme: letters in the text color, line and keel in the brand.
import { logo } from "@/content/logo";
import { BRAND } from "@/content/brand";

const W = logo.wordmark;

/** The full wordmark. `height` is the whole logo's height in px; the width follows. */
export function Wordmark({ height = 40, className = "" }: { height?: number; className?: string }) {
  const [, , w, h] = W.viewBox.split(" ").map(Number);
  return (
    <svg role="img" aria-label={BRAND.name} viewBox={W.viewBox} height={height} width={(height * w) / h} className={className}>
      <path d={W.word} fill="currentColor" />
      <rect x={W.line.x} y={W.line.y} width={W.line.w} height={W.line.h} rx={W.line.h / 2} fill="var(--brand)" />
      <path d={W.keel} fill="var(--brand)" />
    </svg>
  );
}
