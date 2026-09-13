import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { computeHumanMadeRating, PRODUCTION_METHODS } from './rating.js';
import { readSongs, writeSongs } from './store.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/production-methods', (_req, res) => {
  res.json(PRODUCTION_METHODS);
});

app.get('/api/songs', (_req, res) => {
  const songs = readSongs().sort((a, b) => b.rating.score - a.rating.score);
  res.json(songs);
});

app.post('/api/songs', (req, res) => {
  const { title, artist, priceCents, productionMethod, instrumentsPlayed, humanVocals, aiToolPercentage } = req.body ?? {};

  if (!title || !artist) {
    return res.status(400).json({ error: 'title and artist are required' });
  }
  if (productionMethod && !PRODUCTION_METHODS.includes(productionMethod)) {
    return res.status(400).json({ error: `productionMethod must be one of ${PRODUCTION_METHODS.join(', ')}` });
  }

  const songInput = {
    productionMethod: productionMethod ?? 'daw_manual',
    instrumentsPlayed: Number(instrumentsPlayed) || 0,
    humanVocals: Boolean(humanVocals),
    aiToolPercentage: Number(aiToolPercentage) || 0,
  };

  const song = {
    id: randomUUID(),
    title: String(title).trim(),
    artist: String(artist).trim(),
    priceCents: Math.max(0, Math.round(Number(priceCents) || 0)),
    ...songInput,
    rating: computeHumanMadeRating(songInput),
    sales: 0,
    createdAt: new Date().toISOString(),
  };

  const songs = readSongs();
  songs.push(song);
  writeSongs(songs);

  res.status(201).json(song);
});

app.post('/api/songs/:id/buy', (req, res) => {
  const songs = readSongs();
  const song = songs.find((s) => s.id === req.params.id);
  if (!song) {
    return res.status(404).json({ error: 'song not found' });
  }
  song.sales = (song.sales || 0) + 1;
  writeSongs(songs);
  res.json(song);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`BOSS_MUSIC API listening on http://localhost:${PORT}`);
  });
}

export default app;
