import { useTranslation } from 'react-i18next';
import type { Student } from '../../types/student.ts';

interface ClassDetailDialogProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  students: Student[];
  classmateNames: Set<string>;
}

function FriendCell({ friendName, classmateNames }: { friendName: string; classmateNames: Set<string> }) {
  if (!friendName || friendName.trim() === '') return <td className="px-3 py-2 text-sm text-gray-400">—</td>;

  const isInClass = classmateNames.has(friendName);
  return (
    <td className={`px-3 py-2 text-sm ${isInClass ? 'bg-green-50' : 'bg-red-50'}`}>
      <span className="flex items-center gap-1">
        <span className={isInClass ? 'text-green-600' : 'text-red-500'} aria-hidden="true">
          {isInClass ? '✓' : '✗'}
        </span>
        {friendName}
      </span>
    </td>
  );
}

export function ClassDetailDialog({ open, onClose, classId, students, classmateNames }: ClassDetailDialogProps) {
  const { t } = useTranslation('results');
  const { t: tGrid } = useTranslation('grid');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 max-h-[85vh] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {t('class')} {classId}
            <span className="ms-3 text-sm font-normal text-gray-500">
              {students.length} {t('studentsCount').toLowerCase()}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={t('close')}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-auto p-6" style={{ maxHeight: 'calc(85vh - 73px)' }}>
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b bg-gray-50 text-start text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-start">{tGrid('name')}</th>
                <th className="px-3 py-2 text-start">{tGrid('school')}</th>
                <th className="px-3 py-2 text-start">{tGrid('gender')}</th>
                <th className="px-3 py-2 text-start">{tGrid('academicPerformance')}</th>
                <th className="px-3 py-2 text-start">{tGrid('behavioralPerformance')}</th>
                <th className="px-3 py-2 text-start">{tGrid('comments')}</th>
                <th className="px-3 py-2 text-start">{tGrid('friend1')}</th>
                <th className="px-3 py-2 text-start">{tGrid('friend2')}</th>
                <th className="px-3 py-2 text-start">{tGrid('friend3')}</th>
                <th className="px-3 py-2 text-start">{tGrid('friend4')}</th>
                <th className="px-3 py-2 text-start">{tGrid('notWith')}</th>
                <th className="px-3 py-2 text-start">{tGrid('clusterId')}</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.name} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{student.school}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{tGrid(student.gender.toLowerCase())}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{tGrid(student.academicPerformance.toLowerCase())}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{tGrid(student.behavioralPerformance.toLowerCase())}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{student.comments}</td>
                  <FriendCell friendName={student.friend1} classmateNames={classmateNames} />
                  <FriendCell friendName={student.friend2} classmateNames={classmateNames} />
                  <FriendCell friendName={student.friend3} classmateNames={classmateNames} />
                  <FriendCell friendName={student.friend4} classmateNames={classmateNames} />
                  <td className="px-3 py-2 text-sm text-gray-700">{student.notWith || '—'}</td>
                  <td className="px-3 py-2 text-sm text-gray-700">{student.clusterId ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
