import { useEffect, useState } from "react";
import {
  fetchDocuments,
  type AppDocument,
} from "../services/driveDocuments";

export type { AppDocument } from "../services/driveDocuments";

export interface DocumentsState {
  documents: AppDocument[];
  loading: boolean;
  error: boolean;
  demo: boolean;
}

export function useDocuments(): DocumentsState {
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchDocuments()
      .then(({ items, demo: isDemo }) => {
        if (cancelled) return;
        setDocuments(items);
        setDemo(isDemo);
        setError(false);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { documents, loading, error, demo };
}
