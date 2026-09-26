"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useText, Text } from "@/app/components/language";

export function SiteNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const text = useText();
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="site-navigation">
      <button
        className="menu-toggle"
        type="button"
        aria-label={isOpen ? text.closeMenu : text.openMenu}
        aria-expanded={isOpen}
        aria-controls="site-links"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? (
          <X aria-hidden="true" size={20} />
        ) : (
          <Menu aria-hidden="true" size={20} />
        )}
      </button>
      <nav className={`site-links${isOpen ? " is-open" : ""}`} id="site-links">
        <Link href="/drivers" onClick={closeMenu}>
          <Text id="drivers" />
        </Link>
        <Link href="/teams" onClick={closeMenu}>
          <Text id="teams" />
        </Link>
        <Link href="/races" onClick={closeMenu}>
          <Text id="races" />
        </Link>
        <Link href="/compare" onClick={closeMenu}>
          <Text id="compare" />
        </Link>
        <Link href="/tools" onClick={closeMenu}>
          <Text id="calculators" />
        </Link>
      </nav>
    </div>
  );
}
