export interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  author: {
    name: string
    avatar: string
  }
  publishedAt: string
  slug: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with Next.js 15",
    excerpt: "Explore the latest features in Next.js 15 and learn how to build performant, scalable web applications with the newest React Server Components and improved developer experience.",
    image: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    publishedAt: "2025-01-15",
    slug: "building-modern-web-applications-nextjs-15"
  },
  {
    id: "2",
    title: "The Future of TypeScript: What's Coming in 2025",
    excerpt: "Discover the upcoming TypeScript features that will revolutionize how we write type-safe JavaScript. From improved inference to new syntax features.",
    image: "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: {
      name: "Alex Rodriguez",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    publishedAt: "2025-01-12",
    slug: "future-of-typescript-2025"
  },
  {
    id: "3",
    title: "Mastering CSS Grid and Flexbox for Modern Layouts",
    excerpt: "Learn advanced CSS layout techniques with practical examples. Master the art of creating responsive, flexible layouts that work across all devices.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: {
      name: "Emma Thompson",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    publishedAt: "2025-01-10",
    slug: "mastering-css-grid-flexbox-modern-layouts"
  },
  {
    id: "4",
    title: "AI-Powered Development Tools: Boosting Productivity",
    excerpt: "Explore how AI tools like GitHub Copilot, ChatGPT, and other AI assistants are transforming the development workflow and increasing productivity.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: {
      name: "Michael Park",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    publishedAt: "2025-01-08",
    slug: "ai-powered-development-tools-productivity"
  },
  {
    id: "5",
    title: "Building Accessible Web Applications: A Complete Guide",
    excerpt: "Learn how to create inclusive web experiences that work for everyone. Comprehensive guide covering WCAG guidelines, ARIA attributes, and testing strategies.",
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
    author: {
      name: "Jessica Williams",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
    },
    publishedAt: "2025-01-05",
    slug: "building-accessible-web-applications-guide"
  }
]