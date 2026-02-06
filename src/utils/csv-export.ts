import * as XLSX from 'xlsx';
import type { Student } from '../types/student.ts';
import type { ClassSummary } from '../types/assignment.ts';

function isFriendInClass(friendName: string, classmateNames: Set<string>): boolean | null {
  if (!friendName || friendName.trim() === '') return null;
  return classmateNames.has(friendName);
}

function friendCellValue(friendName: string, inClass: boolean | null): string {
  if (inClass === null) return '';
  return inClass ? `✓ ${friendName}` : `✗ ${friendName}`;
}

export function exportAssignmentCsv(classes: Record<string, Student[]>, summaries?: ClassSummary[]): void {
  const wb = XLSX.utils.book_new();

  const headers = [
    'Class', 'Name', 'School', 'Gender', 'Academic', 'Behavioral',
    'Comments', 'Friend 1', 'Friend 2', 'Friend 3', 'Friend 4',
    'Not With', 'Cluster ID',
  ];

  const rows: (string | number)[][] = [];
  const friendStatuses: (boolean | null)[][] = [];

  for (const [classId, students] of Object.entries(classes).sort(([a], [b]) => Number(a) - Number(b))) {
    const classmateNames = new Set(students.map((s) => s.name));

    for (const student of students) {
      const f1 = isFriendInClass(student.friend1, classmateNames);
      const f2 = isFriendInClass(student.friend2, classmateNames);
      const f3 = isFriendInClass(student.friend3, classmateNames);
      const f4 = isFriendInClass(student.friend4, classmateNames);

      friendStatuses.push([f1, f2, f3, f4]);

      rows.push([
        classId,
        student.name,
        student.school,
        student.gender,
        student.academicPerformance,
        student.behavioralPerformance,
        student.comments,
        friendCellValue(student.friend1, f1),
        friendCellValue(student.friend2, f2),
        friendCellValue(student.friend3, f3),
        friendCellValue(student.friend4, f4),
        student.notWith ?? '',
        student.clusterId != null ? student.clusterId : '',
      ]);
    }
  }

  const studentsSheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  const greenFill = { fgColor: { rgb: 'C6EFCE' } };
  const redFill = { fgColor: { rgb: 'FFC7CE' } };
  const friendColIndices = [7, 8, 9, 10];

  for (let rowIdx = 0; rowIdx < friendStatuses.length; rowIdx++) {
    for (let fi = 0; fi < 4; fi++) {
      const status = friendStatuses[rowIdx][fi];
      if (status === null) continue;
      const cellRef = XLSX.utils.encode_cell({ r: rowIdx + 1, c: friendColIndices[fi] });
      const cell = studentsSheet[cellRef];
      if (cell) {
        cell.s = {
          fill: status ? greenFill : redFill,
        };
      }
    }
  }

  const colWidths = [8, 20, 15, 10, 12, 12, 25, 18, 18, 18, 18, 15, 10];
  studentsSheet['!cols'] = colWidths.map((w) => ({ wch: w }));

  XLSX.utils.book_append_sheet(wb, studentsSheet, 'Students');

  if (summaries && summaries.length > 0) {
    const sorted = [...summaries].sort((a, b) => a.classNumber - b.classNumber);

    const summaryHeaders = [
      'Metric',
      ...sorted.map((s) => `Class ${s.classNumber}`),
    ];

    const summaryRows = [
      ['Students', ...sorted.map((s) => s.studentsCount)],
      ['Males', ...sorted.map((s) => s.malesCount)],
      ['Avg Academic', ...sorted.map((s) => Number(s.averageAcademicPerformance.toFixed(1)))],
      ['Avg Behavioural', ...sorted.map((s) => Number(s.averageBehaviouralPerformance.toFixed(1)))],
      ['Without Friends', ...sorted.map((s) => s.withoutFriends)],
      ['Unwanted Matches', ...sorted.map((s) => s.unwantedMatches)],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryRows]);
    summarySheet['!cols'] = [
      { wch: 18 },
      ...sorted.map(() => ({ wch: 12 })),
    ];

    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
  }

  XLSX.writeFile(wb, `assignment-${new Date().toISOString().slice(0, 10)}.xlsx`);
}
