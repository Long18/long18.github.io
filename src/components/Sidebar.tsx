'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Image from 'next/image';
import { personalInfo, socialLinks } from '@/data/personal';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useGSAP } from '@/hooks/useGSAP';
import gsap from 'gsap';
import ContactToggle from './ContactToggle';
import ReactDOM from 'react-dom';

interface SidebarProps {
  locale: string;
}

export default function Sidebar({ locale }: SidebarProps) {
  // Set initial state based on device type
  const [isContactsOpen, setIsContactsOpen] = useState(() => {
    // Check if we're on client side
    if (typeof window === 'undefined') return false;

    // Check if device is mobile
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    // Mobile: closed by default, Desktop: open by default
    return !isMobile;
  });

  // Refs for GSAP animations
  const sidebarRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  // Handle responsive behavior on window resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;

      // On mobile: close contacts, on desktop: open contacts
      setIsContactsOpen(!isMobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP entrance animation
  useGSAP(() => {
    if (sidebarRef.current) {
      gsap.fromTo(
        sidebarRef.current,
        { x: -320 },
        {
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    }
  }, []);

  const toggleContacts = () => {
    setIsContactsOpen(!isContactsOpen);

    // Animate arrow rotation
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: !isContactsOpen ? 0 : 180,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  // Responsive: show sidebar on md+, use ContactToggle on mobile
  return (
    <>
      {/* Desktop Sidebar - Unified with main layout */}
      <aside
        ref={sidebarRef}
        className="hidden md:block fixed top-0 left-0 h-screen w-64 lg:w-72 xl:w-80
                  bg-eerie-black-2/60 backdrop-blur-xl text-white-1 z-40
                  lg:static lg:h-auto lg:min-h-screen
                  relative overflow-hidden"
      >
        {/* Sidebar Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-eerie-black-2/70 via-eerie-black-1/50 to-eerie-black-2/70 pointer-events-none" />

        {/* Subtle Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '16px 16px',
          }}
        />
        <div className="relative z-10 p-4 md:p-5 lg:p-6 h-full lg:h-auto overflow-y-auto lg:overflow-visible overscroll-contain flex flex-col">
          {/* Avatar and Info - Responsive sizing */}
          <div className="text-center mb-4 lg:mb-5">
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-auto mb-3 lg:mb-4 overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg shadow-orange-400/20">
              <Image
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 4rem, (max-width: 1280px) 5rem, 6rem"
              />
            </div>

            <h1 className="text-sm lg:text-base font-medium text-white-2 mb-0.5 lg:mb-1">
              {personalInfo.fullName}
            </h1>
            <h2 className="text-base lg:text-lg font-bold text-white-1 mb-1.5 lg:mb-2">
              {personalInfo.displayName}
            </h2>
            <p className="text-orange-400 text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 bg-eerie-black-1/70 backdrop-blur-sm rounded-xl lg:rounded-2xl shadow-lg shadow-orange-400/10 inline-block">
              {personalInfo.title}
            </p>
          </div>

          {/* Hide Contacts Button - Only shows when contacts are open */}
          {isContactsOpen && (
            <button
              className="w-full flex items-center justify-between p-2 lg:p-2.5
                        bg-eerie-black-1/70 backdrop-blur-sm hover:bg-jet/70
                        rounded-xl lg:rounded-2xl
                        border border-transparent hover:border-jet/50 hover:shadow-lg hover:shadow-orange-400/10
                        transition-all duration-500
                        group mb-3 lg:mb-4
                        focus:outline-none focus:ring-2 focus:ring-orange-400/30"
              onClick={toggleContacts}
            >
              <span className="text-white-1 group-hover:text-orange-400 transition-colors duration-500 text-xs lg:text-sm">
                Hide Contacts
              </span>
              <svg
                ref={arrowRef}
                className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: 'rotate(0deg)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {/* Show Contacts Button - Only shows when contacts are hidden */}
          {!isContactsOpen && (
            <button
              className="w-full flex items-center justify-center p-2 lg:p-2.5
                        bg-orange-400/90 backdrop-blur-sm hover:bg-orange-500/90
                        rounded-xl lg:rounded-2xl
                        border border-transparent hover:border-orange-400/50 hover:shadow-xl hover:shadow-orange-400/20
                        transition-all duration-500
                        group mb-3 lg:mb-4
                        focus:outline-none focus:ring-2 focus:ring-orange-400/30"
              onClick={toggleContacts}
            >
              <span className="text-white-1 font-medium text-xs lg:text-sm">
                Show Contacts
              </span>
            </button>
          )}

          {/* Contacts Panel - Animated with GSAP */}
          <div
            className="overflow-hidden transition-all duration-500"
            style={{
              height: isContactsOpen ? 'auto' : 0,
              opacity: isContactsOpen ? 1 : 0,
              transform: `translateY(${isContactsOpen ? '0' : '-10px'})`,
            }}
          >
            <div className="h-px bg-jet mb-3 lg:mb-4" />

            {/* Contact Information */}
            <div className="space-y-1.5 lg:space-y-2 mb-3 lg:mb-4">
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

            <div className="h-px bg-jet mb-3 lg:mb-4" />

            {/* Social Links - Responsive grid */}
            <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-3 lg:mb-4 justify-center">
              {socialLinks.map((social) => (
                <SocialLink key={social.platform} social={social} />
              ))}
            </div>

            <div className="h-px bg-jet mb-3 lg:mb-4" />

            {/* Legacy Versions Section */}
            <div className="w-full block mb-3 lg:mb-4">
              <LegacyVersionSelector />
            </div>

            {/* <div className="h-px bg-jet mb-3 lg:mb-4" /> */}

            {/* Language Switcher Section */}
            {/* <div className="mb-0">
              <h3 className="text-white-2 text-xs lg:text-sm font-medium mb-2 lg:mb-3 tracking-wider uppercase">
                Language
              </h3>
              <LanguageSwitcher currentLocale={locale} />
            </div> */}
          </div>
        </div>
      </aside>

      {/* Mobile Contact Toggle - Enhanced with animations */}
      <ContactToggle isOpen={isContactsOpen} onToggle={toggleContacts}>
        <div className="p-1 sm:p-2">
          {/* Avatar and Info (mobile) - Responsive sizing */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-1.5 sm:mb-2 overflow-hidden rounded-2xl shadow-lg shadow-orange-400/20">
              <Image
                src={personalInfo.avatar}
                alt={personalInfo.fullName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 3.5rem, 4rem"
              />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white-1 mb-0.5 sm:mb-1">
              {personalInfo.displayName}
            </h2>
            <p className="text-orange-400 text-xs px-2 sm:px-3 py-0.5 sm:py-1 bg-eerie-black-1/70 backdrop-blur-sm rounded-2xl shadow-lg shadow-orange-400/10 inline-block">
              {personalInfo.title}
            </p>
          </div>

          {/* Contacts and Socials - Responsive layout */}
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
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

          {/* Social links - Responsive grid */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 justify-center">
            {socialLinks.map((social) => (
              <SocialLink key={social.platform} social={social} />
            ))}
          </div>

          {/* Language switcher */}
          <div className="mb-1 sm:mb-2">
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </div>
      </ContactToggle>
    </>
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
  const itemRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (itemRef.current) {
      const handleMouseEnter = () => {
        gsap.to(itemRef.current, {
          scale: 1.02,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(itemRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      const item = itemRef.current;
      item.addEventListener('mouseenter', handleMouseEnter);
      item.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        item.removeEventListener('mouseenter', handleMouseEnter);
        item.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const content = (
    <div
      ref={itemRef}
      className="flex items-center space-x-2 lg:space-x-3
                p-1.5 lg:p-2
                rounded-xl lg:rounded-2xl
                hover:bg-eerie-black-1/70 backdrop-blur-sm
                transition-all duration-500
                border border-transparent hover:border-jet/50 hover:shadow-lg hover:shadow-orange-400/10"
    >
      <div className="text-orange-400 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-white-2 text-[10px] lg:text-xs">{label}</p>
        <p className="text-white-1 text-xs lg:text-sm truncate">{value}</p>
      </div>
    </div>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block focus:outline-none focus:ring-2 focus:ring-orange-400/30 rounded-2xl"
    >
      {content}
    </a>
  ) : (
    content
  );
}

// Social Link Component
interface SocialLinkProps {
  social: (typeof socialLinks)[0];
}

function SocialLink({ social }: SocialLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useGSAP(() => {
    if (linkRef.current) {
      const handleMouseEnter = () => {
        gsap.to(linkRef.current, {
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(linkRef.current, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
      };

      const link = linkRef.current;
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        link.removeEventListener('mouseenter', handleMouseEnter);
        link.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <a
      ref={linkRef}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 lg:w-10 lg:h-10 xl:w-11 xl:h-11
                bg-eerie-black-1/70 backdrop-blur-sm hover:bg-orange-400/90
                rounded-xl lg:rounded-2xl
                flex items-center justify-center
                transition-all duration-500
                border border-transparent hover:border-orange-400/50
                shadow-sm hover:shadow-xl hover:shadow-orange-400/20
                focus:outline-none focus:ring-2 focus:ring-orange-400/30"
      title={social.platform}
      aria-label={`Visit ${social.platform}`}
    >
      <div className="text-white-1 group-hover:text-white-1 transition-colors duration-500">
        <SocialIcon icon={social.icon} />
      </div>
    </a>
  );
}

// Icon Components
function EmailIcon() {
  return (
    <svg
      className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
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
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    'logo-facebook': (
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    'logo-twitter': (
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
    'logo-linkedin': (
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    'logo-skype': (
      <svg
        className="w-4 h-4 lg:w-5 lg:h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.874c-3.5 0-6.2-2.1-6.2-4.5 0-1.1.9-1.9 2-1.9 1.8 0 1.5 2.5 4.2 2.5 1.7 0 2.7-1 2.7-2 0-.6-.3-1.2-1.4-1.5l-3.8-1c-2.9-.7-3.5-2.4-3.5-4 0-3.2 2.9-4.5 5.7-4.5 2.6 0 5.6 1.5 5.6 3.5 0 1.1-.9 1.8-2 1.8-1.6 0-1.4-2.2-4.3-2.2-1.5 0-2.4.7-2.4 1.7 0 .6.3 1.1 1.4 1.3l4 1c2.9.7 3.5 2.5 3.5 4.1 0 3.3-3.1 4.8-6 4.8z" />
      </svg>
    ),
  };

  return iconMap[icon] || null;
}

// Legacy Version Selector Component
function LegacyVersionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const versions = [
    {
      id: 'v2.0',
      name: 'Legacy v2.0',
      description: 'Enhanced Design',
      href: `${getBaseUrl()}/v2.0`,
      year: '2024',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
    },
    {
      id: 'v1.0',
      name: 'Legacy v1.0',
      description: 'Original Design',
      href: `${getBaseUrl()}/v1.0`,
      year: '2023',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);

    // Animate arrow rotation
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: !isOpen ? 180 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    // Animate dropdown
    if (dropdownRef.current) {
      if (!isOpen) {
        gsap.set(dropdownRef.current, { display: 'block' });
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        gsap.to(dropdownRef.current, {
          opacity: 0,
          y: -10,
          scale: 0.95,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(dropdownRef.current, { display: 'none' });
          },
        });
      }
    }
  };

  // Calculate dropdown position relative to button
  useLayoutEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: buttonRect.bottom + window.scrollY + 8, // 8px margin
        left: buttonRect.left + window.scrollX,
        width: buttonRect.width,
        zIndex: 11000,
      });
    }
  }, [isOpen]);

  // Close dropdown on outside click
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
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  // Dropdown content
  const dropdownMenu = (
    <div
      ref={dropdownRef}
      className="bg-eerie-black-1 rounded-xl shadow-2xl border border-jet overflow-hidden"
      style={dropdownStyle}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-eerie-black-2 border-b border-jet">
        <h4 className="text-white-1 text-sm font-semibold">
          Previous Portfolio Versions
        </h4>
        <p className="text-white-2 text-xs mt-1">
          Showcase of design evolution
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
            className="flex items-center p-3 rounded-lg hover:bg-eerie-black-2 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center text-white-1 shadow-lg group-hover:scale-110 transition-transform duration-200">
              {version.icon}
            </div>
            <div className="flex-1 ml-3">
              <div className="flex items-center space-x-2">
                <h4 className="text-white-1 text-sm font-semibold group-hover:text-orange-400 transition-colors">
                  {version.name}
                </h4>
                <span className="text-xs bg-eerie-black-2 text-white-2 px-2 py-1 rounded-full">
                  {version.year}
                </span>
              </div>
              <p className="text-white-2 text-xs mt-1">{version.description}</p>
            </div>
            <div className="text-white-2 group-hover:text-orange-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
      {/* Footer */}
      <div className="px-4 py-3 bg-smoky-black/50 border-t border-jet">
        <p className="text-xs text-white-2 text-center">
          Each version showcases different design approaches and technologies
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative z-[9999]">
      {/* Main Button */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between p-2.5 lg:p-3 bg-gradient-to-r from-eerie-black-1 to-eerie-black-2 rounded-xl hover:from-jet hover:to-eerie-black-1 transition-all duration-300 group shadow-lg border border-jet z-[9999]"
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white-1">
            <svg
              className="w-3.5 h-3.5 lg:w-4 lg:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-white-1 text-xs lg:text-sm font-semibold block">
              Legacy Versions
            </span>
            <span className="text-white-2 text-[10px] lg:text-xs">
              Explore previous designs
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <svg
            ref={arrowRef}
            className="w-4 h-4 lg:w-5 lg:h-5 text-orange-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      {/* Dropdown Menu (Portal) */}
      {isOpen &&
        typeof window !== 'undefined' &&
        ReactDOM.createPortal(dropdownMenu, document.body)}
    </div>
  );
}
