"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useText } from "@/app/components/language";

type Theme = "light" | "dark";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("dark");
  const preference = useRef<Theme | null>(null);
  const text = useText();

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = preference.current ?? (media.matches ? "dark" : "light");
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    const readPreference = () => {
      try {
        const saved = localStorage.getItem("f1-theme");
        preference.current = saved === "light" || saved === "dark" ? saved : null;
      } catch {
        preference.current = null;
      }
      apply();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "f1-theme" || event.key === null) readPreference();
    };
    readPreference();
    media.addEventListener("change", apply);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    preference.current = next;
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("f1-theme", next);
    } catch {
      return;
    }
  };
  const label = theme === "dark" ? text.switchToLight : text.switchToDark;

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}