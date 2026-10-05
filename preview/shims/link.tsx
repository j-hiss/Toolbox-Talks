// Stand-in for next/link in the preview: a real <a> that navigates in-page.
import type { AnchorHTMLAttributes } from "react";
import { navigate } from "./router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; replace?: boolean };

export default function Link({ href, onClick, prefetch: _p, replace: _r, ...rest }: Props) {
  void _p; void _r;
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || href.startsWith("http")) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    />
  );
}
