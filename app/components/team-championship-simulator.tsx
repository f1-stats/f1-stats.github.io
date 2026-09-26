"use client";

import { useState } from "react";
import { Text } from "@/app/components/language";
import {
  PointsSelect,
  racePoints,
  startingFinish,
  sprintPoints,
} from "@/app/components/championship-simulator";
import type { ConstructorStanding, DriverStanding, Race } from "@/lib/f1";

type DriverFinish = { race: number; sprint: number };
type WeekendFinishes = Record<string, DriverFinish>;

function driverName(driver: DriverStanding) {
  return `${driver.Driver.givenName} ${driver.Driver.familyName}`;
}

export function TeamChampionshipSimulator({
  teams,
  drivers,
  races,
  teamId,
  rivalTeamId,
}: {
  teams: ConstructorStanding[];
  drivers: DriverStanding[];
  races: Race[];
  teamId: string;
  rivalTeamId: string;
}) {
  const team =
    teams.find((item) => item.Constructor.constructorId === teamId) ?? teams[0];
  const rivalTeam =
    teams.find((item) => item.Constructor.constructorId === rivalTeamId) ??
    teams[1] ??
    teams[0];
  const teamDrivers = drivers.filter((driver) =>
    driver.Constructors?.some(
      (constructor) => constructor.constructorId === teamId,
    ),
  );
  const rivalDrivers = drivers.filter((driver) =>
    driver.Constructors?.some(
      (constructor) => constructor.constructorId === rivalTeamId,
    ),
  );
  const scenarioDrivers = Array.from(
    new Map(
      [...teamDrivers, ...rivalDrivers].map((driver) => [
        driver.Driver.driverId,
        driver,
      ]),
    ).values(),
  );
  const [finishes, setFinishes] = useState<Record<string, WeekendFinishes>>(
    () =>
      Object.fromEntries(
        races.map((race, roundIndex) => [
          race.round,
          Object.fromEntries(
            scenarioDrivers.map((driver, driverIndex) => [
              driver.Driver.driverId,
              {
                race: startingFinish(
                  driver.position,
                  roundIndex + driverIndex,
                  racePoints,
                ),
                sprint: startingFinish(
                  driver.position,
                  roundIndex + driverIndex,
                  sprintPoints,
                ),
              },
            ]),
          ),
        ]),
      ),
  );

  if (!team || !rivalTeam)
    return <div className="empty">Standings data is not available yet.</div>;

  function updateFinish(
    round: string,
    driverId: string,
    session: keyof DriverFinish,
    value: number,
  ) {
    setFinishes((current) => ({
      ...current,
      [round]: {
        ...current[round],
        [driverId]: { ...current[round][driverId], [session]: value },
      },
    }));
  }

  function projectTeam(teamPoints: string, members: DriverStanding[]) {
    return (
      Number(teamPoints) +
      races.reduce((total, race) => {
        return (
          total +
          members.reduce((roundPoints, driver) => {
            const finish = finishes[race.round][driver.Driver.driverId];
            return (
              roundPoints +
              racePoints[finish.race] +
              (race.Sprint ? sprintPoints[finish.sprint] : 0)
            );
          }, 0)
        );
      }, 0)
    );
  }

  const projected = projectTeam(team.points, teamDrivers);
  const rivalProjected = projectTeam(rivalTeam.points, rivalDrivers);
  const maximumFor = (teamPoints: string, members: DriverStanding[]) =>
    Number(teamPoints) +
    races.reduce(
      (total, race) =>
        total +
        members.length * (racePoints[0] + (race.Sprint ? sprintPoints[0] : 0)),
      0,
    );
  const maximum = maximumFor(team.points, teamDrivers);
  const gap = projected - rivalProjected;
  const sprintCount = races.filter((race) => race.Sprint).length;

  return (
    <section className="simulator team-simulator">
      <div className="simulator-summary">
        <span>
          <Text id="remaining" />
        </span>
        <strong>
          {races.length} <Text id="raceCount" /> · {sprintCount}{" "}
          <Text id="sprintCount" />
        </strong>
      </div>
      <div className="scenario-section-heading">
        <Text id="raceByRaceScenario" />
      </div>
      <p className="scenario-defaults">
        <Text id="scenarioDefaults" />
      </p>
      <div className="scenario-list">
        {races.map((race) => (
          <div className="scenario-weekend" key={race.round}>
            <div className="scenario-weekend-heading">
              <span>
                <Text id="round" /> {race.round}
              </span>
              <h3>{race.raceName}</h3>
            </div>
            <div className="team-scenario-teams">
              {[
                { selectedTeam: team, members: teamDrivers },
                { selectedTeam: rivalTeam, members: rivalDrivers },
              ].map(({ selectedTeam, members }) => (
                <div
                  className="team-scenario-team"
                  key={selectedTeam.Constructor.constructorId}
                >
                  <h4>{selectedTeam.Constructor.name}</h4>
                  {members.map((driver) => {
                    const driverId = driver.Driver.driverId;
                    const finish = finishes[race.round][driverId];
                    return (
                      <div className="team-scenario-driver" key={driverId}>
                        <h5>{driverName(driver)}</h5>
                        <div className="team-scenario-controls">
                          <label>
                            <Text id="expectedRaceFinish" />
                            <PointsSelect
                              value={finish.race}
                              onChange={(value) =>
                                updateFinish(
                                  race.round,
                                  driverId,
                                  "race",
                                  value,
                                )
                              }
                              points={racePoints}
                            />
                          </label>
                          {race.Sprint && (
                            <label>
                              <Text id="expectedSprintFinish" />
                              <PointsSelect
                                value={finish.sprint}
                                onChange={(value) =>
                                  updateFinish(
                                    race.round,
                                    driverId,
                                    "sprint",
                                    value,
                                  )
                                }
                                points={sprintPoints}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="simulator-result">
        <div>
          <span>
            <Text id="projectedTotals" />
          </span>
          <strong>
            {projected} <small>vs</small> {rivalProjected}
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
            <Text id="teamMaximum" />
          </span>
          <strong>{maximum} PTS</strong>
        </div>
      </div>
    </section>
  );
}
