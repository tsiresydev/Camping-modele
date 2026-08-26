import React from "react";

export interface Person {
  id: string;
  nom: string;
  telephone: string;
  fonction: string;
  avatar: string;
}

export interface Branch {
  id: string;
  nom: string;
  couleur: string;
  members: Person[];
}

export interface OrgData {
  root: { nom: string; avatar: string };
  leaders: Person[];
  branches: Branch[];
}

export type ChefStatus = "loading" | "ready" | "empty" | "error";

const JSON_URL = "/data/chefs.json";

export async function fetchChefs(signal?: AbortSignal): Promise<OrgData> {
  const res = await fetch(JSON_URL, { signal });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as OrgData;
}

export function useChefs() {
  const [status, setStatus] = React.useState<ChefStatus>("loading");
  const [data, setData] = React.useState<OrgData | null>(null);

  const load = React.useCallback(() => {
    setStatus("loading");
    const controller = new AbortController();
    fetchChefs(controller.signal)
      .then((d) => {
        const hasContent =
          (d.leaders?.length ?? 0) > 0 || (d.branches?.length ?? 0) > 0;
        setData(d);
        setStatus(hasContent ? "ready" : "empty");
      })
      .catch(() => setStatus("error"));
    return () => controller.abort();
  }, []);

  React.useEffect(() => load(), [load]);

  return { status, data, retry: load };
}
