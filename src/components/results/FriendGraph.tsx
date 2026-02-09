import { useMemo } from 'react';
import { ReactFlow, type Node, type Edge, MarkerType } from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import { useTranslation } from 'react-i18next';
import type { Student } from '../../types/student';
import { FriendGraphNode, type FriendNodeData } from './FriendGraphNode';
import '@xyflow/react/dist/style.css';

interface FriendGraphProps {
  students: Student[];
  classmateNames: Set<string>;
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 40;

const nodeTypes = { friendNode: FriendGraphNode };

function hasNotWithViolation(student: Student, classmateNames: Set<string>): boolean {
  if (!student.notWith || student.notWith.trim() === '') return false;
  const notWithNames = student.notWith.split(',').map((n) => n.trim()).filter((n) => n !== '');
  return notWithNames.some((name) => classmateNames.has(name));
}

function buildGraph(students: Student[], classmateNames: Set<string>) {
  const friendEdgeSet = new Set<string>();
  const rawEdges: { source: string; target: string }[] = [];

  for (const student of students) {
    const friends = [student.friend1, student.friend2, student.friend3, student.friend4]
      .filter((f) => f && f.trim() !== '');
    for (const friend of friends) {
      if (classmateNames.has(friend)) {
        const key = `${student.name}->${friend}`;
        friendEdgeSet.add(key);
        rawEdges.push({ source: student.name, target: friend });
      }
    }
  }

  const nodes: Node<FriendNodeData>[] = students.map((student) => ({
    id: student.name,
    type: 'friendNode',
    position: { x: 0, y: 0 },
    data: {
      student,
      hasViolation: hasNotWithViolation(student, classmateNames),
    },
  }));

  const edges: Edge[] = rawEdges.map(({ source, target }) => {
    const reverseKey = `${target}->${source}`;
    const isMutual = friendEdgeSet.has(reverseKey);
    return {
      id: `${source}->${target}`,
      source,
      target,
      markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
      style: { stroke: isMutual ? '#22c55e' : '#9ca3af', strokeWidth: 2 },
      animated: false,
    };
  });

  return { nodes, edges };
}

function applyDagreLayout(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', ranksep: 80, nodesep: 50 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}

export function FriendGraph({ students, classmateNames }: FriendGraphProps) {
  const { t } = useTranslation('results');

  const { nodes, edges } = useMemo(() => {
    const { nodes: rawNodes, edges } = buildGraph(students, classmateNames);
    const nodes = applyDagreLayout(rawNodes, edges);
    return { nodes, edges };
  }, [students, classmateNames]);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 px-4 py-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-green-500" />
          {t('mutualRequest')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-4 rounded bg-gray-400" />
          {t('oneWayRequest')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border border-blue-200 bg-blue-100" />
          {t('male')}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-full border border-pink-200 bg-pink-100" />
          {t('female')}
        </span>
      </div>
    </div>
  );
}
