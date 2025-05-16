"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiEdit3, FiSave, FiPlus, FiMinus, FiMove } from "react-icons/fi";
import TemplateSelector from "./TemplateSelector";
import { ResumeData } from "@/types";
import { generatePDFFromHTML } from "@/lib/generateHtmlPdf";
import { Slider } from "@/components/ui/Slider";
import toast from "react-hot-toast";

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
  onTemplateSelect,
}: ResumePreviewProps) {
  // Reference to the resume template for PDF generation
  const resumeTemplateRef = useRef<HTMLDivElement>(null);
  
  // Customization options
  const [fontSize, setFontSize] = useState(100); // 100% is default
  const [spacing, setSpacing] = useState(100); // 100% is default
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  // Handle PDF download using HTML2PDF
  const handleDownloadPDF = async () => {
    if (!resumeTemplateRef.current) return;
    
    try {
      // Apply scaling styles for PDF generation
      resumeTemplateRef.current.style.transform = 'none';
      resumeTemplateRef.current.style.margin = '0';
      resumeTemplateRef.current.style.padding = '0';
      
      await generatePDFFromHTML(
        resumeTemplateRef.current, 
        `resume-${selectedTemplate}.pdf`, 
        {
          margin: [10, 10, 10, 10],
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            letterRendering: true,
          }
        }
      );
      
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    }
  };
  
  // Handlers for customization
  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };
  
  const handleSpacingChange = (value: number) => {
    setSpacing(value);
  };
  
  // Generate custom styles based on customization options
  const customStyles = {
    fontSize: `${fontSize}%`,
    lineHeight: `${spacing}%`,
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
    >
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button
          onClick={onEdit}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FiEdit3 className="mr-2" />
          Back to Editor
        </button>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <FiMove className="mr-2" />
            {isCustomizing ? "Hide Customization" : "Customize"}
          </button>
          <button
            onClick={onSave}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiSave className="mr-2" />
            Save Resume
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="mr-2" />
            {isGeneratingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>
      
      {/* Customization Controls */}
      {isCustomizing && (
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Customize Your Resume</h3>
          
          <div className="space-y-6">
            {/* Font Size Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Font Size
                </label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setFontSize(Math.max(70, fontSize - 5))}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="text-xs font-medium w-8 text-center">
                    {fontSize}%
                  </span>
                  <button 
                    onClick={() => setFontSize(Math.min(150, fontSize + 5))}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={70}
                max={150}
                value={fontSize}
                onChange={(e) => handleFontSizeChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            {/* Line Spacing Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Line Spacing
                </label>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSpacing(Math.max(80, spacing - 5))}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <FiMinus size={14} />
                  </button>
                  <span className="text-xs font-medium w-8 text-center">
                    {spacing}%
                  </span>
                  <button 
                    onClick={() => setSpacing(Math.min(150, spacing + 5))}
                    className="p-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={80}
                max={150}
                value={spacing}
                onChange={(e) => handleSpacingChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Template Selector and Preview */}
      <TemplateSelector
        data={formData}
        onTemplateSelect={onTemplateSelect}
        selectedTemplate={selectedTemplate}
        customStyles={customStyles}
        templateRef={resumeTemplateRef}
      />
    </motion.div>
  );
}
