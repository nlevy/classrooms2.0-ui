import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import type { Student } from '../../types/student.ts';
import { Gender } from '../../types/student.ts';

interface StudentChipProps {
  student: Student;
  classId: string;
  isFriendless: boolean;
  hasNotWithViolation: boolean;
}

export function StudentChip({
  student,
  classId,
  isFriendless,
  hasNotWithViolation,
}: StudentChipProps) {
  const { t } = useTranslation('results');
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: student.name,
    data: { classId },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const bgColor =
    student.gender === Gender.MALE ? 'bg-blue-100' : 'bg-pink-100';

  const hasWarning = isFriendless || hasNotWithViolation;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${bgColor} cursor-grab select-none ${isDragging ? 'opacity-50 shadow-lg' : ''} ${hasWarning ? 'ring-2 ring-amber-400' : ''}`}
      title={
        hasWarning
          ? [
              isFriendless ? t('warningFriendless') : '',
              hasNotWithViolation ? t('warningNotWith') : '',
            ]
              .filter(Boolean)
              .join(', ')
          : undefined
      }
    >
      <span>{student.name}</span>
      {hasWarning && (
        <span className="text-amber-600 text-xs" aria-hidden="true">
          ⚠
        </span>
      )}
    </div>
  );
}
