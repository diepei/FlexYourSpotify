# SpotifyAura

Web app that reveals a song's visual aura and total Spotify stream count from its URL.

## Development

```bash
cd /Users/diepei/Documents/Github/SpotifyAura
npm install
npm run dev
```

Open `http://localhost:3000` and paste a Spotify song URL.

```text
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
```

## How it works

The server-side endpoint validates the track ID, requests the public embedded song page, obtains a temporary anonymous session, and calls the web player's internal `getTrack` operation. It needs no user credentials, and temporary tokens never reach the browser.

The data strategy is based on [spotify-private-api](https://github.com/FrostBreker/spotify-private-api), adapted to Spotify's current response format. The interface draws from [CodingAura](https://github.com/codeaashu/CodingAura)'s dark, typographic, textured visual language without copying its assets.

> This project is not affiliated with or endorsed by Spotify. It uses unofficial interfaces that may change without notice. Respect service limits and use it for educational purposes.
