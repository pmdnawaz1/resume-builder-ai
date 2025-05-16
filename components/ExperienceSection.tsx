'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { ExperienceErrors } from '@/types/errorTypes';
import { ResumeData } from '@/types';

export default function ExperienceSection() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Add your relevant work experience, starting with the most recent.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                Experience {index + 1}
              </h3>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`experience.${index}.title`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Job Title
                </label>
                <input
                  type="text"
                  {...register(`experience.${index}.title`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {(errors.experience?.[index] as ExperienceErrors)?.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors.experience?.[index] as ExperienceErrors)?.title?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`experience.${index}.company`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Company
                </label>
                <input
                  type="text"
                  {...register(`experience.${index}.company`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {(errors.experience?.[index] as ExperienceErrors)?.company && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors.experience?.[index] as ExperienceErrors)?.company?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`experience.${index}.location`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Location
                </label>
                <input
                  type="text"
                  {...register(`experience.${index}.location`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {(errors.experience?.[index] as ExperienceErrors)?.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors.experience?.[index] as ExperienceErrors)?.location?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`experience.${index}.startDate`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Start Date
                </label>
                <input
                  type="month"
                  {...register(`experience.${index}.startDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {(errors.experience?.[index] as ExperienceErrors)?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors.experience?.[index] as ExperienceErrors)?.startDate?.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`experience.${index}.endDate`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    End Date
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`experience.${index}.current`}
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Current
                    </label>
                  </div>
                </div>
                <input
                  type="month"
                  {...register(`experience.${index}.endDate`)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {(errors.experience?.[index] as ExperienceErrors)?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {(errors.experience?.[index] as ExperienceErrors)?.endDate?.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor={`experience.${index}.description`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <textarea
                {...register(`experience.${index}.description`)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe your responsibilities and achievements..."
              />
              {(errors.experience?.[index] as ExperienceErrors)?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {(errors.experience?.[index] as ExperienceErrors)?.description?.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          append({
            title: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
          })
        }
        className="flex items-center justify-center w-full rounded-md border border-dashed border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FiPlus className="mr-2 h-5 w-5" />
        Add Experience
      </button>
    </div>
  );
}