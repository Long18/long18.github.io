'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { personalInfo } from '../../data/personal';
import { mainSkills } from '../../data/skills';
import SkillIcon from '../ui/SkillIcon';
import { useAnimationPerformance } from '../../hooks/useAnimationPerformance';

interface HomeProps {
  onNavigate?: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const { performanceMode, isMobile, isClient } = useAnimationPerformance();

  // Button interaction states
  const [buttonStates, setButtonStates] = useState({
    viewWork: { isLoading: false, isPressed: false },
    downloadResume: { isLoading: false, isPressed: false, isSuccess: false },
    contact: { isLoading: false, isPressed: false },
  });

  // Performance-aware particle effects
  useEffect(() => {
    if (!isClient || performanceMode === 'low') return;

    // Simple constellation effect for background
    const createStars = () => {
      const stars = document.createElement('div');
      stars.className = 'fixed inset-0 pointer-events-none z-0';
      stars.innerHTML = Array.from({
        length: performanceMode === 'high' ? 50 : 25,
      })
        .map(() => {
          const size = Math.random() * 3 + 1;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          const opacity = Math.random() * 0.8 + 0.2;
          const duration = Math.random() * 3 + 2;

          return `
            <div 
              class="absolute rounded-full bg-orange-400/40 animate-twinkle"
              style="
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                opacity: ${opacity};
                animation-duration: ${duration}s;
                animation-delay: ${Math.random() * 2}s;
              "
            ></div>
          `;
        })
        .join('');

      document.body.appendChild(stars);

      return () => {
        document.body.removeChild(stars);
      };
    };

    const cleanup = createStars();
    return cleanup;
  }, [isClient, performanceMode]);

  const handleNavigation = async (
    section: string,
    buttonKey: keyof typeof buttonStates
  ) => {
    setButtonStates((prev) => ({
      ...prev,
      [buttonKey]: { ...prev[buttonKey], isLoading: true, isPressed: true },
    }));

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    if (onNavigate) {
      onNavigate(section);
    } else {
      const targetSection = document.getElementById(section);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }

    setButtonStates((prev) => ({
      ...prev,
      [buttonKey]: { ...prev[buttonKey], isLoading: false, isPressed: false },
    }));
  };

  const handleResumeDownload = async () => {
    setButtonStates((prev) => ({
      ...prev,
      downloadResume: { isLoading: true, isPressed: true, isSuccess: false },
    }));

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    setButtonStates((prev) => ({
      ...prev,
      downloadResume: { isLoading: false, isPressed: false, isSuccess: true },
    }));

    setTimeout(() => {
      setButtonStates((prev) => ({
        ...prev,
        downloadResume: { ...prev.downloadResume, isSuccess: false },
      }));
    }, 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-12 sm:py-16 animate-fade-in-up"
    >
      {/* Subtle accent patterns - unified with main design */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.05)_0%,transparent_50%)] animate-pulse-slow" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.03)_0%,transparent_50%)] animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(6,182,212,0.03)_0%,transparent_50%)] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Content */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-12">
          {/* Left Content */}
          <div className="max-w-xl animate-slide-in-left">
            {/* Greeting */}
            <div
              className="text-lg sm:text-xl font-semibold text-white-2 mb-4 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              Hello, I&apos;m
            </div>

            {/* Name with gradient */}
            <h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500 animate-gradient-shift">
                {personalInfo.displayName}
              </span>
            </h1>

