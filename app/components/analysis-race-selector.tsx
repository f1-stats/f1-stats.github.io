"use client";

import Link from "next/link";
import { useState } from "react";
import { Text, useText } from "@/app/components/language";
import type { AnalysisSeasonOption } from "@/lib/f1";

export function AnalysisRaceSelector({
  seasons,
  initialYear,
  initialRound,
}: {
  seasons: AnalysisSeasonOption[];
  initialYear?: string;
  initialRound?: string;
}) {
  const text = useText();
  const [year, setYear] = useState(
    seasons.some((season) => season.year === initialYear)
      ? initialYear!
      : (seasons[0]?.year ?? ""),
  );
  const initialSeason = seasons.find((season) => season.year === year);
  const [round, setRound] = useState(
    initialSeason?.races.some((race) => race.round === initialRound)
      ? initialRound!
      : (initialSeason?.races[0]?.round ?? ""),
  );
  const selectedSeason = seasons.find((season) => season.year === year);
  const races = selectedSeason?.races ?? [];

  function selectSeason(nextYear: string) {
    setYear(nextYear);
    setRound(
      seasons.find((season) => season.year === nextYear)?.races[0]?.round ?? "",
    );
  }

  if (seasons.length === 0) {
    return <p className="analysis-selector-empty">{text.dataUnavailable}</p>;
  }

  return (
    <div className="analysis-selector">
      <label>
        <span>
          <Text id="season" />
        </span>
        <select
          value={year}
          onChange={(event) => selectSeason(event.target.value)}
        >
          {seasons.map((season) => (
            <option key={season.year} value={season.year}>
              {season.year}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>
          <Text id="race" />
        </span>
        <select
          value={round}
          onChange={(event) => setRound(event.target.value)}
          disabled={races.length === 0}
        >
          {races.map((race) => (
            <option key={race.round} value={race.round}>
              {race.round}. {race.raceName} · {race.Circuit.circuitName}
            </option>
          ))}
        </select>
      </label>
      {year && round ? (
        <Link className="button" href={`/analysis/${year}/${round}`}>
          <Text id="raceAnalysis" />
        </Link>
      ) : (
        <button className="button" type="button" disabled>
          <Text id="raceAnalysis" />
        </button>
      )}
    </div>
  );
}
