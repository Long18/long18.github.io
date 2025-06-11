'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="relative font-sans">
      {/* Desktop Navigation - Professional Game Developer Style */}
      <div className="hidden md:block">
        <ul className="flex space-x-6 lg:space-x-8 xl:space-x-10 text-white-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                className={`relative py-3 px-4 text-sm lg:text-base xl:text-lg font-medium transition-all duration-300 hover:text-orange-yellow-crayola hover:scale-105 focus:outline-none focus:text-orange-yellow-crayola group ${
                  activeSection === item.id
                    ? 'text-orange-yellow-crayola font-semibold'
                    : 'text-white-2'
                }`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="tracking-wide">{item.label}</span>
                </span>

                {/* Active indicator background */}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-yellow-crayola/15 to-vegas-gold/15 rounded-xl border border-orange-yellow-crayola/40 shadow-lg"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-orange-yellow-crayola/8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Bottom indicator line */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-orange-yellow-crayola to-vegas-gold rounded-full transition-all duration-300 ${
                  activeSection === item.id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-75 group-hover:scale-x-100'
                }`} />

                {/* Top accent line for active state */}
                {activeSection === item.id && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-yellow-crayola to-transparent rounded-full"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation - Enhanced Professional Design */}
      <div className="md:hidden" ref={mobileMenuRef}>
        {/* Mobile Menu Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-xl text-white-1 hover:text-orange-yellow-crayola hover:bg-orange-yellow-crayola/10 focus:outline-none focus:ring-2 focus:ring-orange-yellow-crayola/30 transition-all duration-300 group shadow-lg hover:shadow-orange-yellow-crayola/20"
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

        {/* Mobile Menu Dropdown - Professional Portfolio Style */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-16 w-64 bg-eerie-black-2/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-jet/50 z-50"
            >
              {/* Menu Header */}
              <div className="px-4 py-3 border-b border-jet/30 mb-3">
                <h3 className="text-white-1 text-base font-bold">Portfolio Navigation</h3>
                <p className="text-white-2 text-sm mt-1">Game Developer • William</p>
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
                      onClick={() => handleNavClick(item.id)}
                      className={`block w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                        activeSection === item.id
                          ? 'text-orange-yellow-crayola bg-orange-yellow-crayola/15 border border-orange-yellow-crayola/30 font-semibold shadow-lg'
                          : 'text-white-2 hover:text-orange-yellow-crayola hover:bg-jet/50'
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
                            className="w-2 h-2 bg-orange-yellow-crayola rounded-full shadow-lg"
                          />
                        )}
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>

              {/* Menu Footer */}
              <div className="px-4 py-3 border-t border-jet/30 mt-4">
                <p className="text-white-2 text-xs text-center">
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
