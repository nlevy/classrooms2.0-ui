import { useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  type GridReadyEvent,
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import type { Student } from '../../types/student';
import { GridToolbar } from './GridToolbar';
import { useStudentGrid } from './useStudentGrid';

ModuleRegistry.registerModules([AllCommunityModule]);

interface StudentGridProps {
  onImport?: () => void;
}

export function StudentGrid({ onImport }: StudentGridProps) {
  const {
    gridApiRef,
    students,
    columnDefs,
    isRtl,
    onCellValueChanged,
    onAddRow,
    onDeleteSelected,
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
        />
      </div>
    </div>
  );
}
