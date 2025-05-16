import { FieldError } from 'react-hook-form';

export type PersonalInfoErrors = {
  fullName?: FieldError;
  jobTitle?: FieldError;
  email?: FieldError;
  phone?: FieldError;
  location?: FieldError;
  website?: FieldError;
  summary?: FieldError;
  [key: string]: any;
};

export type ExperienceErrors = {
  title?: FieldError;
  company?: FieldError;
  location?: FieldError;
  startDate?: FieldError;
  endDate?: FieldError;
  current?: FieldError;
  description?: FieldError;
  [key: string]: any;
};

export type EducationErrors = {
  degree?: FieldError;
  school?: FieldError;
  graduationDate?: FieldError;
  gpa?: FieldError;
  [key: string]: any;
};

export type SkillsErrors = {
  category?: FieldError;
  items?: (FieldError | undefined)[];
  [key: string]: any;
};