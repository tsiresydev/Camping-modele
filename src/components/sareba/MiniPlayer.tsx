import { Pause, Play, Repeat } from "lucide-react";
import MusicCover from "./MusicCover";
import { displayArtist, type MusicItem } from "../../services/driveMusic";

interface MiniPlayerProps {
  current: MusicItem;
  isPlaying: boolean;
  repeatLabel: string;
  repeatActive: boolean;
  onTogglePlay: () => void;
  onCycleRepeat: () => void;
  onExpand: () => void;
}

/** Barre de lecture compacte collee en bas de l'ecran bibliotheque (maquette). */
export default function MiniPlayer({
  current,
  isPlaying,
  repeatLabel,
  repeatActive,
  onTogglePlay,
  onCycleRepeat,
  onExpand,
}: MiniPlayerProps) {
  return (
    <div className="relative flex items-center gap-3 rounded-t-[26px] bg-scout-black px-4 pb-3 pt-4 text-white shadow-[0_-12px_30px_rgba(0,0,0,0.45)] sm:gap-4 sm:px-6 sm:pb-4">
      <span
        className="absolute left-6 right-6 top-0 h-[3px] rounded-b-[3px] bg-white/20 sm:left-8 sm:right-8"
        aria-hidden
      />

      <button
        type="button"
        onClick={onExpand}
        aria-label="Ouvrir le lecteur complet"
        className="shrink-0 transition-transform active:scale-95"
      >
        <MusicCover
          music={current}
          rounded="rounded-[18px]"
          className="h-14 w-14 shadow-lift sm:h-16 sm:w-16"
        />
      </button>

      <button
        type="button"
        onClick={onExpand}
        className="min-w-0 flex-1 text-left"
        aria-label={`Voir le lecteur de ${current.title}`}
      >
        <p className="truncate text-sm font-bold text-white sm:text-[15px]">{current.title}</p>
        <p className="mt-1 truncate text-xs text-scout-mist">{displayArtist(current)}</p>
      </button>

      <div className="flex shrink-0 items-center gap-2.5">
        <button
          type="button"
          onClick={onCycleRepeat}
          aria-label={`Répétition : ${repeatLabel}`}
          title={`Répétition : ${repeatLabel}`}
          className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/10 ${
            repeatActive ? "text-scout-yellow" : "text-white"
          }`}
        >
          <Repeat className="h-[15px] w-[15px]" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause" : "Lecture"}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-scout-black shadow-lift transition-transform active:scale-95 sm:h-12 sm:w-12"
        >
          {isPlaying ? (
            <Pause className="h-[18px] w-[18px] fill-current" />
          ) : (
            <Play className="ml-0.5 h-[18px] w-[18px] fill-current" />
          )}
        </button>
      </div>
    </div>
  );
}
