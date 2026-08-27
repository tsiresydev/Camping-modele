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
              Modèles de documents
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-scout-black/70">
              Recherchez et téléchargez les modèles nécessaires à la préparation de
              vos camps et pré-camps.
            </p>
          </div>

          <DocumentsExplorer />
        </section>
      </main>
      <Footer />
    </div>
  );
}
