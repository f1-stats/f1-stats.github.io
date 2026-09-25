"use client";

import { useState } from "react";

type Driver = {
    position: string;
    points: string;
    Driver: { driverId: string; givenName: string; familyName: string };
};

const racePoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0];
const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1, 0];

function nameOf(driver: Driver) {
    return `${driver.Driver.givenName} ${driver.Driver.familyName}`;
}

function PointsSelect({ value, onChange, points }: { value: number; onChange: (value: number) => void; points: number[] }) {
    return <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {points.map((amount, index) => <option key={index} value={index}>{index < points.length - 1 ? `P${index + 1} (${amount} pts)` : "No points"}</option>)}
    </select>;
}

export function ChampionshipSimulator({ drivers, remainingRaces, remainingSprints }: { drivers: Driver[]; remainingRaces: number; remainingSprints: number }) {
    const [driverId, setDriverId] = useState(drivers[0]?.Driver.driverId ?? "");
    const [rivalId, setRivalId] = useState(drivers[1]?.Driver.driverId ?? drivers[0]?.Driver.driverId ?? "");
    const [driverRaceFinish, setDriverRaceFinish] = useState(0);
    const [rivalRaceFinish, setRivalRaceFinish] = useState(1);
    const [driverSprintFinish, setDriverSprintFinish] = useState(0);
    const [rivalSprintFinish, setRivalSprintFinish] = useState(1);
    const driver = drivers.find((item) => item.Driver.driverId === driverId) ?? drivers[0];
    const rival = drivers.find((item) => item.Driver.driverId === rivalId) ?? drivers[1] ?? drivers[0];

    if (!driver || !rival) return <div className="empty">Standings data is not available yet.</div>;

    const driverProjected = Number(driver.points) + remainingRaces * racePoints[driverRaceFinish] + remainingSprints * sprintPoints[driverSprintFinish];
    const rivalProjected = Number(rival.points) + remainingRaces * racePoints[rivalRaceFinish] + remainingSprints * sprintPoints[rivalSprintFinish];
    const driverMaximum = Number(driver.points) + remainingRaces * racePoints[0] + remainingSprints * sprintPoints[0];
    const gap = driverProjected - rivalProjected;

    return <section className="simulator">
        <div className="simulator-summary"><span>REMAINING</span><strong>{remainingRaces} races · {remainingSprints} sprints</strong></div>
        <div className="simulator-grid">
            <div className="simulator-driver"><label>DRIVER<select value={driverId} onChange={(event) => setDriverId(event.target.value)}>{drivers.map((item) => <option key={item.Driver.driverId} value={item.Driver.driverId}>{nameOf(item)}</option>)}</select></label><p>Current: <b>{driver.points} PTS</b> · P{driver.position}</p><label>Expected race finish<PointsSelect value={driverRaceFinish} onChange={setDriverRaceFinish} points={racePoints} /></label>{remainingSprints > 0 && <label>Expected sprint finish<PointsSelect value={driverSprintFinish} onChange={setDriverSprintFinish} points={sprintPoints} /></label>}</div>
            <div className="simulator-driver"><label>RIVAL<select value={rivalId} onChange={(event) => setRivalId(event.target.value)}>{drivers.map((item) => <option key={item.Driver.driverId} value={item.Driver.driverId}>{nameOf(item)}</option>)}</select></label><p>Current: <b>{rival.points} PTS</b> · P{rival.position}</p><label>Expected race finish<PointsSelect value={rivalRaceFinish} onChange={setRivalRaceFinish} points={racePoints} /></label>{remainingSprints > 0 && <label>Expected sprint finish<PointsSelect value={rivalSprintFinish} onChange={setRivalSprintFinish} points={sprintPoints} /></label>}</div>
        </div>
        <div className="simulator-result"><div><span>PROJECTED TOTALS</span><strong>{driverProjected} <small>vs</small> {rivalProjected}</strong></div><div><span>PROJECTED GAP</span><strong className={gap >= 0 ? "positive" : "negative"}>{gap > 0 ? "+" : ""}{gap} PTS</strong></div><div><span>DRIVER MAXIMUM</span><strong>{driverMaximum} PTS</strong></div></div>
    </section>;
}