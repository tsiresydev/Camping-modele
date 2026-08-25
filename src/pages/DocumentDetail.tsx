import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, HardDrive } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DownloadButton from "../components/DownloadButton";
import { NoMatch } from "../components/States";
import { getDocumentBySlug } from "../data/documents";

export default function DocumentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getDocumentBySlug(slug) : undefined;

  if (!doc) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <NoMatch
              title="Document introuvable"
              message="Le modèle demandé n'existe pas ou a été déplacé."
            />
            <div className="mt-8 text-center">
              <Link to="/" className="btn-ghost">
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-scout-black/70 hover:text-scout-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux documents
          </Link>

          <div className="mt-6 animate-fade-up rounded-2xl border border-scout-gray-border bg-white p-8 shadow-card">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-scout-yellow/15 text-scout-black">
              <FileText className="h-7 w-7" />
            </span>

            <h1 className="mt-5 text-2xl font-bold text-scout-black sm:text-3xl">
              {doc.title}
            </h1>

            <p className="mt-3 text-scout-black/70">{doc.description}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-scout-gray-border pt-6 text-sm">
              <div>
                <dt className="text-scout-black/50">Format</dt>
                <dd className="mt-1 font-semibold text-scout-black">{doc.type}</dd>
              </div>
              <div>
                <dt className="text-scout-black/50">Taille</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-semibold text-scout-black">
                  <HardDrive className="h-4 w-4" />
                  {doc.size ?? "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <DownloadButton
                href={doc.file}
                fileName={doc.title + ".pdf"}
                label="Télécharger le document"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
