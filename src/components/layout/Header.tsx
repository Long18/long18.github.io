'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleNavClick = (sectionId: string) => {
    console.log('🎯 Header handleNavClick called for:', sectionId);
    onSectionChange(sectionId);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {navigationItems.map((item) => (
          <li key={item.id} className="navbar-item">
            <button
              onClick={() => handleNavClick(item.id)}
              className={`navbar-link ${activeSection === item.id ? 'active' : ''}`}
              data-nav-link
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
