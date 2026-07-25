import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { CursorGlow } from "../ui/CursorGlow";
import { PixelCipherBg } from "../ui/PixelCipherBg";

const nav = [
  { to: "/", label: "Home" },
  { to: "/hide", label: "Hide" },
  { to: "/reveal", label: "Reveal" },
  { to: "/scan", label: "Scan" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/contact", label: "Contact" },
];

export default function AppShell() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <PixelCipherBg />
      <CursorGlow />
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 glass bg-[color:color-mix(in_oklab,var(--card)_85%,transparent)] backdrop-blur-xl border border-[color:color-mix(in_oklab,var(--lilac)_22%,transparent)] shadow-[0_8px_30px_-12px_rgba(34,34,59,0.15)] transition-all duration-300"
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo size="sm" showText={true} />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 rounded-full transition-colors ${
                      isActive
                        ? "text-[color:var(--ink)] bg-[color:color-mix(in_oklab,var(--lilac)_20%,transparent)] font-semibold shadow-sm"
                        : "text-[color:var(--slate)] hover:text-[color:var(--ink)]"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/hide"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[color:var(--ink)] px-4 py-2 text-sm font-medium text-[color:var(--cream)] transition-all hover:bg-[color:var(--orchid)] hover:shadow-[var(--shadow-glow)]"
            >
              Launch tool →
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden flex items-center justify-center p-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)] text-[color:var(--ink)] hover:border-[color:var(--orchid)]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 mx-auto max-w-6xl rounded-2xl border border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--card)_95%,var(--background)_5%)] backdrop-blur-2xl p-4 shadow-2xl animate-float-in">
            <nav className="flex flex-col gap-1.5">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[color:var(--ink)] text-[color:var(--cream)] font-semibold"
                        : "text-[color:var(--slate)] hover:text-[color:var(--ink)] hover:bg-[color:var(--muted)]"
                    }`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
              <Link
                to="/hide"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center rounded-xl bg-[color:var(--orchid)] px-4 py-2.5 text-sm font-semibold text-white shadow-md"
              >
                Launch tool →
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{<Outlet />}</main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_82%,var(--lilac)_6%)] backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <Logo size="sm" showText={true} />
            <p className="mt-3 text-sm text-[color:var(--slate)] max-w-xs">
              Encrypted steganography for research, education, and lawful privacy.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)]">Tools</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/hide" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">Hide payload</Link></li>
              <li><Link to="/reveal" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">Reveal payload</Link></li>
              <li><Link to="/scan" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">Forensic scan</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-[color:var(--dusk)]">Project</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/how-it-works" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">How it works</Link></li>
              <li><Link to="/contact" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">Contact</Link></li>
              <li><a href="https://github.com/dharmik281208" target="_blank" rel="noreferrer" className="text-[color:var(--slate)] hover:text-[color:var(--orchid)]">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[color:var(--border)]">
          <div className="mx-auto max-w-6xl px-6 py-5 text-xs text-[color:var(--dusk)] flex flex-wrap items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Opaque Pixel · Dharmik Suhagiya</span>
            <span>AES-256-GCM · PBKDF2 600k · Lawful use only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
