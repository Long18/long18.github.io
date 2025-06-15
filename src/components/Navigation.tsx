'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  isExternal?: boolean;
  href?: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'blog', label: 'Blog', isExternal: true, href: '/blog' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({
  activeSection,
  onSectionChange,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  const handleNavClick = (sectionId: string, href?: string) => {
    if (href) {
      // External link - navigate to different page
      window.location.href = href;
    } else {
      // Internal section - use section navigation
      onSectionChange(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative font-sans">
      {/* Glass Desktop Navigation - Liquid Glass Style */}
      <div className="hidden md:block">
        <div className="glass-nav px-6 py-3">
          <ul className="flex space-x-2 lg:space-x-4 xl:space-x-6">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id, item.href)}
                  className={`glass-nav-item relative text-sm lg:text-base font-medium transition-all duration-300 hover:scale-105 focus:outline-none group ${
                    activeSection === item.id
                      ? 'active text-glass-accent'
                      : 'text-glass-text-secondary hover:text-glass-text-primary'
                  }`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span className="tracking-wide">{item.label}</span>
                  </span>

                  {/* Glass active indicator background */}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeGlassTab"
                      className="absolute inset-0 glass-primary rounded-xl border border-glass-accent/30 shadow-glass-md"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Glass hover effect */}
                  <div className="absolute inset-0 glass-tertiary rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Glass glow effect for active state */}
                  {activeSection === item.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 rounded-xl shadow-glass-glow"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced Professional Design */}
      <div className="md:hidden" ref={mobileMenuRef}>
        {/* Glass Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="glass-btn p-3 text-glass-text-primary hover:text-glass-accent focus:outline-none focus:ring-2 focus:ring-glass-accent/30 transition-all duration-300 group shadow-glass-md hover:shadow-glass-glow"
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="relative w-6 h-6">
            <span
              className={`absolute top-1 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}
            />
            <span
              className={`absolute top-3 left-0 w-6 h-0.5 bg-current transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute top-5 left-0 w-6 h-0.5 bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            />
          </div>
        </motion.button>

        {/* Glass Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-16 w-64 glass-modal rounded-2xl p-4 shadow-glass-xl border border-glass-border z-50"
            >
              {/* Glass Menu Header */}
              <div className="px-4 py-3 border-b border-glass-border mb-3">
                <h3 className="text-glass-text-primary text-base font-bold">Portfolio Navigation</h3>
                <p className="text-glass-text-secondary text-sm mt-1">Game Developer • William</p>
              </div>

              <ul className="space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleNavClick(item.id, item.href)}
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        activeSection === item.id
                          ? 'text-glass-accent glass-primary border border-glass-accent/30 font-semibold shadow-glass-md'
                          : 'text-glass-text-secondary hover:text-glass-accent hover:glass-tertiary'
                      }`}
                      aria-current={activeSection === item.id ? 'page' : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-base tracking-wide">{item.label}</span>
                        </div>
                        {activeSection === item.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="w-2 h-2 bg-glass-accent rounded-full shadow-glass-glow"
                          />
                        )}
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Menu Footer */}
              <div className="px-4 py-3 border-t border-border/30 mt-4">
                <p className="text-portfolio-text-secondary text-xs text-center">
                  © 2024 • Game Development Portfolio
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
