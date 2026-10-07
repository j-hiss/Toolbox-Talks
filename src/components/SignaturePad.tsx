"use client";

// Finger signature. Exports a small PNG (max 480 px wide) so signatures fit in the phone's offline outbox.
import { useEffect, useRef } from "react";
import type { Signature } from "@/core/record";

const EXPORT_WIDTH = 480;

export function SignaturePad({ label, value, onChange, tall = false, hint = "Sign above", locked = null }: {
  label: string; value: Signature | null; onChange: (s: Signature | null) => void; tall?: boolean; hint?: string;
  /** When set, the pad takes no ink and shows this message over it (e.g. "Tap the box above first"). */
  locked?: string | null;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const dirty = useRef(false);

  // Size the canvas to its box (sharp on high-density screens) and redraw a saved signature.
  useEffect(() => {
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const r = cv.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(r.width * dpr));
    cv.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height);
      img.src = value.image;
    }
    // Only on mount: later value changes come from this pad itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = (e: React.PointerEvent) => {
    const b = canvas.current!.getBoundingClientRect();
    return [e.clientX - b.left, e.clientY - b.top] as const;
  };

  const finish = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (!dirty.current) return;
    const cv = canvas.current!;
    const out = document.createElement("canvas");
    out.width = Math.min(EXPORT_WIDTH, cv.width);
    out.height = Math.round((cv.height / cv.width) * out.width);
    out.getContext("2d")!.drawImage(cv, 0, 0, out.width, out.height);
    onChange({ image: out.toDataURL("image/png"), signedAt: new Date().toISOString() });
  };

  const clear = () => {
    const cv = canvas.current!;
    cv.getContext("2d")!.clearRect(0, 0, cv.width, cv.height);
    dirty.current = false;
    onChange(null);
  };

  return (
    <div>
      <div className="relative">
      <canvas
        ref={canvas}
        aria-label={`Signature pad for ${label}`}
        className={`block w-full touch-none rounded-md border-2 border-dashed bg-white ${tall ? "h-[min(42vh,320px)] border-muted" : "h-36 border-line"}`}
        onPointerDown={(e) => {
          drawing.current = true;
          dirty.current = true;
          canvas.current!.setPointerCapture(e.pointerId);
          const ctx = canvas.current!.getContext("2d")!;
          ctx.beginPath();
          ctx.moveTo(...point(e));
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const ctx = canvas.current!.getContext("2d")!;
          ctx.lineTo(...point(e));
          ctx.stroke();
        }}
        onPointerUp={finish}
        onPointerCancel={finish}
        style={locked ? { pointerEvents: "none", opacity: 0.35 } : undefined}
        aria-disabled={!!locked}
      />
      {locked && <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center text-base font-semibold text-[#3D4A5A]">{locked}</p>}
      </div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className={value ? "font-semibold text-ok-text" : "text-muted"}>
          {value ? `Signed ${new Date(value.signedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : hint}
        </span>
        {value && <button type="button" onClick={clear} className="min-h-11 px-2 font-semibold text-brand-text underline underline-offset-2">Clear</button>}
      </div>
    </div>
  );
}
