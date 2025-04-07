"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Character and count limits
const CHAR_LIMITS = {
  DEGREE_MAX: 60,
  SCHOOL_MAX: 60,
  LOCATION_MAX: 50,
  DESCRIPTION_MAX: 200,
};

const COUNT_LIMITS = {
  EDUCATION_MAX: 3,
};

export default function EducationForm() {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const watchDegreeFields = fields.map(
    (_, index) => watch(`education.${index}.degree`) || ""
  );
  const watchSchoolFields = fields.map(
    (_, index) => watch(`education.${index}.school`) || ""
  );
  const watchLocationFields = fields.map(
    (_, index) => watch(`education.${index}.location`) || ""
  );
  const watchDescriptionFields = fields.map(
    (_, index) => watch(`education.${index}.description`) || ""
  );

  // Character count tracking
  const [charCounts, setCharCounts] = useState({
    degrees: Array(fields.length).fill(0),
    schools: Array(fields.length).fill(0),
    locations: Array(fields.length).fill(0),
    descriptions: Array(fields.length).fill(0),
  });

  // Update character counts when fields change
  useEffect(() => {
    setCharCounts({
      degrees: watchDegreeFields.map((degree) => degree.length),
      schools: watchSchoolFields.map((school) => school.length),
      locations: watchLocationFields.map((location) => location.length),
      descriptions: watchDescriptionFields.map((desc) => desc.length),
    });
  }, [
    watchDegreeFields,
    watchSchoolFields,
    watchLocationFields,
    watchDescriptionFields,
  ]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const [year, month] = dateString.split("-").map(Number);
    return new Date(year, month - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Education
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add up to {COUNT_LIMITS.EDUCATION_MAX} educational backgrounds to
            ensure your resume fits on one page.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              degree: "",
              school: "",
              location: "",
              graduationDate: "",
              description: "",
            })
          }
          disabled={fields.length >= COUNT_LIMITS.EDUCATION_MAX}
          className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            fields.length >= COUNT_LIMITS.EDUCATION_MAX
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          <FiPlus className="mr-2" />
          Add Education
        </button>
      </div>

      {fields.length >= COUNT_LIMITS.EDUCATION_MAX && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Maximum limit of {COUNT_LIMITS.EDUCATION_MAX} educational
                entries reached. Remove an entry to add a new one.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg"
          >
            {/* Remove Button */}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Degree */}
              <div>
                <label
                  htmlFor={`education.${index}.degree`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Degree*
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`education.${index}.degree`)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className={`text-xs ${
                        charCounts.degrees[index] > CHAR_LIMITS.DEGREE_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.degrees[index] || 0}/{CHAR_LIMITS.DEGREE_MAX}
                    </span>
                  </div>
                </div>
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.degree?.message}
                  </p>
                )}
              </div>

              {/* School */}
              <div>
                <label
                  htmlFor={`education.${index}.school`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  School*
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`education.${index}.school`)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className={`text-xs ${
                        charCounts.schools[index] > CHAR_LIMITS.SCHOOL_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.schools[index] || 0}/{CHAR_LIMITS.SCHOOL_MAX}
                    </span>
                  </div>
                </div>
                {errors.education?.[index]?.school && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.school?.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor={`education.${index}.location`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`education.${index}.location`)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className={`text-xs ${
                        charCounts.locations[index] > CHAR_LIMITS.LOCATION_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.locations[index] || 0}/
                      {CHAR_LIMITS.LOCATION_MAX}
                    </span>
                  </div>
                </div>
                {errors.education?.[index]?.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.location?.message}
                  </p>
                )}
              </div>

              {/* Graduation Date */}
              <div>
                <label
                  htmlFor={`education.${index}.graduationDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Graduation Date*
                </label>
                <Controller
                  control={control}
                  name={`education.${index}.graduationDate`}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      selected={parseDate(value)}
                      onChange={(date: Date) => onChange(formatDate(date))}
                      dateFormat="yyyy-MM"
                      showMonthYearPicker
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}
                />
                {errors.education?.[index]?.graduationDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.graduationDate?.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label
                  htmlFor={`education.${index}.description`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <div className="mt-1 relative">
                  <textarea
                    {...register(`education.${index}.description`)}
                    rows={3}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Describe your achievements, relevant coursework, etc."
                  />
                  <div className="absolute bottom-2 right-2">
                    <span
                      className={`text-xs ${
                        charCounts.descriptions[index] >
                        CHAR_LIMITS.DESCRIPTION_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.descriptions[index] || 0}/
                      {CHAR_LIMITS.DESCRIPTION_MAX}
                    </span>
                  </div>
                </div>
                {errors.education?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.description?.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Optional. Keep it brief to ensure your resume fits on one
                  page.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
