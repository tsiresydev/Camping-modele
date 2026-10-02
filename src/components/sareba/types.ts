import type { MusicItem } from "../../services/driveMusic";

export type SortMode = "az" | "za";
export type RepeatMode = "off" | "all" | "one";

export const SORT_LABEL: Record<SortMode, string> = {
  az: "A → Z",
  za: "Z → A",
};

export const REPEAT_LABEL: Record<RepeatMode, string> = {
  off: "désactivée",
  all: "sur toute la file",
  one: "sur cette chanson",
};

export const REPEAT_CYCLE: RepeatMode[] = ["off", "all", "one"];

function collator(): Intl.Collator {
  return new Intl.Collator("fr", { sensitivity: "base", numeric: true });
}

export function sortMusics(musics: MusicItem[], mode: SortMode): MusicItem[] {
  const cmp = collator();
  const sorted = [...musics].sort((a, b) =>
    cmp.compare(a.title.trim(), b.title.trim()),
  );
  return mode === "za" ? sorted.reverse() : sorted;
}

/** Melange deterministe (Fisher-Yates avec graine), pour ne pas reshuffler a chaque rendu. */
export function shuffleList<T>(list: T[], seed: number): T[] {
  const out = [...list];
  let state = seed || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
