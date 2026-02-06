import { describe, it, expect, beforeEach } from 'vitest';
import { createStudentSlice, type StudentSlice } from '../student-slice';
import type { Student } from '../../types/student';
import { Gender, Grade } from '../../types/student';

function makeStudent(name: string): Student {
  return {
    name,
    school: 'School A',
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

describe('student-slice', () => {
  let state: StudentSlice;
  let setState: (partial: Partial<StudentSlice>) => void;

  beforeEach(() => {
    state = {} as StudentSlice;
    setState = (partial) => {
      Object.assign(state, partial);
    };

    const set = (fn: ((s: StudentSlice) => Partial<StudentSlice>) | Partial<StudentSlice>) => {
      if (typeof fn === 'function') {
        setState(fn(state));
      } else {
        setState(fn);
      }
    };

    const slice = createStudentSlice(
      set as Parameters<typeof createStudentSlice>[0],
      (() => state) as Parameters<typeof createStudentSlice>[1],
      {} as Parameters<typeof createStudentSlice>[2],
    );
    Object.assign(state, slice);
  });

  it('initializes with empty students array', () => {
    expect(state.students).toEqual([]);
  });

  it('setStudents replaces the entire array', () => {
    const students = [makeStudent('Alice'), makeStudent('Bob')];
    state.setStudents(students);
    expect(state.students).toEqual(students);
  });

  it('addStudent appends to the array', () => {
    state.setStudents([makeStudent('Alice')]);
    state.addStudent(makeStudent('Bob'));
    expect(state.students).toHaveLength(2);
    expect(state.students[1].name).toBe('Bob');
  });

  it('updateStudent replaces at specific index', () => {
    state.setStudents([makeStudent('Alice'), makeStudent('Bob')]);
    const updated = makeStudent('Charlie');
    state.updateStudent(1, updated);
    expect(state.students[1].name).toBe('Charlie');
    expect(state.students[0].name).toBe('Alice');
  });

  it('removeStudents removes by indices', () => {
    state.setStudents([makeStudent('Alice'), makeStudent('Bob'), makeStudent('Charlie')]);
    state.removeStudents([0, 2]);
    expect(state.students).toHaveLength(1);
    expect(state.students[0].name).toBe('Bob');
  });

  it('clearStudents empties the array', () => {
    state.setStudents([makeStudent('Alice'), makeStudent('Bob')]);
    state.clearStudents();
    expect(state.students).toEqual([]);
  });

  it('removeStudents with empty indices does not change array', () => {
    state.setStudents([makeStudent('Alice')]);
    state.removeStudents([]);
    expect(state.students).toHaveLength(1);
  });
});
