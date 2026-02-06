import { describe, it, expect } from 'vitest';
import { recalculateSummaries } from '../summary-calculator';
import type { Student } from '../../types/student';
import { Gender, Grade } from '../../types/student';

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

describe('recalculateSummaries', () => {
  it('returns empty array for empty classes', () => {
    expect(recalculateSummaries({})).toEqual([]);
  });

  it('calculates student count and male count', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', gender: Gender.FEMALE }),
        makeStudent({ name: 'Bob', gender: Gender.MALE }),
        makeStudent({ name: 'Charlie', gender: Gender.MALE }),
      ],
    };

    const [summary] = recalculateSummaries(classes);
    expect(summary.studentsCount).toBe(3);
    expect(summary.malesCount).toBe(2);
    expect(summary.classNumber).toBe(1);
  });

  it('calculates average academic and behavioural performance', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'A', academicPerformance: Grade.LOW, behavioralPerformance: Grade.HIGH }),
        makeStudent({ name: 'B', academicPerformance: Grade.HIGH, behavioralPerformance: Grade.LOW }),
      ],
    };

    const [summary] = recalculateSummaries(classes);
    expect(summary.averageAcademicPerformance).toBe(2);
    expect(summary.averageBehaviouralPerformance).toBe(2);
  });

  it('counts students without friends in class', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', friend1: 'Bob' }),
        makeStudent({ name: 'Bob', friend1: 'Charlie' }),
      ],
    };

    const [summary] = recalculateSummaries(classes);
    expect(summary.withoutFriends).toBe(1);
  });

  it('treats students with no friends listed as having friends', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice' }),
        makeStudent({ name: 'Bob' }),
      ],
    };

    const [summary] = recalculateSummaries(classes);
    expect(summary.withoutFriends).toBe(0);
  });

  it('counts unwanted matches', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', notWith: 'Bob' }),
        makeStudent({ name: 'Bob' }),
      ],
    };

    const [summary] = recalculateSummaries(classes);
    expect(summary.unwantedMatches).toBe(1);
  });

  it('sorts summaries by class number', () => {
    const classes: Record<string, Student[]> = {
      '3': [makeStudent({ name: 'C' })],
      '1': [makeStudent({ name: 'A' })],
      '2': [makeStudent({ name: 'B' })],
    };

    const summaries = recalculateSummaries(classes);
    expect(summaries.map((s) => s.classNumber)).toEqual([1, 2, 3]);
  });

  it('handles multiple classes independently', () => {
    const classes: Record<string, Student[]> = {
      '1': [
        makeStudent({ name: 'Alice', gender: Gender.FEMALE }),
        makeStudent({ name: 'Bob', gender: Gender.MALE }),
      ],
      '2': [
        makeStudent({ name: 'Charlie', gender: Gender.MALE }),
      ],
    };

    const summaries = recalculateSummaries(classes);
    expect(summaries).toHaveLength(2);
    expect(summaries[0].malesCount).toBe(1);
    expect(summaries[1].malesCount).toBe(1);
  });
});
