"use client";

import { useState } from "react";
import { Text, useText } from "@/app/components/language";
import { DriverComparison } from "@/app/components/driver-comparison";
import { TeamComparison } from "@/app/components/team-comparison";
import type {
  ConstructorStanding,
  DriverStanding,
  Race,
} from "@/lib/f1";

type ComparisonMode = "drivers" | "teams";

export function ComparisonHub({
  drivers,
  teams,
  races,
}: {
  drivers: DriverStanding[];
  teams: ConstructorStanding[];
  races: Race[];
}) {
  const [mode, setMode] = useState<ComparisonMode>("drivers");
  const text = useText();

  return (
    <>
      <div className="comparison-mode" role="group" aria-label={text.comparisonType}>
        <button
          type="button"
          aria-pressed={mode === "drivers"}
          onClick={() => setMode("drivers")}
        >
          <Text id="driverComparison" />
        </button>
        <button
          type="button"
          aria-pressed={mode === "teams"}
          onClick={() => setMode("teams")}
        >
          <Text id="teamComparison" />
        </button>
      </div>
      <div className="comparison-mode-panel">
        {mode === "drivers" ? (
          <DriverComparison drivers={drivers} races={races} />
        ) : (
          <TeamComparison teams={teams} drivers={drivers} races={races} />
        )}
      </div>
    </>
  );
}