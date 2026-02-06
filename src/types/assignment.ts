import type { Student } from './student';

export interface ClassSummary {
  classNumber: number;
  studentsCount: number;
  malesCount: number;
  averageAcademicPerformance: number;
  averageBehaviouralPerformance: number;
  withoutFriends: number;
  unwantedMatches: number;
}

export interface AssignmentResponse {
  classes: Record<string, Student[]>;
  summaries: ClassSummary[];
}
