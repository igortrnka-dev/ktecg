"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "./Icon";

export default function NavLink({ href, icon, children }: { href: string; icon: IconName; children: React.ReactNode }) {
  const path = usePathname();
  const active = href === "/admin" ? path === href : path.startsWith(href);
  return (
    <Link href={href} className={`side__link ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
      <Icon name={icon} />
      {children}
    </Link>
  );
}
