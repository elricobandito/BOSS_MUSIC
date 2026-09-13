import type { NewSongInput, RatingInput } from "./types";

export class ValidationError extends Error {}

function asBool(value: unknown): boolean {
  return value === true || value === "true" || value === "on";
}

function asNumber(value: unknown, field: string): number {
  const n = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(n)) throw new ValidationError(`"${field}" must be a number`);
  return n;
}

function asString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`"${field}" is required`);
  }
  return value.trim();
}

/** Parses and validates an untrusted payload into a NewSongInput. */
export function parseNewSong(body: Record<string, unknown>): NewSongInput {
  const title = asString(body.title, "title");
  const artist = asString(body.artist, "artist");
  const description = asString(body.description, "description");

  const priceCents = Math.round(asNumber(body.priceCents, "priceCents"));
  if (priceCents < 0) throw new ValidationError('"priceCents" must be >= 0');

  const liveInstrumentsPct = asNumber(
    body.liveInstrumentsPct ?? 0,
    "liveInstrumentsPct",
  );
  if (liveInstrumentsPct < 0 || liveInstrumentsPct > 100) {
    throw new ValidationError('"liveInstrumentsPct" must be between 0 and 100');
  }

  const rating: RatingInput = {
    liveInstrumentsPct,
    liveVocals: asBool(body.liveVocals),
    handwrittenLyrics: asBool(body.handwrittenLyrics),
    aiAssistedProduction: asBool(body.aiAssistedProduction),
    aiGeneratedMelody: asBool(body.aiGeneratedMelody),
    aiGeneratedLyrics: asBool(body.aiGeneratedLyrics),
  };

  return { title, artist, description, priceCents, rating };
}
