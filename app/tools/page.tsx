import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Text } from "@/app/components/language";

const tools = [
  ["pointsCalculator", "/tools/points-calculator"],
  ["lapTimeCalculator", "/tools/lap-time-calculator"],
  ["pitStopCalculator", "/tools/pit-stop-calculator"],
] as const;

export default function Tools() {
  return (
    <main className="page">
      <div className="eyebrow">
        <Text id="tools" />
      </div>
      <h1>
        <Text id="f1Calculators" />
      </h1>
      <p className="lead">
        <Text id="calculatorsLead" />
      </p>
      <div className="toolgrid">
        {tools.map(([id, url]) => (
          <Link className="tool" href={url} key={url}>
            <ExternalLink className="tool-icon" aria-hidden="true" size={18} />
            <h3>
              <Text id={id} />
            </h3>
            <p>
              <Text id="interactiveTool" />
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
