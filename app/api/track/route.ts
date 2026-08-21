import { NextRequest, NextResponse } from "next/server";
import { fetchTrackStats, SpotifyLookupError } from "@/lib/spotify";
import { extractTrackId } from "@/lib/spotify-url";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("url") ?? "";
  const trackId = extractTrackId(input);

  if (!trackId) {
    return NextResponse.json(
      { error: "URL not valid." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await fetchTrackStats(trackId), {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    if (error instanceof SpotifyLookupError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Spotify took too long to respond. Please try again." },
        { status: 504 },
      );
    }
    console.error("Spotify lookup failed", error);
    return NextResponse.json(
      { error: "Spotify could not be reached right now." },
      { status: 502 },
    );
  }
}
