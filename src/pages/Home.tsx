import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import DocumentGrid, { type GridStatus } from "../components/DocumentGrid";
import Footer from "../components/Footer";
import { documents } from "../data/documents";

export default function Home() {
  const [status, setStatus] = useState<GridStatus>("loading");

  useEffect(() => {
    const t = window.setTimeout(() => {
      setStatus(documents.length > 0 ? "ready" : "empty");
    }, 500);
    return () => window.clearTimeout(t);
  }, []);

  function handleRetry() {
    setStatus("loading");
    window.setTimeout(() => setStatus(documents.length > 0 ? "ready" : "empty"), 500);
  }

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
              Sélectionnez un document puis téléchargez-le en un seul clic.
            </p>
          </div>

          <DocumentGrid status={status} documents={documents} onRetry={handleRetry} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
