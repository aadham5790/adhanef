"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="header">
      <div className="container">
        <Link href="/" className="logo">
          <img src="/assets/images/logo.jpg" alt="Ady Hanef" className="logo-img" />
          <span>Ady Hanef</span>
        </Link>
        <nav className={`nav${open ? " open" : ""}`} id="main-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(item.href) ? "active" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          type="button"
          onClick={() => setOpen((value) => !value)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
