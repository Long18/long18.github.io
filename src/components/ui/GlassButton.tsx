'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const modernButtonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl',
        modern: 'bg-gradient-to-br from-card to-muted text-card-foreground border border-border shadow-modern-lg hover:shadow-modern-xl hover:from-accent/20 hover:to-card',
        gradient: 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl',
        interactive: 'bg-card text-card-foreground border border-border hover:bg-accent/50 hover:border-accent transition-all duration-300',
        glow: 'bg-primary/20 text-primary border border-primary/50 shadow-glow hover:bg-primary hover:text-primary-foreground hover:shadow-glow-lg',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      effect: {
        none: '',
        shimmer: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700',
        slide: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary/20 before:to-primary/20 before:translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300',
        scale: 'hover:scale-105 active:scale-95',
      },
    },
    defaultVariants: {
      variant: 'modern',
      size: 'md',
      effect: 'none',
    },
  }
);

export interface ModernButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modernButtonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({
    className,
    variant,
    size,
    effect,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          modernButtonVariants({ variant, size, effect }),
          isDisabled && 'cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

ModernButton.displayName = 'ModernButton';

// Preset variants for common use cases
export const PrimaryModernButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'variant'>>(
  (props, ref) => <ModernButton variant="primary" ref={ref} {...props} />
);

export const SecondaryModernButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'variant'>>(
  (props, ref) => <ModernButton variant="secondary" ref={ref} {...props} />
);

export const GradientModernButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'variant'>>(
  (props, ref) => <ModernButton variant="gradient" ref={ref} {...props} />
);

export const InteractiveModernButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'variant'>>(
  (props, ref) => <ModernButton variant="interactive" ref={ref} {...props} />
);

export const GlowModernButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'variant'>>(
  (props, ref) => <ModernButton variant="glow" ref={ref} {...props} />
);

// Shimmer effect button
export const ShimmerButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'effect'>>(
  (props, ref) => <ModernButton effect="shimmer" ref={ref} {...props} />
);

// Slide effect button
export const SlideButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'effect'>>(
  (props, ref) => <ModernButton effect="slide" ref={ref} {...props} />
);

// Scale effect button
export const ScaleButton = React.forwardRef<HTMLButtonElement, Omit<ModernButtonProps, 'effect'>>(
  (props, ref) => <ModernButton effect="scale" ref={ref} {...props} />
);

PrimaryModernButton.displayName = 'PrimaryModernButton';
SecondaryModernButton.displayName = 'SecondaryModernButton';
GradientModernButton.displayName = 'GradientModernButton';
InteractiveModernButton.displayName = 'InteractiveModernButton';
GlowModernButton.displayName = 'GlowModernButton';
ShimmerButton.displayName = 'ShimmerButton';
SlideButton.displayName = 'SlideButton';
ScaleButton.displayName = 'ScaleButton';

// Keep compatibility with existing code
export default ModernButton;

// Legacy export for backward compatibility
export const GlassButton = ModernButton;
