import { useState, useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import type { Student } from '../../types/student.ts';
import { StudentChip } from './StudentChip.tsx';
import { ClassDetailDialog } from './ClassDetailDialog.tsx';

interface ClassCardProps {
  classId: string;
  students: Student[];
  allClasses: Record<string, Student[]>;
}

function hasFriendInClass(student: Student, classmates: Student[]): boolean {
  const classmateNames = new Set(classmates.map((s) => s.name));
  const friends = [student.friend1, student.friend2, student.friend3, student.friend4].filter(
    (f) => f && f.trim() !== '',
  );
  if (friends.length === 0) return true;
  return friends.some((f) => classmateNames.has(f));
}

function hasNotWithViolation(student: Student, classmates: Student[]): boolean {
  if (!student.notWith || student.notWith.trim() === '') return false;
  const nameSet = new Set(classmates.map((s) => s.name));
  const notWithNames = student.notWith.split(',').map((n) => n.trim()).filter((n) => n !== '');
  return notWithNames.some((name) => nameSet.has(name));
}

export function ClassCard({ classId, students, allClasses: _allClasses }: ClassCardProps) {
  const { t } = useTranslation('results');
  const { setNodeRef, isOver } = useDroppable({ id: classId });
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const classmateNames = useMemo(() => new Set(students.map((s) => s.name)), [students]);

  return (
    <>
      <div
        ref={setNodeRef}
        onDoubleClick={() => setIsDetailOpen(true)}
        className={`rounded-lg border-2 bg-white p-4 shadow-sm transition-colors ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            {t('class')} {classId}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDetailOpen(true)}
              className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
            >
              {t('view')}
            </button>
            <span className="text-sm text-gray-500">
              {students.length} {t('studentsCount').toLowerCase()}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {students.map((student) => (
            <StudentChip
              key={student.name}
              student={student}
              classId={classId}
              isFriendless={!hasFriendInClass(student, students)}
              hasNotWithViolation={hasNotWithViolation(student, students)}
            />
          ))}
        </div>
      </div>

      <ClassDetailDialog
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        classId={classId}
        students={students}
        classmateNames={classmateNames}
      />
    </>
  );
}
