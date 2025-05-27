'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { personalInfo } from '../../data/personal';
import { mainSkills } from '../../data/skills';
import SkillIcon from '../ui/SkillIcon';
import { useGSAP } from '../../hooks/useGSAP';
import { heroEntranceAnimation } from '../../utils/gsapAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
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
  const avatarRef = useRef<HTMLDivElement>(null);
  const bgDotsRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useGSAP(() => {
    // Hero entrance animation using the preset
    heroEntranceAnimation({
      greeting: greetingRef.current || undefined,
      name: nameRef.current || undefined,
      title: titleRef.current || undefined,
      subtitle: subtitleRef.current || undefined,
      buttons: buttonsRef.current ? Array.from(buttonsRef.current.children) as HTMLElement[] : undefined,
      avatar: avatarRef.current || undefined,
    });

    // Animate background dots with scroll trigger
    if (bgDotsRef.current) {
      const primaryDots = bgDotsRef.current.querySelectorAll('.gsap-dot[class*="bg-orange"]');
      const secondaryDots = bgDotsRef.current.querySelectorAll('.gsap-dot[class*="bg-purple"]');
      const ambientOrbs = bgDotsRef.current.querySelectorAll('.gsap-dot[class*="bg-gradient"]');
      
      // Animate primary dots (orange)
      primaryDots.forEach((dot, i) => {
        gsap.to(dot, {
          x: `random(-120, 120)`,
          y: `random(-120, 120)`,
          scale: 'random(0.6, 1.4)',
          opacity: 'random(0.3, 0.8)',
          duration: 10 + Math.random() * 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
      
      // Animate secondary dots (purple) - different pattern
      secondaryDots.forEach((dot, i) => {
        gsap.to(dot, {
          x: `random(-80, 80)`,
          y: `random(-80, 80)`,
          scale: 'random(0.8, 1.6)',
          opacity: 'random(0.2, 0.6)',
          duration: 8 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: i * 0.4,
        });
      });
      
      // Animate ambient orbs - slow, atmospheric movement
      ambientOrbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-60, 60)`,
          y: `random(-60, 60)`,
          scale: 'random(0.9, 1.1)',
          opacity: 'random(0.3, 0.7)',
          duration: 20 + Math.random() * 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 1.5,
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

    // Skills section animations
    if (skillsRef.current) {
      const skillItems = skillsRef.current.querySelectorAll('.skill-item');
      skillItems.forEach((item, index) => {
        gsap.fromTo(item, 
          { 
            opacity: 0, 
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: 2.5 + index * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }, []);



  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900 py-16 lg:py-20">
      {/* Enhanced Unified Background Gradient System */}
      <div className="absolute inset-0 rounded-t-[3rem] lg:rounded-t-[4rem]">
        {/* Base foundation layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-t-[3rem] lg:rounded-t-[4rem]" />
        
        {/* Primary color layer - subtle orange warmth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/8 via-transparent to-orange-400/6" />
        
        {/* Secondary color layer - purple accent */}
        <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/6 via-transparent to-purple-600/8" />
        
        {/* Tertiary blending layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/3 to-transparent" />
        
        {/* Central radial focus */}
        <div className="absolute inset-0" 
             style={{
               background: 'radial-gradient(ellipse 80% 50% at 50% 45%, rgba(251, 146, 60, 0.04) 0%, transparent 60%)'
             }} />
        
        {/* Subtle diagonal accent */}
        <div className="absolute inset-0" 
             style={{
               background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.03) 0%, transparent 25%, transparent 75%, rgba(251, 146, 60, 0.03) 100%)'
             }} />
        
        {/* Atmospheric depth layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-gray-800/10" />
      </div>
      
      {/* Enhanced Animated Background Elements */}
      <div ref={bgDotsRef} className="absolute inset-0 overflow-hidden">
        {/* Primary floating particles - rounded squares */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`primary-${i}`}
            className="absolute w-3 h-3 bg-orange-400/40 rounded-lg gsap-dot shadow-lg"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Secondary accent particles - smaller rounded */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`secondary-${i}`}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-md gsap-dot shadow-md"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
        
        {/* Larger ambient orbs - soft rounded */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`ambient-${i}`}
            className="absolute w-24 h-24 bg-gradient-to-r from-orange-400/5 to-purple-400/5 rounded-3xl blur-xl gsap-dot"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 lg:px-8 space-y-16 lg:space-y-20">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Greeting */}
            <div ref={greetingRef} className="space-y-2">
              <p className="text-lg text-gray-400 font-medium">
              Hello, I&apos;m
              </p>
              <h1 ref={nameRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                {personalInfo.displayName}
              </span>
              </h1>
              <p ref={nameRef} className="text-xl text-gray-300 font-medium">
                <span className="bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
                  {personalInfo.fullName}
                </span>
              </p>
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
              <a
                href="/assets/resume.pdf"
                download
                className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-2xl hover:bg-gray-700/60 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20"
              >
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Download Resume
              </a>
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
                <Image
                  src={personalInfo.portrait}
                  alt={personalInfo.fullName}
                  width={384}
                  height={384}
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
                    'absolute tech-icon w-14 h-14 bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl flex items-center justify-center text-2xl shadow-lg cursor-pointer hover:bg-gray-700/70 hover:border-orange-500/50 hover:shadow-orange-500/20 transition-all duration-300',
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

        {/* Main Skills Section */}
        <motion.section 
          ref={skillsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="space-y-8"
        >
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 }}
            className="text-3xl sm:text-4xl font-bold text-white text-center"
          >
            Main Skills
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {mainSkills.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.4 + categoryIndex * 0.2 }}
                className="skill-item bg-gray-800/40 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-gray-700/40 hover:border-orange-500/40 hover:bg-gray-800/60 transition-all duration-500 group relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative z-10">
                <h4 className="text-xl font-semibold text-orange-400 mb-6 text-center group-hover:text-orange-300 transition-colors duration-300">
                  {category.title}
                </h4>
                <div className="flex flex-wrap gap-3 justify-center">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.6 + categoryIndex * 0.2 + skillIndex * 0.1 }}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group/skill shadow-md hover:shadow-lg hover:shadow-orange-500/20"
                    >
                      <div className="group-hover/skill:scale-125 transition-transform duration-300">
                        <SkillIcon skillId={skill.id} className="w-6 h-6 text-orange-400" />
                      </div>
                      <span className="text-base font-medium text-gray-300 group-hover/skill:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </section>
  );
};

export default Home;
