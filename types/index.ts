export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  website?: string;
  title?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  highlights?: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  description?: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
}
