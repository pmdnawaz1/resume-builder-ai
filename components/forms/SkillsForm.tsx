"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { FiPlus, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { ResumeData } from "@/types";
import { useState, useEffect } from "react";

// Character and count limits
const CHAR_LIMITS = {
  CATEGORY_MAX: 30,
  SKILL_ITEM_MAX: 30,
};

const COUNT_LIMITS = {
  SKILLS_CATEGORY_MAX: 4,
  SKILLS_PER_CATEGORY_MAX: 10,
};

export default function SkillsForm() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const watchCategoryFields = fields.map(
    (_, index) => watch(`skills.${index}.category`) || ""
  );

  const [newCategory, setNewCategory] = useState<string>("");
  const [newSkills, setNewSkills] = useState<{ [key: number]: string }>({});
  const [categoryChars, setCategoryChars] = useState<number[]>(
    Array(fields.length).fill(0)
  );
  const [newCategoryChars, setNewCategoryChars] = useState<number>(0);
  const [newSkillChars, setNewSkillChars] = useState<{ [key: number]: number }>(
    {}
  );

  // Update character counts when fields change
  useEffect(() => {
    setCategoryChars(watchCategoryFields.map((cat) => cat.length));
    setNewCategoryChars(newCategory.length);
  }, [watchCategoryFields, newCategory]);

  const handleAddSkill = (index: number) => {
    const skillToAdd = newSkills[index]?.trim();
    if (skillToAdd) {
      const currentSkills = getValues(`skills.${index}.items`) || [];

      // Check if we've reached the maximum number of skills per category
      if (currentSkills.length >= COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX) {
        // Show an error or alert here if needed
        return;
      }

      setValue(`skills.${index}.items`, [...currentSkills, skillToAdd]);

      // Only clear the specific category's input
      setNewSkills((prev) => ({ ...prev, [index]: "" }));
      setNewSkillChars((prev) => ({ ...prev, [index]: 0 }));
    }
  };

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const currentSkills = getValues(`skills.${index}.items`) || [];
    const updatedSkills = currentSkills.filter(
      (_, index) => index !== skillIndex
    );
    setValue(`skills.${categoryIndex}.items`, updatedSkills);
  };

  const handleSkillInputChange = (index: number, value: string) => {
    setNewSkills((prev) => ({ ...prev, [index]: value }));
    setNewSkillChars((prev) => ({ ...prev, [index]: value.length }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Skills
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add up to {COUNT_LIMITS.SKILLS_CATEGORY_MAX} skill categories with a
            maximum of {COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX} skills each.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="px-3 py-2 text-sm border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 w-44"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span
                className={`text-xs ${
                  newCategoryChars > CHAR_LIMITS.CATEGORY_MAX
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                {newCategoryChars}/{CHAR_LIMITS.CATEGORY_MAX}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (
                newCategory.trim() &&
                fields.length < COUNT_LIMITS.SKILLS_CATEGORY_MAX
              ) {
                append({ category: newCategory.trim(), items: [] });
                setNewCategory("");
                setNewCategoryChars(0);
              }
            }}
            disabled={
              fields.length >= COUNT_LIMITS.SKILLS_CATEGORY_MAX ||
              !newCategory.trim() ||
              newCategory.length > CHAR_LIMITS.CATEGORY_MAX
            }
            className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              fields.length >= COUNT_LIMITS.SKILLS_CATEGORY_MAX ||
              !newCategory.trim() ||
              newCategory.length > CHAR_LIMITS.CATEGORY_MAX
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            <FiPlus className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {fields.length >= COUNT_LIMITS.SKILLS_CATEGORY_MAX && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/30 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                Maximum limit of {COUNT_LIMITS.SKILLS_CATEGORY_MAX} skill
                categories reached. Remove a category to add a new one.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {fields.map((field, index) => {
          const skillItems = getValues(`skills.${index}.items`) || [];

          return (
            <div
              key={field.id}
              className="relative bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg"
            >
              {/* Remove Category Button */}
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                {/* Category Name */}
                <div>
                  <label
                    htmlFor={`skills.${index}.category`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      {...register(`skills.${index}.category`)}
                      className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span
                        className={`text-xs ${
                          categoryChars[index] > CHAR_LIMITS.CATEGORY_MAX
                            ? "text-red-500"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {categoryChars[index] || 0}/{CHAR_LIMITS.CATEGORY_MAX}
                      </span>
                    </div>
                  </div>
                  {errors.skills?.[index]?.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.skills[index]?.category?.message}
                    </p>
                  )}
                </div>

                {/* Skills List */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Skills
                  </label>
                  {skillItems.length >=
                    COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX && (
                    <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                      Maximum of {COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX} skills
                      reached for this category.
                    </p>
                  )}

                  <div className="mt-2 flex gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={newSkills[index] || ""}
                        onChange={(e) =>
                          handleSkillInputChange(index, e.target.value)
                        }
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill(index);
                          }
                        }}
                        placeholder="Add a skill"
                        disabled={
                          skillItems.length >=
                          COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX
                        }
                        className={`block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          skillItems.length >=
                          COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span
                          className={`text-xs ${
                            (newSkillChars[index] || 0) >
                            CHAR_LIMITS.SKILL_ITEM_MAX
                              ? "text-red-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {newSkillChars[index] || 0}/
                          {CHAR_LIMITS.SKILL_ITEM_MAX}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSkill(index)}
                      disabled={
                        !newSkills[index]?.trim() ||
                        skillItems.length >=
                          COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX ||
                        (newSkillChars[index] || 0) > CHAR_LIMITS.SKILL_ITEM_MAX
                      }
                      className={`flex items-center px-3 py-2 text-sm font-medium text-white rounded-md ${
                        !newSkills[index]?.trim() ||
                        skillItems.length >=
                          COUNT_LIMITS.SKILLS_PER_CATEGORY_MAX ||
                        (newSkillChars[index] || 0) > CHAR_LIMITS.SKILL_ITEM_MAX
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      }`}
                    >
                      <FiPlus className="mr-2" />
                      Add
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {skillItems.map((skill: string, skillIndex: number) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index, skillIndex)}
                          className="ml-2 inline-flex items-center p-0.5 text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200"
                        >
                          <FiTrash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.skills?.[index]?.items && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                      {errors.skills[index]?.items?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tip: Add your most important and relevant skills first. Prioritize
        skills that match job descriptions you're targeting.
      </p>
    </div>
  );
}
