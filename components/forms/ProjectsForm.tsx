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
  NAME_MAX: 100,
  DESCRIPTION_MAX: 1000,
  LINK_MAX: 255,
};

const COUNT_LIMITS = {
  PROJECTS_MAX: 4,
  TECHNOLOGIES_MAX: 10,
};

export default function ProjectsForm() {
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
    name: "projects",
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

  // Handle technologies input
  const handleTechnologiesChange = (index: number, technologiesStr: string) => {
    const technologies = technologiesStr
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setValue(`projects.${index}.technologies`, technologies);
    updateField(`projects.${index}.technologies`, technologies);
  };

  // Get technologies as string for input
  const getTechnologiesString = (index: number): string => {
    const technologies = getValues(`projects.${index}.technologies`);
    return Array.isArray(technologies) ? technologies.join(', ') : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Projects
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add up to {COUNT_LIMITS.PROJECTS_MAX} projects to showcase your work.
            <span className="italic ml-1">This section is optional.</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              description: "",
              technologies: [],
              link: "",
              startDate: "",
              endDate: "",
            })
          }
          disabled={fields.length >= COUNT_LIMITS.PROJECTS_MAX}
          className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            fields.length >= COUNT_LIMITS.PROJECTS_MAX
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          <FiPlus className="mr-2" />
          Add Project
        </button>
      </div>

      {fields.length >= COUNT_LIMITS.PROJECTS_MAX && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Maximum limit of {COUNT_LIMITS.PROJECTS_MAX} projects reached. 
                Remove a project to add a new one.
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
              {/* Project Name */}
              <Controller
                name={`projects.${index}.name`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`projects.${index}.name`}
                    label="Project Name"
                    placeholder="AI Resume Builder"
                    required
                    maxLength={CHAR_LIMITS.NAME_MAX}
                    storePath={`projects.${index}.name`}
                    {...field}
                  />
                )}
              />

              {/* Project Link */}
              <Controller
                name={`projects.${index}.link`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`projects.${index}.link`}
                    label="Project Link"
                    placeholder="https://github.com/yourusername/project"
                    maxLength={CHAR_LIMITS.LINK_MAX}
                    storePath={`projects.${index}.link`}
                    {...field}
                  />
                )}
              />

              {/* Technologies */}
              <div className="md:col-span-2">
                <label
                  htmlFor={`projects.${index}.technologies`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Technologies
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id={`projects.${index}.technologies`}
                    placeholder="React, TypeScript, Node.js (comma separated)"
                    value={getTechnologiesString(index)}
                    onChange={(e) => handleTechnologiesChange(index, e.target.value)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Enter up to {COUNT_LIMITS.TECHNOLOGIES_MAX} technologies, separated by commas
                </p>
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor={`projects.${index}.startDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name={`projects.${index}.startDate`}
                    render={({ field }) => (
                      <DatePicker
                        id={`projects.${index}.startDate`}
                        selected={parseDate(field.value)}
                        onChange={(date) => {
                          const formattedDate = formatDate(date);
                          field.onChange(formattedDate);
                          updateField(`projects.${index}.startDate`, formattedDate || "");
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholderText="MM/YYYY"
                      />
                    )}
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor={`projects.${index}.endDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  End Date
                </label>
                <div className="mt-1">
                  <Controller
                    control={control}
                    name={`projects.${index}.endDate`}
                    render={({ field }) => (
                      <DatePicker
                        id={`projects.${index}.endDate`}
                        selected={parseDate(field.value)}
                        onChange={(date) => {
                          const formattedDate = formatDate(date);
                          field.onChange(formattedDate);
                          updateField(`projects.${index}.endDate`, formattedDate || "");
                        }}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholderText="MM/YYYY or leave blank for ongoing"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Controller
                  name={`projects.${index}.description`}
                  control={control}
                  render={({ field }) => (
                    <FormTextArea
                      id={`projects.${index}.description`}
                      label="Description"
                      placeholder="Describe your project, its features, and your contributions..."
                      rows={4}
                      maxLength={CHAR_LIMITS.DESCRIPTION_MAX}
                      storePath={`projects.${index}.description`}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="flex justify-center py-8">
            <button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  description: "",
                  technologies: [],
                  link: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <FiPlus className="mr-2" />
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 