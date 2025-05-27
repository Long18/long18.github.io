// filepath: /Users/long.lnt/Desktop/Projects/long18.github.io/src/components/sections/Portfolio.tsx
'use client';

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import Image from 'next/image';
import { allProjects } from '@/data/assetPaths';

// Project categories for the new portfolio structure
const projectCategories = [
  { id: 'all', label: 'All Projects' },
  { id: 'unity', label: 'Unity Games' },
  { id: 'unreal', label: 'Unreal Games' },
  { id: 'applications', label: 'Applications' },
];
import { Project } from '@/types/portfolio';
import ProjectDetail from '../ProjectDetail';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Technology color mapping using portfolio design system
const getTechColor = (tech: string): string => {
  const techColors: Record<string, string> = {
    Unity: 'bg-unity-tag/20 text-unity-tag border-unity-tag/30',
    'C#': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Unreal Engine': 'bg-unreal-tag/20 text-unreal-tag border-unreal-tag/30',
    'C++': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    JavaScript: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    TypeScript: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    React: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/30',
    'Next.js': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    'Node.js': 'bg-green-500/20 text-green-400 border-green-500/30',
    Python: 'bg-green-600/20 text-green-300 border-green-600/30',
    Java: 'bg-orange-600/20 text-orange-300 border-orange-600/30',
    'Android Studio':
      'bg-application-tag/20 text-application-tag border-application-tag/30',
    Blueprint: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
    AR: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    VR: 'bg-purple-600/20 text-purple-300 border-purple-600/30',
    AI: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Machine Learning': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Google Maps API': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return techColors[tech] || 'bg-gray-600/20 text-gray-400 border-gray-600/30';
};

// Interface for ProjectCard props
interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index?: number;
}

