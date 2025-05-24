'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import Sidebar from '@/components/Sidebar';
import Navigation from '@/components/Navigation';
import About from '@/components/sections/About';
import Resume from '@/components/sections/Resume';
import Portfolio from '@/components/sections/Portfolio';
import Contact from '@/components/sections/Contact';

const sections = [
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
  
  const [activeSection, setActiveSection] = useState('about');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const renderSection = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return <About />;
    const Component = section.component;
    return <Component />;
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <Sidebar locale={locale} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Navigation */}
            <div className="flex-shrink-0 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
              <Navigation 
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-4 lg:px-8 py-8 max-w-6xl">
                <div className="min-h-full">
                  {renderSection()}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
