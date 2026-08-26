import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Phone } from "lucide-react";
import Avatar from "./Avatar";

export interface ChefInfo {
  id: string;
  nom: string;
  fonction: string;
  telephone: string;
  avatar: string;
  branchColor: string;
  branchName: string;
}

interface ChefTooltipProps {
  info: ChefInfo;
  x: number;
  y: number;
}

const OFFSET = 16;
const WIDTH = 224;

export default function ChefTooltip({ info, x, y }: ChefTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x + OFFSET, top: y + OFFSET });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let left = x + OFFSET;
    let top = y + OFFSET;
    if (left + rect.width > window.innerWidth - 8) {
      left = x - rect.width - OFFSET;
    }
    if (top + rect.height > window.innerHeight - 8) {
      top = window.innerHeight - rect.height - 8;
    }
    if (top < 8) top = 8;
    if (left < 8) left = 8;
    setPos({ left, top });
  }, [x, y]);

  return createPortal(
    <div
      ref={ref}
      style={{ left: pos.left, top: pos.top, width: WIDTH }}
      className="pointer-events-none fixed z-[1000] rounded-2xl border border-scout-gray-border bg-white p-4 text-center shadow-card-hover animate-fade-up"
      role="tooltip"
    >
      <Avatar src={info.avatar} nom={info.nom} size={64} ringClass="ring-2 ring-offset-2" />
      <p className="mt-2 text-sm font-bold text-scout-black">{info.nom}</p>
      <span
        className="mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold"
        style={{ backgroundColor: info.branchColor, color: "#111111" }}
      >
        {info.fonction}
      </span>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-scout-black/70">
        <Phone className="h-3.5 w-3.5" />
        {info.telephone}
      </p>
    </div>,
    document.body,
  );
}
