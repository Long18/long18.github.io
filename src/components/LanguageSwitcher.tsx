'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in the component when it mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = async (locale: string) => {
    if (locale === currentLocale || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      router.push(`/${locale}`);
      setIsTransitioning(false);
    }, 200);
  };

  const languages = [
    { code: 'en', label: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  return (
    <div className={`lang-switcher-container transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="flex items-center bg-gray-800/60 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50 shadow-lg hover:shadow-amber-500/10 transition-shadow duration-300">
        {languages.map((lang, index) => {
          const isActive = currentLocale === lang.code;
          const isDisabled = isTransitioning;
          
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              disabled={isDisabled}
              className={`lang-btn ${isActive ? 'active' : ''} ${isDisabled ? 'transitioning' : ''}`}
              aria-label={`Switch to ${lang.name}`}
              title={`${lang.flag} ${lang.name}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <span className="relative z-10 font-semibold tracking-wider flex items-center gap-1.5">
                <span className="text-sm leading-none">{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </span>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg animate-pulse opacity-10"></div>
              )}
            </button>
          );
        })}
      </div>
      {/* Loading indicator when transitioning */}
      {isTransitioning && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse"></div>
      )}
    </div>
  );
}