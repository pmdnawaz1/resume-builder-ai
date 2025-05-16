"use client";

import { useFormContext, Controller } from "react-hook-form";
import { ResumeData } from "@/types";
import { FormInput } from "@/components/ui/FormInput";
import { FormTextArea } from "@/components/ui/FormTextArea";
import { useResumeStore } from "@/lib/store";

// Character limits for resume content
const CHAR_LIMITS = {
  SUMMARY_MAX: 1000,
  LOCATION_MAX: 100,
  FULL_NAME_MAX: 100,
  EMAIL_MAX: 100,
};

export default function PersonalInfoForm() {
  const { control, register } = useFormContext<ResumeData>();
  const { resumeData } = useResumeStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Complete these details carefully to ensure your resume fits on a
          single page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <Controller
          name="personalInfo.fullName"
          control={control}
          render={({ field }) => (
            <FormInput
              id="fullName"
              label="Full Name"
              placeholder="John Doe"
              required
              maxLength={CHAR_LIMITS.FULL_NAME_MAX}
              storePath="personalInfo.fullName"
              {...field}
            />
          )}
        />

        {/* Email */}
        <Controller
          name="personalInfo.email"
          control={control}
          render={({ field }) => (
            <FormInput
              id="email"
              label="Email"
              type="email"
              placeholder="johndoe@example.com"
              required
              maxLength={CHAR_LIMITS.EMAIL_MAX}
              storePath="personalInfo.email"
              {...field}
            />
          )}
        />

        {/* Phone */}
        <Controller
          name="personalInfo.phone"
          control={control}
          render={({ field }) => (
            <FormInput
              id="phone"
              label="Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              storePath="personalInfo.phone"
              {...field}
            />
          )}
        />

        {/* Location */}
        <Controller
          name="personalInfo.location"
          control={control}
          render={({ field }) => (
            <FormInput
              id="location"
              label="Location"
              placeholder="City, Country"
              maxLength={CHAR_LIMITS.LOCATION_MAX}
              storePath="personalInfo.location"
              {...field}
            />
          )}
        />
      </div>

      {/* Summary */}
      <Controller
        name="personalInfo.summary"
        control={control}
        render={({ field }) => (
          <FormTextArea
            id="summary"
            label="Professional Summary"
            placeholder="Brief overview of your professional background and career goals (recommended: 3-5 sentences)"
            maxLength={CHAR_LIMITS.SUMMARY_MAX}
            helperText="Keep your summary concise to ensure your resume fits on one page."
            storePath="personalInfo.summary"
            {...field}
          />
        )}
      />
    </div>
  );
}
