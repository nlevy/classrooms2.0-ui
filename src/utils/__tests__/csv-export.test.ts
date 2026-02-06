import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Student } from '../../types/student';
import { Gender, Grade } from '../../types/student';

vi.mock('xlsx', () => {
  const sheets: Record<string, unknown> = {};
  return {
    utils: {
      book_new: vi.fn(() => ({ SheetNames: [], Sheets: {} })),
      aoa_to_sheet: vi.fn((data: unknown[][]) => {
        return { _data: data, _rowCount: data.length };
      }),
      book_append_sheet: vi.fn((_wb: unknown, sheet: unknown, name: string) => {
        sheets[name] = sheet;
      }),
      encode_cell: vi.fn(({ r, c }: { r: number; c: number }) => `${String.fromCharCode(65 + c)}${r + 1}`),
    },
    writeFile: vi.fn(),
    __sheets: sheets,
  };
});

import { exportAssignmentCsv } from '../csv-export';
import * as XLSX from 'xlsx';
import type { ClassSummary } from '../../types/assignment';

function makeStudent(overrides: Partial<Student> = {}): Student {
  return {
    name: 'Test',
    school: 'School A',
    gender: Gender.MALE,
    academicPerformance: Grade.MEDIUM,
    behavioralPerformance: Grade.MEDIUM,
    comments: '',
    friend1: '',
    friend2: '',
    friend3: '',
    friend4: '',
    ...overrides,
  };
}

describe('exportAssignmentCsv', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a workbook with Students sheet', () => {
    const classes: Record<string, Student[]> = {
      '1': [makeStudent({ name: 'Alice' })],
    };

    exportAssignmentCsv(classes);

    expect(XLSX.utils.book_new).toHaveBeenCalled();
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'Students',
    );
    expect(XLSX.writeFile).toHaveBeenCalled();
  });

  it('creates a Summary sheet when summaries are provided', () => {
    const classes: Record<string, Student[]> = {
      '1': [makeStudent({ name: 'Alice' })],
    };
    const summaries: ClassSummary[] = [
      {
        classNumber: 1,
        studentsCount: 1,
        malesCount: 1,
        averageAcademicPerformance: 2,
        averageBehaviouralPerformance: 2,
        withoutFriends: 0,
        unwantedMatches: 0,
      },
    ];

    exportAssignmentCsv(classes, summaries);

    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'Summary',
    );
  });

  it('generates correct row data for students', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', friend1: 'Bob' }),
        makeStudent({ name: 'Bob', friend1: 'Alice' }),
      ],
    };

    exportAssignmentCsv(classes);

    const aoaCalls = vi.mocked(XLSX.utils.aoa_to_sheet).mock.calls;
    const studentsData = aoaCalls[0][0] as unknown[][];

    expect(studentsData[0]).toContain('Class');
    expect(studentsData[0]).toContain('Name');
    expect(studentsData).toHaveLength(3);
    expect(studentsData[1][1]).toBe('Alice');
    expect(studentsData[2][1]).toBe('Bob');
  });

  it('marks friend status with check/cross marks', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', friend1: 'Bob' }),
        makeStudent({ name: 'Bob', friend1: 'Charlie' }),
      ],
    };

    exportAssignmentCsv(classes);

    const aoaCalls = vi.mocked(XLSX.utils.aoa_to_sheet).mock.calls;
    const studentsData = aoaCalls[0][0] as unknown[][];

    // Alice's friend1 is Bob (in class) -> ✓
    expect(studentsData[1][7]).toBe('✓ Bob');
    // Bob's friend1 is Charlie (not in class) -> ✗
    expect(studentsData[2][7]).toBe('✗ Charlie');
  });
});
