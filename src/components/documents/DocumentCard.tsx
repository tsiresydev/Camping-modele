import { FileText, FileSpreadsheet, FileImage, FileType2 } from "lucide-react";
import type { AppDocument } from "../../data/documents";
import DownloadButton from "../DownloadButton";

function iconFor(ext: string) {
  switch (ext) {
    case "xls":
    case "xlsx":
    case "csv":
      return FileSpreadsheet;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
      return FileImage;
    case "doc":
    case "docx":
      return FileType2;
    default:
      return FileText;
  }
}

export default function DocumentCard({ doc }: { doc: AppDocument }) {
  const Icon = iconFor(doc.ext);
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-scout-gray-border bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover">
      <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-scout-yellow/15 text-scout-black">
        <Icon className="h-7 w-7" />
      </span>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-snug text-scout-black">
        {doc.name}
      </h3>
      <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-scout-black/50">
        {doc.type}
      </span>

      <div className="mt-5">
        <DownloadButton
          href={doc.url}
          fileName={doc.fileName}
          label="Télécharger"
          className="w-full"
        />
      </div>
    </article>
  );
}
