import Link from "next/link";
import { notFound } from "next/navigation";
import { getSong } from "@/lib/store";
import HumanMadeBadge from "@/components/HumanMadeBadge";
import BuyButton from "./BuyButton";
import type { RatingInput } from "@/lib/types";

export const dynamic = "force-dynamic";

function usd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const RATING_ROWS: { key: keyof RatingInput; label: string; human: boolean }[] =
  [
    { key: "liveInstrumentsPct", label: "Live instruments", human: true },
    { key: "liveVocals", label: "Live vocals", human: true },
    { key: "handwrittenLyrics", label: "Handwritten lyrics", human: true },
    { key: "aiAssistedProduction", label: "AI-assisted production", human: false },
    { key: "aiGeneratedMelody", label: "AI-generated melody", human: false },
    { key: "aiGeneratedLyrics", label: "AI-generated lyrics", human: false },
  ];

export default async function SongPage({
  params,
}: {
  params: { id: string };
}) {
  const song = await getSong(params.id);
  if (!song) notFound();

  return (
    <div>
      <Link href="/" className="text-sm text-white/50 hover:text-white">
        ← Back to catalog
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="card p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black">{song.title}</h1>
              <p className="mt-1 text-white/60">by {song.artist}</p>
            </div>
            <HumanMadeBadge
              score={song.humanMadeScore}
              label={song.humanMadeLabel}
              size="lg"
            />
          </div>
          <p className="text-white/80">{song.description}</p>

          <h2 className="mb-3 mt-8 text-lg font-bold">How this rating was earned</h2>
          <ul className="space-y-2">
            {RATING_ROWS.map((row) => {
              const value = song.rating[row.key];
              const display =
                row.key === "liveInstrumentsPct"
                  ? `${value}%`
                  : value
                    ? "Yes"
                    : "No";
              const active =
                row.key === "liveInstrumentsPct"
                  ? Number(value) > 0
                  : Boolean(value);
              return (
                <li
                  key={row.key}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span
                      className={
                        active
                          ? row.human
                            ? "text-emerald-300"
                            : "text-rose-300"
                          : "text-white/30"
                      }
                      aria-hidden
                    >
                      {row.human ? "♥" : "⚙"}
                    </span>
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold text-white/80">
                    {display}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <div className="mb-4 text-4xl font-black">{usd(song.priceCents)}</div>
          <BuyButton songId={song.id} price={usd(song.priceCents)} />
          <p className="mt-4 text-center text-xs text-white/40">
            {song.sales} people already own this track
          </p>
        </aside>
      </div>
    </div>
  );
}
