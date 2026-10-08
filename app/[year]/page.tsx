import { HomeContent } from "@/app/page";

export default async function SeasonHome({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <HomeContent year={year} />;
}
