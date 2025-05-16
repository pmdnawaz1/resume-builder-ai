import { ResumeData } from "@/types";

interface ExecutiveTemplateProps {
  data: ResumeData;
}

const ExecutiveTemplate = ({ data }: ExecutiveTemplateProps) => {
  const {
    personalInfo = {} as ResumeData["personalInfo"],
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white print:max-w-full">
      {/* Header */}
      <header className="bg-gray-900 text-white px-8 py-10 print:bg-gray-800">
        <h1 className="text-3xl font-bold mb-1 tracking-wide">
          {personalInfo.fullName || ""}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {personalInfo.location}
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3">
        {/* Left Column */}
        <div className="md:col-span-1 bg-gray-100 p-8 print:bg-gray-100">
          {/* Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
                Profile
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
                Skills
              </h2>
              <div className="space-y-4">
                {skills.map((skillCategory, index) => (
                  <div key={index} className="mb-3">
                    {skillCategory.category && (
                      <h3 className="text-sm font-bold text-gray-800 mb-2">
                        {skillCategory.category}
                      </h3>
                    )}
                    {skillCategory.items?.length > 0 && (
                      <div className="space-y-1">
                        {skillCategory.items.map((skill, skillIndex) => (
                          <div key={skillIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mr-2"></div>
                            <span className="text-sm text-gray-700">
                              {skill}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase border-b border-gray-300 pb-1">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {edu.school}
                    </p>
                    {edu.location && (
                      <p className="text-xs text-gray-600">{edu.location}</p>
                    )}
                    {edu.graduationDate && (
                      <p className="text-xs text-gray-600 mt-1">
                        {edu.graduationDate}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-xs text-gray-700 mt-1">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 p-8">
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase border-b border-gray-300 pb-1">
                Professional Experience
              </h2>
              <div className="space-y-8">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pb-2">
                    <div className="flex flex-col md:flex-row md:justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {exp.title}
                        </h3>
                        <p className="text-gray-700 font-medium">
                          {exp.company}
                          {exp.location && `, ${exp.location}`}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 font-medium md:text-right mt-1 md:mt-0">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 whitespace-pre-line mt-2">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
