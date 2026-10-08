import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  LanguageProvider,
  LanguageSwitcher,
  Text,
} from "@/app/components/language";
import { SiteNavigation } from "@/app/components/site-navigation";
import {
  SeasonHomeLink,
  SeasonSwitcher,
} from "@/app/components/season-controls";
import { availableSeasons, currentSeason } from "@/lib/f1";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Stats — Formula 1 Statistics & Tools",
  description:
    "Formula 1 standings, race results, driver statistics, comparisons and useful F1 calculators.",
  verification: {
    google: "nScZP2sBUKhxwKfvtKwCxQkPMCIOOvYNT35E5W2pDn8",
    yandex: "20301f0124f77990",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const currentYear = currentSeason();
  const years = [...new Set([currentYear, ...availableSeasons()])].sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <header className="header">
            <div className="nav">
              <SeasonHomeLink defaultYear={currentYear} />
              <SiteNavigation defaultYear={currentYear} />
              <SeasonSwitcher years={years} defaultYear={currentYear} />
              <LanguageSwitcher />
            </div>
          </header>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-8GTZX14V3J"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-8GTZX14V3J');`}
          </Script>
          {children}
          <footer>
            <span>
              &copy; {currentYear} F1 Stats. <Text id="rightsReserved" />
            </span>
            <span>
              <Text id="dataSource" />
            </span>
            <Link href="/policy">
              <Text id="privacyPolicy" />
            </Link>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
