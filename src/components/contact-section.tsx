"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

export function ContactSection() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: ""
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission here
		console.log("Form submitted:", formData);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	return (
		<section className="py-20">
			<div className="container mx-auto px-4">
				<div className="max-w-6xl mx-auto">
					{/* Section Header */}
					<div className="text-center mb-16">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Have a project in mind? I'd love to hear about it. Let's discuss how we can 
							bring your ideas to life.
						</p>
					</div>

					<div className="grid lg:grid-cols-2 gap-12">
						{/* Contact Form */}
						<Card className="h-fit">
							<CardHeader>
								<CardTitle>Send me a message</CardTitle>
								<CardDescription>
									Fill out the form below and I'll get back to you as soon as possible.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="space-y-2">
										<label htmlFor="name" className="text-sm font-medium">
											Name
										</label>
										<Input
											id="name"
											name="name"
											value={formData.name}
											onChange={handleChange}
											placeholder="Your name"
											required
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium">
											Email
										</label>
										<Input
											id="email"
											name="email"
											type="email"
											value={formData.email}
											onChange={handleChange}
											placeholder="your.email@example.com"
											required
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="message" className="text-sm font-medium">
											Message
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleChange}
											placeholder="Tell me about your project..."
											rows={5}
											className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
											required
										/>
									</div>

									<Button type="submit" className="w-full group">
										<Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
										Send Message
									</Button>
								</form>
							</CardContent>
						</Card>

						{/* Contact Information */}
						<div className="space-y-8">
							{/* Contact Details */}
							<Card>
								<CardHeader>
									<CardTitle>Get in touch</CardTitle>
									<CardDescription>
										Prefer to reach out directly? Here are my contact details.
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<Mail className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">Email</p>
											<p className="text-sm text-muted-foreground">alex.johnson@example.com</p>
										</div>
									</div>

									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<Phone className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">Phone</p>
											<p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
										</div>
									</div>

									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
											<MapPin className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">Location</p>
											<p className="text-sm text-muted-foreground">San Francisco, CA</p>
										</div>
									</div>

									<Separator />

									{/* Social Links */}
									<div className="space-y-4">
										<h4 className="font-medium">Connect with me</h4>
										<div className="flex gap-4">
											<Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
												<Github className="h-4 w-4" />
												<span className="sr-only">GitHub</span>
											</Button>
											<Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
												<Linkedin className="h-4 w-4" />
												<span className="sr-only">LinkedIn</span>
											</Button>
											<Button variant="outline" size="icon" className="hover:scale-110 transition-transform">
												<Mail className="h-4 w-4" />
												<span className="sr-only">Email</span>
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Availability */}
							<Card>
								<CardHeader>
									<CardTitle>Availability</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm">Response time</span>
											<span className="text-sm font-medium">Within 24 hours</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Current status</span>
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
												<span className="text-sm font-medium text-green-600">Available</span>
											</div>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Timezone</span>
											<span className="text-sm font-medium">PST (UTC-8)</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}