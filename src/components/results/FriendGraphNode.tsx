import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Gender } from '../../types/student';
import type { Student } from '../../types/student';

export interface FriendNodeData {
  student: Student;
  hasViolation: boolean;
  [key: string]: unknown;
}

export function FriendGraphNode({ data }: NodeProps) {
  const { student, hasViolation } = data as FriendNodeData;

  const chipStyle =
    student.gender === Gender.MALE
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-pink-100 text-pink-800 border-pink-200';

  return (
    <>
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />
      <div
        className={`rounded-full border px-3 py-1 text-sm font-medium ${chipStyle} ${hasViolation ? 'ring-2 ring-amber-400' : ''}`}
      >
        {student.name}
        {hasViolation && (
          <span className="ms-1 text-xs text-amber-600" aria-hidden="true">
            ⚠
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400" />
    </>
  );
}
