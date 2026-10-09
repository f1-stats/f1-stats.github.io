import Link from "next/link";
import Image from "next/image";
import { Text } from "@/app/components/language";
import { RaceWeekend } from "@/app/components/race-weekend";
import { circuitImage, schedule } from "@/lib/f1";

export default async function RacesPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const races = schedule(year);
  return (
    <main className="page">
      <h1>
        {year} <Text id="calendarTitle" />
      </h1>
      <p className="lead">
        <Text id="calendarLead" /> <Text id="allTimesUtc" />
      </p>
      <div className="racegrid">
        {races.map((race) => {
          const image = circuitImage(race.Circuit.circuitId);
          return (
            <Link
              href={`/${year}/races/${race.round}`}
              className="race"
              key={race.round}
            >
              <span>
                <Text id="round" /> {race.round}
              </span>
              <h2 title={race.raceName}>{race.raceName}</h2>
              <p>
                {race.Circuit.Location.locality},{" "}
                {race.Circuit.Location.country}
              </p>
              {/* {race.Circuit.circuitId} */}
              {image && (
                <Image
                  className="race-circuit-image"
                  src={image}
                  alt={race.Circuit.circuitName}
                  width={480}
                  height={270}
                />
              )}
              <RaceWeekend race={race} />
            </Link>
          );
        })}
        {races.length === 0 && (
          <div className="empty">
            <Text id="dataWorkflow" />
          </div>
        )}
      </div>
    </main>
  );
}
