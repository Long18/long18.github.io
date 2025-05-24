'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { projects, projectCategories } from '@/data/projects';
import { Project } from '@/types';
import ProjectDetail from '../ProjectDetail';

interface PortfolioProps {
  onProjectSelect?: (project: Project) => void;
}

export default function Portfolio({ onProjectSelect }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    
    if (selectedCategory === 'unity') {
      return projects.filter(p => p.category === 'unity');
    }
    
    if (selectedCategory === 'unreal') {
      return projects.filter(p => p.category === 'unreal');
    }
    
    if (selectedCategory === 'web') {
      return projects.filter(p => p.category === 'web');
    }
    
    if (selectedCategory === 'mobile') {
      return projects.filter(p => p.category === 'mobile');
    }
    
    if (selectedCategory === 'ai') {
      return projects.filter(p => p.category === 'ai');
    }
    
    return projects.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsSelectOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDetailOpen(true);
    onProjectSelect?.(project);
  };

  const handleProjectDetailClose = () => {
    setIsProjectDetailOpen(false);
    setSelectedProject(null);
  };

  return (
    <>
      <section className="p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-8">Portfolio</h2>
        </header>

      {/* Filter Controls */}
      <div className="mb-8">
        {/* Desktop Filter Buttons */}
        <ul className="hidden md:flex space-x-4 mb-8">
          {projectCategories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                aria-label={`Filter projects by ${category.label}`}
                aria-pressed={selectedCategory === category.id}
                className={`
                  px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300
                  ${selectedCategory === category.id
                    ? 'bg-orange-400 text-gray-900'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }
                `}
              >
                {category.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Filter Dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full flex items-center justify-between p-4 bg-gray-800 rounded-lg text-white"
          >
            <span>
              {projectCategories.find(c => c.id === selectedCategory)?.label || 'All'}
            </span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isSelectOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {isSelectOpen && (
              <motion.ul
                className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {projectCategories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className={`
                        w-full text-left p-4 hover:bg-gray-700 transition-colors
                        ${selectedCategory === category.id ? 'text-orange-400' : 'text-white'}
                      `}
                    >
                      {category.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Projects Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No projects found for this category.</p>
        </div>
      )}
    </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          isOpen={isProjectDetailOpen}
          onClose={handleProjectDetailClose}
        />
      )}
    </>
  );
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const mainImage = project.image || '/assets/images/placeholder.png';

  return (
    <motion.div
      className="group cursor-pointer bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative aspect-video overflow-hidden">
        {!imageError ? (
          <Image
            src={mainImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </motion.div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-orange-400 text-gray-900 text-xs font-semibold rounded-full">
            {project.category.replace('-', ' ')}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {project.links?.playStore && (
              <a
                href={project.links.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </a>
            )}
            {project.links?.appStore && (
              <a
                href={project.links.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.19 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
              </a>
            )}
          </div>
          
          <span className="text-gray-500 text-xs">
            {project.details?.period || 'Recent'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
