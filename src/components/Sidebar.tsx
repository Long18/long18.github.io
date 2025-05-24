'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { personalInfo, socialLinks } from '@/data/personal';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface SidebarProps {
  locale: string;
}

export default function Sidebar({ locale }: SidebarProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const toggleContacts = () => {
    setIsContactsOpen(!isContactsOpen);
  };

  return (
    <motion.aside
      className="fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-40 shadow-2xl lg:static lg:w-80"
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-6 h-full overflow-y-auto">
        {/* Avatar and Info */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4 overflow-hidden rounded-2xl">
            <Image
              src={personalInfo.avatar}
              alt={personalInfo.fullName}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <h1 className="text-lg font-medium text-gray-300 mb-1">
            {personalInfo.fullName}
          </h1>
          <h2 className="text-xl font-bold text-white mb-2">
            {personalInfo.displayName}
          </h2>
          <p className="text-orange-400 text-sm px-4 py-2 bg-gray-800 rounded-lg inline-block">
            {personalInfo.title}
          </p>
        </div>

        {/* Show Contacts Button */}
        <button
          className="w-full flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group mb-4"
          onClick={toggleContacts}
        >
          <span className="text-white">Show Contacts</span>
          <motion.svg
            className="w-5 h-5 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isContactsOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isContactsOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-visible relative z-10"
            >
              <div className="h-px bg-gray-700 mb-6" />

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                <ContactItem
                  icon={<EmailIcon />}
                  label="Email"
                  value="us.thanhlong18@gmail.com"
                  href="mailto:us.thanhlong18@gmail.com"
                />
                
                <ContactItem
                  icon={<PhoneIcon />}
                  label="Phone"
                  value="+84 918 399 443"
                  href="tel:+84918399443"
                />
                
                <ContactItem
                  icon={<CalendarIcon />}
                  label="Birthday"
                  value={personalInfo.birthday}
                />
                
                <ContactItem
                  icon={<LocationIcon />}
                  label="Location"
                  value="Ho Chi Minh City"
                />
              </div>

              <div className="h-px bg-gray-700 mb-6" />

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-400 transition-all duration-300 hover:scale-110"
                    title={social.platform}
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
              </div>

              <div className="h-px bg-gray-700 mb-6" />

              {/* Legacy Versions Section */}
              <LegacyVersionSelector locale={locale} />

              <div className="h-px bg-gray-700 mb-6" />

              {/* Language Switcher Section */}
              <div className="mb-6">
                <h3 className="text-gray-400 text-sm font-medium mb-3 tracking-wider uppercase">
                  Language
                </h3>
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

// Contact Item Component
interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactItem({ icon, label, value, href }: ContactItemProps) {
  const content = (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-sm hover:text-orange-400 transition-colors">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }

  return content;
}

// Icon Components
function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// Social Icon Component
interface SocialIconProps {
  icon: string;
}

function SocialIcon({ icon }: SocialIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    'logo-github': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    'logo-facebook': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    'logo-twitter': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    'logo-linkedin': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    'logo-skype': (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.069 18.874c-4.023 0-5.82-1.979-5.82-3.464 0-.765.561-1.296 1.333-1.296 1.723 0 1.273 2.477 4.487 2.477 1.641 0 2.55-.895 2.55-1.811 0-.551-.269-1.16-1.354-1.429l-3.576-.895c-2.88-.724-3.403-2.286-3.403-3.751 0-3.047 2.861-4.191 5.549-4.191 2.471 0 5.393 1.373 5.393 3.199 0 .784-.602 1.24-1.387 1.24-1.505 0-1.097-2.066-3.954-2.066-1.387 0-2.204.657-2.204 1.567 0 .784.717 1.24 1.425 1.414l3.11.724c2.939.687 3.821 2.191 3.821 4.041 0 2.677-2.087 4.241-5.97 4.241z"/>
      </svg>
    )
  };

  return iconMap[icon] || null;
}

// Legacy Version Selector Component
function LegacyVersionSelector({ }: { locale?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  // Get the base URL for legacy versions
  const getBaseUrl = () => {
    // Always return empty string for relative paths which is more reliable
    return '';
  };

  const versions = [
    { 
      id: 'v2.0', 
      name: 'Legacy v2.0', 
      description: 'Classic Portfolio',
      href: `${getBaseUrl()}/v2.0`,
      year: '2024',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      id: 'v1.0', 
      name: 'Legacy v1.0', 
      description: 'Original Design',
      href: `${getBaseUrl()}/v1.0`,
      year: '2023',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative z-50">
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all duration-300 group shadow-lg border border-gray-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-white text-sm font-semibold block">Legacy Versions</span>
            <span className="text-gray-300 text-xs">Explore previous designs</span>
          </div>
        </div>
        <motion.div
          className="flex items-center space-x-2"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <svg
            className="w-5 h-5 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay for closing dropdown */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-600 overflow-hidden z-50 backdrop-blur-sm"
              style={{ 
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto'
              }}
            >
              <div className="p-2">
                {versions.map((version, index) => (                <motion.button
                  key={version.id}
                  onClick={() => {
                    // Use window.location.href to navigate directly instead of opening in new tab
                    window.location.href = version.href;
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-4 p-4 hover:bg-gray-700/50 rounded-lg transition-all duration-200 group mb-1 last:mb-0 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, ease: "easeOut" }}
                  whileHover={{ 
                    x: 8,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                    {version.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white text-sm font-semibold group-hover:text-orange-400 transition-colors">
                        {version.name}
                      </h4>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                        {version.year}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      {version.description}
                    </p>
                  </div>
                  <motion.div
                    className="text-gray-400 group-hover:text-orange-400 transition-colors"
                    whileHover={{ scale: 1.2 }}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.div>
                </motion.button>
                ))}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700">
                <p className="text-xs text-gray-400 text-center">
                  Each version showcases different design approaches and technologies
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}