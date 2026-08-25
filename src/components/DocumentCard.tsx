import { Link } from "react-router-dom";
import { FileText, Download } from "lucide-react";
import type { ScoutDocument } from "../data/documents";
import DownloadButton from "./DownloadButton";

interface DocumentCardProps {
  doc: ScoutDocument;
  index?: number;
}

export default function DocumentCard({ doc, index = 0 }: DocumentCardProps) {
  return (
    <article
      className="group flex h-full animate-fade-up flex-col rounded-2xl border border-scout-gray-border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-scout-yellow/15 text-scout-black">
          <FileText className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-scout-gray-border bg-scout-gray-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-scout-black/70">
          {doc.type}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-bold leading-snug text-scout-black">
        {doc.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-scout-black/70">
        {doc.description}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <DownloadButton
          href={doc.file}
          fileName={doc.title + ".pdf"}
          className="w-full sm:flex-1"
        />
        <Link
          to={`/document/${doc.slug}`}
          className="btn-ghost w-full sm:w-auto"
          aria-label={`Voir le détail de ${doc.title}`}
        >
          Détails
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-scout-black/50">
        <Download className="h-3.5 w-3.5" />
        {doc.size ?? "—"}
      </div>
    </article>
  );
}
