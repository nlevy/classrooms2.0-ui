import { Gender, Grade } from '../../types/student.ts';

export const HEBREW_COLUMN_MAP: Record<string, string> = {
  'שם התלמיד': 'name',
  'בית ספר': 'school',
  'מגדר': 'gender',
  'לימודי': 'academicPerformance',
  'התנהגותי': 'behavioralPerformance',
  'הערות': 'comments',
  'חבר 1': 'friend1',
  'חבר 2': 'friend2',
  'חבר 3': 'friend3',
  'חבר 4': 'friend4',
  'לא עם': 'notWith',
  'מקבץ': 'clusterId',
};

export const HEBREW_GENDER_MAP: Record<string, Gender> = {
  'ז': Gender.MALE,
  'נ': Gender.FEMALE,
};

export const HEBREW_GRADE_MAP: Record<string, Grade> = {
  'א': Grade.LOW,
  'נמוך': Grade.LOW,
  'ב': Grade.MEDIUM,
  'בינוני': Grade.MEDIUM,
  'ג': Grade.HIGH,
  'גבוה': Grade.HIGH,
};
