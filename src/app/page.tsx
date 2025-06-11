import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-data"
import Link from "next/link"

export default function Home() {
	const recentPosts = blogPosts.slice(0, 5)

	return (
		<div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
			{/* Hero Section */}
			<section className="mb-16 text-center">
				<h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
					Welcome to{" "}
					<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						DentonHub
					</span>
				</h1>
				<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
					Discover the latest insights in technology, development, and innovation. 
					Join our community of passionate developers and creators.
				</p>
				<div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<Button size="lg" asChild>
						<Link href="/blog">Explore Blog</Link>
					</Button>
					<Button variant="outline" size="lg" asChild>
						<Link href="/about">Learn More</Link>
					</Button>
				</div>
			</section>

			{/* Recent Posts Section */}
			<section>
				<div className="mb-8 flex items-center justify-between">
					<h2 className="text-3xl font-bold tracking-tight">Recent Posts</h2>
					<Button variant="ghost" asChild>
						<Link href="/blog">View All Posts →</Link>
					</Button>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{recentPosts.map((post, index) => (
						<BlogCard 
							key={post.id} 
							post={post}
							className={index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
						/>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
				<h3 className="mb-4 text-2xl font-bold">Stay Updated</h3>
				<p className="mb-6 text-muted-foreground">
					Get the latest posts delivered directly to your inbox. No spam, just quality content.
				</p>
				<Button size="lg" asChild>
					<Link href="/newsletter">Subscribe to Newsletter</Link>
				</Button>
			</section>
		</div>
	)
}