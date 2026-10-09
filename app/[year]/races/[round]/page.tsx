import Image from "next/image";
import {
  circuitImage,
  qualifyingResults,
  raceAnalysis,
  results,
  schedule,
  sprintResults,
} from "@/lib/f1";
import { TeamIdentity, teamColor } from "@/app/components/team-identity";
import { RaceWeekend } from "@/app/components/race-weekend";
import { Text } from "@/app/components/language";
import { RacePointsTrendChart } from "@/app/components/race-points-trend-chart";
import { QualifyingLapTrendChart } from "@/app/components/qualifying-lap-trend-chart";
import { RaceAnalysis } from "@/app/components/race-analysis";

function parseLapTime(value: string | undefined): number | null {
  if (!value) return null;
  const parts = value.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;
  return parts.length === 2 ? parts[0] * 60 + parts[1] : (parts[0] ?? null);
}

function finalQualifyingLap(row: any) {
  for (const session of ["Q3", "Q2", "Q1"] as const) {
    const time = parseLapTime(row[session]);
    if (time !== null) return { time, session };
  }
  return null;
}

export async function generateStaticParams({
  params,
}: {
  params: { year: string };
}) {
  return schedule(params.year).map((race) => ({
    round: race.round,
  }));
}

export default async function RacePage({
  params,
}: {
  params: Promise<{ year: string; round: string }>;
}) {
  const { year, round } = await params;
  const race = schedule(year).find((r) => r.round === round);
  const rows = results(round, year);
  const analysis = raceAnalysis(round, year);
  const qualifying = qualifyingResults(round, year);
  const sprint = sprintResults(round, year);
  const qualifyingLapDrivers = qualifying.flatMap((row: any) => {
    const lap = finalQualifyingLap(row);
    if (!lap) return [];
    return [
      {
        code:
          row.Driver.code ?? row.Driver.familyName.slice(0, 3).toUpperCase(),
        name: `${row.Driver.givenName} ${row.Driver.familyName}`,
        session: lap.session,
        time: lap.time,
        color: teamColor(row.Constructor?.constructorId),
        teamName: row.Constructor?.name ?? "Unknown team",
      },
    ];
  });
  const racePointDrivers = rows.map((row: any) => {
    const fastestLapSpeed = Number(row.FastestLap?.AverageSpeed?.speed);
    return {
      code: row.Driver.code ?? row.Driver.familyName.slice(0, 3).toUpperCase(),
      name: `${row.Driver.givenName} ${row.Driver.familyName}`,
      points: Number(row.points ?? 0),
      color: teamColor(row.Constructor?.constructorId),
      teamName: row.Constructor?.name ?? "Unknown team",
      fastestLapAverageSpeed: Number.isFinite(fastestLapSpeed)
        ? fastestLapSpeed
        : undefined,
      fastestLapSpeedUnits:
        row.FastestLap?.AverageSpeed?.units === "kph"
          ? "km/h"
          : row.FastestLap?.AverageSpeed?.units,
    };
  });

  if (!race)
    return (
      <main className="page">
        <h1>
          <Text id="raceNotFound" />
        </h1>
      </main>
    );

  const image = circuitImage(race.Circuit.circuitId);

  return (
    <main className="page detail-page">
      <div className="eyebrow">
        <Text id="round" /> {round}
      </div>
      <h1>{race.raceName}</h1>
      <p className="lead">
        {race.Circuit.circuitName} · {race.Circuit.Location.locality},{" "}
        {race.Circuit.Location.country}
      </p>
      {image && (
        <Image
          className="race-circuit-image race-detail-circuit-image"
          src={image}
          alt={race.Circuit.circuitName}
          width={960}
          height={360}
        />
      )}
      <h2>
        <Text id="weekendSchedule" />
      </h2>
      <p className="schedule-note">
        <Text id="allTimesUtc" />
      </p>
      <RaceWeekend race={race} />
      {qualifying.length > 0 && (
        <>
          <h2>
            <Text id="qualifyingResults" />
          </h2>
          <div className="table">
            <div className="thead">
              <span>
                <Text id="position" />
              </span>
              <span>
                <Text id="driver" />
              </span>
              <span>
                <Text id="team" />
              </span>
              <span>Q3</span>
            </div>
            {qualifying.map((r: any) => (
              <div className="tr" key={r.number}>
                <span>{r.position}</span>
                <span className="strong">
                  {r.Driver.givenName} {r.Driver.familyName}
                </span>
                <span>
                  <TeamIdentity team={r.Constructor} />
                </span>
                <span>{r.Q3 ?? r.Q2 ?? r.Q1 ?? "—"}</span>
              </div>
            ))}
          </div>
          {qualifyingLapDrivers.length > 0 && (
            <QualifyingLapTrendChart drivers={qualifyingLapDrivers} />
          )}
        </>
      )}
      {sprint.length > 0 && (
        <>
          <h2>
            <Text id="sprintResults" />
          </h2>
          <div className="table">
            <div className="thead">
              <span>
                <Text id="position" />
              </span>
              <span>
                <Text id="driver" />
              </span>
              <span>
                <Text id="team" />
              </span>
              <span>
                <Text id="timeStatus" />
              </span>
            </div>
            {sprint.map((r: any) => (
              <div className="tr" key={r.number}>
                <span>{r.position}</span>
                <span className="strong">
                  {r.Driver.givenName} {r.Driver.familyName}
                </span>
                <span>
                  <TeamIdentity team={r.Constructor} />
                </span>
                <span>{r.Time?.time ?? r.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {rows.length > 0 && (
        <>
          <h2>
            <Text id="raceResults" />
          </h2>
          <div className="table race-results">
            <div className="thead">
              <span>
                <Text id="position" />
              </span>
              <span>
                <Text id="driver" />
              </span>
              <span>
                <Text id="team" />
              </span>
              <span>
                <Text id="timeStatus" />
              </span>
              <span>
                <Text id="points" />
              </span>
            </div>
            {rows.map((r: any) => (
              <div className="tr" key={r.number}>
                <span>{r.position}</span>
                <span className="strong">
                  {r.Driver.givenName} {r.Driver.familyName}
                </span>
                <span>
                  <TeamIdentity team={r.Constructor} />
                </span>
                <span>{r.Time?.time ?? r.status}</span>
                <span className="strong">{r.points}</span>
              </div>
            ))}
          </div>
          {racePointDrivers.length > 0 && (
            <RacePointsTrendChart drivers={racePointDrivers} />
          )}
        </>
      )}
      {rows.length > 0 && analysis && (
        <RaceAnalysis
          year={year}
          round={round}
          drivers={rows.map((row: any) => ({
            driverId: row.Driver.driverId,
            name: `${row.Driver.givenName} ${row.Driver.familyName}`,
            constructorId: row.Constructor?.constructorId ?? "unknown",
            teamName: row.Constructor?.name ?? "Unknown team",
            color: teamColor(row.Constructor?.constructorId),
            fastestLap: row.FastestLap
              ? {
                  lap: Number(row.FastestLap.lap),
                  ...(row.FastestLap.AverageSpeed?.speed !== undefined
                    ? {
                        averageSpeed: Number(
                          row.FastestLap.AverageSpeed.speed,
                        ),
                      }
                    : {}),
                  units:
                    row.FastestLap.AverageSpeed?.units === "kph"
                      ? "km/h"
                      : row.FastestLap.AverageSpeed?.units,
                }
              : undefined,
          }))}
          laps={analysis.laps}
          pitStops={analysis.pitStops}
        />
      )}
    </main>
  );
}
