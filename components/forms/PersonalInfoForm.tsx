"use client";

import { useFormContext } from "react-hook-form";
import { ResumeData } from "@/types";
import { useState, useEffect } from "react";

// Character limits for resume content
const CHAR_LIMITS = {
  SUMMARY_MAX: 500,
  LOCATION_MAX: 50,
  FULL_NAME_MAX: 50,
  EMAIL_MAX: 50,
};

export default function PersonalInfoForm() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<ResumeData>();

  // Watch fields to show character count
  const summary = watch("personalInfo.summary") || "";
  const fullName = watch("personalInfo.fullName") || "";
  const email = watch("personalInfo.email") || "";
  const location = watch("personalInfo.location") || "";

  const [summaryChars, setSummaryChars] = useState(0);
  const [nameChars, setNameChars] = useState(0);
  const [emailChars, setEmailChars] = useState(0);
  const [locationChars, setLocationChars] = useState(0);

  // Update character counts when fields change
  useEffect(() => {
    setSummaryChars(summary.length);
    setNameChars(fullName.length);
    setEmailChars(email.length);
    setLocationChars(location.length);
  }, [summary, fullName, email, location]);

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
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name*
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="fullName"
              {...register("personalInfo.fullName")}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className={`text-xs ${
                  nameChars > CHAR_LIMITS.FULL_NAME_MAX
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {nameChars}/{CHAR_LIMITS.FULL_NAME_MAX}
              </span>
            </div>
          </div>
          {errors.personalInfo?.fullName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.personalInfo.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email*
          </label>
          <div className="mt-1 relative">
            <input
              type="email"
              id="email"
              {...register("personalInfo.email")}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className={`text-xs ${
                  emailChars > CHAR_LIMITS.EMAIL_MAX
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {emailChars}/{CHAR_LIMITS.EMAIL_MAX}
              </span>
            </div>
          </div>
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register("personalInfo.phone")}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="location"
              {...register("personalInfo.location")}
              placeholder="City, Country"
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className={`text-xs ${
                  locationChars > CHAR_LIMITS.LOCATION_MAX
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {locationChars}/{CHAR_LIMITS.LOCATION_MAX}
              </span>
            </div>
          </div>
          {errors.personalInfo?.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-500">
              {errors.personalInfo.location.message}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Professional Summary
        </label>
        <div className="mt-1 relative">
          <textarea
            id="summary"
            rows={4}
            {...register("personalInfo.summary")}
            placeholder="Brief overview of your professional background and career goals (recommended: 2-4 sentences)"
            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute bottom-2 right-2">
            <span
              className={`text-xs ${
                summaryChars > CHAR_LIMITS.SUMMARY_MAX
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {summaryChars}/{CHAR_LIMITS.SUMMARY_MAX}
            </span>
          </div>
        </div>
        {errors.personalInfo?.summary && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">
            {errors.personalInfo.summary.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Keep your summary concise to ensure your resume fits on one page.
        </p>
      </div>
    </div>
  );
}
