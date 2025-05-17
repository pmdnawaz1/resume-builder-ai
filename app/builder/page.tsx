"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { resumeSchema } from "@/lib/validations/resume";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import ExperienceForm from "@/components/forms/ExperienceForm";
import EducationForm from "@/components/forms/EducationForm";
import ProjectsForm from "@/components/forms/ProjectsForm";
import SkillsForm from "@/components/forms/SkillsForm";
import { ResumeData } from "@/types";
import { useResumeStore } from "@/lib/store";

// Import dynamic components that might use browser APIs
import dynamic from 'next/dynamic';

// Dynamically import components with browser dependencies
const ResumePreview = dynamic(() => import("@/components/ResumePreview"), { ssr: false });
const ClassicTemplate = dynamic(() => import("@/components/templates/ClassicTemplate"), { ssr: false });
const ModernTemplate = dynamic(() => import("@/components/templates/ModernTemplate"), { ssr: false });
const MinimalTemplate = dynamic(() => import("@/components/templates/MinimalTemplate"), { ssr: false });
const TechnicalTemplate = dynamic(() => import("@/components/templates/TechnicalTemplate"), { ssr: false });
const ProfessionalTemplate = dynamic(() => import("@/components/templates/ProfessionalTemplate"), { ssr: false });
const CreativeTemplate = dynamic(() => import("@/components/templates/CreativeTemplate"), { ssr: false });
const ExecutiveTemplate = dynamic(() => import("@/components/templates/ExecutiveTemplate"), { ssr: false });

// Create templates object that will be populated after client-side rendering
const templates: Record<string, any> = {};

const formSteps = [
  { id: "personal", title: "Personal Info", component: PersonalInfoForm },
  { id: "experience", title: "Experience", component: ExperienceForm },
  { id: "education", title: "Education", component: EducationForm },
  { id: "projects", title: "Projects", component: ProjectsForm },
  { id: "skills", title: "Skills", component: SkillsForm },
];

