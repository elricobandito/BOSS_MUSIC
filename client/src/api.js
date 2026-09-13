const BASE = '/api';

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export function getSongs() {
  return fetch(`${BASE}/songs`).then(handle);
}

export function getProductionMethods() {
  return fetch(`${BASE}/production-methods`).then(handle);
}

export function createSong(song) {
  return fetch(`${BASE}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(song),
  }).then(handle);
}

export function buySong(id) {
  return fetch(`${BASE}/songs/${id}/buy`, { method: 'POST' }).then(handle);
}
