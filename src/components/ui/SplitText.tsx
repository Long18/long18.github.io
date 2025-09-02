'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'blur' | 'rotate';
  stagger?: number;
  trigger?: 'hover' | 'visible' | 'immediate';
  once?: boolean;
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  animation = 'fade-up',
  stagger = 0.05,
  trigger = 'visible',
  once = true,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const shouldAnimate = trigger === 'immediate' || (trigger === 'visible' && isVisible) || (trigger === 'hover' && isVisible);

  useEffect(() => {
    if (trigger === 'immediate') {
      setIsVisible(true);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasTriggered)) {
          setIsVisible(true);
          if (once) setHasTriggered(true);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [trigger, once, hasTriggered]);

  const getAnimationStyles = (index: number) => {
    const animationDelay = delay + (index * stagger);

    const baseStyles = {
      display: 'inline-block',
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${animationDelay}s`,
    };

    if (!shouldAnimate) {
      switch (animation) {
        case 'fade-up':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(20px)',
          };
        case 'fade-in':
          return {
            ...baseStyles,
            opacity: 0,
          };
        case 'slide-left':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-20px)',
          };
        case 'slide-right':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(20px)',
          };
        case 'scale':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.8)',
          };
        case 'blur':
          return {
            ...baseStyles,
            opacity: 0,
            filter: 'blur(4px)',
          };
        case 'rotate':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'rotate(-10deg) scale(0.9)',
          };
        default:
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(20px)',
          };
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1) rotate(0)',
      filter: 'blur(0px)',
    };
  };

  const renderText = () => {
    // Split by words and then by characters within each word
    const words = children.split(' ');
    let charIndex = 0;

    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block">
        {word.split('').map((char, charInWordIndex) => {
          const currentCharIndex = charIndex++;
          return (
            <span
              key={`${wordIndex}-${charInWordIndex}`}
              style={getAnimationStyles(currentCharIndex)}
              className="inline-block"
            >
              {char}
            </span>
          );
        })}
        {wordIndex < words.length - 1 && (
          <span
            style={getAnimationStyles(charIndex++)}
            className="inline-block"
          >
            &nbsp;
          </span>
        )}
      </span>
    ));
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderText()}
    </span>
  );
};

// Preset components for common use cases
export const SplitTextHero: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <SplitText
    className={`text-hero font-bold ${className}`}
    animation="fade-up"
    duration={0.8}
    stagger={0.03}
    delay={0.2}
  >
    {children}
  </SplitText>
);

export const SplitTextDisplay: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <SplitText
    className={`text-display font-bold ${className}`}
    animation="scale"
    duration={0.6}
    stagger={0.04}
    delay={0.1}
  >
    {children}
  </SplitText>
);

export const SplitTextHeading: React.FC<{ children: string; className?: string; level?: 1 | 2 | 3 }> = ({
  children,
  className = '',
  level = 2
}) => {
  const levelClass = level === 1 ? 'text-h1' : level === 2 ? 'text-h2' : 'text-h3';

  return (
    <SplitText
      className={`${levelClass} font-semibold ${className}`}
      animation="slide-left"
      duration={0.5}
      stagger={0.02}
    >
      {children}
    </SplitText>
  );
};

export const SplitTextBody: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <SplitText
    className={`text-body ${className}`}
    animation="fade-in"
    duration={0.4}
    stagger={0.01}
    delay={0.3}
  >
    {children}
  </SplitText>
);

export const SplitTextButton: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => (
  <SplitText
    className={className}
    animation="blur"
    duration={0.3}
    stagger={0.02}
    trigger="hover"
    once={false}
  >
    {children}
  </SplitText>
);

// Advanced split text with word-by-word animation
export const SplitTextWords: React.FC<{
  children: string;
  className?: string;
  animation?: SplitTextProps['animation'];
  stagger?: number;
  duration?: number;
}> = ({
  children,
  className = '',
  animation = 'fade-up',
  stagger = 0.1,
  duration = 0.6
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const getWordStyles = (index: number) => {
    const animationDelay = index * stagger;

    const baseStyles = {
      display: 'inline-block',
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${animationDelay}s`,
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(30px)',
          };
        case 'scale':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'scale(0.8)',
          };
        case 'slide-left':
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateX(-30px)',
          };
        default:
          return {
            ...baseStyles,
            opacity: 0,
            transform: 'translateY(30px)',
          };
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'translateY(0) translateX(0) scale(1)',
    };
  };

  return (
    <span ref={containerRef} className={className}>
      {children.split(' ').map((word, index) => (
        <React.Fragment key={index}>
          <span style={getWordStyles(index)} className="inline-block">
            {word}
          </span>
          {index < children.split(' ').length - 1 && ' '}
        </React.Fragment>
      ))}
    </span>
  );
};
