import type { ColDef } from 'ag-grid-community';
import type { TFunction } from 'i18next';
import { Gender, Grade, type Student } from '../../types/student';

export function createColumnDefs(t: TFunction): ColDef<Student>[] {
  return [
    {
      field: 'name',
      headerName: t('grid:name'),
      editable: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'school',
      headerName: t('grid:school'),
      editable: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'gender',
      headerName: t('grid:gender'),
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [Gender.MALE, Gender.FEMALE],
      },
      valueFormatter: (params) => {
        if (params.value === Gender.MALE) return t('grid:male');
        if (params.value === Gender.FEMALE) return t('grid:female');
        return params.value ?? '';
      },
      width: 120,
    },
    {
      field: 'academicPerformance',
      headerName: t('grid:academicPerformance'),
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [Grade.LOW, Grade.MEDIUM, Grade.HIGH],
      },
      valueFormatter: (params) => {
        if (params.value === Grade.LOW) return t('grid:low');
        if (params.value === Grade.MEDIUM) return t('grid:medium');
        if (params.value === Grade.HIGH) return t('grid:high');
        return params.value ?? '';
      },
      width: 160,
    },
    {
      field: 'behavioralPerformance',
      headerName: t('grid:behavioralPerformance'),
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [Grade.LOW, Grade.MEDIUM, Grade.HIGH],
      },
      valueFormatter: (params) => {
        if (params.value === Grade.LOW) return t('grid:low');
        if (params.value === Grade.MEDIUM) return t('grid:medium');
        if (params.value === Grade.HIGH) return t('grid:high');
        return params.value ?? '';
      },
      width: 160,
    },
    {
      field: 'comments',
      headerName: t('grid:comments'),
      editable: true,
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'friend1',
      headerName: t('grid:friend1'),
      editable: true,
      width: 120,
    },
    {
      field: 'friend2',
      headerName: t('grid:friend2'),
      editable: true,
      width: 120,
    },
    {
      field: 'friend3',
      headerName: t('grid:friend3'),
      editable: true,
      width: 120,
    },
    {
      field: 'friend4',
      headerName: t('grid:friend4'),
      editable: true,
      width: 120,
    },
    {
      field: 'notWith',
      headerName: t('grid:notWith'),
      editable: true,
      width: 120,
    },
    {
      field: 'clusterId',
      headerName: t('grid:clusterId'),
      editable: true,
      cellEditor: 'agNumberCellEditor',
      width: 110,
    },
  ];
}
