import React, { useEffect, useMemo, useState } from "react";
import dagre from "@dagrejs/dagre";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { OrgData, Person } from "../../data/chefs";
import ChefNode from "./ChefNode";
import BranchNode from "./BranchNode";
import RootNode from "./RootNode";
import ChefTooltip, { type ChefInfo } from "./ChefTooltip";
import ChefModal from "./ChefModal";

const NODE_SIZES = {
  root: { width: 224, height: 120 },
  branch: { width: 176, height: 56 },
  chef: { width: 176, height: 156 },
};

const nodeTypes = {
  chef: ChefNode,
  branch: BranchNode,
  root: RootNode,
};

const defaultEdgeOptions = {
  type: "smoothstep" as const,
  style: { stroke: "#111111", strokeWidth: 1.5 },
};

function computeLayout(data: OrgData): { nodes: Node[]; edges: Edge[] } {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 95, marginx: 24, marginy: 24 });
  graph.setDefaultEdgeLabel(() => ({}));

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const addNode = (id: string, type: keyof typeof NODE_SIZES, dataFields: Record<string, unknown>) => {
    const size = NODE_SIZES[type];
    graph.setNode(id, { ...size, id });
    nodes.push({ id, type, position: { x: 0, y: 0 }, data: dataFields, draggable: false });
  };
  const addEdge = (source: string, target: string) => {
    graph.setEdge(source, target);
    edges.push({ id: `e-${source}-${target}`, source, target });
  };

  addNode("root", "root", { nom: data.root.nom, avatar: data.root.avatar });
  data.leaders.forEach((leader, i) => {
    const leaderId = `leader-${i}`;
    addNode(leaderId, "chef", { ...leader, branchColor: "#FFE100" });
    addEdge(leaderId, "root");
  });

  data.branches.forEach((branch) => {
    const branchId = `branch-${branch.id}`;
    addNode(branchId, "branch", { nom: branch.nom, couleur: branch.couleur });
    addEdge("root", branchId);

    branch.members.forEach((member, j) => {
      const memberId = `member-${branch.id}-${j}`;
      addNode(memberId, "chef", { ...member, branchColor: branch.couleur });
      const sourceId = j === 0 ? branchId : `member-${branch.id}-${j - 1}`;
      addEdge(sourceId, memberId);
    });
  });

  dagre.layout(graph);

  for (const node of nodes) {
    const measured = graph.node(node.id);
    node.position = {
      x: measured.x - measured.width / 2,
      y: measured.y - measured.height / 2,
    };
  }

  return { nodes, edges };
}

function buildPersonMap(data: OrgData): Record<string, ChefInfo> {
  const map: Record<string, ChefInfo> = {};
  data.leaders.forEach((p: Person, i) => {
    map[`leader-${i}`] = { ...p, branchColor: "#FFE100", branchName: "Direction" };
  });
  data.branches.forEach((branch) => {
    branch.members.forEach((p: Person, j) => {
      map[`member-${branch.id}-${j}`] = {
        ...p,
        branchColor: branch.couleur,
        branchName: branch.nom,
      };
    });
  });
  return map;
}

interface HoverState {
  info: ChefInfo;
  x: number;
  y: number;
}

function Flow({ data }: { data: OrgData }) {
  const { fitView } = useReactFlow();
  const [hovered, setHovered] = useState<HoverState | null>(null);
  const [selected, setSelected] = useState<ChefInfo | null>(null);

  const { nodes, edges } = useMemo(() => computeLayout(data), [data]);
  const personMap = useMemo(() => buildPersonMap(data), [data]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      fitView({ padding: 0.2, duration: 300 });
    }, 90);
    return () => window.clearTimeout(id);
  }, [data, nodes.length, fitView]);

  const onEnter = (event: React.MouseEvent, node: Node) => {
    if (node.type !== "chef") return;
    const info = personMap[node.id];
    if (info) setHovered({ info, x: event.clientX, y: event.clientY });
  };
  const onMove = (event: React.MouseEvent) => {
    setHovered((prev) => (prev ? { ...prev, x: event.clientX, y: event.clientY } : prev));
  };
  const onLeave = () => setHovered(null);
  const onClick = (_event: React.MouseEvent, node: Node) => {
    if (node.type !== "chef") return;
    const info = personMap[node.id];
    if (info) setSelected(info);
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-scout-gray-border bg-scout-gray-light">
      <div className="flex items-center justify-between gap-3 border-b border-scout-gray-border bg-white px-4 py-3">
        <span className="text-sm font-semibold text-scout-black">
          Organigramme des chefs
        </span>
        <button
          type="button"
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
          className="btn-ghost px-4 py-2 text-sm"
        >
          Recentrer
        </button>
      </div>

      <div className="h-[70vh] min-h-[520px] w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          onNodeMouseEnter={onEnter}
          onNodeMouseMove={onMove}
          onNodeMouseLeave={onLeave}
          onNodeClick={onClick}
        >
          <Background color="#d4d4d8" gap={20} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {hovered && !selected && (
        <ChefTooltip info={hovered.info} x={hovered.x} y={hovered.y} />
      )}
      {selected && <ChefModal info={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

export default function OrgChart({ data }: { data: OrgData }) {
  return (
    <ReactFlowProvider>
      <Flow data={data} />
    </ReactFlowProvider>
  );
}
