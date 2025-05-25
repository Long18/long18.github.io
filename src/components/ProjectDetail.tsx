'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types';
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline, IoOpenOutline, IoDownloadOutline, IoLogoGithub, IoLogoApple, IoLogoGooglePlaystore } from 'react-icons/io5';
import Image from 'next/image';

interface ProjectDetailProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, isOpen, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);

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
      if (imageGalleryOpen && project?.details?.images) {
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
      if (imageGalleryOpen && project?.details?.images) {
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
  }, [isOpen, imageGalleryOpen, onClose, project]);

  if (!project) return null;

  const openImageGallery = (index: number) => {
    setSelectedImageIndex(index);
    setImageGalleryOpen(true);
  };

  const nextImage = () => {
    if (project.details?.images) {
      setSelectedImageIndex((prev) => 
        prev === project.details!.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project.details?.images) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? project.details!.images.length - 1 : prev - 1
      );
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github': return <IoLogoGithub className="text-xl" />;
      case 'playStore': return <IoLogoGooglePlaystore className="text-xl" />;
      case 'appStore': return <IoLogoApple className="text-xl" />;
      case 'download': return <IoDownloadOutline className="text-xl" />;
      default: return <IoOpenOutline className="text-xl" />;
    }
  };

  const getLinkLabel = (type: string) => {
    switch (type) {
      case 'github': return 'GitHub Repository';
      case 'playStore': return 'Google Play Store';
      case 'appStore': return 'App Store';
      case 'download': return 'Download';
      case 'demo': return 'Live Demo';
      default: return 'Visit Link';
    }
  };

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
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[9998]"
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] bg-eerie-black-2 border border-jet rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col">
              {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-jet shrink-0">
              <div className="flex-1 min-w-0 pr-4">
                <h2 id="modal-title" className="text-xl sm:text-2xl md:text-3xl font-bold text-white-1 mb-1 sm:mb-2 truncate">
                  {project.title}
                </h2>
                <p id="modal-description" className="text-white-2 text-xs sm:text-sm">
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project
                  {project.details?.teamSize && ` • Team of ${project.details.teamSize}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white-2 hover:text-orange-yellow-crayola transition-colors duration-300 p-2 hover:bg-jet rounded-xl shrink-0"
                aria-label="Close project details"
              >
                <IoCloseOutline className="text-xl sm:text-2xl" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Project Info */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                  {/* Main Info */}
                  <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-2 sm:mb-3">Description</h3>
                      <p className="text-white-2 leading-relaxed text-sm sm:text-base">{project.description}</p>
                    </div>

                    {project.details?.achievements && project.details.achievements.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-2 sm:mb-3">Key Achievements</h3>
                        <ul className="space-y-2">
                          {project.details.achievements.map((achievement: string, index: number) => (
                            <li key={index} className="text-white-2 flex items-start gap-3 text-sm sm:text-base">
                              <span className="text-orange-yellow-crayola mt-1.5 text-xs shrink-0">●</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.details?.responsibilities && project.details.responsibilities.length > 0 && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-2 sm:mb-3">Responsibilities</h3>
                        <ul className="space-y-2">
                          {project.details.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index} className="text-white-2 flex items-start gap-3 text-sm sm:text-base">
                              <span className="text-orange-yellow-crayola mt-1.5 text-xs shrink-0">●</span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.details?.description && (
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-2 sm:mb-3">Project Details</h3>
                        <p className="text-white-2 leading-relaxed text-sm sm:text-base">{project.details.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Project Meta */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-eerie-black-1 border border-jet rounded-xl sm:rounded-2xl p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-semibold text-white-1 mb-3 sm:mb-4">Project Info</h3>
                      <div className="space-y-3">
                        {project.details?.status && (
                          <div>
                            <span className="text-white-2 text-sm">Status:</span>
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                project.details.status === 'completed' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : project.details.status === 'in-progress'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {project.details.status.charAt(0).toUpperCase() + project.details.status.slice(1).replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                        )}
                        {project.details?.period && (
                          <div>
                            <span className="text-white-2 text-sm">Duration:</span>
                            <p className="text-white-1 font-medium">
                              {project.details.period}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-white-2 text-xs sm:text-sm">Technologies:</span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-jet rounded-lg text-orange-yellow-crayola text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Links */}
                    {project.links && Object.keys(project.links).filter(key => project.links![key as keyof typeof project.links]).length > 0 && (
                      <div className="bg-eerie-black-1 border border-jet rounded-xl sm:rounded-2xl p-4 sm:p-5">
                        <h3 className="text-base sm:text-lg font-semibold text-white-1 mb-3 sm:mb-4">Links & Downloads</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {Object.entries(project.links).map(([key, url]) => {
                            if (!url) return null;
                            return (
                              <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-2.5 sm:p-3 bg-jet hover:bg-orange-yellow-crayola/10 border border-transparent hover:border-orange-yellow-crayola rounded-xl transition-all duration-300 group"
                              >
                                <div className="text-orange-yellow-crayola group-hover:scale-110 transition-transform duration-300 shrink-0">
                                  {getLinkIcon(key)}
                                </div>
                                <span className="text-white-1 group-hover:text-orange-yellow-crayola transition-colors duration-300 text-xs sm:text-sm font-medium truncate">
                                  {getLinkLabel(key)}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Gallery */}
                {project.details?.images && project.details.images.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-4 sm:mb-6">Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {project.details.images.map((image: string, index: number) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative aspect-video bg-eerie-black-1 rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => openImageGallery(index)}
                        >
                          <Image
                            src={image}
                            alt={`${project.title} screenshot ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <IoOpenOutline className="text-white text-2xl" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {project.details?.videos && project.details.videos.length > 0 && (
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-white-1 mb-4 sm:mb-6">Videos</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {project.details.videos.map((video: { poster: string; src: string }, index: number) => (
                        <div key={index} className="relative aspect-video bg-eerie-black-1 rounded-xl overflow-hidden">
                          <video
                            controls
                            className="w-full h-full object-cover"
                            poster={video.poster}
                            preload="metadata"
                          >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
          </motion.div>

          {/* Enhanced Image Gallery Modal */}
          <AnimatePresence>
            {imageGalleryOpen && project.details?.images && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[10000]"
                  onClick={() => setImageGalleryOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed inset-2 sm:inset-4 z-[10001] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                    <Image
                      src={project.details.images[selectedImageIndex]}
                      alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain rounded-lg sm:rounded-xl"
                      priority
                    />
                    
                    {/* Enhanced Close button */}
                    <button
                      onClick={() => setImageGalleryOpen(false)}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-orange-yellow-crayola bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 z-10"
                      aria-label="Close image gallery"
                    >
                      <IoCloseOutline className="text-xl sm:text-2xl" />
                    </button>

                    {/* Enhanced Navigation */}
                    {project.details.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-yellow-crayola bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300"
                          aria-label="Previous image"
                        >
                          <IoChevronBackOutline className="text-xl sm:text-2xl" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-yellow-crayola bg-black/70 hover:bg-black/80 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300"
                          aria-label="Next image"
                        >
                          <IoChevronForwardOutline className="text-xl sm:text-2xl" />
                        </button>
                      </>
                    )}

                    {/* Enhanced Image counter */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                      {selectedImageIndex + 1} / {project.details.images.length}
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
