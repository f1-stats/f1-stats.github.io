"use client";

import Link from "next/link";
import { ArrowLeftRight, Trophy } from "lucide-react";
import { useState } from "react";
import { Text, useText } from "@/app/components/language";
import { TeamChampionshipSimulator } from "@/app/components/team-championship-simulator";
import type { ConstructorStanding, DriverStanding, Race } from "@/lib/f1";

export function TeamComparison({
  teams,
  drivers,
  races,
}: {
  teams: ConstructorStanding[];
  drivers: DriverStanding[];
  races: Race[];
}) {
  const [leftId, setLeftId] = useState(
    teams[0]?.Constructor.constructorId ?? "",
  );
  const [rightId, setRightId] = useState(
    teams[1]?.Constructor.constructorId ?? teams[0]?.Constructor.constructorId ?? "",
  );
  const text = useText();
  const left =
    teams.find((team) => team.Constructor.constructorId === leftId) ?? teams[0];
  const right =
    teams.find((team) => team.Constructor.constructorId === rightId) ??
    teams[1] ??
    teams[0];

  if (!left || !right)
    return <div className="empty">Standings data is not available yet.</div>;

  const metrics = [
    {
      id: "championshipPosition",
      left: Number(left.position),
      right: Number(right.position),
      suffix: "",
      lowerIsBetter: true,
    },
    {
      id: "points",
      left: Number(left.points),
      right: Number(right.points),
      suffix: " PTS",
      lowerIsBetter: false,
    },
    {
      id: "wins",
      left: Number(left.wins),
      right: Number(right.wins),
      suffix: "",
      lowerIsBetter: false,
    },
  ] as const;

  return (
    <section className="comparison team-comparison">
      <p className="compare-mode-lead">
        <Text id="teamCompareLead" />
      </p>
      <div className="compare-selectors">
        <label>
          <Text id="teamA" />
          <select
            value={leftId}
            onChange={(event) => setLeftId(event.target.value)}
          >
            {teams.map((team) => (
              <option
                key={team.Constructor.constructorId}
                value={team.Constructor.constructorId}
              >
                {team.Constructor.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="compare-swap"
          type="button"
          aria-label={text.swapTeams}
          title={text.swapTeams}
          onClick={() => {
            setLeftId(rightId);
            setRightId(leftId);
          }}
        >
          <ArrowLeftRight aria-hidden="true" size={18} />
        </button>
        <label>
          <Text id="teamB" />
          <select
            value={rightId}
            onChange={(event) => setRightId(event.target.value)}
          >
            {teams.map((team) => (
              <option
                key={team.Constructor.constructorId}
                value={team.Constructor.constructorId}
              >
                {team.Constructor.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="compare-drivers">
        <Link
          className="compare-driver"
          href={`/teams/${left.Constructor.constructorId}`}
        >
          <span><Text id="teamA" /></span>
          <h2>{left.Constructor.name}</h2>
        </Link>
        <div className="compare-versus" aria-hidden="true">
          <Trophy size={18} />
          <b>VS</b>
        </div>
        <Link
          className="compare-driver compare-driver-right"
          href={`/teams/${right.Constructor.constructorId}`}
        >
          <span><Text id="teamB" /></span>
          <h2>{right.Constructor.name}</h2>
        </Link>
      </div>
      <div className="compare-metrics">
        {metrics.map((metric) => {
          const leftLeads = metric.lowerIsBetter
            ? metric.left < metric.right
            : metric.left > metric.right;
          const rightLeads = metric.lowerIsBetter
            ? metric.right < metric.left
            : metric.right > metric.left;
          return (
            <div className="compare-metric" key={metric.id}>
              <strong className={leftLeads ? "metric-lead" : ""}>
                {metric.lowerIsBetter ? `P${metric.left}` : metric.left}
                {metric.suffix}
              </strong>
              <span><Text id={metric.id} /></span>
              <strong className={rightLeads ? "metric-lead" : ""}>
                {metric.lowerIsBetter ? `P${metric.right}` : metric.right}
                {metric.suffix}
              </strong>
            </div>
          );
        })}
      </div>
      <div className="comparison-simulation-heading">
        <div className="eyebrow">
          <Text id="seasonScenario" />
        </div>
        <h2>
          <Text id="championshipSimulator" />
        </h2>
      </div>
      <TeamChampionshipSimulator
        key={`${leftId}-${rightId}`}
        teams={teams}
        drivers={drivers}
        races={races}
        teamId={leftId}
        rivalTeamId={rightId}
      />
    </section>
  );
}