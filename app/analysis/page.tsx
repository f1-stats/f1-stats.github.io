import { AnalysisRaceSelector } from "@/app/components/analysis-race-selector";
import { Text } from "@/app/components/language";
import { analysisSchedule } from "@/lib/f1";

export default function AnalysisPage() {
  const seasons = analysisSchedule();

  return (
    <main className="page analysis-page">
      <div className="eyebrow"><Text id="raceAnalysis" /></div>
      <h1><Text id="raceAnalysis" /></h1>
      <p className="lead"><Text id="raceAnalysisLead" /></p>
      <AnalysisRaceSelector seasons={seasons} />
    </main>
  );
}