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
        onKeyDown={(e) => { if (e.key === 'Enter') setIsDetailOpen(true); }}
        tabIndex={0}
        role="button"
        className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${isOver ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-gray-200 hover:shadow-md'}`}
      >
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-indigo-400 px-4 py-2">
          <h3 className="text-sm font-semibold text-white">
            {t('class')} {classId}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDetailOpen(true)}
              className="rounded-md border border-white/30 bg-white/15 px-2 py-0.5 text-xs font-medium text-white transition-colors hover:bg-white/25"
            >
              {t('view')}
            </button>
            <span className="text-xs font-medium text-blue-100">
              {students.length} {t('studentsCount').toLowerCase()}
            </span>
          </div>
        </div>
        <div className="p-4">
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
