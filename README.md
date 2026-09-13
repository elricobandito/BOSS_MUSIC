# BOSS_MUSIC

A web marketplace where artists sell their own music, and **every song gets a rating for how human-made it is**.

Listeners see a transparent 0–100 "human-made" score on every track, computed from
how the song was created (live instruments, live vocals, handwritten lyrics vs.
AI-assisted or AI-generated elements).

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- Tailwind CSS for styling
- A lightweight JSON-file data store (`data/songs.json`, seeded on first run) —
  no external database required

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

The catalog is seeded with a few sample songs on first launch. Data is persisted
to `data/songs.json` (gitignored).

## Scripts

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Start the dev server on port 3000                |
| `npm run build` | Production build                                 |
| `npm start`     | Run the production build                         |
| `npm run lint`  | Lint with ESLint / `next lint`                   |
| `npm test`      | Run unit tests for the rating logic (node:test)  |

## How the human-made rating works

The score is a transparent, deterministic heuristic (see `src/lib/rating.ts`):

- Baseline of **20** for a human choosing to create and release the work
- Up to **+40** for live-instrument performance (scaled by percentage)
- **+20** for live vocals, **+20** for handwritten lyrics
- **−15** AI-assisted production, **−25** AI-generated melody, **−20** AI-generated lyrics

The result is clamped to 0–100 and mapped to a label: Handcrafted, Mostly Human,
Hybrid, AI-Assisted, or Machine-Made.

## API

| Method | Route                        | Description                       |
| ------ | ---------------------------- | --------------------------------- |
| `GET`  | `/api/songs`                 | List songs (sorted by score)      |
| `POST` | `/api/songs`                 | Publish a song (computes rating)  |
| `GET`  | `/api/songs/:id`             | Get a single song                 |
| `POST` | `/api/songs/:id/purchase`    | "Buy" a song (increments sales)   |
