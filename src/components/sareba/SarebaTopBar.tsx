import { Link } from "react-router-dom";
import { ArrowDownAZ, ArrowDownZA, ArrowLeft, Search, X } from "lucide-react";
import Emblem from "../Emblem";
import { SORT_LABEL, type SortMode } from "./types";

interface SarebaTopBarProps {
  searchOpen: boolean;
  query: string;
  sortMode: SortMode;
  onToggleSearch: () => void;
  onQueryChange: (value: string) => void;
  onCycleSort: () => void;
}

/** En-tete de l'ecran bibliotheque : marque, titre et actions (maquette ecran 1). */
export default function SarebaTopBar({
  searchOpen,
  query,
  sortMode,
  onToggleSearch,
  onQueryChange,
  onCycleSort,
}: SarebaTopBarProps) {
  return (
    <header className="px-5 pt-5 sm:px-7 sm:pt-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Emblem size={38} className="shrink-0 drop-shadow-[0_4px_10px_rgba(255,225,0,0.35)]" />
          <h1 className="truncate font-display text-[26px] font-extrabold leading-none tracking-tight text-scout-black sm:text-3xl">
            Sareba
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label={searchOpen ? "Fermer la recherche" : "Rechercher"}
            aria-expanded={searchOpen}
            className="grid h-9 w-9 place-items-center rounded-full text-scout-mist transition-colors hover:bg-scout-black/5 hover:text-scout-black"
          >
            {searchOpen ? <X className="h-[17px] w-[17px]" /> : <Search className="h-[17px] w-[17px]" />}
          </button>

          <button
            type="button"
            onClick={onCycleSort}
            aria-label={`Trier : ${SORT_LABEL[sortMode]}`}
            title={`Trier : ${SORT_LABEL[sortMode]}`}
            className="grid h-9 w-9 place-items-center rounded-full text-scout-mist transition-colors hover:bg-scout-black/5 hover:text-scout-black"
          >
            {sortMode === "za" ? (
              <ArrowDownZA className="h-[17px] w-[17px]" />
            ) : (
              <ArrowDownAZ className="h-[17px] w-[17px]" />
            )}
          </button>

          <span className="mx-1 h-6 w-px bg-scout-black/10" aria-hidden />

          <Link
            to="/"
            aria-label="Retour au site"
            title="Retour au site"
            className="grid h-9 w-9 place-items-center rounded-full text-scout-mist transition-colors hover:bg-scout-black/5 hover:text-scout-black"
          >
            <ArrowLeft className="h-[17px] w-[17px]" />
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="relative mt-4 animate-fade-up">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-scout-mist"
            aria-hidden
          />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Rechercher une chanson ou un artiste..."
            aria-label="Rechercher une chanson ou un artiste"
            className="w-full rounded-2xl border border-scout-gray-border bg-scout-gray-light py-3 pl-10 pr-4 text-sm text-scout-black placeholder:text-scout-mist focus:border-scout-yellow focus:outline-none focus:ring-2 focus:ring-scout-yellow/40"
          />
        </div>
      )}
    </header>
  );
}
