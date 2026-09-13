import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeHumanMadeRating, labelForScore } from './rating.js';

test('a fully live, human-sung track is Certified Human', () => {
  const rating = computeHumanMadeRating({
    productionMethod: 'live_instruments',
    instrumentsPlayed: 4,
    humanVocals: true,
    aiToolPercentage: 0,
  });
  assert.equal(rating.score, 96);
  assert.equal(rating.label, 'Certified Human');
});

test('a fully AI-generated track scores 0 / AI Generated', () => {
  const rating = computeHumanMadeRating({
    productionMethod: 'ai_generated',
    instrumentsPlayed: 0,
    humanVocals: false,
    aiToolPercentage: 100,
  });
  assert.equal(rating.score, 0);
  assert.equal(rating.label, 'AI Generated');
});

test('AI tooling percentage reduces the score', () => {
  const low = computeHumanMadeRating({ productionMethod: 'daw_manual', aiToolPercentage: 0 });
  const high = computeHumanMadeRating({ productionMethod: 'daw_manual', aiToolPercentage: 100 });
  assert.ok(high.score < low.score);
});

test('instruments are capped at 5 for the bonus', () => {
  const five = computeHumanMadeRating({ productionMethod: 'daw_manual', instrumentsPlayed: 5 });
  const ten = computeHumanMadeRating({ productionMethod: 'daw_manual', instrumentsPlayed: 10 });
  assert.equal(five.score, ten.score);
});

test('labelForScore boundaries', () => {
  assert.equal(labelForScore(85), 'Certified Human');
  assert.equal(labelForScore(60), 'Mostly Human');
  assert.equal(labelForScore(35), 'Hybrid');
  assert.equal(labelForScore(10), 'Mostly AI');
  assert.equal(labelForScore(0), 'AI Generated');
});
