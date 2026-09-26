"use client";

import { Trophy } from "lucide-react";
import { useState } from "react";
import { Text } from "@/app/components/language";

const racePoints = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0];
const sprintPoints = [8, 7, 6, 5, 4, 3, 2, 1, 0];

function FinishSelect({
  label,
  points,
  value,
  onChange,
}: {
  label: string;
  points: number[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {points.map((amount, index) => (
          <option key={index} value={index}>
            {index < points.length - 1
              ? `P${index + 1} — ${amount} pts`
              : "No points / DNF"}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Points() {
  const [raceFinish, setRaceFinish] = useState(0);
  const [sprintFinish, setSprintFinish] = useState(8);
  const race = racePoints[raceFinish];
  const sprint = sprintPoints[sprintFinish];

  return (
    <main className="page">
      <div className="eyebrow">
        <Text id="weekendScoring" />
      </div>
      <h1>
        F1 <Text id="pointsCalculator" />
      </h1>
      <p className="lead">
        <Text id="pointsLead" />
      </p>
      <div className="weekend-points">
        <div className="formgrid">
          <FinishSelect
            label="Grand Prix result"
            points={racePoints}
            value={raceFinish}
            onChange={setRaceFinish}
          />
          <FinishSelect
            label="Sprint result"
            points={sprintPoints}
            value={sprintFinish}
            onChange={setSprintFinish}
          />
        </div>
        <div className="points-breakdown">
          <div>
            <span>GRAND PRIX</span>
            <strong>{race}</strong>
          </div>
          <div>
            <span>SPRINT</span>
            <strong>{sprint}</strong>
          </div>
          <div className="points-total">
            <Trophy aria-hidden="true" size={18} />
            <span>WEEKEND TOTAL</span>
            <strong>{race + sprint} PTS</strong>
          </div>
        </div>
      </div>
    </main>
  );
}
