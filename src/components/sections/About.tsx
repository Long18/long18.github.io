'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { skillCategories } from '@/data/skills';
import SkillIcon from '@/components/ui/SkillIcon';
import {
  Briefcase,
  Code,
  Trophy,
  Target,
  Zap,
  Star,
  Download,
  Calendar,
  MapPin,
  Heart,
  Coffee,
  Gamepad2,
  Rocket,
  Sparkles,
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
    stats: '8+ Projects',
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
    stats: '20+ Projects',
    gradient: 'from-green-400 to-emerald-400',
    color: '#22c55e',
    achievements: ['Cross-Platform', 'Modern UI/UX', 'Scalable Architecture'],
    tech: ['React', 'TypeScript', 'Node.js', 'Mobile'],
  },
];

// Enhanced statistics with icons
const statistics = [
  { number: '3+', label: 'Years Experience', icon: Calendar, color: '#fb923c' },
  {
    number: '15+',
    label: 'Projects Completed',
    icon: Trophy,
    color: '#8b5cf6',
  },
  {
    number: '100%',
    label: 'Client Satisfaction',
    icon: Star,
    color: '#22c55e',
  },
  { number: '24/7', label: 'Code Passion', icon: Heart, color: '#ef4444' },
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
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [activeSkillCategory, setActiveSkillCategory] = useState<string | null>(
    null
  );

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  // Spring animations
  const springScale = useSpring(scale, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

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
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const fullText = personalInfo.aboutText.join(' ');

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible, fullText]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale: springScale }}
      className={`space-y-16 ${className} relative overflow-hidden`}
    >
      {/* 🌟 HERO SECTION - Enhanced Visual Appeal */}
      <motion.section ref={heroRef} style={{ y: springY }} className="relative">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-orange-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000" />

          {/* Floating particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/40 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Enhanced Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Profile Card with 3D effects */}
            <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl hover:shadow-orange-500/20 transition-all duration-700 group">
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-purple-500/5 to-cyan-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Profile Image with enhanced effects */}
              <div className="relative mb-6 flex justify-center">
                <div className="relative">
                  {/* Rotating rings around avatar */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-orange-400/30 animate-spin-slow"
                    style={{ padding: '20px' }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border border-purple-400/20 animate-reverse-spin"
                    style={{ padding: '30px' }}
                  />

                  {/* Avatar with glow effect */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700/50 shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-500">
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
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    y: isVisible ? 0 : 20,
                  }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold mb-2"
                >
                  <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                    {personalInfo.displayName}
                  </span>
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg text-gray-400 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-orange-400" />
                  {personalInfo.title}
                </motion.p>
              </div>

              {/* Personal Info with icons */}
              <div className="space-y-3 text-sm">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -20,
                  }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Born {personalInfo.birthday}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -20,
                  }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors duration-300"
                >
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>Ho Chi Minh City, Vietnam</span>
                </motion.div>
              </div>

              {/* Download Resume Button */}
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ delay: 0.9 }}
                href={personalInfo.resume}
                download="William_Resume.pdf"
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 group/btn"
              >
                <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                Download Resume
              </motion.a>
            </div>
          </motion.div>

          {/* Right: Animated About Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 bg-gradient-to-r from-orange-400 to-purple-500 rounded-2xl flex items-center justify-center"
              >
                <Target className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">About Me</h2>
            </div>

            {/* Typed text effect */}
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30">
              <div className="text-gray-300 leading-relaxed text-lg">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-6 bg-orange-400 ml-1"
                />
              </div>
            </div>

            {/* Fun Facts */}
            <div className="grid grid-cols-2 gap-4">
              {funFacts.map((fact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.8,
                  }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <fact.icon
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: fact.color }}
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                      {fact.text}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* 🌟 STATISTICS SECTION - Animated counters */}
      <motion.section
        ref={statsRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="relative"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5,
              }}
              transition={{
                delay: 1.4 + index * 0.1,
                type: 'spring',
                bounce: 0.4,
              }}
              className="relative text-center p-6 bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/30 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group cursor-pointer"
            >
              {/* Background glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{
                  background: `radial-gradient(circle, ${stat.color}40, transparent)`,
                }}
              />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center relative z-10"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </motion.div>

              {/* Number with counter animation */}
              <motion.div
                className="text-2xl lg:text-3xl font-bold mb-2 relative z-10"
                style={{ color: stat.color }}
              >
                {stat.number}
              </motion.div>

              {/* Label */}
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300 relative z-10">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🌟 SERVICES SECTION - Interactive cards */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 1.6 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-2xl flex items-center justify-center"
          >
            <Briefcase className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">What I'm Doing</h2>
        </div>

        <div className="grid gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                x: isVisible ? 0 : index % 2 === 0 ? -50 : 50,
              }}
              transition={{ delay: 1.8 + index * 0.2 }}
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              className="relative group"
            >
              {/* Background with gradient animation */}
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl blur-xl"
                style={{
                  background: `linear-gradient(135deg, ${service.color}40, transparent)`,
                }}
              />

              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 50%, ${service.color}40 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                      animation:
                        hoveredService === service.id
                          ? 'float 4s ease-in-out infinite'
                          : 'none',
                    }}
                  />
                </div>

                <div className="relative z-10 flex items-start gap-6">
                  {/* Enhanced Icon */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative w-16 h-16 flex items-center justify-center rounded-2xl overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`,
                      }}
                    >
                      {/* Rotating border */}
                      <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `conic-gradient(from 0deg, ${service.color}80, transparent, ${service.color}80)`,
                          animation:
                            hoveredService === service.id
                              ? 'spin 2s linear infinite'
                              : 'none',
                        }}
                      />

                      <div className="relative z-10 w-14 h-14 bg-gray-800/90 rounded-xl flex items-center justify-center">
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
                      <h4 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors duration-300">
                        {service.title}
                      </h4>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: hoveredService === service.id ? 1 : 0,
                        }}
                        className="bg-gradient-to-r from-orange-400 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
                      >
                        {service.stats}
                      </motion.div>
                    </div>

                    <p className="text-gray-400 leading-relaxed mb-4 group-hover:text-gray-300 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tech.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: 2 + index * 0.2 + techIndex * 0.1,
                          }}
                          className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-lg border border-gray-600/30 hover:border-orange-500/50 transition-all duration-300"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* Achievements */}
                    <div className="grid grid-cols-3 gap-2">
                      {service.achievements.map((achievement, achIndex) => (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 2.2 + index * 0.2 + achIndex * 0.1,
                          }}
                          className="text-xs text-center p-2 bg-gray-700/30 rounded-lg border border-gray-600/20 hover:border-orange-500/30 transition-all duration-300"
                        >
                          <Zap className="w-3 h-3 mx-auto mb-1 text-orange-400" />
                          <span className="text-gray-400">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 🌟 SKILLS SECTION - Interactive grid */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
        transition={{ duration: 0.8, delay: 2.5 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center"
          >
            <Code className="w-6 h-6 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Technical Skills</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ delay: 2.7 + categoryIndex * 0.1 }}
              onMouseEnter={() => setActiveSkillCategory(category.title)}
              onMouseLeave={() => setActiveSkillCategory(null)}
              className="relative bg-gray-800/30 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group overflow-hidden"
            >
              {/* Background animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

              {/* Floating particles for active category */}
              {activeSkillCategory === category.title && (
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
                      animate={{
                        x: [0, Math.random() * 100 - 50],
                        y: [0, Math.random() * 100 - 50],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </>
              )}

              <div className="relative z-10">
                <motion.h4
                  whileHover={{ scale: 1.05 }}
                  className="text-xl font-semibold text-orange-400 mb-6 flex items-center gap-3"
                >
                  <motion.div
                    animate={{
                      rotate: activeSkillCategory === category.title ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="w-8 h-8 bg-gradient-to-r from-orange-400 to-purple-500 rounded-lg flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  {category.title}
                </motion.h4>

                <div className="grid grid-cols-2 gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 2.9 + categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="flex items-center gap-3 p-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-500 group/skill cursor-pointer"
                    >
                      {/* Skill icon with glow */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-400/20 rounded-lg blur-sm opacity-0 group-hover/skill:opacity-100 transition-opacity duration-300" />
                        <div className="relative group-hover/skill:scale-125 transition-transform duration-500">
                          <SkillIcon
                            skillId={skill.id}
                            className="w-6 h-6 text-orange-400"
                          />
                        </div>
                      </div>

                      {/* Skill name */}
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-300 group-hover/skill:text-white transition-colors duration-500">
                          {skill.name}
                        </span>

                        {/* Skill level indicator */}
                        <div className="mt-1 h-1 bg-gray-600/50 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                skill.level === 'expert'
                                  ? '100%'
                                  : skill.level === 'advanced'
                                  ? '80%'
                                  : skill.level === 'intermediate'
                                  ? '60%'
                                  : '40%',
                            }}
                            transition={{
                              delay:
                                3 + categoryIndex * 0.1 + skillIndex * 0.05,
                              duration: 0.8,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
          animation-duration: 20s;
        }

        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
          animation-duration: 15s;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-reverse-spin {
          animation: reverse-spin 15s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
