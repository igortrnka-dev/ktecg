import type { Dictionary } from "@/i18n";

export default function Footer({ t, updated }: { t: Dictionary; updated: string }) {
  return (
    <footer className="footer">
      <span><span className="mono faint">{t.footer.updated}</span> {updated}</span>
      <span><span className="mono faint">©</span> {new Date().getFullYear()} {t.footer.company}</span>
      <span><span className="mono faint">{t.footer.made}</span> {t.footer.country}</span>
    </footer>
  );
}
