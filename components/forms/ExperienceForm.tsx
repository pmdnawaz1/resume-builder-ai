"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Character and count limits
const CHAR_LIMITS = {
  TITLE_MAX: 60,
  COMPANY_MAX: 60,
  LOCATION_MAX: 50,
  DESCRIPTION_MAX: 300,
};

const COUNT_LIMITS = {
  EXPERIENCE_MAX: 4,
};

export default function ExperienceForm() {
  const {
    register,
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const watchCurrentFields = fields.map((_, index) =>
    watch(`experience.${index}.current`)
  );
  const watchDescriptionFields = fields.map(
    (_, index) => watch(`experience.${index}.description`) || ""
  );
  const watchTitleFields = fields.map(
    (_, index) => watch(`experience.${index}.title`) || ""
  );
  const watchCompanyFields = fields.map(
    (_, index) => watch(`experience.${index}.company`) || ""
  );
  const watchLocationFields = fields.map(
    (_, index) => watch(`experience.${index}.location`) || ""
  );

  // Character count tracking
  const [charCounts, setCharCounts] = useState({
    titles: Array(fields.length).fill(0),
    companies: Array(fields.length).fill(0),
    locations: Array(fields.length).fill(0),
    descriptions: Array(fields.length).fill(0),
  });

  // Update character counts when fields change
  useEffect(() => {
    setCharCounts({
      titles: watchTitleFields.map((title) => title.length),
      companies: watchCompanyFields.map((company) => company.length),
      locations: watchLocationFields.map((location) => location.length),
      descriptions: watchDescriptionFields.map((desc) => desc.length),
    });
  }, [
    watchTitleFields,
    watchCompanyFields,
    watchLocationFields,
    watchDescriptionFields,
  ]);

  useEffect(() => {
    fields.forEach((_, index) => {
      if (watchCurrentFields[index]) {
        // Only update if the value is not already empty
        const currentEndDate = getValues(`experience.${index}.endDate`);
        if (currentEndDate) {
          setValue(`experience.${index}.endDate`, "");
        }
      }
    });
  }, [watchCurrentFields, setValue, getValues, fields]);

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
            Work Experience
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add up to {COUNT_LIMITS.EXPERIENCE_MAX} experiences to ensure your
            resume fits on one page.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              title: "",
              company: "",
              location: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            })
          }
          disabled={fields.length >= COUNT_LIMITS.EXPERIENCE_MAX}
          className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            fields.length >= COUNT_LIMITS.EXPERIENCE_MAX
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          <FiPlus className="mr-2" />
          Add Experience
        </button>
      </div>

      {fields.length >= COUNT_LIMITS.EXPERIENCE_MAX && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Maximum limit of {COUNT_LIMITS.EXPERIENCE_MAX} experiences
                reached. Remove an experience to add a new one.
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
              {/* Job Title */}
              <div>
                <label
                  htmlFor={`experience.${index}.title`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Job Title*
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`experience.${index}.title`)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className={`text-xs ${
                        charCounts.titles[index] > CHAR_LIMITS.TITLE_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.titles[index] || 0}/{CHAR_LIMITS.TITLE_MAX}
                    </span>
                  </div>
                </div>
                {errors.experience?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.title?.message}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label
                  htmlFor={`experience.${index}.company`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Company*
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`experience.${index}.company`)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span
                      className={`text-xs ${
                        charCounts.companies[index] > CHAR_LIMITS.COMPANY_MAX
                          ? "text-red-500"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {charCounts.companies[index] || 0}/
                      {CHAR_LIMITS.COMPANY_MAX}
                    </span>
                  </div>
                </div>
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.company?.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor={`experience.${index}.location`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    {...register(`experience.${index}.location`)}
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
                {errors.experience?.[index]?.location && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.location?.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor={`experience.${index}.startDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date*
                </label>
                <Controller
                  control={control}
                  name={`experience.${index}.startDate`}
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
                {errors.experience?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              {/* End Date / Current */}
              <div>
                <label
                  htmlFor={`experience.${index}.endDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date
                </label>
                <div className="flex items-center space-x-4">
                  <Controller
                    control={control}
                    name={`experience.${index}.endDate`}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        selected={parseDate(value)}
                        onChange={(date: Date) => onChange(formatDate(date))}
                        dateFormat="yyyy-MM"
                        showMonthYearPicker
                        disabled={watchCurrentFields[index]}
                        className={`mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          watchCurrentFields[index]
                            ? "bg-gray-100 dark:bg-gray-600"
                            : ""
                        }`}
                      />
                    )}
                  />
                  <label className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Current
                    </span>
                  </label>
                </div>
                {errors.experience?.[index]?.endDate &&
                  !watchCurrentFields[index] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.experience[index]?.endDate?.message}
                    </p>
                  )}
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label
                  htmlFor={`experience.${index}.description`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <div className="mt-1 relative">
                  <textarea
                    {...register(`experience.${index}.description`)}
                    rows={4}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="• Use bullet points to describe your responsibilities and achievements&#10;• Start each point with an action verb&#10;• Include quantifiable achievements when possible"
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
                {errors.experience?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.description?.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Keep descriptions concise to fit on one page. Use bullet
                  points for better readability.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
