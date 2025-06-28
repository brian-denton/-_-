import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { ContactSection } from "@/components/contact-section";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Home() {
	return (
		<div className="min-h-screen">
			<Navigation />
			<main>
				<HeroSection />
				<section id="about">
					<AboutSection />
				</section>
				<section id="projects">
					<ProjectsSection />
				</section>
				<section id="experience">
					<ExperienceSection />
				</section>
				<section id="contact">
					<ContactSection />
				</section>
			</main>
			<Footer />
		</div>
	);
}