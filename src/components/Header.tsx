import { Link, NavLink } from "react-router-dom";
import { Users } from "lucide-react";
import Emblem from "./Emblem";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-scout-gray-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Emblem size={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold text-scout-black sm:text-base">
              72ème ANDRIAMPIROKANA
            </span>
            <span className="text-xs text-scout-black/60">
              Modèles de documents
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-scout-black/80">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden hover:text-scout-black sm:inline ${
                isActive ? "text-scout-black" : ""
              }`
            }
          >
            Documents
          </NavLink>
          <NavLink
            to="/chefs"
            className={({ isActive }) =>
              `hidden items-center gap-1.5 hover:text-scout-black sm:inline-flex ${
                isActive ? "text-scout-black" : ""
              }`
            }
          >
            <Users className="h-4 w-4" />
            Chefs
          </NavLink>
          <a href="/#documents" className="btn-primary px-4 py-2 text-sm">
            Télécharger
          </a>
        </nav>
      </div>
    </header>
  );
}
