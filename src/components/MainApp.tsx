'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import Sidebar from '@/components/Sidebar';
import Navigation from '@/components/Navigation';
import Home from '@/components/sections/Home';
import About from '@/components/sections/About';
import Resume from '@/components/sections/Resume';
import Portfolio from '@/components/sections/Portfolio';
import Contact from '@/components/sections/Contact';

const sections = [
  { id: 'hero', label: 'Home', component: Home },
  { id: 'about', label: 'About', component: About },
  { id: 'resume', label: 'Resume', component: Resume },
  { id: 'portfolio', label: 'Portfolio', component: Portfolio },
  { id: 'contact', label: 'Contact', component: Contact },
];

interface MainAppProps {
  locale: string;
}

export default function MainApp({ locale }: MainAppProps) {
  // Use locale for internationalization and language switching

  const [activeSection, setActiveSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Enhanced section change handler with scroll-to-top functionality
  const handleSectionChange = (section: string) => {
    console.log('🎯 handleSectionChange called for:', section);

    // Add loading state for smoother transitions
    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.classList.add('content-loading');
    }

    // Update active section with slight delay for animation
    setTimeout(() => {
      setActiveSection(section);
    }, 150);

    // Create and show enhanced scroll indicator with section info
    const showScrollIndicator = () => {
      // Remove existing indicator if any
      const existingIndicator = document.querySelector('.scroll-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }

      // Get section title for display
      const sectionTitle =
        sections.find((s) => s.id === section)?.label || section;

      // Create new enhanced indicator
      const indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      indicator.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="animation: bounce 0.6s infinite; transform-origin: center;">↑</span>
          <span>Navigating to ${sectionTitle}</span>
        </div>
      `;

      // Add bounce animation keyframes if not already present
      if (!document.querySelector('#bounce-keyframes')) {
        const style = document.createElement('style');
        style.id = 'bounce-keyframes';
        style.textContent = `
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
            40%, 43% { transform: translateY(-8px); }
            70% { transform: translateY(-4px); }
            90% { transform: translateY(-2px); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(indicator);

      // Enhanced removal with fade-out effect
      setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-50%) scale(0.9)';
        indicator.style.transition = 'all 0.3s ease-out';
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.remove();
          }
        }, 300);
      }, 1000);
    };

    // Enhanced scroll to top with better fallbacks
    const smoothScrollToTop = () => {
      console.log('🔄 Starting scroll to top...');

      // Show visual indicator first
      showScrollIndicator();

      // Use window scroll since we're now using natural document flow
      console.log('🌐 Using window scroll to top');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      // Fallback: also try document element
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      // Log scroll positions after attempt
      setTimeout(() => {
        console.log('📏 Final scroll positions:', {
          window: window.scrollY,
          body: document.body.scrollTop,
          documentElement: document.documentElement.scrollTop,
        });

        // Remove loading state
        const contentSection = document.querySelector('.content-section');
        if (contentSection) {
          contentSection.classList.remove('content-loading');
        }
      }, 300);
    };

    // Immediate smooth scroll with slight delay for visual effect
    requestAnimationFrame(() => {
      smoothScrollToTop();
    });
  };

  // Additional useEffect to ensure scroll position resets when section changes
  React.useEffect(() => {
    console.log('📡 useEffect triggered for section:', activeSection);

    // Backup scroll reset with animation (in case main handler fails)
    const timer = setTimeout(() => {
      if (window.scrollY > 0) {
        console.log('🔄 Backup window scroll reset');
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeSection]);

  const renderSection = () => {
    const section = sections.find((s) => s.id === activeSection);
    if (!section) return <About />;
    const Component = section.component;

    // Pass navigation function to components that need it
    if (section.id === 'hero') {
      return <Component onNavigate={handleSectionChange} />;
    }

    return <Component />;
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-eerie-black-2 via-smoky-black to-eerie-black-1 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-orange-400/5" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar - Integrated Design */}
          <div className="hidden lg:block lg:w-80 xl:w-96 flex-shrink-0 relative">
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-orange-400/20 to-transparent" />
            <Sidebar locale={locale} />
          </div>

          {/* Main Content Area - Unified Layout */}
          <div className="flex-1 flex flex-col min-h-screen relative">
            {/* Navigation - Seamlessly Connected */}
            <div className="flex-shrink-0 relative">
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
              <Navigation
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
              />
            </div>

            {/* Content Area - Unified Styling */}
            <main className="flex-1 relative">
              {/* Content Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-eerie-black-2/50 via-transparent to-eerie-black-1/30 pointer-events-none" />

              {/* Scrollable Content */}
              <div className="relative z-10 scroll-smooth-enhanced transition-all duration-300 ease-out overflow-auto h-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl">
                  <div
                    key={activeSection}
                    className="content-section animate-fadeIn min-h-[calc(100vh-8rem)]"
                  >
                    {/* Content Card Wrapper */}
                    <div className="relative bg-eerie-black-2/40 backdrop-blur-sm rounded-3xl border border-jet/30 shadow-2xl shadow-smoky-black/20 overflow-hidden">
                      {/* Card Header Gradient */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />

                      {/* Content */}
                      <div className="relative p-6 sm:p-8 lg:p-10">
                        {renderSection()}
                      </div>

                      {/* Card Footer Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/20 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Mobile Contact Toggle - Positioned Absolutely */}
        <div className="lg:hidden">
          {/* This will be handled by the Sidebar component's ContactToggle */}
        </div>
      </div>
    </ThemeProvider>
  );
}
