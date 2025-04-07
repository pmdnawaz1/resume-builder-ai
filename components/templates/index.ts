// Export all templates for easy importing
import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import TechnicalTemplate from "./TechnicalTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";

export {
  ClassicTemplate,
  ModernTemplate,
  MinimalTemplate,
  TechnicalTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
};

// For template mapping
export const templates = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  technical: TechnicalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
};

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<{ data: any }>;
}

// For UI display and selection
export const templateList: TemplateInfo[] = [
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

export default templates;
