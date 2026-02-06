import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/index.ts';
import { useAssignment } from '../../hooks/useAssignment.ts';

export function AssignmentPanel() {
  const { t } = useTranslation();
  const students = useStore((s) => s.students);
  const classCount = useStore((s) => s.classCount);
  const setClassCount = useStore((s) => s.setClassCount);
  const isLoading = useStore((s) => s.isLoading);
  const { assign } = useAssignment();

  const isDisabled = students.length === 0 || classCount < 1 || isLoading;

  return (
    <div className="flex items-center justify-end gap-4 border-t border-gray-200 bg-gray-50 px-6 py-3">
      <label
        htmlFor="class-count"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        {t('numberOfClasses')}:
      </label>
      <input
        id="class-count"
        type="number"
        min={1}
        value={classCount}
        onChange={(e) => setClassCount(Math.max(1, Number(e.target.value)))}
        className="w-20 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <button
        onClick={assign}
        disabled={isDisabled}
        className="rounded-md bg-blue-600 px-5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
      >
        {t('assign')}
      </button>
    </div>
  );
}
