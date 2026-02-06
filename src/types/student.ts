export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const Grade = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;
export type Grade = (typeof Grade)[keyof typeof Grade];

export interface Student {
  name: string;
  school: string;
  gender: Gender;
  academicPerformance: Grade;
  behavioralPerformance: Grade;
  comments: string;
  friend1: string;
  friend2: string;
  friend3: string;
  friend4: string;
  notWith?: string;
  clusterId?: number;
}
