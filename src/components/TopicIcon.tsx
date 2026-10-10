// The small topic icon next to a talk's title (src/core/topics.ts). Simple line drawings on the brand tint, our own,
// so they print and scale cleanly and match the tab bar icons.
import { TOPICS, talkTopic, type TopicId } from "@/core/topics";
import type { Talk } from "@/core/talks";

const PATHS: Record<TopicId, React.ReactNode> = {
  weather: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  falls: <><path d="M7 3v18M17 3v18M7 8h10M7 13h10M7 18h10" /></>,
  electrical: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  fire: <path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z" />,
  air: <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" /><path d="M7.5 15h9" /></>,
  vehicles: <><path d="M2 6h12v10H2zM14 10h4l4 3v3h-8" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
  tools: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  body: <><path d="M4 17h16M5 17v-2a7 7 0 0 1 14 0v2" /><path d="M10 8V5h4v3" /></>,
  health: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  people: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  spaces: <><path d="M3 8h18" /><path d="M6 8v12h12V8M9 12h6M9 16h6" /></>,
  general: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" /></>,
};

/** Icon only (decorative; the title says what the talk is). */
export function TopicIcon({ talk, size = 36 }: { talk: Pick<Talk, "id" | "content">; size?: number }) {
  const topic = talkTopic(talk);
  return (
    <span aria-hidden title={TOPICS[topic]} className="flex shrink-0 items-center justify-center rounded-[10px] bg-brand-soft text-brand-text" style={{ width: size, height: size }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{PATHS[topic]}</svg>
    </span>
  );
}

/** Icon with the topic's name, for a talk's header. */
export function TopicChip({ talk }: { talk: Pick<Talk, "id" | "content"> }) {
  const topic = talkTopic(talk);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft py-0.5 pl-1 pr-2.5 text-xs font-semibold text-brand-text">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>{PATHS[topic]}</svg>
      {TOPICS[topic]}
    </span>
  );
}
