import { ResumeData } from "@/types";

interface MinimalTemplateProps {
  data: ResumeData;
}

const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white print:max-w-full print:p-6">
      {/* Minimal Header */}
      <header className="mb-10 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-light mb-2 tracking-tight text-gray-900">
          {personalInfo.fullName || ""}
        </h1>
        <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-10">
          <h2 className="text-lg font-light mb-3 text-gray-900 uppercase tracking-wider">
            Profile
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-light mb-5 text-gray-900 uppercase tracking-wider">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="group">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {exp.company}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 tabular-nums mb-2 sm:mb-0">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
        <section className="mb-10">
          <h2 className="text-lg font-light mb-5 text-gray-900 uppercase tracking-wider">
            Education
          </h2>
          <div className="space-y-5">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {edu.school}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="text-sm text-gray-500 tabular-nums mb-2 sm:mb-0">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
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
          <h2 className="text-lg font-light mb-5 text-gray-900 uppercase tracking-wider">
            Skills
          </h2>
          <div className="space-y-5">
            {skills.map((skillCategory, index) => (
              <div key={index}>
                {skillCategory.category && (
                  <h3 className="text-sm font-medium text-gray-900 mb-2">
                    {skillCategory.category}
                  </h3>
                )}
                {skillCategory.items?.length > 0 && (
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-sm text-gray-700">
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
