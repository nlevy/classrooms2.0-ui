import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AgGridReact } from 'ag-grid-react';
import {
  type GridReadyEvent,
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import type { Student } from '../../types/student';
import { GridToolbar } from './GridToolbar';
import { EmptyState } from '../common/EmptyState';
import { useStudentGrid } from './useStudentGrid';

ModuleRegistry.registerModules([AllCommunityModule]);

interface StudentGridProps {
  onImport?: () => void;
}

export function StudentGrid({ onImport }: StudentGridProps) {
  const { t } = useTranslation();
  const {
    gridApiRef,
    students,
    columnDefs,
    isRtl,
    onCellValueChanged,
    onAddRow,
    onDeleteSelected,
    duplicateWarning,
  } = useStudentGrid();

  const onGridReady = useCallback(
    (params: GridReadyEvent<Student>) => {
      gridApiRef.current = params.api;
    },
    [gridApiRef],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GridToolbar
        studentCount={students.length}
        onAddRow={onAddRow}
        onDeleteSelected={onDeleteSelected}
        onImport={onImport}
      />
      {duplicateWarning && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          {duplicateWarning}
        </div>
      )}
      <div className="min-h-0 flex-1">
        <AgGridReact<Student>
          theme={themeQuartz}
          rowData={students}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          rowSelection={{ mode: 'multiRow', checkboxes: true }}
          enableRtl={isRtl}
          getRowId={(_params) => String(_params.data ? students.indexOf(_params.data) : Math.random())}
          stopEditingWhenCellsLoseFocus
          overlayNoRowsTemplate={' '}
          noRowsOverlayComponent={() => (
            <EmptyState title={t('emptyGridTitle')} subtitle={t('emptyGridSubtitle')} />
          )}
        />
      </div>
    </div>
  );
}
