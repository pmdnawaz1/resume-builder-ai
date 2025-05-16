import { ResumeData } from "@/types";

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate = ({ data }: CreativeTemplateProps) => {
  const {
    personalInfo = {} as ResumeData["personalInfo"],
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white print:max-w-full">
      {/* Creative Header */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {personalInfo.fullName || ""}
          </h1>

          <div className="text-indigo-100 flex flex-wrap gap-4 text-sm mb-3">
            {personalInfo.email && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                  className="w-4 h-4 mr-2"
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
                  className="w-4 h-4 mr-2"
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

          {personalInfo.summary && (
            <div className="mt-4 text-indigo-50 leading-relaxed max-w-3xl">
              {personalInfo.summary}
            </div>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 inline-block relative">
              <span className="relative z-10">Experience</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-purple-200 -z-0"></span>
            </h2>

            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="pl-6 relative">
                  <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-purple-500 mt-2"></div>

                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {exp.title}
                      </h3>
                      <p className="text-purple-600 font-medium">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div className="mt-1 sm:mt-0 text-sm text-gray-600 font-medium sm:text-right">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="mt-2 text-gray-700 whitespace-pre-line">
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
            <h2 className="text-2xl font-bold mb-6 text-gray-900 inline-block relative">
              <span className="relative z-10">Education</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-indigo-200 -z-0"></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-5 border-l-4 border-indigo-500 shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-indigo-600 font-medium">
                      {edu.school}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                    {edu.graduationDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        {edu.graduationDate}
                      </p>
                    )}
                  </div>

                  {edu.description && (
                    <p className="mt-3 text-gray-700 text-sm">
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
            <h2 className="text-2xl font-bold mb-6 text-gray-900 inline-block relative">
              <span className="relative z-10">Skills</span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-pink-200 -z-0"></span>
            </h2>

            <div className="space-y-6">
              {skills.map((skillCategory, index) => (
                <div key={index} className="mb-4">
                  {skillCategory.category && (
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {skillCategory.category}
                    </h3>
                  )}
                  {skillCategory.items?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200"
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

export default CreativeTemplate;
