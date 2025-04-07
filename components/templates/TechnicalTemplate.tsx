import { ResumeData } from "@/types";

interface TechnicalTemplateProps {
  data: ResumeData;
}

const TechnicalTemplate = ({ data }: TechnicalTemplateProps) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  return (
    <div className="max-w-4xl mx-auto p-8 font-mono bg-white print:max-w-full print:p-6">
      {/* Technical Header */}
      <header className="mb-10">
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 print:bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {personalInfo.fullName || ""}
              </h1>
              <div className="space-y-1 text-sm text-gray-600">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">&gt;</span>
                    <span className="font-medium">email:</span>
                    <span className="ml-2">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">&gt;</span>
                    <span className="font-medium">phone:</span>
                    <span className="ml-2">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center">
                    <span className="text-gray-400 mr-2">&gt;</span>
                    <span className="font-medium">location:</span>
                    <span className="ml-2">{personalInfo.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <div className="inline-flex items-center px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm">
                <span className="mr-2 text-green-500">●</span>
                Available for opportunities
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Summary as Code Comment */}
      {personalInfo.summary && (
        <section className="mb-10">
          <div className="text-gray-700 text-sm font-mono bg-gray-50 p-4 rounded-lg border border-gray-200 print:bg-white">
            <div>/**</div>
            <div className="ml-4">* {personalInfo.summary}</div>
            <div>*/</div>
          </div>
        </section>
      )}

      {/* Technical Experience */}
      {experience.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            <span className="text-blue-600 mr-2">function</span>
            getExperience() {"{"}
          </h2>
          <div className="ml-6 space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 print:bg-white">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        <span className="text-blue-600">const</span> {exp.title}
                      </h3>
                      <p className="text-sm text-blue-600">
                        {exp.company}
                        {exp.location && ` @ ${exp.location}`}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                        {exp.startDate} →{" "}
                        {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {exp.description.split("\n").map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-gray-400 mr-2">›</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="text-gray-900 mt-2">{"}"};</div>
        </section>
      )}

      {/* Technical Education */}
      {education.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            <span className="text-purple-600 mr-2">class</span>
            Education {"{"}
          </h2>
          <div className="ml-6 space-y-5">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-5 border border-gray-200 print:bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      <span className="text-purple-600">const</span>{" "}
                      {edu.degree}
                    </h3>
                    <p className="text-sm text-purple-600">
                      {edu.school}
                      {edu.location && ` @ ${edu.location}`}
                    </p>
                  </div>
                  {edu.graduationDate && (
                    <span className="mt-2 md:mt-0 inline-flex items-center px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {edu.graduationDate}
                    </span>
                  )}
                </div>
                {edu.description && (
                  <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                    {edu.description.split("\n").map((line, i) => (
                      <div key={i} className="flex">
                        <span className="text-gray-400 mr-2">›</span>
                        <span>{line}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-gray-900 mt-2">{"}"};</div>
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
            <span className="text-green-600 mr-2">interface</span>
            Skills {"{"}
          </h2>
          <div className="ml-6 space-y-5">
            {skills.map((skillCategory, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-5 border border-gray-200 print:bg-white"
              >
                {skillCategory.category && (
                  <h3 className="text-base font-bold text-gray-900 mb-3">
                    <span className="text-green-600">type</span>{" "}
                    {skillCategory.category}
                  </h3>
                )}
                {skillCategory.items?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-gray-900 mt-2">{"}"};</div>
        </section>
      )}
    </div>
  );
};

export default TechnicalTemplate;
