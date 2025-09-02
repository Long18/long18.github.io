'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experiences, education } from '@/data/experience';
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Code2,
  Sparkles,
  Briefcase,
  Brain,
  Globe,
  Diamond,
  Lightbulb,
  Layers,
  ChevronRight,
  Download,
  Rocket,
  Trophy,
} from 'lucide-react';

interface TimelineItemProps {
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  achievements?: string[];
  technologies?: string[];
  location?: string;
  index: number;
}

function TimelineItem({
  title,
  subtitle,
  period,
  description,
  achievements = [],
  technologies = [],
  location,
  index,
}: TimelineItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const { performanceMode } = useAnimationPerformance();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = itemRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
      transition={{
        delay: index * 0.1,
        duration: performanceMode === 'low' ? 0.3 : 0.8,
      }}
      className="relative pl-8 pb-8 last:pb-0 group animate-slide-in-left"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-purple-500 to-transparent opacity-60" />

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ delay: index * 0.1 + 0.1, type: 'spring', bounce: 0.6 }}
        className="absolute left-0 top-2 z-10"
      >
        <div className="relative">
          {/* Pulsing rings - only for high performance */}
          {performanceMode === 'high' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="absolute inset-0 w-6 h-6 bg-orange-500/30 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3 + 0.5,
                }}
                className="absolute inset-0 w-6 h-6 bg-purple-500/20 rounded-full"
              />
            </>
          )}

          {/* Main dot */}
          <div className="relative w-6 h-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full border-4 border-eerie-black-1 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
            {performanceMode === 'high' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full opacity-60"
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div
        whileHover={performanceMode !== 'low' ? { y: -5, scale: 1.02 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-br from-eerie-black-1/80 to-eerie-black-2/80 backdrop-blur-xl rounded-3xl p-6 border border-jet/50 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden group/card"
      >
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-purple-500/5 to-cyan-400/5 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

        {/* Header section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2 group-hover/card:text-orange-400 transition-colors duration-300 animate-fade-in-up">
              <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </span>
            </h3>

            <h4 className="text-lg text-orange-400 font-semibold mb-3 flex items-center gap-2 animate-fade-in">
              <Sparkles className="w-5 h-5" />
              {subtitle}
            </h4>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 animate-scale-in">
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/10">
              <Calendar className="w-4 h-4" />
              <span className="font-medium whitespace-nowrap">{period}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm text-white-2/80">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="relative z-10 text-white-2 leading-relaxed mb-6 text-base animate-fade-in">
            {description}
          </p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div
            className="relative z-10 mb-6 animate-slide-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-orange-400" />
              <h5 className="font-semibold text-white-1">Key Achievements</h5>
            </div>
            <div className="grid gap-3">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-jet/30 backdrop-blur-sm rounded-2xl border border-jet/50 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group/achievement animate-scale-in"
                  style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                >
                  <motion.div
                    whileHover={
                      performanceMode !== 'low'
                        ? { scale: 1.2, rotate: 360 }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mt-2 flex-shrink-0 group-hover/achievement:shadow-lg group-hover/achievement:shadow-orange-500/50"
                  />
                  <span className="text-sm text-white-2 group-hover/achievement:text-white-1 transition-colors duration-300">
                    {achievement}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <div
            className="relative z-10 animate-slide-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-orange-400" />
              <h5 className="font-semibold text-white-1">Technologies</h5>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <motion.span
                  key={tech}
                  whileHover={
                    performanceMode !== 'low' ? { scale: 1.1, y: -2 } : {}
                  }
                  className="px-3 py-2 bg-gradient-to-r from-jet/50 to-eerie-black-1/50 backdrop-blur-sm text-white-2 rounded-xl border border-jet/50 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white-1 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer text-sm font-medium animate-scale-in"
                  style={{ animationDelay: `${0.5 + idx * 0.05}s` }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface ResumeProps {
  className?: string;
}

export default function Resume({ className = '' }: ResumeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>(
    'experience'
  );
  const [hasError, setHasError] = useState(false);

  const { performanceMode, isClient } = useAnimationPerformance();

  // Error boundary
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white-1 mb-4">Error Loading Resume</h2>
          <p className="text-white-2 mb-4">Something went wrong while loading the resume.</p>
          <button
            onClick={() => setHasError(false)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Tab data
  const tabs = [
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      count: experiences.length,
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      count: education.length,
    },
  ];

  try {
    return (
      <motion.div
        ref={containerRef}
        className={`relative min-h-screen overflow-hidden ${className} animate-fade-in-up`}
      >
      {/* Animated Background - Only for high performance */}
      {isClient && performanceMode === 'high' && (
        <div className="absolute inset-0 -z-10">
          {/* Gradient orbs */}
          <motion.div
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -150, 150, 0],
              y: [0, 150, -150, 0],
              scale: [0.8, 1.3, 0.9, 0.8],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-l from-cyan-500/15 to-purple-500/15 rounded-full blur-3xl"
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-orange-500/30 mb-6 animate-scale-in">
            <motion.div
              animate={performanceMode === 'high' ? { rotate: 360 } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="w-5 h-5 text-orange-400" />
            </motion.div>
            <span className="text-orange-300 font-semibold">
              Professional Journey
            </span>
          </div>

          <h1
            className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
              My Resume
            </span>
          </h1>

          <p
            className="text-xl text-white-2 max-w-3xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            A journey through my professional growth, showcasing the experiences
            and education that shaped my expertise in game development.
          </p>

          {/* Download CV Button */}
          <div
            className="mt-8 animate-scale-in"
            style={{ animationDelay: '0.4s' }}
          >
            <motion.button
              whileHover={performanceMode !== 'low' ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white-1 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Resume
              <motion.div
                animate={performanceMode === 'high' ? { x: [0, 5, 0] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </div>
        </div>



        {/* Tab Navigation */}
        <div
          className="flex justify-center mb-12 animate-slide-in-up"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="bg-eerie-black-2/50 backdrop-blur-xl rounded-2xl p-2 border border-jet/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'experience' | 'education')
                }
                whileHover={performanceMode !== 'low' ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.98 }}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white-1 shadow-lg shadow-orange-500/25'
                    : 'text-white-2 hover:text-white-1 hover:bg-eerie-black-1/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white-1/20' : 'bg-jet/50'
                  }`}
                >
                  {tab.count}
                </span>

                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-600 rounded-xl -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'experience' && (
            <motion.section
              key="experience"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
              onMouseEnter={() => setHoveredSection('experience')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center gap-4 mb-8 animate-slide-in-left">
                <motion.div
                  animate={{
                    rotate:
                      hoveredSection === 'experience' &&
                      performanceMode !== 'low'
                        ? 360
                        : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-3 rounded-2xl"
                >
                  <Briefcase className="w-8 h-8 text-orange-400" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white-1">
                    Professional Experience
                  </h2>
                  <p className="text-white-2">
                    Building amazing digital experiences
                  </p>
                </div>
              </div>

              <div className="relative">
                {experiences.map((exp, index) => (
                  <TimelineItem
                    key={exp.id}
                    title={exp.company}
                    subtitle={exp.position}
                    period={`${exp.startDate} — ${
                      exp.current ? 'Present' : exp.endDate
                    }`}
                    description={exp.description}
                    achievements={exp.achievements}
                    technologies={exp.technologies}
                    location={exp.location}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === 'education' && (
            <motion.section
              key="education"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
              onMouseEnter={() => setHoveredSection('education')}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <div className="flex items-center gap-4 mb-8 animate-slide-in-left">
                <motion.div
                  animate={{
                    rotate:
                      hoveredSection === 'education' &&
                      performanceMode !== 'low'
                        ? 360
                        : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-3 rounded-2xl"
                >
                  <GraduationCap className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white-1">Education</h2>
                  <p className="text-white-2">
                    Academic foundation and learning journey
                  </p>
                </div>
              </div>

              <div className="relative">
                {education.map((edu, index) => (
                  <TimelineItem
                    key={edu.id}
                    title={edu.institution}
                    subtitle={edu.degree}
                    period={`${edu.startDate} — ${edu.endDate}`}
                    description={edu.description}
                    achievements={edu.achievements}
                    index={index}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Skills Highlight */}
        <section
          className="mt-20 animate-slide-in-up"
          style={{ animationDelay: '1s' }}
        >
          <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={
                      performanceMode === 'high' ? { rotate: [0, 360] } : {}
                    }
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-3 rounded-2xl"
                  >
                    <Brain className="w-8 h-8 text-orange-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-white-1">
                      Core Expertise
                    </h3>
                    <p className="text-white-2">
                      Technologies I&apos;m passionate about
                    </p>
                  </div>
                </div>

                <motion.div
                  whileHover={
                    performanceMode !== 'low' ? { scale: 1.1, rotate: 180 } : {}
                  }
                  transition={{ duration: 0.3 }}
                  className="text-orange-400"
                >
                  <Lightbulb className="w-8 h-8" />
                </motion.div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Game Development',
                    skills: ['Unity', 'Unreal Engine', 'C#', 'C++'],
                    icon: Rocket,
                    color: 'orange',
                  },
                  {
                    title: 'Web Technologies',
                    skills: ['React', 'TypeScript', 'Node.js', 'Next.js'],
                    icon: Globe,
                    color: 'purple',
                  },
                  {
                    title: 'Development Practices',
                    skills: [
                      'SOLID Principles',
                      'Design Patterns',
                      'Agile',
                      'CI/CD',
                    ],
                    icon: Layers,
                    color: 'cyan',
                  },
                ].map((category, index) => (
                  <motion.div
                    key={category.title}
                    whileHover={
                      performanceMode !== 'low' ? { scale: 1.05, y: -5 } : {}
                    }
                    className="bg-eerie-black-2/50 backdrop-blur-sm rounded-2xl p-6 border border-jet/30 hover:border-orange-500/50 transition-all duration-300 group animate-scale-in"
                    style={{ animationDelay: `${1.1 + index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        whileHover={
                          performanceMode !== 'low' ? { rotate: 360 } : {}
                        }
                        transition={{ duration: 0.6 }}
                        className={`bg-gradient-to-r from-${category.color}-500/20 to-${category.color}-600/20 p-2 rounded-xl`}
                      >
                        <category.icon
                          className={`w-6 h-6 text-${category.color}-400`}
                        />
                      </motion.div>
                      <h4 className="font-semibold text-white-1 group-hover:text-orange-300 transition-colors duration-300">
                        {category.title}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {category.skills.map((skill, idx) => (
                        <div
                          key={skill}
                          className="flex items-center gap-2 text-sm text-white-2 group-hover:text-white-1 transition-colors duration-300 animate-fade-in"
                          style={{
                            animationDelay: `${
                              1.2 + index * 0.1 + idx * 0.05
                            }s`,
                          }}
                        >
                          <motion.div
                            whileHover={
                              performanceMode !== 'low' ? { scale: 1.3 } : {}
                            }
                            className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"
                          />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
  } catch (error) {
    console.error('Resume component error:', error);
    setHasError(true);
    return null;
  }
}
