/** Trail above the heading of a subpage. The last item is the page itself and is not a link. */
export default function Breadcrumbs({ label, items }: { label: string; items: { name: string; href?: string }[] }) {
  return (
    <nav className="crumbs mono enter enter--up" aria-label={label}>
      <ol>
        {items.map((item) => (
          <li key={item.name}>
            {item.href ? <a href={item.href}>{item.name}</a> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
