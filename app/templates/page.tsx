'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const templates = [
  {
    id: 1,
    name: 'Professional',
    description: 'Clean and professional template suitable for any industry',
    image: '/templates/professional.png',
  },
  {
    id: 2,
    name: 'Modern',
    description: 'Contemporary design with a creative touch',
    image: '/templates/modern.png',
  },
  {
    id: 3,
    name: 'Minimal',
    description: 'Simple and elegant design focusing on content',
    image: '/templates/minimal.png',
  },
];

export default function Templates() {
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl"
          >
            Choose Your Template
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
          >
            Select from our professionally designed templates to create your perfect resume
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg"
            >
              <div className="flex-shrink-0">
                <Image
                  className="h-48 w-full object-cover"
                  src={template.image}
                  alt={template.name}
                  width={400}
                  height={200}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white dark:bg-gray-800 p-6">
                <div className="flex-1">
                  <p className="text-xl font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </p>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href={`/builder?template=${template.id}`}
                    className="flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Use Template
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
