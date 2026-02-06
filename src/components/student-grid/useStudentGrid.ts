import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GridApi, CellValueChangedEvent } from 'ag-grid-community';
import { useStore } from '../../store';
import { Gender, Grade, type Student } from '../../types/student';
import { createColumnDefs } from './StudentGrid.columns';

function studentKey(s: Student): string {
  return `${s.name}\0${s.school}`;
}

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
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const students = useStore((s) => s.students);
  const addStudent = useStore((s) => s.addStudent);
  const updateStudent = useStore((s) => s.updateStudent);
  const removeStudents = useStore((s) => s.removeStudents);

  const columnDefs = useMemo(() => createColumnDefs(t), [t]);
  const isRtl = i18n.language === 'he';

  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<Student>) => {
      if (!event.data || event.rowIndex == null) return;

      if (event.column.getColId() === 'name' || event.column.getColId() === 'school') {
        const newKey = studentKey(event.data);
        const hasDuplicate = newKey !== '\0' && students.some(
          (s, i) => i !== event.rowIndex && studentKey(s) === newKey,
        );

        if (hasDuplicate) {
          const reverted = { ...event.data, [event.column.getColId()]: event.oldValue };
          updateStudent(event.rowIndex, reverted);
          gridApiRef.current?.refreshCells({ rowNodes: [event.node!], force: true });
          setDuplicateWarning(t('grid:duplicateStudent', { name: event.data.name, school: event.data.school }));
          setTimeout(() => setDuplicateWarning(null), 4000);
          return;
        }
      }

      updateStudent(event.rowIndex, { ...event.data });
    },
    [updateStudent, students, t],
  );

  const onAddRow = useCallback(() => {
    addStudent(createEmptyStudent());
    setTimeout(() => {
      const api = gridApiRef.current;
      if (api) {
        const lastIndex = api.getDisplayedRowCount() - 1;
        api.ensureIndexVisible(lastIndex, 'bottom');
      }
    });
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
    duplicateWarning,
  };
}