export default function Builder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [showPreview, setShowPreview] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isStepValid, setIsStepValid] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const { resumeData, updateResumeData } = useResumeStore();

  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeData,
    mode: "all",
  });

  // Populate the templates object only after client-side hydration
  useEffect(() => {
    // This will only run in the browser
    templates.classic = ClassicTemplate;
    templates.modern = ModernTemplate;
    templates.minimal = MinimalTemplate;
    templates.technical = TechnicalTemplate;
    templates.professional = ProfessionalTemplate;
    templates.creative = CreativeTemplate;
    templates.executive = ExecutiveTemplate;
    
    setIsClient(true);
  }, []);

  // Update form when component mounts, not on every resumeData change
  const [initialReset, setInitialReset] = useState(false);
  
  useEffect(() => {
    // Ensure we reset the form with the hydrated data from localStorage
    const resetFormWithHydratedData = () => {
      if (!initialReset) {
        // Wait a small delay to ensure localStorage is fully hydrated
        setTimeout(() => {
          methods.reset(resumeData);
          setInitialReset(true);
          console.log("Form reset with hydrated data:", resumeData);
        }, 100);
      }
    };
    
    resetFormWithHydratedData();
  }, [resumeData, methods, initialReset]);
  
  // Use a separate effect with deep comparison to reset only on meaningful changes
  useEffect(() => {
    if (initialReset) {
      // Only reset if the active element is not a form field to avoid interrupting user input
      const activeElement = document.activeElement;
      const isFormField = activeElement?.tagName === 'INPUT' || 
                          activeElement?.tagName === 'TEXTAREA' || 
                          activeElement?.tagName === 'SELECT';
      
      if (!isFormField) {
        methods.reset(resumeData, { keepValues: true });
      }
    }
  }, [JSON.stringify(resumeData), initialReset, methods]);

  const {
    watch,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = methods;
  const formData = watch();

  // Save form data to Zustand store whenever it changes - more efficient approach
  useEffect(() => {
    // Use a debounce to prevent too many store updates
    const updateTimeout = setTimeout(() => {
      if (initialReset && !isInitialLoad) {
        console.log("Updating store with form data");
        updateResumeData(formData as ResumeData);
      }
    }, 300);

    return () => clearTimeout(updateTimeout);
  }, [JSON.stringify(formData), updateResumeData, initialReset, isInitialLoad]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && name) {
        methods.trigger(name as any).then(() => {
          // Validate silently when fields change - no toasts
          validateStep(currentStep, false).then(valid => {
            setIsStepValid(valid);
          });
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, methods, currentStep]);

  const onSubmit = async (data: ResumeData) => {
    console.log("onSubmit called, setting showPreview to true");
    setShowPreview(true);
  };

  // Add debug output to check showPreview state
  useEffect(() => {
    console.log("showPreview state:", showPreview);
  }, [showPreview]);

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNextStep = async () => {
    console.log("handleNextStep called, current step:", currentStep);
    
    try {
      // Don't proceed if the current step is not valid
      if (!isStepValid) {
        console.log("Step not valid, showing validation errors");
        // Validate again to show the toast with errors
        await validateStep(currentStep, true);
        return false;
      }
      
      const isLastStep = currentStep === formSteps.length - 1;
      console.log("Is last step:", isLastStep);

      // If this is the last step and it's valid, show preview
      if (isLastStep) {
        console.log("Last step, validating entire form");
        const formValid = await trigger();
        console.log("Form valid:", formValid);
        
        if (!formValid) {
          const errorMessages = Object.entries(errors)
            .map(([key, value]: [string, any]) => {
              console.log("Error key:", key);
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
            `Please fix the following errors: ${errorMessages.join(", ")}`,
            {
              duration: 4000,
              position: 'top-center',
            }
          );
          return false;
        }
        console.log("Form is valid, setting showPreview to true");
        setShowPreview(true);
        return true;
      } else {
        // Only move to the next step if validation passed
        console.log("Moving to next step");
        setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1));
        return true;
      }
    } catch (error) {
      console.error("Error in handleNextStep:", error);
      return false;
    }
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      toast.success("Resume downloading...");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const CurrentStepComponent = formSteps[currentStep].component;

  const validateStep = async (stepIndex: number, showToast = true) => {
    console.log("validateStep called for step:", stepIndex, "showToast:", showToast);
    
    // Skip validation during initial load
    if (isInitialLoad) {
      console.log("Initial load, skipping validation");
      return true;
    }

    // Define validation fields based on current step
    let fieldsToValidate: string[] = [];

    try {
      switch (stepIndex) {
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
        case 3: // Projects
          fieldsToValidate = formData.projects.flatMap((_, index) => [
            `projects.${index}.name`,
          ]);
          break;
        case 4: // Skills
          fieldsToValidate = formData.skills.flatMap((_, index) => [
            `skills.${index}.category`,
            `skills.${index}.items`,
          ]);
          break;
      }

      console.log("Validating fields:", fieldsToValidate);
      
      // Projects step is optional, so automatically pass validation if no projects
      if (stepIndex === 3 && formData.projects.length === 0) {
        console.log("Projects step is empty and optional, skipping validation");
        return true;
      }
      
      // Use timeout to prevent infinite validation
      const triggerPromise = trigger(fieldsToValidate as any);
      const timeoutPromise = new Promise<boolean>((resolve) => {
        setTimeout(() => {
          console.log("Validation timeout reached");
          resolve(true); // Default to valid if timeout occurs
        }, 2000); // 2 second timeout
      });
      
      // Race between validation and timeout
      const stepValid = await Promise.race([triggerPromise, timeoutPromise]);
      console.log("Step valid result:", stepValid);
      
      setIsStepValid(stepValid);

      if (!stepValid && showToast) {
        const currentStepErrors = Object.entries(errors)
          .filter(([key]) =>
            fieldsToValidate.some((field) => key.startsWith(field.split(".")[0]))
          )
          .map(([key, value]: [string, any]) => {
            console.log("Error for key:", key, value);
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
          console.log("Showing toast with errors:", currentStepErrors);
          toast.error(
            `Please fix the following errors: ${currentStepErrors.join(", ")}`,
            {
              duration: 4000,
              position: 'top-center',
              style: {
                background: '#f44336',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
              },
            }
          );
        }
      }

      return stepValid;
    } catch (error) {
      console.error("Error in validateStep:", error);
      return true; // Default to valid if validation fails
    }
  };

  // Add debug function to check localStorage
  const checkLocalStorage = () => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('resume-storage');
      console.log('LocalStorage data:', storedData ? JSON.parse(storedData) : 'No data found');
      setShowDebug(!showDebug);
    }
  };

  // Add effect to validate the current step when it changes
  useEffect(() => {
    // Only validate when step changes, not on every formData update
    if (!isInitialLoad) {
      console.log("Validating after step/form change");
      // Only validate silently (without toasts) during normal navigation
      validateStep(currentStep, false).then(valid => {
        setIsStepValid(valid);
      });
    }
  }, [currentStep]);  // Remove formData dependency to prevent too many validations
  
  // Separate effect for form data changes
  useEffect(() => {
    const debouncedValidation = setTimeout(() => {
      if (!isInitialLoad) {
        console.log("Validating after form data change");
        validateStep(currentStep, false).then(valid => {
          setIsStepValid(valid);
        });
      }
    }, 500);  // Debounce validation to prevent hammering
    
    return () => clearTimeout(debouncedValidation);
  }, [JSON.stringify(formData)]); // Only run when formData changes, and use stringify to deep compare

  // After initial setup is complete
  useEffect(() => {
    if (initialReset) {
      // After first reset, consider initialization complete
      const initTimer = setTimeout(() => {
        console.log("Initial load complete");
        setIsInitialLoad(false);
      }, 1000);  // Increased to ensure everything is loaded
      
      return () => clearTimeout(initTimer);
    }
  }, [initialReset]);

  if (showPreview) {
    console.log("Rendering ResumePreview with template:", selectedTemplate);
    console.log("Available templates:", Object.keys(templates));
    console.log("Form data:", formData);
    
    // We're dynamically importing ResumePreview component
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

    // Don't render anything until client-side hydration is complete
    if (!isClient) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="animate-pulse text-xl font-medium text-gray-700 dark:text-gray-300">
            Loading Resume Builder...
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Add Toaster component */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug button */}
        <div className="text-right mb-4">
          <button
            onClick={checkLocalStorage}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
          >
            Debug Storage
          </button>
          {showDebug && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(resumeData, null, 2)}</pre>
            </div>
          )}
        </div>
        
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
                <button
                  type="button"
                  onClick={async () => {
                    // Validate current step before allowing navigation
                    const currentStepValid = await validateStep(currentStep, index > currentStep);
                    if (!currentStepValid && index > currentStep) {
                      return;
                    }
                    setCurrentStep(index);
                  }}
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {index + 1}
                </button>
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
              <div className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                  disabled={!isStepValid}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isStepValid
                      ? "bg-blue-600 text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      : "bg-gray-400 text-white cursor-not-allowed"
                  }`}
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
                {Object.keys(templates).map((id) => (
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
                {formData && formData.personalInfo && templates[selectedTemplate] ? (
                  React.createElement(templates[selectedTemplate], { data: formData })
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Loading template...
                  </div>
                )}
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