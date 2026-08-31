import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DownloadButton from "../components/DownloadButton";
import { NoMatch } from "../components/States";
import { fetchDocumentById, type AppDocument } from "../services/driveDocuments";

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<AppDocument | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    setDoc(undefined);
    if (!id) {
      setDoc(null);
      return;
    }
    fetchDocumentById(id)
      .then((d) => {
        if (!cancelled) setDoc(d ?? null);
      })
      .catch(() => {
        if (!cancelled) setDoc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (doc === undefined) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto flex max-w-3xl items-center justify-center px-4 py-24 text-scout-black/60">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (doc === null) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <NoMatch
              title="Document introuvable"
              message="Le document demandé n'existe pas ou a été supprimé."
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
              {doc.name}
            </h1>

            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-scout-gray-border pt-6 text-sm">
              <div>
                <dt className="text-scout-black/50">Format</dt>
                <dd className="mt-1 font-semibold text-scout-black">{doc.type}</dd>
              </div>
              <div>
                <dt className="text-scout-black/50">Fichier</dt>
                <dd className="mt-1 break-all font-semibold text-scout-black">
                  {doc.fileName}
                </dd>
              </div>
            </dl>

            <div className="mt-8">
              <DownloadButton
                href={doc.url}
                fileName={doc.fileName}
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
