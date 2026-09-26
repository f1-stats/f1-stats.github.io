import fs from "fs";
import path from "path";

export type DriverStanding = {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code?: string;
  };
  Constructors?: { constructorId: string; name: string }[];
};
export type ConstructorStanding = {
  position: string;
  points: string;
  wins: string;
  Constructor: { constructorId: string; name: string; nationality: string };
};
export type Race = {
  season: string;
  round: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    circuitName: string;
    Location: { locality: string; country: string };
  };
  date: string;
  time?: string;
  Sprint?: { date: string; time?: string };
  Results?: any[];
};

function read<T>(name: string, fallback: T): T {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", name), "utf8"),
    ) as T;
  } catch {
    return fallback;
  }
}
export function driverStandings(): DriverStanding[] {
  const d: any = read<any>("driver-standings.json", {
    MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [] }] } },
  });
  return (
    d.StandingsTable?.StandingsLists?.[0]?.DriverStandings ??
    d.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ??
    []
  );
}
export function constructorStandings(): ConstructorStanding[] {
  const d: any = read<any>("constructor-standings.json", {
    MRData: {
      StandingsTable: { StandingsLists: [{ ConstructorStandings: [] }] },
    },
  });
  return (
    d.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
    d.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
    []
  );
}
export function schedule(): Race[] {
  const d: any = read<any>("schedule.json", {
    MRData: { RaceTable: { Races: [] } },
  });
  return d.RaceTable?.Races ?? d.MRData?.RaceTable?.Races ?? [];
}
export function results(round: string): any[] {
  const d: any = read<any>(`round-${round}-results.json`, {
    MRData: { RaceTable: { Races: [] } },
  });
  return (
    d.RaceTable?.Races?.[0]?.Results ??
    d.MRData?.RaceTable?.Races?.[0]?.Results ??
    []
  );
}
function roundRows(round: string, name: string, key: string): any[] {
  const d: any = read<any>(`round-${round}-${name}.json`, {
    RaceTable: { Races: [] },
  });
  return (
    d.RaceTable?.Races?.[0]?.[key] ??
    d.MRData?.RaceTable?.Races?.[0]?.[key] ??
    []
  );
}
export function qualifyingResults(round: string): any[] {
  return roundRows(round, "qualifying", "QualifyingResults");
}
export function sprintResults(round: string): any[] {
  return roundRows(round, "sprint", "SprintResults");
}
export function displayName(d: DriverStanding["Driver"]) {
  return `${d.givenName} ${d.familyName}`;
}
