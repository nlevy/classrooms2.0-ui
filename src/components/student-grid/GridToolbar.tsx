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
    <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-2">
      {onImport && (
        <button
          type="button"
          onClick={onImport}
          className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
        >
          {tCommon('importFile')}
        </button>
      )}
      <button
        type="button"
        onClick={onAddRow}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t('addRow')}
      </button>
      <button
        type="button"
        onClick={onDeleteSelected}
        className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        {t('deleteSelected')}
      </button>
      <span className="ms-auto text-sm text-gray-500">
        {studentCount} {studentCount === 1 ? 'student' : 'students'}
      </span>
    </div>
  );
}
