import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo";
import { getInitialTheme, applyTheme } from "../../utils/theme";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/hide", label: "Hide" },
  { to: "/reveal", label: "Reveal" },
  { to: "/scan", label: "Scan & Decode" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact & Collab" },
];

export default function Header() {
  const location = useLocation();
  const [theme, setThemeState] = useState(getInitialTheme());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === "bw" ? "green" : "bw";
    setThemeState(next);
    applyTheme(next);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header relative z-40">
      <div className="site-container flex items-center justify-between gap-4 py-3">
        <Link to="/" onClick={handleLinkClick} className="header-logo shrink-0">
          <Logo size="sm" showText={true} />
        </Link>

        {/* Desktop Nav Pill */}
        <nav className="nav-pill hidden md:flex items-center gap-1 mx-auto" aria-label="Main Desktop">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? "nav-link-active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="header-actions flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost p-2.5 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            title={theme === "bw" ? "Switch to Dark Emerald Mode" : "Switch to Monochrome White Mode"}
            aria-label="Toggle Theme"
          >
            <div className={`transition-transform duration-500 ease-out ${theme === "bw" ? "rotate-180" : "rotate-0"}`}>
              {theme === "bw" ? (
                <svg className="w-4 h-4 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
                </svg>
              )}
            </div>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden btn-ghost p-2.5 flex items-center justify-center rounded-full text-white"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Glass Backdrop Blur Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-50 bg-black/85 backdrop-blur-3xl saturate-200 rounded-3xl p-5 shadow-2xl border border-emerald-500/40 animate-fade-up overflow-hidden">
          <nav className="flex flex-col gap-2" aria-label="Main Mobile">
            {NAV_ITEMS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={handleLinkClick}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === to ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/10"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
