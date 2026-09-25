"use client";

import Link from "next/link";
import { ArrowLeftRight, Trophy } from "lucide-react";
import { useState } from "react";
import { TeamIdentity } from "@/app/components/team-identity";

type DriverRow = {
    position: string;
    points: string;
    wins: string;
    Driver: { driverId: string; givenName: string; familyName: string };
    Constructors?: { constructorId: string; name: string }[];
};

function driverName(driver: DriverRow) {
    return `${driver.Driver.givenName} ${driver.Driver.familyName}`;
}

export function DriverComparison({ drivers }: { drivers: DriverRow[] }) {
    const [leftId, setLeftId] = useState(drivers[0]?.Driver.driverId ?? "");
    const [rightId, setRightId] = useState(drivers[1]?.Driver.driverId ?? drivers[0]?.Driver.driverId ?? "");
    const left = drivers.find((driver) => driver.Driver.driverId === leftId) ?? drivers[0];
    const right = drivers.find((driver) => driver.Driver.driverId === rightId) ?? drivers[1] ?? drivers[0];

    if (!left || !right) return <div className="empty">Standings data is not available yet.</div>;

    const metrics = [
        { label: "Championship position", left: Number(left.position), right: Number(right.position), suffix: "", lowerIsBetter: true },
        { label: "Points", left: Number(left.points), right: Number(right.points), suffix: " PTS" },
        { label: "Wins", left: Number(left.wins), right: Number(right.wins), suffix: "" }
    ];

    return <section className="comparison">
        <div className="compare-selectors">
            <label>DRIVER A<select value={leftId} onChange={(event) => setLeftId(event.target.value)}>{drivers.map((driver) => <option key={driver.Driver.driverId} value={driver.Driver.driverId}>{driverName(driver)}</option>)}</select></label>
            <button className="compare-swap" type="button" aria-label="Swap compared drivers" title="Swap drivers" onClick={() => { setLeftId(rightId); setRightId(leftId); }}><ArrowLeftRight aria-hidden="true" size={18} /></button>
            <label>DRIVER B<select value={rightId} onChange={(event) => setRightId(event.target.value)}>{drivers.map((driver) => <option key={driver.Driver.driverId} value={driver.Driver.driverId}>{driverName(driver)}</option>)}</select></label>
        </div>
        <div className="compare-drivers">
            <Link className="compare-driver" href={`/drivers/${left.Driver.driverId}`}><span>DRIVER A</span><h2>{driverName(left)}</h2><TeamIdentity team={left.Constructors?.[0]} /></Link>
            <div className="compare-versus" aria-hidden="true"><Trophy size={18} /><b>VS</b></div>
            <Link className="compare-driver compare-driver-right" href={`/drivers/${right.Driver.driverId}`}><span>DRIVER B</span><h2>{driverName(right)}</h2><TeamIdentity team={right.Constructors?.[0]} /></Link>
        </div>
        <div className="compare-metrics">
            {metrics.map((metric) => {
                const leftLeads = metric.lowerIsBetter ? metric.left < metric.right : metric.left > metric.right;
                const rightLeads = metric.lowerIsBetter ? metric.right < metric.left : metric.right > metric.left;
                return <div className="compare-metric" key={metric.label}>
                    <strong className={leftLeads ? "metric-lead" : ""}>{metric.lowerIsBetter ? `P${metric.left}` : metric.left}{metric.suffix}</strong>
                    <span>{metric.label}</span>
                    <strong className={rightLeads ? "metric-lead" : ""}>{metric.lowerIsBetter ? `P${metric.right}` : metric.right}{metric.suffix}</strong>
                </div>;
            })}
        </div>
    </section>;
}