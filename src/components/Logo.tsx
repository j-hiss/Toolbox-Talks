// The product logo (PLACEHOLDER, Salvant direction D, chosen by Joe 2026-10-09): bold lowercase "salvant" with a
// rule under it. Drawn as outlines (src/content/logo.json), so it looks the same everywhere with no font loading.
// Letters take the text color; the rule takes the brand color, so it follows the company's theme in the app.
import { logo } from "@/content/logo";
import { BRAND } from "@/content/brand";

const P = logo.product;

/** The product wordmark. `height` is the whole logo's height in px; the width follows. */
export function Wordmark({ height = 40, className = "" }: { height?: number; className?: string }) {
  const [, , w, h] = P.viewBox.split(" ").map(Number);
  return (
    <svg role="img" aria-label={BRAND.name} viewBox={P.viewBox} height={height} width={(height * w) / h} className={className}>
      <path d={P.word} fill="currentColor" />
      <rect x={P.bar.x} y={P.bar.y} width={P.bar.w} height={P.bar.h} rx={P.bar.h / 2} fill="var(--brand)" />
      <circle cx={P.dot.cx} cy={P.dot.cy} r={P.dot.r} fill="var(--brand)" />
    </svg>
  );
}
