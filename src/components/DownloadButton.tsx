import { useState } from "react";
import { Download, Check, Loader2, AlertTriangle } from "lucide-react";

interface DownloadButtonProps {
  href: string;
  label?: string;
  fileName: string;
  className?: string;
}

type Status = "idle" | "loading" | "done" | "error";

function triggerDownload(href: string, fileName: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function isCrossOrigin(url: string): boolean {
  try {
    return new URL(url, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
}

export default function DownloadButton({
  href,
  label = "Télécharger",
  fileName,
  className = "",
}: DownloadButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    if (status === "loading") return;
    setStatus("loading");

    try {
      const encoded = href.replace(/ /g, "%20");
      if (isCrossOrigin(encoded)) {
        const res = await fetch(encoded);
        if (!res.ok) throw new Error("download failed");
        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        triggerDownload(objUrl, fileName);
        window.setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
      } else {
        triggerDownload(encoded, fileName);
      }
      setStatus("done");
    } catch {
      setStatus("error");
    } finally {
      window.setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scout-black " +
    className;

  if (status === "loading") {
    return (
      <button type="button" className={base + " bg-scout-yellow-dark text-scout-black"} disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
        Téléchargement…
      </button>
    );
  }

  if (status === "done") {
    return (
      <button type="button" className={base + " bg-scout-black text-white"} disabled>
        <Check className="h-5 w-5" />
        Téléchargé
      </button>
    );
  }

  if (status === "error") {
    return (
      <button type="button" onClick={handleClick} className={base + " bg-red-500 text-white"}>
        <AlertTriangle className="h-5 w-5" />
        Réessayer
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={base + " bg-scout-yellow text-scout-black shadow-btn hover:bg-scout-yellow-dark hover:shadow-lg"}
    >
      <Download className="h-5 w-5" />
      {label}
    </button>
  );
}
