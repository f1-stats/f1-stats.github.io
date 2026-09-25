import Link from "next/link";
import { Text } from "@/app/components/language";
import { TeamIdentity } from "@/app/components/team-identity";
import { driverStandings, displayName } from "@/lib/f1";
export default function DriversPage() {
    const rows = driverStandings();
    return <main className="page"><h1><Text id="f1Drivers" /></h1><p className="lead"><Text id="driversLead" /></p>
        <div className="table"><div className="thead"><span><Text id="position" /></span><span><Text id="driver" /></span><span><Text id="team" /></span><span><Text id="points" /></span></div>
            {rows.map((r: any) => <Link className="tr" key={r.Driver.driverId} href={`/drivers/${r.Driver.driverId}`}><span>{r.position}</span><span className="strong">{displayName(r.Driver)}</span><span><TeamIdentity team={r.Constructors?.[0]} /></span><span className="strong">{r.points}</span></Link>)}
            {rows.length === 0 && <div className="empty"><Text id="dataUnavailable" /></div>}</div></main>;
}