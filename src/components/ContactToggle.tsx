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

const ContactToggle: React.FC<ContactToggleProps> = ({
  isOpen,
  onToggle,
  children,
}) => {
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

  // Touch/swipe gesture handling
  useEffect(() => {
    let startY = 0;
    let startTime = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isDragging = false;

      // Check if touch started on the panel (including drag indicator)
      const target = e.target as HTMLElement;
      const panel = document.querySelector('[role="dialog"]');
      const dragIndicator = document.querySelector('.drag-indicator');

      // Allow dragging from anywhere in the panel or drag indicator
      if (
        (panel && panel.contains(target)) ||
        (dragIndicator && dragIndicator.contains(target))
      ) {
        isDragging = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !isOpen) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      // Only allow downward swipe
      if (diff > 0) {
        e.preventDefault(); // Prevent page scroll
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isOpen || !isDragging) return;

      const endY = e.changedTouches[0].clientY;
      const diff = endY - startY;
      const time = Date.now() - startTime;

      // If swipe down distance > 50px and time < 1000ms, close panel
      if (diff > 50 && time < 1000) {
        onToggle();
      }

      isDragging = false;
    };

    if (isOpen) {
      document.addEventListener('touchstart', handleTouchStart, {
        passive: false,
      });
      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
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
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
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
          duration: 0.5,
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
          boxShadow: '0 -10px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        {/* Drag indicator */}
        <div
          className="drag-indicator w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4 cursor-pointer"
          onClick={onToggle}
        ></div>

        {children}
      </motion.aside>
    </>
  );
};

export default ContactToggle;
