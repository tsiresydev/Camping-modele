import { Play, Pause } from "lucide-react";
import type { MusicItem } from "../../services/driveMusic";

interface MusicRowProps {
  music: MusicItem;
  isCurrent: boolean;
  isPlaying: boolean;
  onToggle: (m: MusicItem) => void;
}

export default function MusicRow({ music, isCurrent, isPlaying, onToggle }: MusicRowProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(music)}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left shadow-card transition-all duration-200 hover:shadow-card-hover ${
        isCurrent
          ? "border-scout-yellow bg-scout-yellow/10"
          : "border-scout-gray-border bg-white"
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          isCurrent ? "bg-scout-yellow text-scout-black" : "bg-scout-yellow/15 text-scout-black"
        }`}
      >
        <Play className="h-6 w-6" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-scout-black">{music.title}</p>
        {isCurrent && (
          <p className="mt-0.5 text-xs font-medium text-scout-yellow-dark">
            {isPlaying ? "▶ En cours de lecture" : "⏸ En pause"}
          </p>
        )}
      </div>

      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-scout-yellow text-scout-black shadow-btn transition-transform active:scale-95 ${
          isCurrent ? "animate-pulse" : ""
        }`}
        aria-hidden
      >
        {isCurrent && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </span>
    </button>
  );
}
