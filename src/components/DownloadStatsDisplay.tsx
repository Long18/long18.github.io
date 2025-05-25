'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '../utils';
import { motion } from 'framer-motion';

interface DownloadStats {
  total: number;
  android?: number;
  ios?: number;
  platforms: string[];
}

interface DownloadStatsDisplayProps {
  stats: DownloadStats;
  variant?: 'badge' | 'card' | 'inline' | 'detailed';
  className?: string;
  showPlatformBreakdown?: boolean;
}

const formatDownloadCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count.toLocaleString();
};

// Custom hook for animated numbers
const useAnimatedNumber = (target: number, duration: number = 2000) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) return;

    const increment = target / (duration / 16); // 60fps
    let currentValue = 0;
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(Math.floor(currentValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return current;
};

// Component for animated number display
const AnimatedNumber: React.FC<{ 
  value: number; 
  duration?: number; 
  className?: string;
  suffix?: string;
}> = ({ value, duration = 2000, className, suffix = '+' }) => {
  const animatedValue = useAnimatedNumber(value, duration);
  return (
    <span className={className}>
      {formatDownloadCount(animatedValue)}{suffix}
    </span>
  );
};

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
  </svg>
);

const TrendingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

// Enhanced Google Play Store icon
const GooglePlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.609 1.814L13.792 12L3.609 22.186C3.228 21.891 3 21.43 3 20.925V3.075C3 2.57 3.228 2.109 3.609 1.814Z" />
    <path d="M13.792 12L3.609 1.814C4.007 1.502 4.52 1.371 5.03 1.459L15.423 6.789L13.792 12Z" />
    <path d="M13.792 12L15.423 17.211L5.03 22.541C4.52 22.629 4.007 22.498 3.609 22.186L13.792 12Z" />
    <path d="M15.423 6.789L20.999 9.616C21.623 9.954 22 10.602 22 11.316V12.684C22 13.398 21.623 14.046 20.999 14.384L15.423 17.211L13.792 12L15.423 6.789Z" />
  </svg>
);

