import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Animation Utilities for Portfolio Website
 * Collection of reusable animation functions for consistent UI motion
 */

// ========== ENTRANCE ANIMATIONS ==========

/**
 * Fade in from bottom animation
 */
export const fadeInUp = (
  element: HTMLElement | string,
  options: {
    duration?: number;
    delay?: number;
    y?: number;
    stagger?: number;
    ease?: string;
  } = {}
) => {
  const { duration = 0.8, delay = 0, y = 40, stagger = 0, ease = 'power2.out' } = options;
  
  return gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Fade in from left animation
 */
export const fadeInLeft = (
  element: HTMLElement | string,
  options: {
    duration?: number;
    delay?: number;
    x?: number;
    stagger?: number;
    ease?: string;
  } = {}
) => {
  const { duration = 0.8, delay = 0, x = -40, stagger = 0, ease = 'power2.out' } = options;
  
  return gsap.fromTo(
    element,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Fade in from right animation
 */
export const fadeInRight = (
  element: HTMLElement | string,
  options: {
    duration?: number;
    delay?: number;
    x?: number;
    stagger?: number;
    ease?: string;
  } = {}
) => {
  const { duration = 0.8, delay = 0, x = 40, stagger = 0, ease = 'power2.out' } = options;
  
  return gsap.fromTo(
    element,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (
  element: HTMLElement | string,
  options: {
    duration?: number;
    delay?: number;
    scale?: number;
    stagger?: number;
    ease?: string;
  } = {}
) => {
  const { duration = 0.6, delay = 0, scale = 0.8, stagger = 0, ease = 'back.out(1.7)' } = options;
  
  return gsap.fromTo(
    element,
    { opacity: 0, scale },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger,
      ease,
    }
  );
};

// ========== SCROLL-TRIGGERED ANIMATIONS ==========

/**
 * Reveal on scroll animation
 */
export const revealOnScroll = (
  element: HTMLElement | string,
  options: {
    trigger?: string | HTMLElement;
    start?: string;
    end?: string;
    scrub?: boolean;
    once?: boolean;
    animation?: 'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scale';
    duration?: number;
    stagger?: number;
  } = {}
) => {
  const {
    trigger,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    once = true,
    animation = 'fadeUp',
    duration = 0.8,
    stagger = 0.1,
  } = options;

  let animationProps;
  let fromProps;

  switch (animation) {
    case 'fadeLeft':
      fromProps = { opacity: 0, x: -40 };
      animationProps = { opacity: 1, x: 0 };
      break;
    case 'fadeRight':
      fromProps = { opacity: 0, x: 40 };
      animationProps = { opacity: 1, x: 0 };
      break;
    case 'scale':
      fromProps = { opacity: 0, scale: 0.8 };
      animationProps = { opacity: 1, scale: 1 };
      break;
    default: // fadeUp
      fromProps = { opacity: 0, y: 40 };
      animationProps = { opacity: 1, y: 0 };
  }

  gsap.set(element, fromProps);

  return gsap.to(element, {
    ...animationProps,
    duration,
    stagger,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: trigger || element,
      start,
      end,
      scrub,
      once,
    },
  });
};

// ========== INTERACTIVE ANIMATIONS ==========

/**
 * Button hover animation
 */
export const buttonHover = (element: HTMLElement | string) => {
  const btn = typeof element === 'string' ? document.querySelector(element) : element;
  if (!btn) return;

  const tl = gsap.timeline({ paused: true });
  
  tl.to(btn, {
    scale: 1.05,
    duration: 0.2,
    ease: 'power2.out',
  })
  .to(btn, {
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    duration: 0.2,
    ease: 'power2.out',
  }, '<');

  btn.addEventListener('mouseenter', () => tl.play());
  btn.addEventListener('mouseleave', () => tl.reverse());

  return tl;
};

/**
 * Card hover animation
 */
export const cardHover = (element: HTMLElement | string) => {
  const card = typeof element === 'string' ? document.querySelector(element) : element;
  if (!card) return;

  const tl = gsap.timeline({ paused: true });
  
  tl.to(card, {
    y: -8,
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
  })
  .to(card, {
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    duration: 0.3,
    ease: 'power2.out',
  }, '<');

  card.addEventListener('mouseenter', () => tl.play());
  card.addEventListener('mouseleave', () => tl.reverse());

  return tl;
};

// ========== NAVIGATION ANIMATIONS ==========

/**
 * Mobile menu reveal animation
 */
export const mobileMenuReveal = (
  menuElement: HTMLElement | string,
  overlayElement?: HTMLElement | string
) => {
  const menu = typeof menuElement === 'string' ? document.querySelector(menuElement) : menuElement;
  const overlay = overlayElement ? 
    (typeof overlayElement === 'string' ? document.querySelector(overlayElement) : overlayElement) : 
    null;

  if (!menu) return;

  const tl = gsap.timeline({ paused: true });

  // Set initial state
  gsap.set(menu, { x: '100%' });
  if (overlay) gsap.set(overlay, { opacity: 0 });

  // Animation sequence
  if (overlay) {
    tl.to(overlay, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  tl.to(menu, {
    x: '0%',
    duration: 0.4,
    ease: 'power3.out',
  }, overlay ? '<0.1' : 0);

  // Animate menu items
  const menuItems = menu.querySelectorAll('li, a, .menu-item');
  if (menuItems.length > 0) {
    gsap.set(menuItems, { opacity: 0, x: 20 });
    tl.to(menuItems, {
      opacity: 1,
      x: 0,
      duration: 0.3,
      stagger: 0.1,
      ease: 'power2.out',
    }, '-=0.2');
  }

  return tl;
};

/**
 * Desktop navigation animation
 */
export const navItemsReveal = (element: HTMLElement | string) => {
  const navItems = typeof element === 'string' ? 
    document.querySelectorAll(element) : 
    [element];

  return gsap.fromTo(
    navItems,
    { opacity: 0, y: -20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.2,
    }
  );
};

// ========== PROJECT/PORTFOLIO ANIMATIONS ==========

/**
 * Project filter animation
 */
export const filterAnimation = (
  hideElements: HTMLElement[],
  showElements: HTMLElement[],
  options: {
    duration?: number;
    stagger?: number;
  } = {}
) => {
  const { duration = 0.4, stagger = 0.05 } = options;
  
  const tl = gsap.timeline();

  // Hide elements first
  if (hideElements.length > 0) {
    tl.to(hideElements, {
      opacity: 0,
      scale: 0.8,
      y: 20,
      duration,
      stagger,
      ease: 'power2.in',
    });
  }

  // Show new elements
  if (showElements.length > 0) {
    tl.fromTo(
      showElements,
      { opacity: 0, scale: 0.8, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration,
        stagger,
        ease: 'back.out(1.7)',
      },
      hideElements.length > 0 ? '-=0.2' : 0
    );
  }

  return tl;
};

/**
 * Project card animation on scroll
 */
export const projectCardScroll = (element: HTMLElement | string) => {
  return revealOnScroll(element, {
    animation: 'scale',
    duration: 0.6,
    stagger: 0.2,
    start: 'top 85%',
  });
};

// ========== LOADING ANIMATIONS ==========

/**
 * Loading overlay animation
 */
export const loadingAnimation = (
  loaderElement: HTMLElement | string,
  progressElement?: HTMLElement | string
) => {
  const loader = typeof loaderElement === 'string' ? 
    document.querySelector(loaderElement) : loaderElement;
  const progress = progressElement ? 
    (typeof progressElement === 'string' ? document.querySelector(progressElement) : progressElement) :
    null;

  if (!loader) return;

  const tl = gsap.timeline();

  // Progress bar animation if provided
  if (progress) {
    tl.fromTo(progress, 
      { scaleX: 0 },
      { 
        scaleX: 1, 
        duration: 2, 
        ease: 'power2.out',
        transformOrigin: 'left center'
      }
    );
  }

  // Loader fade out
  tl.to(loader, {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  })
  .to(loader, {
    display: 'none',
    duration: 0,
  });

  return tl;
};

/**
 * Page load animation
 */
export const pageLoadAnimation = () => {
  const tl = gsap.timeline();

  // Animate main content
  tl.fromTo(
    'main, .main-content',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
    }
  );

  return tl;
};

// ========== UTILITY FUNCTIONS ==========

/**
 * Kill all ScrollTrigger instances
 */
export const killScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Refresh ScrollTrigger (useful for layout changes)
 */
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

/**
 * Create a parallax effect
 */
export const parallaxEffect = (
  element: HTMLElement | string,
  options: {
    speed?: number;
    trigger?: string | HTMLElement;
  } = {}
) => {
  const { speed = 0.5, trigger } = options;

  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: trigger || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

/**
 * Text reveal animation (typing effect)
 */
export const textReveal = (
  element: HTMLElement | string,
  options: {
    duration?: number;
    delay?: number;
    ease?: string;
  } = {}
) => {
  const { duration = 1, delay = 0, ease = 'power2.out' } = options;
  
  return gsap.fromTo(
    element,
    { 
      opacity: 0,
      clipPath: 'inset(0 100% 0 0)'
    },
    {
      opacity: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration,
      delay,
      ease,
    }
  );
};

// ========== PRESET TIMELINE ANIMATIONS ==========

/**
 * Hero section entrance animation
 */
export const heroEntranceAnimation = (elements: {
  greeting?: HTMLElement;
  name?: HTMLElement;
  title?: HTMLElement;
  subtitle?: HTMLElement;
  buttons?: HTMLElement[];
  social?: HTMLElement[];
  avatar?: HTMLElement;
}) => {
  const tl = gsap.timeline();

  if (elements.greeting) {
    tl.fromTo(elements.greeting,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
    );
  }

  if (elements.name) {
    tl.fromTo(elements.name,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    );
  }

  if (elements.title) {
    tl.fromTo(elements.title,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.4'
    );
  }

  if (elements.subtitle) {
    tl.fromTo(elements.subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    );
  }

  if (elements.buttons && elements.buttons.length > 0) {
    tl.fromTo(elements.buttons,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
      '-=0.3'
    );
  }

  if (elements.social && elements.social.length > 0) {
    tl.fromTo(elements.social,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' },
      '-=0.3'
    );
  }

  if (elements.avatar) {
    tl.fromTo(elements.avatar,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' },
      '-=0.8'
    );
  }

  return tl;
};

const animations = {
  // Entrance animations
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  
  // Scroll animations
  revealOnScroll,
  projectCardScroll,
  parallaxEffect,
  
  // Interactive animations
  buttonHover,
  cardHover,
  
  // Navigation animations
  mobileMenuReveal,
  navItemsReveal,
  
  // Project animations
  filterAnimation,
  
  // Loading animations
  loadingAnimation,
  pageLoadAnimation,
  
  // Text animations
  textReveal,
  
  // Preset animations
  heroEntranceAnimation,
  
  // Utilities
  killScrollTriggers,
  refreshScrollTrigger,
};

export default animations;