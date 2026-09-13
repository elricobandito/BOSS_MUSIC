# BOSS_MUSIC

A web marketplace where artists sell their own music, and every song gets a rating for how human‑made it is.

## Stack

- **server/** — Node.js + Express JSON API (no native deps; songs persist to `server/data/songs.json`).
- **client/** — React + Vite single‑page app (modern marketplace UI).
- npm workspaces tie the two together at the repo root.

## The human‑made rating

Every listed track is scored `0–100` by a transparent heuristic in `server/src/rating.js`:

- Production method (live instruments → fully AI generated) sets the base score.
- Physically played instruments (capped at 5) add a bonus.
- Human vocals add a bonus.
- Declared AI‑tooling percentage subtracts from the score.

Scores map to labels: **Certified Human**, **Mostly Human**, **Hybrid**, **Mostly AI**, **AI Generated**.

## Getting started

```bash
npm install        # install all workspace deps
npm run dev        # run API (:3001) and client (:5173) together
```

Then open http://localhost:5173.

Run them separately if you prefer:

```bash
npm run dev:server   # Express API on :3001
npm run dev:client   # Vite dev server on :5173 (proxies /api → :3001)
```

## Other commands

```bash
npm test           # run the rating-logic unit tests
npm run lint       # eslint across server + client
npm run build      # production build of the client
```

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Liveness check |
| GET | `/api/songs` | List songs (sorted by human‑made score) |
| POST | `/api/songs` | List a new track for sale (server computes its rating) |
| POST | `/api/songs/:id/buy` | Buy a track (increments its sale count) |
| GET | `/api/production-methods` | Allowed production methods |

## Cloud Agent environment

`.cursor/environment.json` installs dependencies with `npm install` and launches the API and web
dev servers as persistent terminals, exposing ports `3001` and `5173`.
