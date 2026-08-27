import { useEffect, useState } from "react";

export interface AppDocument {
  id: string;
  name: string;
  fileName: string;
  url: string;
  ext: string;
  type: string;
}

const rawFiles = import.meta.glob("/src/assets/documents/*", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const TITLE_OVERRIDES: Record<string, string> = {
  "FAHAZAHON-DALANA HANAO PRE-CAMP.pdf": "Autorisation de faire un pré-camp",
  "FAHAZAHON-DALANA HILASY.pdf": "Autorisation de camper",
  "FANOMEZAN-DALANA-TOMPON-TOERANA-PRE-CAMPS.pdf":
    "Autorisation du propriétaire du terrain",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildDocuments(): AppDocument[] {
  return Object.entries(rawFiles)
    .map(([path, url]) => {
      const fileName = path.split("/").pop() ?? path;
      const ext = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase() : "";
      const base = fileName.replace(/\.[^.]+$/, "");
      return {
        id: slugify(base),
        name: TITLE_OVERRIDES[fileName] ?? base,
        fileName,
        url,
        ext,
        type: ext.toUpperCase(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

export const documents: AppDocument[] = buildDocuments();

export function getDocumentBySlug(id: string): AppDocument | undefined {
  return documents.find((d) => d.id === id);
}

export function useDocuments() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(t);
  }, []);
  return { documents, loading };
}
