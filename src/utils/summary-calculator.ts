import type { Student } from '../types/student.ts';
import { Gender, Grade } from '../types/student.ts';
import type { ClassSummary } from '../types/assignment.ts';

const GRADE_VALUES: Record<string, number> = {
  [Grade.LOW]: 1,
  [Grade.MEDIUM]: 2,
  [Grade.HIGH]: 3,
};

function gradeToNumber(grade: string): number {
  return GRADE_VALUES[grade] ?? 0;
}

function hasFriendInClass(student: Student, classmates: Student[]): boolean {
  const classmateNames = new Set(classmates.map((s) => s.name));
  const friends = [student.friend1, student.friend2, student.friend3, student.friend4].filter(
    (f) => f && f.trim() !== '',
  );
  if (friends.length === 0) return true;
  return friends.some((f) => classmateNames.has(f));
}

function countUnwantedMatches(students: Student[]): number {
  const nameSet = new Set(students.map((s) => s.name));
  let count = 0;
  for (const student of students) {
    if (!student.notWith || student.notWith.trim() === '') continue;
    const notWithNames = student.notWith.split(',').map((n) => n.trim()).filter((n) => n !== '');
    for (const unwanted of notWithNames) {
      if (nameSet.has(unwanted)) {
        count++;
        break;
      }
    }
  }
  return count;
}

export function recalculateSummaries(
  classes: Record<string, Student[]>,
): ClassSummary[] {
  return Object.entries(classes)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([key, students]) => {
      const studentsCount = students.length;
      const malesCount = students.filter((s) => s.gender === Gender.MALE).length;

      const averageAcademicPerformance =
        studentsCount > 0
          ? students.reduce((sum, s) => sum + gradeToNumber(s.academicPerformance), 0) /
            studentsCount
          : 0;

      const averageBehaviouralPerformance =
        studentsCount > 0
          ? students.reduce((sum, s) => sum + gradeToNumber(s.behavioralPerformance), 0) /
            studentsCount
          : 0;

      const withoutFriends = students.filter((s) => !hasFriendInClass(s, students)).length;

      const unwantedMatches = countUnwantedMatches(students);

      return {
        classNumber: Number(key),
        studentsCount,
        malesCount,
        averageAcademicPerformance: Math.round(averageAcademicPerformance * 100) / 100,
        averageBehaviouralPerformance: Math.round(averageBehaviouralPerformance * 100) / 100,
        withoutFriends,
        unwantedMatches,
      };
    });
}
