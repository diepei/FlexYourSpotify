# Flex Your Spotify

Web app that reveals a song's total Spotify stream count from its URL and generates a shareable visual story.

## Development

```bash
cd /Users/diepei/Documents/Github/FlexYourSpotify
npm install
npm run dev
```

Open `http://localhost:3000` and paste a Spotify song URL.

```text
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
```

## How it works

The server-side endpoint validates the track ID, requests the public embedded song page, obtains a temporary anonymous session, and calls the web player's internal `getTrack` operation. It needs no user credentials, and temporary tokens never reach the browser.

The app uses Spotify's current public-facing response data to build a dark, typographic and textured shareable story.

> This project is not affiliated with or endorsed by Spotify. It uses unofficial interfaces that may change without notice. Respect service limits and use it for educational purposes.