            {/* Title and subtitle */}
            <div
              className="flex flex-col sm:flex-row sm:gap-4 mb-8 animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white-1 leading-tight mb-2 sm:mb-0">
                Game Developer
              </h2>
              <p className="text-lg sm:text-xl text-white-2 leading-relaxed">
                Creating immersive experiences with Unity & Unreal Engine
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className="space-y-6 animate-fade-in-up"
              style={{ animationDelay: '0.8s' }}
            >
              {/* Primary CTA */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavigation('portfolio', 'viewWork')}
                disabled={buttonStates.viewWork.isLoading}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden animate-scale-in"
                aria-label="View my portfolio"
              >
                {buttonStates.viewWork.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    <span className="relative z-10">Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10 mr-3">Explore My Games</span>
                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2 group-hover:scale-110" />
                  </>
                )}

                {/* Enhanced background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1200 ease-out"></div>

                {/* Ripple effect */}
                {buttonStates.viewWork.isPressed && (
                  <div className="absolute inset-0 rounded-2xl animate-ping bg-white/30"></div>
                )}
              </motion.button>

              {/* Secondary Actions */}
              <div
                className="flex items-center justify-center gap-8 text-sm animate-fade-in"
                style={{ animationDelay: '1s' }}
              >
                {/* Download Resume */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={personalInfo.resume}
                  download="William_Resume.pdf"
                  onClick={handleResumeDownload}
                  className="group flex items-center gap-2 text-white-2 hover:text-orange-400 transition-all duration-300 border-b border-transparent hover:border-orange-400/50 animate-float"
                  aria-label="Download resume PDF"
                >
                  {buttonStates.downloadResume.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : buttonStates.downloadResume.isSuccess ? (
                    <div className="w-4 h-4 text-green-400 animate-bounce">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Download className="w-4 h-4 group-hover:animate-bounce transition-transform duration-300" />
                  )}
                  <span className="font-medium">Download Resume</span>
                </motion.a>

                {/* Divider */}
                <div className="w-px h-4 bg-jet"></div>

                {/* Contact Link */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('contact', 'contact')}
                  className="group flex items-center gap-2 text-white-2 hover:text-purple-400 transition-all duration-300 border-b border-transparent hover:border-purple-400/50 animate-float"
                  style={{ animationDelay: '0.5s' }}
                  aria-label="Navigate to contact section"
                >
                  {buttonStates.contact.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="font-medium">Get In Touch</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Content - Avatar */}
          <div
            ref={avatarRef}
            className="relative flex items-center justify-center min-h-[400px] animate-slide-in-right"
          >
            {/* Avatar container with enhanced effects */}
            <div className="relative w-[400px] h-[400px] flex items-center justify-center overflow-visible">
              {/* Outer atmospheric rings */}
              <div className="absolute inset-0 rounded-full opacity-20 animate-pulse-slow bg-gradient-radial from-orange-400/20 via-purple-500/10 to-transparent" />
              <div
                className="absolute inset-4 rounded-full opacity-30 animate-pulse-slow bg-gradient-radial from-orange-400/25 via-purple-500/15 to-transparent"
                style={{ animationDelay: '1s' }}
              />

              {/* Rotating border ring */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full opacity-70 animate-spin-slow bg-gradient-conic from-orange-400 via-purple-500 to-orange-400 p-1">
                <div className="w-full h-full bg-eerie-black-1 rounded-full" />
              </div>

              {/* Avatar image */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-eerie-black-1 rounded-full p-1 shadow-2xl animate-scale-in"
                style={{ animationDelay: '0.6s' }}
              >
                <Image
                  src={personalInfo.portrait}
                  alt={personalInfo.fullName}
                  width={320}
                  height={320}
                  className="w-full h-full rounded-full object-cover shadow-lg hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400/0 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating tech icons for desktop */}
              {isClient && !isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    {
                      icon: '🎮',
                      position: 'top-8 left-8',
                      skill: 'Unity Engine',
                      delay: 0,
                    },
                    {
                      icon: '🛠️',
                      position: 'top-8 right-8',
                      skill: 'Unreal Engine',
                      delay: 0.5,
                    },
                    {
                      icon: '💎',
                      position: 'bottom-8 left-8',
                      skill: 'C# Expert',
                      delay: 1,
                    },
                    {
                      icon: '⚡',
                      position: 'bottom-8 right-8',
                      skill: 'C++/Modern C',
                      delay: 1.5,
                    },
                    {
                      icon: '🎯',
                      position: 'top-1/2 left-4',
                      skill: 'Game Dev',
                      delay: 2,
                    },
                    {
                      icon: '🔧',
                      position: 'top-1/2 right-4',
                      skill: 'Tools & IDE',
                      delay: 2.5,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`absolute ${item.position} text-3xl cursor-pointer group hover:scale-125 hover:rotate-12 transition-all duration-500 pointer-events-auto animate-float`}
                      style={{
                        animationDelay: `${item.delay}s`,
                        filter: 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.8))',
                      }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-purple-500/30 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                        <span className="relative z-10 block p-4 bg-eerie-black-2/90 backdrop-blur-md rounded-2xl border border-jet/50 shadow-2xl group-hover:shadow-orange-500/20 group-hover:border-orange-500/60 transition-all duration-500 group-hover:bg-eerie-black-1/90">
                          <span className="block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            {item.icon}
                          </span>
                        </span>
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-eerie-black-1 backdrop-blur-xl border border-orange-400/80 shadow-2xl shadow-orange-500/70 px-6 py-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-[9999]">
                          <div className="font-semibold text-orange-300 text-base">
                            {item.skill}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-orange-400/70"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile constellation */}
              {isClient && isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    {
                      icon: '🎮',
                      label: 'Unity Engine',
                      angle: 0,
                      radius: 140,
                      color: '#3b82f6',
                    },
                    {
                      icon: '🛠️',
                      label: 'Unreal Engine',
                      angle: 90,
                      radius: 120,
                      color: '#64748b',
                    },
                    {
                      icon: '💎',
                      label: 'C# Expert',
                      angle: 180,
                      radius: 160,
                      color: '#8b5cf6',
                    },
                    {
                      icon: '⚡',
                      label: 'C++/Modern C',
                      angle: 270,
                      radius: 135,
                      color: '#06b6d4',
                    },
                  ].map((item, index) => {
                    const orbitRadius = Math.min(item.radius * 0.6, 100);
                    const x =
                      Math.cos((item.angle * Math.PI) / 180) * orbitRadius;
                    const y =
                      Math.sin((item.angle * Math.PI) / 180) * orbitRadius;

                    return (
                      <div
                        key={index}
                        className="absolute group cursor-pointer animate-orbit-mobile"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                          zIndex: 5,
                          animationDuration: `${20 + index * 5}s`,
                          animationDelay: `${index * 0.5}s`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (navigator.vibrate) {
                            navigator.vibrate([30, 20, 50]);
                          }
                        }}
                      >
                        <div
                          className="relative w-16 h-16 backdrop-blur-sm border border-jet/60 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-all duration-700 hover:scale-125 hover:rotate-12"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.98))',
                            boxShadow: `0 0 20px ${item.color}60, inset 0 0 20px rgba(255, 255, 255, 0.1)`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <span
                            className="group-hover:scale-110 transition-all duration-500 relative z-10"
                            style={{
                              filter: `drop-shadow(0 0 8px ${item.color}80)`,
                              textShadow: `0 0 10px ${item.color}60`,
                            }}
                          >
                            {item.icon}
                          </span>
                          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-eerie-black-1 backdrop-blur-xl border border-orange-400/80 shadow-2xl shadow-orange-500/70 px-4 py-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-[9999]">
                            <div className="font-semibold text-orange-300 text-sm">
                              {item.label}
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-orange-400/70"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Skills Section */}
        <section
          ref={skillsRef}
          className="space-y-8 mt-24 animate-fade-in-up"
          style={{ animationDelay: '1.2s' }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white-1 text-center animate-slide-in-up">
            Main Skills
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {mainSkills.map((category, categoryIndex) => (
              <div
                key={category.title}
                className="bg-eerie-black-2/20 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-jet/20 hover:border-orange-500/30 hover:bg-eerie-black-2/30 transition-all duration-500 group relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-orange-500/10 animate-scale-in"
                style={{ animationDelay: `${1.4 + categoryIndex * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 via-transparent to-purple-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                <div className="relative z-10">
                  <h4 className="text-xl font-semibold text-orange-400 mb-6 text-center group-hover:text-orange-300 transition-colors duration-300">
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {category.skills.map((skill, skillIndex) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-3 px-4 py-3 bg-jet/30 backdrop-blur-sm rounded-xl border border-jet/30 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all duration-300 group/skill shadow-sm hover:shadow-md hover:shadow-orange-500/15 animate-fade-in"
                        style={{
                          animationDelay: `${
                            1.6 + categoryIndex * 0.2 + skillIndex * 0.1
                          }s`,
                        }}
                      >
                        <div className="group-hover/skill:scale-125 transition-transform duration-300">
                          <SkillIcon
                            skillId={skill.id}
                            className="w-6 h-6 text-orange-400"
                          />
                        </div>
                        <span className="text-base font-medium text-white-2 group-hover/skill:text-white-1 transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <section
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 py-8 mt-16 animate-fade-in-up"
          style={{ animationDelay: '2s' }}
        >
          {[
            { number: '15+', label: 'Projects Completed', icon: '🚀' },
            { number: '3+', label: 'Years Experience', icon: '⏰' },
            { number: '100%', label: 'Client Satisfaction', icon: '⭐' },
            { number: '24/7', label: 'Support Available', icon: '💬' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-eerie-black-2/15 backdrop-blur-sm border border-jet/20 rounded-xl hover:border-orange-500/30 hover:bg-eerie-black-2/25 transition-all duration-300 group animate-scale-in"
              style={{ animationDelay: `${2.2 + index * 0.1}s` }}
            >
              <div
                className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300 animate-bounce"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors duration-300 animate-count-up">
                {stat.number}
              </div>
              <div className="text-sm text-white-2 group-hover:text-white-1 transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </section>
      </div>
    </section>
  );
};

export default Home;
