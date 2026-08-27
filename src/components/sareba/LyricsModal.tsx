import { createPortal } from "react-dom";
import { X, Loader2, AlertTriangle, Mic2 } from "lucide-react";

interface LyricsModalProps {
  title: string;
  loading: boolean;
  error: boolean;
  text: string | null;
  onClose: () => void;
}

export default function LyricsModal({ title, loading, error, text, onClose }: LyricsModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-scout-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md animate-fade-up flex-col rounded-2xl border border-scout-gray-border bg-white shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-scout-gray-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Mic2 className="h-5 w-5 text-scout-black/70" />
            <span className="font-display text-sm font-bold text-scout-black">Paroles</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1 text-scout-black/40 transition-colors hover:bg-scout-gray-light hover:text-scout-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5">
          <p className="mb-4 text-sm font-semibold text-scout-black/70">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2 text-scout-black/60">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement des paroles…
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Impossible de charger les paroles.
            </div>
          ) : text === null ? (
            <p className="text-scout-black/60">Paroles non disponibles.</p>
          ) : (
            <p className="whitespace-pre-line text-sm leading-relaxed text-scout-black/80">{text}</p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
