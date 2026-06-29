import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container flex flex-col sm:flex-row items-center justify-between gap-6 py-10">
        <Logo size="sm" />
        <p className="text-xs text-surface-muted tracking-wide">
          © {new Date().getFullYear()} Opaque Pixel · Educational steganography
        </p>
      </div>
    </footer>
  );
}
