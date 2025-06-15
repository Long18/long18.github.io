'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { allProjects } from '@/data/assetPaths';
import { Project } from '@/types/portfolio';
import ProjectDetail from '../ProjectDetail';
import GlassButton from '@/components/ui/GlassButton';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance';
import { colorSystem } from '@/lib/colors';
import { getGlassClasses } from '@/lib/utils';

// Project categories for the new portfolio structure
const projectCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'unity', label: 'Unity Games' },
  { id: 'unreal', label: 'Unreal Games' },
  { id: 'applications', label: 'Applications' },
];

// Technology color mapping using the new semantic color system
const getTechColor = (tech: string): string => {
  const techColor = colorSystem.getTechColor(tech);

  // Enhanced gradient mapping for tech colors in portfolio section
  const enhancedColorMap: Record<string, string> = {
    'tech-unity': 'bg-tech-unity/20 text-tech-unity border-tech-unity/30',
    'tech-unreal': 'bg-tech-unreal/20 text-tech-unreal border-tech-unreal/30',
    'tech-csharp': 'bg-tech-csharp/20 text-tech-csharp border-tech-csharp/30',
    'tech-cpp': 'bg-tech-cpp/20 text-tech-cpp border-tech-cpp/30',
    'tech-javascript': 'bg-tech-javascript/20 text-tech-javascript-foreground border-tech-javascript/30',
    'tech-typescript': 'bg-tech-typescript/20 text-tech-typescript border-tech-typescript/30',
    'tech-web': 'bg-tech-web/20 text-tech-web border-tech-web/30',
    'tech-mobile': 'bg-tech-mobile/20 text-tech-mobile border-tech-mobile/30',
    'tech-application': 'bg-tech-application/20 text-tech-application border-tech-application/30',
    'tech-default': 'bg-tech-default/20 text-tech-default border-tech-default/30',
  };

  return enhancedColorMap[techColor] || enhancedColorMap['tech-default'];
};

// Interface for ProjectCard props
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index?: number;
}

// Glass skeleton component for loading state
function ProjectCardSkeleton() {
  return (
    <div className="glass-secondary glass-shimmer border border-glass-border rounded-3xl overflow-hidden animate-pulse shadow-glass-lg">
      <div className="h-48 bg-glass-surface-tertiary"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-glass-surface-secondary rounded-2xl w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-glass-surface-secondary rounded-2xl"></div>
          <div className="h-4 bg-glass-surface-secondary rounded-2xl w-5/6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-glass-surface-secondary rounded-2xl"></div>
            <div className="h-4 w-4 bg-glass-surface-secondary rounded-2xl"></div>
          </div>
          <div className="h-3 bg-glass-surface-secondary rounded-2xl w-16"></div>
        </div>
      </div>
    </div>
  );
}

interface PortfolioProps {
  onProjectSelect?: (project: Project) => void;
}