// Enhanced Apple App Store icon
const AppleStoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export const DownloadStatsDisplay: React.FC<DownloadStatsDisplayProps> = ({
  stats,
  variant = 'badge',
  className,
  showPlatformBreakdown = false
}) => {
  if (!stats || stats.total === 0) return null;

  // Helper functions to check data availability
  const hasAndroidData = stats.android && stats.android > 0;
  const hasIosData = stats.ios && stats.ios > 0;
  const hasPlatformData = hasAndroidData || hasIosData;
  const shouldShowPlatformBreakdown = showPlatformBreakdown && hasPlatformData;

  // Badge variant (for ProjectCard)
  if (variant === 'badge') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold',
          'bg-gradient-to-r from-emerald-500/90 to-green-600/90',
          'text-white border border-emerald-400/50 shadow-lg shadow-emerald-500/25',
          'backdrop-blur-md transition-all duration-300 hover:scale-105',
          className
        )}
      >
        <DownloadIcon className="w-3 h-3" />
        <AnimatedNumber value={stats.total} duration={1500} className="tabular-nums" />
        <span>downloads</span>
      </motion.div>
    );
  }

  // Inline variant (for text content)
  if (variant === 'inline') {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 text-emerald-400 font-medium',
        className
      )}>
        <DownloadIcon className="w-4 h-4" />
        <AnimatedNumber value={stats.total} duration={1800} className="tabular-nums" />
        <span>downloads</span>
      </span>
    );
  }

  // Card variant (for ProjectDetail)
  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'bg-gradient-to-br from-emerald-500/10 to-green-600/10',
          'border border-emerald-500/30 rounded-xl p-4',
          'backdrop-blur-sm',
          className
        )}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <TrendingIcon className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-400">Download Success</h3>
            <p className="text-sm text-gray-400">Global reach across platforms</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Total Downloads</span>
            <AnimatedNumber 
              value={stats.total} 
              duration={2000} 
              className="text-emerald-400 font-bold text-lg tabular-nums"
            />
          </div>
          
          {shouldShowPlatformBreakdown && (
            <div className="grid grid-cols-1 gap-2 mt-4">
              {hasAndroidData && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <GooglePlayIcon className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium text-sm">Google Play</span>
                  </div>
                  <AnimatedNumber 
                    value={stats.android!} 
                    duration={2200} 
                    className="text-green-400 font-semibold text-sm tabular-nums"
                  />
                </motion.div>
              )}
              
              {hasIosData && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <AppleStoreIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-400 font-medium text-sm">App Store</span>
                  </div>
                  <AnimatedNumber 
                    value={stats.ios!} 
                    duration={2400} 
                    className="text-blue-400 font-semibold text-sm tabular-nums"
                  />
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // Detailed variant (for project detail page)
  if (variant === 'detailed') {
    // Determine platform order
    const bothPlatforms = hasAndroidData && hasIosData;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          'bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-teal-500/10',
          'border border-emerald-500/30 rounded-2xl p-6',
          'backdrop-blur-sm relative overflow-hidden',
          className
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-4 w-16 h-16 bg-emerald-400 rounded-full blur-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-green-400 rounded-full blur-lg" />
        </div>
        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-3 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl border border-emerald-500/30"
              >
                <TrendingIcon className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <div>
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-xl font-bold text-emerald-400 mb-1"
                >
                  Global Success
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="text-gray-400 text-sm"
                >
                  Download milestones achieved across platforms
                </motion.p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-right"
            >
              <AnimatedNumber 
                value={stats.total} 
                duration={2500} 
                className="text-3xl font-bold text-emerald-400 tabular-nums block"
              />
              <div className="text-sm text-gray-400">Total Downloads</div>
            </motion.div>
          </div>
          {/* Platform breakdown: Apple on top, Google Play below if both exist */}
          {hasPlatformData && (
            <div className={cn(
              'grid gap-6 mb-6',
              bothPlatforms ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 max-w-md mx-auto'
            )}>
              {hasIosData && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="relative bg-gradient-to-br from-blue-500/15 to-blue-600/10 border border-blue-500/30 rounded-xl p-5 overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  {/* Apple Store background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent" />
                  <div className="absolute top-2 right-2 w-8 h-8 bg-blue-400/20 rounded-full blur-md" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <AppleStoreIcon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <span className="text-blue-400 font-bold text-lg">App Store</span>
                        <div className="text-xs text-gray-400">iOS Platform</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <AnimatedNumber 
                        value={stats.ios!} 
                        duration={3200} 
                        className="text-2xl font-bold text-blue-300 tabular-nums block"
                      />
                      <div className="text-xs text-blue-400/70">downloads</div>
                    </div>
                  </div>
                </motion.div>
              )}
              {hasAndroidData && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="relative bg-gradient-to-br from-green-500/15 to-green-600/10 border border-green-500/30 rounded-xl p-5 overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  {/* Google Play background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent" />
                  <div className="absolute top-2 right-2 w-8 h-8 bg-green-400/20 rounded-full blur-md" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <GooglePlayIcon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <span className="text-green-400 font-bold text-lg">Google Play</span>
                        <div className="text-xs text-gray-400">Android Platform</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <AnimatedNumber 
                        value={stats.android!} 
                        duration={3000} 
                        className="text-2xl font-bold text-green-300 tabular-nums block"
                      />
                      <div className="text-xs text-green-400/70">downloads</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: hasPlatformData ? 1.0 : 0.8 }}
            className="pt-4 border-t border-emerald-500/20"
          >
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DownloadIcon className="w-4 h-4" />
              <span>
                {hasPlatformData 
                  ? "Statistics tracked across all platforms • Updated January 2025"
                  : "Total downloads across all platforms • Updated January 2025"
                }
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
};

export default DownloadStatsDisplay;
