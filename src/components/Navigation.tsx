'use client';

import { motion } from 'framer-motion';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' }
];

export default function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex space-x-0">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                aria-label={`Navigate to ${item.label} section`}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`
                  relative px-6 py-4 text-sm font-medium transition-all duration-300
                  ${activeSection === item.id 
                    ? 'text-orange-400' 
                    : 'text-gray-400 hover:text-white'
                  }
                `}
              >
                {item.label}
                
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}