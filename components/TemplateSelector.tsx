"use client";

import { ResumeData } from "@/types";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import TechnicalTemplate from "./templates/TechnicalTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import { RefObject } from "react";

interface TemplateSelectorProps {
  data: ResumeData;
  onTemplateSelect: (template: string) => void;
  selectedTemplate: string;
  customStyles?: React.CSSProperties;
  templateRef?: RefObject<HTMLDivElement>;
}

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional resume with clean sections",
    component: ClassicTemplate,
  },
  {
    id: "professional",
    name: "Professional",
    description: "Elegant design for seasoned professionals",
    component: ProfessionalTemplate,
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary design with a colored header",
    component: ModernTemplate,
  },
  {
    id: "creative",
    name: "Creative",
    description: "Creative design for standing out",
    component: CreativeTemplate,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and minimalist design",
    component: MinimalTemplate,
  },
  {
    id: "executive",
    name: "Executive",
    description: "Two-column layout for executives",
    component: ExecutiveTemplate,
  },
  {
    id: "technical",
    name: "Technical",
    description: "Code-inspired for tech professionals",
    component: TechnicalTemplate,
  },
];

export default function TemplateSelector({
  data,
  onTemplateSelect,
  selectedTemplate,
  customStyles = {},
  templateRef,
}: TemplateSelectorProps) {
  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  const SelectedTemplateComponent =
    templates.find((t) => t.id === selectedTemplate)?.component ||
    ClassicTemplate;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`p-3 rounded-lg border-2 transition-all text-left h-full ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400"
                : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">
              {template.name}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </button>
        ))}
      </div>

      <div 
        ref={templateRef}
        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white"
        style={customStyles}
      >
        <SelectedTemplateComponent data={data} />
      </div>
    </div>
  );
}
