import Emblem from "./Emblem";

export default function Footer() {
  return (
    <footer className="border-t border-scout-gray-border bg-scout-black text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
        <Emblem size={36} />
        <p className="font-display text-sm font-bold">
          72ème ANDRIAMPIROKANA
        </p>
        <p className="max-w-md text-xs text-white/60">
          Plateforme officielle des modèles de documents pour l'organisation
          des camps et pré-camps scouts.
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} 72ème ANDRIAMPIROKANA. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
