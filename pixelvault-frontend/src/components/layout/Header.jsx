import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Logo";
import { isAuthenticated, clearAccessToken } from "../../utils/auth";
import { getInitialTheme, applyTheme } from "../../utils/theme";

const PUBLIC_LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#pipeline", label: "Pipeline" },
  { href: "/#formats", label: "Formats" },
  { href: "/#access", label: "Access" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = isAuthenticated();
  const onHome = location.pathname === "/";
  const [theme, setThemeState] = useState(getInitialTheme());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === "bw" ? "green" : "bw";
    setThemeState(next);
    applyTheme(next);
  };

  const logout = () => {
    clearAccessToken();
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const scrollToAccess = () => {
    setMobileMenuOpen(false);
    if (onHome) {
      document.getElementById("access")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#access");
    }
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header relative z-40">
      <div className="site-container flex items-center justify-between gap-4 py-3">
        <Link to={authed ? "/hide" : "/"} onClick={handleLinkClick} className="header-logo shrink-0">
          <Logo size="sm" showText={true} />
        </Link>

        {/* Desktop Nav Pill */}
        <nav className="nav-pill hidden md:flex items-center gap-1 mx-auto" aria-label="Main Desktop">
          {authed ? (
            <>
              <Link
                to="/hide"
                className={`nav-link ${location.pathname === "/hide" ? "nav-link-active" : ""}`}
              >
                Hide
              </Link>
              <Link
                to="/reveal"
                className={`nav-link ${location.pathname === "/reveal" ? "nav-link-active" : ""}`}
              >
                Reveal
              </Link>
              <Link
                to="/scan"
                className={`nav-link ${location.pathname === "/scan" ? "nav-link-active" : ""}`}
              >
                Scan &amp; Decode
              </Link>
              <Link
                to="/how-it-works"
                className={`nav-link ${location.pathname === "/how-it-works" ? "nav-link-active" : ""}`}
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className={`nav-link ${location.pathname === "/contact" ? "nav-link-active" : ""}`}
              >
                Contact &amp; Collab
              </Link>
            </>
          ) : (
            <>
              {PUBLIC_LINKS.map(({ href, label }) => (
                <a key={href} href={href} className="nav-link">
                  {label}
                </a>
              ))}
              <Link
                to="/how-it-works"
                className={`nav-link ${location.pathname === "/how-it-works" ? "nav-link-active" : ""}`}
              >
                How It Works
              </Link>
              <Link
                to="/contact"
                className={`nav-link ${location.pathname === "/contact" ? "nav-link-active" : ""}`}
              >
                Contact &amp; Collab
              </Link>
            </>
          )}
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

          {authed ? (
            <button type="button" onClick={logout} className="btn-ghost text-xs px-4 sm:px-5 py-2 sm:py-2.5 font-medium tracking-wide">
              Exit
            </button>
          ) : (
            <button type="button" onClick={scrollToAccess} className="btn-talk">
              Enter
            </button>
          )}

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

      {/* Mobile Glass Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-4 top-20 z-50 glass rounded-3xl p-4 shadow-2xl border border-emerald-500/30 animate-fade-up">
          <nav className="flex flex-col gap-2" aria-label="Main Mobile">
            {authed ? (
              <>
                <Link
                  to="/hide"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/hide" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  Hide
                </Link>
                <Link
                  to="/reveal"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/reveal" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  Reveal
                </Link>
                <Link
                  to="/scan"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/scan" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  Scan &amp; Decode
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/how-it-works" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/contact" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  Contact &amp; Collab
                </Link>
              </>
            ) : (
              <>
                {PUBLIC_LINKS.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={handleLinkClick}
                    className="px-4 py-3 rounded-2xl text-sm font-medium text-surface-dim hover:text-white hover:bg-white/5 transition-all"
                  >
                    {label}
                  </a>
                ))}
                <Link
                  to="/how-it-works"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/how-it-works" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className={`px-4 py-3 rounded-2xl text-sm font-medium transition-all ${location.pathname === "/contact" ? "bg-white text-black font-bold" : "text-surface-dim hover:text-white hover:bg-white/5"}`}
                >
                  Contact &amp; Collab
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
