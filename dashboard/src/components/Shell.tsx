import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import NavLink from "./NavLink";
import { GlossaryProvider } from "./GlossaryTerm";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <GlossaryProvider>
      <header className="site-head">
        <div className="site-head-in">
          <Link href="/" className="brand" aria-label="SEPIQ 2026 Intelligence, home">
            <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" className="brand-mark">
              <ellipse cx="20" cy="20" rx="18" ry="13" />
              <ellipse cx="20" cy="20" rx="12" ry="8" />
              <ellipse cx="20" cy="20" rx="6" ry="3.6" />
            </svg>
            <span>SEPIQ 2026 <b>Intelligence</b></span>
          </Link>
          <nav aria-label="Sections" className="nav">
            {ROUTES.map((r) => (
              <NavLink key={r.href} href={r.href}>{r.label}</NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="page">{children}</main>
      <footer className="site-foot">
        Built from a research hive. Every number opens to the file it came from. Nothing here is a leaderboard score: the challenge portal returns none.
      </footer>
    </GlossaryProvider>
  );
}
