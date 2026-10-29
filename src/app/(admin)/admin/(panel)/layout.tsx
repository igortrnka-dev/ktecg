import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";
import NavLink from "@/components/admin/NavLink";
import { isDemo } from "@/lib/demo/mode";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  return (
    <div className="shell">
      <aside className="side">
        <Link href="/admin" className="brand">KTechnology<sup>®</sup> <span>Sales</span></Link>
        <nav>
          <NavLink href="/admin">Prehľad</NavLink>
          <NavLink href="/admin/leads">Leady</NavLink>
          <NavLink href="/admin/campaigns">AI prospecting</NavLink>
          <NavLink href="/admin/inquiries">Dopyty z webu</NavLink>
          <NavLink href="/admin/settings">Nastavenia</NavLink>
        </nav>
        <div className="side__foot">
          <span>{user.email}</span>
          <form action={signOut}><button className="linkbtn">Odhlásiť</button></form>
          <a href="/" target="_blank" className="linkbtn">Otvoriť web ↗</a>
        </div>
      </aside>
      <main className="content">
        {isDemo() && (
          <p className="notice notice--demo demo-banner" role="status">
            Ukážkový režim: vymyslené firmy a testovacie dáta, ktoré sa po reštarte servera vrátia do pôvodného stavu. AI kroky sú len simulované, kým nedoplníte kľúče Supabase a Anthropic.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
