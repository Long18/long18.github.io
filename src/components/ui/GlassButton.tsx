import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  shimmer?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      children,
      className,
      isLoading = false,
      leftIcon,
      rightIcon,
      glow = false,
      shimmer = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'duration-300',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-glass-accent/50',
      'focus:ring-offset-2',
      'focus:ring-offset-transparent',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:transform-none',
      'overflow-hidden',
      'group',
    ];

    const variantClasses = {
      primary: [
        'glass-btn-primary',
        'text-glass-accent',
        'hover:text-glass-accent-light',
        'hover:shadow-glass-glow',
        'active:scale-95',
      ],
      secondary: [
        'glass-secondary',
        'text-glass-text-primary',
        'hover:text-glass-accent',
        'border',
        'border-glass-border',
        'hover:border-glass-accent/50',
        'hover:shadow-glass-md',
        'active:scale-95',
      ],
      tertiary: [
        'glass-tertiary',
        'text-glass-text-secondary',
        'hover:text-glass-text-primary',
        'hover:glass-secondary',
        'active:scale-95',
      ],
      ghost: [
        'text-glass-text-secondary',
        'hover:text-glass-accent',
        'hover:glass-tertiary',
        'active:scale-95',
      ],
    };

    const sizeClasses = {
      sm: ['px-3', 'py-2', 'text-sm', 'rounded-lg', 'gap-2'],
      md: ['px-6', 'py-3', 'text-base', 'rounded-xl', 'gap-3'],
      lg: ['px-8', 'py-4', 'text-lg', 'rounded-2xl', 'gap-4'],
    };

    const glowClasses = glow ? ['glass-glow'] : [];
    const shimmerClasses = shimmer ? ['glass-shimmer'] : [];

    const combinedClasses = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      glowClasses,
      shimmerClasses,
      className
    );

    return (
      <motion.button
        ref={ref}
        className={combinedClasses}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        {/* Glass highlight effect */}
        <div className="absolute inset-0 rounded-inherit">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border-hover to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Left icon */}
          {leftIcon && !isLoading && (
            <span className="flex-shrink-0">{leftIcon}</span>
          )}

          {/* Loading spinner */}
          {isLoading && (
            <motion.div
              className="flex-shrink-0 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Button text */}
          <span className="relative">
            {children}
          </span>

          {/* Right icon */}
          {rightIcon && !isLoading && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className="absolute inset-0 rounded-inherit overflow-hidden">
          <div className="absolute inset-0 bg-glass-accent/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-inherit" />
        </div>
      </motion.button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export default GlassButton;
