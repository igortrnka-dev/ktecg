import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";
import NavLink from "@/components/admin/NavLink";
import Icon from "@/components/admin/Icon";
import { isDemo } from "@/lib/demo/mode";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/admin" className="brand">
          <span className="brand__mark" aria-hidden>K</span>
          <span>KTechnology<small>Obchod a leady</small></span>
        </Link>
        <nav className="side__nav" aria-label="Hlavné menu">
          <span className="side__label">Menu</span>
          <NavLink href="/admin" icon="home">Prehľad</NavLink>
          <NavLink href="/admin/leads" icon="leads">Leady</NavLink>
          <NavLink href="/admin/inquiries" icon="inbox">Dopyty z webu</NavLink>
          <NavLink href="/admin/campaigns" icon="spark">AI vyhľadávanie</NavLink>
          <NavLink href="/admin/settings" icon="settings">Nastavenia</NavLink>
        </nav>
        <div className="side__foot">
          <span className="side__user">{user.email}</span>
          <a href="/" target="_blank" rel="noreferrer" className="side__link"><Icon name="external" />Otvoriť web</a>
          <form action={signOut}><button className="side__link"><Icon name="logout" />Odhlásiť sa</button></form>
        </div>
      </aside>
      <main className="content">
        {isDemo() && (
          <p className="notice notice--demo demo-banner" role="status">
            <strong>Ukážkový režim.</strong> Firmy sú vymyslené a dáta sa po reštarte servera vrátia do pôvodného stavu. Kroky s Claude sú len simulované, kým nedoplníte kľúče Supabase a Anthropic.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
