import Header from "../components/Header";
import Footer from "../components/Footer";
import OrgChart from "../components/org/OrgChart";
import { LoadingState, EmptyState, ErrorState } from "../components/States";
import { useChefs } from "../data/chefs";

export default function Chefs() {
  const { status, data, retry } = useChefs();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-scout-gray-border bg-scout-gray-light">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-scout-yellow/60 bg-scout-yellow/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-scout-black">
              Organisation
            </span>
            <h1 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold text-scout-black sm:text-4xl">
              Organigramme des chefs
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-scout-black/70">
              Découvrez la structure de la 72ème ANDRIAMPIROKANA : les responsables,
              les branches et leurs membres. Survolez (ou touchez) une personne pour
              voir ses coordonnées.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {status === "loading" && <LoadingState />}
          {status === "error" && <ErrorState onRetry={retry} />}
          {status === "empty" && <EmptyState />}
          {status === "ready" && data && (
            <>
              <OrgChart data={data} />
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                {data.branches.map((branch) => (
                  <span
                    key={branch.id}
                    className="inline-flex items-center gap-2 rounded-full border border-scout-gray-border bg-white px-3 py-1.5 text-xs font-semibold text-scout-black"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: branch.couleur }}
                    />
                    {branch.nom}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
