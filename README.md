# HomeStock

A responsive household inventory app built with Next.js App Router, TypeScript,
Tailwind CSS, Prisma, and Neon Postgres.

## Features

- Dashboard with stock totals and low-stock summary
- Add, edit, and delete household items
- Upload optional product images or use image URLs
- Add and manage custom categories
- Search and filter inventory
- Public read-only inventory with Google-authenticated administrator editing
- Responsive mobile and desktop layout
- Installable PWA with standalone display and offline fallback

## Requirements

- Node.js 20 or newer
- npm
- A Neon Postgres project
- A public Vercel Blob store
- A Google Cloud OAuth client

## Neon Setup

Create a database at [Neon](https://neon.tech), then copy both connection strings
from the Neon dashboard:

- **Pooled connection string:** hostname normally contains `-pooler`. Use this
  for `DATABASE_URL` because the deployed app opens connections at runtime.
- **Direct connection string:** hostname does not contain `-pooler`. Use this
  for `DIRECT_URL` because Prisma migrations require a direct connection.

Both URLs should include `sslmode=require`.

Create `.env` from the example:

```powershell
Copy-Item .env.example .env
```

Set the real credentials:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@ep-example-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-example.region.aws.neon.tech/neondb?sslmode=require"
```

Never commit `.env` or expose either connection string to browser-side code.

## Vercel Blob Setup

Product image uploads are stored in Vercel Blob. Neon stores only the returned
image URL, which keeps inventory queries and the database small.

In the Vercel project dashboard:

1. Open **Storage** and create a **Blob** store.
2. Choose **Public** access so product images can render directly from their URL.
3. Connect the store to the project and selected environments.
4. Vercel automatically creates `BLOB_READ_WRITE_TOKEN`.

For local image uploads, pull Vercel environment variables:

```bash
vercel link
vercel env pull .env
```

Alternatively, add the token manually:

```dotenv
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

The token is server-only and must never use a `NEXT_PUBLIC_` prefix. External
image URLs remain supported. Replacing, removing, or deleting a product also
deletes its managed Vercel Blob image.

Any older Base64 images already stored in the database continue to display.
Replace or remove them through the edit form to remove that data from Neon.

## Authentication Setup

Visitors can view, search, and filter inventory without signing in. Only Google
accounts listed in `ADMIN_EMAILS` can add, edit, or delete items and categories.
All write operations verify administrator access on the server.

Create a Google OAuth client:

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project.
3. Configure the **OAuth consent screen**.
4. Go to **APIs & Services → Credentials**.
5. Create an **OAuth client ID** with application type **Web application**.
6. Add these authorized redirect URIs:

```text
http://localhost:3000/api/auth/callback/google
https://YOUR_VERCEL_DOMAIN.vercel.app/api/auth/callback/google
```

Generate an Auth.js secret:

```bash
npx auth secret
```

Configure these environment variables:

```dotenv
AUTH_SECRET="generated-secret"
AUTH_GOOGLE_ID="google-oauth-client-id"
AUTH_GOOGLE_SECRET="google-oauth-client-secret"
ADMIN_EMAILS="you@example.com,another-admin@example.com"
```

Email matching is case-insensitive. Signed-in Google users not listed in
`ADMIN_EMAILS` remain read-only visitors.

## Local Setup

Install dependencies and generate Prisma Client:

```bash
npm install
```

For local development, use SQLite in `.env`:

```dotenv
DATABASE_URL="file:./dev.db"
```

Create or update the local SQLite database:

```bash
npm run db:push:local
```

Start the local development server:

```bash
npm run dev
```

Generate the local Prisma Client after installing dependencies or changing
`prisma/schema.local.prisma`:

```bash
npm run db:generate:local
```

The local client uses `prisma/schema.local.prisma`. Production builds generate
the client from the Postgres schema at `prisma/schema.prisma`. The development
command does not regenerate Prisma Client on every start because Windows locks
the running Prisma query-engine DLL.

To develop directly against Neon instead, generate the production client and
start Next.js separately after setting the Neon environment variables:

```bash
npm run db:generate
npx next dev
```

Apply committed migrations to Neon when setting up a Neon environment:

```bash
npm run db:deploy
```

Optionally add the common household supply seed data:

```bash
npm run db:seed
```

`db:deploy` and `db:seed` generate the standard production Postgres Prisma
Client before connecting to Neon. Local SQLite uses a separate generated client,
so production follows Prisma's standard Vercel deployment layout while the two
environments remain isolated. To seed the local SQLite database instead, use:

```bash
npm run db:seed:local
```

If Neon migrations have already succeeded but seeding previously failed with
`the URL must start with the protocol file:`, keep the Neon URLs exported in
your terminal and rerun `npm run db:seed`. The corrected script now uses the
dedicated Postgres client.

Open `http://localhost:3000`.

Existing SQLite records are not automatically copied to Neon.

## Install On A Phone

The deployed HTTPS site is an installable Progressive Web App:

- **iPhone/iPad Safari:** open the site, tap Share, then **Add to Home Screen**.
- **Android Chrome:** open the site, open the browser menu, then tap
  **Install app** or **Add to Home screen**.

The installed app opens in standalone mode. When offline, HomeStock shows an
offline screen rather than stale inventory data; reconnect to view or update
stock.

## Prisma Workflow

After changing `prisma/schema.prisma`, create and apply a migration against a
development Neon branch:

```bash
npm run db:migrate -- --name describe_your_change
```

Commit the generated `prisma/migrations` files. Apply committed migrations to
staging or production with:

```bash
npm run db:deploy
```

Useful commands:

```bash
npm run db:generate   # Generate Prisma Client
npm run db:generate:local # Generate the SQLite development client
npm run db:push:local # Apply the local SQLite schema
npm run db:migrate    # Create a development migration
npm run db:deploy     # Apply committed migrations
npm run db:seed       # Add seed data without duplicating existing items
npm run db:seed:local # Add seed data to the local SQLite database
npm run db:studio     # Open Prisma Studio
npm run typecheck     # Run TypeScript checks
npm run build         # Generate Prisma Client and create production build
```

Do not use `prisma migrate dev` against the production database.

## Deploy To Vercel

1. Push the project to a Git repository.
2. Import the repository into Vercel.
3. Connect the Neon integration or manually add these Vercel environment
   variables:

```text
DATABASE_URL = Neon pooled connection string
DIRECT_URL   = Neon direct connection string
BLOB_READ_WRITE_TOKEN = Token created by the connected public Blob store
AUTH_SECRET = Auth.js random secret
AUTH_GOOGLE_ID = Google OAuth client ID
AUTH_GOOGLE_SECRET = Google OAuth client secret
ADMIN_EMAILS = Comma-separated administrator Google account emails
```

Add them for **Production**, and for **Preview** if preview deployments should
use a database. Prefer a separate Neon branch for preview deployments.

4. Before the first production deployment, apply migrations from a trusted
   local machine or CI job:

```bash
npm run db:deploy
```

5. Deploy the project. Vercel runs `npm run build`, which generates Prisma
   Client before building Next.js.

Database migrations are intentionally not run automatically inside the Vercel
build. This avoids multiple concurrent preview builds attempting to modify the
same production database.

For later releases:

1. Create and commit migrations on a development Neon branch.
2. Run `npm run db:deploy` against the target database.
3. Deploy the matching application version to Vercel.

## Build Output

Development output is stored in `.next-dev`, while production and Vercel builds
use Next.js's standard `.next` directory. This keeps `npm run build` from
corrupting a running development server while remaining compatible with Vercel.
