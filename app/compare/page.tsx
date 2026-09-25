import { DriverComparison } from "@/app/components/driver-comparison";
import { driverStandings } from "@/lib/f1";

export default function Compare() {
    return <main className="page compare-page"><div className="eyebrow">HEAD-TO-HEAD</div><h1>Driver Comparison</h1><p className="lead">Choose two drivers to compare their 2026 championship form.</p><DriverComparison drivers={driverStandings()} /></main>;
}