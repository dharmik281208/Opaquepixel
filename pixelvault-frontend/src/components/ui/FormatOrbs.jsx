const FORMATS = [
  { id: "PDF", tone: "purple" },
  { id: "DOCX", tone: "blue" },
  { id: "PPTX", tone: "pink" },
  { id: "PNG", tone: "purple" },
  { id: "MP4", tone: "blue" },
  { id: "MP3", tone: "pink" },
  { id: "WAV", tone: "purple" },
  { id: "FLAC", tone: "blue" },
  { id: "OGG", tone: "pink" },
  { id: "M4A", tone: "purple" },
  { id: "XLSX", tone: "blue" },
  { id: "TXT", tone: "pink" },
];

export default function FormatOrbs() {
  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
      {FORMATS.map(({ id, tone }) => (
        <div key={id} className={`format-orb format-orb-${tone}`} title={id}>
          <span>{id}</span>
        </div>
      ))}
    </div>
  );
}
