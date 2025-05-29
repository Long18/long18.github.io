'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
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
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const debounce = useCallback((fn: () => void, delay: number = 40) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(fn, delay);
  }, []);

  useGSAP(() => {
    const updateActiveIndicator = () => {
      // Only update indicator for desktop
      if (isMobile) return;

      const activeButton = navItemsRef.current[activeSection];
      if (
        activeButton &&
        activeIndicatorRef.current &&
        navContainerRef.current
      ) {
        try {
          const buttonRect = activeButton.getBoundingClientRect();
          const navRect = navContainerRef.current.getBoundingClientRect();
          if (navRect && buttonRect.width > 0 && navRect.width > 0) {
            const leftPosition = buttonRect.left - navRect.left;
            gsap.to(activeIndicatorRef.current, {
              x: leftPosition,
              width: buttonRect.width,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        } catch (error) {
          console.warn('Navigation indicator animation error:', error);
        }
      }
    };

    updateActiveIndicator();

    const cleanupFunctions: (() => void)[] = [];
    Object.values(navItemsRef.current).forEach((btn) => {
      if (btn) {
        const handleMouseEnter = () => {
          if (!isMobile) {
            gsap.killTweensOf(btn);
            gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
          }
        };
        const handleMouseLeave = () => {
          if (!isMobile) {
            gsap.killTweensOf(btn);
            gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
          }
        };
        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);
        cleanupFunctions.push(() => {
          btn.removeEventListener('mouseenter', handleMouseEnter);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        });
      }
    });

    const handleResize = () => debounce(updateActiveIndicator, 0);
    window.addEventListener('resize', handleResize);

    let observer: ResizeObserver | null = null;
    if (navContainerRef.current) {
      observer = new ResizeObserver(() => debounce(updateActiveIndicator, 0));
      observer.observe(navContainerRef.current);
    }

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
      if (activeIndicatorRef.current) {
        gsap.killTweensOf(activeIndicatorRef.current);
      }
    };
  }, [activeSection, debounce, isMobile]);

  return (
    <nav className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-30 transition-all duration-300">
      <div
        ref={navContainerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <div
            ref={activeIndicatorRef}
            className="absolute bottom-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg shadow-orange-400/30"
            style={{ width: 0 }}
          />
          <ul className="flex space-x-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  ref={(el) => {
                    navItemsRef.current[item.id] = el;
                  }}
                  onClick={() => onSectionChange(item.id)}
                  aria-label={`Navigate to ${item.label} section`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`
                    relative px-6 py-4 text-sm font-medium tab-button
                    transition-all duration-200 ease-out
                    ${
                      activeSection === item.id
                        ? 'text-orange-400 bg-gray-800/50'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
                    rounded-lg
                  `}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between py-3">
          {/* Current Section Display */}
          <div className="flex items-center space-x-2">
            <span className="text-orange-400 text-sm font-medium">
              {navigationItems.find((item) => item.id === activeSection)?.label}
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-800/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-200 ${
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
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 transition-all duration-300 ease-out ${
            isMobileMenuOpen
              ? 'opacity-100 transform translate-y-0 visible'
              : 'opacity-0 transform -translate-y-2 invisible'
          }`}
        >
          <ul className="py-2 px-4 space-y-1">
            {navigationItems.map((item, index) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3 text-base font-medium rounded-lg
                    transition-all duration-200 ease-out
                    ${
                      activeSection === item.id
                        ? 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                    }
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400
                    focus-visible:ring-inset
                  `}
                  style={{
                    animationDelay: isMobileMenuOpen
                      ? `${index * 50}ms`
                      : '0ms',
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
