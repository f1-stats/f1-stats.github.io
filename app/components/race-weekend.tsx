import { Clock3 } from "lucide-react";

type Session = { date?: string; time?: string };
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

function formatSession(session: Session) {
    if (!session.date) return "TBC";
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC"
    }).format(new Date(`${session.date}T${session.time ?? "00:00:00Z"}`));
}

export function RaceWeekend({ race }: { race: RaceWeekendData }) {
    const sessions: [string, Session][] = [
        ["FP1", race.FirstPractice ?? {}],
        ["FP2", race.SecondPractice ?? {}],
        ["FP3", race.ThirdPractice ?? {}],
        ["Sprint qualifying", race.SprintQualifying ?? {}],
        ["Sprint", race.Sprint ?? {}],
        ["Qualifying", race.Qualifying ?? {}],
        ["Race", { date: race.date, time: race.time }]
    ];
    const scheduledSessions = sessions.filter(([, session]) => Boolean(session.date));

    return <div className="session-list">
        {scheduledSessions.map(([name, session]) => <div className="session" key={name}>
            <span>{name === "Race" && <Clock3 aria-hidden="true" size={13} />} {name}</span>
            <time>{formatSession(session)}</time>
        </div>)}
    </div>;
}