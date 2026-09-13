import Link from "next/link";
import { listSongs } from "@/lib/store";
import SongCard from "@/components/SongCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const songs = await listSongs();

  return (
    <div>
      <section className="mb-10 mt-4">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Music made by <span className="text-boss-accent2">humans</span>,
          <br />
          sold by the artists who made it.
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Every track on BOSS_MUSIC gets a transparent{" "}
          <span className="font-semibold text-white">human-made rating</span> so
          listeners know exactly how much of what they hear came from a person.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/upload" className="btn-primary">
            Sell your music
          </Link>
          <a href="#catalog" className="btn-ghost">
            Browse the catalog
          </a>
        </div>
      </section>

      <section id="catalog">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Catalog</h2>
          <span className="text-sm text-white/50">
            {songs.length} songs · sorted by human-made score
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>
    </div>
  );
}
