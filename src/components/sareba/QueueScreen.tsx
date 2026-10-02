import {
  ChevronDown,
  ListRestart,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  Sparkles,
} from "lucide-react";
import MusicCover from "./MusicCover";
import Equalizer from "./Equalizer";
import { displayArtist, type MusicItem } from "../../services/driveMusic";
import { REPEAT_LABEL, type RepeatMode } from "./types";

interface QueueScreenProps {
  queue: MusicItem[];
  current: MusicItem | null;
  isPlaying: boolean;
  progress: number;
  repeatMode: RepeatMode;
  shuffle: boolean;
  onClose: () => void;
  onPlay: (music: MusicItem) => void;
  onTogglePlay: () => void;
  onCycleRepeat: () => void;
  onToggleShuffle: () => void;
  onClean: () => void;
}

const CAP_LABEL: Record<RepeatMode, string> = {
  off: "Répéter",
  all: "Répéter",
  one: "Répéter 1",
};

/** Ecran 2 de la maquette : entete piste, progression, file d'attente, modes. */
export default function QueueScreen({
  queue,
  current,
  isPlaying,
  progress,
  repeatMode,
  shuffle,
  onClose,
  onPlay,
  onTogglePlay,
  onCycleRepeat,
  onToggleShuffle,
  onClean,
}: QueueScreenProps) {
  const hasCurrent = Boolean(current);

  return (
    <div className="flex min-h-0 flex-1 flex-col animate-screen-in bg-scout-black text-white">
      <div className="scroll-none flex-1 overflow-y-auto">
        <header className="flex items-center gap-3 px-5 pt-5 sm:px-7 sm:pt-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Reduire le lecteur"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronDown className="h-5 w-5" />
          </button>

          {current ? (
            <>
              <MusicCover
                music={current}
                rounded="rounded-[14px]"
                className="h-12 w-12 shadow-lift"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{current.title}</p>
                <p className="mt-1 truncate text-[13px] text-white/55">
                  {displayArtist(current)}
                </p>
              </div>
              <button
                type="button"
                onClick={onTogglePlay}
                disabled={!hasCurrent}
                aria-label={isPlaying ? "Pause" : "Lecture"}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-scout-black shadow-lift transition-transform active:scale-95 disabled:opacity-40"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                )}
              </button>
            </>
          ) : (
            <p className="flex-1 text-center text-sm text-white/50">
              Aucune musique en cours de lecture
            </p>
          )}
        </header>

        <div className="mx-5 mt-4 h-[5px] overflow-hidden rounded-full bg-white/15 sm:mx-7">
          <div
            className="h-full rounded-full bg-scout-yellow transition-[width] duration-200"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-7 sm:px-7">
          <h2 className="font-display text-[34px] font-extrabold leading-none tracking-tight sm:text-[40px]">
            File d&apos;attente
          </h2>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onCycleRepeat}
              aria-label={`Répétition : ${REPEAT_LABEL[repeatMode]}`}
              title={`Répétition : ${REPEAT_LABEL[repeatMode]}`}
              className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/10 ${
                repeatMode !== "off" ? "text-scout-yellow" : "text-white/80"
              }`}
            >
              {repeatMode === "one" ? (
                <Repeat1 className="h-[17px] w-[17px]" />
              ) : (
                <Repeat className="h-[17px] w-[17px]" />
              )}
            </button>
            <button
              type="button"
              onClick={onClean}
              aria-label="Nettoyer la file d'attente"
              title="Nettoyer la file d'attente"
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ListRestart className="h-[17px] w-[17px]" />
            </button>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-5 py-16 text-center sm:px-7">
            <Sparkles className="h-8 w-8 text-scout-yellow" aria-hidden />
            <p className="text-sm font-medium text-white/70">La file d&apos;attente est vide.</p>
            <p className="max-w-xs text-xs text-white/45">
              Lancez une chanson depuis la bibliothèque pour la retrouver ici.
            </p>
          </div>
        ) : (
          <ul className="px-5 pb-4 sm:px-7">
            {queue.map((music) => {
              const isCurrent = current?.id === music.id;
              return (
                <li key={music.id}>
                  <button
                    type="button"
                    onClick={() => onPlay(music)}
                    aria-current={isCurrent ? "true" : undefined}
                    className={`flex w-full items-center gap-3 border-b border-white/[0.07] py-2.5 text-left transition-colors last:border-0 ${
                      isCurrent ? "" : "hover:bg-white/5"
                    }`}
                  >
                    <span className="relative shrink-0">
                      <MusicCover
                        music={music}
                        rounded="rounded-[14px]"
                        className="h-14 w-14 shadow-lift sm:h-16 sm:w-16"
                      />
                      {isCurrent && <Equalizer playing={isPlaying} rounded="rounded-[14px]" />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[15px] font-bold ${
                          isCurrent ? "text-scout-yellow" : "text-white"
                        }`}
                      >
                        {music.title}
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-white/50">
                        {displayArtist(music)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center gap-2.5 border-t border-white/10 px-5 pb-safe pt-4 sm:px-7">
        <button
          type="button"
          onClick={onCycleRepeat}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
            repeatMode !== "off"
              ? "bg-scout-yellow text-scout-black shadow-btn"
              : "bg-white/5 text-scout-mist hover:bg-white/10"
          }`}
        >
          {repeatMode === "one" ? (
            <Repeat1 className="h-3.5 w-3.5" />
          ) : (
            <Repeat className="h-3.5 w-3.5" />
          )}
          <span>{CAP_LABEL[repeatMode]}</span>
        </button>

        <button
          type="button"
          onClick={onToggleShuffle}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
            shuffle
              ? "bg-scout-yellow text-scout-black shadow-btn"
              : "bg-white/5 text-scout-mist hover:bg-white/10"
          }`}
        >
          <Shuffle className="h-3.5 w-3.5" />
          <span>Mélange</span>
        </button>
      </div>
    </div>
  );
}
