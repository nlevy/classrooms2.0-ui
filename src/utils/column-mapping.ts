import { Gender, Grade } from '../types/student.ts';
import type { Student } from '../types/student.ts';
import {
  HEBREW_COLUMN_MAP,
  HEBREW_GENDER_MAP,
  HEBREW_GRADE_MAP,
} from '../components/file-import/column-mappings.ts';

const HEBREW_REGEX = /[\u0590-\u05FF]/;

export function containsHebrew(text: string): boolean {
  return HEBREW_REGEX.test(text);
}

export function detectHebrewHeaders(headers: string[]): boolean {
  return headers.some((h) => containsHebrew(h));
}

function mapColumnName(header: string, isHebrew: boolean): string {
  if (isHebrew) {
    return HEBREW_COLUMN_MAP[header.trim()] ?? header.trim();
  }
  return header.trim();
}

function mapGender(value: string, isHebrew: boolean): Gender {
  const trimmed = value.trim();
  if (isHebrew) {
    const mapped = HEBREW_GENDER_MAP[trimmed];
    if (mapped) return mapped;
  }
  if (trimmed.toUpperCase() === 'MALE') return Gender.MALE;
  if (trimmed.toUpperCase() === 'FEMALE') return Gender.FEMALE;
  return Gender.MALE;
}

function mapGrade(value: string, isHebrew: boolean): Grade {
  const trimmed = value.trim();
  if (isHebrew) {
    const mapped = HEBREW_GRADE_MAP[trimmed];
    if (mapped) return mapped;
  }
  const upper = trimmed.toUpperCase();
  if (upper === 'LOW') return Grade.LOW;
  if (upper === 'MEDIUM') return Grade.MEDIUM;
  if (upper === 'HIGH') return Grade.HIGH;
  return Grade.MEDIUM;
}

export function mapRowToStudent(
  row: Record<string, string>,
  isHebrew: boolean,
): Student {
  const mapped: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    const fieldName = mapColumnName(key, isHebrew);
    mapped[fieldName] = typeof value === 'string' ? value.trim() : String(value ?? '');
  }

  return {
    name: mapped['name'] ?? '',
    school: mapped['school'] ?? '',
    gender: mapGender(mapped['gender'] ?? '', isHebrew),
    academicPerformance: mapGrade(mapped['academicPerformance'] ?? '', isHebrew),
    behavioralPerformance: mapGrade(mapped['behavioralPerformance'] ?? '', isHebrew),
    comments: mapped['comments'] ?? '',
    friend1: mapped['friend1'] ?? '',
    friend2: mapped['friend2'] ?? '',
    friend3: mapped['friend3'] ?? '',
    friend4: mapped['friend4'] ?? '',
    notWith: mapped['notWith'] ?? undefined,
    clusterId: mapped['clusterId'] ? Number(mapped['clusterId']) : undefined,
  };
}
