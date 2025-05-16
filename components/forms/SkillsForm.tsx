"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import { FormInput, FormTextArea } from "@/components/ui";
import { useResumeStore } from "@/lib/store";

// Character and count limits
const CHAR_LIMITS = {
  CATEGORY_MAX: 50,
  ITEM_MAX: 500,
};

const COUNT_LIMITS = {
  SKILLS_MAX: 5,
};

export default function SkillsForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ResumeData>();
  
  const { updateField } = useResumeStore();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Skills
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add up to {COUNT_LIMITS.SKILLS_MAX} skill categories to showcase
            your expertise.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            append({
              category: "",
              items: [],
            })
          }
          disabled={fields.length >= COUNT_LIMITS.SKILLS_MAX}
          className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            fields.length >= COUNT_LIMITS.SKILLS_MAX
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          <FiPlus className="mr-2" />
          Add Skill Category
        </button>
      </div>

      {fields.length >= COUNT_LIMITS.SKILLS_MAX && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Maximum limit of {COUNT_LIMITS.SKILLS_MAX} skill categories
                reached. Remove a category to add a new one.
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

            <div className="space-y-6">
              {/* Category */}
              <Controller
                name={`skills.${index}.category`}
                control={control}
                render={({ field }) => (
                  <FormInput
                    id={`skills.${index}.category`}
                    label="Category"
                    placeholder="Programming Languages, Tools, Soft Skills, etc."
                    required
                    maxLength={CHAR_LIMITS.CATEGORY_MAX}
                    storePath={`skills.${index}.category`}
                    {...field}
                  />
                )}
              />

              {/* Items */}
              <div className="space-y-2">
                <label
                  htmlFor={`skills.${index}.items`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Skills
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Controller
                    name={`skills.${index}.items`}
                    control={control}
                    render={({ field: { onChange, value, ...restField } }) => (
                      <textarea
                        id={`skills.${index}.items`}
                        className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                        rows={3}
                        value={Array.isArray(value) ? value.join(", ") : value}
                        onChange={(e) => {
                          // Split the comma-separated string into an array
                          const items = e.target.value.split(',').map(item => item.trim());
                          onChange(items);
                          updateField(`skills.${index}.items`, items);
                        }}
                        {...restField}
                      />
                    )}
                  />
                  <div className="absolute bottom-2 right-2">
                    <span
                      className={`text-xs text-gray-400 dark:text-gray-500`}
                    >
                      Use commas to separate skills
                    </span>
                  </div>
                </div>
                {errors.skills?.[index]?.items && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.skills[index]?.items?.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  List skills relevant to the position you're applying for,
                  prioritizing the most important ones first.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
