import { useState } from "react";

function getInitials(nom: string): string {
  const parts = nom.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  src: string;
  nom: string;
  size?: number;
  ringClass?: string;
}

export default function Avatar({ src, nom, size = 56, ringClass = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src.trim() !== "" && !failed;
  const dimension = { width: size, height: size };

  if (showImage) {
    return (
      <img
        src={src}
        alt={nom}
        style={dimension}
        onError={() => setFailed(true)}
        className={`rounded-full object-cover ${ringClass}`}
      />
    );
  }

  return (
    <span
      style={dimension}
      className={`flex items-center justify-center rounded-full bg-scout-black/5 font-display text-base font-bold text-scout-black/70 ${ringClass}`}
      aria-label={nom}
    >
      {getInitials(nom)}
    </span>
  );
}
