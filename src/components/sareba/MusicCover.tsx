import { coverOf, type MusicItem } from "../../services/driveMusic";

interface MusicCoverProps {
  music: MusicItem;
  className?: string;
  rounded?: string;
  alt?: string;
}

/**
 * Pochette d'une chanson. Utilise la pochette Drive si elle existe,
 * sinon le visuel genere de facon deterministe par `coverFor`.
 */
export default function MusicCover({
  music,
  className = "",
  rounded = "rounded-2xl",
  alt = "",
}: MusicCoverProps) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-scout-charcoal shadow-lift ${rounded} ${className}`}
    >
      <img
        src={coverOf(music)}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
