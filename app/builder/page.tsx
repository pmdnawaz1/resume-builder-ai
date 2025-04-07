"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import { resumeSchema } from "@/lib/validations/resume";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import SkillsForm from "@/components/forms/SkillsForm";
import ResumePreview from "@/components/ResumePreview";
import { ResumeData } from "@/types";
import { generatePDF } from "@/lib/generatePdf";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import TechnicalTemplate from "@/components/templates/TechnicalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import { useResumeState } from "@/hooks/useResumeState";

const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  technical: TechnicalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
};

const formSteps = [
  { id: "personal", title: "Personal Info", component: PersonalInfoForm },
  { id: "experience", title: "Experience", component: ExperienceForm },
  { id: "education", title: "Education", component: EducationForm },
  { id: "skills", title: "Skills", component: SkillsForm },
];

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const {
    resumeData,
    updateResumeData,
    clearResumeData,
    isLoading,
    defaultResumeState,
  } = useResumeState();

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeData,
    mode: "all",
  });

  // Update form when resumeData changes (on initial load)
  useEffect(() => {
    if (!isLoading) {
      methods.reset(resumeData);
    }
  }, [isLoading, resumeData, methods]);

  const {
    watch,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = methods;
  const formData = watch();

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = watch((value) => {
      if (!isLoading) {
        updateResumeData(value as ResumeData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, isLoading, updateResumeData]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        methods.trigger(name as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, methods]);

  const onSubmit = async (data: ResumeData) => {
    setShowPreview(true);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = async () => {
    const isLastStep = currentStep === formSteps.length - 1;
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 0: // Personal Info
        fieldsToValidate = ["personalInfo.fullName", "personalInfo.email"];
        break;
      case 1: // Experience
        fieldsToValidate = formData.experience.flatMap((_, index) => [
          `experience.${index}.title`,
          `experience.${index}.company`,
          `experience.${index}.startDate`,
          ...(formData.experience[index].current
            ? []
            : [`experience.${index}.endDate`]),
        ]);
        break;
      case 2: // Education
        fieldsToValidate = formData.education.flatMap((_, index) => [
          `education.${index}.degree`,
          `education.${index}.school`,
          `education.${index}.graduationDate`,
        ]);
        break;
      case 3: // Skills
        fieldsToValidate = formData.skills.flatMap((_, index) => [
          `skills.${index}.category`,
          `skills.${index}.items`,
        ]);
        break;
    }

    const stepValid = await trigger(fieldsToValidate);

    if (!stepValid) {
      const currentStepErrors = Object.entries(errors)
        .filter(([key]) =>
          fieldsToValidate.some((field) => key.startsWith(field.split(".")[0]))
        )
        .map(([_, value]: [string, any]) => {
          if (typeof value === "object" && value !== null) {
            return Object.values(value)
              .map((err: any) => err?.message)
              .filter(Boolean)
              .join(", ");
          }
          return value?.message;
        })
        .filter(Boolean);

      if (currentStepErrors.length > 0) {
        toast.error(
          `Please fix the following errors: ${currentStepErrors.join(", ")}`
        );
        return;
      }
    }

    if (isLastStep) {
      const formValid = await trigger();
      if (!formValid) {
        const errorMessages = Object.entries(errors)
          .map(([_, value]: [string, any]) => {
            if (typeof value === "object" && value !== null) {
              return Object.values(value)
                .map((err: any) => err?.message)
                .filter(Boolean)
                .join(", ");
            }
            return value?.message;
          })
          .filter(Boolean);

        toast.error(
          `Please fix the following errors: ${errorMessages.join(", ")}`
        );
        return;
      }
      await handleSubmit(onSubmit)();
    } else {
      setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const doc = generatePDF(formData, selectedTemplate);
      doc.save(`resume-${selectedTemplate}.pdf`);
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const CurrentStepComponent = formSteps[currentStep].component;

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResumePreview
            formData={formData}
            onEdit={() => setShowPreview(false)}
            onDownload={handleDownloadPDF}
            onSave={() => {}}
            isGeneratingPDF={isGeneratingPDF}
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {formSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < formSteps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>
                {index < formSteps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {formSteps.map((step, index) => (
              <span
                key={step.id}
                className={`text-sm ${
                  index === currentStep
                    ? "text-blue-600 dark:text-blue-400 font-medium"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Split View Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <FormProvider {...methods}>
            <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <CurrentStepComponent />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    currentStep === 0
                      ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400"
                  }`}
                  disabled={currentStep === 0}
                >
                  <FiChevronLeft className="mr-2" />
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {currentStep === formSteps.length - 1 ? (
                    "Preview"
                  ) : (
                    <>
                      Next
                      <FiChevronRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </FormProvider>

          {/* Live Preview Section */}
          <div className="hidden lg:block sticky top-8 h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-6">
              {/* Template Selector */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(templates).map(([id, _]) => (
                  <button
                    key={id}
                    onClick={() => handleTemplateSelect(id)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedTemplate === id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </button>
                ))}
              </div>

              {/* Live Template Preview */}
              <div className="bg-white border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transform scale-[0.6] origin-top">
                {formData &&
                  formData.personalInfo &&
                  (() => {
                    const SelectedTemplate =
                      templates[selectedTemplate as keyof typeof templates];
                    return <SelectedTemplate data={formData} />;
                  })()}
              </div>
            </div>
          </div>

          {/* Mobile Preview Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Preview Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
