'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { experiences, education } from '@/data/experience';
import {
  GraduationCap,
  Calendar,
  MapPin,
  Code2,
  Sparkles,
  Trophy,
  Rocket,
  Star,
  Briefcase,
  Brain,
  Globe,
  Diamond,
  Lightbulb,
  Layers,
  ChevronRight,
  Users,
  Download,
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
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative pl-8 pb-8 last:pb-0 group"
    >
      {/* Enhanced Timeline line with gradient */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-purple-500 to-transparent opacity-60" />

      {/* Floating particles around timeline */}
      {isHovered && (
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/60 rounded-full"
              animate={{
                x: [0, Math.random() * 60 - 30],
                y: [0, Math.random() * 60 - 30],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: '12px',
                top: '8px',
              }}
            />
          ))}
        </>
      )}

      {/* Enhanced Timeline dot with pulsing effect */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ delay: index * 0.2 + 0.1, type: 'spring', bounce: 0.6 }}
        className="absolute left-0 top-2 z-10"
      >
        <div className="relative">
          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
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

          {/* Main dot */}
          <div className="relative w-6 h-6 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full border-4 border-gray-900 shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-all duration-300">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-1 bg-gradient-to-r from-orange-400 to-purple-500 rounded-full opacity-60"
            />
          </div>
        </div>
      </motion.div>

      {/* Enhanced Content Card */}
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 overflow-hidden group/card"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #f97316 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              animation: isHovered ? 'float 4s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-purple-500/5 to-cyan-400/5 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

        {/* Header section */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              className="text-xl font-bold mb-2 group-hover/card:text-orange-400 transition-colors duration-300"
            >
              <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h3>

            <motion.h4
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
              transition={{ delay: index * 0.2 + 0.4 }}
              className="text-lg text-orange-400 font-semibold mb-3 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {subtitle}
            </motion.h4>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ delay: index * 0.2 + 0.5 }}
            className="flex flex-col items-start md:items-end gap-2"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-2xl border border-orange-500/30 shadow-lg shadow-orange-500/10">
              <Calendar className="w-4 h-4" />
              <span className="font-medium whitespace-nowrap">{period}</span>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-3 h-3" />
                <span>{location}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: index * 0.2 + 0.6 }}
            className="relative z-10 text-gray-300 leading-relaxed mb-6 text-base"
          >
            {description}
          </motion.p>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: index * 0.2 + 0.7 }}
            className="relative z-10 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-orange-400" />
              <h5 className="font-semibold text-gray-200">Key Achievements</h5>
            </div>
            <div className="grid gap-3">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    x: isVisible ? 0 : -20,
                  }}
                  transition={{ delay: index * 0.2 + 0.8 + idx * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-700/30 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group/achievement"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                    className="w-2 h-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mt-2 flex-shrink-0 group-hover/achievement:shadow-lg group-hover/achievement:shadow-orange-500/50"
                  />
                  <span className="text-sm text-gray-300 group-hover/achievement:text-white transition-colors duration-300">
                    {achievement}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Technologies */}
        {technologies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: index * 0.2 + 0.9 }}
            className="relative z-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-5 h-5 text-orange-400" />
              <h5 className="font-semibold text-gray-200">Technologies</h5>
            </div>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: isVisible ? 1 : 0.8,
                  }}
                  transition={{ delay: index * 0.2 + 1 + idx * 0.05 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="px-3 py-2 bg-gradient-to-r from-gray-700/50 to-gray-600/50 backdrop-blur-sm text-gray-300 rounded-xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer text-sm font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>(
    'experience'
  );

  // Animated values
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );
  const springY = useSpring(y, { stiffness: 400, damping: 90 });

  // Stats data with animations
  const stats = [
    {
      icon: Trophy,
      label: 'Years Experience',
      value: '3+',
      color: 'orange',
      delay: 0.1,
    },
    {
      icon: Rocket,
      label: 'Projects Completed',
      value: '16+',
      color: 'purple',
      delay: 0.2,
    },
    {
      icon: Star,
      label: 'Technologies',
      value: '20+',
      color: 'cyan',
      delay: 0.3,
    },
    {
      icon: Users,
      label: 'Team Projects',
      value: '10+',
      color: 'emerald',
      delay: 0.4,
    },
  ];

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

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity }}
      className={`relative min-h-screen overflow-hidden ${className}`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Floating particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

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

      <motion.div
        style={{ y: springY, scale }}
        className="relative z-10 max-w-6xl mx-auto px-6 py-16"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', bounce: 0.6 }}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-xl px-6 py-3 rounded-full border border-orange-500/30 mb-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <Diamond className="w-5 h-5 text-orange-400" />
            </motion.div>
            <span className="text-orange-300 font-semibold">
              Professional Journey
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-text">
              My Resume
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            A journey through my professional growth, showcasing the experiences
            and education that shaped my expertise in game development.
          </motion.p>

          {/* Download CV Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 group"
            >
              <Download className="w-5 h-5 group-hover:animate-bounce" />
              Download Resume
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: stat.delay, type: 'spring', bounce: 0.4 }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 text-center overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-${stat.color}-500/20 to-${stat.color}-600/20 rounded-2xl mb-4 relative z-10`}
                >
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: stat.delay + 0.2 }}
                  className="text-3xl font-bold text-white mb-2 relative z-10"
                >
                  {stat.value}
                </motion.h3>

                <p className="text-gray-300 text-sm font-medium relative z-10">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/50">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id as 'experience' | 'education')
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-lg shadow-orange-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-600/50'
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
        </motion.div>

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <motion.div
                  animate={{
                    rotate: hoveredSection === 'experience' ? 360 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-3 rounded-2xl"
                >
                  <Briefcase className="w-8 h-8 text-orange-400" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Professional Experience
                  </h2>
                  <p className="text-gray-400">
                    Building amazing digital experiences
                  </p>
                </div>
              </motion.div>

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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-4 mb-8"
              >
                <motion.div
                  animate={{ rotate: hoveredSection === 'education' ? 360 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-3 rounded-2xl"
                >
                  <GraduationCap className="w-8 h-8 text-cyan-400" />
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Education</h2>
                  <p className="text-gray-400">
                    Academic foundation and learning journey
                  </p>
                </div>
              </motion.div>

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
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-full h-full"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, #f97316 2px, transparent 2px)',
                  backgroundSize: '30px 30px',
                }}
              />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
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
                    <h3 className="text-2xl font-bold text-white">
                      Core Expertise
                    </h3>
                    <p className="text-gray-400">
                      Technologies I&apos;m passionate about
                    </p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 180 }}
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-orange-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`bg-gradient-to-r from-${category.color}-500/20 to-${category.color}-600/20 p-2 rounded-xl`}
                      >
                        <category.icon
                          className={`w-6 h-6 text-${category.color}-400`}
                        />
                      </motion.div>
                      <h4 className="font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
                        {category.title}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      {category.skills.map((skill, idx) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.6 + index * 0.2 + idx * 0.1 }}
                          className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300"
                        >
                          <motion.div
                            whileHover={{ scale: 1.3 }}
                            className="w-1.5 h-1.5 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"
                          />
                          {skill}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes gradient-text {
          0%,
          100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-text {
          animation: gradient-text 4s ease infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
