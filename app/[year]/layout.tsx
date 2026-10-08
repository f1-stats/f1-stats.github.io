import { availableSeasons } from "@/lib/f1";

export function generateStaticParams() {
  return availableSeasons().map((year) => ({ year }));
}

export default function SeasonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
