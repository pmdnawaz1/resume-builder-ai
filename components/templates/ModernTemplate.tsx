import { ResumeData } from "@/types";

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    projects = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm overflow-hidden print:shadow-none print:max-w-full">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white print:from-blue-700 print:to-blue-700">
        <h1 className="text-3xl font-bold mb-3 tracking-tight">
          {personalInfo.fullName || ""}
        </h1>
        {personalInfo.title && (
          <h2 className="text-xl text-blue-100 mb-4">{personalInfo.title}</h2>
        )}
        <div className="flex flex-wrap gap-5 text-blue-50 text-sm">
          {personalInfo.email && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 opacity-90"
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
                className="w-4 h-4 mr-2 opacity-90"
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
                className="w-4 h-4 mr-2 opacity-90"
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
          {personalInfo.website && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-2 opacity-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {personalInfo.website}
            </div>
          )}
        </div>
      </div>

      <div className="p-8 print:p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white print:bg-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed ml-11">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white print:bg-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Experience
            </h2>
            <div className="space-y-6 ml-11">
              {experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <div className="mt-1 md:mt-0 md:ml-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {exp.startDate} -{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 whitespace-pre-line mt-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-inside mt-2 text-gray-700 pl-4">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white print:bg-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </span>
              Projects
            </h2>
            <div className="space-y-6 ml-11">
              {projects.map((project, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200"
                >
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {project.name}
                      </h3>
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div className="mt-1 md:mt-0 md:ml-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                          {project.startDate && project.startDate} 
                          {project.startDate && project.endDate && " - "} 
                          {project.endDate && project.endDate}
                        </span>
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-gray-700 whitespace-pre-line mt-2">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white print:bg-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </span>
              Education
            </h2>
            <div className="grid gap-4 md:grid-cols-2 ml-11">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200"
                >
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-base font-bold text-gray-900">
                        {edu.degree}
                      </h3>
                      {edu.graduationDate && (
                        <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {edu.graduationDate}
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 text-sm font-medium mb-2">
                      {edu.school}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                    {edu.description && (
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {edu.description}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-gray-700 text-sm mt-1">
                        <span className="font-medium">GPA:</span> {edu.gpa}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 text-white print:bg-blue-700">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </span>
              Skills
            </h2>
            <div className="space-y-4 ml-11">
              {skills.map((skillCategory, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 print:bg-white print:border print:border-gray-200"
                >
                  {skillCategory.category && (
                    <h3 className="text-base font-bold text-gray-900 mb-3">
                      {skillCategory.category}
                    </h3>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
