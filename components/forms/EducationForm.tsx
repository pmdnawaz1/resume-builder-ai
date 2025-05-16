"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormInput, FormTextArea } from "@/components/ui";
import { useResumeStore } from "@/lib/store";

// Character and count limits
const CHAR_LIMITS = {
  DEGREE_MAX: 100,
  SCHOOL_MAX: 100,
  LOCATION_MAX: 100,
  DESCRIPTION_MAX: 1000,
};

const COUNT_LIMITS = {
  EDUCATION_MAX: 3,
};

export default function EducationForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ResumeData>();
  
  const { updateField } = useResumeStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

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
              <Controller
                name={`education.${index}.degree`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`education.${index}.degree`}
                    label="Degree"
                    placeholder="Bachelor of Science in Computer Science"
                    required
                    maxLength={CHAR_LIMITS.DEGREE_MAX}
                    storePath={`education.${index}.degree`}
                    {...field}
                  />
                )}
              />

              {/* School */}
              <Controller
                name={`education.${index}.school`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`education.${index}.school`}
                    label="School"
                    placeholder="University of California, Berkeley"
                    required
                    maxLength={CHAR_LIMITS.SCHOOL_MAX}
                    storePath={`education.${index}.school`}
                    {...field}
                  />
                )}
              />

              {/* Location */}
              <Controller
                name={`education.${index}.location`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`education.${index}.location`}
                    label="Location"
                    placeholder="Berkeley, CA"
                    maxLength={CHAR_LIMITS.LOCATION_MAX}
                    storePath={`education.${index}.location`}
                    {...field}
                  />
                )}
              />

              {/* Graduation Date */}
              <div>
                <label
                  htmlFor={`education.${index}.graduationDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Graduation Date*
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name={`education.${index}.graduationDate`}
                    render={({ field }) => (
                      <DatePicker
                        id={`education.${index}.graduationDate`}
                        selected={parseDate(field.value)}
                        onChange={(date) => {
                          const formattedDate = formatDate(date);
                          field.onChange(formattedDate);
                          updateField(`education.${index}.graduationDate`, formattedDate || "");
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholderText="MM/YYYY"
                      />
                    )}
                  />
                </div>
                {errors.education?.[index]?.graduationDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.education[index]?.graduationDate?.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <Controller
                name={`education.${index}.description`}
                control={control}
                render={({ field }) => (
                  <FormTextArea
                    id={`education.${index}.description`}
                    label="Description"
                    placeholder="Relevant coursework, achievements, or academic projects"
                    maxLength={CHAR_LIMITS.DESCRIPTION_MAX}
                    helperText="Brief description of your coursework, academic achievements, or relevant projects."
                    storePath={`education.${index}.description`}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
