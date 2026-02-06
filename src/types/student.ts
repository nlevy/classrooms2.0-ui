export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum Grade {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

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
