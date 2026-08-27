import { useEffect, useMemo, useRef, useState } from "react";
import { Search, FileSearch, Download, Loader2, AlertTriangle } from "lucide-react";
import JSZip from "jszip";
import { useDocuments } from "../../data/documents";
import DocumentRow from "./DocumentRow";
import { EmptyState } from "../States";

export default function DocumentsExplorer() {
  const { documents, loading } = useDocuments();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter(
      (d) => d.name.toLowerCase().includes(q) || d.fileName.toLowerCase().includes(q),
    );
  }, [documents, query]);

  const selectedCount = selected.size;
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((d) => selected.has(d.id));

  useEffect(() => {
    if (selectAllRef.current) {
      const some = filtered.some((d) => selected.has(d.id));
      selectAllRef.current.indeterminate = some && !allFilteredSelected;
    }
  }, [filtered, selected, allFilteredSelected]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filtered.forEach((d) => next.delete(d.id));
      } else {
        filtered.forEach((d) => next.add(d.id));
      }
      return next;
    });
  }

  async function downloadSelected() {
    if (selectedCount === 0 || zipping) return;
    setZipping(true);
    setZipError(false);
    try {
      const chosen = documents.filter((d) => selected.has(d.id));
      const zip = new JSZip();
      const usedNames = new Set<string>();
      await Promise.all(
        chosen.map(async (d) => {
          const res = await fetch(d.url);
          const blob = await res.blob();
          let name = d.fileName.trim() || `${d.id}.${d.ext}`;
          if (usedNames.has(name.toLowerCase())) {
            const dot = name.lastIndexOf(".");
            const base = dot >= 0 ? name.slice(0, dot) : name;
            const ext = dot >= 0 ? name.slice(dot) : "";
            let n = 2;
            while (usedNames.has(`${base}-${n}${ext}`.toLowerCase())) n++;
            name = `${base}-${n}${ext}`;
          }
          usedNames.add(name.toLowerCase());
          zip.file(name, blob);
        }),
      );
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documents-scout.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setZipError(true);
    } finally {
      setZipping(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8 h-12 max-w-md animate-pulse rounded-xl bg-scout-gray-light" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl border border-scout-gray-border bg-scout-gray-light"
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
      <div className="relative mb-6 max-w-md">
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

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-scout-gray-border bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-scout-black">
          <input
            ref={selectAllRef}
            type="checkbox"
            checked={allFilteredSelected}
            onChange={toggleAll}
            className="h-5 w-5 cursor-pointer accent-scout-black"
          />
          Tout sélectionner
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {selectedCount > 0 && (
            <span className="text-sm font-medium text-scout-black/70">
              {selectedCount} document{selectedCount > 1 ? "s" : ""} sélectionné
              {selectedCount > 1 ? "s" : ""}
            </span>
          )}
          <button
            type="button"
            onClick={downloadSelected}
            disabled={selectedCount === 0 || zipping}
            className="btn-primary px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {zipping ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération du ZIP…
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger les documents sélectionnés
              </>
            )}
          </button>
        </div>
      </div>

      {zipError && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          La génération du ZIP a échoué. Veuillez réessayer.
        </div>
      )}

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
        <div className="flex flex-col gap-3">
          {filtered.map((doc) => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              checked={selected.has(doc.id)}
              onToggle={() => toggle(doc.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
