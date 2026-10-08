import { ComparisonHub } from "@/app/components/comparison-hub";
import { Text } from "@/app/components/language";
import { constructorStandings, driverStandings, schedule } from "@/lib/f1";

export default async function Compare({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const remaining = schedule(year).filter(
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
        drivers={driverStandings(year)}
        teams={constructorStandings(year)}
        races={remaining}
        year={year}
      />
    </main>
  );
}
