# Next.js Starter Kit

A modern, full-featured Next.js starter kit with authentication, database integration, and beautiful UI components.

## Features

- **Next.js 16** with App Router and React 19
- **Authentication** powered by [Better Auth](https://better-auth.com)
  - Email/Password sign-in and sign-up
  - OAuth providers (Google, GitHub)
  - Two-Factor Authentication (2FA) with TOTP
  - Password reset and email verification
- **Database** with Prisma ORM and PostgreSQL
- **UI Components** using shadcn/ui and Radix UI
- **Styling** with Tailwind CSS 4
- **Form Handling** with TanStack Form
- **Data Fetching** with TanStack Query
- **Theme Support** with next-themes (light/dark mode)
- **Type-safe Environment Variables** with @t3-oss/env

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd nextjs-starter-kit
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp example.env .env
```

4. Configure your `.env` file with your database and auth settings.

5. Set up the database:

```bash
bunx prisma generate
bunx prisma db push
```

6. Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Secret key for auth encryption |
| `BETTER_AUTH_URL` | Base URL of your app |
| `AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `AUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `NEXT_PUBLIC_APP_NAME` | Application name |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `STORAGE_PROVIDER` | Storage provider (`local` or `vercel-blob`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage read write token |

See [`example.env`](./example.env) for all available options.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Authenticated routes
│   │   ├── dashboard/      # Dashboard page
│   │   └── settings/       # User settings
│   ├── auth/               # Authentication pages
│   │   ├── sign-in/        # Sign in page
│   │   ├── sign-up/        # Sign up page
│   │   ├── 2fa/            # Two-factor authentication
│   │   ├── forgot-password/ # Password recovery
│   │   └── reset-password/ # Password reset
│   └── api/                # API routes
├── components/             # React components
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and configs
│   ├── auth.ts             # Better Auth configuration
│   ├── auth-client.ts      # Auth client for client components
│   ├── prisma.ts           # Prisma client
│   └── env.ts              # Environment validation
├── prisma/                 # Database schema and migrations
└── public/                 # Static assets
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16, React 19 |
| Auth | Better Auth |
| Database | PostgreSQL, Prisma 7 |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui, Radix UI |
| Forms | TanStack Form |
| Data Fetching | TanStack Query, Axios |
| Validation | Zod |
