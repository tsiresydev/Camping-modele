import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Mic2 } from "lucide-react";

interface LyricsModalProps {
  title: string;
  artist?: string;
  loading: boolean;
  error: boolean;
  text: string | null;
  onClose: () => void;
}

export default function LyricsModal({
  title,
  artist,
  loading,
  error,
  text,
  onClose,
}: LyricsModalProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-scout-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Paroles de ${title}`}
        className="flex max-h-[80vh] w-full max-w-md animate-screen-in flex-col overflow-hidden rounded-3xl bg-scout-black text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-scout-yellow text-scout-black">
              <Mic2 className="h-4 w-4" />
            </span>
            <span className="font-display text-sm font-bold">Paroles</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="scroll-none overflow-y-auto px-5 py-5">
          <p className="font-display text-lg font-extrabold leading-tight text-scout-yellow">
            {title}
          </p>
          {artist && <p className="mt-1 text-xs text-scout-mist">{artist}</p>}

          <div className="mt-5">
            {loading ? (
              <p className="flex items-center gap-2.5 text-sm text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement des paroles…
              </p>
            ) : error ? (
              <p className="text-sm text-scout-red">
                Impossible de charger les paroles pour le moment.
              </p>
            ) : text === null ? (
              <p className="text-sm text-white/55">Paroles non disponibles.</p>
            ) : (
              <p className="whitespace-pre-line text-sm leading-relaxed text-white/85">{text}</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
