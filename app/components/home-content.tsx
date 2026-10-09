import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Text } from "@/app/components/language";
import { TeamIdentity } from "@/app/components/team-identity";
import {
  driverStandings,
  constructorStandings,
  schedule,
  displayName,
} from "@/lib/f1";

export function HomeContent({ year }: { year: string }) {
  const drivers = driverStandings(year).slice(0, 8),
    teams = constructorStandings(year).slice(0, 5),
    races = schedule(year);
  const next = races.find(
    (r: any) => new Date(r.date + "T23:59:59") >= new Date(),
  );
  const last = [...races]
    .reverse()
    .find((r: any) => new Date(r.date + "T23:59:59") < new Date());
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="eyebrow">
            <Text id="heroEyebrow" /> · {year}
          </div>
          <h1>
            <Text id="heroTitle" />
            <br />
            <em>
              <Text id="heroTitleAccent" />
            </em>
          </h1>
          <p>
            <Text id="heroDescription" />
          </p>
          <div className="actions">
            <Link className="button" href={`/${year}/drivers`}>
              <Text id="driverStandings" />
            </Link>
            <Link className="button ghost" href={`/${year}/races`}>
              <Text id="raceCalendar" />
            </Link>
          </div>
        </div>
      </section>
      <div className="wrap content">
        <section className="home-standings">
          <div className="sectionhead">
            <div>
              <div className="eyebrow">
                <Text id="championship" />
              </div>
              <h2>
                <Text id="driverStandings" />
              </h2>
            </div>
            <Link className="link-icon" href={`/${year}/drivers`}>
              <Text id="viewAll" /> <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="table">
            {drivers.map((d: any) => (
              <Link
                className="tr"
                key={d.Driver.driverId}
                href={`/${year}/drivers/${d.Driver.driverId}`}
              >
                <span>{String(d.position).padStart(2, "0")}</span>
                <span className="strong">{displayName(d.Driver)}</span>
                <span className="muted">
                  <TeamIdentity team={d.Constructors?.[0]} />
                </span>
                <span className="strong">{d.points} PTS</span>
              </Link>
            ))}
            {!drivers.length && (
              <div className="empty">
                Run “Update F1 data” in GitHub Actions to load live data.
              </div>
            )}
          </div>
        </section>
        <section>
          <div className="sectionhead">
            <div>
              <div className="eyebrow">
                <Text id="constructors" />
              </div>
              <h2>
                <Text id="teamStandings" />
              </h2>
            </div>
            <Link className="link-icon" href={`/${year}/teams`}>
              <Text id="viewAll" /> <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="teamgrid">
            {teams.map((t: any) => (
              <Link
                className="team"
                href={`/${year}/teams/${t.Constructor.constructorId}`}
                key={t.Constructor.constructorId}
              >
                <b>{t.Constructor.name}</b>
                <strong>{t.points}</strong>
                <span>{t.wins} wins</span>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <div className="sectionhead">
            <div>
              <div className="eyebrow">
                <Text id="season" />
              </div>
              <h2>
                <Text id="raceStatus" />
              </h2>
            </div>
          </div>
          <div className="featuregrid">
            <div className="feature">
              <span>
                <Text id="lastRace" />
              </span>
              <h3>{last?.raceName ?? "Waiting for data"}</h3>
              <p>{last?.date ?? "—"}</p>
              <Link
                className="link-icon"
                href={last ? `/${year}/races/${last.round}` : `/${year}/races`}
              >
                <Text id="raceDetails" />{" "}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="feature accent">
              <span>
                <Text id="nextRace" />
              </span>
              <h3>{next?.raceName ?? "Calendar loading"}</h3>
              <p>{next?.date ?? "—"}</p>
              <Link
                className="link-icon"
                href={next ? `/${year}/races/${next.round}` : `/${year}/races`}
              >
                <Text id="weekendDetails" />{" "}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
