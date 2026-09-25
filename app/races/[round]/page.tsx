import { qualifyingResults, results, schedule, sprintResults } from "@/lib/f1";
import { TeamIdentity } from "@/app/components/team-identity";
import { RaceWeekend } from "@/app/components/race-weekend";
import { Text } from "@/app/components/language";

export async function generateStaticParams() {
  return schedule().map((race) => ({
    round: race.round
  }));
}

export default async function RacePage({ params }: { params: Promise<{ round: string }> }) {
  const { round } = await params;
  const race = schedule().find((r) => r.round === round);
  const rows = results(round);
  const qualifying = qualifyingResults(round);
  const sprint = sprintResults(round);

  if (!race) return <main className="page"><h1><Text id="raceNotFound" /></h1></main>;

  return <main className="page detail-page"><div className="eyebrow"><Text id="round" /> {round}</div><h1>{race.raceName}</h1><p className="lead">{race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}</p><h2><Text id="weekendSchedule" /></h2><p className="schedule-note"><Text id="allTimesUtc" /></p><RaceWeekend race={race} />{qualifying.length > 0 && <><h2>Qualifying results</h2><div className="table"><div className="thead"><span><Text id="position" /></span><span><Text id="driver" /></span><span><Text id="team" /></span><span>Q3</span></div>{qualifying.map((r: any) => <div className="tr" key={r.number}><span>{r.position}</span><span className="strong">{r.Driver.givenName} {r.Driver.familyName}</span><span><TeamIdentity team={r.Constructor} /></span><span>{r.Q3 ?? r.Q2 ?? r.Q1 ?? "—"}</span></div>)}</div></>}{sprint.length > 0 && <><h2>Sprint results</h2><div className="table"><div className="thead"><span><Text id="position" /></span><span><Text id="driver" /></span><span><Text id="team" /></span><span><Text id="timeStatus" /></span></div>{sprint.map((r: any) => <div className="tr" key={r.number}><span>{r.position}</span><span className="strong">{r.Driver.givenName} {r.Driver.familyName}</span><span><TeamIdentity team={r.Constructor} /></span><span>{r.Time?.time ?? r.status}</span></div>)}</div></>}{rows.length > 0 && <><h2><Text id="raceResults" /></h2><div className="table"><div className="thead"><span><Text id="position" /></span><span><Text id="driver" /></span><span><Text id="team" /></span><span><Text id="timeStatus" /></span></div>{rows.map((r: any) => <div className="tr" key={r.number}><span>{r.position}</span><span className="strong">{r.Driver.givenName} {r.Driver.familyName}</span><span><TeamIdentity team={r.Constructor} /></span><span>{r.Time?.time ?? r.status}</span></div>)}</div></>}</main>;
}
