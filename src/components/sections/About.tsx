'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { skillCategories } from '@/data/skills';
import SkillIcon from '@/components/ui/SkillIcon';
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance';
import {
  Briefcase,
  Code,
  Target,
  Zap,
  Download,
  Calendar,
  MapPin,
  Coffee,
  Gamepad2,
  Rocket,
  Sparkles,
  Info,
} from 'lucide-react';

const services = [
  {
    id: 'unity-development',
    title: 'Unity Development',
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/fb228421-e62a-4b30-916a-64f4bf5254b9',
    description:
      'Creating immersive games and interactive experiences using Unity Engine for mobile, web, and desktop platforms.',
    className: 'unity-tag',
    stats: '15+ Projects',
    gradient: 'from-blue-400 to-cyan-400',
    color: '#3b82f6',
    achievements: ['Mobile Games', 'VR Experiences', '2D/3D Games'],
    tech: ['C#', 'Unity', 'Mobile', 'WebGL'],
  },
  {
    id: 'unreal-development',
    title: 'Unreal Development',
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/dae83be9-5b8b-483c-a84d-5a0332576ea0',
    description:
      'Building high-quality 3D games and virtual experiences with Unreal Engine using C++ and Blueprints.',
    className: 'unreal-tag',
    stats: '2+ Projects',
    gradient: 'from-purple-400 to-indigo-400',
    color: '#8b5cf6',
    achievements: ['AAA Quality', 'C++ Programming', 'Blueprint Visual'],
    tech: ['C++', 'Blueprints', 'UE5', '3D Graphics'],
  },
  {
    id: 'application-development',
    title: 'Application Development',
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/5bdf960a-bfe1-499e-b4e2-fb9fa0e19af2',
    description:
      'Developing cross-platform applications using modern frameworks and technologies for various business needs.',
    className: 'application-tag',
    stats: '3+ Projects',
    gradient: 'from-green-400 to-emerald-400',
    color: '#22c55e',
    achievements: ['Cross-Platform', 'Modern UI/UX', 'Scalable Architecture'],
    tech: ['React', 'TypeScript', 'Node.js', 'Mobile'],
  },
];



// Fun facts about me
const funFacts = [
  { icon: Coffee, text: 'Coffee-driven developer ☕', color: '#f59e0b' },
  { icon: Gamepad2, text: 'Gaming enthusiast 🎮', color: '#3b82f6' },
  { icon: Code, text: 'Code architect 🏗️', color: '#8b5cf6' },
  { icon: Rocket, text: 'Innovation seeker 🚀', color: '#22c55e' },
];

interface AboutProps {
  className?: string;
}

