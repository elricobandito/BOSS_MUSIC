import { promises as fs } from "fs";
import path from "path";
import { computeHumanMadeScore, ratingLabel } from "./rating";
import type { NewSongInput, Song } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "songs.json");

function makeSong(input: NewSongInput): Song {
  const score = computeHumanMadeScore(input.rating);
  return {
    id: cryptoRandomId(),
    ...input,
    humanMadeScore: score,
    humanMadeLabel: ratingLabel(score),
    createdAt: new Date().toISOString(),
    sales: 0,
  };
}

function cryptoRandomId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase();
}

const SEED: NewSongInput[] = [
  {
    title: "Midnight in the Machine Shop",
    artist: "Vela Cruz",
    description:
      "A gritty blues-rock number recorded live in a single take with a full band.",
    priceCents: 129,
    rating: {
      liveInstrumentsPct: 100,
      liveVocals: true,
      handwrittenLyrics: true,
      aiAssistedProduction: false,
      aiGeneratedMelody: false,
      aiGeneratedLyrics: false,
    },
  },
  {
    title: "Neon Rain",
    artist: "PixelHeart",
    description:
      "Synthwave with hand-played leads, AI-assisted mastering for that polished sheen.",
    priceCents: 99,
    rating: {
      liveInstrumentsPct: 60,
      liveVocals: true,
      handwrittenLyrics: true,
      aiAssistedProduction: true,
      aiGeneratedMelody: false,
      aiGeneratedLyrics: false,
    },
  },
  {
    title: "Prompt & Circumstance",
    artist: "GenBot 9000",
    description:
      "Fully generated melody and lyrics — a curiosity from the frontier of AI music.",
    priceCents: 49,
    rating: {
      liveInstrumentsPct: 0,
      liveVocals: false,
      handwrittenLyrics: false,
      aiAssistedProduction: true,
      aiGeneratedMelody: true,
      aiGeneratedLyrics: true,
    },
  },
];

async function ensureData(): Promise<Song[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Song[];
  } catch {
    const seeded = SEED.map(makeSong);
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(seeded, null, 2), "utf-8");
    return seeded;
  }
}

async function writeAll(songs: Song[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(songs, null, 2), "utf-8");
}

export async function listSongs(): Promise<Song[]> {
  const songs = await ensureData();
  return [...songs].sort((a, b) => b.humanMadeScore - a.humanMadeScore);
}

export async function getSong(id: string): Promise<Song | undefined> {
  const songs = await ensureData();
  return songs.find((s) => s.id === id);
}

export async function createSong(input: NewSongInput): Promise<Song> {
  const songs = await ensureData();
  const song = makeSong(input);
  songs.push(song);
  await writeAll(songs);
  return song;
}

export async function purchaseSong(id: string): Promise<Song | undefined> {
  const songs = await ensureData();
  const song = songs.find((s) => s.id === id);
  if (!song) return undefined;
  song.sales += 1;
  await writeAll(songs);
  return song;
}
