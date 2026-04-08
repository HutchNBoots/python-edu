"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname
    ? href === "/" ? pathname === "/" : pathname.startsWith(href)
    : false;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      style={{
        fontSize: "12px",
        fontWeight: 500,
        color: isActive ? "var(--accent-primary)" : "var(--text-muted)",
        textDecoration: "none",
        padding: "4px 10px 2px",
        borderBottom: isActive
          ? "2px solid var(--accent-primary)"
          : "2px solid transparent",
      }}
    >
      {children}
    </Link>
  );
}
