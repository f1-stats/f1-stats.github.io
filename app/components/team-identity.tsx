type Constructor = {
  constructorId?: string;
  name?: string;
};

const teamDetails: Record<string, { color: string; label: string }> = {
  alpine: { color: "#ff87bc", label: "AL" },
  aston_martin: { color: "#229971", label: "AM" },
  audi: { color: "#00a19b", label: "AU" },
  cadillac: { color: "#c6a462", label: "CD" },
  ferrari: { color: "#ef1a2d", label: "FE" },
  haas: { color: "#b6b8bd", label: "HA" },
  mclaren: { color: "#ff8000", label: "MC" },
  mercedes: { color: "#00d2be", label: "ME" },
  rb: { color: "#6692ff", label: "RB" },
  red_bull: { color: "#3671c6", label: "RB" },
  williams: { color: "#1868db", label: "WI" },
};

export function TeamIdentity({ team }: { team?: Constructor }) {
  const details = teamDetails[team?.constructorId ?? ""];
  const label = details?.label ?? team?.name?.slice(0, 2).toUpperCase() ?? "--";

  return (
    <span className="team-identity">
      <span
        className="team-mark"
        style={{ backgroundColor: details?.color ?? "#626c77" }}
        aria-hidden="true"
      >
        {label}
      </span>
      <span>{team?.name ?? "Unknown team"}</span>
    </span>
  );
}
