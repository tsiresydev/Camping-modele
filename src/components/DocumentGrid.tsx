import type { ScoutDocument } from "../data/documents";
import DocumentCard from "./DocumentCard";
import { LoadingState, EmptyState, ErrorState } from "./States";

export type GridStatus = "loading" | "ready" | "empty" | "error";

interface DocumentGridProps {
  status: GridStatus;
  documents: ScoutDocument[];
  onRetry?: () => void;
}

export default function DocumentGrid({ status, documents, onRetry }: DocumentGridProps) {
  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState onRetry={onRetry} />;
  if (status === "empty" || documents.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc, i) => (
        <DocumentCard key={doc.slug} doc={doc} index={i} />
      ))}
    </div>
  );
}
