const TRACK_ID_PATTERN = /^[A-Za-z0-9]{22}$/;

export function extractTrackId(input: string): string | null {
  const value = input.trim();

  if (TRACK_ID_PATTERN.test(value)) return value;

  const uriMatch = value.match(/^spotify:track:([A-Za-z0-9]{22})$/i);
  if (uriMatch) return uriMatch[1];

  try {
    const url = new URL(value);
    if (url.hostname !== "open.spotify.com" && url.hostname !== "play.spotify.com") {
      return null;
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const trackIndex = segments.indexOf("track");
    const id = trackIndex >= 0 ? segments[trackIndex + 1] : undefined;
    return id && TRACK_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}
