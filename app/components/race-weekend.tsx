"use client";

import { useEffect, useState } from "react";
import { Flag } from "lucide-react";
import { Text } from "@/app/components/language";

type Session = { date?: string; time?: string };
type SessionName =
  | "fp1"
  | "fp2"
  | "fp3"
  | "sprintQualifying"
  | "sprint"
  | "qualifying"
  | "race";
type RaceWeekendData = {
  date: string;
  time?: string;
  FirstPractice?: Session;
  SecondPractice?: Session;
  ThirdPractice?: Session;
  SprintQualifying?: Session;
  Sprint?: Session;
  Qualifying?: Session;
};

function formatSession(session: Session, timeZone: string) {
  if (!session.date) return "TBC";
  const parts = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(new Date(`${session.date}T${session.time ?? "00:00:00Z"}`));
  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}/${getPart("month")}/${getPart("day")} ${getPart("hour")}:${getPart("minute")}`;
}

export function RaceWeekend({ race }: { race: RaceWeekendData }) {
  const [timeZone, setTimeZone] = useState("UTC");

  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
  }, []);

  const sessions: [SessionName, Session][] = [
    ["fp1", race.FirstPractice ?? {}],
    ["fp2", race.SecondPractice ?? {}],
    ["fp3", race.ThirdPractice ?? {}],
    ["sprintQualifying", race.SprintQualifying ?? {}],
    ["sprint", race.Sprint ?? {}],
    ["qualifying", race.Qualifying ?? {}],
    ["race", { date: race.date, time: race.time }],
  ];
  const scheduledSessions = sessions.filter(([, session]) =>
    Boolean(session.date),
  );

  return (
    <div className="session-list">
      <div className="session-zone">
        <Text id="localTimeZone" />: {timeZone}
      </div>
      <div className="session session-header" aria-hidden="true">
        <span>
          <Text id="session" />
        </span>
        <span>
          <Text id="utc" />
        </span>
        <span>
          <Text id="localTime" />
        </span>
      </div>
      {scheduledSessions.map(([name, session]) => (
        <div className="session" key={name}>
          <span>
            {name === "race" && <Flag aria-hidden="true" size={13} />}{" "}
            <Text id={name} />
          </span>
          <time>{formatSession(session, "UTC")}</time>
          <time>{formatSession(session, timeZone)}</time>
        </div>
      ))}
    </div>
  );
}
