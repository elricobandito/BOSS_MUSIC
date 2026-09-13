import { NextResponse } from "next/server";
import { purchaseSong } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const song = await purchaseSong(params.id);
  if (!song) {
    return NextResponse.json({ error: "Song not found" }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    message: `Thanks for supporting ${song.artist}! You now own "${song.title}".`,
    song,
  });
}
