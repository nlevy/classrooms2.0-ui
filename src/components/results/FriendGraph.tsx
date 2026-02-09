import { useMemo, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react';
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
const COMPONENT_GAP = 80;

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
    };
  });

  return { nodes, edges };
}

function findConnectedComponents(nodes: Node[], edges: Edge[]): number[][] {
  const idToIdx = new Map(nodes.map((n, i) => [n.id, i]));
  const adj: number[][] = nodes.map(() => []);

  for (const edge of edges) {
    const si = idToIdx.get(edge.source);
    const ti = idToIdx.get(edge.target);
    if (si !== undefined && ti !== undefined) {
      adj[si].push(ti);
      adj[ti].push(si);
    }
  }

  const visited = new Uint8Array(nodes.length);
  const components: number[][] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (visited[i]) continue;
    const component: number[] = [];
    const stack = [i];
    while (stack.length > 0) {
      const cur = stack.pop()!;
      if (visited[cur]) continue;
      visited[cur] = 1;
      component.push(cur);
      for (const nb of adj[cur]) {
        if (!visited[nb]) stack.push(nb);
      }
    }
    components.push(component);
  }

  return components;
}

function forceLayoutComponent(
  indices: number[],
  allNodes: Node[],
  edges: Edge[],
): { x: number; y: number }[] {
  const n = indices.length;
  if (n === 1) return [{ x: 0, y: 0 }];

  const idToLocal = new Map(indices.map((gi, li) => [allNodes[gi].id, li]));

  const localEdges = edges
    .map((e) => [idToLocal.get(e.source), idToLocal.get(e.target)] as [number | undefined, number | undefined])
    .filter((pair): pair is [number, number] => pair[0] !== undefined && pair[1] !== undefined);

  const radius = Math.max(60, n * 15);
  const positions = Array.from({ length: n }, (_, i) => ({
    x: radius * Math.cos((2 * Math.PI * i) / n),
    y: radius * Math.sin((2 * Math.PI * i) / n),
  }));

  const REPULSION = 4000;
  const ATTRACTION = 0.03;
  const ITERATIONS = 150;
  const DAMPING = 0.85;
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
        vx[i] += force * dx;
        vy[i] += force * dy;
        vx[j] -= force * dx;
        vy[j] -= force * dy;
      }
    }

    for (const [si, ti] of localEdges) {
      const dx = positions[ti].x - positions[si].x;
      const dy = positions[ti].y - positions[si].y;
      vx[si] += ATTRACTION * dx;
      vy[si] += ATTRACTION * dy;
      vx[ti] -= ATTRACTION * dx;
      vy[ti] -= ATTRACTION * dy;
    }

    for (let i = 0; i < n; i++) {
      positions[i].x += vx[i] * cooling;
      positions[i].y += vy[i] * cooling;
      vx[i] *= DAMPING;
      vy[i] *= DAMPING;
    }
  }

  let cx = 0, cy = 0;
  for (const p of positions) { cx += p.x; cy += p.y; }
  cx /= n;
  cy /= n;
  for (const p of positions) { p.x -= cx; p.y -= cy; }

  return positions;
}

function applyForceLayout(nodes: Node[], edges: Edge[]): Node[] {
  const n = nodes.length;
  if (n === 0) return nodes;
  if (n === 1) return [{ ...nodes[0], position: { x: 0, y: 0 } }];

  const components = findConnectedComponents(nodes, edges);
  components.sort((a, b) => b.length - a.length);

  const positions = new Array<{ x: number; y: number }>(n);

  const componentBoxes: { width: number; height: number; indices: number[]; localPos: { x: number; y: number }[] }[] = [];

  for (const comp of components) {
    const localPos = forceLayoutComponent(comp, nodes, edges);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of localPos) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    componentBoxes.push({
      width: maxX - minX + NODE_WIDTH,
      height: maxY - minY + NODE_HEIGHT,
      indices: comp,
      localPos,
    });
  }

  let cursorX = 0;
  let maxRowHeight = 0;
  let cursorY = 0;
  const ROW_WIDTH = Infinity;

  for (const box of componentBoxes) {
    if (cursorX > 0 && cursorX + box.width > ROW_WIDTH) {
      cursorY += maxRowHeight + COMPONENT_GAP;
      cursorX = 0;
      maxRowHeight = 0;
    }

    for (let li = 0; li < box.indices.length; li++) {
      const gi = box.indices[li];
      positions[gi] = {
        x: cursorX + box.localPos[li].x - NODE_WIDTH / 2,
        y: cursorY + box.localPos[li].y - NODE_HEIGHT / 2,
      };
    }

    cursorX += box.width + COMPONENT_GAP;
    maxRowHeight = Math.max(maxRowHeight, box.height);
  }

  let totalCx = 0, totalCy = 0;
  for (const p of positions) { totalCx += p.x; totalCy += p.y; }
  totalCx /= n;
  totalCy /= n;

  return nodes.map((node, i) => ({
    ...node,
    position: { x: positions[i].x - totalCx, y: positions[i].y - totalCy },
  }));
}

function FitViewOnMount() {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const timer = window.setTimeout(() => fitView({ padding: 0.15, duration: 200 }), 100);
    return () => clearTimeout(timer);
  }, [fitView]);
  return null;
}

export function FriendGraph({ students, classmateNames }: FriendGraphProps) {
  const { t } = useTranslation('results');

  const { nodes, edges } = useMemo(() => {
    const { nodes: rawNodes, edges } = buildGraph(students, classmateNames);
    const nodes = applyForceLayout(rawNodes, edges);
    return { nodes, edges };
  }, [students, classmateNames]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable={false}
            proOptions={{ hideAttribution: true }}
            minZoom={0.1}
            style={{ width: '100%', height: '100%' }}
          >
            <FitViewOnMount />
          </ReactFlow>
        </ReactFlowProvider>
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
