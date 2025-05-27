'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { experiences, education } from '@/data/experience';

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
  index 
}: TimelineItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative pl-8 pb-8 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 to-transparent" />
      
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.2 + 0.1, type: "spring" }}
        className="absolute left-0 top-2 w-6 h-6 bg-orange-500 rounded-2xl border-4 border-gray-900 z-10 shadow-lg shadow-orange-500/20"
      />
      
      {/* Content */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/50 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <h4 className="text-orange-400 font-medium mb-2">{subtitle}</h4>
          </div>
          <div className="flex flex-col items-start md:items-end text-sm text-gray-400">
            <span className="bg-orange-500/20 backdrop-blur-sm text-orange-300 px-3 py-1 rounded-2xl whitespace-nowrap shadow-lg shadow-orange-500/10">
              {period}
            </span>
            {location && (
              <span className="mt-1 text-xs text-gray-500">{location}</span>
            )}
          </div>
        </div>
        
        {description && (
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}
        
        {achievements.length > 0 && (
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-200 mb-2">Key Achievements:</h5>
            <ul className="space-y-2">
              {achievements.map((achievement, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 0.3 + idx * 0.05 }}
                  className="text-xs text-gray-400 leading-relaxed flex items-start gap-2"
                >
                  <div className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
        
        {technologies.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-gray-200 mb-2">Technologies:</h5>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech, idx) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.5 + idx * 0.05 }}
                  className="text-xs bg-gray-700/50 backdrop-blur-sm text-gray-300 px-2 py-1 rounded-2xl hover:bg-orange-500/10 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-500"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ResumeProps {
  className?: string;
}

export default function Resume({ className = '' }: ResumeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`space-y-8 ${className}`}
    >
      {/* Experience Section */}
      <section className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white"
        >
          Experience
        </motion.h2>
        
        <div className="relative">
          {experiences.map((exp, index) => (
            <TimelineItem
              key={exp.id}
              title={exp.company}
              subtitle={exp.position}
              period={`${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}`}
              description={exp.description}
              achievements={exp.achievements}
              technologies={exp.technologies}
              location={exp.location}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white"
        >
          Education
        </motion.h2>
        
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
      </section>

      {/* Additional Info */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl p-6 border border-orange-500/20 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500"
      >
        <h3 className="text-lg font-semibold text-white mb-3">Professional Summary</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Passionate Game Developer with extensive experience in Unity and Unreal Engine development. 
          Specialized in creating scalable game systems using SOLID principles and modern development practices. 
          Proven track record of delivering high-quality games across mobile, web, and desktop platforms.
        </p>
      </motion.section>
    </motion.div>
  );
}