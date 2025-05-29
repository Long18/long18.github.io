'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { skillCategories } from '@/data/skills';
import SkillIcon from '@/components/ui/SkillIcon';

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
  },
];

interface AboutProps {
  className?: string;
}

export default function About({ className = '' }: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-8 ${className}`}
    >
      {/* About Text */}
      <section className="space-y-4">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-4"
        >
          About me
        </motion.h2>

        <div className="space-y-4 text-gray-300 leading-relaxed">
          {personalInfo.aboutText.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-sm md:text-base"
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white"
        >
          What I&apos;m Doing
        </motion.h2>

        <div className="grid gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-4 p-4 md:p-6 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 group"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gray-700/50 backdrop-blur-sm rounded-2xl group-hover:bg-orange-500/10 group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all duration-500">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4
                  className={`text-lg font-semibold text-white mb-2 ${service.className}`}
                >
                  {service.title}
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Skills Section */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="text-2xl font-bold text-white"
        >
          All Skills
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + categoryIndex * 0.1 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-3xl p-4 md:p-6 border border-gray-700/30 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500"
            >
              <h4 className="text-lg font-semibold text-orange-400 mb-4">
                {category.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.9 + categoryIndex * 0.1 + skillIndex * 0.05,
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-500 group"
                  >
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      <SkillIcon
                        skillId={skill.id}
                        className="w-5 h-5 text-orange-400"
                      />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-500">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
