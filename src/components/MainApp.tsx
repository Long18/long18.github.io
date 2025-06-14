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
import Blog from '@/components/sections/Blog';
import Contact from '@/components/sections/Contact';

const sections = [
  { id: 'hero', label: 'Home', component: Home },
  { id: 'about', label: 'About', component: About },
  { id: 'resume', label: 'Resume', component: Resume },
  { id: 'portfolio', label: 'Portfolio', component: Portfolio },
  { id: 'blog', label: 'Blog', component: Blog },
  { id: 'contact', label: 'Contact', component: Contact },
];

interface MainAppProps {
  locale: string;
}

export default function MainApp({ locale }: MainAppProps) {
  const [activeSection, setActiveSection] = useState('hero'); // Keep Home as default
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSectionChange = (section: string) => {
    console.log('🎯 handleSectionChange called for:', section);

    // Scroll to top immediately when changing sections
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Also ensure body/html scroll to top for mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const contentSection = document.querySelector('.content-section');
    if (contentSection) {
      contentSection.classList.add('content-loading');
    }

    // Show loading indicator
    const showScrollIndicator = () => {
      const existingIndicator = document.querySelector('.scroll-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }

      const sectionTitle =
        sections.find((s) => s.id === section)?.label || section;

      const indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      indicator.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
          backdrop-filter: blur(10px);
          color: hsl(45, 100%, 72%);
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(251, 146, 60, 0.2);
          border: 1px solid hsl(45, 100%, 72%);
          z-index: 9999;
          transform: translateY(-50%) scale(0.9);
          opacity: 0;
          transition: all 0.3s ease-out;
        ">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="animation: bounce 0.6s infinite; transform-origin: center;">→</span>
            <span>Loading ${sectionTitle}</span>
          </div>
        </div>
      `;

      if (!document.querySelector('#bounce-keyframes')) {
        const style = document.createElement('style');
        style.id = 'bounce-keyframes';
        style.textContent = `
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translateX(0); }
            40%, 43% { transform: translateX(3px); }
            70% { transform: translateX(1px); }
            90% { transform: translateX(-1px); }
          }
        `;
        document.head.appendChild(style);
      }

      document.body.appendChild(indicator);

      setTimeout(() => {
        const indicatorEl = indicator.firstElementChild as HTMLElement;
        if (indicatorEl) {
          indicatorEl.style.opacity = '1';
          indicatorEl.style.transform = 'translateY(-50%) scale(1)';
        }
      }, 100);

      setTimeout(() => {
        const indicatorEl = indicator.firstElementChild as HTMLElement;
        if (indicatorEl) {
          indicatorEl.style.opacity = '0';
          indicatorEl.style.transform = 'translateY(-50%) scale(0.9)';
          setTimeout(() => {
            if (indicator.parentNode) {
              indicator.remove();
            }
          }, 300);
        }
      }, 1500);
    };

    showScrollIndicator();

    // Change section after a brief delay
    setTimeout(() => {
      setActiveSection(section);
    }, 150);

    // Remove loading state
    setTimeout(() => {
      if (contentSection) {
        contentSection.classList.remove('content-loading');
      }
    }, 300);
  };

  const renderSection = () => {
    const section = sections.find((s) => s.id === activeSection);
    if (!section) return <About />;
    const Component = section.component as React.ComponentType<Record<string, unknown>>; // Type assertion for dynamic component rendering

    if (section.id === 'hero') {
      return <Component onNavigate={handleSectionChange} />;
    }

    if (section.id === 'blog') {
      return <Component locale={locale} />;
    }

    return <Component />;
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ThemeProvider>
      {/* Portfolio layout with original orange/yellow color scheme */}
      <div className="min-h-screen bg-portfolio-surface-primary text-portfolio-text-primary relative overflow-hidden">
        {/* Subtle background effects with orange/purple gradients */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,146,60,0.15) 1px, transparent 0)`,
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        {/* Header Navigation - Fixed/Floating */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-portfolio-surface-primary/90 backdrop-blur-md border-b border-border/20 md:bg-transparent md:backdrop-blur-none md:border-none md:relative">
          <div className="w-full flex items-center justify-end p-4">
            <Navigation
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        </header>

        {/* Main Layout Container */}
        <div className="relative z-10 flex flex-col md:flex-row min-h-screen pt-16 md:pt-0 pb-24 md:pb-0">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 lg:w-96 xl:w-[420px] 2xl:w-[480px] bg-portfolio-surface-secondary/60 backdrop-blur-xl">
            <Sidebar locale={locale} />
          </aside>

                      {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden">
              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-portfolio-surface-secondary/50 via-transparent to-portfolio-surface-primary/30 pointer-events-none" />

              {/* Scrollable Content */}
              <div className="relative z-10 scroll-smooth-enhanced transition-all duration-300 ease-out overflow-auto h-full main-content-mobile">
                <div className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 pb-24 lg:pb-12 max-w-7xl">
                  <div
                    key={activeSection}
                    className="content-section animate-fadeIn min-h-[calc(100vh-8rem)]"
                  >
                    {renderSection()}
                  </div>
                </div>
              </div>
            </main>
        </div>

        {/* Mobile Layout - Profile and Navigation handled by components */}
        <div className="md:hidden">
          {/* Mobile profile and contact toggle will be handled by Sidebar component */}
        </div>
      </div>

      {/* Global styles for scroll indicator and loading states */}
      <style jsx global>{`
        .content-loading {
          opacity: 0.7;
          transform: translateY(10px);
        }

        /* Smooth content transitions */
        .content-section {
          animation: fadeInContent 0.4s ease-out;
        }

        @keyframes fadeInContent {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ensure mobile navigation is always visible */
        @media (max-width: 768px) {
          body {
            padding-top: 80px;
            padding-bottom: 120px; /* Account for bottom bar */
          }

          /* Hide default scrollbars on mobile for cleaner look */
          ::-webkit-scrollbar {
            width: 4px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(251, 146, 60, 0.3);
            border-radius: 2px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(251, 146, 60, 0.5);
          }
        }

        /* Better desktop scrollbars */
        @media (min-width: 769px) {
          main::-webkit-scrollbar {
            width: 6px;
          }

          main::-webkit-scrollbar-track {
            background: rgba(34, 34, 34, 0.2);
            border-radius: 3px;
          }

          main::-webkit-scrollbar-thumb {
            background: rgba(251, 146, 60, 0.4);
            border-radius: 3px;
          }

          main::-webkit-scrollbar-thumb:hover {
            background: rgba(251, 146, 60, 0.6);
          }
        }

        /* Smooth focus transitions for better accessibility */
        *:focus-visible {
          outline: 2px solid hsl(45, 100%, 72%);
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Enhanced button press feedback */
        .hero-button:active {
          transform: translateY(1px) scale(0.98);
        }

        /* Loading state improvements */
        .scroll-indicator {
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </ThemeProvider>
  );
}
