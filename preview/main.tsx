// Entry for the phone preview. Mounts the real app's pages with the real providers; the router and data are swapped
// by preview/vite.config.ts. The banner at the bottom is the only preview-only UI.
import "./preview.css";
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Providers } from "@/components/Providers";
import HomePage from "@/app/page";
import SignIn from "@/app/sign-in/page";
import Setup from "@/app/setup/page";
import AdminPage from "@/app/admin/page";
import TalkPage from "@/app/talk/page";
import RecordsPage from "@/app/records/page";
import RecordPage from "@/app/record/page";
import ReportsPage from "@/app/reports/page";
import ProfilePage from "@/app/profile/page";
import SharePage from "@/app/share/page";
import VerifyPage from "@/app/verify/page";
import InspectPage from "@/app/inspect/page";
import TrainerPage from "@/app/trainer/page";
import PartnerPage from "@/app/partner/page";
import { usePreviewPath } from "./shims/router";
import { DEMO_CODE } from "./demo/supabase";
import { resetDemo } from "./demo/store";
import { seedExample, viewAs } from "./demo/example";

declare const __BUILT_AT__: string;

const ROUTES: Record<string, () => React.ReactElement> = {
  "/": () => <HomePage />,
  "/sign-in/": () => <SignIn />,
  "/setup/": () => <Setup />,
  "/admin/": () => <AdminPage />,
  "/talk/": () => <TalkPage />,
  "/records/": () => <RecordsPage />,
  "/record/": () => <RecordPage />,
  "/reports/": () => <ReportsPage />,
  "/profile/": () => <ProfilePage />,
  "/share/": () => <SharePage />,
  "/verify/": () => <VerifyPage />,
  "/inspect/": () => <InspectPage />,
  "/trainer/": () => <TrainerPage />,
  "/partner/": () => <PartnerPage />,
};

function Banner() {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);
  // Collapsed to a small chip so it never covers the app's own buttons or tab bar.
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-[45%] z-50 rounded-l border border-r-0 border-action bg-surface/90 px-0.5 py-2 font-display text-[10px] font-semibold opacity-80 shadow [writing-mode:vertical-rl]"
        aria-expanded="false"
        aria-label="Show preview options"
      >
        Preview
      </button>
    );
  }
  return (
    <div className="fixed inset-x-0 top-0 z-50 border-b border-action bg-surface px-4 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-2 text-xs shadow-lg">
      <div className="mx-auto flex max-w-xl flex-wrap items-center gap-x-3 gap-y-1">
        <b className="font-display text-sm">Preview</b>
        <span className="text-muted">Demo data on this phone · signed in automatically (code <b className="text-fg tabular-nums">{DEMO_CODE}</b> if you sign out) · built {__BUILT_AT__}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <select aria-label="View as" className="rounded border border-line bg-surface px-1 py-1 font-semibold" defaultValue=""
            onChange={(e) => { const msg = viewAs(e.target.value as Parameters<typeof viewAs>[0]); if (msg === "ok") window.location.reload(); else setSeedMsg(msg); }}>
            <option value="" disabled>View as…</option>
            <option value="owner">Owner</option><option value="admin">Admin</option><option value="presenter">Presenter</option>
            <option value="office">Office</option><option value="employee">Employee</option><option value="trainer">Trainer</option><option value="partner">Insurance partner</option>
          </select>
          <button
            className="rounded border border-line px-2 py-1 font-semibold"
            onClick={() => { const msg = seedExample(); if (msg === "Example history added.") window.location.reload(); else setSeedMsg(msg); }}
          >
            {seedMsg ?? "Add example history"}
          </button>
          <button
            className={`rounded border px-2 py-1 font-semibold ${confirm ? "border-warn text-warn-text" : "border-line"}`}
            onClick={() => {
              if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 4000); return; }
              resetDemo();
              window.location.reload();
            }}
          >
            {confirm ? "Tap again to erase" : "Reset demo"}
          </button>
          <button className="rounded border border-line px-2 py-1 font-semibold" onClick={() => setOpen(false)} aria-label="Hide preview bar">Hide ▴</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const path = usePreviewPath();
  const page = ROUTES[path] ?? ROUTES["/"];
  return (
    <Providers>
      {page()}
      <Banner />
    </Providers>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
