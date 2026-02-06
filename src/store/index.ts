import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStudentSlice, type StudentSlice } from './student-slice';
import {
  createAssignmentSlice,
  type AssignmentSlice,
} from './assignment-slice';
import { createUiSlice, type UiSlice } from './ui-slice';

export type AppStore = StudentSlice & AssignmentSlice & UiSlice;

export const useStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createStudentSlice(...a),
      ...createAssignmentSlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: 'classrooms-store',
      partialize: (state) => ({
        students: state.students,
        language: state.language,
        classCount: state.classCount,
      }),
    },
  ),
);
