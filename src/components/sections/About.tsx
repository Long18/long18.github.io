'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { personalInfo } from '@/data/personal';
import { skillCategories, mainSkills } from '@/data/skills';

const services = [
  {
    id: 'unity-development',
    title: 'Unity Development',
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/fb228421-e62a-4b30-916a-64f4bf5254b9',
    description: 'Creating immersive games and interactive experiences using Unity Engine for mobile, web, and desktop platforms.',
    className: 'unity-tag'
  },
  {
    id: 'unreal-development', 
    title: 'Unreal Development',
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/dae83be9-5b8b-483c-a84d-5a0332576ea0',
    description: 'Building high-quality 3D games and virtual experiences with Unreal Engine using C++ and Blueprints.',
    className: 'unreal-tag'
  },
  {
    id: 'application-development',
    title: 'Application Development', 
    icon: 'https://github.com/Long18/long18.github.io/assets/28853225/5bdf960a-bfe1-499e-b4e2-fb9fa0e19af2',
    description: 'Developing cross-platform applications using modern frameworks and technologies for various business needs.',
    className: 'application-tag'
  }
];

const skillLevelColors = {
  expert: 'bg-green-500',
  advanced: 'bg-blue-500', 
  intermediate: 'bg-yellow-500',
  beginner: 'bg-gray-500'
};

const skillLevelText = {
  expert: 'Expert',
  advanced: 'Advanced',
  intermediate: 'Intermediate', 
  beginner: 'Beginner'
};

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
              className="flex items-start gap-4 p-4 md:p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300 group"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-gray-700/50 rounded-xl group-hover:bg-orange-500/10 transition-colors duration-300">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={40}
                    height={40}
                    className="filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className={`text-lg font-semibold text-white mb-2 ${service.className}`}>
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

      {/* Main Skills Section */}
      <section className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="text-2xl font-bold text-white"
        >
          Main Skills
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainSkills.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + categoryIndex * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700/50"
            >
              <h4 className="text-lg font-semibold text-orange-400 mb-4">
                {category.title}
              </h4>
              <ul className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.li
                    key={skill}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="text-sm text-gray-300 flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Skills Section */}
      <section className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1 }}
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
              transition={{ delay: 1.2 + categoryIndex * 0.1 }}
              className="bg-gray-800/30 rounded-xl p-4 md:p-6 border border-gray-700/30"
            >
              <h4 className="text-lg font-semibold text-orange-400 mb-4">
                {category.title}
              </h4>
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + categoryIndex * 0.1 + skillIndex * 0.05 }}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-gray-300 flex-1 min-w-0">
                      {skill.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${skillLevelColors[skill.level]}`} />
                      <span className="text-xs text-gray-400 min-w-0">
                        {skillLevelText[skill.level]}
                      </span>
                    </div>
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