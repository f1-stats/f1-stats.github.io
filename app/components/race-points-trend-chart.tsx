"use client";

import { useState } from "react";
import { Text, useText } from "@/app/components/language";

type RacePointDriver = {
  code: string;
  name: string;
  points: number;
  color: string;
  teamName: string;
  fastestLapAverageSpeed?: number;
  fastestLapSpeedUnits?: string;
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
  const text = useText();
  const [hover, setHover] = useState<{
    index: number;
    left: number;
    top: number;
  } | null>(null);
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
  const hoveredDriver = hover ? drivers[hover.index] : undefined;
  const hoveredFastestLapSpeed = hoveredDriver?.fastestLapAverageSpeed;

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
          onPointerMove={(event) => {
            const svg = event.currentTarget;
            const transform = svg.getScreenCTM();
            if (!transform) return;

            const cursor = svg.createSVGPoint();
            cursor.x = event.clientX;
            cursor.y = event.clientY;
            const chartPoint = cursor.matrixTransform(transform.inverse());
            if (
              chartPoint.x < chartMargin.left ||
              chartPoint.x > chartWidth - chartMargin.right ||
              chartPoint.y < chartMargin.top ||
              chartPoint.y > chartHeight - chartMargin.bottom
            ) {
              setHover(null);
              return;
            }

            const index = Math.max(
              0,
              Math.min(
                drivers.length - 1,
                Math.round(
                  ((chartPoint.x - chartMargin.left) / plotWidth) *
                    Math.max(0, drivers.length - 1),
                ),
              ),
            );
            const bounds = svg.getBoundingClientRect();
            const scrollArea = svg.parentElement;
            const scrollLeft = scrollArea?.scrollLeft ?? 0;
            const availableWidth = scrollArea?.clientWidth ?? bounds.width;
            const tooltipWidth = 244;
            const pointerLeft = event.clientX - bounds.left;
            const preferredLeft =
              availableWidth - pointerLeft < tooltipWidth + 20
                ? pointerLeft - tooltipWidth - 12
                : pointerLeft + 12;
            const maxLeft = Math.max(8, availableWidth - tooltipWidth - 8);
            const left = Math.max(8, Math.min(preferredLeft, maxLeft));
            setHover({
              index,
              left: scrollLeft + left,
              top: Math.max(
                8,
                Math.min(event.clientY - bounds.top - 42, bounds.height - 86),
              ),
            });
          }}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={chartMargin.left}
                x2={chartWidth - chartMargin.right}
                y1={y(tick)}
                y2={y(tick)}
                stroke="var(--line)"
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
          {hover && (
            <g pointerEvents="none">
              <line
                x1={x(hover.index)}
                x2={x(hover.index)}
                y1={chartMargin.top}
                y2={chartHeight - chartMargin.bottom}
                stroke="var(--text)"
                strokeOpacity="0.78"
                strokeWidth="1.5"
              />
              <circle
                cx={x(hover.index)}
                cy={y(drivers[hover.index].points)}
                r="6"
                fill={drivers[hover.index].color}
                stroke="var(--surface)"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
        {hover && (
          <div
            className="race-analysis-chart-tooltip"
            role="tooltip"
            style={{ left: hover.left, top: hover.top }}
          >
            <strong>
              {title === "driverPointsTrend"
                ? `${drivers[hover.index].code} · ${drivers[hover.index].name}`
                : drivers[hover.index].name}
            </strong>
            <ul>
              <li>
                <span>
                  <i style={{ backgroundColor: drivers[hover.index].color }} />
                  {drivers[hover.index].teamName}
                </span>
                <b>{drivers[hover.index].points} pts</b>
              </li>
              {hoveredFastestLapSpeed !== undefined && hoveredDriver && (
                <li className="race-analysis-chart-tooltip-detail">
                  <span>{text.fastestLapAverageSpeed}</span>
                  <b>{`${hoveredFastestLapSpeed.toFixed(3)} ${hoveredDriver.fastestLapSpeedUnits ?? "km/h"}`}</b>
                </li>
              )}
            </ul>
          </div>
        )}
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
