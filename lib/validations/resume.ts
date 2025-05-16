import { z } from "zod";

// Constants for content limits to ensure single-page resume
const CHAR_LIMITS = {
  SUMMARY_MAX: 1000,
  EXPERIENCE_DESCRIPTION_MAX: 1000,
  EDUCATION_DESCRIPTION_MAX: 1000,
  PROJECT_DESCRIPTION_MAX: 1000,
  SKILL_ITEM_MAX_LENGTH: 50,
  COMPANY_NAME_MAX: 100,
  SCHOOL_NAME_MAX: 100,
  JOB_TITLE_MAX: 100,
  DEGREE_MAX: 100,
  LOCATION_MAX: 100,
  PROJECT_NAME_MAX: 100,
};

const COUNT_LIMITS = {
  EXPERIENCE_MAX: 4,
  EDUCATION_MAX: 3,
  PROJECTS_MAX: 4,
  SKILLS_CATEGORY_MAX: 4,
  SKILLS_PER_CATEGORY_MAX: 10,
};

// Schema for personal information
const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(50, "Name is too long"),
  email: z.string().email("Invalid email address").max(50, "Email is too long"),
  phone: z.string().optional(),
  location: z
    .string()
    .max(
      CHAR_LIMITS.LOCATION_MAX,
      `Location must be ${CHAR_LIMITS.LOCATION_MAX} characters or less`
    )
    .optional(),
  summary: z
    .string()
    .max(
      CHAR_LIMITS.SUMMARY_MAX,
      `Summary must be ${CHAR_LIMITS.SUMMARY_MAX} characters or less`
    )
    .optional(),
});

// Schema for experience items
const experienceItemSchema = z
  .object({
    title: z
      .string()
      .min(1, "Job title is required")
      .max(
        CHAR_LIMITS.JOB_TITLE_MAX,
        `Job title must be ${CHAR_LIMITS.JOB_TITLE_MAX} characters or less`
      ),
    company: z
      .string()
      .min(1, "Company name is required")
      .max(
        CHAR_LIMITS.COMPANY_NAME_MAX,
        `Company name must be ${CHAR_LIMITS.COMPANY_NAME_MAX} characters or less`
      ),
    location: z
      .string()
      .max(
        CHAR_LIMITS.LOCATION_MAX,
        `Location must be ${CHAR_LIMITS.LOCATION_MAX} characters or less`
      )
      .optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    current: z.boolean().optional().default(false),
    description: z
      .string()
      .max(
        CHAR_LIMITS.EXPERIENCE_DESCRIPTION_MAX,
        `Description must be ${CHAR_LIMITS.EXPERIENCE_DESCRIPTION_MAX} characters or less`
      )
      .optional(),
  })
  .refine((data) => !(!data.current && !data.endDate), {
    message: "End date is required unless this is your current position",
    path: ["endDate"],
  });

// Schema for project items
const projectItemSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(
      CHAR_LIMITS.PROJECT_NAME_MAX,
      `Project name must be ${CHAR_LIMITS.PROJECT_NAME_MAX} characters or less`
    ),
  description: z
    .string()
    .max(
      CHAR_LIMITS.PROJECT_DESCRIPTION_MAX,
      `Description must be ${CHAR_LIMITS.PROJECT_DESCRIPTION_MAX} characters or less`
    ),
  technologies: z
    .array(z.string())
    .min(0)
    .max(10, "Maximum 10 technologies to keep your resume concise"),
  link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Schema for education items
const educationItemSchema = z.object({
  degree: z
    .string()
    .min(1, "Degree is required")
    .max(
      CHAR_LIMITS.DEGREE_MAX,
      `Degree must be ${CHAR_LIMITS.DEGREE_MAX} characters or less`
    ),
  school: z
    .string()
    .min(1, "School name is required")
    .max(
      CHAR_LIMITS.SCHOOL_NAME_MAX,
      `School name must be ${CHAR_LIMITS.SCHOOL_NAME_MAX} characters or less`
    ),
  location: z
    .string()
    .max(
      CHAR_LIMITS.LOCATION_MAX,
      `Location must be ${CHAR_LIMITS.LOCATION_MAX} characters or less`
    )
    .optional(),
  graduationDate: z.string().min(1, "Graduation date is required"),
  description: z
    .string()
    .max(
      CHAR_LIMITS.EDUCATION_DESCRIPTION_MAX,
      `Description must be ${CHAR_LIMITS.EDUCATION_DESCRIPTION_MAX} characters or less`
    )
    .optional(),
});

// Schema for skill categories
const skillItemSchema = z.object({
  category: z
    .string()
    .min(1, "Category name is required")
    .max(30, "Category name is too long"),
  items: z
    .array(
      z
        .string()
        .max(
          CHAR_LIMITS.SKILL_ITEM_MAX_LENGTH,
          `Skill item must be ${CHAR_LIMITS.SKILL_ITEM_MAX_LENGTH} characters or less`
        )
    )
    .min(1, "At least one skill is required")
    .max(
      COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX,
      `Maximum ${COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX} skills per category to fit on one page`
    ),
});

// Main resume schema
export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z
    .array(experienceItemSchema)
    .min(0)
    .max(
      COUNT_LIMITS.EXPERIENCE_MAX,
      `Maximum ${COUNT_LIMITS.EXPERIENCE_MAX} experiences to ensure your resume fits on one page`
    )
    .default([]),
  education: z
    .array(educationItemSchema)
    .min(0)
    .max(
      COUNT_LIMITS.EDUCATION_MAX,
      `Maximum ${COUNT_LIMITS.EDUCATION_MAX} education entries to ensure your resume fits on one page`
    )
    .default([]),
  projects: z
    .array(projectItemSchema)
    .min(0)
    .max(
      COUNT_LIMITS.PROJECTS_MAX,
      `Maximum ${COUNT_LIMITS.PROJECTS_MAX} projects to ensure your resume fits on one page`
    )
    .default([]),
  skills: z
    .array(skillItemSchema)
    .min(0)
    .max(
      COUNT_LIMITS.SKILLS_CATEGORY_MAX,
      `Maximum ${COUNT_LIMITS.SKILLS_CATEGORY_MAX} skill categories to ensure your resume fits on one page`
    )
    .default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;

export default resumeSchema;
