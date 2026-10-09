import { currentSeason } from "@/lib/f1";
import { HomeContent } from "@/app/components/home-content";

export default function Home() {
  return <HomeContent year={currentSeason()} />;
}
