// Published preview only (npm run preview:publish): the crew's own-phone sign-in page (src/app/checkin/page.tsx) is
// left out, because the Artifact publisher refuses the page with it in, and a crew member's phone can't open a
// private preview link anyway. The real page is in every app build and is tested by the phone walkthrough
// (scripts/preview-e2e.mjs, scenario 21), which uses the full preview build (npm run preview:build).
import { Eyebrow, Mark, Notice, Title } from "@/components/ui";
import { BRAND } from "@/content/brand";

export default function CheckinPagePreviewStub() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-12">
      <header className="-mx-4 flex items-center gap-2.5 border-b border-line/60 px-5 py-3">
        <Mark size={28} /><span className="text-[15px] font-semibold">{BRAND.name}</span>
      </header>
      <main className="page-in pt-6">
        <Eyebrow>Crew sign-in</Eyebrow>
        <Title>On the crew&apos;s phone</Title>
        <div className="mt-4"><Notice>In the real app, scanning the code opens this page on the crew member&apos;s phone: they tap their name, tap the statement and sign. It can&apos;t run inside this preview.</Notice></div>
      </main>
    </div>
  );
}
