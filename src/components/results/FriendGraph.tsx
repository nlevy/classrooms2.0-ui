import { useMemo } from 'react';
import { ReactFlow, type Node, type Edge, MarkerType } from '@xyflow/react';
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

  return { nodes, edges, friendEdgeSet };
}

/**
 * Simple force-directed layout for small graphs (classroom-sized, ~15-30 nodes).
 * Starts from a circular layout and runs repulsion/attraction iterations.
 */
function applyForceLayout(
  nodes: Node[],
  edges: Edge[],
): Node[] {
  const n = nodes.length;
  if (n === 0) return nodes;
  if (n === 1) return [{ ...nodes[0], position: { x: 0, y: 0 } }];

  const radius = Math.max(150, n * 30);
  const positions: { x: number; y: number }[] = nodes.map((_, i) => ({
    x: radius * Math.cos((2 * Math.PI * i) / n),
    y: radius * Math.sin((2 * Math.PI * i) / n),
  }));

  const idIndex = new Map(nodes.map((node, i) => [node.id, i]));

  const edgePairs = edges
    .map((e) => [idIndex.get(e.source)!, idIndex.get(e.target)!] as [number, number])
    .filter(([a, b]) => a !== undefined && b !== undefined);

  const REPULSION = 8000;
  const ATTRACTION = 0.005;
  const ITERATIONS = 120;
  const DAMPING = 0.9;

  const vx = new Float64Array(n);
  const vy = new Float64Array(n);

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const cooling = 1 - iter / ITERATIONS;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const distSq = dx * dx + dy * dy + 1;
        const force = REPULSION / distSq;
        const fx = force * dx;
        const fy = force * dy;
        vx[i] += fx;
        vy[i] += fy;
        vx[j] -= fx;
        vy[j] -= fy;
      }
    }

    for (const [si, ti] of edgePairs) {
      const dx = positions[ti].x - positions[si].x;
      const dy = positions[ti].y - positions[si].y;
      const fx = ATTRACTION * dx;
      const fy = ATTRACTION * dy;
      vx[si] += fx;
      vy[si] += fy;
      vx[ti] -= fx;
      vy[ti] -= fy;
    }

    for (let i = 0; i < n; i++) {
      positions[i].x += vx[i] * cooling;
      positions[i].y += vy[i] * cooling;
      vx[i] *= DAMPING;
      vy[i] *= DAMPING;
    }
  }

  return nodes.map((node, i) => ({
    ...node,
    position: {
      x: positions[i].x - NODE_WIDTH / 2,
      y: positions[i].y - NODE_HEIGHT / 2,
    },
  }));
}

export function FriendGraph({ students, classmateNames }: FriendGraphProps) {
  const { t } = useTranslation('results');

  const { nodes, edges } = useMemo(() => {
    const { nodes: rawNodes, edges } = buildGraph(students, classmateNames);
    const nodes = applyForceLayout(rawNodes, edges);
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
