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
export type AnalysisSeasonOption = {
  year: string;
  races: Race[];
};
export type RaceLap = {
  number: string;
  Timings: { driverId: string; time: string; position: string }[];
};
export type RacePitStop = {
  driverId: string;
  lap: string;
  stop: string;
  duration: string;
};
export type RaceAnalysisData = {
  laps: RaceLap[];
  pitStops: RacePitStop[];
};

export function currentSeason(): string {
  return String(new Date().getFullYear());
}

export function availableSeasons(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "data"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d{4}$/.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => Number(b) - Number(a));
  } catch {
    return [];
  }
}

function read<T>(year: string, name: string, fallback: T): T {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", year, name), "utf8"),
    ) as T;
  } catch {
    return fallback;
  }
}

export function raceAnalysis(
  round: string,
  year = currentSeason(),
): RaceAnalysisData | null {
  if (!/^\d{4}$/.test(year) || !/^\d+$/.test(round)) return null;
  const lapsData = read<any>(year, `round-${round}-laps.json`, null);
  const pitStopsData = read<any>(year, `round-${round}-pitstops.json`, null);
  const laps =
    lapsData?.RaceTable?.Races?.[0]?.Laps ??
    lapsData?.MRData?.RaceTable?.Races?.[0]?.Laps;
  const pitStops =
    pitStopsData?.RaceTable?.Races?.[0]?.PitStops ??
    pitStopsData?.MRData?.RaceTable?.Races?.[0]?.PitStops;

  if (!Array.isArray(laps) || !Array.isArray(pitStops)) return null;
  if (laps.length === 0 && pitStops.length === 0) return null;
  return { laps, pitStops };
}

export function driverStandings(year = currentSeason()): DriverStanding[] {
  const d: any = read<any>(year, "driver-standings.json", {
    MRData: { StandingsTable: { StandingsLists: [{ DriverStandings: [] }] } },
  });
  return (
    d.StandingsTable?.StandingsLists?.[0]?.DriverStandings ??
    d.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ??
    []
  );
}
export function constructorStandings(
  year = currentSeason(),
): ConstructorStanding[] {
  const d: any = read<any>(year, "constructor-standings.json", {
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
export function schedule(year = currentSeason()): Race[] {
  const d: any = read<any>(year, "schedule.json", {
    MRData: { RaceTable: { Races: [] } },
  });
  return d.RaceTable?.Races ?? d.MRData?.RaceTable?.Races ?? [];
}
export function analysisSchedule(): AnalysisSeasonOption[] {
  return availableSeasons()
    .map((year) => ({
      year,
      races: schedule(year).filter((race) => {
        const directory = path.join(process.cwd(), "data", year);
        return ["laps", "pitstops"].every((name) =>
          fs.existsSync(
            path.join(directory, `round-${race.round}-${name}.json`),
          ),
        );
      }),
    }))
    .filter((season) => season.races.length > 0);
}
export function circuitImage(circuitId: string): string | undefined {
  if (!/^[a-z0-9_-]+$/i.test(circuitId)) return undefined;
  for (const extension of ["svg", "png", "webp", "jpg", "jpeg"]) {
    const filename = `${circuitId}.${extension}`;
    if (
      fs.existsSync(path.join(process.cwd(), "public", "circuits", filename))
    ) {
      return `/circuits/${filename}`;
    }
  }
  return undefined;
}
export function results(round: string, year = currentSeason()): any[] {
  const d: any = read<any>(year, `round-${round}-results.json`, {
    MRData: { RaceTable: { Races: [] } },
  });
  return (
    d.RaceTable?.Races?.[0]?.Results ??
    d.MRData?.RaceTable?.Races?.[0]?.Results ??
    []
  );
}
function roundRows(
  round: string,
  name: string,
  key: string,
  year: string,
): any[] {
  const d: any = read<any>(year, `round-${round}-${name}.json`, {
    RaceTable: { Races: [] },
  });
  return (
    d.RaceTable?.Races?.[0]?.[key] ??
    d.MRData?.RaceTable?.Races?.[0]?.[key] ??
    []
  );
}
export function qualifyingResults(
  round: string,
  year = currentSeason(),
): any[] {
  return roundRows(round, "qualifying", "QualifyingResults", year);
}
export function sprintResults(round: string, year = currentSeason()): any[] {
  return roundRows(round, "sprint", "SprintResults", year);
}
export function displayName(d: DriverStanding["Driver"]) {
  return `${d.givenName} ${d.familyName}`;
}
