'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '@/types/portfolio';
import {
  IoCloseOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoOpenOutline,
  IoLogoGithub,
  IoLogoApple,
  IoLogoGooglePlaystore,
} from 'react-icons/io5';
import Image from 'next/image';
import { cn } from '@/utils';
import DownloadStatsDisplay from './DownloadStatsDisplay';
import { getProjectDownloadStats } from '@/data/assetPaths';
import { createPortal } from 'react-dom';
// Modern components ready for future use
// import { Button } from '@/components/ui/Button';
// import { Typography } from '@/components/ui/Typography';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ProjectDetailProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Get download stats for the project
  const downloadStats = project ? getProjectDownloadStats(project.id) : null;

  // Body scroll management
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const openImageGallery = (index: number) => {
    setSelectedImageIndex(index);
    setImageGalleryOpen(true);
    // Reset zoom and position when opening new image
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Reset zoom and position when changing images
  const resetImageView = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setImageZoom((prev) => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setImageZoom((prev) => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = () => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setImageZoom((prev) => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const nextImage = useCallback(() => {
    if (project?.gallery) {
      setSelectedImageIndex((prev) =>
        prev === project.gallery!.length - 1 ? 0 : prev + 1
      );
      resetImageView();
    }
  }, [project]);

  const prevImage = useCallback(() => {
    if (project?.gallery) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? project.gallery!.length - 1 : prev - 1
      );
      resetImageView();
    }
  }, [project]);

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageGalleryOpen) {
          setImageGalleryOpen(false);
        } else {
          onClose();
        }
      }

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

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, imageGalleryOpen, onClose, project, nextImage, prevImage]);

  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'github':
        return <IoLogoGithub className="text-xl" />;
      case 'android':
        return <IoLogoGooglePlaystore className="text-xl" />;
      case 'ios':
        return <IoLogoApple className="text-xl" />;
      case 'website':
        return <IoOpenOutline className="text-xl" />;
      default:
        return <IoOpenOutline className="text-xl" />;
    }
  };

  const getLinkLabel = (type: string) => {
    switch (type) {
      case 'github':
        return 'GitHub Repository';
      case 'android':
        return 'Google Play Store';
      case 'ios':
        return 'App Store';
      case 'website':
        return 'Visit Website';
      default:
        return 'Visit Link';
    }
  };

  if (!project) return null;

  // Create a portal to render outside of the MainApp constraints
  if (typeof window === 'undefined') return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Enhanced Backdrop with proper blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 bg-gradient-to-br from-smoky-black/95 via-eerie-black-1/90 to-smoky-black/95 backdrop-blur-xl z-[9999]"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Popup Modal Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8 xl:p-4 2xl:p-6"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10000,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
          >
            {/* Popup Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl xl:max-w-none h-[90vh] xl:h-[95vh] bg-gradient-to-br from-eerie-black-2/95 via-smoky-black/90 to-eerie-black-1/95 rounded-2xl shadow-2xl border border-jet/50 overflow-hidden flex flex-col"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-orange-400/5" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,146,60,0.15) 1px, transparent 0)`,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              {/* Modal Background Pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-orange-400/5" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,146,60,0.15) 1px, transparent 0)`,
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>

              {/* Enhanced Header with Better Visual Hierarchy */}
              <div className="relative bg-gradient-to-r from-eerie-black-2/90 via-smoky-black/80 to-eerie-black-2/90 backdrop-blur-md border-b border-jet/50">
                {/* Header Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-transparent to-orange-400/5" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

                <div className="relative z-10 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Project Info Section */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* Category Badge */}
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-400/20 to-orange-500/20 text-orange-300 border border-orange-400/40 rounded-full text-xs font-semibold tracking-wide uppercase shadow-lg backdrop-blur-sm">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
                          {project.category.replace('-', ' ')}
                        </span>

                        {/* Featured Badge */}
                        {project.storeLinks &&
                          (project.storeLinks.android ||
                            project.storeLinks.ios) && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-medium shadow-md">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Featured
                            </span>
                          )}
                      </div>

                      {/* Project Title - Balanced Size */}
                      <h2
                        id="modal-title"
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-white via-white-1 to-orange-200 bg-clip-text leading-tight"
                      >
                        {project.title}
                      </h2>

                      {/* Timeline with Enhanced Styling */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-eerie-black-1/60 border border-jet/50 rounded-lg backdrop-blur-sm">
                          <svg
                            className="w-4 h-4 text-orange-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-white-1 font-medium text-sm">
                            {project.timeline}
                          </span>
                        </div>

                        {/* Download Stats Badge if available */}
                        {downloadStats && downloadStats.total > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/40 rounded-lg text-sm font-medium shadow-md backdrop-blur-sm">
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
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                              />
                            </svg>
                            {downloadStats.total.toLocaleString()} downloads
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Close Button */}
                    <button
                      onClick={onClose}
                      className="relative group p-3 xl:p-3.5 bg-gradient-to-r from-red-500/80 to-rose-500/80 hover:from-red-400/90 hover:to-rose-400/90 border border-red-400/60 hover:border-red-300/80 rounded-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400/60 shadow-lg shadow-red-500/20 hover:shadow-red-400/30 backdrop-blur-sm"
                      aria-label="Close project details"
                    >
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-rose-400/20 group-hover:from-red-300/30 group-hover:to-rose-300/30 rounded-xl transition-all duration-300" />

                      {/* Bubble X icon */}
                      <IoCloseOutline className="relative z-10 text-2xl text-white group-hover:text-red-50 transition-all duration-300 filter drop-shadow-lg group-hover:drop-shadow-2xl animate-pulse group-hover:animate-bounce"
                        style={{
                          textShadow: '0 0 10px rgba(255,255,255,0.5), 0 0 20px rgba(255,255,255,0.3), 0 0 30px rgba(255,255,255,0.1)',
                          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 16px rgba(255,255,255,0.4))'
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content - Fixed height calculation */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 xl:p-6 2xl:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {/* Enhanced Main Content with Professional Card Layout */}
                  <div className="lg:col-span-2 xl:col-span-3 space-y-8">
                    {/* Enhanced Description Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative group bg-gradient-to-br from-eerie-black-2/70 via-smoky-black/60 to-eerie-black-1/70 border border-jet/50 hover:border-orange-400/40 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-orange-400/10 transition-all duration-300"
                    >
                      {/* Card Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/3 via-transparent to-orange-400/3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

                      <div className="relative z-10">
                        {/* Enhanced Header with Icon */}
                        <div className="flex items-center gap-4 mb-5">
                          <div className="p-2.5 bg-gradient-to-r from-orange-400/20 to-orange-500/20 rounded-xl border border-orange-400/30">
                            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-white to-orange-200 bg-clip-text">
                            Project Overview
                          </h3>
                        </div>

                        {/* Enhanced Description Content */}
                        <div className="prose prose-invert max-w-none">
                          <p className="text-white-2 leading-relaxed text-base lg:text-lg font-medium">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced Key Achievements Card */}
                    {project.achievements && project.achievements.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative group bg-gradient-to-br from-emerald-500/10 via-green-600/10 to-teal-600/10 border border-emerald-500/30 hover:border-emerald-400/50 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-emerald-400/10 transition-all duration-300"
                      >
                        {/* Card Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-transparent to-emerald-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

                        <div className="relative z-10">
                          {/* Enhanced Header with Icon */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-2.5 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-xl border border-emerald-500/30">
                              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                              Key Achievements
                            </h3>
                            <div className="flex-1 ml-4 h-px bg-gradient-to-r from-emerald-400/30 to-transparent"></div>
                          </div>

                          {/* Enhanced Achievement List */}
                          <div className="grid gap-4">
                            {project.achievements.map((achievement: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group/item relative flex items-start gap-4 p-4 bg-gradient-to-r from-eerie-black-1/60 to-smoky-black/40 rounded-xl border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-emerald-500/5 transition-all duration-300"
                              >
                                {/* Achievement Icon */}
                                <div className="relative mt-1">
                                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 rounded-full flex items-center justify-center border border-emerald-400/40 group-hover/item:scale-110 transition-transform duration-300">
                                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping opacity-0 group-hover/item:opacity-100"></div>
                                </div>

                                {/* Achievement Content */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white-1 group-hover/item:text-emerald-100 font-medium leading-relaxed transition-colors duration-300">
                                    {achievement}
                                  </p>
                                </div>

                                {/* Hover Effect Indicator */}
                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Responsibilities Card */}
                    {project.responsibilities && project.responsibilities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative group bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-indigo-600/10 border border-blue-500/30 hover:border-blue-400/50 rounded-2xl p-6 lg:p-8 backdrop-blur-md shadow-lg hover:shadow-xl hover:shadow-blue-400/10 transition-all duration-300"
                      >
                        {/* Card Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-blue-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

                        <div className="relative z-10">
                          {/* Enhanced Header with Icon */}
                          <div className="flex items-center gap-4 mb-6">
                            <div className="p-2.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-500/30">
                              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text">
                              Key Responsibilities
                            </h3>
                            <div className="flex-1 ml-4 h-px bg-gradient-to-r from-blue-400/30 to-transparent"></div>
                          </div>

                          {/* Enhanced Responsibility List */}
                          <div className="grid gap-4">
                            {project.responsibilities.map((responsibility: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="group/item relative flex items-start gap-4 p-4 bg-gradient-to-r from-eerie-black-1/60 to-smoky-black/40 rounded-xl border border-blue-500/20 hover:border-blue-400/40 hover:bg-blue-500/5 transition-all duration-300"
                              >
                                {/* Responsibility Icon */}
                                <div className="relative mt-1">
                                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500/30 to-blue-600/30 rounded-full flex items-center justify-center border border-blue-400/40 group-hover/item:scale-110 transition-transform duration-300">
                                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                  <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping opacity-0 group-hover/item:opacity-100"></div>
                                </div>

                                {/* Responsibility Content */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-white-1 group-hover/item:text-blue-100 font-medium leading-relaxed transition-colors duration-300">
                                    {responsibility}
                                  </p>
                                </div>

                                {/* Hover Effect Indicator */}
                                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Enhanced Sidebar */}
                  <div className="space-y-6 xl:space-y-8">
                    {/* Enhanced Project Info Card */}
                    <div className="relative group bg-gradient-to-br from-eerie-black-2/80 via-smoky-black/70 to-eerie-black-1/80 border border-jet/60 hover:border-orange-400/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-orange-400/10 transition-all duration-300">
                      {/* Card Background Effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

                      <div className="relative z-10">
                        {/* Enhanced Header */}
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-2 bg-gradient-to-r from-orange-400/20 to-orange-500/20 rounded-lg border border-orange-400/30">
                            <svg
                              className="w-5 h-5 text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-white to-orange-200 bg-clip-text">
                            Project Details
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {/* Enhanced Timeline */}
                          <div className="p-3 bg-gradient-to-r from-eerie-black-1/60 to-smoky-black/40 rounded-lg border border-jet/40 hover:border-orange-400/30 transition-colors duration-300">
                            <div className="flex items-center gap-2 mb-1">
                              <svg
                                className="w-4 h-4 text-orange-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="text-orange-300 text-sm font-semibold">
                                Timeline
                              </span>
                            </div>
                            <p className="text-white-1 font-medium text-sm pl-6">
                              {project.timeline}
                            </p>
                          </div>

                          {/* Enhanced Technologies */}
                          <div className="p-3 bg-gradient-to-r from-eerie-black-1/60 to-smoky-black/40 rounded-lg border border-jet/40 hover:border-orange-400/30 transition-colors duration-300">
                            <div className="flex items-center gap-2 mb-3">
                              <svg
                                className="w-4 h-4 text-orange-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                              </svg>
                              <span className="text-orange-300 text-sm font-semibold">
                                Technologies
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className={cn(
                                    'px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-default shadow-md hover:shadow-lg',
                                    tag.colorClass
                                  )}
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Download Statistics */}
                    {downloadStats && downloadStats.total > 0 && (
                      <div className="relative group bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-purple-600/10 border border-blue-500/40 hover:border-blue-400/60 rounded-2xl p-5 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-blue-400/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/30">
                              <svg
                                className="w-5 h-5 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text">
                              Download Statistics
                            </h3>
                          </div>
                          <DownloadStatsDisplay
                            stats={downloadStats}
                            variant="detailed"
                          />
                        </div>
                      </div>
                    )}

                    {/* Enhanced Links Section */}
                    {((project.storeLinks &&
                      (project.storeLinks.android || project.storeLinks.ios)) ||
                      project.website) && (
                      <div className="relative group bg-gradient-to-br from-eerie-black-2/80 via-smoky-black/70 to-eerie-black-1/80 border border-jet/60 hover:border-orange-400/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-orange-400/10 transition-all duration-300">
                        {/* Card Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

                        <div className="relative z-10">
                          {/* Enhanced Header */}
                          <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-gradient-to-r from-emerald-400/20 to-emerald-500/20 rounded-lg border border-emerald-400/30">
                              <svg
                                className="w-5 h-5 text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                              </svg>
                            </div>
                            <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text">
                              Project Links
                            </h3>
                          </div>

                          <div className="space-y-3">
                            {project.storeLinks?.android && (
                              <a
                                href={project.storeLinks.android}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link relative flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 via-green-600/10 to-emerald-600/10 hover:from-green-500/20 hover:via-green-600/20 hover:to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-400/20"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 to-green-400/0 group-hover/link:from-green-400/5 group-hover/link:to-emerald-400/5 rounded-xl transition-all duration-300" />
                                <div className="relative z-10 p-2 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-lg border border-green-500/40 group-hover/link:scale-110 transition-transform duration-300">
                                  {getLinkIcon('android')}
                                </div>
                                <div className="relative z-10 flex-1">
                                  <span className="text-white-1 group-hover/link:text-green-300 font-semibold text-sm transition-colors duration-300">
                                    {getLinkLabel('android')}
                                  </span>
                                  <p className="text-green-400/70 text-xs mt-1">
                                    Download for Android devices
                                  </p>
                                </div>
                                <div className="relative z-10 text-green-400/60 group-hover/link:text-green-300 transition-colors duration-300">
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
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </a>
                            )}

                            {project.storeLinks?.ios && (
                              <a
                                href={project.storeLinks.ios}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link relative flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500/10 via-blue-600/10 to-indigo-600/10 hover:from-blue-500/20 hover:via-blue-600/20 hover:to-indigo-600/20 border border-blue-500/30 hover:border-blue-400/50 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-400/20"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 to-blue-400/0 group-hover/link:from-blue-400/5 group-hover/link:to-indigo-400/5 rounded-xl transition-all duration-300" />
                                <div className="relative z-10 p-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg border border-blue-500/40 group-hover/link:scale-110 transition-transform duration-300">
                                  {getLinkIcon('ios')}
                                </div>
                                <div className="relative z-10 flex-1">
                                  <span className="text-white-1 group-hover/link:text-blue-300 font-semibold text-sm transition-colors duration-300">
                                    {getLinkLabel('ios')}
                                  </span>
                                  <p className="text-blue-400/70 text-xs mt-1">
                                    Download for iOS devices
                                  </p>
                                </div>
                                <div className="relative z-10 text-blue-400/60 group-hover/link:text-blue-300 transition-colors duration-300">
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
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </a>
                            )}

                            {project.website && (
                              <a
                                href={project.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/link relative flex items-center gap-4 p-4 bg-gradient-to-r from-orange-500/10 via-orange-600/10 to-red-600/10 hover:from-orange-500/20 hover:via-orange-600/20 hover:to-red-600/20 border border-orange-500/30 hover:border-orange-400/50 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-400/20"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 to-orange-400/0 group-hover/link:from-orange-400/5 group-hover/link:to-red-400/5 rounded-xl transition-all duration-300" />
                                <div className="relative z-10 p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-lg border border-orange-500/40 group-hover/link:scale-110 transition-transform duration-300">
                                  {getLinkIcon('website')}
                                </div>
                                <div className="relative z-10 flex-1">
                                  <span className="text-white-1 group-hover/link:text-orange-300 font-semibold text-sm transition-colors duration-300">
                                    {getLinkLabel('website')}
                                  </span>
                                  <p className="text-orange-400/70 text-xs mt-1">
                                    View live website
                                  </p>
                                </div>
                                <div className="relative z-10 text-orange-400/60 group-hover/link:text-orange-300 transition-colors duration-300">
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
                                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                  </svg>
                                </div>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enhanced Gallery Section */}
                {project.gallery && project.gallery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative bg-gradient-to-br from-eerie-black-2/60 via-smoky-black/50 to-eerie-black-1/60 border border-jet/50 hover:border-orange-400/40 rounded-2xl p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-orange-400/10 transition-all duration-300"
                  >
                    {/* Section Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/3 via-transparent to-orange-400/3 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />

                    <div className="relative z-10">
                      {/* Enhanced Gallery Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                          <svg
                            className="w-6 h-6 text-purple-400"
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
                        <div>
                          <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                            Project Gallery
                          </h3>
                          <p className="text-white-2/70 text-sm mt-1">
                            {project.gallery.length} screenshot
                            {project.gallery.length > 1 ? 's' : ''} • Click to
                            view full size
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Gallery Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 xl:gap-6">
                        {project.gallery.map((image: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative aspect-video bg-gradient-to-br from-eerie-black-2/80 to-smoky-black/60 rounded-xl overflow-hidden cursor-pointer group border border-jet/60 hover:border-purple-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-400/20"
                            onClick={() => openImageGallery(index)}
                          >
                            <Image
                              src={image}
                              alt={`${project.title} screenshot ${index + 1}`}
                              fill
                              className="object-cover transition-all duration-500 group-hover:scale-110"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/30">
                                <IoOpenOutline className="text-white text-xl" />
                              </div>
                            </div>
                            {/* Image number indicator */}
                            <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {index + 1}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Videos Section */}
                {project.videos && project.videos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="relative bg-gradient-to-br from-eerie-black-2/60 via-smoky-black/50 to-eerie-black-1/60 border border-jet/50 hover:border-red-400/40 rounded-2xl p-6 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-red-400/10 transition-all duration-300"
                  >
                    {/* Section Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/3 via-transparent to-red-400/3 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />

                    <div className="relative z-10">
                      {/* Enhanced Videos Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl border border-red-500/30">
                          <svg
                            className="w-6 h-6 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text">
                            Project Videos
                          </h3>
                          <p className="text-white-2/70 text-sm mt-1">
                            {project.videos.length} video
                            {project.videos.length > 1 ? 's' : ''} • Gameplay
                            and features showcase
                          </p>
                        </div>
                      </div>

                      {/* Enhanced Videos Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                        {project.videos.map((video, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="relative aspect-video bg-gradient-to-br from-eerie-black-2/80 to-smoky-black/60 rounded-xl overflow-hidden border border-jet/60 hover:border-red-400/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-400/20 group"
                          >
                            <video
                              controls
                              poster={video.poster}
                              className="w-full h-full object-cover rounded-xl"
                              preload="metadata"
                            >
                              <source src={video.src} type="video/mp4" />
                            </video>
                            {/* Video overlay effects */}
                            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                            {/* Video number indicator */}
                            <div className="absolute top-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                              Video {index + 1}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Enhanced Image Gallery Modal with Higher Z-Index */}
          <AnimatePresence>
            {imageGalleryOpen && project.gallery && (
              <>
                {/* Gallery Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black/98 backdrop-blur-sm z-[50000]"
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 50000,
                  }}
                  onClick={() => setImageGalleryOpen(false)}
                />

                {/* Gallery Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="fixed inset-4 z-[50001] flex items-center justify-center"
                  style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    right: '1rem',
                    bottom: '1rem',
                    zIndex: 50001,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-2xl backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      cursor:
                        imageZoom > 1
                          ? isDragging
                            ? 'grabbing'
                            : 'grab'
                          : 'default',
                    }}
                  >
                    {/* Responsive Image Display with Zoom & Drag */}
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <div
                        className="relative transition-transform duration-200 ease-out"
                        style={{
                          transform: `scale(${imageZoom}) translate(${
                            imagePosition.x / imageZoom
                          }px, ${imagePosition.y / imageZoom}px)`,
                          transformOrigin: 'center center',
                        }}
                      >
                        <Image
                          src={project.gallery[selectedImageIndex]}
                          alt={`${project.title} screenshot ${
                            selectedImageIndex + 1
                          }`}
                          width={1200}
                          height={800}
                          className="object-contain rounded-xl max-w-full max-h-full"
                          style={{
                            maxWidth: '90vw',
                            maxHeight: '80vh',
                            width: 'auto',
                            height: 'auto',
                          }}
                          sizes="90vw"
                          priority
                          draggable={false}
                        />
                      </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/90 rounded-full p-2 border border-white/20 backdrop-blur-sm">
                      <button
                        onClick={handleZoomOut}
                        className="p-2 text-white hover:text-orange-400 transition-colors duration-300 hover:scale-110"
                        disabled={imageZoom <= 0.5}
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={handleResetZoom}
                        className="px-3 py-1 text-xs text-white hover:text-orange-400 transition-colors duration-300"
                      >
                        {Math.round(imageZoom * 100)}%
                      </button>

                      <button
                        onClick={handleZoomIn}
                        className="p-2 text-white hover:text-orange-400 transition-colors duration-300 hover:scale-110"
                        disabled={imageZoom >= 5}
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Zoom Instructions */}
                    {imageZoom === 1 && (
                      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-full border border-white/20 backdrop-blur-sm opacity-70">
                        Scroll to zoom • Click buttons to zoom
                      </div>
                    )}

                    {imageZoom > 1 && (
                      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded-full border border-white/20 backdrop-blur-sm opacity-70">
                        Drag to pan • Scroll to zoom
                      </div>
                    )}

                    {/* Enhanced Controls */}
                    <button
                      onClick={() => setImageGalleryOpen(false)}
                      className="absolute top-4 right-4 text-white hover:text-orange-400 bg-black/80 hover:bg-black/90 rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-sm"
                    >
                      <IoCloseOutline className="text-2xl" />
                    </button>

                    {project.gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 bg-black/80 hover:bg-black/90 rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-sm"
                        >
                          <IoChevronBackOutline className="text-2xl" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-orange-400 bg-black/80 hover:bg-black/90 rounded-full p-3 transition-all duration-300 hover:scale-110 border border-white/20 backdrop-blur-sm"
                        >
                          <IoChevronForwardOutline className="text-2xl" />
                        </button>
                      </>
                    )}

                    {/* Enhanced Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
                      {selectedImageIndex + 1} of {project.gallery.length}
                    </div>

                    {/* Image Title */}
                    <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm">
                      {project.title} Gallery
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

  // Use React Portal to render outside of the MainApp constraints
  if (typeof window !== 'undefined') {
    const portalRoot = document.body;
    return createPortal(modalContent, portalRoot);
  }

  return modalContent;
};

export default ProjectDetail;
