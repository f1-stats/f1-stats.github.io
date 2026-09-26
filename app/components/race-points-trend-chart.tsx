import { Text } from "@/app/components/language";

type RacePointDriver = {
  code: string;
  name: string;
  points: number;
  color: string;
  teamName: string;
};

const chartWidth = 960;
const chartHeight = 340;
const chartMargin = { top: 20, right: 24, bottom: 42, left: 54 };

export function RacePointsTrendChart({
  drivers,
  title = "racePointsChart",
  lead = "racePointsChartLead",
}: {
  drivers: RacePointDriver[];
  title?: "racePointsChart" | "driverPointsTrend";
  lead?: "racePointsChartLead" | "driverPointsTrendLead";
}) {
  const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
  const x = (index: number) =>
    chartMargin.left +
    (drivers.length === 1
      ? plotWidth / 2
      : (index / (drivers.length - 1)) * plotWidth);
  const y = (points: number) =>
    chartMargin.top + plotHeight - (Math.min(points, 25) / 25) * plotHeight;
  const ticks = [0, 5, 10, 15, 20, 25];
  const teams = [
    ...new Map(
      drivers.map((driver) => [driver.teamName, driver.color]),
    ).entries(),
  ];

  return (
    <section className="race-points-trend">
      <div className="race-points-trend-heading">
        <div>
          <h2>
            <Text id={title} />
          </h2>
          <p>
            <Text id={lead} />
          </p>
        </div>
        <span>
          <Text id="points" />
        </span>
      </div>
      <div className="race-points-trend-scroll">
        <svg
          className="race-points-trend-svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label={
            title === "driverPointsTrend"
              ? "Driver race points by round, maximum 25"
              : "Race points awarded to each driver, maximum 25"
          }
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={chartMargin.left}
                x2={chartWidth - chartMargin.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="#ffffff18"
              />
              <text x={chartMargin.left - 12} y={y(tick) + 4} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          {drivers.map((driver, index) => (
            <text
              key={driver.code}
              x={x(index)}
              y={chartHeight - 12}
              textAnchor="middle"
              fill={driver.color}
            >
              {driver.code}
            </text>
          ))}
          {drivers.slice(0, -1).map((driver, index) => (
            <line
              key={`${driver.code}-${drivers[index + 1].code}`}
              x1={x(index)}
              y1={y(driver.points)}
              x2={x(index + 1)}
              y2={y(drivers[index + 1].points)}
              stroke={driver.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          {drivers.map((driver, index) => (
            <circle
              key={driver.code}
              cx={x(index)}
              cy={y(driver.points)}
              r="4"
              fill={driver.color}
            >
              <title>{`${driver.name}: ${driver.points} pts`}</title>
            </circle>
          ))}
        </svg>
      </div>
      <ul className="race-points-trend-legend">
        {teams.map(([teamName, color]) => (
          <li key={teamName}>
            <span style={{ backgroundColor: color }} />
            {teamName}
          </li>
        ))}
      </ul>
    </section>
  );
}
