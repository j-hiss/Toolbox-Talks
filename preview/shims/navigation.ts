// Stand-in for next/navigation in the preview.
import { navigate, usePreviewPath } from "./router";

export function useRouter() {
  return { push: navigate, replace: navigate, back: () => navigate("/"), refresh: () => {}, prefetch: () => {} };
}
export const usePathname = usePreviewPath;
export function useSearchParams() { return new URLSearchParams(); }
