import type { MetadataRoute } from "next";
import { constructorStandings, driverStandings, schedule } from "@/lib/f1";

export const dynamic = "force-static";

const siteUrl = "https://f1-stats.github.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/drivers`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/teams`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/races`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/compare`, changeFrequency: "monthly", priority: 0.7 },
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

  const driverPages = driverStandings().map(({ Driver }) => ({
    url: `${siteUrl}/drivers/${encodeURIComponent(Driver.driverId)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  const teamPages = constructorStandings().map(({ Constructor }) => ({
    url: `${siteUrl}/teams/${encodeURIComponent(Constructor.constructorId)}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
  const racePages = schedule().map((race) => ({
    url: `${siteUrl}/races/${encodeURIComponent(race.round)}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...pages, ...driverPages, ...teamPages, ...racePages];
}
