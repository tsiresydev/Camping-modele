import { Handle, Position, type NodeProps } from "@xyflow/react";
import Avatar from "./Avatar";

export interface ChefNodeData {
  nom: string;
  fonction: string;
  telephone: string;
  avatar: string;
  branchColor: string;
  [key: string]: unknown;
}

export default function ChefNode({ data }: NodeProps) {
  const d = data as ChefNodeData;
  return (
    <div className="flex w-44 cursor-pointer flex-col items-center gap-2 rounded-2xl border border-scout-gray-border bg-white p-4 text-center shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <Handle type="target" position={Position.Top} className="!bg-scout-black/40 !h-2 !w-2" />
      <Avatar src={d.avatar} nom={d.nom} size={56} ringClass="ring-2 ring-offset-2" />
      <span className="line-clamp-2 text-sm font-semibold leading-tight text-scout-black">
        {d.nom}
      </span>
      <span
        className="rounded-full px-3 py-0.5 text-xs font-bold"
        style={{ backgroundColor: d.branchColor, color: "#111111" }}
      >
        {d.fonction}
      </span>
      <Handle type="source" position={Position.Bottom} className="!bg-scout-black/40 !h-2 !w-2" />
    </div>
  );
}
