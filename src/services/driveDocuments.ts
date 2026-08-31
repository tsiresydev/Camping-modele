const env = import.meta.env as unknown as Record<string, string | undefined>;

const API_KEY = env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = env.VITE_GOOGLE_DRIVE_DOCUMENTS_FOLDER_ID;

export interface AppDocument {
  id: string;
  name: string;
  fileName: string;
  url: string;
  ext: string;
  type: string;
  size?: number;
  modifiedTime?: string;
}

export function isDriveConfigured(): boolean {
  return Boolean(API_KEY && FOLDER_ID);
}

function extOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function buildUrl(id: string): string {
  return `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${encodeURIComponent(
    API_KEY as string,
  )}`;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

function toAppDocument(f: DriveFile): AppDocument {
  const ext = extOf(f.name);
  return {
    id: f.id,
    name: f.name,
    fileName: f.name,
    url: buildUrl(f.id),
    ext,
    type: ext.toUpperCase() || "FILE",
    size: f.size ? Number(f.size) : undefined,
    modifiedTime: f.modifiedTime,
  };
}

export async function fetchDocuments(): Promise<{ items: AppDocument[]; demo: boolean }> {
  if (!isDriveConfigured()) {
    return { items: [], demo: true };
  }

  const q =
    `'${FOLDER_ID}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
  const fields = "nextPageToken,files(id,name,mimeType,size,modifiedTime)";

  const items: AppDocument[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      key: API_KEY as string,
      fields,
      q,
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
    if (!res.ok) throw new Error(`Drive ${res.status}`);
    const data = (await res.json()) as {
      files?: DriveFile[];
      nextPageToken?: string;
    };

    for (const f of data.files ?? []) items.push(toAppDocument(f));
    pageToken = data.nextPageToken;
  } while (pageToken);

  items.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  return { items, demo: false };
}

export async function fetchDocumentById(id: string): Promise<AppDocument | undefined> {
  if (!isDriveConfigured() || !API_KEY) return undefined;

  const params = new URLSearchParams({
    key: API_KEY,
    fields: "id,name,mimeType,size,modifiedTime",
  });
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?${params.toString()}`);
  if (!res.ok) return undefined;
  const f = (await res.json()) as DriveFile;
  return toAppDocument(f);
}
