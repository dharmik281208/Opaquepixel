const THEME_KEY = "opaquepixel_theme";

export function getInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) return saved;
  return "green";
}

export function applyTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === "bw") {
    document.documentElement.setAttribute("data-theme", "bw");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
