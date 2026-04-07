import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { StatsSection } from "@/components/stats-section";
import { CTASection } from "@/components/cta-section";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col">
			<Navigation />
			<main className="flex-1">
				<HeroSection />
				<FeaturesSection />
				<StatsSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
