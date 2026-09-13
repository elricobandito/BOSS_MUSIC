import Link from "next/link";
import type { Song } from "@/lib/types";
import HumanMadeBadge from "./HumanMadeBadge";

function usd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function SongCard({ song }: { song: Song }) {
  return (
    <Link
      href={`/songs/${song.id}`}
      className="card group block p-5 transition hover:border-boss-accent/50 hover:bg-white/[0.08]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold leading-tight group-hover:text-boss-accent2">
            {song.title}
          </h3>
          <p className="text-sm text-white/60">by {song.artist}</p>
        </div>
        <HumanMadeBadge
          score={song.humanMadeScore}
          label={song.humanMadeLabel}
          size="sm"
        />
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-white/70">
        {song.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-black">{usd(song.priceCents)}</span>
        <span className="text-xs text-white/50">{song.sales} sold</span>
      </div>
    </Link>
  );
}
