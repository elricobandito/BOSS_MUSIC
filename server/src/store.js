import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeHumanMadeRating } from './rating.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DATA_FILE = join(DATA_DIR, 'songs.json');

function ensureFile() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, JSON.stringify(seedSongs(), null, 2));
  }
}

export function readSongs() {
  ensureFile();
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export function writeSongs(songs) {
  ensureFile();
  writeFileSync(DATA_FILE, JSON.stringify(songs, null, 2));
}

function seedSongs() {
  const now = new Date().toISOString();
  const raw = [
    {
      id: 'seed-1',
      title: 'Analog Sunrise',
      artist: 'Marta Vega',
      priceCents: 199,
      productionMethod: 'live_instruments',
      instrumentsPlayed: 4,
      humanVocals: true,
      aiToolPercentage: 0,
      sales: 12,
      createdAt: now,
    },
    {
      id: 'seed-2',
      title: 'Neon Circuits',
      artist: 'DJ Latent',
      priceCents: 99,
      productionMethod: 'ai_assisted',
      instrumentsPlayed: 0,
      humanVocals: false,
      aiToolPercentage: 70,
      sales: 3,
      createdAt: now,
    },
  ];
  return raw.map((song) => ({ ...song, rating: computeHumanMadeRating(song) }));
}
