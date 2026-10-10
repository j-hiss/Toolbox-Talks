// The three steps of a talk or daily plan, named, so the presenter always sees what's next. A real sequence, so
// numbered; finished steps get a tick. The full step name is read out to screen readers.
export function Steps({ n, label, names }: { n: 1 | 2 | 3; label: string; names: readonly [string, string, string] }) {
  return (
    <div className="mb-4">
      <p className="sr-only">Step {n} of 3: {label}</p>
      <ol className="flex gap-1.5" aria-hidden>
        {names.map((name, j) => {
          const i = j + 1;
          return (
            <li key={name} className="flex-1">
              <span className={`block h-1.5 rounded-full ${i <= n ? "bg-brand" : "bg-line"}`} />
              <span className={`mt-1.5 flex items-center gap-1.5 text-[13px] ${i === n ? "font-semibold text-fg" : i < n ? "text-brand-text" : "text-muted"}`}>
                <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] font-bold tabular-nums ${i < n ? "bg-brand text-brand-ink" : i === n ? "bg-fg text-bg" : "bg-line text-muted"}`}>{i < n ? "✓" : i}</span>
                {name}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