export default function About({ className = '' }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [activeSkillCategory, setActiveSkillCategory] = useState<string | null>(
    null
  );
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const { performanceMode, isMobile, isClient } = useAnimationPerformance();

  // Close mobile tooltip when switching to desktop or on escape key
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && hoveredSkill) {
        setHoveredSkill(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hoveredSkill) {
        setHoveredSkill(null);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hoveredSkill]);

  // Intersection Observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typing animation for about text
  const [typedText, setTypedText] = useState('');
  const fullText = personalInfo.aboutText.join(' ');

  useEffect(() => {
    if (!isVisible || performanceMode === 'low') {
      setTypedText(fullText);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [isVisible, fullText, performanceMode]);

  // Animation variants based on performance mode
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: performanceMode === 'low' ? 0 : 0.2,
        duration: performanceMode === 'low' ? 0.3 : 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: performanceMode === 'low' ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: performanceMode === 'low' ? 0.3 : 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        className={`space-y-16 ${className} relative overflow-hidden animate-fade-in-up`}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {/* Background Effects - Only for high performance */}
        {isClient && performanceMode === 'high' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </div>
        )}

        {/* Hero Section */}
        <motion.section variants={itemVariants} className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Enhanced Profile Card */}
            <motion.div
              variants={itemVariants}
              className="relative animate-slide-in-left"
            >
              <div className="relative bg-gradient-to-br from-eerie-black-1/80 to-eerie-black-2/80 backdrop-blur-xl rounded-3xl p-8 border border-jet/50 shadow-2xl hover:shadow-orange-500/20 transition-all duration-700 group">
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-purple-500/5 to-cyan-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Profile Image with enhanced effects */}
                <div className="relative mb-6 flex justify-center">
                  <div className="relative">
                    {/* Rotating rings around avatar - only for high performance */}
                    {performanceMode === 'high' && (
                      <>
                        <div
                          className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-spin-slow"
                          style={{ padding: '20px' }}
                        />
                        <div
                          className="absolute inset-0 rounded-full border border-purple-400/20 animate-reverse-spin"
                          style={{ padding: '30px' }}
                        />
                      </>
                    )}

                    {/* Avatar with glow effect */}
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-jet/50 shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-500 animate-scale-in">
                      <Image
                        src={personalInfo.portrait}
                        alt={personalInfo.fullName}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                </div>

                {/* Name and Title with animated gradients */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 animate-fade-in-up">
                    <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-shift">
                      {personalInfo.displayName}
                    </span>
                  </h3>

                  <p className="text-lg text-white-2 flex items-center justify-center gap-2 animate-fade-in">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    {personalInfo.title}
                  </p>
                </div>

                {/* Personal Info with icons */}
                <div
                  className="space-y-3 text-sm animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="flex items-center gap-3 text-white-2 hover:text-orange-400 transition-colors duration-300">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Born {personalInfo.birthday}</span>
                  </div>

                  <div className="flex items-center gap-3 text-white-2 hover:text-orange-400 transition-colors duration-300">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>Ho Chi Minh City, Vietnam</span>
                  </div>
                </div>

                {/* Download Resume Button */}
                <motion.a
                  whileHover={performanceMode !== 'low' ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  href={personalInfo.resume}
                  download="William_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-20 mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white-1 py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group/btn animate-scale-in cursor-pointer"
                  style={{ animationDelay: '0.6s' }}
                >
                  <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                  Download Resume
                </motion.a>
              </div>
            </motion.div>

            {/* Right: Animated About Text */}
            <motion.div
              variants={itemVariants}
              className="space-y-6 animate-slide-in-right"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={performanceMode === 'high' ? { rotate: 360 } : {}}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-12 h-12 bg-gradient-to-r from-orange-400 to-purple-500 rounded-2xl flex items-center justify-center"
                >
                  <Target className="w-6 h-6 text-white-1" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white-1">About Me</h2>
              </div>

              {/* Typed text effect */}
              <div className="relative bg-eerie-black-2/50 backdrop-blur-sm rounded-2xl p-6 border border-jet/30">
                <div className="text-white-2 leading-relaxed text-lg">
                  {typedText}
                  {performanceMode !== 'low' && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block w-0.5 h-6 bg-orange-400 ml-1"
                    />
                  )}
                </div>
              </div>

              {/* Fun Facts */}
              <div className="grid grid-cols-2 gap-4">
                {funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-eerie-black-2/30 backdrop-blur-sm rounded-xl p-4 border border-jet/30 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer animate-scale-in"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <fact.icon
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: fact.color }}
                      />
                      <span className="text-sm text-white-2 group-hover:text-white-1 transition-colors duration-300">
                        {fact.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>



        {/* Services Section */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={performanceMode === 'high' ? { rotate: [0, 360] } : {}}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center"
            >
              <Briefcase className="w-6 h-6 text-white-1" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white-1">
              What I&apos;m Doing
            </h2>
          </div>

          <div className="grid gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative group animate-slide-in-up"
                style={{ animationDelay: `${1.6 + index * 0.2}s` }}
              >
                <div className="relative bg-eerie-black-2/50 backdrop-blur-sm rounded-3xl p-6 border border-jet/50 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden">
                  <div className="relative z-10 flex items-start gap-6">
                    {/* Enhanced Icon */}
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={
                          performanceMode !== 'low'
                            ? { scale: 1.1, rotate: 5 }
                            : {}
                        }
                        className="relative w-16 h-16 flex items-center justify-center rounded-2xl overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                        }}
                      >
                        <div className="relative z-10 w-14 h-14 bg-eerie-black-2/90 rounded-xl flex items-center justify-center">
                          <Image
                            src={service.icon}
                            alt={service.title}
                            width={32}
                            height={32}
                            className="filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-semibold text-white-1 group-hover:text-orange-400 transition-colors duration-300">
                          {service.title}
                        </h4>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{
                            scale: hoveredService === service.id ? 1 : 0,
                          }}
                          className="bg-gradient-to-r from-orange-400 to-purple-500 text-white-1 text-xs px-3 py-1 rounded-full font-semibold"
                        >
                          {service.stats}
                        </motion.div>
                      </div>

                      <p className="text-white-2/80 leading-relaxed mb-4 group-hover:text-white-2 transition-colors duration-300">
                        {service.description}
                      </p>

                      {/* Tech stack */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {service.tech.map((tech, techIndex) => (
                          <span
                            key={tech}
                            className="text-xs px-2 py-1 bg-jet/50 text-white-2 rounded-lg border border-jet/50 hover:border-orange-500/50 transition-all duration-300 animate-fade-in"
                            style={{
                              animationDelay: `${
                                1.8 + index * 0.2 + techIndex * 0.1
                              }s`,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="grid grid-cols-3 gap-2">
                        {service.achievements.map((achievement, achIndex) => (
                          <div
                            key={achievement}
                            className="text-xs text-center p-2 bg-jet/30 rounded-lg border border-jet/20 hover:border-orange-500/30 transition-all duration-300 animate-scale-in"
                            style={{
                              animationDelay: `${
                                2 + index * 0.2 + achIndex * 0.1
                              }s`,
                            }}
                          >
                            <Zap className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                            <span className="text-white-2/80">
                              {achievement}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3 mb-8">
            <motion.div
              animate={performanceMode === 'high' ? { rotate: [0, 360] } : {}}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center"
            >
              <Code className="w-6 h-6 text-white-1" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white-1">
              Technical Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                variants={itemVariants}
                onMouseEnter={() => setActiveSkillCategory(category.title)}
                onMouseLeave={() => setActiveSkillCategory(null)}
                className="relative bg-eerie-black-2/30 backdrop-blur-sm rounded-3xl p-6 border border-jet/30 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group overflow-visible animate-slide-in-up"
                style={{ animationDelay: `${2.4 + categoryIndex * 0.1}s` }}
              >
                {/* Background animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                <div className="relative z-10">
                  <motion.h4
                    whileHover={
                      performanceMode !== 'low' ? { scale: 1.05 } : {}
                    }
                    className="text-xl font-semibold text-orange-400 mb-6 flex items-center gap-3"
                  >
                    <motion.div
                      animate={{
                        rotate:
                          activeSkillCategory === category.title &&
                          performanceMode !== 'low'
                            ? 360
                            : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-500 rounded-lg flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 text-white-1" />
                    </motion.div>
                    {category.title}
                  </motion.h4>

                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <div key={skill.id} className="relative group/tooltip">
                        <motion.div
                          variants={itemVariants}
                          whileHover={
                            performanceMode !== 'low' && !isMobile
                              ? { scale: 1.05, y: -2 }
                              : {}
                          }
                          whileTap={
                            isMobile
                              ? { scale: 0.95 }
                              : {}
                          }
                          onMouseEnter={() =>
                            !isMobile && setHoveredSkill(skill.id)
                          }
                          onMouseLeave={() =>
                            !isMobile && setHoveredSkill(null)
                          }
                          onTouchStart={() => {
                            if (isMobile && navigator.vibrate) {
                              navigator.vibrate(50); // Haptic feedback
                            }
                          }}
                          onClick={(e) => {
                            if (isMobile) {
                              e.preventDefault();
                              e.stopPropagation();
                              setHoveredSkill(
                                hoveredSkill === skill.id ? null : skill.id
                              );
                            }
                          }}
                          className="flex items-center gap-3 px-4 py-3 bg-jet/50 backdrop-blur-sm rounded-2xl border border-jet/50 hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-500 group/skill cursor-pointer animate-scale-in select-none"
                          style={{
                            animationDelay: `${
                              2.6 + categoryIndex * 0.1 + skillIndex * 0.05
                            }s`,
                          }}
                        >
                          {/* Skill icon */}
                          <div className="relative group-hover/skill:scale-110 transition-transform duration-500">
                            <SkillIcon
                              skillId={skill.id}
                              className="w-5 h-5 text-orange-400 group-hover/skill:text-orange-300"
                            />
                          </div>

                          {/* Skill name */}
                          <span className="text-sm font-medium text-white-2 group-hover/skill:text-white-1 transition-colors duration-500 whitespace-nowrap">
                            {skill.name}
                          </span>

                          {/* Info icon for skills with descriptions */}
                          {skill.description && (
                            <motion.div
                              animate={isMobile && hoveredSkill === skill.id ? {
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.2, 1]
                              } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <Info className="w-3 h-3 text-white-2/60 group-hover/skill:text-orange-400 transition-colors duration-300" />
                            </motion.div>
                          )}

                          {/* Mobile tap indicator */}
                          {isMobile && skill.description && (
                            <div className="ml-auto text-xs text-white-2/60 group-hover/skill:text-orange-400 transition-colors duration-300">
                              Tap
                            </div>
                          )}
                        </motion.div>

                        {/* Desktop Tooltip */}
                        {skill.description &&
                          hoveredSkill === skill.id &&
                          !isMobile && (
                            <motion.div
                              initial={{ opacity: 0, y: 15, scale: 0.6 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 15, scale: 0.6 }}
                              transition={{
                                duration: 0.4,
                                type: 'spring',
                                damping: 8,
                                stiffness: 400,
                              }}
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 z-[100] pointer-events-auto"
                            >
                              <div className="bg-eerie-black-1 backdrop-blur-xl border border-orange-400/80 shadow-2xl shadow-orange-500/70 max-w-80 px-6 py-5 rounded-2xl text-white-1 text-center">
                                <div className="font-semibold text-orange-300 mb-4 text-lg">
                                  {skill.name}
                                </div>
                                <div className="text-white-1/95 leading-relaxed text-base">
                                  {skill.description}
                                </div>
                                {/* Tooltip arrow */}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-orange-400/70"></div>
                              </div>
                            </motion.div>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </motion.div>

      {/* Enhanced Mobile Tooltip Portal */}
      {isMobile && hoveredSkill && (
        <>
          {/* Global backdrop overlay with enhanced mobile UX */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[9998]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setHoveredSkill(null);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setHoveredSkill(null);
            }}
          />

          {/* Enhanced Mobile tooltip modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed inset-0 flex items-center justify-center z-[9999] p-6 pointer-events-none"
          >
            <motion.div
              layoutId={`skill-${hoveredSkill}`}
              className="bg-gradient-to-br from-eerie-black-1/98 to-eerie-black-2/98 backdrop-blur-xl border-2 border-orange-400/60 shadow-2xl shadow-orange-500/50 w-full max-w-sm rounded-3xl overflow-hidden pointer-events-auto"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {(() => {
                type SkillType = {
                  id: string;
                  name: string;
                  category:
                    | 'programming'
                    | 'game-engines'
                    | 'tools'
                    | 'soft-skills';
                  description: string;
                };

                const currentSkill = skillCategories
                  .flatMap((cat) => cat.skills as SkillType[])
                  .find((skill: SkillType) => skill.id === hoveredSkill);

                return currentSkill ? (
                  <>
                    {/* Header with gradient background */}
                    <div className="bg-gradient-to-r from-orange-400/20 to-purple-500/20 p-6 text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-purple-500 rounded-2xl flex items-center justify-center"
                      >
                        <SkillIcon
                          skillId={currentSkill.id}
                          className="w-8 h-8 text-white"
                        />
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-bold text-orange-300 text-xl"
                      >
                        {currentSkill.name}
                      </motion.h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white-1/95 leading-relaxed text-base mb-6"
                      >
                        {currentSkill.description}
                      </motion.p>

                      {/* Close instruction */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center justify-center gap-2 pt-4 border-t border-orange-500/30 text-white-2/80 text-sm"
                      >
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 bg-orange-400 rounded-full"
                        />
                        <span>Tap outside to close</span>
                      </motion.div>
                    </div>
                  </>
                ) : null;
              })()}
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
}
