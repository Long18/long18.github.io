// Enhanced ProjectCard component with modern UI/UX improvements
'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '../utils';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import type { Project } from '../types/portfolio';
import { getProjectDownloadStats } from '../data/assetPaths';
import { TECHNOLOGY_COLORS } from '../types/portfolio';
import DownloadStatsDisplay from './DownloadStatsDisplay';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index?: number;
}

// Import TECHNOLOGY_COLORS from portfolio types

const getTechColor = (tech: string): string => {
  // Use the centralized TECHNOLOGY_COLORS from portfolio.ts
  const baseColor = TECHNOLOGY_COLORS[tech];

  if (baseColor) {
    // Convert the simple Tailwind classes to enhanced gradient format
    const colorMap: Record<string, string> = {
      'bg-gray-800 text-white':
        'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/40 shadow-purple-500/10',
      'bg-purple-700 text-white':
        'bg-gradient-to-r from-blue-600/20 to-blue-700/20 text-blue-300 border-blue-600/40 shadow-blue-600/10',
      'bg-blue-600 text-white':
        'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40 shadow-cyan-500/10',
      'bg-green-600 text-white':
        'bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-300 border-green-600/40 shadow-green-600/10',
      'bg-pink-600 text-white':
        'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border-purple-600/40 shadow-purple-600/10',
      'bg-red-700 text-white':
        'bg-gradient-to-r from-blue-700/20 to-blue-800/20 text-blue-300 border-blue-700/40 shadow-blue-700/10',
      'bg-yellow-500 text-black':
        'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/40 shadow-yellow-500/10',
      'bg-lime-600 text-white':
        'bg-gradient-to-r from-green-600/20 to-green-700/20 text-green-300 border-green-600/40 shadow-green-600/10',
      'bg-indigo-600 text-white':
        'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border-indigo-600/40 shadow-indigo-600/10',
    };

    return (
      colorMap[baseColor] ||
      'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 border-gray-600/40 shadow-gray-600/10'
    );
  }

  // Enhanced default fallback with gradient and glow
  return 'bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 border-gray-600/40 shadow-gray-600/10';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get enhanced project data with download stats
  const downloadStats = getProjectDownloadStats(project.id);

  // Enhanced gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get all available images from the new portfolio structure
  const allImages = useCallback(() => {
    const images = [];
    if (project.image) images.push(project.image);
    if (project.gallery) {
      project.gallery.forEach((img) => {
        if (img !== project.image) images.push(img);
      });
    }
    return images;
  }, [project.image, project.gallery]);

  const images = allImages();
  const hasMultipleImages = images.length > 1;

  // Gallery navigation
  const nextImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }
    },
    [hasMultipleImages, images.length]
  );

  const prevImage = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (hasMultipleImages) {
        setCurrentImageIndex(
          (prev) => (prev - 1 + images.length) % images.length
        );
      }
    },
    [hasMultipleImages, images.length]
  );

  // Enhanced GSAP animations with stagger
  useGSAP(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const image = imageRef.current;
    const content = contentRef.current;

    // Entrance animation with delay based on index
    const delay = (index || 0) * 0.1;

    gsap.fromTo(
      card,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
        rotationX: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out',
      }
    );

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.03,
        rotationY: 2,
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(image, {
        scale: 1.1,
        duration: 0.6,
        ease: 'power2.out',
      });

      // Animate content elements
      gsap.to(content?.children || [], {
        y: -2,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        rotationY: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
      });

      gsap.to(content?.children || [], {
        y: 0,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [index]);

  // Auto-cycle images on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, hasMultipleImages, images.length]);

  // Get main image to display
  const mainImage =
    images[currentImageIndex] || '/assets/images/placeholder.png';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        // Base styles with enhanced shadows and gradients
        'group relative cursor-pointer overflow-hidden',
        'bg-gradient-to-br from-eerie-black-2/90 via-eerie-black-1/90 to-eerie-black-2/90',
        'border border-jet/50 backdrop-blur-sm',
        'rounded-2xl shadow-xl shadow-smoky-black/20',

        // Interactive states
        'transform transition-all duration-500 ease-out',
        'hover:shadow-2xl hover:shadow-orange-yellow-crayola/20',
        'hover:border-orange-yellow-crayola/50',
        'focus:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50',

        // Layout
        'flex flex-col h-full',
        'min-h-[380px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[480px]',

        // Glass morphism effect
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white-1/5 before:to-transparent before:pointer-events-none before:rounded-2xl',

        // Animated border gradient
        'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-orange-yellow-crayola/20 after:to-transparent',
        'after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-700',
        'after:pointer-events-none after:rounded-2xl'
      )}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
    >
      {/* Enhanced Image Section with Gallery */}
      <div
        ref={imageRef}
        className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden group/image"
      >
        {/* Loading placeholder with animated gradient */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-eerie-black-1 to-eerie-black-2 animate-pulse">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-jet/50 to-transparent
                           transform translate-x-[-100%] animate-shimmer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-orange-yellow-crayola/30 border-t-orange-yellow-crayola rounded-full animate-spin" />
            </div>
          </div>
        )}

        {/* Main Project Image */}
        {!imageError ? (
          <Image
            src={mainImage}
            alt={`${project.title} - ${project.category} project`}
            fill
            className={cn(
              'object-cover transition-all duration-700 ease-out',
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110',
              'group-hover/image:scale-110 group-hover/image:brightness-110'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={index !== undefined && index < 4}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-eerie-black-1 to-eerie-black-2 flex items-center justify-center">
            <div className="text-center text-white-2/60">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm opacity-75">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Gallery Controls - Only show if multiple images */}
        {hasMultipleImages && imageLoaded && !imageError && (
          <>
            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className={cn(
                'absolute left-2 top-1/2 -translate-y-1/2 z-10',
                'bg-smoky-black/40 hover:bg-smoky-black/60 text-white-1 p-2 rounded-full backdrop-blur-sm',
                'transition-all duration-300 opacity-0 group-hover:opacity-100',
                'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50'
              )}
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
            </button>

            <button
              onClick={nextImage}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2 z-10',
                'bg-smoky-black/40 hover:bg-smoky-black/60 text-white-1 p-2 rounded-full backdrop-blur-sm',
                'transition-all duration-300 opacity-0 group-hover:opacity-100',
                'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/50'
              )}
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
            </button>

            {/* Image Counter */}
            <div
              className={cn(
                'absolute top-3 right-3 z-10',
                'bg-smoky-black/60 text-white-1 px-2.5 py-1 rounded-full text-xs backdrop-blur-sm',
                'transition-all duration-300 opacity-0 group-hover:opacity-100',
                'border border-white-1/20'
              )}
            >
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Gallery indicator */}
            <div className="absolute top-3 left-3 z-10 bg-smoky-black/60 text-white-1 p-1.5 rounded-full backdrop-blur-sm border border-white-1/20">
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
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </>
        )}

        {/* Enhanced Category Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border',
              'bg-gradient-to-r from-orange-yellow-crayola/90 to-vegas-gold/90',
              'text-smoky-black border-orange-yellow-crayola/50 shadow-lg shadow-orange-yellow-crayola/25'
            )}
          >
            {project.category.charAt(0).toUpperCase() +
              project.category.slice(1).replace('-', ' ')}
          </span>
        </div>

        {/* Enhanced Download Stats Badge */}
        {downloadStats && downloadStats.total > 0 && (
          <div className="absolute bottom-3 right-3 z-10">
            <DownloadStatsDisplay stats={downloadStats} variant="badge" />
          </div>
        )}

        {/* Hover Overlay with Enhanced View Icon */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-smoky-black/60 via-smoky-black/20 to-transparent',
            'flex items-center justify-center opacity-0 group-hover:opacity-100',
            'transition-all duration-300 backdrop-blur-[1px]'
          )}
        >
          <div
            className={cn(
              'bg-orange-yellow-crayola/90 text-smoky-black p-4 rounded-full shadow-lg',
              'transform scale-75 group-hover:scale-100 transition-all duration-300',
              'border-2 border-white-1/20'
            )}
          >
            <svg
              className="w-6 h-6"
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
      </div>
      {/* Enhanced Content Section */}
      <div
        ref={contentRef}
        className="flex-1 flex flex-col p-4 sm:p-5 md:p-6 gap-3 sm:gap-4"
      >
        {/* Title with gradient on hover */}
        <div className="min-h-[2rem] sm:min-h-[2.5rem]">
          <h3
            className={cn(
              'text-base sm:text-lg md:text-xl font-bold text-white-1 truncate',
              'transition-all duration-300 group-hover:text-transparent',
              'group-hover:bg-gradient-to-r group-hover:from-orange-yellow-crayola group-hover:to-vegas-gold',
              'group-hover:bg-clip-text'
            )}
          >
            {project.title}
          </h3>
        </div>

        {/* Description with better typography */}
        <div className="min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem]">
          <p className="text-xs sm:text-sm md:text-base text-white-2 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Enhanced Technology Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto pt-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {project.tags && project.tags.length > 0 ? (
            <>
              {project.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className={cn(
                    'px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold',
                    'border transition-all duration-300 hover:scale-105 cursor-default',
                    'shadow-md hover:shadow-lg backdrop-blur-sm',
                    tag.colorClass || getTechColor(tag.label)
                  )}
                  title={tag.label.length > 16 ? tag.label : undefined}
                  aria-label={tag.label}
                >
                  {tag.label.length > 16
                    ? tag.label.slice(0, 14) + '…'
                    : tag.label}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span
                  className={cn(
                    'px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold',
                    'bg-gradient-to-r from-jet/50 to-onyx/50 text-white-2',
                    'border border-jet/40 transition-all duration-300 hover:scale-105',
                    'cursor-default shadow-md backdrop-blur-sm'
                  )}
                  title={project.tags
                    .slice(3)
                    .map((t) => t.label)
                    .join(', ')}
                  aria-label={`+${project.tags.length - 3} more tags`}
                >
                  +{project.tags.length - 3} more
                </span>
              )}
            </>
          ) : (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-jet/40 text-white-2/60 border border-jet/40 cursor-default">
              No tags
            </span>
          )}
        </div>

        {/* Action Links with enhanced styling */}
        {(project.website ||
          project.storeLinks?.android ||
          project.storeLinks?.ios) && (
          <div className="flex items-center justify-between pt-3 border-t border-jet/50">
            <div className="flex items-center gap-2">
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    'bg-gradient-to-r from-orange-yellow-crayola/20 to-vegas-gold/20 text-orange-yellow-crayola',
                    'border border-orange-yellow-crayola/40 hover:border-orange-yellow-crayola/60',
                    'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    'hover:from-orange-yellow-crayola/30 hover:to-vegas-gold/30'
                  )}
                  title="Visit Website"
                  aria-label="Visit project website"
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:rotate-12"
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
                  Website
                </a>
              )}
              {project.storeLinks?.android && (
                <a
                  href={project.storeLinks.android}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    'bg-gradient-to-r from-application-tag/20 to-green-teal/20 text-application-tag',
                    'border border-application-tag/40 hover:border-application-tag/60',
                    'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    'hover:from-application-tag/30 hover:to-green-teal/30'
                  )}
                  title="Download on Google Play"
                  aria-label="Download on Google Play"
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M1.04 5.51c-.1.28-.04.61.17.86l10.4 12.4c.21.25.54.33.82.2l7.3-3.36c.27-.13.45-.4.45-.7V9.01c0-.3-.18-.57-.45-.7L12.43.95c-.28-.13-.61-.05-.82.2L1.21 4.65c-.21.25-.27.58-.17.86z" />
                  </svg>
                  Android
                </a>
              )}
              {project.storeLinks?.ios && (
                <a
                  href={project.storeLinks.ios}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    'bg-gradient-to-r from-jet/20 to-onyx/20 text-white-2',
                    'border border-jet/40 hover:border-onyx/60',
                    'transition-all duration-300 hover:scale-105 hover:shadow-lg',
                    'hover:from-jet/30 hover:to-onyx/30 hover:text-white-1'
                  )}
                  title="Download on App Store"
                  aria-label="Download on App Store"
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  iOS
                </a>
              )}
            </div>
            {/* Project Timeline */}
            <div className="text-right">
              <span className="text-xs text-white-2/60 font-medium">
                {project.timeline || 'Recent'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
