import SectionTag from "./SectionTag";

export default function PageHero({ tag, title, lead, center = true, className = "" }) {
  return (
    <header className={`page-hero ${center ? "text-center" : ""} ${className}`}>
      {tag && <SectionTag>{tag}</SectionTag>}
      <h1 className="section-title mt-6">{title}</h1>
      {lead && <p className={`section-lead mt-5 ${center ? "mx-auto" : ""}`}>{lead}</p>}
    </header>
  );
}
