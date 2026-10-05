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
import { usePreviewPath } from "./shims/router";
import { DEMO_CODE } from "./demo/supabase";
import { resetDemo } from "./demo/store";

declare const __BUILT_AT__: string;

const ROUTES: Record<string, () => React.ReactElement> = {
  "/": () => <HomePage />,
  "/sign-in/": () => <SignIn />,
  "/setup/": () => <Setup />,
  "/admin/": () => <AdminPage />,
  "/talk/": () => <TalkPage />,
  "/records/": () => <RecordsPage />,
  "/record/": () => <RecordPage />,
};

function Banner() {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-hivis bg-surface px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] text-xs">
      <div className="mx-auto flex max-w-xl flex-wrap items-center gap-x-3 gap-y-1">
        <b className="font-display text-sm uppercase tracking-wide">Preview</b>
        <span className="text-muted">Demo data on this phone · signed in automatically (code <b className="text-fg tabular-nums">{DEMO_CODE}</b> if you sign out) · built {__BUILT_AT__}</span>
        <button
          className={`ml-auto rounded border px-2 py-1 font-bold ${confirm ? "border-warn text-warn" : "border-line"}`}
          onClick={() => {
            if (!confirm) { setConfirm(true); setTimeout(() => setConfirm(false), 4000); return; }
            resetDemo();
            window.location.reload();
          }}
        >
          {confirm ? "Tap again to erase" : "Reset demo"}
        </button>
      </div>
    </div>
  );
}

function App() {
  const path = usePreviewPath();
  const page = ROUTES[path] ?? ROUTES["/"];
  return (
    <Providers>
      <div className="pb-20">{page()}</div>
      <Banner />
    </Providers>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
