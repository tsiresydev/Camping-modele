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

interface DocumentRowProps {
  doc: AppDocument;
  checked: boolean;
  onToggle: () => void;
}

export default function DocumentRow({ doc, checked, onToggle }: DocumentRowProps) {
  const Icon = iconFor(doc.ext);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-scout-gray-border bg-white p-4 shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        aria-label={`Sélectionner ${doc.name}`}
        className="h-5 w-5 shrink-0 cursor-pointer accent-scout-black"
      />

      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-scout-yellow/15 text-scout-black">
        <Icon className="h-6 w-6" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-scout-black">{doc.name}</p>
        <span className="text-xs font-semibold uppercase tracking-wide text-scout-black/50">
          {doc.type}
        </span>
      </div>

      <DownloadButton
        href={doc.url}
        fileName={doc.fileName}
        label="Télécharger"
        className="w-full sm:w-auto"
      />
    </div>
  );
}
