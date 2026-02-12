import BakerySite from "@/components/bakery-site";
import { bakeryContent } from "@/lib/content";

export const revalidate = 3600;

export default function Home() {
  return <BakerySite content={bakeryContent} />;
}
