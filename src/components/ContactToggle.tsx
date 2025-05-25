// filepath: src/components/ContactToggle.tsx
'use client';

import React, { useEffect } from 'react';
import { cn } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const ContactToggle: React.FC<ContactToggleProps> = ({ isOpen, onToggle, children }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Toggle Button (visible on mobile only) */}
      <button
        className={cn(
          'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden flex items-center gap-2',
          'px-4 py-2.5 sm:px-5 sm:py-3',
          'rounded-full',
          'bg-gradient-to-r from-orange-400 to-orange-500',
          'text-white font-medium sm:font-semibold text-sm sm:text-base',
          'shadow-lg shadow-orange-500/20',
          'transition-all duration-300 transform hover:scale-105 active:scale-95',
          'w-auto max-w-xs',
          isOpen ? 'bg-orange-500 rotate-180' : 'bg-orange-400'
        )}
        onClick={onToggle}
        aria-label={isOpen ? 'Hide Contacts' : 'Show Contacts'}
      >
        <svg 
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {isOpen ? 'Hide Contacts' : 'Show Contacts'}
      </button>

      {/* Backdrop with blur effect */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sliding Panel with animation */}
      <motion.aside
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 300,
          duration: 0.5 
        }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50',
          'bg-gray-900 rounded-t-2xl shadow-2xl',
          'p-4 sm:p-5 md:p-6',
          'md:hidden',
          'max-h-[80vh] overflow-y-auto overscroll-contain'
        )}
        style={{ 
          minHeight: '40vh',
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        {/* Drag indicator */}
        <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4"></div>
        
        {children}
      </motion.aside>
    </>
  );
};

export default ContactToggle;
