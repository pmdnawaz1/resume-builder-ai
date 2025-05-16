import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ResumeData } from '@/types';

const defaultResumeState: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    title: '',
    summary: '',
  },
  experience: [
    {
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
      highlights: [],
    },
  ],
  education: [
    {
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      description: '',
      gpa: '',
    },
  ],
  skills: [
    {
      category: '',
      items: [],
    },
  ],
};

interface ResumeStore {
  resumeData: ResumeData;
  isLoading: boolean;
  updateField: (path: string, value: any) => void;
  updateResumeData: (data: Partial<ResumeData>) => void;
  clearResumeData: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: defaultResumeState,
      isLoading: false,
      updateField: (path, value) => 
        set((state) => {
          const newData = { ...state.resumeData };
          const keys = path.split('.');
          let current = newData as any;
          
          // Navigate to the last parent object
          for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            // Handle array indices
            if (key.includes('[') && key.includes(']')) {
              const arrayName = key.split('[')[0];
              const index = parseInt(key.split('[')[1].split(']')[0]);
              current = current[arrayName][index];
            } else {
              current = current[key];
            }
          }
          
          // Set the value on the last key
          const lastKey = keys[keys.length - 1];
          if (lastKey.includes('[') && lastKey.includes(']')) {
            const arrayName = lastKey.split('[')[0];
            const index = parseInt(lastKey.split('[')[1].split(']')[0]);
            current[arrayName][index] = value;
          } else {
            current[lastKey] = value;
          }
          
          return { resumeData: newData };
        }),
      updateResumeData: (data) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),
      clearResumeData: () => set({ resumeData: defaultResumeState }),
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ resumeData: state.resumeData }),
      skipHydration: false,
      version: 1,
    }
  )
); 