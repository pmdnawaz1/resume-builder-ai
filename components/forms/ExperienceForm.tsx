'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { ResumeData } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
    name: 'experience',
  });

  const watchCurrentFields = fields.map((_, index) => watch(`experience.${index}.current`));

  useEffect(() => {
    fields.forEach((_, index) => {
      if (watchCurrentFields[index]) {
        // Only update if the value is not already empty
        const currentEndDate = getValues(`experience.${index}.endDate`);
        if (currentEndDate) {
          setValue(`experience.${index}.endDate`, '');
        }
      }
    });
  }, [watchCurrentFields]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const [year, month] = dateString.split('-').map(Number);
    return new Date(year, month - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Work Experience
        </h2>
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
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add Experience
        </button>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg"
          >
            {/* Remove Button */}
            {index > 0 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500"
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
                  Job Title
                </label>
                <input
                  type="text"
                  {...register(`experience.${index}.title`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600">
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
                  Company
                </label>
                <input
                  type="text"
                  {...register(`experience.${index}.company`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600">
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
                <input
                  type="text"
                  {...register(`experience.${index}.location`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.experience?.[index]?.location && (
                  <p className="mt-1 text-sm text-red-600">
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
                  Start Date
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
                  <p className="mt-1 text-sm text-red-600">
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
                          watchCurrentFields[index] ? 'bg-gray-100 dark:bg-gray-600' : ''
                        }`}
                      />
                    )}
                  />
                  <label className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Current
                    </span>
                  </label>
                </div>
                {errors.experience?.[index]?.endDate && !watchCurrentFields[index] && (
                  <p className="mt-1 text-sm text-red-600">
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
                <textarea
                  {...register(`experience.${index}.description`)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="• Use bullet points to describe your responsibilities and achievements&#10;• Start each point with an action verb&#10;• Include quantifiable achievements when possible"
                />
                {errors.experience?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.experience[index]?.description?.message}
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
