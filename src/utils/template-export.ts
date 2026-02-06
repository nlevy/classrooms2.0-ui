import * as XLSX from 'xlsx';
import { getTemplate } from '../api/classrooms-api';
import { HEBREW_COLUMN_MAP } from '../components/file-import/column-mappings';
import type { Student } from '../types/student';

const ENGLISH_HEADERS: (keyof Student)[] = [
  'name', 'school', 'gender', 'academicPerformance', 'behavioralPerformance',
  'comments', 'friend1', 'friend2', 'friend3', 'friend4', 'notWith', 'clusterId',
];

const REVERSE_HEBREW_COLUMN_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(HEBREW_COLUMN_MAP).map(([he, en]) => [en, he]),
);

const HEBREW_GENDER_DISPLAY: Record<string, string> = {
  MALE: 'ז',
  FEMALE: 'נ',
};

const HEBREW_GRADE_DISPLAY: Record<string, string> = {
  LOW: 'נמוך',
  MEDIUM: 'בינוני',
  HIGH: 'גבוה',
};

function localizeValue(field: keyof Student, value: string, lang: string): string {
  if (lang !== 'he') return value;
  if (field === 'gender') return HEBREW_GENDER_DISPLAY[value] ?? value;
  if (field === 'academicPerformance' || field === 'behavioralPerformance') {
    return HEBREW_GRADE_DISPLAY[value] ?? value;
  }
  return value;
}

export async function exportTemplate(lang: string): Promise<void> {
  const students: Student[] = await getTemplate(lang);

  const headers = ENGLISH_HEADERS.map((field) =>
    lang === 'he' ? (REVERSE_HEBREW_COLUMN_MAP[field] ?? field) : field,
  );

  const rows = students.map((student) =>
    ENGLISH_HEADERS.map((field) => {
      const raw = student[field];
      if (raw == null) return '';
      return localizeValue(field, String(raw), lang);
    }),
  );

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  const colWidths = [20, 15, 10, 12, 12, 25, 18, 18, 18, 18, 15, 10];
  ws['!cols'] = colWidths.map((w) => ({ wch: w }));

  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, 'template.xlsx');
}
