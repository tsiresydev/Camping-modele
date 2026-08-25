export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-scout-gray-border bg-scout-gray-light">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-scout-yellow/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-scout-yellow/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-scout-yellow/60 bg-scout-yellow/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-scout-black">
          Association scoute
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold leading-tight text-scout-black sm:text-4xl md:text-5xl">
          Documents nécessaires pour organiser votre camp scout
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-scout-black/70 sm:text-lg">
          Retrouvez facilement les modèles d'autorisations nécessaires à la
          préparation de vos camps et pré-camps.
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
