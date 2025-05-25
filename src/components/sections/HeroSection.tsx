'use client';

import React, { useRef } from 'react';
import { ArrowDown, Download, Mail, Github, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';
import { personalInfo, contactInfo } from '../../data/personal';
import { useGSAP } from '../../hooks/useGSAP';
import { heroEntranceAnimation } from '../../utils/gsapAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  
  // Section container ref
  const sectionRef = useRef<HTMLElement>(null);
  // Ref for rotating border ring
  const ringRef = useRef<HTMLDivElement>(null);
  // Refs for GSAP animations
  const greetingRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const bgDotsRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useGSAP(() => {
    // Hero entrance animation using the preset
    heroEntranceAnimation({
      greeting: greetingRef.current || undefined,
      name: nameRef.current || undefined,
      title: titleRef.current || undefined,
      subtitle: subtitleRef.current || undefined,
      buttons: buttonsRef.current ? Array.from(buttonsRef.current.children) as HTMLElement[] : undefined,
      social: socialRef.current ? Array.from(socialRef.current.children) as HTMLElement[] : undefined,
      avatar: avatarRef.current || undefined,
    });

    // Animate background dots with scroll trigger
    if (bgDotsRef.current) {
      const dots = bgDotsRef.current.querySelectorAll('.gsap-dot');
      dots.forEach((dot, i) => {
        gsap.to(dot, {
          x: `random(-100, 100)`,
          y: `random(-100, 100)`,
          scale: 'random(0.8, 1.5)',
          opacity: 'random(0.2, 0.7)',
          duration: 8 + Math.random() * 8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });
    }

    // Rotate border ring continuously
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 20,
        ease: 'linear',
        repeat: -1,
      });
    }

    // Floating tech icons animation with responsive adjustments
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach(icon => {
      const delay = parseFloat(icon.getAttribute('data-delay') || '0');
      gsap.to(icon, {
        y: -10,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });

      // Add hover interactions
      const element = icon as HTMLElement;
      element.addEventListener('mouseenter', () => {
        gsap.to(icon, { scale: 1.2, duration: 0.3, ease: 'power2.out' });
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(icon, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    // Add scroll-triggered parallax effect
    if (sectionRef.current) {
      gsap.to(bgDotsRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Github, href: contactInfo.social.github, label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-gray-100' },
    { icon: Linkedin, href: contactInfo.social.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Mail, href: `mailto:${contactInfo.email}`, label: 'Email', color: 'hover:text-red-500' },
  ];

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-gray-900 to-purple-500/5" />
      
      {/* Animated background elements with GSAP */}
      <div ref={bgDotsRef} className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/30 rounded-full gsap-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Greeting */}
            <div ref={greetingRef} className="space-y-2">
              <p className="text-lg text-gray-400 font-medium">
                Hello, I'm
              </p>
              <h1 ref={nameRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  {personalInfo.displayName}
                </span>
              </h1>
            </div>

            {/* Title */}
            <h2 ref={titleRef} className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">
              {personalInfo.title}
            </h2>

            {/* Subtitle */}
            <p ref={subtitleRef} className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {personalInfo.aboutText[0]}
            </p>

            {/* CTAs */}
            <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToAbout}
                className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View My Work
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </button>
              
              <a
                href="/assets/resume.pdf"
                download
                className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-transparent border border-gray-600 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Download Resume
              </a>
            </div>

            {/* Social Links */}
            <div ref={socialRef} className="flex items-center justify-center lg:justify-start space-x-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'p-3 rounded-lg bg-gray-800 text-gray-400 transition-all duration-300 hover:scale-110 hover:shadow-lg',
                      social.color
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right content - Avatar */}
          <div ref={avatarRef} className="relative flex items-center justify-center">
            {/* Avatar container with animated border */}
            <div className="relative">
              <div
                ref={ringRef}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400"
                style={{ padding: '4px' }}
              />
              <div className="relative bg-gray-900 rounded-full p-1">
                <img
                  src={personalInfo.avatar}
                  alt={personalInfo.fullName}
                  className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full object-cover"
                />
              </div>
              
              {/* Floating tech icons */}
              {[
                { icon: '⚛️', position: 'top-4 right-4', delay: 1.2 },
                { icon: '🎮', position: 'bottom-4 left-4', delay: 1.4 },
                { icon: '💻', position: 'top-4 left-4', delay: 1.6 },
                { icon: '🚀', position: 'bottom-4 right-4', delay: 1.8 },
              ].map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute tech-icon w-12 h-12 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-2xl shadow-lg cursor-pointer',
                    item.position
                  )}
                  data-delay={item.delay}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
