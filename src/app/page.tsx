import { BrutalistHero } from "@/components/brutalist-hero";
import { BrutalistContent } from "@/components/brutalist-content";
import { BrutalistFooter } from "@/components/brutalist-footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-black text-white overflow-x-hidden">
			<BrutalistHero />
			<BrutalistContent />
			<BrutalistFooter />
		</div>
	);
}