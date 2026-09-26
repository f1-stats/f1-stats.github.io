import Link from "next/link";
import { Text } from "@/app/components/language";
import { RaceWeekend } from "@/app/components/race-weekend";
import { schedule } from "@/lib/f1";

export default function RacesPage() {
  const races = schedule();
  return (
    <main className="page">
      <h1>
        <Text id="calendarTitle" />
      </h1>
      <p className="lead">
        <Text id="calendarLead" /> <Text id="allTimesUtc" />
      </p>
      <div className="racegrid">
        {races.map((race: any) => (
          <Link href={`/races/${race.round}`} className="race" key={race.round}>
            <span>
              <Text id="round" /> {race.round}
            </span>
            <h2>{race.raceName}</h2>
            <p>
              {race.Circuit.Location.locality}, {race.Circuit.Location.country}
            </p>
            <RaceWeekend race={race} />
          </Link>
        ))}
        {races.length === 0 && (
          <div className="empty">
            <Text id="dataWorkflow" />
          </div>
        )}
      </div>
    </main>
  );
}
