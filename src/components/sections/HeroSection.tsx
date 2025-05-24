// 'use client';

// import React, { useRef, useEffect } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { ArrowDown, Download, Mail, Github, Linkedin } from 'lucide-react';
// import { useTranslation } from 'react-i18next';
// import { cn } from '../../utils';
// import { personalInfo, contactInfo } from '../../data/personal';

// gsap.registerPlugin(ScrollTrigger);

// const HeroSection: React.FC = () => {
//   const { t } = useTranslation();
  
//   // Ref for rotating border ring
//   const ringRef = useRef<HTMLDivElement>(null);
//   // Refs for GSAP
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const greetingRef = useRef<HTMLDivElement>(null);
//   const nameRef = useRef<HTMLHeadingElement>(null);
//   const titleRef = useRef<HTMLHeadingElement>(null);
//   const bgDotsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;
//     // Section entrance animation
//     if (sectionRef.current) {
//       gsap.fromTo(
//         sectionRef.current,
//         { opacity: 0, y: 80 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: 1,
//           ease: 'power3.out',
//           scrollTrigger: {
//             trigger: sectionRef.current,
//             start: 'top 80%',
//             once: true,
//           },
//         }
//       );
//     }
//     // Greeting and name animations
//     if (greetingRef.current && nameRef.current) {
//       gsap.fromTo(
//         greetingRef.current,
//         { opacity: 0, y: 30 },
//         { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power2.out' }
//       );
//       gsap.fromTo(
//         nameRef.current,
//         { opacity: 0, y: 40 },
//         { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power2.out' }
//       );
//     }
//     // Title animation
//     if (titleRef.current) {
//       gsap.fromTo(
//         titleRef.current,
//         { opacity: 0, y: 20 },
//         { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power2.out' }
//       );
//     }
//     // Animate background dots
//     if (bgDotsRef.current) {
//       const dots = bgDotsRef.current.querySelectorAll('.gsap-dot');
//       dots.forEach((dot, i) => {
//         gsap.to(dot, {
//           x: `random(-100, 100)`,
//           y: `random(-100, 100)`,
//           scale: 'random(0.8, 1.5)',
//           opacity: 'random(0.2, 0.7)',
//           duration: 8 + Math.random() * 8,
//           repeat: -1,
//           yoyo: true,
//           ease: 'sine.inOut',
//           delay: i * 0.2,
//         });
//       });
//     }
//     // Rotate border ring continuously
//     if (ringRef.current) {
//       gsap.to(ringRef.current, {
//         rotation: 360,
//         duration: 20,
//         ease: 'linear',
//         repeat: -1,
//       });
//     }
//     // Floating tech icons animation
//     const techIcons = document.querySelectorAll('.tech-icon');
//     techIcons.forEach(icon => {
//       const delay = parseFloat(icon.getAttribute('data-delay') || '0');
//       gsap.to(icon, {
//         y: -10,
//         duration: 3,
//         ease: 'sine.inOut',
//         yoyo: true,
//         repeat: -1,
//         delay,
//       });
//     });
//   }, []);

//   const scrollToAbout = () => {
//     const aboutSection = document.getElementById('about');
//     if (aboutSection) {
//       aboutSection.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const socialLinks = [
//     { icon: Github, href: contactInfo.social.github, label: 'GitHub', color: 'hover:text-gray-900 dark:hover:text-gray-100' },
//     { icon: Linkedin, href: contactInfo.social.linkedin, label: 'LinkedIn', color: 'hover:text-blue-600' },
//     { icon: Mail, href: `mailto:${contactInfo.email}`, label: 'Email', color: 'hover:text-red-500' },
//   ];

//   return (
//     <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
//       {/* Animated background elements with GSAP */}
//       <div ref={bgDotsRef} className="absolute inset-0 overflow-hidden">
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-2 h-2 bg-primary/20 rounded-full gsap-dot"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//           />
//         ))}
//       </div>
//       <div className="container relative z-10">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           {/* Left content */}
//           <div className="text-center lg:text-left space-y-8">
//             {/* Greeting */}
//             <div ref={greetingRef} className="space-y-2">
//               <p className="text-lg text-muted-foreground font-medium">
//                 {t('hero.greeting')}
//               </p>
//               <h1 ref={nameRef} className="text-4xl sm:text-5xl lg:text-6xl font-bold">
//                 <span className="text-gradient">{t('hero.name')}</span>
//               </h1>
//             </div>

//             {/* Title */}
//             <h2 ref={titleRef} className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground/90">
//               {t('hero.title')}
//             </h2>

//             {/* Subtitle */}
//             <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
//               {t('hero.subtitle')}
//             </p>

//             {/* CTAs */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//               <a
//                 href="#projects"
//                 className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 hover-lift"
//               >
//                 {t('hero.cta_projects')}
//                 <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
//               </a>
              
//               <a
//                 href="/assets/resume.pdf"
//                 download
//                 className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-transparent border border-border rounded-lg hover:bg-accent transition-all duration-200"
//               >
//                 <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
//                 {t('about.download_resume')}
//               </a>
//             </div>

//             {/* Social Links */}
//             <div className="flex items-center justify-center lg:justify-start space-x-6">
//               {socialLinks.map((social, index) => {
//                 const Icon = social.icon;
//                 return (
//                   <a
//                     key={social.label}
//                     href={social.href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className={cn(
//                       'p-3 rounded-lg bg-accent text-muted-foreground transition-all duration-200 hover:scale-110',
//                       social.color
//                     )}
//                   >
//                     <Icon className="h-5 w-5" />
//                     <span className="sr-only">{social.label}</span>
//                   </a>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right content - Avatar */}
//           <div className="relative flex items-center justify-center">
//             {/* Avatar container with animated border */}
//             <div className="relative">
//               <div
//                 ref={ringRef}
//                 className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
//                 style={{ padding: '4px' }}
//               />
//               <div className="relative bg-background rounded-full p-1">
//                 <img
//                   src={personalInfo.avatar}
//                   alt={personalInfo.fullName}
//                   className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full object-cover"
//                 />
//               </div>
              
//               {/* Floating tech icons */}
//               {[
//                 { icon: '⚛️', position: 'top-4 right-4', delay: 1.2 },
//                 { icon: '🎮', position: 'bottom-4 left-4', delay: 1.4 },
//                 { icon: '💻', position: 'top-4 left-4', delay: 1.6 },
//                 { icon: '🚀', position: 'bottom-4 right-4', delay: 1.8 },
//               ].map((item, index) => (
//                 <div
//                   key={index}
//                   className={cn(
//                     'absolute tech-icon w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center text-2xl shadow-lg',
//                     item.position
//                   )}
//                   data-delay={item.delay}
//                 >
//                   {item.icon}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
