"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const p = (usePathname() || "/").replace(/(.)\/$/, "$1");
  const current = href === "/" ? p === "/" : p === href || p.startsWith(href + "/");
  return (
    <Link href={href} className="navlink" aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
