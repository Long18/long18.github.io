'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({
  activeSection,
  onSectionChange,
}: NavigationProps) {
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Performance hook integration
  const { performanceMode } = useAnimationPerformance();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Performance-aware animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration:
          performanceMode === 'low'
            ? 0.2
            : performanceMode === 'medium'
            ? 0.3
            : 0.4,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: performanceMode === 'low' ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: performanceMode === 'low' ? 0.2 : 0.3,
        ease: 'easeOut',
      },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: {
        duration: performanceMode === 'low' ? 0.15 : 0.3,
        ease: 'easeIn',
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: performanceMode === 'low' ? 0.2 : 0.3,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: performanceMode === 'low' ? 0 : 0.05,
      },
    },
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-eerie-black-2/60 backdrop-blur-xl border-b border-jet/30 sticky top-0 z-30 transition-all duration-300 relative"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-eerie-black-2/40 via-eerie-black-1/30 to-eerie-black-2/40 pointer-events-none" />
      <div
        ref={navContainerRef}
        className="w-full mx-auto px-3 sm:px-4 lg:px-6 relative z-10"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <div
            ref={activeIndicatorRef}
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-400 shadow-lg shadow-orange-400/40"
            style={{ width: 0 }}
          />
          <ul className="flex space-x-0.5 lg:space-x-1">
            {navigationItems.map((item) => (
              <motion.li key={item.id} variants={itemVariants}>
                <motion.button
                  ref={(el) => {
                    navItemsRef.current[item.id] = el;
                  }}
                  onClick={() => onSectionChange(item.id)}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  whileHover={performanceMode !== 'low' ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: performanceMode === 'low' ? 0.1 : 0.2,
                    ease: 'easeOut',
                  }}
                  className={`
                    relative px-3 sm:px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-medium tab-button
                    transition-all duration-200 ease-out
                    ${
                      activeSection === item.id
                        ? 'text-orange-400 bg-eerie-black-1/60'
                        : 'text-white-2 hover:text-white-1 hover:bg-eerie-black-1/40'
                    }
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    focus-visible:ring-offset-2 focus-visible:ring-offset-eerie-black-2
                    rounded-lg
                  `}
                >
                  {item.label}
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-2.5">
          {/* Current Section Display */}
          <div className="flex items-center space-x-2">
            <span className="text-orange-400 text-xs sm:text-sm font-medium">
              {navigationItems.find((item) => item.id === activeSection)?.label}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-white-2 hover:text-white-1 transition-colors duration-200 rounded-lg hover:bg-eerie-black-1/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                isMobileMenuOpen ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 bg-eerie-black-2/98 backdrop-blur-md border-b border-jet/60 shadow-lg"
          >
            <ul className="py-2 px-3 space-y-1">
              {navigationItems.map((item) => (
                <motion.li key={item.id} variants={itemVariants}>
                  <motion.button
                    onClick={() => {
                      onSectionChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg
                      transition-all duration-200 ease-out
                      ${
                        activeSection === item.id
                          ? 'text-orange-400 bg-orange-400/15 border border-orange-400/25'
                          : 'text-white-2 hover:text-white-1 hover:bg-eerie-black-1/40'
                      }
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                      focus-visible:ring-inset
                    `}
                  >
                    {item.label}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
