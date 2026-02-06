import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { GridApi, CellValueChangedEvent } from 'ag-grid-community';
import { useStore } from '../../store';
import { Gender, Grade, type Student } from '../../types/student';
import { createColumnDefs } from './StudentGrid.columns';

function createEmptyStudent(): Student {
  return {
    name: '',
    school: '',
    gender: Gender.MALE,
    academicPerformance: Grade.MEDIUM,
    behavioralPerformance: Grade.MEDIUM,
    comments: '',
    friend1: '',
    friend2: '',
    friend3: '',
    friend4: '',
  };
}

export function useStudentGrid() {
  const { t, i18n } = useTranslation();
  const gridApiRef = useRef<GridApi<Student> | null>(null);

  const students = useStore((s) => s.students);
  const addStudent = useStore((s) => s.addStudent);
  const updateStudent = useStore((s) => s.updateStudent);
  const removeStudents = useStore((s) => s.removeStudents);

  const columnDefs = useMemo(() => createColumnDefs(t), [t]);
  const isRtl = i18n.language === 'he';

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<Student>) => {
      if (event.data && event.rowIndex != null) {
        updateStudent(event.rowIndex, { ...event.data });
      }
    },
    [updateStudent],
  );

  const onAddRow = useCallback(() => {
    addStudent(createEmptyStudent());
  }, [addStudent]);

  const onDeleteSelected = useCallback(() => {
    const api = gridApiRef.current;
    if (!api) return;

    const selectedNodes = api.getSelectedNodes();
    const indices = selectedNodes
      .map((node) => node.rowIndex)
      .filter((index): index is number => index != null)
      .sort((a, b) => b - a);

    if (indices.length > 0) {
      removeStudents(indices);
      api.deselectAll();
    }
  }, [removeStudents]);

  return {
    gridApiRef,
    students,
    columnDefs,
    isRtl,
    onCellValueChanged,
    onAddRow,
    onDeleteSelected,
  };
}
