/**
 * Portfolio Data - Complete portfolio information extracted from HTML v2.0
 * This file contains all project information, personal details, and metadata
 * for the Next.js portfolio site.
 * 
 * Generated from: /public/v2.0/index.html
 * Last updated: May 25, 2025
 */

import portfolioDataJson from './portfolio-data.json';
import { PortfolioData, Project, SidebarInfo } from '../types/portfolio';
import { projectGalleries, externalLinks } from './assetPaths';

// Type-safe portfolio data
export const portfolioData: PortfolioData = portfolioDataJson as PortfolioData;

// Sidebar information
export const sidebarInfo: SidebarInfo = portfolioData.sidebar;

// All projects
export const allProjects: Project[] = portfolioData.projects;

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category: 'unity' | 'unreal' | 'applications'): Project[] => {
  return allProjects.filter(project => project.category === category);
};

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | undefined => {
  return allProjects.find(project => project.id === id);
};

/**
 * Get featured projects (projects with store links)
 */
export const getFeaturedProjects = (): Project[] => {
  return allProjects.filter(project => project.storeLinks);
};

/**
 * Get projects with download statistics
 */
export const getProjectsWithDownloadStats = (): Project[] => {
  return allProjects.filter(project => 
    project.achievements.some(achievement => 
      achievement.toLowerCase().includes('downloads')
    )
  );
};

/**
 * Get project gallery with fallback to assetPaths
 */
export const getProjectGallery = (projectId: string): string[] => {
  const project = getProjectById(projectId);
  if (project && project.gallery.length > 0) {
    return project.gallery;
  }
  
  // Fallback to assetPaths gallery
  return projectGalleries[projectId as keyof typeof projectGalleries] || [];
};

/**
 * Get project store links with fallback to assetPaths
 */
export const getProjectStoreLinks = (projectId: string) => {
  const project = getProjectById(projectId);
  if (project && project.storeLinks) {
    return project.storeLinks;
  }
  
  // Fallback to assetPaths external links
  return {
    android: externalLinks.playStore[projectId as keyof typeof externalLinks.playStore],
    ios: externalLinks.appStore[projectId as keyof typeof externalLinks.appStore]
  };
};

/**
 * Get project website with fallback to assetPaths
 */
export const getProjectWebsite = (projectId: string): string | undefined => {
  const project = getProjectById(projectId);
  if (project && project.website) {
    return project.website;
  }
  
  // Fallback to assetPaths external links
  return externalLinks.websites[projectId as keyof typeof externalLinks.websites];
};

/**
 * Portfolio statistics
 */
export const portfolioStats = {
  totalProjects: allProjects.length,
  categories: {
    unity: getProjectsByCategory('unity').length,
    unreal: getProjectsByCategory('unreal').length,
    applications: getProjectsByCategory('applications').length
    },
  featuredProjects: getFeaturedProjects().length,
  projectsWithDownloadStats: getProjectsWithDownloadStats().length,
  totalGalleryImages: allProjects.reduce((sum, project) => sum + project.gallery.length, 0),
  technologies: Array.from(new Set(allProjects.flatMap(project => project.tags.map(tag => tag.label))))
};

/**
 * Search projects by title, description, or technology
 */
export const searchProjects = (query: string): Project[] => {
  const lowercaseQuery = query.toLowerCase();
  
  return allProjects.filter(project => 
    project.title.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.tags.some(tag => tag.label.toLowerCase().includes(lowercaseQuery)) ||
    project.responsibilities.some(resp => resp.toLowerCase().includes(lowercaseQuery)) ||
    project.achievements.some(ach => ach.toLowerCase().includes(lowercaseQuery))
  );
};

/**
 * Get recent projects (sorted by timeline, most recent first)
 */
export const getRecentProjects = (limit?: number): Project[] => {
  const sortedProjects = [...allProjects].sort((a, b) => {
    // Extract year from timeline (e.g., "Sep/2024 — Jan/2025")
    const aYear = parseInt(a.timeline.split('—')[1]?.trim().split('/')[1] || '0');
    const bYear = parseInt(b.timeline.split('—')[1]?.trim().split('/')[1] || '0');
    return bYear - aYear;
  });
  
  return limit ? sortedProjects.slice(0, limit) : sortedProjects;
};

/**
 * Export default object with all utilities
 */
const portfolioService = {
  // Data
  portfolioData,
  sidebarInfo,
  allProjects,
  portfolioStats,
  
  // Getters
  getProjectsByCategory,
  getProjectById,
  getFeaturedProjects,
  getProjectsWithDownloadStats,
  getProjectGallery,
  getProjectStoreLinks,
  getProjectWebsite,
  getRecentProjects,
  
  // Utilities
  searchProjects
};

export default portfolioService;
