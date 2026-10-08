"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Text } from "@/app/components/language";

export function SeasonHomeLink({ defaultYear }: { defaultYear: string }) {
  const pathname = usePathname() ?? "/";
  const year = pathname.match(/^\/(\d{4})(?:\/|$)/)?.[1] ?? defaultYear;

  return (
    <Link href={`/${year}`} className="logo">
      <span>F1</span> STATS
    </Link>
  );
}

export function SeasonSwitcher({
  years,
  defaultYear,
}: {
  years: string[];
  defaultYear: string;
}) {
  const pathname = usePathname() ?? "/";
  const activeYear = pathname.match(/^\/(\d{4})(?:\/|$)/)?.[1];
  const selectedYear = activeYear ?? defaultYear;

  function changeYear(year: string) {
    const route = activeYear
      ? pathname.slice(activeYear.length + 1) || "/"
      : pathname;
    const section = route.match(/^\/(drivers|teams|races|compare)(?:\/[^/]+)?/);
    const baseRoute = section
      ? section[0].replace(/\/(drivers|teams|races)\/[^/]+$/, "/$1")
      : "/";
    window.location.assign(`/${year}${baseRoute === "/" ? "" : baseRoute}`);
  }

  return (
    <label className="season-switcher">
      <span>
        <Text id="season" />
      </span>
      <select
        aria-label="Season"
        value={selectedYear}
        onChange={(event) => changeYear(event.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}
