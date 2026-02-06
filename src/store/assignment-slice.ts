import type { StateCreator } from 'zustand';
import type { Student } from '../types/student';
import type { ClassSummary } from '../types/assignment';

export interface MoveRecord {
  studentName: string;
  fromClass: string;
  toClass: string;
}

export interface AssignmentSlice {
  classes: Record<string, Student[]> | null;
  summaries: ClassSummary[] | null;
  originalClasses: Record<string, Student[]> | null;
  moveHistory: MoveRecord[];
  setAssignmentResult: (
    classes: Record<string, Student[]>,
    summaries: ClassSummary[],
  ) => void;
  moveStudent: (
    studentName: string,
    fromClass: string,
    toClass: string,
  ) => void;
  undoLastMove: () => void;
  resetToOriginal: () => void;
  clearAssignment: () => void;
}

export const createAssignmentSlice: StateCreator<AssignmentSlice> = (set) => ({
  classes: null,
  summaries: null,
  originalClasses: null,
  moveHistory: [],
  setAssignmentResult: (classes, summaries) =>
    set({
      classes,
      summaries,
      originalClasses: JSON.parse(JSON.stringify(classes)),
      moveHistory: [],
    }),
  moveStudent: (studentName, fromClass, toClass) =>
    set((state) => {
      if (!state.classes) return state;
      const classes = JSON.parse(JSON.stringify(state.classes));
      const studentIndex = classes[fromClass]?.findIndex(
        (s: Student) => s.name === studentName,
      );
      if (studentIndex === undefined || studentIndex === -1) return state;
      const [student] = classes[fromClass].splice(studentIndex, 1);
      classes[toClass].push(student);
      return {
        classes,
        moveHistory: [
          ...state.moveHistory,
          { studentName, fromClass, toClass },
        ],
      };
    }),
  undoLastMove: () =>
    set((state) => {
      if (!state.classes || state.moveHistory.length === 0) return state;
      const lastMove = state.moveHistory[state.moveHistory.length - 1];
      const classes = JSON.parse(JSON.stringify(state.classes));
      const studentIndex = classes[lastMove.toClass]?.findIndex(
        (s: Student) => s.name === lastMove.studentName,
      );
      if (studentIndex === undefined || studentIndex === -1) return state;
      const [student] = classes[lastMove.toClass].splice(studentIndex, 1);
      classes[lastMove.fromClass].push(student);
      return {
        classes,
        moveHistory: state.moveHistory.slice(0, -1),
      };
    }),
  resetToOriginal: () =>
    set((state) => ({
      classes: state.originalClasses
        ? JSON.parse(JSON.stringify(state.originalClasses))
        : null,
      moveHistory: [],
    })),
  clearAssignment: () =>
    set({
      classes: null,
      summaries: null,
      originalClasses: null,
      moveHistory: [],
    }),
});
