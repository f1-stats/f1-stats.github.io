"use client";

import { useState } from "react";
import { Text } from "@/app/components/language";
import type { Race } from "@/lib/f1";

type Driver = {
  position: string;
  points: string;
  Driver: { driverId: string; givenName: string; familyName: string };
};

export const racePoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0];
export const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1, 0];
const finishVariation = [0, 1, -1, 0, 1, -1];

type ScenarioFinish = {
  driverRace: number;
  rivalRace: number;
  driverSprint: number;
  rivalSprint: number;
};

function nameOf(driver: Driver) {
  return `${driver.Driver.givenName} ${driver.Driver.familyName}`;
}

export function startingFinish(position: string, roundIndex: number, points: number[]) {
  const standingPosition = Number(position);
  const base = Number.isFinite(standingPosition) ? standingPosition - 1 : 0;
  const varied = base + finishVariation[roundIndex % finishVariation.length];
  return Math.max(0, Math.min(points.length - 1, varied));
}

export function PointsSelect({
  value,
  onChange,
  points,
}: {
  value: number;
  onChange: (value: number) => void;
  points: number[];
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {points.map((amount, index) => (
        <option key={index} value={index}>
          {index < points.length - 1 ? (
            <>
              P{index + 1} ({amount} <Text id="pointsShort" />)
            </>
          ) : (
            <Text id="noPoints" />
          )}
        </option>
      ))}
    </select>
  );
}

export function ChampionshipSimulator({
  drivers,
  races,
  driverId,
  rivalId,
}: {
  drivers: Driver[];
  races: Race[];
  driverId: string;
  rivalId: string;
}) {
  const driver =
    drivers.find((item) => item.Driver.driverId === driverId) ?? drivers[0];
  const rival =
    drivers.find((item) => item.Driver.driverId === rivalId) ??
    drivers[1] ??
    drivers[0];
  const [finishes, setFinishes] = useState<Record<string, ScenarioFinish>>(
    () =>
      Object.fromEntries(
        races.map((race, index) => [
          race.round,
          {
            driverRace: startingFinish(driver?.position ?? "1", index, racePoints),
            rivalRace: startingFinish(rival?.position ?? "2", index + 1, racePoints),
            driverSprint: startingFinish(driver?.position ?? "1", index, sprintPoints),
            rivalSprint: startingFinish(rival?.position ?? "2", index + 1, sprintPoints),
          },
        ]),
      ) as Record<string, ScenarioFinish>,
  );

  if (!driver || !rival)
    return <div className="empty">Standings data is not available yet.</div>;

  function updateFinish(round: string, key: keyof ScenarioFinish, value: number) {
    setFinishes((current) => ({
      ...current,
      [round]: { ...current[round], [key]: value },
    }));
  }

  const projected = races.reduce(
    (totals, race) => {
      const finish = finishes[race.round];
      return {
        driver:
          totals.driver +
          racePoints[finish.driverRace] +
          (race.Sprint ? sprintPoints[finish.driverSprint] : 0),
        rival:
          totals.rival +
          racePoints[finish.rivalRace] +
          (race.Sprint ? sprintPoints[finish.rivalSprint] : 0),
      };
    },
    { driver: Number(driver.points), rival: Number(rival.points) },
  );
  const remainingSprints = races.filter((race) => race.Sprint).length;
  const driverMaximum =
    Number(driver.points) +
    races.reduce(
      (total, race) => total + racePoints[0] + (race.Sprint ? sprintPoints[0] : 0),
      0,
    );
  const gap = projected.driver - projected.rival;

  return (
    <section className="simulator">
      <div className="simulator-summary">
        <span>
          <Text id="remaining" />
        </span>
        <strong>
          {races.length} <Text id="raceCount" /> · {remainingSprints}{" "}
          <Text id="sprintCount" />
        </strong>
      </div>
      <div className="scenario-section-heading">
        <Text id="raceByRaceScenario" />
      </div>
      <p className="scenario-defaults"><Text id="scenarioDefaults" /></p>
      <div className="scenario-list">
        {races.map((race) => {
          const finish = finishes[race.round];
          return (
            <div className="scenario-weekend" key={race.round}>
              <div className="scenario-weekend-heading">
                <span><Text id="round" /> {race.round}</span>
                <h3>{race.raceName}</h3>
              </div>
              <div className="scenario-drivers">
                <div className="scenario-driver">
                  <h4>{nameOf(driver)}</h4>
                  <label>
                    <Text id="expectedRaceFinish" />
                    <PointsSelect value={finish.driverRace} onChange={(value) => updateFinish(race.round, "driverRace", value)} points={racePoints} />
                  </label>
                  {race.Sprint && <label>
                    <Text id="expectedSprintFinish" />
                    <PointsSelect value={finish.driverSprint} onChange={(value) => updateFinish(race.round, "driverSprint", value)} points={sprintPoints} />
                  </label>}
                </div>
                <div className="scenario-driver">
                  <h4>{nameOf(rival)}</h4>
                  <label>
                    <Text id="expectedRaceFinish" />
                    <PointsSelect value={finish.rivalRace} onChange={(value) => updateFinish(race.round, "rivalRace", value)} points={racePoints} />
                  </label>
                  {race.Sprint && <label>
                    <Text id="expectedSprintFinish" />
                    <PointsSelect value={finish.rivalSprint} onChange={(value) => updateFinish(race.round, "rivalSprint", value)} points={sprintPoints} />
                  </label>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="simulator-result">
        <div>
          <span>
            <Text id="projectedTotals" />
          </span>
          <strong>
            {projected.driver} <small>vs</small> {projected.rival}
          </strong>
        </div>
        <div>
          <span>
            <Text id="projectedGap" />
          </span>
          <strong className={gap >= 0 ? "positive" : "negative"}>
            {gap > 0 ? "+" : ""}
            {gap} PTS
          </strong>
        </div>
        <div>
          <span>
            <Text id="driverMaximum" />
          </span>
          <strong>{driverMaximum} PTS</strong>
        </div>
      </div>
    </section>
  );
}
