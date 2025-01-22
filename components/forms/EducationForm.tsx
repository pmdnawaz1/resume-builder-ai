'use client';

import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { ResumeData } from '@/types';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function EducationForm() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ResumeData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

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
          Education
        </h2>
        <button
          type="button"
          onClick={() =>
            append({
              degree: '',
              school: '',
              location: '',
              graduationDate: '',
              description: '',
            })
          }
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" />
          Add Education
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
              {/* Degree */}
              <div>
                <label
                  htmlFor={`education.${index}.degree`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Degree
                </label>
                <input
                  type="text"
                  {...register(`education.${index}.degree`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.education?.[index]?.degree && (
                  <p className="mt-1 text-sm text-red-600">
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
                  School
                </label>
                <input
                  type="text"
                  {...register(`education.${index}.school`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.education?.[index]?.school && (
                  <p className="mt-1 text-sm text-red-600">
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
                <input
                  type="text"
                  {...register(`education.${index}.location`)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.education?.[index]?.location && (
                  <p className="mt-1 text-sm text-red-600">
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
                  Graduation Date
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
                  <p className="mt-1 text-sm text-red-600">
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
                <textarea
                  {...register(`education.${index}.description`)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Describe your achievements, relevant coursework, etc."
                />
                {errors.education?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.education[index]?.description?.message}
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
