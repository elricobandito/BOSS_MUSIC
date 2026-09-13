/**
 * Computes a "how human-made" rating for a song based on how it was produced.
 *
 * The score is a 0-100 integer where 100 means fully human-made and 0 means
 * fully machine-generated. It is intentionally a transparent heuristic so
 * artists understand exactly what drives their rating.
 */

const PRODUCTION_METHOD_WEIGHTS = {
  live_instruments: 60,
  daw_manual: 45,
  ai_assisted: 20,
  ai_generated: 0,
};

export const PRODUCTION_METHODS = Object.keys(PRODUCTION_METHOD_WEIGHTS);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * @param {object} song
 * @param {string} song.productionMethod - one of PRODUCTION_METHODS
 * @param {number} [song.instrumentsPlayed] - count of instruments physically played
 * @param {boolean} [song.humanVocals] - whether the lead vocals are sung by a person
 * @param {number} [song.aiToolPercentage] - 0-100, share of the track created by AI tools
 * @returns {{ score: number, label: string, factors: string[] }}
 */
export function computeHumanMadeRating(song = {}) {
  const {
    productionMethod = 'daw_manual',
    instrumentsPlayed = 0,
    humanVocals = false,
    aiToolPercentage = 0,
  } = song;

  const factors = [];

  const base = PRODUCTION_METHOD_WEIGHTS[productionMethod] ?? PRODUCTION_METHOD_WEIGHTS.daw_manual;
  factors.push(`production method "${productionMethod}" (+${base})`);

  const instrumentsBonus = clamp(Number(instrumentsPlayed) || 0, 0, 5) * 4;
  if (instrumentsBonus > 0) {
    factors.push(`${clamp(Number(instrumentsPlayed) || 0, 0, 5)} live instrument(s) (+${instrumentsBonus})`);
  }

  const vocalsBonus = humanVocals ? 20 : 0;
  if (vocalsBonus > 0) {
    factors.push(`human vocals (+${vocalsBonus})`);
  }

  const aiPenalty = Math.round((clamp(Number(aiToolPercentage) || 0, 0, 100) / 100) * 40);
  if (aiPenalty > 0) {
    factors.push(`AI tooling used (-${aiPenalty})`);
  }

  const score = clamp(Math.round(base + instrumentsBonus + vocalsBonus - aiPenalty), 0, 100);

  return { score, label: labelForScore(score), factors };
}

export function labelForScore(score) {
  if (score >= 85) return 'Certified Human';
  if (score >= 60) return 'Mostly Human';
  if (score >= 35) return 'Hybrid';
  if (score >= 10) return 'Mostly AI';
  return 'AI Generated';
}
