# adhanef

A Next.js 15 project with TypeScript, Prisma ORM, and modern web technologies.

## Overview

**adhanef** is a web application built with:
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Prisma ORM** - Database client and migrations
- **React 19** - UI library
- **Tailwind CSS** (implied by Next.js defaults)

## Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or pnpm
- PostgreSQL database (or your preferred database)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and other configuration.

4. Run database migrations:
   ```bash
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (`next dev`) |
| `build` | Build the application (`prisma generate && node scripts/maybe-migrate.mjs && next build`) |
| `start` | Start production server (`next start`) |
| `lint` | Run linting (`next lint`) |
| `db:migrate` | Deploy Prisma migrations |
| `db:push` | Push schema changes to database |
| `db:seed` | Run database seeder |
| `db:studio` | Open Prisma Studio |

### Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `lib/` - Utility functions and helpers
- `prisma/` - Database schema and migrations
- `scripts/` - Helper scripts (e.g., `maybe-migrate.mjs`)
- `public/` - Static assets

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM](https://www.prisma.io/docs)
- [TypeScript](https://typescriptlang.org)