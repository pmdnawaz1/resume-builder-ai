'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            &copy; {currentYear} ResuMate 🦥. All rights reserved.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Built with ❤️ by{' '}
            <Link
              href="https://pmdnawaz1.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sarfaraz Nawaz
            </Link>
            {/* <a
              href="https://pmdnawaz1.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sarfaraz Nawaz
            </a> */}
          </p>
        </div>
      </div>
    </footer>
  );
}
