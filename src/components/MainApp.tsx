'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
// import LoadingOverlay from '@/components/LoadingOverlay'; // No longer needed
import Sidebar from '@/components/Sidebar';
import Header from '@/components/layout/Header';
import ThemeToggle from '@/components/ThemeToggle';
import Home from '@/components/sections/Home';
import About from '@/components/sections/About';
import Resume from '@/components/sections/Resume';
import Portfolio from '@/components/sections/Portfolio';
import Contact from '@/components/sections/Contact';

const sections = [
  { id: 'home', label: 'Home', component: Home },
  { id: 'about', label: 'About', component: About },
  { id: 'resume', label: 'Resume', component: Resume },
  { id: 'portfolio', label: 'Portfolio', component: Portfolio },
  { id: 'contact', label: 'Contact', component: Contact },
];

interface MainAppProps {
  locale: string;
}

export default function MainApp({ locale }: MainAppProps) {
  const [activeSection, setActiveSection] = useState('home'); // Default to Home section
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSectionChange = (section: string) => {
    console.log('🎯 MainApp handleSectionChange called for:', section);

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

    // Loading indicator removed - no longer showing when switching tabs
    // const showScrollIndicator = () => { ... };
    // showScrollIndicator(); // Removed call to prevent loading indicator

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
    if (!section) return <Home />;
    const Component = section.component;

    return <Component />;
  };

  // Prevent hydration mismatch - temporarily disabled to debug
  // if (!isMounted) {
  //   return <div style={{ visibility: 'hidden' }}>Loading...</div>;
  // }

  return (
    <ThemeProvider>
      {/* Portfolio layout with original orange/yellow color scheme */}
      <div className="min-h-screen bg-eerie-black-1 text-white-1 relative overflow-hidden">
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

                            {/* Main Layout Container - Version 2.0 Style */}
                    <div className="relative z-10 min-h-screen pt-20 pb-32 md:pb-0 md:pt-20">
          <div className="mx-3 md:mx-6 lg:mx-8 xl:mx-12 my-4 md:my-8 lg:my-12 xl:my-15 max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row justify-center items-stretch gap-4 lg:gap-6 xl:gap-8">
              {/* Desktop Sidebar - Version 2.0 Style */}
              <aside className="hidden lg:block w-full lg:w-72 xl:w-80 2xl:w-96 bg-eerie-black-2 border border-jet rounded-[20px] p-4 shadow-[--shadow-1] z-1 flex-shrink-0">
                <Sidebar locale={locale} />
              </aside>

                            {/* Main Content Area - Version 2.0 Style */}
              <div className="flex-1 min-w-0 relative">
                {/* Content Panel */}
                <main className="bg-eerie-black-2 border border-jet rounded-[20px] p-4 md:p-6 lg:p-8 shadow-[--shadow-1] z-1 relative overflow-hidden">
                  {/* Header Navigation - Inside Main Panel */}
                  <Header
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                  />
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-eerie-black-2/50 via-transparent to-eerie-black-1/30 pointer-events-none rounded-[20px]" />

                  {/* Scrollable Content */}
                  <div className="relative z-10 scroll-smooth-enhanced transition-all duration-300 ease-out overflow-auto h-full main-content-mobile">
                    <div
                      key={activeSection}
                      className="content-section animate-fadeIn min-h-[calc(100vh-8rem)]"
                    >
                      {renderSection()}
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
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
