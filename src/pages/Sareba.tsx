import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Music } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MusicRow from "../components/sareba/MusicRow";
import PlayerBar from "../components/sareba/PlayerBar";
import LyricsModal from "../components/sareba/LyricsModal";
import { LoadingState, EmptyState, ErrorState } from "../components/States";
import {
  fetchMusics,
  fetchLyrics,
  type MusicItem,
} from "../services/driveMusic";

type Status = "loading" | "ready" | "empty" | "error";

export default function Sareba() {
  const [status, setStatus] = useState<Status>("loading");
  const [musics, setMusics] = useState<MusicItem[]>([]);
  const [demo, setDemo] = useState(false);
  const [query, setQuery] = useState("");

  const [current, setCurrent] = useState<MusicItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [lyricsText, setLyricsText] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [lyricsError, setLyricsError] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingPlay = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchMusics()
      .then(({ items, demo: isDemo }) => {
        if (cancelled) return;
        setMusics(items);
        setDemo(isDemo);
        setStatus(items.length > 0 ? "ready" : "empty");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return musics;
    return musics.filter((m) => m.title.toLowerCase().includes(q));
  }, [musics, query]);

  function playItem(item: MusicItem) {
    if (current?.id === item.id) {
      if (isPlaying) audioRef.current?.pause();
      else audioRef.current?.play().catch(() => {});
      return;
    }
    setCurrent(item);
    setCurrentTime(0);
    pendingPlay.current = true;
  }

  function goTo(item: MusicItem) {
    setCurrent(item);
    setCurrentTime(0);
    pendingPlay.current = true;
  }

  useEffect(() => {
    if (pendingPlay.current && current && audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          pendingPlay.current = false;
        })
        .catch(() => {
          pendingPlay.current = false;
        });
    }
  }, [current]);

  function next() {
    if (filtered.length === 0) return;
    const idx = filtered.findIndex((m) => m.id === current?.id);
    goTo(filtered[(idx + 1 + filtered.length) % filtered.length]);
  }
  function prev() {
    if (filtered.length === 0) return;
    const idx = filtered.findIndex((m) => m.id === current?.id);
    goTo(filtered[(idx - 1 + filtered.length) % filtered.length]);
  }

  function onSeek(time: number) {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  }
  function onVolume(v: number) {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }

  async function openLyrics() {
    if (!current) return;
    setLyricsOpen(true);
    setLyricsError(false);
    if (current.lyrics) {
      setLyricsText(current.lyrics);
      return;
    }
    if (!current.lyricsId) {
      setLyricsText(null);
      return;
    }
    setLyricsLoading(true);
    try {
      setLyricsText(await fetchLyrics(current.lyricsId));
    } catch {
      setLyricsError(true);
    } finally {
      setLyricsLoading(false);
    }
  }

  const hasLyrics = Boolean(current?.lyrics || current?.lyricsId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${current ? "pb-44 sm:pb-32" : ""}`}>
        <section className="border-b border-scout-gray-border bg-scout-gray-light">
          <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-scout-yellow/60 bg-scout-yellow/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-scout-black">
              <Music className="h-4 w-4" />
              Saréba
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold text-scout-black sm:text-4xl">
              Notre bibliothèque musicale
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-scout-black/70">
              Écoutez les chants et musiques de la 72ème ANDRIAMPIROKANA, où que vous
              soyez.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          {demo && (
            <div className="mb-6 rounded-xl border border-scout-yellow/50 bg-scout-yellow/10 px-4 py-3 text-sm text-scout-black/80">
              Mode démonstration : configurez <code>VITE_GOOGLE_DRIVE_API_KEY</code> et{" "}
              <code>VITE_GOOGLE_DRIVE_FOLDER_ID</code> pour charger vos musiques depuis Google
              Drive.
            </div>
          )}

          {status === "loading" && <LoadingState />}
          {status === "error" && (
            <ErrorState message="Impossible de récupérer les musiques pour le moment." />
          )}
          {status === "empty" && <EmptyState />}

          {status === "ready" && (
            <>
              <div className="relative mb-6 max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scout-black/40" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher une musique..."
                  aria-label="Rechercher une musique"
                  className="w-full rounded-xl border border-scout-gray-border bg-white py-3 pl-10 pr-4 text-sm text-scout-black placeholder:text-scout-black/40 focus:outline-none focus:ring-2 focus:ring-scout-black/20"
                />
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-scout-gray-border bg-scout-gray-light py-16 text-center text-scout-black/70">
                  <Music className="h-8 w-8 text-scout-yellow-dark" />
                  <p className="font-medium">Aucune musique trouvée.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((m) => (
                    <MusicRow
                      key={m.id}
                      music={m}
                      isCurrent={current?.id === m.id}
                      isPlaying={isPlaying}
                      onToggle={playItem}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />

      <PlayerBar
        current={current}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        hasLyrics={hasLyrics}
        onTogglePlay={() => {
          if (isPlaying) audioRef.current?.pause();
          else audioRef.current?.play().catch(() => {});
        }}
        onPrev={prev}
        onNext={next}
        onSeek={onSeek}
        onVolume={onVolume}
        onLyrics={openLyrics}
      />

      {lyricsOpen && (
        <LyricsModal
          title={current?.title ?? ""}
          loading={lyricsLoading}
          error={lyricsError}
          text={lyricsText}
          onClose={() => setLyricsOpen(false)}
        />
      )}

      {current && (
        <audio
          ref={audioRef}
          src={current.audioUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={next}
        />
      )}
    </div>
  );
}
