'use client';

import { useFormContext } from 'react-hook-form';
import { PersonalInfoErrors } from '@/types/errorTypes';

export default function PersonalInfoSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            {...register('personalInfo.fullName')}
            className="input-field"
            placeholder="John Doe"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.fullName && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.fullName?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Job Title</label>
          <input
            {...register('personalInfo.jobTitle')}
            className="input-field"
            placeholder="Software Engineer"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.jobTitle && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.jobTitle?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register('personalInfo.email')}
            type="email"
            className="input-field"
            placeholder="john.doe@example.com"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.email && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.email?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            {...register('personalInfo.phone')}
            type="tel"
            className="input-field"
            placeholder="(123) 456-7890"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.phone && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.phone?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            {...register('personalInfo.location')}
            className="input-field"
            placeholder="City, State"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.location && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.location?.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Portfolio/Website</label>
          <input
            {...register('personalInfo.website')}
            type="url"
            className="input-field"
            placeholder="https://yourwebsite.com"
          />
          {(errors.personalInfo as PersonalInfoErrors)?.website && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.website?.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Summary</label>
          <textarea
            {...register('personalInfo.summary')}
            className="input-field min-h-[100px]"
            placeholder="A brief summary of your professional background and career objectives..."
          />
          {(errors.personalInfo as PersonalInfoErrors)?.summary && (
            <p className="text-red-500 text-sm">
              {(errors.personalInfo as PersonalInfoErrors)?.summary?.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}