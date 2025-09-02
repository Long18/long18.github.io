'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface AnimatedBackgroundProps {
  variant?: 'particles' | 'gradient' | 'mesh' | 'dots' | 'lines' | 'waves';
  className?: string;
  children?: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'medium' | 'fast';
  color?: 'orange' | 'blue' | 'purple' | 'green' | 'pink';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  variant = 'particles',
  className,
  children,
  intensity = 'medium',
  speed = 'medium',
  color = 'orange',
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'orange':
        return 'from-orange-400/20 via-orange-500/10 to-orange-600/20';
      case 'blue':
        return 'from-blue-400/20 via-blue-500/10 to-blue-600/20';
      case 'purple':
        return 'from-purple-400/20 via-purple-500/10 to-purple-600/20';
      case 'green':
        return 'from-green-400/20 via-green-500/10 to-green-600/20';
      case 'pink':
        return 'from-pink-400/20 via-pink-500/10 to-pink-600/20';
      default:
        return 'from-orange-400/20 via-orange-500/10 to-orange-600/20';
    }
  };

  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 20;
      case 'medium': return 50;
      case 'high': return 100;
      default: return 50;
    }
  };

  const getAnimationDuration = () => {
    switch (speed) {
      case 'slow': return 20;
      case 'medium': return 10;
      case 'fast': return 5;
      default: return 10;
    }
  };

  const renderParticles = () => {
    const count = getParticleCount();
    const duration = getAnimationDuration();

    return Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className={cn(
          'absolute w-1 h-1 rounded-full opacity-60',
          color === 'orange' && 'bg-orange-400',
          color === 'blue' && 'bg-blue-400',
          color === 'purple' && 'bg-purple-400',
          color === 'green' && 'bg-green-400',
          color === 'pink' && 'bg-pink-400'
        )}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, Math.random() * 20 - 10, 0],
          opacity: [0.3, 1, 0.3],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: duration + Math.random() * 5,
          repeat: Infinity,
          delay: Math.random() * 2,
          ease: 'easeInOut',
        }}
      />
    ));
  };

  const renderDots = () => {
    return (
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, ${color === 'orange' ? 'rgba(251,146,60,0.3)' :
              color === 'blue' ? 'rgba(59,130,246,0.3)' :
              color === 'purple' ? 'rgba(147,51,234,0.3)' :
              color === 'green' ? 'rgba(34,197,94,0.3)' :
              'rgba(236,72,153,0.3)'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />
      </div>
    );
  };

  const renderLines = () => {
    return (
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="lines" patternUnits="userSpaceOnUse" width="40" height="40">
              <path
                d="M 40 0 L 0 40"
                stroke={color === 'orange' ? '#fb923c' :
                  color === 'blue' ? '#3b82f6' :
                  color === 'purple' ? '#9333ea' :
                  color === 'green' ? '#22c55e' :
                  '#ec4899'}
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>
    );
  };

  const renderWaves = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute inset-0 opacity-20',
              `bg-gradient-to-r ${getColorClasses()}`
            )}
            style={{
              clipPath: `polygon(0 ${50 + i * 10}%, 100% ${30 + i * 15}%, 100% 100%, 0% 100%)`,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: getAnimationDuration() + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 2,
            }}
          />
        ))}
      </div>
    );
  };

  const renderMesh = () => {
    return (
      <div className="absolute inset-0">
        <motion.div
          className={cn(
            'absolute inset-0 opacity-30 bg-gradient-to-br',
            getColorClasses()
          )}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: getAnimationDuration(),
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 24%, ${color === 'orange' ? 'rgba(251,146,60,0.3)' :
                color === 'blue' ? 'rgba(59,130,246,0.3)' :
                color === 'purple' ? 'rgba(147,51,234,0.3)' :
                color === 'green' ? 'rgba(34,197,94,0.3)' :
                'rgba(236,72,153,0.3)'} 25%, ${color === 'orange' ? 'rgba(251,146,60,0.3)' :
                color === 'blue' ? 'rgba(59,130,246,0.3)' :
                color === 'purple' ? 'rgba(147,51,234,0.3)' :
                color === 'green' ? 'rgba(34,197,94,0.3)' :
                'rgba(236,72,153,0.3)'} 26%, transparent 27%, transparent 74%, ${color === 'orange' ? 'rgba(251,146,60,0.3)' :
                color === 'blue' ? 'rgba(59,130,246,0.3)' :
                color === 'purple' ? 'rgba(147,51,234,0.3)' :
                color === 'green' ? 'rgba(34,197,94,0.3)' :
                'rgba(236,72,153,0.3)'} 75%, ${color === 'orange' ? 'rgba(251,146,60,0.3)' :
                color === 'blue' ? 'rgba(59,130,246,0.3)' :
                color === 'purple' ? 'rgba(147,51,234,0.3)' :
                color === 'green' ? 'rgba(34,197,94,0.3)' :
                'rgba(236,72,153,0.3)'} 76%, transparent 77%, transparent),
              linear-gradient(${color === 'orange' ? 'rgba(251,146,60,0.3)' :
                color === 'blue' ? 'rgba(59,130,246,0.3)' :
                color === 'purple' ? 'rgba(147,51,234,0.3)' :
                color === 'green' ? 'rgba(34,197,94,0.3)' :
                'rgba(236,72,153,0.3)'} 50%, transparent 50%)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    );
  };

  const renderBackground = () => {
    switch (variant) {
      case 'particles':
        return renderParticles();
      case 'gradient':
        return (
          <motion.div
            className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-30',
              getColorClasses()
            )}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: getAnimationDuration(),
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            style={{
              backgroundSize: '400% 400%',
            }}
          />
        );
      case 'mesh':
        return renderMesh();
      case 'dots':
        return renderDots();
      case 'lines':
        return renderLines();
      case 'waves':
        return renderWaves();
      default:
        return renderParticles();
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {renderBackground()}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export { AnimatedBackground };
export type { AnimatedBackgroundProps };
