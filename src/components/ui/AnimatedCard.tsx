'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow transition-all duration-300 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-border bg-card',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 shadow-xl',
        gradient: 'bg-gradient-to-br from-orange-400/10 via-orange-500/5 to-orange-600/10 border-orange-400/20',
        neon: 'bg-transparent border-2 border-orange-400/50 shadow-[0_0_20px_rgba(251,146,60,0.1)]',
        elevated: 'shadow-2xl border-0 bg-gradient-to-br from-card via-card to-muted',
        floating: 'shadow-lg hover:shadow-2xl bg-card border-border',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      animation: {
        none: '',
        hover: 'hover:scale-[1.02] hover:-translate-y-1',
        float: 'hover:animate-float',
        tilt: 'hover:rotate-1 hover:scale-105',
        glow: 'hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'hover',
    },
  }
);

interface AnimatedCardProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof cardVariants> {
  spotlight?: boolean;
  shimmer?: boolean;
  borderGlow?: boolean;
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, variant, size, animation, spotlight = false, shimmer = false, borderGlow = false, children, ...props }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      if (spotlight) {
        const rect = event.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    };

    return (
      <motion.div
        className={cn(cardVariants({ variant, size, animation, className }))}
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{
          scale: animation === 'hover' ? 1.02 : 1,
          y: animation === 'hover' ? -4 : 0,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Spotlight Effect */}
        {spotlight && (
          <motion.div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(251,146,60,0.1), transparent)`,
            }}
          />
        )}

        {/* Shimmer Effect */}
        {shimmer && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0"
            animate={isHovered ? { x: ['100%', '-100%'], opacity: [0, 1, 0] } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        )}

        {/* Border Glow */}
        {borderGlow && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-orange-400/0 transition-all duration-300"
            animate={isHovered ? { borderColor: 'rgba(251,146,60,0.5)' } : {}}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children as React.ReactNode}
        </div>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

const AnimatedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
AnimatedCardHeader.displayName = 'AnimatedCardHeader';

const AnimatedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
AnimatedCardTitle.displayName = 'AnimatedCardTitle';

const AnimatedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
AnimatedCardDescription.displayName = 'AnimatedCardDescription';

const AnimatedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
AnimatedCardContent.displayName = 'AnimatedCardContent';

const AnimatedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
AnimatedCardFooter.displayName = 'AnimatedCardFooter';

export {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardFooter,
  AnimatedCardTitle,
  AnimatedCardDescription,
  AnimatedCardContent,
  cardVariants,
};
export type { AnimatedCardProps };
