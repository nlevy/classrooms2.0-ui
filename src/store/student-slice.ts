import type { StateCreator } from 'zustand';
import type { Student } from '../types/student';

export interface StudentSlice {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (index: number, student: Student) => void;
  removeStudents: (indices: number[]) => void;
  clearStudents: () => void;
}

export const createStudentSlice: StateCreator<StudentSlice> = (set) => ({
  students: [],
  setStudents: (students) => set({ students }),
  addStudent: (student) =>
    set((state) => ({ students: [...state.students, student] })),
  updateStudent: (index, student) =>
    set((state) => {
      const students = [...state.students];
      students[index] = student;
      return { students };
    }),
  removeStudents: (indices) =>
    set((state) => ({
      students: state.students.filter((_, i) => !indices.includes(i)),
    })),
  clearStudents: () => set({ students: [] }),
});
