import type { CSSProperties } from "react";
import {
  ChevronDown,
  ListRestart,
  Mic2,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import MusicCover from "./MusicCover";
import { displayArtist, type MusicItem } from "../../services/driveMusic";
import { REPEAT_LABEL, type RepeatMode } from "./types";

interface NowPlayingProps {
  current: MusicItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  hasLyrics: boolean;
  onMinimize: () => void;
  onOpenQueue: () => void;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onOpenLyrics: () => void;
}

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const m = Math.floor(value / 60);
  const s = Math.floor(value % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Ecran 3 de la maquette : lecteur plein ecran. */
export default function NowPlaying({
  current,
  isPlaying,
  currentTime,
  duration,
  progress,
  repeatMode,
  shuffle,
  hasLyrics,
  onMinimize,
  onOpenQueue,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onCycleRepeat,
  onToggleShuffle,
  onOpenLyrics,
}: NowPlayingProps) {
  return (
    <div className="scroll-none flex min-h-0 flex-1 flex-col overflow-y-auto animate-screen-in bg-scout-black px-5 text-white sm:px-7">
      <header className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onMinimize}
          aria-label="Reduire le lecteur"
          className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onOpenQueue}
          aria-label="Ouvrir la file d'attente"
          className="grid h-9 w-9 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ListRestart className="h-[18px] w-[18px]" />
        </button>
      </header>

      <MusicCover
        music={current}
        rounded="rounded-[28px]"
        className="mx-auto mt-4 h-[min(72vw,300px)] w-[min(72vw,300px)] shadow-[0_26px_50px_rgba(0,0,0,0.5)] sm:h-[340px] sm:w-[340px]"
      />

      <div className="mt-5 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[26px] font-extrabold leading-[1.2] text-scout-yellow sm:text-[29px]">
            {current.title}
          </h2>
          <p className="mt-2 text-[15px] text-white/55 sm:text-base">{displayArtist(current)}</p>
        </div>
      </div>

      <div className="mt-5">
        <input
          type="range"
          className="sareba-range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label="Progression de lecture"
          aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
          style={{ "--pct": `${progress * 100}%` } as CSSProperties}
        />
        <div className="mt-2.5 flex items-center justify-between text-xs font-medium tabular-nums text-white/55">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-9">
        <button
          type="button"
          onClick={onPrev}
          aria-label="Musique précédente"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.07] text-scout-yellow transition-colors hover:bg-white/15 sm:h-[60px] sm:w-[60px]"
        >
          <SkipBack className="h-5 w-5 fill-current" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Lecture"}
          className="grid h-[76px] w-[76px] place-items-center rounded-full bg-scout-yellow text-scout-black shadow-lift transition-transform active:scale-95 sm:h-[84px] sm:w-[84px]"
        >
          {isPlaying ? (
            <Pause className="h-7 w-7 fill-current" />
          ) : (
            <Play className="ml-1 h-8 w-8 fill-current" />
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Musique suivante"
          className="grid h-14 w-14 place-items-center rounded-full bg-white/[0.07] text-scout-yellow transition-colors hover:bg-white/15 sm:h-[60px] sm:w-[60px]"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pb-5 pt-7">
        <button
          type="button"
          onClick={onCycleRepeat}
          aria-label={`Répétition : ${REPEAT_LABEL[repeatMode]}`}
          title={`Répétition : ${REPEAT_LABEL[repeatMode]}`}
          className={`flex flex-col items-center gap-2 text-[11px] font-medium tracking-wide transition-colors ${
            repeatMode !== "off" ? "text-scout-yellow" : "text-white/55 hover:text-white"
          }`}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="h-[19px] w-[19px]" />
          ) : (
            <Repeat className="h-[19px] w-[19px]" />
          )}
          <span>Répéter</span>
        </button>

        <button
          type="button"
          onClick={onOpenLyrics}
          disabled={!hasLyrics}
          aria-label="Voir les paroles"
          className="flex flex-col items-center gap-2.5 rounded-full bg-white/[0.07] px-6 py-3 text-[11px] font-medium tracking-wide text-white transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
        >
          <Mic2 className="h-[18px] w-[18px]" />
          <span>Paroles</span>
        </button>

        <button
          type="button"
          onClick={onToggleShuffle}
          aria-label={`Mélange : ${shuffle ? "activé" : "désactivé"}`}
          className={`flex flex-col items-center gap-2 text-[11px] font-medium tracking-wide transition-colors ${
            shuffle ? "text-scout-yellow" : "text-white/55 hover:text-white"
          }`}
        >
          <Shuffle className="h-[19px] w-[19px]" />
          <span>Mélange</span>
        </button>
      </div>

      <span className="mx-auto mb-3 h-1 w-28 shrink-0 rounded-full bg-white/25" aria-hidden />
    </div>
  );
}
