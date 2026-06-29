import SectionTag from "./SectionTag";

export default function SectionHeading({ tag, title, lead, center = false, className = "" }) {
  return (
    <div className={`${center ? "text-center mx-auto max-w-2xl" : ""} ${className}`}>
      {tag && <SectionTag>{tag}</SectionTag>}
      {title && (
        <h2 className={`font-display text-2xl md:text-4xl font-bold text-white ${tag ? "mt-6" : ""}`}>
          {title}
        </h2>
      )}
      {lead && <p className="text-sm md:text-base text-surface-dim mt-4 leading-relaxed">{lead}</p>}
    </div>
  );
}
