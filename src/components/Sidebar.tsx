'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import { personalInfo, contactInfo, socialLinks } from '@/data/personal';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';
import ReactDOM from 'react-dom';

interface SidebarProps {
  locale?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar({ locale = 'en' }: SidebarProps) {
  const [isContactsOpen, setIsContactsOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    return !isMobile;
  });

  const sidebarRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsContactsOpen(!isMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -320, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  const toggleContacts = () => {
    setIsContactsOpen(!isContactsOpen);

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: !isContactsOpen ? 0 : 180,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Enhanced with wider professional layout */}
      <aside
        ref={sidebarRef}
        className="hidden lg:block w-80 lg:w-96 xl:w-[420px] 2xl:w-[480px] h-full
                   bg-eerie-black-2/60 backdrop-blur-xl text-white-1
                   relative overflow-hidden rounded-r-3xl border-r border-jet/30 shadow-xl shadow-smoky-black/20"
      >
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-eerie-black-2/70 via-eerie-black-1/50 to-eerie-black-2/70 pointer-events-none" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,146,60,0.8) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 p-6 lg:p-8 xl:p-10 h-full overflow-y-auto overscroll-contain flex flex-col">
          {/* Avatar and Info - Enhanced sizing and spacing */}
          <div className="text-center mb-6 lg:mb-8">
            <div className="relative w-24 h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 mx-auto mb-4 lg:mb-6 overflow-hidden rounded-2xl lg:rounded-3xl shadow-xl shadow-orange-400/30">
              <Image
                src={personalInfo.avatar}
                alt="Profile picture"
                width={128}
                height={128}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-yellow-crayola/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />

              {/* Professional status indicator */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-eerie-black-2 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Name with enhanced typography */}
            <h2 className="text-lg lg:text-xl xl:text-2xl font-bold text-white-1 mb-2 lg:mb-3 transition-colors duration-300 hover:text-orange-yellow-crayola leading-tight">
              {personalInfo.fullName}
            </h2>

            <p className="text-sm lg:text-base xl:text-lg text-white-2 mb-3 lg:mb-4 font-medium">
              {personalInfo.displayName}
            </p>

            {/* Role badge with enhanced styling */}
            <div className="inline-flex items-center px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-orange-yellow-crayola/20 to-vegas-gold/20 border border-orange-yellow-crayola/40 rounded-full shadow-lg">
              <span className="text-orange-yellow-crayola text-sm lg:text-base font-semibold">
                {personalInfo.title}
              </span>
            </div>
          </div>

          {/* Contact Information Section - Enhanced layout */}
          <div className="flex-1 space-y-4 lg:space-y-6">
            {/* Contact Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm lg:text-base font-bold text-white-1 uppercase tracking-wider">
                Contact Information
              </h3>
              <div className="flex-1 ml-4 h-px bg-gradient-to-r from-orange-yellow-crayola to-transparent" />
            </div>

            {/* Contact Items - Enhanced spacing */}
            <div className="space-y-3 lg:space-y-4">
              <ContactItem
                icon={<EmailIcon />}
                label="Email"
                value={contactInfo.email}
                href={`mailto:${contactInfo.email}`}
              />

              <ContactItem
                icon={<PhoneIcon />}
                label="Phone"
                value={contactInfo.phone || 'Not available'}
                href={
                  contactInfo.phone
                    ? `tel:${contactInfo.phone.replace(/\s/g, '')}`
                    : undefined
                }
              />

              <ContactItem
                icon={<CalendarIcon />}
                label="Birthday"
                value={personalInfo.birthday}
              />

              <ContactItem
                icon={<LocationIcon />}
                label="Location"
                value={contactInfo.location}
              />
            </div>

            {/* Social Media Section - Enhanced */}
            <div className="pt-6 lg:pt-8">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h3 className="text-sm lg:text-base font-bold text-white-1 uppercase tracking-wider">
                  Social Media
                </h3>
                <div className="flex-1 ml-4 h-px bg-gradient-to-r from-orange-yellow-crayola to-transparent" />
              </div>

              <div className="flex justify-center space-x-3 lg:space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 lg:w-14 lg:h-14 bg-jet/50 rounded-xl flex items-center justify-center text-white-2 hover:text-orange-yellow-crayola hover:bg-orange-yellow-crayola/10 hover:scale-110 transition-all duration-300 group shadow-lg hover:shadow-orange-yellow-crayola/20"
                    aria-label={`Follow on ${social.platform}`}
                  >
                    <SocialIcon platform={social.platform} size="md" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section - Legacy Versions with enhanced design */}
          <div className="pt-6 lg:pt-8 border-t border-jet/30">
            <LegacyVersionSelector />
          </div>
        </div>
      </aside>

      {/* Mobile Contact Toggle - Enhanced */}
      <div className="lg:hidden">
        {/* Mobile Contact Info */}
        <div className="bg-eerie-black-2/90 backdrop-blur-md border-b border-jet/50">
          <div className="p-3 lg:p-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl overflow-hidden">
                  <Image
                    src={personalInfo.avatar}
                    alt="Profile picture"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm lg:text-base font-semibold text-white-1">{personalInfo.displayName}</h2>
                  <p className="text-orange-yellow-crayola text-xs lg:text-sm">{personalInfo.title}</p>
                </div>
              </div>

