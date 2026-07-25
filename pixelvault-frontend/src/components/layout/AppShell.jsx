import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <PixelCipherBg />
      <CursorGlow />
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300 ${
            scrolled ? "glass shadow-[0_8px_30px_-12px_rgba(34,34,59,0.15)]" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.65_0.10_305)] to-[oklch(0.80_0.03_25)] text-[color:var(--cream)] font-display font-bold shadow-[var(--shadow-soft)] transition-transform group-hover:scale-105">
              O
              <span className="absolute inset-0 rounded-lg ring-1 ring-white/30" />
            </span>
            <span className="font-display font-semibold tracking-tight text-[color:var(--ink)]">
              Opaque<span className="text-[color:var(--orchid)]">Pixel</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === "/"}
                  className={({ isActive }) =>
                    `relative px-3 py-1.5 rounded-full transition-colors ${
                      isActive
                        ? "text-[color:var(--ink)] bg-[color:color-mix(in_oklab,var(--lilac)_18%,transparent)] font-medium"
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
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{<Outlet />}</main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[color:var(--border)] bg-[color:color-mix(in_oklab,var(--background)_82%,var(--lilac)_6%)] backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-3">
          <div>
            <div className="font-display text-lg font-semibold text-[color:var(--ink)]">
              Opaque<span className="text-[color:var(--orchid)]">Pixel</span>
            </div>
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
