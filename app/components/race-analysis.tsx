"use client";

import { Fragment, useState } from "react";
import { Plus, X } from "lucide-react";
import { useText } from "@/app/components/language";
import { useChartWidth } from "@/app/components/use-chart-width";
import type { RaceLap, RacePitStop } from "@/lib/f1";

type RaceDriver = {
  driverId: string;
  name: string;
  constructorId: string;
  teamName: string;
  color: string;
  fastestLap?: {
    lap: number;
    averageSpeed?: number;
    units?: string;
  };
};
function parseLapTime(value: string): number | null {
  const parts = value.split(":").map(Number);
  if (parts.some((part) => !Number.isFinite(part))) return null;
  return parts.length === 2 ? parts[0] * 60 + parts[1] : (parts[0] ?? null);
}

function formatLapTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${minutes}:${remainder}`;
}

function formatPitStopDuration(value: string): string {
  const seconds = parseLapTime(value);
  return seconds === null ? value : `${seconds.toFixed(3)} s`;
}

function LapTimeChart({
  laps,
  drivers,
  label,
  fastestSpeedLabel,
  speedUnavailableLabel,
}: {
  laps: RaceLap[];
  drivers: RaceDriver[];
  label: string;
  fastestSpeedLabel: string;
  speedUnavailableLabel: string;
}) {
  const [containerRef, width] = useChartWidth(840);
  const [hover, setHover] = useState<{
    lap: number;
    left: number;
    top: number;
  } | null>(null);
  const series = drivers
    .map((driver) => ({
      driver,
      points: laps.flatMap((lap) => {
        const timing = lap.Timings.find(
          (row) => row.driverId === driver.driverId,
        );
        const seconds = timing ? parseLapTime(timing.time) : null;
        return seconds === null ? [] : [{ lap: Number(lap.number), seconds }];
      }),
    }))
    .filter((item) => item.points.length > 0);
  const points = series.flatMap((item) => item.points);

  if (points.length === 0) return null;

  const height = 310;
  const margin = { top: 20, right: 24, bottom: 42, left: 68 };
  const minLapTime = Math.min(...points.map((point) => point.seconds));
  const maxLapTime = Math.max(...points.map((point) => point.seconds));
  const lapTimeRange = maxLapTime - minLapTime || 1;
  const maxLap = Math.max(...points.map((point) => point.lap));
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const x = (lap: number) =>
    margin.left + ((lap - 1) / Math.max(1, maxLap - 1)) * plotWidth;
  const y = (seconds: number) =>
    margin.top + ((maxLapTime - seconds) / lapTimeRange) * plotHeight;
  return (
    <div ref={containerRef} className="race-analysis-chart-scroll">
      <svg
        className="race-analysis-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${label}: ${series.map((item) => item.driver.name).join(", ")}`}
        onPointerMove={(event) => {
          const svg = event.currentTarget;
          const transform = svg.getScreenCTM();
          if (!transform) return;

          const cursor = svg.createSVGPoint();
          cursor.x = event.clientX;
          cursor.y = event.clientY;
          const chartPoint = cursor.matrixTransform(transform.inverse());
          if (
            chartPoint.x < margin.left ||
            chartPoint.x > width - margin.right ||
            chartPoint.y < margin.top ||
            chartPoint.y > height - margin.bottom
          ) {
            setHover(null);
            return;
          }

          const lap = Math.max(
            1,
            Math.min(
              maxLap,
              Math.round(
                ((chartPoint.x - margin.left) / plotWidth) * (maxLap - 1) + 1,
              ),
            ),
          );
          const bounds = svg.getBoundingClientRect();
          const scrollArea = svg.parentElement;
          const scrollLeft = scrollArea?.scrollLeft ?? 0;
          const availableWidth = scrollArea?.clientWidth ?? bounds.width;
          const tooltipWidth = 244;
          const tooltipHeight = Math.min(210, 46 + series.length * 48);
          const pointerLeft = event.clientX - bounds.left;
          const preferredLeft =
            availableWidth - pointerLeft < tooltipWidth + 20
              ? pointerLeft - tooltipWidth - 12
              : pointerLeft + 12;
          const maxLeft = Math.max(8, availableWidth - tooltipWidth - 8);
          const leftInViewport = Math.max(8, Math.min(preferredLeft, maxLeft));
          setHover({
            lap,
            left: scrollLeft + leftInViewport,
            top: Math.max(
              8,
              Math.min(
                event.clientY - bounds.top - tooltipHeight / 2,
                bounds.height - tooltipHeight - 8,
              ),
            ),
          });
        }}
        onPointerLeave={() => setHover(null)}
      >
        {[0, 1, 2, 3].map((index) => {
          const value = maxLapTime - (lapTimeRange * index) / 3;
          const yPosition = y(value);
          return (
            <g key={index}>
              <line
                x1={margin.left}
                x2={width - margin.right}
                y1={yPosition}
                y2={yPosition}
                stroke="var(--line)"
              />
              <text x={margin.left - 10} y={yPosition + 4} textAnchor="end">
                {formatLapTime(value)}
              </text>
            </g>
          );
        })}
        {series.map(({ driver, points: driverPoints }, index) => {
          const linePoints = driverPoints
            .map((point) => `${x(point.lap)},${y(point.seconds)}`)
            .join(" ");
          return (
            <g key={driver.driverId}>
              <polyline
                points={linePoints}
                fill="none"
                stroke={driver.color}
                strokeWidth="2.5"
                strokeDasharray={index % 2 === 1 ? "5 4" : undefined}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {driverPoints.map((point) => (
                <circle
                  key={point.lap}
                  cx={x(point.lap)}
                  cy={y(point.seconds)}
                  r="2.5"
                  fill={driver.color}
                >
                  <title>
                    {`${driver.name} · ${label} ${point.lap}: ${formatLapTime(point.seconds)}`}
                  </title>
                </circle>
              ))}
            </g>
          );
        })}
        {hover && (
          <g pointerEvents="none">
            <line
              x1={x(hover.lap)}
              x2={x(hover.lap)}
              y1={margin.top}
              y2={height - margin.bottom}
              stroke="var(--text)"
              strokeOpacity="0.78"
              strokeWidth="1.5"
            />
            {series.flatMap(({ driver, points: driverPoints }) => {
              const point = driverPoints.find(
                (entry) => entry.lap === hover.lap,
              );
              return point ? (
                <circle
                  key={`hover-${driver.driverId}`}
                  cx={x(point.lap)}
                  cy={y(point.seconds)}
                  r="5"
                  fill={driver.color}
                  stroke="var(--surface)"
                  strokeWidth="2"
                />
              ) : (
                []
              );
            })}
          </g>
        )}
        <text
          x={margin.left}
          y={height - 12}
          textAnchor="start"
          className="race-analysis-axis-label"
        >
          1
        </text>
        <text
          x={width - margin.right}
          y={height - 12}
          textAnchor="end"
          className="race-analysis-axis-label"
        >
          {maxLap}
        </text>
      </svg>
      {hover && (
        <div
          className="race-analysis-chart-tooltip"
          role="tooltip"
          style={{ left: hover.left, top: hover.top }}
        >
          <strong>{`${label} ${hover.lap}`}</strong>
          <ul>
            {series.map(({ driver, points: driverPoints }) => {
              const point = driverPoints.find(
                (entry) => entry.lap === hover.lap,
              );
              return (
                <Fragment key={driver.driverId}>
                  <li>
                    <span>
                      <i style={{ backgroundColor: driver.color }} />
                      {driver.name}
                    </span>
                    <b>{point ? formatLapTime(point.seconds) : "—"}</b>
                  </li>
                  {point &&
                    driver.fastestLap?.lap === hover.lap && (
                      <li className="race-analysis-chart-tooltip-detail">
                        <span>{fastestSpeedLabel}</span>
                        <b>
                          {driver.fastestLap.averageSpeed === undefined
                            ? speedUnavailableLabel
                            : `${driver.fastestLap.averageSpeed.toFixed(3)} ${driver.fastestLap.units ?? "km/h"}`}
                        </b>
                      </li>
                    )}
                </Fragment>
              );
            })}
          </ul>
        </div>
      )}
      <ul className="race-analysis-chart-legend">
        {series.map(({ driver }, index) => (
          <li key={driver.driverId}>
            <span
              className="race-analysis-chart-legend-mark"
              style={{
                borderColor: driver.color,
                borderStyle: index % 2 === 1 ? "dashed" : "solid",
              }}
            />
            {driver.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RaceAnalysis({
  year,
  round,
  drivers,
  laps,
  pitStops,
}: {
  year: string;
  round: string;
  drivers: RaceDriver[];
  laps: RaceLap[];
  pitStops: RacePitStop[];
}) {
  const text = useText();
  const [selectedDriverIds, setSelectedDriverIds] = useState(() =>
    drivers[0]?.driverId ? [drivers[0].driverId] : [],
  );
  const [driverToAdd, setDriverToAdd] = useState("");
  const selectedDrivers = drivers.filter((driver) =>
    selectedDriverIds.includes(driver.driverId),
  );
  const addableDrivers = drivers.filter(
    (driver) => !selectedDriverIds.includes(driver.driverId),
  );
  const selectedAddableDriver = addableDrivers.some(
    (driver) => driver.driverId === driverToAdd,
  )
    ? driverToAdd
    : (addableDrivers[0]?.driverId ?? "");
  const selectedDriverIdSet = new Set(selectedDriverIds);
  const selectedPitStops = pitStops.filter((stop) =>
    selectedDriverIdSet.has(stop.driverId),
  );
  const driverDetails = new Map(drivers.map((item) => [item.driverId, item]));
  const driverStats = selectedDrivers.map((driver) => {
    const lapTimes = laps.flatMap((lap) =>
      lap.Timings.flatMap((timing) => {
        if (timing.driverId !== driver.driverId) return [];
        const seconds = parseLapTime(timing.time);
        return seconds === null ? [] : [seconds];
      }),
    );
    return {
      ...driver,
      averageLap:
        lapTimes.length > 0
          ? lapTimes.reduce((total, value) => total + value, 0) /
            lapTimes.length
          : null,
      fastestLapTime: lapTimes.length > 0 ? Math.min(...lapTimes) : null,
      stops: selectedPitStops.filter(
        (stop) => stop.driverId === driver.driverId,
      ).length,
    };
  });

  return (
    <section className="race-analysis">
      <div className="race-analysis-heading">
        <div>
          <h2>{text.raceAnalysis}</h2>
          <p>{text.raceAnalysisLead}</p>
        </div>
      </div>

      <div className="race-analysis-driver-controls">
        <label htmlFor={`analysis-driver-${year}-${round}`}>
          {text.addDrivers}
        </label>
        <select
          id={`analysis-driver-${year}-${round}`}
          value={selectedAddableDriver}
          onChange={(event) => setDriverToAdd(event.target.value)}
          disabled={addableDrivers.length === 0}
        >
          {addableDrivers.map((driver) => (
            <option key={driver.driverId} value={driver.driverId}>
              {driver.name} · {driver.teamName}
            </option>
          ))}
        </select>
        <button
          className="race-analysis-add-driver"
          type="button"
          disabled={!selectedAddableDriver}
          onClick={() => {
            if (!selectedAddableDriver) return;
            setSelectedDriverIds((current) => [
              ...current,
              selectedAddableDriver,
            ]);
            setDriverToAdd("");
          }}
        >
          <Plus aria-hidden="true" size={15} />
          {text.addDriver}
        </button>
      </div>

      <ul className="race-analysis-selected-drivers">
        {selectedDrivers.map((driver) => (
          <li key={driver.driverId}>
            <span
              className="race-analysis-team-swatch"
              style={{ backgroundColor: driver.color }}
              aria-hidden="true"
            />
            <span>{driver.name}</span>
            <small>{driver.teamName}</small>
            <button
              type="button"
              aria-label={`${text.removeDriver}: ${driver.name}`}
              title={`${text.removeDriver}: ${driver.name}`}
              disabled={selectedDriverIds.length === 1}
              onClick={() =>
                setSelectedDriverIds((current) =>
                  current.filter((id) => id !== driver.driverId),
                )
              }
            >
              <X aria-hidden="true" size={14} />
            </button>
          </li>
        ))}
      </ul>

      {driverStats.length > 0 && (
        <div className="race-analysis-table-scroll race-analysis-summary-scroll">
          <table className="race-analysis-table">
            <thead>
              <tr>
                <th>{text.driver}</th>
                <th>{text.averageLap}</th>
                <th>{text.fastestLap}</th>
                <th>{text.fastestLapAverageSpeed}</th>
                <th>{text.pitStopsCount}</th>
              </tr>
            </thead>
            <tbody>
              {driverStats.map((driver) => (
                <tr key={driver.driverId}>
                  <td>
                    <span className="race-analysis-team-driver">
                      <span
                        className="race-analysis-team-swatch"
                        style={{ backgroundColor: driver.color }}
                        aria-hidden="true"
                      />
                      {driver.name}
                    </span>
                  </td>
                  <td>
                    {driver.averageLap === null
                      ? "—"
                      : formatLapTime(driver.averageLap)}
                  </td>
                  <td>
                    {driver.fastestLapTime === null
                      ? "—"
                      : formatLapTime(driver.fastestLapTime)}
                  </td>
                  <td>
                    {driver.fastestLap?.averageSpeed === undefined
                      ? text.speedUnavailable
                      : `${driver.fastestLap.averageSpeed.toFixed(3)} ${driver.fastestLap.units ?? "km/h"}`}
                  </td>
                  <td>{driver.stops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedDrivers.length > 0 && (
        <LapTimeChart
          laps={laps}
          drivers={selectedDrivers}
          label={text.lapLabel}
          fastestSpeedLabel={text.fastestLapAverageSpeed}
          speedUnavailableLabel={text.speedUnavailable}
        />
      )}

      <div className="race-analysis-pit-heading">
        <h3>{text.pitStopReview}</h3>
        <span>{selectedPitStops.length}</span>
      </div>
      {selectedPitStops.length > 0 ? (
        <>
          <div className="race-analysis-table-scroll">
            <table className="race-analysis-table">
              <thead>
                <tr>
                  <th>{text.lapLabel}</th>
                  <th>{text.driver}</th>
                  <th>{text.stopNumber}</th>
                  <th>{text.durationSeconds}</th>
                </tr>
              </thead>
              <tbody>
                {[...selectedPitStops]
                  .sort(
                    (a, b) =>
                      Number(a.lap) - Number(b.lap) ||
                      Number(a.stop) - Number(b.stop),
                  )
                  .map((stop, index) => (
                    <tr key={`${stop.driverId}-${stop.stop}-${index}`}>
                      <td>{stop.lap}</td>
                      <td>
                        <span className="race-analysis-team-driver">
                          <span
                            className="race-analysis-team-swatch"
                            style={{
                              backgroundColor:
                                driverDetails.get(stop.driverId)?.color ??
                                "var(--faint)",
                            }}
                            aria-hidden="true"
                          />
                          {driverDetails.get(stop.driverId)?.name ??
                            stop.driverId}
                        </span>
                      </td>
                      <td>{stop.stop}</td>
                      <td>{formatPitStopDuration(stop.duration)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="race-analysis-empty">{text.noPitStops}</p>
      )}
    </section>
  );
}
