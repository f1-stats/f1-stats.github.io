import Link from "next/link";
import { AnalysisRaceSelector } from "@/app/components/analysis-race-selector";
import { RaceAnalysis } from "@/app/components/race-analysis";
import { Text } from "@/app/components/language";
import { teamColor } from "@/app/components/team-identity";
import {
  analysisSchedule,
  raceAnalysis,
  results,
  schedule,
} from "@/lib/f1";

export function generateStaticParams() {
  return analysisSchedule().flatMap((season) =>
    season.races.map((race) => ({ year: season.year, round: race.round })),
  );
}

export default async function AnalysisRacePage({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}) {
  const { year, round } = await params;
  const race = schedule(year).find((item) => item.round === round);
  const analysisData = raceAnalysis(round, year);
  const drivers = results(round, year).map((row: any) => ({
    driverId: row.Driver.driverId,
    name: `${row.Driver.givenName} ${row.Driver.familyName}`,
    constructorId: row.Constructor?.constructorId ?? "unknown",
    teamName: row.Constructor?.name ?? "Unknown team",
    color: teamColor(row.Constructor?.constructorId),
    fastestLap: row.FastestLap
      ? {
          lap: Number(row.FastestLap.lap),
          ...(row.FastestLap.AverageSpeed?.speed !== undefined
            ? { averageSpeed: Number(row.FastestLap.AverageSpeed.speed) }
            : {}),
          units:
            row.FastestLap.AverageSpeed?.units === "kph"
              ? "km/h"
              : row.FastestLap.AverageSpeed?.units,
        }
      : undefined,
  }));
  const seasons = analysisSchedule();

  if (!race) {
    return (
      <main className="page">
        <h1><Text id="raceNotFound" /></h1>
        <Link className="link-icon" href="/analysis">
          <Text id="raceAnalysis" />
        </Link>
      </main>
    );
  }

  return (
    <main className="page analysis-page">
      <div className="eyebrow"><Text id="raceAnalysis" /> · {year}</div>
      <h1>{race.raceName}</h1>
      <p className="lead">
        {race.Circuit.circuitName} · {race.Circuit.Location.locality},{" "}
        {race.Circuit.Location.country}
      </p>
      <AnalysisRaceSelector
        seasons={seasons}
        initialYear={year}
        initialRound={round}
      />
      {analysisData && drivers.length > 0 ? (
        <RaceAnalysis
          year={year}
          round={round}
          drivers={drivers}
          laps={analysisData.laps}
          pitStops={analysisData.pitStops}
        />
      ) : (
        <p className="analysis-page-unavailable">
          <Text id="dataUnavailable" />
        </p>
      )}
    </main>
  );
}