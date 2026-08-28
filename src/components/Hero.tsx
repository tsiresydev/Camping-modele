import cover from "../assets/images/backgorund-association.png";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[68vh] items-center overflow-hidden">
      <img
        src={cover}
        alt="Couverture de la 72ème ANDRIAMPIROKANA"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/65 via-black/45 to-black/30"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-scout-yellow/60 bg-scout-yellow/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-scout-yellow">
          Association scoute
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl">
          Votre espace de ressources et de documents scouts
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 drop-shadow-sm sm:text-lg">
          Retrouvez facilement les documents, modèles et ressources utiles à la
          préparation et à l'organisation de vos activités scoutes.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#documents" className="btn-primary w-full sm:w-auto">
            Voir les documents
          </a>
        </div>
      </div>
    </section>
  );
}
