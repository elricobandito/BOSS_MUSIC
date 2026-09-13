import type { RatingInput } from "./types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Computes a 0-100 "how human-made" score for a song.
 *
 * The score rewards human performance and authorship (live instruments,
 * live vocals, handwritten lyrics) and penalizes AI involvement. It is a
 * transparent, deterministic heuristic so artists understand their rating.
 */
export function computeHumanMadeScore(input: RatingInput): number {
  // Baseline credit for a human choosing to create and release a work.
  let score = 20;

  // Up to +40 for a fully live-instrument performance.
  score += clamp(input.liveInstrumentsPct, 0, 100) * 0.4;

  if (input.liveVocals) score += 20;
  if (input.handwrittenLyrics) score += 20;

  if (input.aiAssistedProduction) score -= 15;
  if (input.aiGeneratedMelody) score -= 25;
  if (input.aiGeneratedLyrics) score -= 20;

  return Math.round(clamp(score, 0, 100));
}

/** Human-readable band for a given score. */
export function ratingLabel(score: number): string {
  if (score >= 85) return "Handcrafted";
  if (score >= 65) return "Mostly Human";
  if (score >= 40) return "Hybrid";
  if (score >= 20) return "AI-Assisted";
  return "Machine-Made";
}
