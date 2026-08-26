import { Handle, Position, type NodeProps } from "@xyflow/react";
import Emblem from "../Emblem";

export interface RootNodeData {
  nom: string;
  avatar: string;
  [key: string]: unknown;
}

export default function RootNode({ data }: NodeProps) {
  const d = data as RootNodeData;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-scout-black/40 !h-2 !w-2" />
      <div className="flex w-56 flex-col items-center gap-2 rounded-2xl border-2 border-scout-black bg-scout-yellow px-4 py-4 text-center shadow-card">
        <Emblem size={40} />
        <span className="font-display text-sm font-extrabold leading-tight text-scout-black">
          {d.nom}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-scout-black/40 !h-2 !w-2" />
    </div>
  );
}
