import { BrutalistFooter } from "@/components/brutalist-footer";
import { BrutalistHero } from "@/components/brutalist-hero";

export default function Home() {
	return (
		<div className="min-h-screen bg-black text-white overflow-x-hidden">
			<BrutalistHero />
			<BrutalistFooter />
		</div>
	);
}
