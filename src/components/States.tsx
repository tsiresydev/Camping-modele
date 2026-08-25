import { FileText, Loader2, Inbox, AlertTriangle } from "lucide-react";

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-scout-gray-border bg-scout-gray-light py-16 text-scout-black/70">
      <Loader2 className="h-8 w-8 animate-spin text-scout-yellow-dark" />
      <p className="font-medium">Chargement des documents…</p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-scout-gray-border bg-scout-gray-light py-16 text-center text-scout-black/70">
      <Inbox className="h-8 w-8 text-scout-yellow-dark" />
      <p className="font-medium">Aucun document disponible pour le moment.</p>
      <p className="text-sm text-scout-black/50">
        Revenez bientôt pour consulter les modèles de l'association.
      </p>
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 py-16 text-center text-red-700">
      <AlertTriangle className="h-8 w-8" />
      <p className="font-medium">Impossible de charger les documents.</p>
      <p className="text-sm text-red-600/80">
        Une erreur est survenue. Veuillez réessayer.
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost mt-2">
          Réessayer
        </button>
      )}
    </div>
  );
}

export function NoMatch({ icon, title, message }: { icon?: React.ReactNode; title: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-scout-gray-border bg-scout-gray-light py-16 text-center text-scout-black/70">
      {icon ?? <FileText className="h-8 w-8 text-scout-yellow-dark" />}
      <p className="text-lg font-semibold text-scout-black">{title}</p>
      <p className="text-sm text-scout-black/50">{message}</p>
    </div>
  );
}
