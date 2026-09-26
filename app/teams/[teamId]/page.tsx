import Link from "next/link";
import { constructorStandings, driverStandings } from "@/lib/f1";
import { Text } from "@/app/components/language";

export async function generateStaticParams() {
  return constructorStandings().map((team) => ({
    teamId: team.Constructor.constructorId,
  }));
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const team = constructorStandings().find(
    (x) => x.Constructor.constructorId === teamId,
  );
  const drivers = driverStandings().filter((x) =>
    x.Constructors?.some((c) => c.constructorId === teamId),
  );

  if (!team)
    return (
      <main className="page">
        <h1>
          <Text id="teamNotFound" />
        </h1>
      </main>
    );

  return (
    <main className="page detail-page">
      <div className="eyebrow">
        <Text id="constructorSeason" />
      </div>
      <h1>{team.Constructor.name}</h1>
      <p className="lead">
        P{team.position} · {team.points} <Text id="points" /> · {team.wins}{" "}
        <Text id="wins" />
      </p>
      <h2>
        <Text id="drivers" />
      </h2>
      <div className="cards">
        {drivers.map((d) => (
          <Link href={`/drivers/${d.Driver.driverId}`} key={d.Driver.driverId}>
            <b>
              {d.Driver.givenName} {d.Driver.familyName}
            </b>
            <strong>{d.points} PTS</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
