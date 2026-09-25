import { driverStandings, displayName, results, schedule } from "@/lib/f1";
import { Text } from "@/app/components/language";

export async function generateStaticParams() {
  return driverStandings().map((driver) => ({
    driverId: driver.Driver.driverId
  }));
}

export default async function DriverPage({ params }: { params: Promise<{ driverId: string }> }) {
  const { driverId } = await params;
  const driver = driverStandings().find((x) => x.Driver.driverId === driverId);

  if (!driver) return <main className="page"><h1><Text id="driverNotFound" /></h1></main>;

  const races = schedule();
  const all = races.flatMap((race) =>
    results(race.round)
      .filter((result: any) => result.Driver.driverId === driverId)
      .map((result: any) => ({ ...result, round: race.round, raceName: race.raceName }))
  );

  return <main className="page detail-page"><div className="eyebrow"><Text id="driverSeason" /></div><h1>{displayName(driver.Driver)}</h1><p className="lead">{driver.Constructors?.[0]?.name} · {driver.points} <Text id="points" /> · {driver.wins} <Text id="wins" /></p>
    <section className="cards"><div><b><Text id="championship" /></b><strong>P{driver.position}</strong></div><div><b><Text id="points" /></b><strong>{driver.points}</strong></div><div><b><Text id="wins" /></b><strong>{driver.wins}</strong></div></section>
    <h2><Text id="raceResults" /></h2><div className="table driver-results"><div className="thead"><span><Text id="round" /></span><span><Text id="race" /></span><span><Text id="grid" /></span><span><Text id="result" /></span><span><Text id="points" /></span></div>{all.map((x: any) => <div className="tr" key={`${x.round}-${x.number}`}><span>{x.round}</span><span>{x.raceName}</span><span>{x.grid}</span><span>{x.position}</span><span className="strong">{x.points}</span></div>)}</div>
  </main>;
}
