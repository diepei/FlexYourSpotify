"use client";

import Image from "next/image";
import { CSSProperties, FormEvent, useEffect, useRef, useState } from "react";
import {
  Album,
  ArrowRight,
  CalendarDays,
  Clock3,
  Disc3,
  Download,
  Headphones,
  LoaderCircle,
  Mic2,
  Music2,
  Radio,
  Sparkles,
} from "lucide-react";
import type { TrackStats } from "@/lib/spotify";

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-ES").format(value);
}

function formatDuration(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60_000);
  const seconds = Math.floor((milliseconds % 60_000) / 1_000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function StreamChecker() {
  const [url, setUrl] = useState("");
  const [track, setTrack] = useState<TrackStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resultLocked, setResultLocked] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!track) return;

    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const lockTimer = window.setTimeout(() => setResultLocked(true), 850);

    return () => window.clearTimeout(lockTimer);
  }, [track]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/track?url=${encodeURIComponent(url)}`);
      const data = (await response.json()) as TrackStats | { error: string };
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Unexpected error");
      }
      setResultLocked(false);
      setTrack(data);
    } catch (requestError) {
      setTrack(null);
      setError(requestError instanceof Error ? requestError.message : "The request could not be completed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!dashboardRef.current || !track) return;
    const dashboard = dashboardRef.current;
    setDownloading(true);
    dashboard.classList.add("exporting");

    try {
      const panelImages = Array.from(dashboard.querySelectorAll("img"));
      await Promise.all(panelImages.map((image) => image.decode().catch(() => undefined)));
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(dashboard, {
        backgroundColor: "#0b0710",
        cacheBust: true,
        pixelRatio: 2,
        width: 540,
        height: 960,
        style: { width: "540px", height: "960px" },
        filter: (node) =>
          !(node instanceof HTMLElement && node.classList.contains("no-capture")),
      });
      const link = document.createElement("a");
      const fileName = track.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      link.download = `${fileName || "spotify"}-flex-your-spotify.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("Your Spotify story could not be downloaded.");
    } finally {
      dashboard.classList.remove("exporting");
      setDownloading(false);
    }
  }

  function handleSearchAgain() {
    setResultLocked(false);
    setTrack(null);
    setError("");
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  const themeColors = track
    ? ({
        "--theme-primary": track.palette.primary,
        "--theme-secondary": track.palette.secondary,
        "--theme-accent": track.palette.accent,
      } as CSSProperties)
    : undefined;
  const coverUrl = track?.image ? `/api/cover?url=${encodeURIComponent(track.image)}` : "";

  return (
    <main className={track && resultLocked ? "has-result" : undefined}>
      <section className="landing" aria-labelledby="landing-title">
        <form className="search-form" onSubmit={handleSubmit}>
          <p id="landing-title">Flex Your Spotify on Social.</p>
          <div className="search-input">
            <Music2 size={16} aria-hidden="true" />
            <input
              aria-label="Spotify song URL"
              type="text"
              inputMode="url"
              placeholder="Enter a Spotify song URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              autoComplete="off"
              aria-describedby={error ? "form-error" : undefined}
            />
            <button type="submit" aria-label="Generate Flex Your Spotify" disabled={loading || !url.trim()}>
              {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
          <div className="search-caption">
            <span>Generate. Download. Share.</span>
          </div>
          {error ? <p className="error" id="form-error" role="alert">{error}</p> : null}
        </form>
      </section>

      {track ? (
        <section className="result-page" ref={resultRef} aria-labelledby="result-title">
          <div className="dashboard" ref={dashboardRef} style={themeColors} aria-live="polite">
            <div className="story-glow story-glow-one" aria-hidden="true" />
            <div className="story-glow story-glow-two" aria-hidden="true" />
            <div className="dashboard-heading">
              <div className="mini-cover">
                {coverUrl ? <Image src={coverUrl} alt="" fill sizes="49px" unoptimized /> : <Disc3 />}
              </div>
              <div>
                <span>Flex Your Spotify</span>
                <h1 id="result-title">{track.name}</h1>
              </div>
            </div>

            <div className="panel-grid">
              <article className="tile cover-tile">
                {coverUrl ? <Image src={coverUrl} alt={`${track.album} cover`} fill sizes="(max-width: 760px) 50vw, 290px" unoptimized /> : <Disc3 size={52} />}
                <div className="cover-shade" />
                <span className="tile-icon"><Headphones /></span>
                <div className="tile-bottom"><span>Now analyzing</span><strong>PLAYING</strong></div>
              </article>

              <article className="tile streams-tile">
                <Image
                  className="panel-background"
                  src="/panel-backgrounds/streams.svg"
                  alt=""
                  width={217}
                  height={235}
                  unoptimized
                  style={{ position: "absolute", inset: "-2%", width: "104%", height: "104%", maxWidth: "none", objectFit: "fill" }}
                />
                <span className="tile-icon"><Radio /></span>
                <div className="stream-content">
                  <p>Total streams</p>
                  <strong>{formatNumber(track.playcount)}</strong>
                  <span>plays on Spotify</span>
                </div>
              </article>

              <article className="tile track-tile">
                <Image className="panel-background" src="/panel-backgrounds/track.svg" alt="" fill unoptimized />
                <span className="tile-icon"><Sparkles /></span>
                <div className="tile-bottom"><span>Track</span><strong>{track.name}</strong></div>
              </article>

              <article className="tile artist-tile">
                <Image className="panel-background" src="/panel-backgrounds/artist.svg" alt="" fill unoptimized />
                <span className="tile-icon"><Mic2 /></span>
                <div className="tile-bottom">
                  <span>Artist</span>
                  <strong className="artist-list">
                    {track.artists.map((artist) => <span key={artist}>{artist}</span>)}
                  </strong>
                </div>
              </article>

              <article className="tile album-tile">
                <Image className="panel-background" src="/panel-backgrounds/album.svg" alt="" fill unoptimized />
                <span className="tile-icon"><Album /></span>
                <div className="tile-bottom"><span>Album</span><strong>{track.album}</strong></div>
              </article>

              <article className="tile duration-tile">
                <Image className="panel-background" src="/panel-backgrounds/duration.svg" alt="" fill unoptimized />
                <span className="tile-icon"><Clock3 /></span>
                <div className="tile-bottom"><span>Duration</span><strong>{formatDuration(track.durationMs)}</strong></div>
              </article>

              <article className="tile year-tile">
                <Image className="panel-background" src="/panel-backgrounds/released.svg" alt="" fill unoptimized />
                <span className="tile-icon"><CalendarDays /></span>
                <div className="tile-bottom"><span>Released</span><strong>{track.albumYear ?? "—"}</strong></div>
              </article>

            </div>

            <div className="dashboard-footer no-capture">
              <button className="search-again" type="button" onClick={handleSearchAgain}>Search another song ↑</button>
              <button className="download-story" type="button" onClick={handleDownload} disabled={downloading}>
                {downloading ? <LoaderCircle className="spin" size={15} /> : <Download size={15} />}
                {downloading ? "Preparing download" : "Download Your Spotify Flex"}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
