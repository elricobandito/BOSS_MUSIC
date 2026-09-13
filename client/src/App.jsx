import { useEffect, useState } from 'react';
import { getSongs, getProductionMethods, createSong, buySong } from './api.js';

const METHOD_LABELS = {
  live_instruments: 'Live instruments',
  daw_manual: 'DAW (hand-produced)',
  ai_assisted: 'AI assisted',
  ai_generated: 'Fully AI generated',
};

function ratingClass(score) {
  if (score >= 85) return 'rating rating--top';
  if (score >= 60) return 'rating rating--good';
  if (score >= 35) return 'rating rating--mid';
  return 'rating rating--low';
}

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

const EMPTY_FORM = {
  title: '',
  artist: '',
  price: '1.99',
  productionMethod: 'live_instruments',
  instrumentsPlayed: '2',
  humanVocals: true,
  aiToolPercentage: '0',
};

export default function App() {
  const [songs, setSongs] = useState([]);
  const [methods, setMethods] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const data = await getSongs();
    setSongs(data);
  }

  useEffect(() => {
    Promise.all([getSongs(), getProductionMethods()])
      .then(([s, m]) => {
        setSongs(s);
        setMethods(m);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await createSong({
        title: form.title,
        artist: form.artist,
        priceCents: Math.round(parseFloat(form.price || '0') * 100),
        productionMethod: form.productionMethod,
        instrumentsPlayed: Number(form.instrumentsPlayed) || 0,
        humanVocals: form.humanVocals,
        aiToolPercentage: Number(form.aiToolPercentage) || 0,
      });
      setForm(EMPTY_FORM);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleBuy(id) {
    try {
      await buySong(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <div className="page">
      <header className="hero">
        <h1>
          BOSS<span className="hero__accent">_MUSIC</span>
        </h1>
        <p>Buy music straight from artists. Every track is rated for how human-made it is.</p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>Sell a track</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              Title
              <input value={form.title} onChange={(e) => update('title', e.target.value)} required />
            </label>
            <label>
              Artist
              <input value={form.artist} onChange={(e) => update('artist', e.target.value)} required />
            </label>
            <label>
              Price (USD)
              <input type="number" min="0" step="0.01" value={form.price} onChange={(e) => update('price', e.target.value)} />
            </label>
            <label>
              Production method
              <select value={form.productionMethod} onChange={(e) => update('productionMethod', e.target.value)}>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {METHOD_LABELS[m] || m}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Instruments played (0-5)
              <input type="number" min="0" max="5" value={form.instrumentsPlayed} onChange={(e) => update('instrumentsPlayed', e.target.value)} />
            </label>
            <label>
              AI tooling used (%)
              <input type="number" min="0" max="100" value={form.aiToolPercentage} onChange={(e) => update('aiToolPercentage', e.target.value)} />
            </label>
            <label className="checkbox">
              <input type="checkbox" checked={form.humanVocals} onChange={(e) => update('humanVocals', e.target.checked)} />
              Human vocals
            </label>
            <button type="submit">List for sale</button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel panel--wide">
          <h2>Marketplace</h2>
          {loading ? (
            <p>Loading tracks…</p>
          ) : (
            <ul className="songs">
              {songs.map((song) => (
                <li key={song.id} className="song">
                  <div className="song__main">
                    <div className="song__title">{song.title}</div>
                    <div className="song__artist">by {song.artist}</div>
                    <div className="song__meta">
                      {METHOD_LABELS[song.productionMethod] || song.productionMethod} · {song.sales} sold
                    </div>
                  </div>
                  <div className={ratingClass(song.rating.score)} title={song.rating.factors.join(', ')}>
                    <span className="rating__score">{song.rating.score}</span>
                    <span className="rating__label">{song.rating.label}</span>
                  </div>
                  <div className="song__buy">
                    <span className="song__price">{formatPrice(song.priceCents)}</span>
                    <button onClick={() => handleBuy(song.id)}>Buy</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
