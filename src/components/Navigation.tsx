'use client';

import { useRef, useCallback } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' }
];

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const activeIndicatorRef = useRef<HTMLDivElement>(null);
  // Use a map for refs to avoid index mismatch
  const navItemsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement>(null);
  // Stable debounce timer
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Stable debounce function
  const debounce = useCallback((fn: () => void, delay: number = 40) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(fn, delay);
  }, []);

  // GSAP animations for navigation
  useGSAP(() => {
    // Function to update active indicator position
    const updateActiveIndicator = () => {
      const activeButton = navItemsRef.current[activeSection];
      if (activeButton && activeIndicatorRef.current && navContainerRef.current) {
        try {
          const buttonRect = activeButton.getBoundingClientRect();
          const navRect = navContainerRef.current.getBoundingClientRect();
          if (navRect && buttonRect.width > 0 && navRect.width > 0) {
            const leftPosition = buttonRect.left - navRect.left;
            const width = buttonRect.width;
            gsap.killTweensOf(activeIndicatorRef.current);
            gsap.to(activeIndicatorRef.current, {
              x: leftPosition,
              width: width,
              duration: 0.4,
              ease: 'power2.out'
            });
          }
        } catch (error) {
          console.warn('Navigation indicator animation error:', error);
        }
      }
    };

    // Initial update
    debounce(updateActiveIndicator, 0);

    // Setup hover animations for nav items
    const cleanupFunctions: (() => void)[] = [];
    navItemsRef.current = {};
    navigationItems.forEach((item) => {
      const btn = navItemsRef.current[item.id];
      if (btn) {
        const handleMouseEnter = () => {
          gsap.killTweensOf(btn);
          gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
        };
        const handleMouseLeave = () => {
          gsap.killTweensOf(btn);
          gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        };
        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);
        cleanupFunctions.push(() => {
          btn.removeEventListener('mouseenter', handleMouseEnter);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        });
      }
    });

    // Handle window resize to recalculate indicator position
    const handleResize = () => debounce(updateActiveIndicator, 0);
    window.addEventListener('resize', handleResize);

    // Use a single ResizeObserver for nav container
    let observer: ResizeObserver | null = null;
    if (navContainerRef.current) {
      observer = new ResizeObserver(() => debounce(updateActiveIndicator, 0));
      observer.observe(navContainerRef.current);
    }

    // Cleanup function
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      cleanupFunctions.forEach(cleanup => cleanup());
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (activeIndicatorRef.current) {
        gsap.killTweensOf(activeIndicatorRef.current);
      }
      // Clean up GSAP tweens for all nav buttons
      Object.values(navItemsRef.current).forEach(btn => {
        if (btn) gsap.killTweensOf(btn);
      });
    };
  }, [activeSection]);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-30">
      <div ref={navContainerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Active indicator background */}
        <div
          ref={activeIndicatorRef}
          className="absolute bottom-0 h-0.5 bg-orange-400" // Removed transition-none
          style={{ width: 0 }}
        />
        <ul className="flex space-x-0">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                ref={(el) => { navItemsRef.current[item.id] = el; }}
                onClick={() => onSectionChange(item.id)}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`
                  relative px-6 py-4 text-sm font-medium
                  ${activeSection === item.id 
                    ? 'text-orange-400' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}