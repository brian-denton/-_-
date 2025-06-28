"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
	{ name: "About", href: "#about" },
	{ name: "Projects", href: "#projects" },
	{ name: "Experience", href: "#experience" },
	{ name: "Contact", href: "#contact" },
];

export function Navigation() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<a href="#" className="text-xl font-bold">
							AJ
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:block">
						<div className="ml-10 flex items-baseline space-x-8">
							{navItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
								>
									{item.name}
								</a>
							))}
						</div>
					</div>

					{/* Desktop Actions */}
					<div className="hidden md:flex items-center space-x-4">
						<ThemeToggle />
						<Button size="sm">
							Let's Talk
						</Button>
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center space-x-2">
						<ThemeToggle />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</Button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isOpen && (
					<div className="md:hidden">
						<div className="px-2 pt-2 pb-3 space-y-1 border-t">
							{navItems.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
									onClick={() => setIsOpen(false)}
								>
									{item.name}
								</a>
							))}
							<div className="px-3 py-2">
								<Button size="sm" className="w-full">
									Let's Talk
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}