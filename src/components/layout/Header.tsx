'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Globe,
  Palette,
  ChevronDown
} from 'lucide-react';
import { useTheme, type ColorTheme, colorThemes } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

const navigation = [
  { name: 'nav.home', href: '/' },
  { name: 'nav.about', href: '/about' },
  { name: 'nav.projects', href: '/projects' },
  { name: 'nav.blog', href: '/blog' },
  { name: 'nav.contact', href: '/contact' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const pathname = usePathname();
  const { mode, colorTheme, toggleMode, setColorTheme } = useTheme();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.theme-dropdown') && !target.closest('.color-dropdown') && !target.closest('.language-dropdown')) {
        setShowThemeMenu(false);
        setShowColorMenu(false);
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLanguageChange = (language: 'en' | 'vi') => {
    i18n.changeLanguage(language);
    setShowLanguageMenu(false);
  };

  const handleColorThemeChange = (theme: ColorTheme) => {
    setColorTheme(theme);
    setShowColorMenu(false);
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              L
            </div>
            <span className="hidden sm:block">Long.dev</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'relative text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-foreground/70'
                )}
              >
                {t(item.name)}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navbar-indicator"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Switcher */}
            <div className="relative language-dropdown">
              <button
                onClick={() => {
                  setShowLanguageMenu(!showLanguageMenu);
                  setShowThemeMenu(false);
                  setShowColorMenu(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-md hover:bg-accent"
              >
                <Globe className="h-4 w-4" />
                <span>{i18n.language.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-lg py-1"
                  >
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={cn(
                        'block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors',
                        i18n.language === 'en' ? 'text-primary font-medium' : 'text-foreground'
                      )}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('vi')}
                      className={cn(
                        'block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors',
                        i18n.language === 'vi' ? 'text-primary font-medium' : 'text-foreground'
                      )}
                    >
                      Tiếng Việt
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Color Theme Switcher */}
            <div className="relative color-dropdown">
              <button
                onClick={() => {
                  setShowColorMenu(!showColorMenu);
                  setShowThemeMenu(false);
                  setShowLanguageMenu(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-md hover:bg-accent"
              >
                <Palette className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showColorMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg py-2"
                  >
                    {Object.entries(colorThemes).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => handleColorThemeChange(key as ColorTheme)}
                        className={cn(
                          'flex items-center w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors',
                          colorTheme === key ? 'text-primary font-medium' : 'text-foreground'
                        )}
                      >
                        <div
                          className="w-4 h-4 rounded-full mr-3 border border-border"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        {theme.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Mode Switcher */}
            <div className="relative theme-dropdown">
              <button
                onClick={() => {
                  setShowThemeMenu(!showThemeMenu);
                  setShowColorMenu(false);
                  setShowLanguageMenu(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-md hover:bg-accent"
              >
                {getModeIcon()}
                <ChevronDown className="h-3 w-3" />
              </button>

              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-card border border-border rounded-md shadow-lg py-1"
                  >
                    <button
                      onClick={() => {
                        toggleMode();
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors text-foreground"
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      Light
                    </button>
                    <button
                      onClick={() => {
                        toggleMode();
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors text-foreground"
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      Dark
                    </button>
                    <button
                      onClick={() => {
                        toggleMode();
                        setShowThemeMenu(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors text-foreground"
                    >
                      <Monitor className="h-4 w-4 mr-2" />
                      System
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground/70 hover:text-primary p-2 rounded-md hover:bg-accent transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                      pathname === item.href
                        ? 'text-primary bg-accent'
                        : 'text-foreground/70 hover:text-primary hover:bg-accent'
                    )}
                  >
                    {t(item.name)}
                  </Link>
                ))}

                {/* Mobile Theme Controls */}
                <div className="pt-4 mt-4 border-t border-border">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-foreground">Theme</span>
                    <button
                      onClick={toggleMode}
                      className="flex items-center space-x-2 px-3 py-1 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-md hover:bg-accent"
                    >
                      {getModeIcon()}
                      <span className="capitalize">{mode}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-foreground">Language</span>
                    <button
                      onClick={() => handleLanguageChange(i18n.language === 'en' ? 'vi' : 'en')}
                      className="flex items-center space-x-2 px-3 py-1 text-sm font-medium text-foreground/70 hover:text-primary transition-colors rounded-md hover:bg-accent"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{i18n.language === 'en' ? 'EN' : 'VI'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
