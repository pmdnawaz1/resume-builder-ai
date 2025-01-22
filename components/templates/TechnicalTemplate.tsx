'use client';

import { ResumeData } from '@/types';

interface TechnicalTemplateProps {
  data: ResumeData;
}

const TechnicalTemplate = ({ data }: TechnicalTemplateProps) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto p-8 font-mono bg-white dark:bg-gray-900">
      {/* Technical Header */}
      <header className="mb-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          No sane person would ever use this template
      </h1>
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {personalInfo.fullName || ''}
              </h1>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">&gt;</span>
                    <span className="font-medium">email:</span>
                    <span className="ml-2">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">&gt;</span>
                    <span className="font-medium">phone:</span>
                    <span className="ml-2">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center">
                    <span className="text-gray-400 dark:text-gray-500 mr-2">&gt;</span>
                    <span className="font-medium">location:</span>
                    <span className="ml-2">{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                <span className="mr-2">●</span>
                Available for opportunities
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Summary as Code Comment */}
      {personalInfo.summary && (
        <section className="mb-12">
          <div className="text-gray-500 dark:text-gray-400 text-sm font-mono">
            <div>/**</div>
            <div className="ml-2">* {personalInfo.summary}</div>
            <div>*/</div>
          </div>
        </section>
      )}

      {/* Technical Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="text-blue-500 dark:text-blue-400 mr-2">function</span>
            getExperience() {'{'}
          </h2>
          <div className="ml-4 space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        <span className="text-blue-500 dark:text-blue-400">const</span>{' '}
                        {exp.title}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {exp.company}{exp.location && ` @ ${exp.location}`}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {exp.startDate} → {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {exp.description.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-gray-400 dark:text-gray-500 mr-2">›</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-900 dark:text-white mt-4">{'}'}</div>
        </section>
      )}

      {/* Technical Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="text-purple-500 dark:text-purple-400 mr-2">class</span>
            Education {'{'}
          </h2>
          <div className="ml-4 space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      <span className="text-purple-500 dark:text-purple-400">const</span>{' '}
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      {edu.school}{edu.location && ` @ ${edu.location}`}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {edu.description.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-gray-400 dark:text-gray-500 mr-2">›</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-gray-900 dark:text-white mt-4">{'}'}</div>
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="text-green-500 dark:text-green-400 mr-2">interface</span>
            Skills {'{'}
          </h2>
          <div className="ml-4 space-y-6">
            {skills.map((skillCategory, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
                {skillCategory.category && (
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                    <span className="text-green-500 dark:text-green-400">type</span>{' '}
                    {skillCategory.category}
                  </h3>
                )}
                {skillCategory.items?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-gray-900 dark:text-white mt-4">{'}'}</div>
        </section>
      )}
    </div>
  );
};

export default TechnicalTemplate;
