'use client';

import { motion } from 'framer-motion';
import { FiFileText, FiUpload, FiZap } from 'react-icons/fi';
import Link from 'next/link';

const features = [
  {
    name: 'Smart Resume Builder',
    description: 'Create professional resumes with our intuitive builder',
    icon: FiFileText,
    color: 'bg-blue-500',
  },
  {
    name: 'AI Enhancement',
    description: 'Optimize your resume with AI-powered suggestions',
    icon: FiZap,
    color: 'bg-purple-500',
  },
  {
    name: 'Resume Parsing',
    description: 'Upload your existing resume to get started quickly',
    icon: FiUpload,
    color: 'bg-green-500',
  },
];

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      {/* Hero section */}
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-20 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Meet ResuMate
              <br />
              <span className="text-blue-600 dark:text-blue-400">Your Lazy Resume Wingman</span> 🦥
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Because adulting is hard enough. Let your resume-building buddy do the heavy lifting 
              while you just relax and chill! 🚀
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/builder" className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                Build Your Resume
              </Link>
              <Link href="/templates" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                View Templates <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Less Work, More Results</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to create a killer resume
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {/* Privacy Feature */}
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                🔒 Your Data, Your Control
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                <p className="flex-auto">
                  Your data stays in your browser. Want extra security? We'll hash and encrypt it before storing on our servers.
                </p>
              </dd>
            </div>

            {/* Templates Feature */}
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                🎨 Professional Templates
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                <p className="flex-auto">
                  Multiple ATS-friendly templates that make your resume stand out. No design skills needed!
                </p>
              </dd>
            </div>

            {/* Easy Export Feature */}
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900 dark:text-white">
                📤 Easy Export
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                <p className="flex-auto">
                  Download your resume as a PDF in seconds. No more fighting with Word formatting!
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
