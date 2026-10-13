# Episode Tracker

A small app for keeping YouTube episodes in a Neon database.

## Run the app

1. Add your Neon connection string to `.env.local`:

   ```text
   DATABASE_URL=your_neon_connection_string
   ```

2. If the `episodes` table does not exist yet, create it from the Drizzle
   schema:

   ```bash
   npx drizzle-kit push
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## How it works

- [`db/schema.ts`](./db/schema.ts) describes the `episodes` table: a required
  title and optional guest, YouTube URL, and publish date.
- [`db/index.ts`](./db/index.ts) connects Drizzle to Neon using `DATABASE_URL`.
  Keep that connection string in `.env.local`; do not commit it.
- [`app/page.tsx`](./app/page.tsx) reads every episode from the database and
  displays the add form and saved episodes. Episodes with a publish date appear
  newest first; undated episodes appear after them.
- [`app/actions.ts`](./app/actions.ts) checks submitted form values and uses
  Drizzle to insert a new row. The page then redirects and loads the updated
  list.
- [`lib/youtube.ts`](./lib/youtube.ts) accepts secure links from YouTube
  domains, so saved links can be shown safely.
- [`app/globals.css`](./app/globals.css) styles the page and adapts the layout
  for smaller screens.
