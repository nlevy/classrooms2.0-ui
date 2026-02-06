import { useTranslation } from 'react-i18next';

interface GridToolbarProps {
  studentCount: number;
  onAddRow: () => void;
  onDeleteSelected: () => void;
  onImport?: () => void;
}

export function GridToolbar({ studentCount, onAddRow, onDeleteSelected, onImport }: GridToolbarProps) {
  const { t } = useTranslation('grid');
  const { t: tCommon } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      {onImport && (
        <button
          type="button"
          onClick={onImport}
          className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          {tCommon('importFile')}
        </button>
      )}
      <button
        type="button"
        onClick={onAddRow}
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        {t('addRow')}
      </button>
      <button
        type="button"
        onClick={onDeleteSelected}
        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
      >
        {t('deleteSelected')}
      </button>
      <span className="ms-auto rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-700">
        {studentCount} {studentCount === 1 ? 'student' : 'students'}
      </span>
    </div>
  );
}
