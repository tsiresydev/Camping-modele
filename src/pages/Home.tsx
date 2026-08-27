import Header from "../components/Header";
import Hero from "../components/Hero";
import DocumentsExplorer from "../components/documents/DocumentsExplorer";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <section id="documents" className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-scout-black sm:text-3xl">
              Documents &amp; ressources
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-scout-black/70">
              Recherchez, sélectionnez et téléchargez les documents et ressources
              utiles à vos activités scoutes.
            </p>
          </div>

          <DocumentsExplorer />
        </section>
      </main>
      <Footer />
    </div>
  );
}
