'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl',
        outline: 'border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        ghost: 'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        gradient: 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl',
        success: 'bg-success text-success-foreground hover:bg-success/90 shadow-lg hover:shadow-xl',
        warning: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-lg hover:shadow-xl',
        info: 'bg-info text-info-foreground hover:bg-info/90 shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      rounded: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    rounded,
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
          buttonVariants({ variant, size, rounded }),
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
        {children}
        {rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Preset button components for common use cases
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="primary" ref={ref} {...props} />
);

export const SecondaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="secondary" ref={ref} {...props} />
);

export const OutlineButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="outline" ref={ref} {...props} />
);

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="ghost" ref={ref} {...props} />
);

export const GradientButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="gradient" ref={ref} {...props} />
);

// Interactive button with modern effects
export const InteractiveButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      className={cn(
        'group relative overflow-hidden',
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-secondary/20 before:to-primary/20',
        'before:translate-x-full before:transition-transform before:duration-300',
        'hover:before:translate-x-0',
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </Button>
  )
);

// Technology-specific button variants
export const TechButton = React.forwardRef<HTMLButtonElement, ButtonProps & { tech: 'unity' | 'unreal' | 'csharp' | 'cpp' | 'javascript' | 'typescript' | 'web' | 'mobile' | 'application' }>(
  ({ tech, className, style, ...props }, ref) => {
    const techColors = {
      unity: 'bg-tech-unity text-tech-unity-foreground hover:bg-tech-unity/90',
      unreal: 'bg-tech-unreal text-tech-unreal-foreground hover:bg-tech-unreal/90',
      csharp: 'bg-tech-csharp text-tech-csharp-foreground hover:bg-tech-csharp/90',
      cpp: 'bg-tech-cpp text-tech-cpp-foreground hover:bg-tech-cpp/90',
      javascript: 'bg-tech-javascript text-tech-javascript-foreground hover:bg-tech-javascript/90',
      typescript: 'bg-tech-typescript text-tech-typescript-foreground hover:bg-tech-typescript/90',
      web: 'bg-tech-web text-tech-web-foreground hover:bg-tech-web/90',
      mobile: 'bg-tech-mobile text-tech-mobile-foreground hover:bg-tech-mobile/90',
      application: 'bg-tech-application text-tech-application-foreground hover:bg-tech-application/90',
    };

    return (
      <Button
        className={cn(
          techColors[tech],
          'shadow-lg hover:shadow-xl transition-all duration-200',
          className
        )}
        style={style}
        ref={ref}
        {...props}
      />
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';
SecondaryButton.displayName = 'SecondaryButton';
OutlineButton.displayName = 'OutlineButton';
GhostButton.displayName = 'GhostButton';
GradientButton.displayName = 'GradientButton';
InteractiveButton.displayName = 'InteractiveButton';
TechButton.displayName = 'TechButton';

export { Button, buttonVariants };