              {/* Toggle Button */}
              <button
                onClick={toggleContacts}
                className="flex items-center space-x-2 text-xs lg:text-sm text-orange-yellow-crayola hover:text-vegas-gold transition-colors duration-300"
                aria-controls="mobile-contacts"
                aria-expanded={isContactsOpen}
              >
                <span>{isContactsOpen ? 'Hide' : 'Show'} Contact</span>
                <svg
                  ref={arrowRef}
                  className="w-4 h-4 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Expandable Contact Details */}
            {isContactsOpen && (
              <div className="space-y-2 lg:space-y-3 animate-slideDown">
                <ContactItem
                  icon={<EmailIcon />}
                  label="Email"
                  value={contactInfo.email}
                  href={`mailto:${contactInfo.email}`}
                />
                <ContactItem
                  icon={<PhoneIcon />}
                  label="Phone"
                  value={contactInfo.phone || 'Not available'}
                  href={
                    contactInfo.phone
                      ? `tel:${contactInfo.phone.replace(/\s/g, '')}`
                      : undefined
                  }
                />
                <ContactItem
                  icon={<CalendarIcon />}
                  label="Birthday"
                  value={personalInfo.birthday}
                />
                <ContactItem
                  icon={<LocationIcon />}
                  label="Location"
                  value={contactInfo.location}
                />
              </div>
            )}

            {/* Mobile Social Links */}
            <div className="flex justify-center space-x-4 pt-3 lg:pt-4 border-t border-jet/30 mt-3 lg:mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-jet/50 rounded-lg flex items-center justify-center text-white-2 hover:text-orange-yellow-crayola hover:bg-orange-yellow-crayola/10 transition-all duration-300"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} size="sm" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Contact Item Component
interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactItem({ icon, label, value, href }: ContactItemProps) {
  const content = (
    <div className="flex items-center space-x-4 p-3 lg:p-4 rounded-xl hover:bg-jet/30 transition-all duration-300 group shadow-sm hover:shadow-md">
      <div className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 text-orange-yellow-crayola group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs lg:text-sm text-white-2/80 uppercase tracking-wider font-semibold mb-1">
          {label}
        </div>
        <div className="text-sm lg:text-base text-white-2 group-hover:text-white-1 transition-colors duration-300 truncate font-medium">
          {value}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block cursor-pointer hover:bg-jet/20 rounded-lg transition-all duration-300"
      >
        {content}
      </a>
    );
  }

  return content;
}

// Contact Icons Components
function EmailIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

// Social Media Icons Component
function SocialIcon({ platform, size = "md" }: { platform: string; size?: "sm" | "md" | "lg" }) {
  const className = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-6 h-6";

  switch (platform.toLowerCase()) {
    case 'github':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
}

// Enhanced Legacy Version Selector
function LegacyVersionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Helper function to get base URL
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const versions = [
    {
      id: 'v2.0',
      name: 'Portfolio v2.0',
      description: 'Enhanced Modern Design',
      href: `${getBaseUrl()}/v2.0`,
      year: '2024',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'v1.0',
      name: 'Portfolio v1.0',
      description: 'Original Classic Design',
      href: `${getBaseUrl()}/v1.0`,
      year: '2023',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: !isOpen ? 180 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: buttonRect.bottom + window.scrollY + 8,
        left: buttonRect.left + window.scrollX,
        width: Math.max(buttonRect.width, 280),
        zIndex: 11000,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className="bg-eerie-black-2 rounded-xl shadow-2xl border border-jet overflow-hidden backdrop-blur-xl"
      style={dropdownStyle}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-eerie-black-2 border-b border-jet">
        <h4 className="text-white-1 text-sm font-semibold">
          Portfolio Versions
        </h4>
        <p className="text-white-2 text-xs mt-1">
          Evolution of my portfolio design
        </p>
      </div>
      {/* Version List */}
      <div className="p-2">
        {versions.map((version) => (
          <a
            key={version.id}
            href={version.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 rounded-lg hover:bg-jet transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-yellow-crayola to-vegas-gold rounded-lg flex items-center justify-center text-eerie-black-1 shadow-lg group-hover:scale-110 transition-transform duration-200">
              {version.icon}
            </div>
            <div className="flex-1 ml-3">
              <div className="flex items-center justify-between">
                <h4 className="text-white-1 text-sm font-semibold group-hover:text-orange-yellow-crayola transition-colors">
                  {version.name}
                </h4>
                <span className="text-xs bg-jet text-white-2 px-2 py-1 rounded-full">
                  {version.year}
                </span>
              </div>
              <p className="text-white-2 text-xs mt-1">{version.description}</p>
            </div>
            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-4 h-4 text-orange-yellow-crayola" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        ))}
      </div>
      {/* Footer */}
      <div className="px-4 py-3 bg-smoky-black/50 border-t border-jet">
        <p className="text-xs text-white-2 text-center">
          Each version represents different milestones in my design journey
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative z-[9999]">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-2 lg:p-3 rounded-lg hover:bg-jet/30 transition-all duration-300 group"
      >
        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-orange-yellow-crayola/20 to-vegas-gold/20 rounded-lg flex items-center justify-center border border-orange-yellow-crayola/30">
            <svg className="w-3 h-3 lg:w-4 lg:h-4 text-orange-yellow-crayola" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-white-1 text-xs lg:text-sm font-semibold block">
              Portfolio Versions
            </span>
            <span className="text-white-2 text-[10px] lg:text-xs">
              View previous designs
            </span>
          </div>
        </div>
        <svg
          ref={arrowRef}
          className="w-4 h-4 text-orange-yellow-crayola transition-transform duration-300 group-hover:scale-110"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && typeof window !== 'undefined' && ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  );
}
