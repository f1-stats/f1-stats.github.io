import { HomeContent } from "@/app/components/home-content";

export default async function SeasonHome({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return <HomeContent year={year} />;
}
