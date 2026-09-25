import { ChampionshipSimulator } from "@/app/components/championship-simulator";
import { driverStandings, schedule } from "@/lib/f1";

export default function Championship() {
    const remaining = schedule().filter((race) => new Date(`${race.date}T23:59:59Z`) >= new Date());
    return <main className="page"><div className="eyebrow">SEASON SCENARIO</div><h1>Championship Simulator</h1><p className="lead">Compare two drivers across the remaining calendar and test realistic finishing scenarios.</p><ChampionshipSimulator drivers={driverStandings()} remainingRaces={remaining.length} remainingSprints={remaining.filter((race: any) => race.Sprint).length} /></main>;
}