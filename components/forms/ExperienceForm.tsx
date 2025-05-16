"use client";

import { useEffect } from "react";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormInput, FormTextArea } from "@/components/ui";
import { useResumeStore } from "@/lib/store";

// Character and count limits
const CHAR_LIMITS = {
  TITLE_MAX: 100,
  COMPANY_MAX: 100,
  LOCATION_MAX: 100,
  DESCRIPTION_MAX: 1000,
};

const COUNT_LIMITS = {
  EXPERIENCE_MAX: 4,
};

export default function ExperienceForm() {
  const {
    control,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useFormContext<ResumeData>();
  
  const { updateField } = useResumeStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience",
  });

  const watchCurrentFields = fields.map((_, index) =>
    watch(`experience.${index}.current`)
  );

  // Update endDate when current is checked
  useEffect(() => {
    fields.forEach((_, index) => {
      if (watchCurrentFields[index]) {
        // Only update if the value is not already empty
        const currentEndDate = getValues(`experience.${index}.endDate`);
        if (currentEndDate) {
          setValue(`experience.${index}.endDate`, "");
          updateField(`experience.${index}.endDate`, "");
        }
      }
    });
  }, [watchCurrentFields, setValue, getValues, fields, updateField]);

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

  // Handle current position checkbox change
  const handleCurrentChange = (index: number, checked: boolean) => {
    setValue(`experience.${index}.current`, checked);
    updateField(`experience.${index}.current`, checked);
    
    if (checked) {
      setValue(`experience.${index}.endDate`, "");
      updateField(`experience.${index}.endDate`, "");
    }
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
              <Controller
                name={`experience.${index}.title`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`experience.${index}.title`}
                    label="Job Title"
                    placeholder="Software Engineer"
                    required
                    maxLength={CHAR_LIMITS.TITLE_MAX}
                    storePath={`experience.${index}.title`}
                    {...field}
                  />
                )}
              />

              {/* Company */}
              <Controller
                name={`experience.${index}.company`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`experience.${index}.company`}
                    label="Company"
                    placeholder="Google"
                    required
                    maxLength={CHAR_LIMITS.COMPANY_MAX}
                    storePath={`experience.${index}.company`}
                    {...field}
                  />
                )}
              />

              {/* Location */}
              <Controller
                name={`experience.${index}.location`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`experience.${index}.location`}
                    label="Location"
                    placeholder="Mountain View, CA"
                    maxLength={CHAR_LIMITS.LOCATION_MAX}
                    storePath={`experience.${index}.location`}
                    {...field}
                  />
                )}
              />

              {/* Start Date */}
              <div>
                <label
                  htmlFor={`experience.${index}.startDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date*
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name={`experience.${index}.startDate`}
                    render={({ field }) => (
                      <DatePicker
                        id={`experience.${index}.startDate`}
                        selected={parseDate(field.value)}
                        onChange={(date) => {
                          const formattedDate = formatDate(date);
                          field.onChange(formattedDate);
                          updateField(`experience.${index}.startDate`, formattedDate || "");
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholderText="MM/YYYY"
                      />
                    )}
                  />
                </div>
                {errors.experience?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.experience[index]?.startDate?.message}
                  </p>
                )}
              </div>

              {/* Current Position */}
              <div className="flex items-center mt-6">
                <Controller
                  name={`experience.${index}.current`}
                  control={control}
                  render={({ field: { value, onChange, ...restField } }) => (
                    <input
                      id={`experience.${index}.current`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                        handleCurrentChange(index, e.target.checked);
                      }}
                      {...restField}
                    />
                  )}
                />
                <label
                  htmlFor={`experience.${index}.current`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  I currently work here
                </label>
              </div>

              {/* End Date */}
              {!watchCurrentFields[index] && (
                <div>
                  <label
                    htmlFor={`experience.${index}.endDate`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date*
                  </label>
                  <div className="mt-1">
                    <Controller
                      control={control}
                      name={`experience.${index}.endDate`}
                      render={({ field }) => (
                        <DatePicker
                          id={`experience.${index}.endDate`}
                          selected={parseDate(field.value || '')}
                          onChange={(date) => {
                            const formattedDate = formatDate(date);
                            field.onChange(formattedDate);
                            updateField(`experience.${index}.endDate`, formattedDate || "");
                          }}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholderText="MM/YYYY"
                        />
                      )}
                    />
                  </div>
                  {errors.experience?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.experience[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <Controller
                name={`experience.${index}.description`}
                control={control}
                render={({ field }) => (
                  <FormTextArea
                    id={`experience.${index}.description`}
                    label="Description"
                    placeholder="Describe your responsibilities, achievements, and technologies used"
                    maxLength={CHAR_LIMITS.DESCRIPTION_MAX}
                    helperText="Use bullet points starting with action verbs for better readability."
                    storePath={`experience.${index}.description`}
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
