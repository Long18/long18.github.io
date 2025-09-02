'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';

const textVariants = cva(
  'transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        gradient: 'bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent',
        neon: 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]',
        glow: 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]',
        rainbow: 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent',
        shimmer: 'bg-gradient-to-r from-orange-400 via-white via-orange-400 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
      },
      animation: {
        none: '',
        fadeIn: '',
        slideUp: '',
        slideDown: '',
        slideLeft: '',
        slideRight: '',
        scale: '',
        bounce: '',
        typewriter: '',
        wave: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'base',
      weight: 'normal',
      animation: 'fadeIn',
    },
  }
);

interface AnimatedTextProps
  extends Omit<HTMLMotionProps<'span'>, 'size'>,
    VariantProps<typeof textVariants> {
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  typewriterSpeed?: number;
  typewriterDelay?: number;
  staggerChildren?: boolean;
  waveDuration?: number;
}

const AnimatedText = React.forwardRef<HTMLElement, AnimatedTextProps>(
  ({
    className,
    variant,
    size,
    weight,
    animation,
    as = 'span',
    typewriterSpeed = 50,
    typewriterDelay = 0,
    staggerChildren = false,
    waveDuration = 2,
    children,
    ...props
  }) => {
    const [displayText, setDisplayText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const text = typeof children === 'string' ? children : '';

    // Typewriter effect
    React.useEffect(() => {
      if (animation === 'typewriter' && text) {
        const timer = setTimeout(() => {
          if (currentIndex < text.length) {
            setDisplayText(text.slice(0, currentIndex + 1));
            setCurrentIndex(currentIndex + 1);
          }
        }, currentIndex === 0 ? typewriterDelay : typewriterSpeed);

        return () => clearTimeout(timer);
      }
    }, [animation, text, currentIndex, typewriterSpeed, typewriterDelay]);

    // Animation variants
    const getAnimationVariants = () => {
      switch (animation) {
        case 'fadeIn':
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.6 }
          };
        case 'slideUp':
          return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          };
        case 'slideDown':
          return {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 }
          };
        case 'slideLeft':
          return {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6 }
          };
        case 'slideRight':
          return {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.6 }
          };
        case 'scale':
          return {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.6 }
          };
        case 'bounce':
          return {
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, type: 'spring', bounce: 0.4 }
          };
        default:
          return {
            initial: { opacity: 1 },
            animate: { opacity: 1 }
          };
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionComponent = motion[as as keyof typeof motion] as any;

    // Wave animation for individual characters
    if (animation === 'wave' && staggerChildren && typeof children === 'string') {
      return (
        <MotionComponent
          className={cn(textVariants({ variant, size, weight, className }))}
          {...props}
        >
          {children.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: waveDuration,
                repeat: Infinity,
                delay: index * 0.1,
                ease: 'easeInOut'
              }}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </MotionComponent>
      );
    }

    // Staggered children animation
    if (staggerChildren && typeof children === 'string') {
      return (
        <MotionComponent
          className={cn(textVariants({ variant, size, weight, className }))}
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          {...props}
        >
          {children.split('').map((char, index) => (
            <motion.span
              key={index}
              variants={{
                initial: getAnimationVariants().initial,
                animate: getAnimationVariants().animate
              }}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </MotionComponent>
      );
    }

    return (
      <MotionComponent
        className={cn(textVariants({ variant, size, weight, className }))}
        {...getAnimationVariants()}
        {...props}
      >
        {animation === 'typewriter' ? displayText : children}
        {animation === 'typewriter' && currentIndex < text.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          >
            |
          </motion.span>
        )}
      </MotionComponent>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

export { AnimatedText, textVariants };
export type { AnimatedTextProps };
