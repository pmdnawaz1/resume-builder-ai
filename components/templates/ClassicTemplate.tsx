import { ResumeData } from '@/types';

interface ClassicTemplateProps {
  data: ResumeData;
}

const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      {/* Header with subtle gradient border */}
      <header className="text-center mb-8 pb-8 border-b-4 border-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
          {personalInfo.fullName || ''}
        </h1>
        <div className="text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-4 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {personalInfo.location}
            </div>
          )}
        </div>
      </header>

      {/* Summary with elegant border */}
      {personalInfo.summary && (
        <section className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            Professional Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience with timeline design */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-gray-700 last:border-0">
                <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full bg-blue-600 dark:bg-blue-500" />
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-200">{exp.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {exp.company}{exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education with cards */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </span>
            Education
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {education.map((edu, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">{edu.degree}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {edu.school}{edu.location && ` • ${edu.location}`}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills with modern badges */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
            Skills
          </h2>
          <div className="space-y-6">
            {skills.map((skillCategory, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                {skillCategory.category && (
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">
                    {skillCategory.category}
                  </h3>
                )}
                {skillCategory.items?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium border border-blue-100 dark:border-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ClassicTemplate;
