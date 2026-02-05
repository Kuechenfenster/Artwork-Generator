
export enum ProjectStatus {
  ACTIVE = 'Active',
  OVERDUE = 'Overdue',
  PENDING = 'Pending',
  DRAFT = 'Draft'
}

export interface Project {
  id: string;
  name: string;
  brand: string;
  category: string;
  status: ProjectStatus;
  dueDate: string;
  description?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export interface WarningTemplate {
  id: string;
  name: string;
  subType: string;
  en: string;
  zh_cn: string;
  fr: string;
  de: string;
  es: string;
  status: 'APPROVED' | 'PENDING QA' | 'DRAFT';
  category: string;
  tags: string[];
  linkedSymbolIds?: string[];
}

export interface SymbolConstraint {
  id: string;
  name: string;
  minWidth: number;
  aspectRatio: string;
  regulatory: string;
  icon: string;
  tag: string;
}

export interface Language {
  id: string;
  name: string;
  region: string;
}

export interface RegionalPreset {
  id: string;
  name: string;
  languages: string[]; // Language IDs
  type: 'Market' | 'Customer';
}
