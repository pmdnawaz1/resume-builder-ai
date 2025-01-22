'use client';

import { useState } from 'react';
import { ResumeData } from '@/types';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import TechnicalTemplate from './templates/TechnicalTemplate';

interface TemplateSelectorProps {
  data: ResumeData;
  onTemplateSelect: (template: string) => void;
  selectedTemplate: string;
}

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume layout with a professional look',
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with a colored header and clean sections',
    component: ModernTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and minimalist design with elegant typography',
    component: MinimalTemplate,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Two-column layout ideal for technical roles',
    component: TechnicalTemplate,
  },
];

export default function TemplateSelector({ data, onTemplateSelect, selectedTemplate }: TemplateSelectorProps) {
  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId);
  };

  const SelectedTemplateComponent = templates.find(t => t.id === selectedTemplate)?.component || ClassicTemplate;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </button>
        ))}
      </div>

      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <SelectedTemplateComponent data={data} />
      </div>
    </div>
  );
}
