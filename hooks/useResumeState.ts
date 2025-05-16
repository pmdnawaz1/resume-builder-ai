import { useState, useEffect } from 'react';
import { ResumeData } from '@/types';

const STORAGE_KEY = 'resume_builder_state';

const defaultResumeState: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [
    {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    },
  ],
  education: [
    {
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      description: '',
    },
  ],
  projects: [
    {
      name: '',
      description: '',
      link: '',
      technologies: [],
    },
  ],
  skills: [
    {
      category: '',
      items: [],
    },
  ],
};

export const useResumeState = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeState);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        setResumeData(JSON.parse(savedState));
      }
    } catch (error) {
      console.error('Error loading resume state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save state to localStorage whenever it changes
  const updateResumeData = (newData: ResumeData) => {
    setResumeData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving resume state:', error);
    }
  };

  const clearResumeData = () => {
    setResumeData(defaultResumeState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing resume state:', error);
    }
  };

  return {
    resumeData,
    updateResumeData,
    clearResumeData,
    isLoading,
    defaultResumeState,
  };
};
