import type { Metadata } from "next";
import Link from "next/link";
import { LanguageProvider, LanguageSwitcher, Text } from "@/app/components/language";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Stats — Formula 1 Statistics & Tools",
  description: "Formula 1 standings, race results, driver statistics, comparisons and useful F1 calculators."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <header className="header">
            <div className="nav">
              <Link href="/" className="logo"><span>F1</span> STATS</Link>
              <nav>
                <Link href="/drivers"><Text id="drivers" /></Link>
                <Link href="/teams"><Text id="teams" /></Link>
                <Link href="/races"><Text id="races" /></Link>
                <Link href="/compare"><Text id="compare" /></Link>
                <Link href="/tools/points-calculator"><Text id="calculators" /></Link>
              </nav>
              <LanguageSwitcher />
            </div>
          </header>
          {children}
          <footer>
            <span>&copy; 2026 F1 Stats. <Text id="rightsReserved" /></span>
            <span><Text id="dataSource" /></span>
            <Link href="/policy"><Text id="privacyPolicy" /></Link>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
