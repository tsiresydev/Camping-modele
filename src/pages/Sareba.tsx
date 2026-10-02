import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Inbox, Loader2, Music } from "lucide-react";
import SarebaTopBar from "../components/sareba/SarebaTopBar";
import SongRow from "../components/sareba/SongRow";
import MiniPlayer from "../components/sareba/MiniPlayer";
import QueueScreen from "../components/sareba/QueueScreen";
import NowPlaying from "../components/sareba/NowPlaying";
import LyricsModal from "../components/sareba/LyricsModal";
import {
  REPEAT_CYCLE,
  REPEAT_LABEL,
  shuffleList,
  sortMusics,
  type RepeatMode,
  type SortMode,
} from "../components/sareba/types";
import {
  displayArtist,
  fetchLyrics,
  fetchMusics,
  type MusicItem,
} from "../services/driveMusic";

type Status = "loading" | "ready" | "empty" | "error";
type Screen = "library" | "queue" | "player";

const PAGE_SIZE = 12;

export default function Sareba() {
  const [status, setStatus] = useState<Status>("loading");
  const [musics, setMusics] = useState<MusicItem[]>([]);
  const [demo, setDemo] = useState(false);

  const [sortMode, setSortMode] = useState<SortMode>("az");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [screen, setScreen] = useState<Screen>("library");
  const [queue, setQueue] = useState<MusicItem[]>([]);
  const [current, setCurrent] = useState<MusicItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [shuffle, setShuffle] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [playError, setPlayError] = useState(false);

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

  /* ================= Bibliotheque ================= */

  const library = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? musics.filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            (m.artist ?? "").toLowerCase().includes(q),
        )
      : musics;
    return sortMusics(matched, sortMode);
  }, [musics, query, sortMode]);

  const visibleList = useMemo(() => library.slice(0, visible), [library, visible]);
  const hasMore = visible < library.length;

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, sortMode, musics]);
  function loadMore() {
    setVisible((v) => Math.min(library.length, v + PAGE_SIZE));
  }

  /* ================= File d'attente ================= */

  const allSorted = useMemo(() => sortMusics(musics, sortMode), [musics, sortMode]);

  function toggleShuffle() {
    setShuffleSeed((n) => n + 1);
    setShuffle((s) => !s);
  }

  useEffect(() => {
    setQueue(
      shuffle
        ? shuffleList(allSorted, allSorted.length * 31 + shuffleSeed * 7919)
        : allSorted,
    );
  }, [allSorted, shuffle, shuffleSeed]);

  function goTo(item: MusicItem) {
    setCurrent(item);
    setCurrentTime(0);
    setDuration(0);
    pendingPlay.current = true;
  }

  function playItem(item: MusicItem) {
    if (current?.id === item.id) {
      togglePlay();
      return;
    }
    goTo(item);
  }

  function playFromQueue(music: MusicItem) {
    setQueue((prev) =>
      prev.some((m) => m.id === music.id) ? prev : [...prev, music],
    );
    goTo(music);
  }

  function cleanQueue() {
    setQueue((prev) => prev.filter((m) => m.id !== current?.id));
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!pendingPlay.current || !current || !audio) return;
    pendingPlay.current = false;
    setPlayError(false);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
        setPlayError(true);
      });
  }, [current]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setPlayError(false);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setPlayError(true);
        });
    } else {
      audio.pause();
    }
  }

  function next(auto = false) {
    const audio = audioRef.current;

    if (auto && repeatMode === "one") {
      if (!audio) return;
      audio.currentTime = 0;
      setCurrentTime(0);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
          setPlayError(true);
        });
      return;
    }

    if (queue.length === 0) return;

    const index = queue.findIndex((m) => m.id === current?.id);

    if (index === -1) {
      goTo(queue[0]);
      return;
    }

    if (index === queue.length - 1 && repeatMode === "off") {
      audio?.pause();
      if (audio) audio.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      return;
    }

    goTo(queue[(index + 1) % queue.length]);
  }

  function prev() {
    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (queue.length === 0) return;

    const index = queue.findIndex((m) => m.id === current?.id);

    if (index <= 0) {
      if (index === -1 || repeatMode !== "off") {
        goTo(queue[queue.length - 1]);
        return;
      }
      if (audio) audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    goTo(queue[index - 1]);
  }

  function cycleRepeat() {
    setRepeatMode((mode) => REPEAT_CYCLE[(REPEAT_CYCLE.indexOf(mode) + 1) % REPEAT_CYCLE.length]);
  }

  /* ================= Lecteur ================= */

  function onSeek(time: number) {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0;
  const hasLyrics = Boolean(current?.lyrics || current?.lyricsId);

  const openLyrics = useCallback(async () => {
    if (!current) return;
    setLyricsOpen(true);
    setLyricsError(false);
    setLyricsText(null);
    if (current.lyrics) {
      setLyricsText(current.lyrics);
      return;
    }
    if (!current.lyricsId) return;
    setLyricsLoading(true);
    try {
      setLyricsText(await fetchLyrics(current.lyricsId));
    } catch {
      setLyricsError(true);
    } finally {
      setLyricsLoading(false);
    }
  }, [current]);

  const isLibrary = screen === "library" || !current;

  return (
    <div
      className={`h-[100dvh] overflow-hidden ${
        isLibrary ? "bg-scout-gray-light" : "bg-scout-black"
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col pt-safe">
        {screen === "queue" ? (
          <QueueScreen
            queue={queue}
            current={current}
            isPlaying={isPlaying}
            progress={progress}
            repeatMode={repeatMode}
            shuffle={shuffle}
            onClose={() => setScreen("library")}
            onPlay={playFromQueue}
            onTogglePlay={togglePlay}
            onCycleRepeat={cycleRepeat}
            onToggleShuffle={toggleShuffle}
            onClean={cleanQueue}
          />
        ) : screen === "player" && current ? (
          <NowPlaying
            current={current}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            repeatMode={repeatMode}
            shuffle={shuffle}
            hasLyrics={hasLyrics}
            onMinimize={() => setScreen("library")}
            onOpenQueue={() => setScreen("queue")}
            onTogglePlay={togglePlay}
            onPrev={prev}
            onNext={() => next(false)}
            onSeek={onSeek}
            onCycleRepeat={cycleRepeat}
            onToggleShuffle={toggleShuffle}
            onOpenLyrics={openLyrics}
          />
        ) : (
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <SarebaTopBar
              searchOpen={searchOpen}
              query={query}
              sortMode={sortMode}
              onToggleSearch={() => setSearchOpen((v) => !v)}
              onQueryChange={setQuery}
              onCycleSort={() => setSortMode((m) => (m === "az" ? "za" : "az"))}
            />

            {demo && status === "ready" && (
              <p className="mx-5 mt-4 rounded-2xl border border-scout-yellow/60 bg-scout-yellow/10 px-4 py-3 text-xs leading-relaxed text-scout-black/75 sm:mx-7">
                Mode dÃ©monstration. Configurez{" "}
                <code className="font-mono font-semibold">VITE_GOOGLE_DRIVE_API_KEY</code> et{" "}
                <code className="font-mono font-semibold">VITE_GOOGLE_DRIVE_MUSIC_ID</code>{" "}
                pour charger vos chansons depuis Google Drive.
              </p>
            )}

            <div className="scroll-none mt-2 min-h-0 flex-1 overflow-y-auto px-5 pb-8 pt-2 sm:px-7">
              {status === "loading" && (
                <p className="flex flex-col items-center gap-3 py-20 text-scout-black/60">
                  <Loader2 className="h-8 w-8 animate-spin text-scout-yellow-dark" />
                  <span className="text-sm">Chargement des chansonsâ€¦</span>
                </p>
              )}

              {status === "error" && (
                <p className="flex flex-col items-center gap-3 py-20 text-center text-scout-red">
                  <AlertTriangle className="h-8 w-8" />
                  <span className="text-sm font-medium">
                    Impossible de rÃ©cupÃ©rer les chansons pour le moment.
                  </span>
                </p>
              )}

              {status === "empty" && (
                <p className="flex flex-col items-center gap-3 py-20 text-center text-scout-black/60">
                  <Inbox className="h-8 w-8 text-scout-yellow-dark" />
                  <span className="text-sm font-medium">Aucune chanson disponible.</span>
                  <span className="max-w-xs text-xs text-scout-black/45">
                    Revenez bientÃ´t pour dÃ©couvrir les chants de la 72Ã¨me ANDRIAMPIROKANA.
                  </span>
                </p>
              )}

              {status === "ready" && visibleList.length === 0 && (
                <p className="flex flex-col items-center gap-3 py-20 text-center text-scout-black/60">
                  <Music className="h-8 w-8 text-scout-yellow-dark" />
                  <span className="text-sm font-medium">Aucune chanson trouvÃ©e.</span>
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="mt-1 rounded-full bg-scout-black px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-scout-charcoal"
                    >
                      Effacer la recherche
                    </button>
                  )}
                </p>
              )}

              {status === "ready" && visibleList.length > 0 && (
                <>
                  <ul>
                    {visibleList.map((m) => (
                      <li key={m.id}>
                        <SongRow
                          music={m}
                          isCurrent={current?.id === m.id}
                          isPlaying={isPlaying}
                          onToggle={playItem}
                          onOpenQueue={playFromQueue}
                        />
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <div className="flex flex-col items-center gap-2 pt-6">
                      <button
                        type="button"
                        onClick={loadMore}
                        className="rounded-full border-2 border-scout-black px-6 py-2.5 text-sm font-semibold text-scout-black transition-colors hover:bg-scout-black hover:text-white"
                      >
                        Charger plus
                      </button>
                      <p className="text-xs text-scout-black/45">
                        {visibleList.length} / {library.length} chanson
                        {library.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {playError && current && (
              <p className="mx-5 mb-2 flex items-start gap-2 rounded-xl bg-scout-red/10 px-3 py-2 text-xs font-medium text-scout-red sm:mx-7">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Impossible de lire cette chanson. VÃ©rifiez votre connexion puis
                  rÃ©essayez.
                </span>
              </p>
            )}

            {current && (
              <MiniPlayer
                current={current}
                isPlaying={isPlaying}
                repeatLabel={REPEAT_LABEL[repeatMode]}
                repeatActive={repeatMode !== "off"}
                onTogglePlay={togglePlay}
                onCycleRepeat={cycleRepeat}
                onExpand={() => setScreen("player")}
              />
            )}
          </div>
        )}

        {current && (
          <audio
            ref={audioRef}
            src={current.audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => next(true)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => {
              const value = e.currentTarget.duration;
              setDuration(Number.isFinite(value) ? value : 0);
            }}
            onError={() => {
              setIsPlaying(false);
              setPlayError(true);
            }}
          />
        )}

        {lyricsOpen && current && (
          <LyricsModal
            title={current.title}
            artist={displayArtist(current)}
            loading={lyricsLoading}
            error={lyricsError}
            text={lyricsText}
            onClose={() => setLyricsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
