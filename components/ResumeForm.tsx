'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { z } from 'zod';

// Form validation schema
const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    location: z.string().min(1, 'Location is required'),
  }),
  summary: z.string().min(1, 'Professional summary is required'),
  experience: z.array(
    z.object({
      title: z.string().min(1, 'Job title is required'),
      company: z.string().min(1, 'Company name is required'),
      startDate: z.string().min(1, 'Start date is required'),
      endDate: z.string().min(1, 'End date is required'),
      responsibilities: z.array(z.string()).default([]),
    })
  ).default([]),
  education: z.array(
    z.object({
      degree: z.string().min(1, 'Degree is required'),
      school: z.string().min(1, 'School name is required'),
      graduationDate: z.string().min(1, 'Graduation date is required'),
      gpa: z.string().optional(),
    })
  ).default([]),
  skills: z.array(z.string()).default([]),
  projects: z
    .array(
      z.object({
        name: z.string().min(1, 'Project name is required'),
        description: z.string().min(1, 'Project description is required'),
        technologies: z.array(z.string()).default([]),
      })
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        name: z.string().min(1, 'Certification name is required'),
        issuer: z.string().min(1, 'Issuer is required'),
        date: z.string().min(1, 'Date is required'),
      })
    )
    .default([]),
});

type ResumeFormData = z.infer<typeof resumeSchema>;

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-500 text-sm flex items-center gap-1">
    <FiAlertCircle className="inline-block" />
    {message}
  </p>
);

export default function ResumeForm() {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      experience: [{ title: '', company: '', startDate: '', endDate: '', responsibilities: [] }],
      education: [{ degree: '', school: '', graduationDate: '' }],
      skills: [],
      projects: [],
      certifications: [],
    },
  });

  const onSubmit = async (data: ResumeFormData) => {
    try {
      setError(null);
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate PDF');
      console.error('Error generating PDF:', error);
    }
  };

  const enhanceResume = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    setIsEnhancing(true);
    setError(null);

    try {
      const formData = watch();
      const response = await fetch('/api/enhance-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: formData,
          jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance resume');
      }

      const suggestions = await response.json();
      setEnhancementSuggestions(suggestions);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to enhance resume');
      console.error('Error enhancing resume:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                {...register('personalInfo.name')}
                className="input-field"
                placeholder="John Doe"
              />
              {errors.personalInfo?.name && (
                <ErrorMessage message={errors.personalInfo.name.message!} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                {...register('personalInfo.email')}
                type="email"
                className="input-field"
                placeholder="john@example.com"
              />
              {errors.personalInfo?.email && (
                <ErrorMessage message={errors.personalInfo.email.message!} />
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
              {errors.personalInfo?.phone && (
                <ErrorMessage message={errors.personalInfo.phone.message!} />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Location</label>
              <input
                {...register('personalInfo.location')}
                className="input-field"
                placeholder="City, State"
              />
              {errors.personalInfo?.location && (
                <ErrorMessage message={errors.personalInfo.location.message!} />
              )}
            </div>
          </div>
        </section>

        {/* Professional Summary */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Professional Summary</h2>
          <textarea
            {...register('summary')}
            className="input-field min-h-[100px]"
            placeholder="Write a brief summary of your professional background and career goals..."
          />
          {errors.summary && <ErrorMessage message={errors.summary.message!} />}
        </section>

        {/* AI Enhancement */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">AI Enhancement</h2>
          <div className="card p-6">
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Paste the job description here to get AI-powered suggestions for your resume..."
            />
            <button
              type="button"
              onClick={enhanceResume}
              disabled={isEnhancing}
              className="btn-primary mt-4"
            >
              {isEnhancing ? 'Enhancing...' : 'Enhance Resume'}
            </button>
          </div>
        </section>

        {/* Enhancement Suggestions */}
        <AnimatePresence>
          {enhancementSuggestions?.enhancedSections && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold">Suggestions</h2>
              <div className="card p-6 space-y-4">
                {Object.entries(enhancementSuggestions.enhancedSections).map(
                  ([section, content]: [string, any]) => (
                    <div key={section} className="space-y-2">
                      <h3 className="text-lg font-semibold capitalize">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Original</h4>
                          <p className="text-sm text-gray-600">
                            {content?.original || 'No content'}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Enhanced</h4>
                          <p className="text-sm text-gray-600">
                            {content?.enhanced || 'No enhancement available'}
                          </p>
                          {content?.enhanced && (
                            <button
                              type="button"
                              onClick={() => {
                                setValue(section as any, content.enhanced);
                              }}
                              className="btn-secondary mt-2 text-xs"
                            >
                              Apply Changes
                            </button>
                          )}
                        </div>
                      </div>
                      {content?.explanation && (
                        <p className="text-sm text-gray-500 italic">
                          {content.explanation}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
}
