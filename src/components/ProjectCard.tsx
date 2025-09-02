// Enhanced ProjectCard component with modern UI/UX improvements
'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Project } from '@/types';
import { motion } from 'framer-motion';
import { AnimatedCard, AnimatedButton, CardContent, CardTitle } from './ui';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <AnimatedCard
        variant="glass"
        animation="hover"
        spotlight={true}
        shimmer={true}
        className="h-full bg-muted-slate-600/80 backdrop-blur-sm border-muted-slate-400/30 hover:bg-muted-slate-600/90 hover:border-muted-lavender/40"
      >
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-muted-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {project.details?.status && (
            <div className="absolute top-4 right-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm border",
                project.details?.status === 'completed' && "bg-muted-cyan/20 text-muted-cyan border-muted-cyan/30",
                project.details?.status === 'in-progress' && "bg-muted-pink/20 text-muted-pink border-muted-pink/30",
                project.details?.status === 'planned' && "bg-muted-lavender/20 text-muted-lavender border-muted-lavender/30"
              )}>
                {project.details?.status?.replace('-', ' ')}
              </span>
            </div>
          )}

          {/* Play Button for Games */}
          {project.category === 'unity' && project.links?.demo && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <AnimatedButton
                variant="glass"
                size="lg"
                ripple={true}
                glow={true}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.links?.demo, '_blank');
                }}
                className="shadow-2xl"
              >
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Play Game
              </AnimatedButton>
            </div>
          )}
        </div>

        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-muted-text mb-2 group-hover:text-muted-lavender transition-colors duration-200">
                {project.title}
              </CardTitle>
              <p className="text-muted-slate-300 text-sm">
                {project.description}
              </p>
            </div>

            {/* Project Type Icon */}
            <div className="ml-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                (project.category === 'unity' || project.category === 'unreal') && "bg-muted-lavender/20 text-muted-lavender",
                project.category === 'web' && "bg-muted-cyan/20 text-muted-cyan",
                project.category === 'mobile' && "bg-muted-pink/20 text-muted-pink",
                project.category === 'application' && "bg-muted-slate-400/20 text-muted-slate-300"
              )}>
                {(project.category === 'unity' || project.category === 'unreal') && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                {project.category === 'web' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>}
                {project.category === 'mobile' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3.25-3H6.75V4h10.5v14z"/></svg>}
                {project.category === 'application' && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H3V4h18v10z"/></svg>}
              </div>
            </div>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-muted-slate-500/50 text-muted-text text-xs rounded-md border border-muted-slate-400/30"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 bg-muted-slate-500/50 text-muted-slate-300 text-xs rounded-md border border-muted-slate-400/30">
                    +{project.technologies.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Project Period */}
          {project.details?.period && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-slate-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H3V9h14v11z"/>
              </svg>
              {project.details.period}
            </div>
          )}
        </CardContent>

        <div className="p-6 pt-0 flex gap-2">
          <AnimatedButton
            variant="gradient"
            size="sm"
            ripple={true}
            onClick={onClick}
            className="flex-1"
          >
            View Details
          </AnimatedButton>

          {project.links?.demo && (
            <AnimatedButton
              variant="glass"
              size="sm"
              ripple={true}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.links?.demo, '_blank');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
              </svg>
            </AnimatedButton>
          )}

          {project.links?.github && (
            <AnimatedButton
              variant="neon"
              size="sm"
              ripple={true}
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.links?.github, '_blank');
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </AnimatedButton>
          )}
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default ProjectCard;
