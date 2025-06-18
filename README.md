# DentonHub.com

A Next.js application with comprehensive logging and monitoring.

## Features

- Next.js 15 with TypeScript
- Tailwind CSS for styling
- Drizzle ORM for database operations
- Winston logging with Supabase integration
- Biome for linting and formatting

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint:check

# Fix linting issues
npm run lint:fix
```

## Logging

This application includes a comprehensive logging system that supports:

- Multiple log levels (debug, info, warn, error)
- Structured logging with metadata
- File-based logging with rotation
- Supabase integration for log storage
- HTTP request logging
- Error tracking

## Database

Uses Drizzle ORM with PostgreSQL:

```bash
# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push

# Run migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Security

This project sends common HTTP security headers by default. See `next.config.mjs` for the exact list of headers applied to every response.
