import { ComparisonHub } from "@/app/components/comparison-hub";
import { Text } from "@/app/components/language";
import {
  constructorStandings,
  driverStandings,
  schedule,
} from "@/lib/f1";

export default function Compare() {
  const remaining = schedule().filter(
    (race) => new Date(`${race.date}T23:59:59Z`) >= new Date(),
  );
  return (
    <main className="page compare-page">
      <div className="eyebrow">
        <Text id="headToHead" />
      </div>
      <h1>
        <Text id="compareTitle" />
      </h1>
      <p className="lead">
        <Text id="compareLead" />
      </p>
      <ComparisonHub
        drivers={driverStandings()}
        teams={constructorStandings()}
        races={remaining}
      />
    </main>
  );
}
