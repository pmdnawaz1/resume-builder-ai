import { z } from 'zod';

// Helper schemas for reusable validation patterns
const nonEmptyString = z.string().min(1, 'This field is required');
const dateString = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Use YYYY-MM or YYYY-MM-DD format');
const emailString = z.string().email('Invalid email address');
const phoneString = z.string().regex(/^\+?[\d\s-()]{10,}$/, 'Invalid phone number format');

// Personal Info Schema
const personalInfoSchema = z.object({
  fullName: nonEmptyString,
  email: emailString,
  phone: phoneString.max(20, 'Phone number is too long').optional(),
  location: z.string().max(100, 'Location is too long').optional(),
  summary: z.string().max(500, 'Summary should be less than 500 characters').optional(),
});

// Experience Schema
const experienceSchema = z.object({
  title: nonEmptyString.max(100, 'Title is too long'),
  company: nonEmptyString.max(100, 'Company name is too long'),
  location: z.string().max(100, 'Location is too long').optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  current: z.boolean(),
  description: z.string().max(1000, 'Description is too long').optional(),
}).refine(
  (data) => {
    // If current is true, endDate is not required
    // If current is false, endDate is required
    if (data.current) {
      return true;
    }
    return !!data.endDate;
  },
  {
    message: "End date is required for past positions",
    path: ["endDate"],
  }
);

// Education Schema
const educationSchema = z.object({
  degree: nonEmptyString.max(100, 'Degree name is too long'),
  school: nonEmptyString.max(100, 'School name is too long'),
  location: z.string().max(100, 'Location is too long').optional(),
  graduationDate: dateString.optional(),
  description: z.string().max(500, 'Description is too long').optional(),
});

// Skills Schema
const skillSchema = z.object({
  category: nonEmptyString.max(50, 'Category name is too long'),
  items: z.array(z.string().max(50, 'Skill name is too long')).min(1, 'Add at least one skill'),
});

// Complete Resume Schema
export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  experience: z.array(experienceSchema).optional().default([]),
  education: z.array(educationSchema).optional().default([]),
  skills: z.array(skillSchema).optional().default([]),
});

export type ResumeData = z.infer<typeof resumeSchema>;

// Validation Messages
export const validationMessages = {
  required: 'This field is required',
  invalidEmail: 'Invalid email address',
  invalidPhone: 'Invalid phone number format',
  invalidDate: 'Use YYYY-MM or YYYY-MM-DD format',
  tooLong: (field: string, max: number) => `${field} should be less than ${max} characters`,
  minItems: (field: string) => `Add at least one ${field}`,
} as const;

// Helper function to validate a single section
export const validateSection = async <T extends keyof ResumeData>(
  section: T,
  data: ResumeData[T]
): Promise<{ success: boolean; errors?: Record<string, string> }> => {
  try {
    const sectionSchema = resumeSchema.shape[section];
    await sectionSchema.parseAsync(data);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { success: false, errors };
    }
    return { success: false, errors: { _error: 'Validation failed' } };
  }
};
