import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react";
import { registerSW } from "virtual:pwa-register";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function usePWA() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };
    const onInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const updateSWRef = useRef<(reload?: boolean) => void>(() => {});

  useEffect(() => {
    updateSWRef.current = registerSW({
      onNeedRefresh() {
        setShowUpdateAvailable(true);
      },
      onOfflineReady() {
        console.log("PWA prête pour le mode hors ligne");
      },
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  const handleUpdateClick = () => {
    setShowUpdateAvailable(false);
    updateSWRef.current(true);
    setTimeout(() => window.location.reload(), 400);
  };

  return {
    isOnline,
    showInstallPrompt,
    setShowInstallPrompt,
    showUpdateAvailable,
    setShowUpdateAvailable,
    handleInstallClick,
    handleUpdateClick,
  };
}

export default function PWAProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isOnline,
    showInstallPrompt,
    setShowInstallPrompt,
    showUpdateAvailable,
    setShowUpdateAvailable,
    handleInstallClick,
    handleUpdateClick,
  } = usePWA();

  const onlineClasses = "bg-scout-yellow text-scout-black";
  const offlineClasses = "bg-scout-gray-light text-scout-black/70";

  return (
    <>
      <div
        className={`fixed left-1/2 top-[4.5rem] z-40 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 text-sm font-medium shadow-lg ${isOnline ? onlineClasses : offlineClasses}`}
      >
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${isOnline ? "bg-scout-black" : "bg-red-500"}`}
          aria-hidden
        />
        {isOnline ? (
          <>
            <span>En ligne</span>
            <button
              onClick={() => setShowInstallPrompt(true)}
              className="font-semibold text-scout-black/80 underline-offset-2 hover:underline"
            >
              Installer
            </button>
          </>
        ) : (
          <span>Hors ligne — certaines fonctionnalités nécessitent Internet</span>
        )}
      </div>

      {showInstallPrompt && (
        <div className="fixed left-1/2 top-32 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-scout-yellow/30 bg-white px-6 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-scout-yellow/10 p-2">
              <Music className="h-5 w-5 text-scout-yellow" />
            </div>
            <div>
              <p className="font-semibold text-scout-black">
                Installer l'application
              </p>
              <p className="text-sm text-scout-black/60">
                L'application sera disponible sur votre écran d'accueil
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleInstallClick}
              className="rounded-xl border border-scout-black bg-white px-4 py-2 text-sm font-semibold text-scout-black transition hover:bg-scout-gray-light"
            >
              Oui, installer
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="rounded-xl border border-scout-gray-border px-4 py-2 text-sm text-scout-black/60 transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {showUpdateAvailable && (
        <div className="fixed left-1/2 top-32 z-50 mx-auto w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-scout-yellow/30 bg-white px-6 py-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-scout-yellow/10 p-2">
              <Music className="h-5 w-5 text-scout-yellow" />
            </div>
            <div>
              <p className="font-semibold text-scout-black">
                Nouvelle version disponible
              </p>
              <p className="text-sm text-scout-black/60">
                Une mise à jour vient d'être déployée
              </p>
            </div>
          </div>
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleUpdateClick}
              className="rounded-xl border border-scout-black bg-white px-4 py-2 text-sm font-semibold text-scout-black transition hover:bg-scout-gray-light"
            >
              Mettre à jour
            </button>
            <button
              onClick={() => setShowUpdateAvailable(false)}
              className="rounded-xl border border-scout-gray-border px-4 py-2 text-sm text-scout-black/60 transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
