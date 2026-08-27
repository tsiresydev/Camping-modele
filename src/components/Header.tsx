import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Users, Menu, X, FileText, Music } from "lucide-react";
import Emblem from "./Emblem";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-scout-gray-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <Emblem size={40} />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold text-scout-black sm:text-base">
              72ème ANDRIAMPIROKANA
            </span>
            <span className="text-xs text-scout-black/60">
              Ressources &amp; documents scouts
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-scout-black/80 sm:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-1.5 hover:text-scout-black ${
                isActive ? "text-scout-black" : ""
              }`
            }
          >
            <FileText className="h-4 w-4" />
            Documents
          </NavLink>
          <NavLink
            to="/chefs"
            className={({ isActive }) =>
              `flex items-center gap-1.5 hover:text-scout-black ${
                isActive ? "text-scout-black" : ""
              }`
            }
          >
            <Users className="h-4 w-4" />
            Chefs
          </NavLink>
          <NavLink
            to="/sareba"
            className={({ isActive }) =>
              `flex items-center gap-1.5 hover:text-scout-black ${
                isActive ? "text-scout-black" : ""
              }`
            }
          >
            <Music className="h-4 w-4" />
            Sareba
          </NavLink>
        </nav>

        <div className="sm:hidden">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="rounded-xl border border-scout-gray-border p-2 text-scout-black transition-colors hover:bg-scout-gray-light"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-scout-gray-border bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-scout-gray-light ${
                  isActive
                    ? "bg-scout-gray-light text-scout-black"
                    : "text-scout-black/80"
                }`
              }
            >
              <FileText className="h-4 w-4" />
              Documents
            </NavLink>
            <NavLink
              to="/chefs"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-scout-gray-light ${
                  isActive
                    ? "bg-scout-gray-light text-scout-black"
                    : "text-scout-black/80"
                }`
              }
            >
              <Users className="h-4 w-4" />
              Chefs
            </NavLink>
            <NavLink
              to="/sareba"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-scout-gray-light ${
                  isActive
                    ? "bg-scout-gray-light text-scout-black"
                    : "text-scout-black/80"
                }`
              }
            >
              <Music className="h-4 w-4" />
              Saréba
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  );
}
