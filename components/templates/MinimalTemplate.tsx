import { ResumeData } from '@/types';

interface MinimalTemplateProps {
  data: ResumeData;
}

const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900">
      {/* Minimal Header */}
      <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
        <h1 className="text-3xl font-light mb-3 tracking-tight text-gray-900 dark:text-white">
          {personalInfo.fullName || ''}
        </h1>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-x-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>{personalInfo.location}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-12">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-light mb-6 text-gray-900 dark:text-white uppercase tracking-wider">
            Experience
          </h2>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <div key={index} className="group">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {exp.company}{exp.location && ` · ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-light mb-6 text-gray-900 dark:text-white uppercase tracking-wider">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white">
                    {edu.degree}
                  </h3>
                  {edu.graduationDate && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {edu.school}{edu.location && ` · ${edu.location}`}
                </p>
                {edu.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-light mb-6 text-gray-900 dark:text-white uppercase tracking-wider">
            Skills
          </h2>
          <div className="space-y-4">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                {skillCategory.category && (
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {skillCategory.category}
                  </h3>
                )}
                {skillCategory.items?.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="text-sm text-gray-700 dark:text-gray-300"
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

export default MinimalTemplate;
