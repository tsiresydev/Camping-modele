import { Handle, Position, type NodeProps } from "@xyflow/react";

export interface BranchNodeData {
  nom: string;
  couleur: string;
  [key: string]: unknown;
}

export default function BranchNode({ data }: NodeProps) {
  const d = data as BranchNodeData;
  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} className="!bg-scout-black/40 !h-2 !w-2" />
      <div
        className="flex w-44 items-center justify-center rounded-xl px-3 py-3 text-center shadow-card"
        style={{ backgroundColor: d.couleur }}
      >
        <span className="font-display text-sm font-extrabold uppercase leading-tight text-scout-black">
          {d.nom}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-scout-black/40 !h-2 !w-2" />
    </div>
  );
}
