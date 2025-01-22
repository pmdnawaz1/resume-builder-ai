'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { ResumeData } from '@/types';
import { useState } from 'react';

export default function SkillsForm() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  const [newCategory, setNewCategory] = useState<string>('');
  const [newSkills, setNewSkills] = useState<{ [key: number]: string }>({});

  const handleAddSkill = (index: number) => {
    const skillToAdd = newSkills[index]?.trim();
    if (skillToAdd) {
      const currentSkills = getValues(`skills.${index}.items`) || [];
      setValue(`skills.${index}.items`, [...currentSkills, skillToAdd]);
      // Only clear the specific category's input
      setNewSkills(prev => ({ ...prev, [index]: '' }));
    }
  };

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const currentSkills = getValues(`skills.${categoryIndex}.items`) || [];
    const updatedSkills = currentSkills.filter((_, index) => index !== skillIndex);
    setValue(`skills.${categoryIndex}.items`, updatedSkills);
  };

  const handleSkillInputChange = (index: number, value: string) => {
    setNewSkills(prev => ({ ...prev, [index]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Skills
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New Category"
            className="px-3 py-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={() => {
              if (newCategory.trim()) {
                append({ category: newCategory.trim(), items: [] });
                setNewCategory('');
              }
            }}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg"
          >
            {/* Remove Category Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500"
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
                <input
                  type="text"
                  {...register(`skills.${index}.category`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.skills?.[index]?.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.skills[index]?.category?.message}
                  </p>
                )}
              </div>

              {/* Skills List */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Skills
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newSkills[index] || ''}
                    onChange={(e) => handleSkillInputChange(index, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(index);
                      }
                    }}
                    placeholder="Add a skill"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill(index)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="mr-2" />
                    Add
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {getValues(`skills.${index}.items`)?.map((skill: string, skillIndex: number) => (
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
                  <p className="mt-1 text-sm text-red-600">
                    {errors.skills[index]?.items?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
