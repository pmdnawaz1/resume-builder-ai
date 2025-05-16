"use client";

import React, { useEffect, useState, forwardRef } from "react";
import { useResumeStore } from "@/lib/store";

interface FormInputProps {
  id: string;
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  defaultValue?: string;
  autoComplete?: string;
  helperText?: string;
  storePath?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
  id,
  name,
  label,
  placeholder = "",
  type = "text",
  required = false,
  maxLength,
  defaultValue = "",
  autoComplete,
  helperText,
  storePath,
  ...rest
}, ref) => {
  const { resumeData, updateField } = useResumeStore();
  
  // Get value from store if storePath is provided
  const getValueFromStore = () => {
    if (!storePath) return defaultValue;
    
    const keys = storePath.split('.');
    let value = resumeData as any;
    
    for (const key of keys) {
      if (key.includes('[') && key.includes(']')) {
        const arrayName = key.split('[')[0];
        const index = parseInt(key.split('[')[1].split(']')[0]);
        value = value[arrayName]?.[index];
      } else {
        value = value[key];
      }
      
      if (value === undefined) return defaultValue;
    }
    
    return value || defaultValue;
  };
  
  const [inputValue, setInputValue] = useState(getValueFromStore());
  const charCount = inputValue?.length || 0;
  
  // Update local state when store data changes
  useEffect(() => {
    const storeValue = getValueFromStore();
    
    // Only update if the field is not currently being edited
    if (document.activeElement?.id !== id) {
      setInputValue(storeValue);
    }
  }, [resumeData, storePath, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Update store if storePath is provided
    if (storePath) {
      updateField(storePath, newValue);
    }
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          ref={ref}
          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          {...rest}
        />
        {maxLength && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span
              className={`text-xs ${
                charCount > maxLength
                  ? "text-red-500"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {charCount}/{maxLength}
            </span>
          </div>
        )}
      </div>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
})

FormInput.displayName = "FormInput";
