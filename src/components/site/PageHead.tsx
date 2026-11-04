/** Heading block that opens a page: the pill label, the page's only h1 and an optional lead. */
export default function PageHead({
  label,
  title,
  lead,
  children,
}: {
  label: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="phead enter enter--up">
      <span className="pill mono">{label}</span>
      <h1 className="phead__title">{title}</h1>
      {lead && <p className="phead__lead">{lead}</p>}
      {children}
    </header>
  );
}
