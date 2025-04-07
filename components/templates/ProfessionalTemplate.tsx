import { ResumeData } from "@/types";

interface ProfessionalTemplateProps {
  data: ResumeData;
}

const ProfessionalTemplate = ({ data }: ProfessionalTemplateProps) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white print:max-w-full">
      {/* Header */}
      <div className="flex flex-col items-center text-center p-8 pb-5 border-b-2 border-gray-300">
        <h1 className="text-3xl font-bold tracking-wide text-gray-900 mb-2">
          {personalInfo.fullName || ""}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-sm mb-3">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:text-blue-600 transition-colors"
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 after:bg-blue-600">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 after:bg-blue-600">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index} className="relative pb-5">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 font-medium mb-1">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 font-medium md:text-right mt-1 md:mt-0">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 whitespace-pre-line">
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
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 after:bg-blue-600">
              Education
            </h2>
            <div className="space-y-5">
              {education.map((edu, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col md:flex-row justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {edu.degree}
                      </h3>
                      <p className="text-blue-600 font-medium mb-1">
                        {edu.school}
                        {edu.location && ` • ${edu.location}`}
                      </p>
                    </div>
                    {edu.graduationDate && (
                      <div className="text-sm text-gray-600 font-medium md:text-right mt-1 md:mt-0">
                        {edu.graduationDate}
                      </div>
                    )}
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 whitespace-pre-line">
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
            <h2 className="text-xl font-bold text-gray-900 mb-5 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-16 after:bg-blue-600">
              Skills
            </h2>
            <div className="space-y-5">
              {skills.map((skillCategory, index) => (
                <div key={index} className="mb-4">
                  {skillCategory.category && (
                    <h3 className="font-bold text-gray-800 mb-2">
                      {skillCategory.category}
                    </h3>
                  )}
                  {skillCategory.items?.length > 0 && (
                    <div className="flex flex-wrap gap-x-1 gap-y-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm mr-2"
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
    </div>
  );
};

export default ProfessionalTemplate;
