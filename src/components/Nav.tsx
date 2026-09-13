import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-boss-accent font-black text-white">
            B
          </span>
          <span className="text-lg font-black tracking-tight">
            BOSS<span className="text-boss-accent2">_MUSIC</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="btn-ghost text-sm">
            Browse
          </Link>
          <Link href="/upload" className="btn-primary text-sm">
            Sell your music
          </Link>
        </div>
      </nav>
    </header>
  );
}
