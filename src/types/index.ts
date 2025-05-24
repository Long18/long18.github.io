export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: ProjectCategory;
  featured: boolean;
  image: string;
  links?: {
    demo?: string;
    github?: string;
    appStore?: string;
    playStore?: string;
    download?: string;
    website?: string;
    apk?: string;
    windows?: string;
  };
  details?: {
    period: string;
    description: string;
    responsibilities: string[];
    achievements: string[];
    images: string[];
    videos?: Array<{
      poster: string;
      src: string;
    }>;
    status?: string;
    teamSize?: string;
    gameplay?: string[];
    technologies_detailed?: string[];
  };
}

export interface ProjectDetail {
  title: string;
  content: string;
  images?: string[];
  videos?: string[];
}

export type ProjectCategory = 
  | 'unity' 
  | 'unreal' 
  | 'web' 
  | 'mobile' 
  | 'ai' 
  | 'application' 
  | 'web-development' 
  | 'system' 
  | 'other';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
  location: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
  icon?: string;
  years?: number;
}

export type SkillCategory = 
  | 'programming' 
  | 'game-engines' 
  | 'tools' 
  | 'soft-skills' 
  | 'languages';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface ContactInfo {
  email: string;
  phone?: string;
  location: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured: boolean;
  readTime: number;
  slug: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Theme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

export type Locale = 'en' | 'vi';
