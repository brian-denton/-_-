"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, Heart } from "lucide-react";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-muted/30 border-t">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-6xl mx-auto">
					{/* Main Footer Content */}
					<div className="grid md:grid-cols-3 gap-8 mb-8">
						{/* Brand & Description */}
						<div className="space-y-4">
							<h3 className="text-xl font-bold">Alex Johnson</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								Full-stack developer passionate about creating exceptional digital experiences 
								through clean code and thoughtful design.
							</p>
							<div className="flex space-x-4">
								<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
									<Github className="h-4 w-4" />
									<span className="sr-only">GitHub</span>
								</Button>
								<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
									<Linkedin className="h-4 w-4" />
									<span className="sr-only">LinkedIn</span>
								</Button>
								<Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
									<Mail className="h-4 w-4" />
									<span className="sr-only">Email</span>
								</Button>
							</div>
						</div>

						{/* Quick Links */}
						<div className="space-y-4">
							<h4 className="font-semibold">Quick Links</h4>
							<nav className="flex flex-col space-y-2">
								<a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									About
								</a>
								<a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Projects
								</a>
								<a href="#experience" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Experience
								</a>
								<a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
									Contact
								</a>
							</nav>
						</div>

						{/* Contact Info */}
						<div className="space-y-4">
							<h4 className="font-semibold">Get in Touch</h4>
							<div className="space-y-2 text-sm text-muted-foreground">
								<p>alex.johnson@example.com</p>
								<p>+1 (555) 123-4567</p>
								<p>San Francisco, CA</p>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
								<span className="text-green-600 font-medium">Available for new opportunities</span>
							</div>
						</div>
					</div>

					<Separator className="mb-8" />

					{/* Bottom Footer */}
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">
							<span>© {currentYear} Alex Johnson. Made with</span>
							<Heart className="h-4 w-4 text-red-500 fill-current" />
							<span>and lots of coffee.</span>
						</div>
						<div className="flex items-center gap-6">
							<a href="#" className="hover:text-foreground transition-colors">
								Privacy Policy
							</a>
							<a href="#" className="hover:text-foreground transition-colors">
								Terms of Service
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}