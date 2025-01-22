'use client';

import { useFormContext } from 'react-hook-form';
import { ResumeData } from '@/types';

export default function PersonalInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ResumeData>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('personalInfo.fullName')}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.personalInfo?.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('personalInfo.email')}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register('personalInfo.phone')}
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register('personalInfo.location')}
            placeholder="City, Country"
            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.personalInfo?.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.location.message}
            </p>
          )}
        </div>
      </div>

      {/* Summary */}
      <div>
        <label
          htmlFor="summary"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Professional Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          {...register('personalInfo.summary')}
          placeholder="Brief overview of your professional background and career goals"
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.personalInfo?.summary && (
          <p className="mt-1 text-sm text-red-600">
            {errors.personalInfo.summary.message}
          </p>
        )}
      </div>
    </div>
  );
}
