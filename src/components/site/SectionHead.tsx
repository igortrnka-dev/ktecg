export default function SectionHead({ label, title, lead }: { label: string; title: string; lead?: string }) {
  return (
    <div className="shead" data-reveal>
      <span className="pill mono">{label}</span>
      <h2 className="shead__title">{title}</h2>
      {lead && <p className="shead__lead">{lead}</p>}
    </div>
  );
}
