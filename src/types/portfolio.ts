// TypeScript interfaces for the portfolio data structure
// Generated from extracted HTML portfolio data v2.0

export interface SocialLinks {
  github: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  skype: string;
}

export interface SidebarInfo {
  name: string;
  alias: string;
  avatar: string;
  email: string;
  phone: string;
  birthday: string;
  location: string;
  socials: SocialLinks;
}

export interface TechnologyTag {
  label: string;
  colorClass: string;
}

export interface StoreLinks {
  android?: string;
  ios?: string;
}

export interface VideoAsset {
  src: string;
  poster?: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'unity' | 'unreal' | 'applications';
  image: string;
  tags: TechnologyTag[];
  timeline: string;
  description: string;
  gallery: string[];
  responsibilities: string[];
  achievements: string[];
  storeLinks?: StoreLinks;
  website?: string;
  videos?: VideoAsset[];
}

export interface PortfolioData {
  sidebar: SidebarInfo;
  projects: Project[];
}

// Tailwind color class mappings for technology tags
export const TECHNOLOGY_COLORS: Record<string, string> = {
  'Unity': 'bg-gray-800 text-white',
  'Unreal Engine': 'bg-purple-700 text-white',
  'Unreal': 'bg-purple-700 text-white',
  'React': 'bg-blue-600 text-white',
  'Applications': 'bg-green-600 text-white',
  'Android Studio': 'bg-green-600 text-white',
  'AR/VR': 'bg-pink-600 text-white',
  'C++': 'bg-red-700 text-white',
  'JavaScript': 'bg-yellow-500 text-black',
  'Android': 'bg-lime-600 text-white',
  'iOS': 'bg-indigo-600 text-white'
};

// Project categories for filtering
export const PROJECT_CATEGORIES = {
  UNITY: 'unity' as const,
  UNREAL: 'unreal' as const,
  APPLICATIONS: 'applications' as const
} as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[keyof typeof PROJECT_CATEGORIES];
