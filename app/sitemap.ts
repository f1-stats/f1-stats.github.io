import type { MetadataRoute } from "next";
import {
  availableSeasons,
  constructorStandings,
  driverStandings,
  schedule,
} from "@/lib/f1";

export const dynamic = "force-static";

const siteUrl = "https://f1-stats.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${siteUrl}/tools/points-calculator`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tools/lap-time-calculator`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tools/pit-stop-calculator`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${siteUrl}/policy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const seasons = availableSeasons();
  const seasonPages = seasons.flatMap((year) => [
    { url: `${siteUrl}/${year}`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteUrl}/${year}/drivers`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/${year}/teams`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/${year}/races`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${siteUrl}/${year}/compare`, changeFrequency: "monthly" as const, priority: 0.7 },
    ...driverStandings(year).map(({ Driver }) => ({
      url: `${siteUrl}/${year}/drivers/${encodeURIComponent(Driver.driverId)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...constructorStandings(year).map(({ Constructor }) => ({
      url: `${siteUrl}/${year}/teams/${encodeURIComponent(Constructor.constructorId)}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...schedule(year).map((race) => ({
      url: `${siteUrl}/${year}/races/${encodeURIComponent(race.round)}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ]);

  return [...pages, ...seasonPages];
}
