import assert from "node:assert/strict";
import { test } from "node:test";
import { computeHumanMadeScore, ratingLabel } from "../src/lib/rating";

test("fully human, all-live track scores near the top", () => {
  const score = computeHumanMadeScore({
    liveInstrumentsPct: 100,
    liveVocals: true,
    handwrittenLyrics: true,
    aiAssistedProduction: false,
    aiGeneratedMelody: false,
    aiGeneratedLyrics: false,
  });
  assert.equal(score, 100);
  assert.equal(ratingLabel(score), "Handcrafted");
});

test("fully AI-generated track scores at the bottom", () => {
  const score = computeHumanMadeScore({
    liveInstrumentsPct: 0,
    liveVocals: false,
    handwrittenLyrics: false,
    aiAssistedProduction: true,
    aiGeneratedMelody: true,
    aiGeneratedLyrics: true,
  });
  assert.equal(score, 0);
  assert.equal(ratingLabel(score), "Machine-Made");
});

test("hybrid track lands in the middle band", () => {
  const score = computeHumanMadeScore({
    liveInstrumentsPct: 60,
    liveVocals: true,
    handwrittenLyrics: true,
    aiAssistedProduction: true,
    aiGeneratedMelody: false,
    aiGeneratedLyrics: false,
  });
  // 20 base + 24 live + 20 vocals + 20 lyrics - 15 ai = 69
  assert.equal(score, 69);
  assert.equal(ratingLabel(score), "Mostly Human");
});

test("score is always clamped to 0-100", () => {
  const high = computeHumanMadeScore({
    liveInstrumentsPct: 100,
    liveVocals: true,
    handwrittenLyrics: true,
    aiAssistedProduction: false,
    aiGeneratedMelody: false,
    aiGeneratedLyrics: false,
  });
  assert.ok(high <= 100);
  const low = computeHumanMadeScore({
    liveInstrumentsPct: 0,
    liveVocals: false,
    handwrittenLyrics: false,
    aiAssistedProduction: true,
    aiGeneratedMelody: true,
    aiGeneratedLyrics: true,
  });
  assert.ok(low >= 0);
});
