// filepath: src/components/ProjectCard.tsx
'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '../utils';
import { useGSAP } from '../hooks/useGSAP';
import gsap from 'gsap';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const getTechColor = (tech: string): string => {
  const techColors: Record<string, string> = {
    // Framework/Engine tags
    'Unity': 'bg-[hsl(var(--muted))/20] text-unity-tag border-unity-tag/30',
    'Unreal Engine': 'bg-[hsl(var(--muted))/20] text-unreal-tag border-unreal-tag/30',
    
    // Programming languages
    'C#': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    'C++': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    'JavaScript': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
    'TypeScript': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    'Python': 'bg-[hsl(var(--accent))/15] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent))/30]',
    'Java': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
    
    // Web technologies
    'React': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    'Next.js': 'bg-gray-800/50 text-gray-400 border-gray-700/30',
    'Node.js': 'bg-[hsl(var(--accent))/15] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent))/30]',
    
    // Mobile/AR/VR
    'Android Studio': 'bg-[hsl(var(--accent))/15] text-application-tag border-application-tag/30',
    'AR': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    'VR': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    
    // AI/ML
    'AI': 'bg-[hsl(var(--accent))/15] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent))/30]',
    'Machine Learning': 'bg-[hsl(var(--accent))/15] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent))/30]',
    'Blueprint': 'bg-[hsl(var(--primary))/15] text-[hsl(var(--primary))] border-[hsl(var(--primary))/30]',
    
    // APIs
    'Google Maps API': 'bg-[hsl(var(--destructive))/15] text-[hsl(var(--destructive))] border-[hsl(var(--destructive))/30]'
  };
  
  // Default fallback using the muted color from the theme
  return techColors[tech] || 'bg-[hsl(var(--muted))/15] text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted))/30]';
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    
    // Use CSS transitions for hover instead of GSAP for better performance
    // Only use GSAP for entrance animations
    gsap.fromTo(card, 
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  // Responsive image (main or first detail image)
  const mainImage = project.image || project.details?.images?.[0] || '/assets/images/placeholder.png';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative bg-gray-800 border border-gray-700/50 rounded-xl overflow-hidden cursor-pointer',
        'transform transition-all duration-300 hover:scale-105 hover:border-orange-400/50',
        'hover:shadow-xl hover:shadow-orange-400/10',
        'focus:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400/50',
        'flex flex-col backdrop-blur-sm',
        'h-full min-h-[320px] sm:min-h-[360px] md:min-h-[400px] lg:min-h-[420px] xl:min-h-[440px]'
      )}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.title}`}
    >
      {/* Project Image - Fixed aspect ratio with loading placeholder */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[4/3] bg-gray-900 overflow-hidden rounded-t-xl">
        {/* Loading placeholder */}
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        <Image
          src={mainImage}
          alt={`${project.title} - ${project.category} project`}
          fill
          className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          priority={isHovered}
          loading={isHovered ? "eager" : "lazy"}
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = '/assets/images/placeholder.png';
            target.onerror = null; // Prevent infinite error loop
          }}
        />
        {/* Gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Info - Consistent height with flex layout */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 gap-2 sm:gap-3 md:gap-4">
        {/* Title with consistent height */}
        <div className="min-h-[1.5rem] sm:min-h-[1.75rem] md:min-h-[2rem]">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white truncate">
            {project.title}
          </h3>
        </div>
        
        {/* Description with fixed height using line-clamp */}
        <div className="min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[4.5rem]">
          <p className="text-xs sm:text-sm md:text-base text-gray-400 line-clamp-2 md:line-clamp-3">
            {project.description}
          </p>
        </div>
        
        {/* Tech tags - Consistent height with better spacing */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 mt-auto pt-2 min-h-[1.75rem] sm:min-h-[2rem] md:min-h-[2.25rem]">
          {project.technologies.slice(0, 4).map((tech, i) => (
            <span
              key={i}
              className={cn(
                'px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border',
                getTechColor(tech),
                'whitespace-nowrap inline-flex items-center justify-center'
              )}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border bg-[hsl(var(--muted))/15] text-[hsl(var(--muted-foreground))] border-[hsl(var(--muted))/30] whitespace-nowrap">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
