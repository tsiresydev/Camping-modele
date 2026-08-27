import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import type { MusicItem } from "../../services/driveMusic";

interface PlayerBarProps {
  current: MusicItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasLyrics: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (time: number) => void;
  onVolume: (v: number) => void;
  onLyrics: () => void;
}

function formatTime(t: number): string {
  if (!Number.isFinite(t)) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PlayerBar({
  current,
  isPlaying,
  currentTime,
  duration,
  volume,
  hasLyrics,
  onTogglePlay,
  onPrev,
  onNext,
  onSeek,
  onVolume,
  onLyrics,
}: PlayerBarProps) {
  if (!current) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-scout-black px-4 py-3 text-white shadow-2xl">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{current.title}</p>
          <p className="text-xs text-white/50">
            {isPlaying ? "Lecture en cours" : "En pause"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Musique précédente"
            className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Lecture"}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-scout-yellow text-scout-black shadow-btn transition-transform active:scale-95"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Musique suivante"
            className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-2">
          <span className="w-12 text-right text-xs tabular-nums text-white/60">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => onSeek(Number(e.target.value))}
            aria-label="Progression de lecture"
            className="h-1.5 flex-1 cursor-pointer accent-scout-yellow"
          />
          <span className="w-12 text-xs tabular-nums text-white/60">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasLyrics && (
            <button
              type="button"
              onClick={onLyrics}
              className="rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              🎤 Paroles
            </button>
          )}
          <div className="hidden items-center gap-2 sm:flex">
            <Volume2 className="h-4 w-4 text-white/60" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolume(Number(e.target.value))}
              aria-label="Volume"
              className="h-1.5 w-20 cursor-pointer accent-scout-yellow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
