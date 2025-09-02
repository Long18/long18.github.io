'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { cn } from '@/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  className,
  showHeader = true,
  showFooter = true,
  activeSection = 'home',
  onSectionChange = () => {}
}) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {showHeader && <Header activeSection={activeSection} onSectionChange={onSectionChange} />}

      <motion.main
        className={cn(
          'flex-1',
          showHeader && 'pt-16 md:pt-20',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