// Skeleton component for loading state using design system colors
function ProjectCardSkeleton() {
  return (
    <div className="bg-eerie-black-2/90 backdrop-blur-sm border border-jet/50 rounded-3xl overflow-hidden animate-pulse shadow-lg">
      <div className="h-48 bg-eerie-black-1"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-jet/70 rounded-2xl w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-jet/70 rounded-2xl"></div>
          <div className="h-4 bg-jet/70 rounded-2xl w-5/6"></div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="h-4 w-4 bg-jet/70 rounded-2xl"></div>
            <div className="h-4 w-4 bg-jet/70 rounded-2xl"></div>
          </div>
          <div className="h-3 bg-jet/70 rounded-2xl w-16"></div>
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

  // Refs for GSAP animations
  const portfolioRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
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
        !dropdownRef.current.contains(event.target as Node) &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsSelectOpen(false);
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
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
          // Consider projects with store links as featured
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

      // Animate grid change
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }
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

  const toggleDropdown = () => {
    setIsSelectOpen(!isSelectOpen);

    // Animate arrow rotation
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: !isSelectOpen ? 180 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  // GSAP animations
  useGSAP(() => {
    if (!portfolioRef.current) return;

    // Initial entrance animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    gsap.fromTo(
      filterRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power2.out' }
    );

    gsap.fromTo(
      searchRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
    );

    // Animate project cards on scroll
    const cards = gridRef.current?.children;
    if (cards) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  // Animate grid when projects change
  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [filteredProjects]);

  return (
    <div
      ref={portfolioRef}
      className="space-y-8"
      role="main"
      aria-label="Portfolio section"
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 ref={titleRef} className="text-2xl font-bold text-white-1">
            Portfolio
          </h2>

          {/* Project Count & Clear Filters */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white-2">
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? 's' : ''}
              {searchQuery && ' found'}
            </span>

            {(searchQuery ||
              selectedCategory !== 'all' ||
              sortBy !== 'default') && (
              <button
                onClick={clearFilters}
                className="text-xs text-orange-yellow-crayola hover:text-vegas-gold transition-colors duration-500 px-2 py-1 rounded-2xl hover:bg-orange-yellow-crayola/10 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-yellow-crayola/20"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="relative">
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search projects by name, description, or technology..."
            className="w-full p-4 pl-12 bg-eerie-black-2/90 backdrop-blur-sm border border-jet/50 rounded-3xl text-white-1 placeholder-white-2/60 focus:border-orange-yellow-crayola focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/20 focus:shadow-xl focus:shadow-orange-yellow-crayola/10 transition-all duration-500"
            aria-label="Search projects"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white-2/60"
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
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white-2/60 hover:text-orange-yellow-crayola transition-colors duration-500 p-1 rounded-2xl hover:bg-orange-yellow-crayola/10 hover:shadow-lg hover:shadow-orange-yellow-crayola/20"
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
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Enhanced Category Filter Dropdown */}
          <div ref={filterRef} className="relative z-[10]">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full sm:w-64 p-4 bg-eerie-black-2/90 backdrop-blur-sm border border-jet/50 rounded-3xl text-white-1 hover:bg-eerie-black-1/90 focus:bg-eerie-black-1/90 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/20 focus:border-orange-yellow-crayola focus:shadow-xl focus:shadow-orange-yellow-crayola/10 transition-all duration-500 relative z-[10]"
              aria-expanded={isSelectOpen}
              aria-haspopup="listbox"
              aria-label="Select project category"
            >
              <span>
                {projectCategories.find((cat) => cat.id === selectedCategory)
                  ?.label || 'All Projects'}
              </span>
              <svg
                ref={arrowRef}
                className="w-5 h-5 text-white-2/60 transition-transform duration-500"
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
              </svg>
            </button>

            <div
              ref={dropdownRef}
              className={`absolute top-full left-0 right-0 mt-2 bg-eerie-black-2/95 backdrop-blur-sm border border-jet/50 rounded-3xl shadow-2xl z-[10] overflow-hidden transition-all duration-500 ${
                isSelectOpen
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}
              role="listbox"
              aria-label="Project categories"
              style={{ isolation: 'isolate' }}
            >
              {projectCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`
                    w-full text-left p-4 hover:bg-eerie-black-1 transition-colors duration-300 border-b border-jet/30 last:border-0 relative z-[10]
                    ${
                      selectedCategory === category.id
                        ? 'text-orange-yellow-crayola bg-orange-yellow-crayola/5'
                        : 'text-white-1'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Sort Options */}
          <div className="flex flex-wrap gap-2">
            {['default', 'featured', 'newest', 'alphabetical'].map((sort) => (
              <button
                key={sort}
                onClick={() => handleSortChange(sort as typeof sortBy)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border backdrop-blur-sm
                  ${
                    sortBy === sort
                      ? 'bg-orange-yellow-crayola text-smoky-black border-orange-yellow-crayola shadow-lg shadow-orange-yellow-crayola/20'
                      : 'bg-eerie-black-2 text-white-2 border-jet/50 hover:bg-eerie-black-1 hover:text-white-1 hover:border-orange-yellow-crayola/30'
                  }
                `}
              >
                {sort === 'default'
                  ? 'Default'
                  : sort === 'featured'
                  ? 'Featured'
                  : sort === 'newest'
                  ? 'Newest'
                  : 'A-Z'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Projects Grid with better responsive breakpoints */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          role="grid"
          aria-label="Projects grid"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Enhanced Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="mb-6">
            <svg
              className="w-20 h-20 text-white-2/30 mx-auto"
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
          <h3 className="text-white-1 text-xl font-semibold mb-3">
            {searchQuery
              ? `No projects found matching "${searchQuery}"`
              : `No projects found for this category`}
          </h3>
          <p className="text-white-2 text-base mb-6 max-w-md mx-auto">
            Try adjusting your search terms or selecting a different category to
            explore more projects.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-orange-yellow-crayola/20 text-orange-yellow-crayola border border-orange-yellow-crayola/30 rounded-xl hover:bg-orange-yellow-crayola hover:text-smoky-black transition-all duration-300 font-medium"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

// Memoized project card component for better performance
const ProjectCard = React.memo<ProjectCardProps>(function ProjectCard({
  project,
  onClick,
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Gallery/Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [autoPlayInterval, setAutoPlayInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Get all available images for the project
  const allImages = useMemo(() => {
    const images = [];
    if (project.image) images.push(project.image);
    if (project.gallery) {
      // Add images that aren't already included as the main image
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

  const goToImage = useCallback((index: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex(index);
  }, []);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (hasMultipleImages) {
      setTouchStartX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (hasMultipleImages) {
      setTouchEndX(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!hasMultipleImages) return;

    const touchDiff = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(touchDiff) > minSwipeDistance) {
      e.preventDefault();
      e.stopPropagation();

      if (touchDiff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  // Keyboard navigation for gallery
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!hasMultipleImages || !isHovered) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        e.stopPropagation();
        prevImage();
        break;
      case 'ArrowRight':
        e.preventDefault();
        e.stopPropagation();
        nextImage();
        break;
      case 'Home':
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex(0);
        break;
      case 'End':
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex(allImages.length - 1);
        break;
    }
  };

  // Auto-cycle through images on hover (optional enhancement)
  useEffect(() => {
    if (hasMultipleImages && isHovered && allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Change image every 3 seconds

      setAutoPlayInterval(interval);

      return () => {
        clearInterval(interval);
        setAutoPlayInterval(null);
      };
    } else if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
  }, [hasMultipleImages, isHovered, allImages.length, autoPlayInterval]);

  // Reset gallery state when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageError(false);
    setIsImageLoading(true);
  }, [project.id]);

  useGSAP(() => {
    if (!cardRef.current) return;

    const handleMouseEnter = () => {
      gsap.to(cardRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(overlayRef.current, {
        opacity: 0.7,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.fromTo(
        iconRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(iconRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const card = cardRef.current;
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        } else {
          handleKeyDown(e);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-eerie-black-2/90 backdrop-blur-sm border border-jet/50 rounded-3xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:border-orange-yellow-crayola/50 hover:shadow-xl hover:shadow-orange-yellow-crayola/20 focus:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}${
        hasMultipleImages ? ` - ${allImages.length} images` : ''
      }`}
    >
      {/* Project Image Gallery */}
      <div
        className="relative h-48 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-eerie-black-1 animate-pulse flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white-2/30 animate-spin"
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
            } ${hasMultipleImages ? 'cursor-pointer' : ''}`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-eerie-black-1 flex items-center justify-center">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-white-2/30 mx-auto mb-2"
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
              <p className="text-white-2/60 text-xs">No Image</p>
            </div>
          </div>
        )}

        {/* Gallery Navigation Controls - Only show if multiple images */}
        {hasMultipleImages && !isImageLoading && !imageError && (
          <>
            {/* Previous/Next buttons - Enhanced for mobile */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2 sm:p-2 rounded-2xl backdrop-blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100 touch:opacity-70 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50 hover:shadow-lg hover:shadow-orange-yellow-crayola/20"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4 sm:w-4 sm:h-4"
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
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2 sm:p-2 rounded-2xl backdrop-blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100 touch:opacity-70 z-10 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50 hover:shadow-lg hover:shadow-orange-yellow-crayola/20"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4 sm:w-4 sm:h-4"
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
            </button>

            {/* Image counter - Enhanced visibility */}
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-2xl text-xs transition-all duration-500 opacity-0 group-hover:opacity-100 sm:opacity-80 border border-white/20 shadow-lg shadow-black/20">
              {currentImageIndex + 1} / {allImages.length}
            </div>

            {/* Dot indicators - Enhanced for touch */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 opacity-0 group-hover:opacity-100 sm:opacity-80 transition-all duration-500 p-1 rounded-2xl bg-black/30 backdrop-blur-sm shadow-lg shadow-black/20">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`w-2.5 h-2.5 sm:w-2 sm:h-2 rounded-2xl transition-all duration-500 focus:outline-none focus:ring-1 focus:ring-orange-yellow-crayola/70 ${
                    index === currentImageIndex
                      ? 'bg-orange-yellow-crayola scale-110 shadow-lg shadow-orange-yellow-crayola/30'
                      : 'bg-white/50 hover:bg-white/80 active:bg-white'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Gallery indicator icon - Always visible when multiple images */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-2xl border border-white/20 shadow-lg shadow-black/20">
              <svg
                className="w-3 h-3"
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
            </div>

            {/* Swipe indicator for mobile - Show briefly on first hover */}
            {isHovered && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-2xl text-xs animate-pulse sm:hidden shadow-lg shadow-black/20">
                Swipe to navigate
              </div>
            )}
          </>
        )}

        {/* Overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black opacity-0 flex items-center justify-center"
        >
          <div ref={iconRef} className="opacity-0">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 bg-orange-yellow-crayola/90 backdrop-blur-sm text-smoky-black text-xs font-semibold rounded-2xl border border-orange-yellow-crayola/20 shadow-lg shadow-orange-yellow-crayola/20">
            {project.category.replace('-', ' ')}
          </span>
        </div>

        {/* Enhanced Featured Badge */}
        {project.storeLinks &&
          (project.storeLinks.android || project.storeLinks.ios) && (
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1.5 bg-vegas-gold/90 backdrop-blur-sm text-smoky-black text-xs font-semibold rounded-2xl border border-vegas-gold/20 shadow-lg shadow-vegas-gold/20 flex items-center gap-1">
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
      </div>{' '}
      {/* Enhanced Project Info */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-white-1 truncate group-hover:text-orange-yellow-crayola transition-colors duration-500">
          {project.title}
        </h3>

        <p className="text-sm text-white-2 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Enhanced Technology Tags */}
        <div className="flex flex-wrap gap-2 min-h-[1.5rem]">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-2xl border transition-all duration-500 hover:scale-105 hover:shadow-lg ${getTechColor(
                tag.label
              )}`}
            >
              {tag.label}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2.5 py-1.5 text-xs font-medium rounded-2xl bg-eerie-black-1/50 backdrop-blur-sm text-white-2 border border-jet/30 hover:bg-jet/30 transition-all duration-500 hover:shadow-lg hover:shadow-orange-yellow-crayola/10">
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn flex items-center gap-1 px-3 py-1.5 bg-orange-500/20 backdrop-blur-sm text-orange-400 hover:bg-orange-500/30 hover:text-orange-300 transition-all duration-500 rounded-2xl border border-orange-500/30 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/20"
                title="View Website"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-0.5"
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
              </a>
            )}

            {project.storeLinks?.android && (
              <a
                href={project.storeLinks.android}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 transition-all duration-300 rounded-lg border border-green-500/30 hover:border-green-400/50"
                title="Download on Google Play"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span className="text-xs font-medium">Play</span>
              </a>
            )}

            {project.storeLinks?.ios && (
              <a
                href={project.storeLinks.ios}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-300 rounded-lg border border-blue-500/30 hover:border-blue-400/50"
                title="Download on App Store"
              >
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                </svg>
                <span className="text-xs font-medium">iOS</span>
              </a>
            )}
          </div>

          <div className="flex flex-col items-end">
            <span className="text-gray-500 text-xs">
              {project.timeline || 'Recent'}
            </span>
            {project.tags.length > 0 && (
              <div className="flex items-center mt-1">
                <span className="text-gray-600 text-xs">
                  {project.tags
                    .slice(0, 2)
                    .map((tag) => tag.label)
                    .join(', ')}
                  {project.tags.length > 2 && '...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
