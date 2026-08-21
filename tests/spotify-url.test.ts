import test from "node:test";
import assert from "node:assert/strict";
import { extractTrackId } from "../lib/spotify-url.ts";

const id = "4cOdK2wGLETKBW3PvgPWqT";

test("extracts track IDs from supported Spotify formats", () => {
  assert.equal(extractTrackId(`https://open.spotify.com/track/${id}?si=abc`), id);
  assert.equal(extractTrackId(`https://open.spotify.com/intl-es/track/${id}`), id);
  assert.equal(extractTrackId(`spotify:track:${id}`), id);
  assert.equal(extractTrackId(id), id);
});

test("rejects non-track and untrusted URLs", () => {
  assert.equal(extractTrackId(`https://example.com/track/${id}`), null);
  assert.equal(extractTrackId("https://open.spotify.com/album/123"), null);
  assert.equal(extractTrackId("not-a-spotify-url"), null);
});
