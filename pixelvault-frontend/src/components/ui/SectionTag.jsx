export default function SectionTag({ children, className = "" }) {
  return <span className={`section-tag ${className}`}>{children}</span>;
}
