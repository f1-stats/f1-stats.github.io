import { Text } from "@/app/components/language";

type QualifyingDriver = {
  code: string;
  name: string;
  session: "Q1" | "Q2" | "Q3";
  time: number;
  color: string;
  teamName: string;
};

const chartWidth = 960;
const chartHeight = 340;
const chartMargin = { top: 20, right: 24, bottom: 42, left: 72 };

function formatLapTime(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = (time % 60).toFixed(3).padStart(6, "0");
  return `${minutes}:${seconds}`;
}

export function QualifyingLapTrendChart({
  drivers,
}: {
  drivers: QualifyingDriver[];
}) {
  const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
  const lapTimes = drivers.map((driver) => driver.time);
  if (!lapTimes.length) return null;

  const axisMin = Math.floor((Math.min(...lapTimes) - 0.5) * 2) / 2;
  const axisMax = Math.ceil((Math.max(...lapTimes) + 0.5) * 2) / 2;
  const x = (index: number) =>
    chartMargin.left +
    (drivers.length === 1
      ? plotWidth / 2
      : (index / (drivers.length - 1)) * plotWidth);
  const y = (time: number) =>
    chartMargin.top + ((time - axisMin) / (axisMax - axisMin)) * plotHeight;
  const ticks = Array.from(
    { length: 5 },
    (_, index) => axisMin + ((axisMax - axisMin) / 4) * index,
  );
  const teams = [
    ...new Map(
      drivers.map((driver) => [driver.teamName, driver.color]),
    ).entries(),
  ];

  return (
    <section className="race-points-trend qualifying-lap-trend">
      <div className="race-points-trend-heading">
        <div>
          <h2>
            <Text id="qualifyingLapTrend" />
          </h2>
          <p>
            <Text id="qualifyingLapTrendLead" />
          </p>
        </div>
      </div>
      <div className="race-points-trend-scroll">
        <svg
          className="race-points-trend-svg"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Qualifying lap time by driver in this race"
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
                {formatLapTime(tick)}
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
              y1={y(driver.time)}
              x2={x(index + 1)}
              y2={y(drivers[index + 1].time)}
              stroke={driver.color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ))}
          {drivers.map((driver, index) => (
            <circle
              key={driver.code}
              cx={x(index)}
              cy={y(driver.time)}
              r="4"
              fill={driver.color}
            >
              <title>{`${driver.name} · ${driver.session}: ${formatLapTime(driver.time)}`}</title>
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
