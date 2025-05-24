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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageGalleryOpen) {
          setImageGalleryOpen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, imageGalleryOpen, onClose]);

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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-smoky-black bg-opacity-80 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 bg-eerie-black-2 border border-jet rounded-3xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-jet">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white-1 mb-2">
                  {project.title}
                </h2>
                <p className="text-white-2 text-sm">
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)} Project
                  {project.details?.teamSize && ` • Team of ${project.details.teamSize}`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white-2 hover:text-orange-yellow-crayola transition-colors duration-300 p-2 hover:bg-jet rounded-xl"
                aria-label="Close project details"
              >
                <IoCloseOutline className="text-2xl" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Project Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-white-1 mb-3">Description</h3>
                      <p className="text-white-2 leading-relaxed">{project.description}</p>
                    </div>

                    {project.details?.achievements && project.details.achievements.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-white-1 mb-3">Key Achievements</h3>
                        <ul className="space-y-2">
                          {project.details.achievements.map((achievement: string, index: number) => (
                            <li key={index} className="text-white-2 flex items-start gap-3">
                              <span className="text-orange-yellow-crayola mt-1.5 text-xs">●</span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.details?.responsibilities && project.details.responsibilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-white-1 mb-3">Responsibilities</h3>
                        <ul className="space-y-2">
                          {project.details.responsibilities.map((responsibility: string, index: number) => (
                            <li key={index} className="text-white-2 flex items-start gap-3">
                              <span className="text-orange-yellow-crayola mt-1.5 text-xs">●</span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {project.details?.description && (
                      <div>
                        <h3 className="text-xl font-semibold text-white-1 mb-3">Project Details</h3>
                        <p className="text-white-2 leading-relaxed">{project.details.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Project Meta */}
                  <div className="space-y-6">
                    <div className="bg-eerie-black-1 border border-jet rounded-2xl p-5">
                      <h3 className="text-lg font-semibold text-white-1 mb-4">Project Info</h3>
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
                          <span className="text-white-2 text-sm">Technologies:</span>
                          <div className="flex flex-wrap gap-2 mt-2">
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
                      <div className="bg-eerie-black-1 border border-jet rounded-2xl p-5">
                        <h3 className="text-lg font-semibold text-white-1 mb-4">Links & Downloads</h3>
                        <div className="space-y-3">
                          {Object.entries(project.links).map(([key, url]) => {
                            if (!url) return null;
                            return (
                              <a
                                key={key}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-jet hover:bg-orange-yellow-crayola/10 border border-transparent hover:border-orange-yellow-crayola rounded-xl transition-all duration-300 group"
                              >
                                <div className="text-orange-yellow-crayola group-hover:scale-110 transition-transform duration-300">
                                  {getLinkIcon(key)}
                                </div>
                                <span className="text-white-1 group-hover:text-orange-yellow-crayola transition-colors duration-300 text-sm font-medium">
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
                    <h3 className="text-xl font-semibold text-white-1 mb-6">Gallery</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <h3 className="text-xl font-semibold text-white-1 mb-6">Videos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {project.details.videos.map((video: { poster: string; src: string }, index: number) => (
                        <div key={index} className="relative aspect-video bg-eerie-black-1 rounded-xl overflow-hidden">
                          <video
                            controls
                            className="w-full h-full object-cover"
                            poster={video.poster}
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
          </motion.div>

          {/* Image Gallery Modal */}
          <AnimatePresence>
            {imageGalleryOpen && project.details?.images && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-90 z-60"
                  onClick={() => setImageGalleryOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-4 z-60 flex items-center justify-center"
                >
                  <div className="relative max-w-full max-h-full">
                    <Image
                      src={project.details.images[selectedImageIndex]}
                      alt={`${project.title} screenshot ${selectedImageIndex + 1}`}
                      width={1200}
                      height={800}
                      className="max-w-full max-h-full object-contain rounded-xl"
                    />
                    
                    {/* Close button */}
                    <button
                      onClick={() => setImageGalleryOpen(false)}
                      className="absolute top-4 right-4 text-white hover:text-orange-yellow-crayola bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
                    >
                      <IoCloseOutline className="text-2xl" />
                    </button>

                    {/* Navigation */}
                    {project.details.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-yellow-crayola bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
                        >
                          <IoChevronBackOutline className="text-2xl" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-yellow-crayola bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
                        >
                          <IoChevronForwardOutline className="text-2xl" />
                        </button>
                      </>
                    )}

                    {/* Image counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
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
