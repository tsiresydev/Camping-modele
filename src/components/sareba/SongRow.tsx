import { List, Mic2 } from "lucide-react";
import MusicCover from "./MusicCover";
import Equalizer from "./Equalizer";
import { displayArtist, type MusicItem } from "../../services/driveMusic";

interface SongRowProps {
  music: MusicItem;
  isCurrent: boolean;
  isPlaying: boolean;
  onToggle: (music: MusicItem) => void;
  onOpenQueue: (music: MusicItem) => void;
}

/** Ligne de chanson : pochette, titre, artiste, badge PAROLES (maquette ecran 1). */
export default function SongRow({
  music,
  isCurrent,
  isPlaying,
  onToggle,
  onOpenQueue,
}: SongRowProps) {
  return (
    <div
      className={`flex items-center gap-3 border-b border-scout-black/5 py-3.5 transition-colors ${
        isCurrent ? "" : "hover:bg-scout-black/[0.03]"
      }`}
    >
      <button
        type="button"
        onClick={() => onToggle(music)}
        aria-label={`${isPlaying && isCurrent ? "Mettre en pause" : "Écouter"} ${music.title}`}
        aria-current={isCurrent ? "true" : undefined}
        className={`relative shrink-0 rounded-[18px] transition-shadow duration-200 ${
          isCurrent ? "ring-2 ring-scout-yellow ring-offset-2 ring-offset-white" : ""
        }`}
      >
        <MusicCover music={music} rounded="rounded-[18px]" className="h-[68px] w-[68px] sm:h-[80px] sm:w-[80px]" />
        {isCurrent && <Equalizer playing={isPlaying} rounded="rounded-[18px]" />}
      </button>

      <button
        type="button"
        onClick={() => onToggle(music)}
        className="min-w-0 flex-1 text-left"
      >
        <p
          className={`truncate text-[15px] font-bold leading-tight sm:text-base ${
            isCurrent ? "text-scout-black" : "text-scout-black/90"
          }`}
        >
          {music.title}
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="truncate text-[13px] text-scout-mist">{displayArtist(music)}</span>
          {music.lyrics || music.lyricsId ? (
            <span className="flex shrink-0 items-center gap-1 rounded-full border border-scout-black/15 px-1.5 py-[1px] text-[9px] font-medium uppercase tracking-wider text-scout-black/45">
              <Mic2 className="h-2.5 w-2.5" aria-hidden />
              Paroles
            </span>
          ) : null}
        </div>
      </button>

      <button
        type="button"
        onClick={() => onOpenQueue(music)}
        aria-label={`Ouvrir la file d'attente à partir de ${music.title}`}
        className="grid h-9 w-12 shrink-0 place-items-center rounded-lg text-scout-mist transition-colors hover:bg-scout-black/5 hover:text-scout-black"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
