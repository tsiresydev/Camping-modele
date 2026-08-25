import { useState } from "react";
import { Download, Check, Loader2, AlertTriangle } from "lucide-react";

interface DownloadButtonProps {
  href: string;
  label?: string;
  fileName: string;
  className?: string;
}

type Status = "idle" | "loading" | "done" | "error";

export default function DownloadButton({
  href,
  label = "Télécharger",
  fileName,
  className = "",
}: DownloadButtonProps) {
  const [status, setStatus] = useState<Status>("idle");

  function handleClick() {
    if (status === "loading") return;
    setStatus("loading");
    const encoded = href.replace(/ /g, "%20");
    const link = document.createElement("a");
    link.href = encoded;
    link.download = fileName;
    link.style.display = "none";

    const cleanup = () => {
      window.removeEventListener("blur", onBlur);
      link.remove();
    };
    const onBlur = () => {
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 2000);
      cleanup();
    };

    link.addEventListener("click", () => {
      window.setTimeout(() => {
        if (document.visibilityState === "hidden") return;
      }, 0);
    });

    try {
      document.body.appendChild(link);
      link.click();
      window.addEventListener("blur", onBlur);
      window.setTimeout(() => {
        setStatus((s) => (s === "loading" ? "done" : s));
        window.setTimeout(() => setStatus("idle"), 2000);
        cleanup();
      }, 1500);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2500);
      cleanup();
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
    <button type="button" onClick={handleClick} className={base + " bg-scout-yellow text-scout-black shadow-btn hover:bg-scout-yellow-dark hover:shadow-lg"}>
      <Download className="h-5 w-5" />
      {label}
    </button>
  );
}
