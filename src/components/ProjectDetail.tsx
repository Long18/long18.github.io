'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/portfolio';
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline, IoOpenOutline, IoLogoGithub, IoLogoApple, IoLogoGooglePlaystore } from 'react-icons/io5';
import Image from 'next/image';
import { cn } from '@/utils';
import DownloadStatsDisplay from './DownloadStatsDisplay';
import { getProjectDownloadStats } from '@/data/assetPaths';

interface ProjectDetailProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);

  // Get download stats for the project
  const downloadStats = project ? getProjectDownloadStats(project.id) : null;

  // Enhanced body scroll management with proper cleanup
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Apply scroll lock with compensation for scrollbar
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Return cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const openImageGallery = (index: number) => {
    setSelectedImageIndex(index);
    setImageGalleryOpen(true);
  };

  const nextImage = useCallback(() => {
    if (project?.gallery) {
      setSelectedImageIndex((prev) => 
        prev === project.gallery!.length - 1 ? 0 : prev + 1
      );
    }
  }, [project]);

  const prevImage = useCallback(() => {
    if (project?.gallery) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? project.gallery!.length - 1 : prev - 1
      );
    }
  }, [project]);

  // Enhanced keyboard and focus management
  useEffect(() => {
    let focusableElements: HTMLElement[] = [];
    let firstFocusableElement: HTMLElement | null = null;
    let lastFocusableElement: HTMLElement | null = null;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (imageGalleryOpen) {
          setImageGalleryOpen(false);
        } else {
          onClose();
        }
      }
      
      // Enhanced keyboard navigation for gallery
      if (imageGalleryOpen && project?.gallery) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevImage();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextImage();
        }
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && isOpen && !imageGalleryOpen) {
        // Focus trapping for modal
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement?.focus();
          }
        }
      }
    };

    // Touch handling for image gallery navigation
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (imageGalleryOpen) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (imageGalleryOpen && project?.gallery) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Only trigger navigation if horizontal swipe is more significant than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            prevImage();
          } else {
            nextImage();
          }
        }
      }
    };

    if (isOpen) {
      // Get focusable elements
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        focusableElements = Array.from(
          modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => !el.hasAttribute('disabled')) as HTMLElement[];
        
        firstFocusableElement = focusableElements[0] || null;
        lastFocusableElement = focusableElements[focusableElements.length - 1] || null;
        
        // Focus the close button initially
        const closeButton = modal.querySelector('button[aria-label="Close project details"]') as HTMLElement;
        if (closeButton) {
          setTimeout(() => closeButton.focus(), 100);
        }
      }

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, imageGalleryOpen, onClose, project, nextImage, prevImage]);

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github': return <IoLogoGithub className="text-xl" />;
      case 'android': return <IoLogoGooglePlaystore className="text-xl" />;
      case 'ios': return <IoLogoApple className="text-xl" />;
      case 'website': return <IoOpenOutline className="text-xl" />;
      default: return <IoOpenOutline className="text-xl" />;
    }
  };

  const getLinkLabel = (type: string) => {
    switch (type) {
      case 'github': return 'GitHub Repository';
      case 'android': return 'Google Play Store';
      case 'ios': return 'App Store';
      case 'website': return 'Visit Website';
      default: return 'Visit Link';
    }
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with better z-index and blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 bg-gray-900/90 backdrop-blur-sm z-[9998]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Enhanced Modal with better positioning and z-index */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(4px)' }}
            transition={{ 
              duration: 0.5, 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              filter: { duration: 0.3 }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-1 sm:p-2 md:p-4 lg:p-6 xl:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl max-h-[99vh] sm:max-h-[98vh] md:max-h-[95vh] bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col">
              {/* Header - Responsive padding and text sizes */}
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-5 lg:p-6 border-b border-gray-700 shrink-0">
                <div className="flex-1 min-w-0 pr-2 sm:pr-3 md:pr-4">
                  <h2 id="modal-title" className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1 md:mb-2 truncate">
                    {project.title}
                  </h2>
                  <p id="modal-description" className="text-gray-400 text-xs sm:text-sm">
                    {project.timeline} • {project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-orange-400 transition-colors duration-300 p-1.5 sm:p-2 hover:bg-gray-700 rounded-lg sm:rounded-xl shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  aria-label="Close project details"
                >
                  <IoCloseOutline className="text-lg sm:text-xl md:text-2xl" />
                </button>
              </div>

              {/* Content - Improved responsive layout */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
                  {/* Project Info - Responsive grid layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 md:mb-3">Description</h3>
                        <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base">{project.description}</p>
                      </div>

                      {project.achievements && project.achievements.length > 0 && (
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 md:mb-3">Key Achievements</h3>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {project.achievements.map((achievement: string, index: number) => (
                              <li key={index} className="text-gray-400 flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
                                <span className="text-orange-400 mt-1 sm:mt-1.5 text-xs shrink-0">●</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {project.responsibilities && project.responsibilities.length > 0 && (
                        <div>
                          <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-1.5 sm:mb-2 md:mb-3">Responsibilities</h3>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {project.responsibilities.map((responsibility: string, index: number) => (
                              <li key={index} className="text-gray-400 flex items-start gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
                                <span className="text-orange-400 mt-1 sm:mt-1.5 text-xs shrink-0">●</span>
                                {responsibility}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Project Meta - Responsive sidebar that moves to top on mobile */}
                    <div className="space-y-3 sm:space-y-4 md:space-y-5 order-first lg:order-last">
                      <div className="bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5">
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Project Info</h3>
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <span className="text-gray-400 text-xs sm:text-sm">Timeline:</span>
                            <p className="text-white text-xs sm:text-sm font-medium">
                              {project.timeline}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400 text-xs sm:text-sm">Technologies:</span>
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mt-1.5 sm:mt-2">
                              {project.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={cn(
                                    'px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border',
                                    tag.colorClass,
                                    'whitespace-nowrap inline-flex items-center justify-center'
                                  )}
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Download Stats Display moved here */}
                      {downloadStats && downloadStats.total > 0 && (
                        <div>
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Download Statistics</h3>
                          <DownloadStatsDisplay 
                            stats={downloadStats} 
                            variant="detailed" 
                          />
                        </div>
                      )}

                      {/* Action Links */}
                      {((project.storeLinks && (project.storeLinks.android || project.storeLinks.ios)) || project.website) && (
                        <div className="bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 sm:mb-3 md:mb-4">Links & Downloads</h3>
                          <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                            {project.storeLinks?.android && (
                              <a
                                href={project.storeLinks.android}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-gray-800 hover:bg-orange-400/10 border border-transparent hover:border-orange-400 rounded-lg sm:rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                              >
                                <div className="text-orange-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                  {getLinkIcon('android')}
                                </div>
                                <span className="text-white group-hover:text-orange-400 transition-colors duration-300 text-[10px] sm:text-xs md:text-sm font-medium truncate">
                                  {getLinkLabel('android')}
                                </span>
                              </a>
                            )}
                            {project.storeLinks?.ios && (
                              <a
                                href={project.storeLinks.ios}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-gray-800 hover:bg-orange-400/10 border border-transparent hover:border-orange-400 rounded-lg sm:rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                              >
                                <div className="text-orange-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                  {getLinkIcon('ios')}
                                </div>
                                <span className="text-white group-hover:text-orange-400 transition-colors duration-300 text-[10px] sm:text-xs md:text-sm font-medium truncate">
                                  {getLinkLabel('ios')}
                                </span>
                              </a>
                            )}
                            {project.website && (
                              <a
                                href={project.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-gray-800 hover:bg-orange-400/10 border border-transparent hover:border-orange-400 rounded-lg sm:rounded-xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                              >
                                <div className="text-orange-400 group-hover:scale-110 transition-transform duration-300 shrink-0">
                                  {getLinkIcon('website')}
                                </div>
                                <span className="text-white group-hover:text-orange-400 transition-colors duration-300 text-[10px] sm:text-xs md:text-sm font-medium truncate">
                                  {getLinkLabel('website')}
                                </span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Gallery - Responsive grid */}
                  {project.gallery && project.gallery.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6">Gallery</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                        {project.gallery.map((image: string, index: number) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative aspect-video bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer group border border-gray-700 hover:border-orange-400/50 transition-colors duration-300"
                            onClick={() => openImageGallery(index)}
                          >
                            <Image
                              src={image}
                              alt={`${project.title} screenshot ${index + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <IoOpenOutline className="text-white text-xl sm:text-2xl" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Gallery */}
                  {project.videos && project.videos.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4 lg:mb-6">Videos</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {project.videos.map((video, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            className="relative aspect-video bg-gray-900 rounded-lg sm:rounded-xl overflow-hidden border border-gray-700 hover:border-orange-400/50 transition-colors duration-300"
                          >
                            <video
                              controls
                              poster={video.poster}
                              className="w-full h-full object-cover"
                              preload="metadata"
                            >
                              <source src={video.src} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Image Gallery Modal - Fully responsive */}
          <AnimatePresence>
            {imageGalleryOpen && project.gallery && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-[10000]"
                  onClick={() => setImageGalleryOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-1 sm:inset-2 md:inset-3 lg:inset-4 z-[10001] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                    <Image
                      src={project.gallery[selectedImageIndex]}
                      alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain rounded-md sm:rounded-lg md:rounded-xl"
                      priority
                      sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 80vw"
                    />
                    
                    {/* Enhanced Close button - Responsive sizing */}
                    <button
                      onClick={() => setImageGalleryOpen(false)}
                      className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 lg:top-4 lg:right-4 
                                text-white hover:text-orange-400 
                                bg-gray-900/70 hover:bg-gray-900/80 backdrop-blur-sm 
                                rounded-full 
                                p-1.5 sm:p-2 md:p-2.5 lg:p-3 
                                transition-all duration-300 z-10
                                focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                      aria-label="Close image gallery"
                    >
                      <IoCloseOutline className="text-lg sm:text-xl md:text-2xl" />
                    </button>

                    {/* Enhanced Navigation - Responsive sizing */}
                    {project.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-1 sm:left-2 md:left-3 lg:left-4 
                                    top-1/2 -translate-y-1/2 
                                    text-white hover:text-orange-400 
                                    bg-gray-900/70 hover:bg-gray-900/80 backdrop-blur-sm 
                                    rounded-full 
                                    p-1.5 sm:p-2 md:p-2.5 lg:p-3 
                                    transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                          aria-label="Previous image"
                        >
                          <IoChevronBackOutline className="text-lg sm:text-xl md:text-2xl" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-1 sm:right-2 md:right-3 lg:right-4 
                                    top-1/2 -translate-y-1/2 
                                    text-white hover:text-orange-400 
                                    bg-gray-900/70 hover:bg-gray-900/80 backdrop-blur-sm 
                                    rounded-full 
                                    p-1.5 sm:p-2 md:p-2.5 lg:p-3 
                                    transition-all duration-300
                                    focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                          aria-label="Next image"
                        >
                          <IoChevronForwardOutline className="text-lg sm:text-xl md:text-2xl" />
                        </button>
                      </>
                    )}

                    {/* Enhanced Image counter - Responsive sizing */}
                    <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 lg:bottom-4 
                                  left-1/2 -translate-x-1/2 
                                  bg-gray-900/80 backdrop-blur-sm text-white 
                                  px-2 sm:px-2.5 md:px-3 
                                  py-1 sm:py-1.5 
                                  rounded-full 
                                  text-[10px] sm:text-xs md:text-sm 
                                  font-medium">
                      {selectedImageIndex + 1} / {project.gallery.length}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetail;
