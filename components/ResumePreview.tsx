'use client';

import { motion } from 'framer-motion';
import { FiDownload, FiEdit3, FiSave } from 'react-icons/fi';
import { useState } from 'react';
import TemplateSelector from './TemplateSelector';
import { ResumeData } from '@/types';

interface ResumePreviewProps {
  formData: ResumeData;
  onEdit: () => void;
  onDownload: () => void;
  onSave: () => void;
  isGeneratingPDF: boolean;
  selectedTemplate: string;
  onTemplateSelect: (template: string) => void;
}

export default function ResumePreview({ 
  formData, 
  onEdit, 
  onDownload, 
  onSave, 
  isGeneratingPDF,
  selectedTemplate,
  onTemplateSelect 
}: ResumePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
        >
          <FiEdit3 className="mr-2" />
          Edit
        </button>
        <div className="flex space-x-4">
          <button
            onClick={onSave}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiSave className="mr-2" />
            Save Resume
          </button>
          <button
            onClick={onDownload}
            disabled={isGeneratingPDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="mr-2" />
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Template Selector and Preview */}
      <TemplateSelector
        data={formData}
        onTemplateSelect={onTemplateSelect}
        selectedTemplate={selectedTemplate}
      />
    </motion.div>
  );
}
