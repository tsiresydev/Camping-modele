import { useMemo, useState } from "react";
import { Search, FileSearch } from "lucide-react";
import { useDocuments } from "../../data/documents";
import DocumentCard from "./DocumentCard";
import { EmptyState } from "../States";

export default function DocumentsExplorer() {
  const { documents, loading } = useDocuments();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (d) =>
        d.name.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q),
    );
  }, [documents, query]);

  if (loading) {
    return (
      <div>
        <div className="mb-8 h-12 max-w-md animate-pulse rounded-xl bg-scout-gray-light" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl border border-scout-gray-border bg-scout-gray-light"
            />
          ))}
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="relative mb-8 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-scout-black/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un document..."
          aria-label="Rechercher un document"
          className="w-full rounded-xl border border-scout-gray-border bg-white py-3 pl-10 pr-4 text-sm text-scout-black placeholder:text-scout-black/40 focus:outline-none focus:ring-2 focus:ring-scout-black/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-scout-gray-border bg-scout-gray-light py-16 text-center text-scout-black/70">
          <FileSearch className="h-8 w-8 text-scout-yellow-dark" />
          <p className="font-medium">Aucun document trouvé pour :</p>
          <p className="text-scout-black">« {query} »</p>
          <button onClick={() => setQuery("")} className="btn-ghost mt-2">
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
