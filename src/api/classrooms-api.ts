import { apiFetch } from './client';
import type { Student } from '../types/student';
import type { AssignmentResponse } from '../types/assignment';

export function assignStudents(
  students: Student[],
  classesNumber: number,
): Promise<AssignmentResponse> {
  return apiFetch<AssignmentResponse>(
    `/classrooms?classesNumber=${classesNumber}`,
    {
      method: 'POST',
      body: JSON.stringify(students),
    },
  );
}

export function getTemplate(lang: string = 'en'): Promise<Student[]> {
  return apiFetch<Student[]>(`/template?lang=${lang}`);
}
