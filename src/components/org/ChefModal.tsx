import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Phone, X } from "lucide-react";
import Avatar from "./Avatar";
import type { ChefInfo } from "./ChefTooltip";

interface ChefModalProps {
  info: ChefInfo;
  onClose: () => void;
}

export default function ChefModal({ info, onClose }: ChefModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-end justify-center bg-scout-black/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-fade-up rounded-2xl border border-scout-gray-border bg-white p-6 text-center shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-1 text-scout-black/40 transition-colors hover:bg-scout-gray-light hover:text-scout-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <Avatar src={info.avatar} nom={info.nom} size={88} ringClass="ring-2 ring-offset-2" />
          <p className="mt-3 text-lg font-bold text-scout-black">{info.nom}</p>
          <span
            className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
            style={{ backgroundColor: info.branchColor, color: "#111111" }}
          >
            {info.fonction}
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-wide text-scout-black/50">
            {info.branchName}
          </span>
          <a
            href={`tel:${info.telephone.replace(/\s+/g, "")}`}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-scout-yellow px-4 py-2 text-sm font-semibold text-scout-black shadow-btn transition-colors hover:bg-scout-yellow-dark"
          >
            <Phone className="h-4 w-4" />
            {info.telephone}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
