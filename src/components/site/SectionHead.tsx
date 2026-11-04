export default function SectionHead({
  label,
  title,
  lead,
  id,
}: {
  label: string;
  title: string;
  lead?: string;
  /** id of the h2, for a section labelled by its heading. */
  id?: string;
}) {
  return (
    <div className="shead" data-reveal>
      <span className="pill mono">{label}</span>
      <h2 className="shead__title" id={id}>{title}</h2>
      {lead && <p className="shead__lead">{lead}</p>}
    </div>
  );
}
