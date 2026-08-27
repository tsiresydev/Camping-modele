const env = import.meta.env as unknown as Record<string, string | undefined>;

const API_KEY = env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = env.VITE_GOOGLE_DRIVE_FOLDER_ID;

export interface MusicItem {
  id: string;
  title: string;
  rawName: string;
  audioUrl: string;
  lyricsId?: string;
  lyrics?: string;
}

export function isDriveConfigured(): boolean {
  return Boolean(API_KEY && FOLDER_ID);
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

function baseName(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(0, dot) : name;
}

export function cleanTitle(name: string): string {
  const base = baseName(name);
  const noTrack = base.replace(/^\d+[\s.\-_]+/, "");
  return noTrack.replace(/_/g, " ").trim();
}

export async function fetchMusics(): Promise<{ items: MusicItem[]; demo: boolean }> {
  if (!isDriveConfigured()) {
    return { items: SAMPLE_MUSICS, demo: true };
  }

  const q = `'${FOLDER_ID}' in parents and trashed = false and (mimeType contains 'audio/' or mimeType = 'text/plain')`;
  const url =
    `https://www.googleapis.com/drive/v3/files` +
    `?key=${encodeURIComponent(API_KEY as string)}` +
    `&fields=${encodeURIComponent("files(id,name,mimeType)")}` +
    `&q=${encodeURIComponent(q)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Drive ${res.status}`);
  const data = (await res.json()) as { files?: DriveFile[] };
  const files = data.files ?? [];

  const audios = files.filter((f) => f.mimeType.startsWith("audio/"));
  const textByBase = new Map<string, string>();
  files
    .filter((f) => f.mimeType === "text/plain")
    .forEach((t) => textByBase.set(baseName(t.name), t.id));

  const items = audios.map<MusicItem>((a) => ({
    id: a.id,
    rawName: a.name,
    title: cleanTitle(a.name),
    audioUrl: `https://www.googleapis.com/drive/v3/files/${a.id}?alt=media&key=${encodeURIComponent(
      API_KEY as string,
    )}`,
    lyricsId: textByBase.get(baseName(a.name)),
  }));

  return { items, demo: false };
}

export async function fetchLyrics(lyricsId: string): Promise<string> {
  if (!API_KEY) throw new Error("no-key");
  const url = `https://www.googleapis.com/drive/v3/files/${lyricsId}?alt=media&key=${encodeURIComponent(
    API_KEY,
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`lyrics ${res.status}`);
  return await res.text();
}

const SAMPLE_MUSICS: MusicItem[] = [
  {
    id: "demo-1",
    rawName: "01 - Chant_des_scouts.mp3",
    title: cleanTitle("01 - Chant_des_scouts.mp3"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics:
      "Chant des scouts\n\nEn avant marche, porte ton drapeau,\nChante la joie du grand rendez-vous.\nSous les étoiles, près du feu de camp,\nLe scout avance, droit et content.",
  },
  {
    id: "demo-2",
    rawName: "02 - Hymne_scout.mp3",
    title: cleanTitle("02 - Hymne_scout.mp3"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics:
      "Hymne scout\n\nFiers et unis, voici nos couleurs,\nJaune et noir, couleurs de coeur.\nPar monts et vaux, nous suivons la voie,\nDe la nature, simples témoins.",
  },
  {
    id: "demo-3",
    rawName: "03 - Notre_chanson.mp3",
    title: cleanTitle("03 - Notre_chanson.mp3"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];
