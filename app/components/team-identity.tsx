type Constructor = {
  constructorId?: string;
  name?: string;
};

const teamDetails: Record<string, { color: string; label: string }> = {
  alfa: { color: "#900000", label: "AR" },
  alphatauri: { color: "#2b4562", label: "AT" },
  alpine: { color: "#ff87bc", label: "AL" },
  aston_martin: { color: "#229971", label: "AM" },
  audi: { color: "#00a19b", label: "AU" },
  cadillac: { color: "#c6a462", label: "CD" },
  ferrari: { color: "#ef1a2d", label: "FE" },
  force_india: { color: "#f596c8", label: "FI" },
  haas: { color: "#b6b8bd", label: "HA" },
  manor: { color: "#ed1c24", label: "MA" },
  marussia: { color: "#ed1c24", label: "MA" },
  mclaren: { color: "#ff8000", label: "MC" },
  mercedes: { color: "#00d2be", label: "ME" },
  racing_point: { color: "#f596c8", label: "RP" },
  rb: { color: "#6692ff", label: "RB" },
  red_bull: { color: "#3671c6", label: "RB" },
  renault: { color: "#fff500", label: "RE" },
  sauber: { color: "#52e252", label: "SA" },
  toro_rosso: { color: "#469bff", label: "TR" },
  williams: { color: "#1868db", label: "WI" },
};

export function teamColor(constructorId?: string) {
  return teamDetails[constructorId ?? ""]?.color ?? "#626c77";
}

export function TeamIdentity({ team }: { team?: Constructor }) {
  const details = teamDetails[team?.constructorId ?? ""];
  const label = details?.label ?? team?.name?.slice(0, 2).toUpperCase() ?? "--";

  return (
    <span className="team-identity">
      <span
        className="team-mark"
        style={{ backgroundColor: teamColor(team?.constructorId) }}
        aria-hidden="true"
      >
        {label}
      </span>
      <span>{team?.name ?? "Unknown team"}</span>
    </span>
  );
}