export default function Portfolio({ onProjectSelect }: PortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<
    'default' | 'featured' | 'newest' | 'alphabetical'
  >('default');
  const [isLoading, setIsLoading] = useState(false);

  const { performanceMode } = useAnimationPerformance();

  // Refs for animations
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
      }
    };

    if (isSelectOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isSelectOpen]);

  const filteredProjects = useMemo(() => {
    let filtered = allProjects;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.label.toLowerCase().includes(query))
      );
    }

    // Sort projects
    switch (sortBy) {
      case 'featured':
        filtered = [...filtered].sort((a, b) => {
          const aFeatured =
            a.storeLinks && (a.storeLinks.android || a.storeLinks.ios);
          const bFeatured =
            b.storeLinks && (b.storeLinks.android || b.storeLinks.ios);
          if (aFeatured && !bFeatured) return -1;
          if (!aFeatured && bFeatured) return 1;
          return 0;
        });
        break;
      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        filtered = [...filtered].sort((a, b) => {
          const aDate = a.timeline || '';
          const bDate = b.timeline || '';
          return bDate.localeCompare(aDate);
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategory, debouncedSearchQuery, sortBy]);

  const handleCategorySelect = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
    setIsSelectOpen(false);

    // Simulate loading delay for smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (newSortBy: typeof sortBy) => {
    setSortBy(newSortBy);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsProjectDetailOpen(true);
    onProjectSelect?.(project);
  };

  // Animation variants based on performance mode
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: performanceMode === 'low' ? 0 : 0.1,
        duration: performanceMode === 'low' ? 0.2 : 0.6,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: performanceMode === 'low' ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: performanceMode === 'low' ? 0.2 : 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="space-y-8"
      role="main"
      aria-label="Portfolio section"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {selectedProject && isProjectDetailOpen && (
        <ProjectDetail
          project={selectedProject}
          isOpen={isProjectDetailOpen}
          onClose={() => {
            setIsProjectDetailOpen(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Header */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-portfolio-text-primary animate-fade-in-up">
            Portfolio
          </h2>

          {/* Project Count & Clear Filters */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-portfolio-text-secondary">
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? 's' : ''}
              {searchQuery && ' found'}
            </span>

            {(searchQuery ||
              selectedCategory !== 'all' ||
              sortBy !== 'default') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-xs text-portfolio-accent hover:text-secondary transition-colors duration-500 px-2 py-1 rounded-2xl hover:bg-portfolio-accent/10 backdrop-blur-sm hover:shadow-lg hover:shadow-portfolio-accent/20"
              >
                Clear filters
              </motion.button>
            )}
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <motion.div className="relative" variants={itemVariants}>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects by name, description, or technology..."
            className="w-full p-4 pl-12 bg-portfolio-surface-secondary/90 backdrop-blur-sm border border-border/50 rounded-3xl text-portfolio-text-primary placeholder-portfolio-text-muted/60 focus:border-portfolio-accent focus:outline-none focus:ring-2 focus:ring-portfolio-accent/20 focus:shadow-xl focus:shadow-portfolio-accent/10 transition-all duration-500 animate-slide-in-up"
            aria-label="Search projects"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-portfolio-text-muted/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          {searchQuery && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-portfolio-text-muted/60 hover:text-portfolio-accent transition-colors duration-500 p-1 rounded-2xl hover:bg-portfolio-accent/10 hover:shadow-lg hover:shadow-portfolio-accent/20"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>

        {/* Filters Row */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          variants={itemVariants}
        >
          {/* Enhanced Category Filter Dropdown */}
          <div className="relative z-[10]">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
              className="flex items-center justify-between w-full sm:w-64 p-4 bg-portfolio-surface-secondary/90 backdrop-blur-sm border border-border/50 rounded-3xl text-portfolio-text-primary hover:bg-portfolio-surface-tertiary/90 focus:bg-portfolio-surface-tertiary/90 focus:outline-none focus:ring-2 focus:ring-portfolio-accent/20 focus:border-portfolio-accent focus:shadow-xl focus:shadow-portfolio-accent/10 transition-all duration-500 relative z-[10]"
              aria-expanded={isSelectOpen}
              aria-haspopup="listbox"
              aria-label="Select project category"
            >
              <span>
                {projectCategories.find((cat) => cat.id === selectedCategory)
                  ?.label || 'All Projects'}
              </span>
              <motion.svg
                animate={{ rotate: isSelectOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 text-portfolio-text-muted/60 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </motion.svg>
            </motion.button>

            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: isSelectOpen ? 1 : 0,
                y: isSelectOpen ? 0 : -10,
                pointerEvents: isSelectOpen ? 'auto' : 'none',
              }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 mt-2 bg-portfolio-surface-secondary/95 backdrop-blur-sm border border-border/50 rounded-3xl shadow-2xl z-[10] overflow-hidden"
              role="listbox"
              aria-label="Project categories"
            >
              {projectCategories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full text-left p-4 transition-colors duration-300 border-b border-border/30 last:border-0 relative z-[10] ${
                    selectedCategory === category.id
                      ? 'text-portfolio-accent bg-portfolio-accent/5'
                      : 'text-portfolio-text-primary'
                  }`}
                >
                  {category.label}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Sort Options */}
          <div className="flex flex-wrap gap-2">
            {['default', 'featured', 'newest', 'alphabetical'].map((sort) => (
              <motion.button
                key={sort}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSortChange(sort as typeof sortBy)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm ${
                  sortBy === sort
                    ? 'bg-portfolio-accent text-portfolio-accent-foreground border-portfolio-accent shadow-lg shadow-portfolio-accent/20'
                    : 'bg-portfolio-surface-secondary text-portfolio-text-secondary border-border/50 hover:bg-portfolio-surface-tertiary hover:text-portfolio-text-primary hover:border-portfolio-accent/30'
                }`}
              >
                {sort === 'default'
                  ? 'Default'
                  : sort === 'featured'
                  ? 'Featured'
                  : sort === 'newest'
                  ? 'Newest'
                  : 'A-Z'}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          role="grid"
          aria-label="Projects grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              index={index}
            />
          ))}
        </motion.div>
      )}

      {/* Enhanced Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <motion.div
          className="text-center py-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-portfolio-text-muted/30 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.2-5.5-2.291M15 3H9v3.4a1.6 1.6 0 003.2 0V3z"
              />
            </svg>
          </div>
          <h3 className="text-portfolio-text-primary text-xl font-semibold mb-3">
            {searchQuery
              ? `No projects found matching "${searchQuery}"`
              : `No projects found for this category`}
          </h3>
          <p className="text-portfolio-text-secondary text-base mb-6 max-w-md mx-auto">
            Try adjusting your search terms or selecting a different category to
            explore more projects.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="px-6 py-3 bg-portfolio-accent/20 text-portfolio-accent border border-portfolio-accent/30 rounded-xl hover:bg-portfolio-accent hover:text-portfolio-accent-foreground transition-all duration-300 font-medium"
          >
            Clear All Filters
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Memoized project card component for better performance
const ProjectCard = React.memo<ProjectCardProps>(function ProjectCard({
  project,
  onClick,
  index = 0,
}) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { performanceMode } = useAnimationPerformance();

  // Get all available images for the project
  const allImages = useMemo(() => {
    const images = [];
    if (project.image) images.push(project.image);
    if (project.gallery) {
      project.gallery.forEach((img: string) => {
        if (img !== project.image) {
          images.push(img);
        }
      });
    }
    return images;
  }, [project.image, project.gallery]);

  const hasMultipleImages = allImages.length > 1;

  // Gallery navigation functions
  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }
    },
    [hasMultipleImages, allImages.length]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (hasMultipleImages) {
        setCurrentImageIndex(
          (prev) => (prev - 1 + allImages.length) % allImages.length
        );
      }
    },
    [hasMultipleImages, allImages.length]
  );

  // Animation variants based on performance
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: performanceMode === 'low' ? 0 : 30,
      scale: performanceMode === 'low' ? 1 : 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: performanceMode === 'low' ? 0.2 : 0.6,
        delay: performanceMode === 'low' ? 0 : index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={
        performanceMode !== 'low'
          ? {
              scale: 1.05,
              y: -10,
              transition: { duration: 0.3 },
            }
          : {}
      }
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-portfolio-surface-secondary/90 backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:border-portfolio-accent/50 hover:shadow-xl hover:shadow-portfolio-accent/20 focus:outline-none focus:ring-2 focus:ring-portfolio-accent/50 animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}${
        hasMultipleImages ? ` - ${allImages.length} images` : ''
      }`}
    >
      {/* Project Image Gallery */}
      <div className="relative h-48 overflow-hidden">
        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-portfolio-surface-tertiary animate-pulse flex items-center justify-center">
            <svg
              className="w-8 h-8 text-portfolio-text-muted/30 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {/* Current Image Display */}
        {allImages.length > 0 && allImages[currentImageIndex] && !imageError ? (
          <Image
            src={allImages[currentImageIndex]}
            alt={`${project.title} - Image ${currentImageIndex + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-portfolio-surface-tertiary flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-portfolio-text-muted/30 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-portfolio-text-muted/60 text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Gallery Navigation Controls */}
        {hasMultipleImages && !isImageLoading && !imageError && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-portfolio-surface-primary/60 hover:bg-portfolio-surface-primary/80 text-portfolio-text-primary p-2 rounded-2xl backdrop-blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-portfolio-accent/50"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-portfolio-surface-primary/60 hover:bg-portfolio-surface-primary/80 text-portfolio-text-primary p-2 rounded-2xl backdrop-blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-portfolio-accent/50"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>

            {/* Image counter */}
            <div className="absolute top-2 right-2 bg-portfolio-surface-primary/70 backdrop-blur-sm text-portfolio-text-primary px-2.5 py-1 rounded-2xl text-xs transition-all duration-500 opacity-0 group-hover:opacity-100 border border-portfolio-text-primary/20 shadow-lg">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 p-1 rounded-2xl bg-portfolio-surface-primary/30 backdrop-blur-sm">
              {allImages.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-2xl transition-all duration-500 ${
                    idx === currentImageIndex
                      ? 'bg-portfolio-accent scale-110'
                      : 'bg-portfolio-text-primary/50 hover:bg-portfolio-text-primary/80'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-portfolio-accent/90 backdrop-blur-sm text-portfolio-accent-foreground text-xs font-semibold rounded-2xl border border-portfolio-accent/20 shadow-lg">
            {project.category.replace('-', ' ')}
          </span>
        </div>

        {/* Featured Badge */}
        {project.storeLinks &&
          (project.storeLinks.android || project.storeLinks.ios) && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1.5 bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs font-semibold rounded-2xl border border-secondary/20 shadow-lg flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
          )}
      </div>

      {/* Project Info */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-portfolio-text-primary truncate group-hover:text-portfolio-accent transition-colors duration-500">
          {project.title}
        </h3>

        <p className="text-sm text-portfolio-text-secondary line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Technology Tags */}
        <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
          {project.tags.slice(0, 3).map((tag, idx) => (
            <motion.span
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-2xl border transition-all duration-500 ${getTechColor(
                tag.label
              )}`}
            >
              {tag.label}
            </motion.span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2.5 py-1.5 text-xs font-medium rounded-2xl bg-portfolio-surface-tertiary/50 backdrop-blur-sm text-portfolio-text-secondary border border-border/30">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {project.website && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-3 py-1.5 bg-portfolio-accent/20 backdrop-blur-sm text-portfolio-accent hover:bg-portfolio-accent/30 hover:text-portfolio-accent transition-all duration-500 rounded-2xl border border-portfolio-accent/30"
                title="View Website"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-xs font-medium">View</span>
              </motion.a>
            )}

            {project.storeLinks?.android && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={project.storeLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 px-3 py-1.5 bg-tech-application/20 text-tech-application hover:bg-tech-application/30 hover:text-tech-application transition-all duration-300 rounded-lg border border-tech-application/30"
                title="Download on Google Play"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span className="text-xs font-medium">Play</span>
              </motion.a>
            )}
          </div>

          <div className="text-right">
            <span className="text-portfolio-text-muted/60 text-xs">
              {project.timeline || 'Recent'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
