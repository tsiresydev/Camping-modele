const env = import.meta.env as unknown as Record<string, string | undefined>;

const API_KEY = env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = env.VITE_GOOGLE_DRIVE_MUSIC_ID;

export interface MusicItem {
  id: string;
  title: string;
  rawName: string;
  audioUrl: string;
  artist?: string;
  cover?: string;
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

/**
 * Separte "Titre - Artiste" dans les noms de fichiers Google Drive.
 * On n'accepte que les separateurs explicites pour ne pas casser les titres
 * contenant un tiret ("Laisse moi t'aimer" reste intact).
 */
const SEPARATORS = /\s*(?:---|\u2014|\u2013|\||\/|\s-\s)\s*/;

export function splitTitleArtist(name: string): { title: string; artist?: string } {
  const cleaned = cleanTitle(name);
  const parts = cleaned.split(SEPARATORS).filter(Boolean);
  if (parts.length < 2) return { title: cleaned };
  return {
    title: parts[0],
    artist: parts[parts.length - 1],
  };
}

/* ==========================================================================
   POCHETTES
   Chaque chanson sans pochette Drive recoit une pochette SVG generee de facon
   deterministe a partir de son nom : meme chanson, meme visuel, sans fichier.
   Palette stricte du projet (noir / jaune scout) pour rester coherent.
   ========================================================================== */

const COVER_DARK = ["#111111", "#1A1A1A", "#22221F"];
const COVER_LIGHT = ["#FFE100", "#E6C700"];

function hashOf(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function coverFor(seed: string): string {
  const h = hashOf(seed);
  const from = COVER_DARK[h % COVER_DARK.length];
  const to = COVER_LIGHT[(h >> 3) % COVER_LIGHT.length];
  const cx = 120 + (h % 360);
  const cy = 110 + ((h >> 5) % 380);
  const r1 = 90 + ((h >> 7) % 70);
  const r2 = 110 + ((h >> 11) % 90);

  const bars = [0, 1, 2, 3]
    .map((i) => {
      const x = 150 + i * 62;
      const height = 60 + (((h >> (i * 3)) % 5) * 30);
      const y = 450 - height;
      const opacity = i % 2 === 0 ? 0.85 : 1;
      return `<rect x="${x}" y="${y}" width="30" height="${height}" rx="15" opacity="${opacity}"/>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${from}"/>` +
    `<stop offset="1" stop-color="${to}"/>` +
    `</linearGradient></defs>` +
    `<rect width="600" height="600" fill="url(#g)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r1}" fill="#FFFFFF" opacity=".12"/>` +
    `<circle cx="${600 - cx}" cy="${600 - cy}" r="${r2}" fill="#111111" opacity=".22"/>` +
    `<g fill="#FFFFFF">${bars}</g>` +
    `<circle cx="146" cy="146" r="42" fill="#FFE100"/>` +
    `<path d="M146 194 L196 166 L196 222 Z" fill="#FFE100"/>` +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function coverOf(item: MusicItem): string {
  return item.cover ?? coverFor(item.rawName || item.id);
}

export function displayArtist(item: MusicItem): string {
  return item.artist?.trim() || "72ème ANDRIAMPIROKANA";
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

  const items = audios.map<MusicItem>((a) => {
    const { title, artist } = splitTitleArtist(a.name);
    return {
      id: a.id,
      rawName: a.name,
      title,
      artist,
      cover: coverFor(a.id),
      audioUrl: `https://www.googleapis.com/drive/v3/files/${a.id}?alt=media&key=${encodeURIComponent(
        API_KEY as string,
      )}`,
      lyricsId: textByBase.get(baseName(a.name)),
    };
  });

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
    title: "Chant des scouts",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-1"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics:
      "Chant des scouts\n\nEn avant marche, porte ton drapeau,\nChante la joie du grand rendez-vous.\nSous les étoiles, près du feu de camp,\nLe scout avance, droit et content.",
  },
  {
    id: "demo-2",
    rawName: "02 - Hymne_scout.mp3",
    title: "Hymne scout",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-2"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics:
      "Hymne scout\n\nFiers et unis, voici nos couleurs,\nJaune et noir, couleurs de coeur.\nPar monts et vaux, nous suivons la voie,\nDe la nature, simples témoins.",
  },
  {
    id: "demo-3",
    rawName: "03 - Notre_chanson.mp3",
    title: "Notre chanson",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-3"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    lyrics:
      "Notre chanson\n\nDu lever du jour jusqu'au soir,\nNous chantez ensemble pour grandir,\nLa promesse devant l'horizon,\nC'est notre force, c'est notre honneur.",
  },
  {
    id: "demo-4",
    rawName: "04 - Feux_de_camp.mp3",
    title: "Feux de camp",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-4"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "demo-5",
    rawName: "05 - L_amitie.mp3",
    title: "L'amitié",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-5"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "demo-6",
    rawName: "06 - La_legende_du_scout.mp3",
    title: "La légende du scout",
    artist: "72ème ANDRIAMPIROKANA",
    cover: coverFor("demo-6"),
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];
