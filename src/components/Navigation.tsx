'use client';

import { useRef } from 'react';
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
  const navItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // GSAP animations for navigation
  useGSAP(() => {
    // Animate active indicator to the current active section
    const activeButton = navItemsRef.current.find((btn, index) => 
      btn && navigationItems[index].id === activeSection
    );
    
    if (activeButton && activeIndicatorRef.current) {
      const buttonRect = activeButton.getBoundingClientRect();
      const navRect = activeButton.closest('nav')?.getBoundingClientRect();
      
      if (navRect) {
        const leftPosition = buttonRect.left - navRect.left;
        const width = buttonRect.width;
        
        gsap.to(activeIndicatorRef.current, {
          x: leftPosition,
          width: width,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }

    // Animate nav items on hover
    navItemsRef.current.forEach((btn) => {
      if (btn) {
        const handleMouseEnter = () => {
          gsap.to(btn, { scale: 1.05, duration: 0.2, ease: 'power2.out' });
        };
        
        const handleMouseLeave = () => {
          gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        };
        
        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          btn.removeEventListener('mouseenter', handleMouseEnter);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    });
  }, [activeSection]);

  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Active indicator background */}
        <div
          ref={activeIndicatorRef}
          className="absolute bottom-0 h-0.5 bg-orange-400 transition-none"
          style={{ width: 0 }}
        />
        
        <ul className="flex space-x-0">
          {navigationItems.map((item, index) => (
            <li key={item.id}>
              <button
                ref={(el) => {navItemsRef.current[index] = el}}
                onClick={() => onSectionChange(item.id)}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`
                  relative px-6 py-4 text-sm font-medium transition-colors duration-200
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