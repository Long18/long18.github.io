'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { personalInfo } from '../../data/personal';
import { mainSkills } from '../../data/skills';
import SkillIcon from '../ui/SkillIcon';
import { useGSAP } from '../../hooks/useGSAP';
import { heroEntranceAnimation } from '../../utils/gsapAnimations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface HomeProps {
  onNavigate?: (section: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
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

  // New refs for wow effects
  const constellationRef = useRef<HTMLCanvasElement>(null);
  const interactiveOrbsRef = useRef<HTMLDivElement>(null);
  const mouseParallaxRef = useRef<HTMLDivElement>(null);
  const hologramRef = useRef<HTMLDivElement>(null);

  // Performance optimization refs
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<number>(0);
  const performanceModeRef = useRef<'high' | 'medium' | 'low'>('high');

  // Advanced interaction refs
  const mouseTrailRef = useRef<HTMLCanvasElement>(null);
  const clickRipplesRef = useRef<HTMLDivElement>(null);
  const colorShiftRef = useRef<HTMLDivElement>(null);
  const depthFieldRef = useRef<HTMLCanvasElement>(null);

  // 🌟 2025 Enhancement refs
  const quantumFieldRef = useRef<HTMLCanvasElement>(null);
  const neuralNetworkRef = useRef<HTMLCanvasElement>(null);
  const realityDistortionRef = useRef<HTMLDivElement>(null);
  const energyPortalRef = useRef<HTMLDivElement>(null);
  const plasmaRingsRef = useRef<HTMLDivElement>(null);
  const cosmicWavesRef = useRef<HTMLDivElement>(null);

  // 🎯 2025 ENHANCEMENT: Button Interaction States
  const [buttonStates, setButtonStates] = useState({
    viewWork: { isLoading: false, isPressed: false },
    downloadResume: { isLoading: false, isPressed: false, isSuccess: false },
    contact: { isLoading: false, isPressed: false },
  });

  // 📱 Mobile Detection State with Debug Mode
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [debugMode, setDebugMode] = useState<
    'auto' | 'force-mobile' | 'force-desktop'
  >('auto');
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Performance state for adaptive animations
  const [performanceClass, setPerformanceClass] = useState<
    'performance-high' | 'performance-medium' | 'performance-low'
  >('performance-high');

  // Swipe interaction state
  const [swipeState, setSwipeState] = useState({
    isRotating: false,
    startAngle: 0,
    currentAngle: 0,
    rotationSpeed: 0,
  });

  // Touch interaction refs
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastTouchRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const constellationContainerRef = useRef<HTMLDivElement>(null);

  // Explosion particle system refs
  const explosionParticlesRef = useRef<HTMLDivElement>(null);
  const rippleEffectsRef = useRef<HTMLDivElement>(null);

  // Mobile detection and responsive handling
  useEffect(() => {
    // Set client-side flag to true to prevent hydration mismatch
    setIsClient(true);

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({ width, height });

      // Enhanced mobile detection based on user agent and width
      const isMobileByWidth = width <= 768;
      const isMobileByUA =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );

      // Apply debug mode override if active
      if (debugMode === 'auto') {
        setIsMobile(isMobileByWidth || isMobileByUA);
      } else if (debugMode === 'force-mobile') {
        setIsMobile(true);
      } else if (debugMode === 'force-desktop') {
        setIsMobile(false);
      }

      // Set performance class based on detection
      updatePerformanceClass();

      // Log for debugging
      console.log('Device detection:', {
        width,
        height,
        debugMode,
        isMobile: isMobileByWidth || isMobileByUA,
        performanceMode: performanceModeRef.current,
      });
    };

    // Performance classification function
    const updatePerformanceClass = () => {
      switch (performanceModeRef.current) {
        case 'high':
          setPerformanceClass('performance-high');
          break;
        case 'medium':
          setPerformanceClass('performance-medium');
          break;
        case 'low':
          setPerformanceClass('performance-low');
          break;
      }
    };

    // Debug mode keyboard shortcuts for testing
    const handleKeydown = (e: KeyboardEvent) => {
      // Shift + Alt + D for mobile mode
      if (e.shiftKey && e.altKey && e.key === 'D') {
        setDebugMode('force-mobile');
        console.log('Debug mode: Forced Mobile');
      }
      // Shift + Ctrl + D for desktop mode
      else if (e.shiftKey && e.ctrlKey && e.key === 'D') {
        setDebugMode('force-desktop');
        console.log('Debug mode: Forced Desktop');
      }
      // Shift + D to reset to auto
      else if (e.shiftKey && e.key === 'd') {
        setDebugMode('auto');
        console.log('Debug mode: Auto Detection');
      }
    };

    // Initial check
    updateDimensions();

    // Add event listeners
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [debugMode]);

  // Performance monitoring and adaptive quality adjustment
  useEffect(() => {
    if (!isMobile) return; // Only monitor performance on mobile devices

    let frameCount = 0;
    let lastFPSCheck = performance.now();
    let animationId: number;

    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      // Check FPS every second
      if (currentTime - lastFPSCheck >= 1000) {
        const fps = Math.round(
          (frameCount * 1000) / (currentTime - lastFPSCheck)
        );
        fpsCounterRef.current = fps;

        // Adjust performance mode based on FPS
        let newPerformanceMode = performanceModeRef.current;

        if (fps < 20 && performanceModeRef.current !== 'low') {
          newPerformanceMode = 'low';
          console.log('🔧 Performance Mode: Switched to LOW (FPS:', fps, ')');
        } else if (
          fps < 40 &&
          fps >= 20 &&
          performanceModeRef.current === 'high'
        ) {
          newPerformanceMode = 'medium';
          console.log(
            '🔧 Performance Mode: Switched to MEDIUM (FPS:',
            fps,
            ')'
          );
        } else if (fps >= 50 && performanceModeRef.current !== 'high') {
          newPerformanceMode = 'high';
          console.log('🔧 Performance Mode: Switched to HIGH (FPS:', fps, ')');
        }

        // Update performance mode if changed
        if (newPerformanceMode !== performanceModeRef.current) {
          performanceModeRef.current = newPerformanceMode;
          setPerformanceClass(`performance-${newPerformanceMode}`);

          // Apply performance adjustments to constellation container
          if (constellationContainerRef.current) {
            const container = constellationContainerRef.current;
            container.className = container.className.replace(
              /performance-(high|medium|low)/g,
              `performance-${newPerformanceMode}`
            );
          }
        }

        // Reset counters
        frameCount = 0;
        lastFPSCheck = currentTime;
      }

      animationId = requestAnimationFrame(monitorPerformance);
    };

    // Start monitoring
    animationId = requestAnimationFrame(monitorPerformance);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isMobile]);

  // Touch and swipe interaction handlers
  useEffect(() => {
    // Skip if not mobile or constellation container not present
    if (!isMobile || !constellationContainerRef.current) return;

    const container = constellationContainerRef.current;

    // Create explosion container for particles if it doesn't exist
    let explosionContainer = explosionParticlesRef.current;
    if (!explosionContainer) {
      explosionContainer = document.createElement('div');
      explosionContainer.className = 'particle-explosion-container';
      explosionContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
        overflow: hidden;
      `;
      container.appendChild(explosionContainer);
      // Store reference for later use
      (
        explosionParticlesRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = explosionContainer;
    }

    // Create ripple container if it doesn't exist
    let rippleContainer = rippleEffectsRef.current;
    if (!rippleContainer) {
      rippleContainer = document.createElement('div');
      rippleContainer.className = 'ripple-effects-container';
      rippleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9;
        overflow: hidden;
      `;
      container.appendChild(rippleContainer);
      // Store reference for later use
      (
        rippleEffectsRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = rippleContainer;
    }

    // Touch start handler
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];

      // Store touch starting position
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };
      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      setSwipeState((prev) => ({
        ...prev,
        isRotating: false,
        startAngle: 0,
        currentAngle: 0,
        rotationSpeed: 0,
      }));

      // Check if touch started on an icon
      const targetIcon = (e.target as Element).closest('.tech-icon-orbital');
      if (targetIcon) {
        // Add immediate visual feedback
        const iconContainer = targetIcon.querySelector(
          '.icon-container'
        ) as HTMLElement;
        if (iconContainer) {
          iconContainer.style.transform = 'translate(-50%, -50%) scale(0.95)';
          iconContainer.style.transition = 'transform 0.1s ease-out';
        }
      }
    };

    // Touch move handler - for swipe rotation
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault(); // Prevent scrolling during swipe

      const touch = e.touches[0];

      // Calculate movement delta
      const totalDeltaX = touch.clientX - touchStartRef.current.x;
      const totalDeltaY = touch.clientY - touchStartRef.current.y;

      // Store last position for next move event
      lastTouchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      };

      // Check if this is a significant swipe gesture (minimum distance threshold)
      const swipeThreshold = 15;
      const totalDistance = Math.sqrt(
        totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY
      );

      if (totalDistance > swipeThreshold) {
        const containerRect = container.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        const centerY = containerRect.top + containerRect.height / 2;

        // Calculate angle from center to touch point
        const angle = Math.atan2(
          touch.clientY - centerY,
          touch.clientX - centerX
        );

        // Update rotation state
        if (!swipeState.isRotating) {
          setSwipeState((prev) => ({
            ...prev,
            isRotating: true,
            startAngle: angle,
            currentAngle: angle,
            rotationSpeed: 0,
          }));
        } else {
          // Calculate rotation speed based on movement
          const angleDelta = angle - swipeState.currentAngle;
          const normalizedDelta =
            ((angleDelta + Math.PI) % (2 * Math.PI)) - Math.PI; // Normalize to -π to π

          setSwipeState((prev) => ({
            ...prev,
            currentAngle: angle,
            rotationSpeed: normalizedDelta,
          }));

          // Apply rotation to the constellation container
          const rotationDegrees =
            (angle - swipeState.startAngle) * (180 / Math.PI);
          const orbitalElements =
            container.querySelectorAll('.tech-icon-orbital');

          orbitalElements.forEach((el: Element) => {
            const elem = el as HTMLElement;
            // Pause the orbital animation and apply manual rotation
            elem.style.animationPlayState = 'paused';

            // Get the original transform and add rotation
            const originalTransform = elem.style.transform || '';
            const rotationTransform = `rotate(${rotationDegrees}deg)`;

            // Apply rotation while preserving original positioning
            if (originalTransform.includes('rotate(')) {
              elem.style.transform = originalTransform.replace(
                /rotate\([^)]*\)/,
                rotationTransform
              );
            } else {
              elem.style.transform = `${originalTransform} ${rotationTransform}`;
            }
          });

          // Add visual feedback during rotation
          container.style.filter = 'brightness(1.1) saturate(1.2)';
          container.style.transition = 'filter 0.1s ease-out';
        }
      }
    };

    // Touch end handler - create explosion effect
    const handleTouchEnd = (e: TouchEvent) => {
      // Reset any icon scale transformations
      const targetIcon = (e.target as Element).closest('.tech-icon-orbital');
      if (targetIcon) {
        const iconContainer = targetIcon.querySelector(
          '.icon-container'
        ) as HTMLElement;
        if (iconContainer) {
          iconContainer.style.transform = 'translate(-50%, -50%) scale(1)';
          iconContainer.style.transition = 'transform 0.2s ease-out';
        }
      }

      // If we were rotating, resume normal animation with momentum
      if (swipeState.isRotating) {
        const orbitalElements =
          container.querySelectorAll('.tech-icon-orbital');

        orbitalElements.forEach((el: Element) => {
          const elem = el as HTMLElement;
          // Resume animation with potential momentum effect
          elem.style.animationPlayState = 'running';

          // Apply momentum if rotation speed is significant
          if (Math.abs(swipeState.rotationSpeed) > 0.1) {
            const momentumDuration = Math.min(
              2000,
              Math.abs(swipeState.rotationSpeed) * 1000
            );
            elem.style.animationDuration = `${Math.max(
              15,
              30 - momentumDuration / 100
            )}s`;

            // Reset to normal duration after momentum
            setTimeout(() => {
              if (elem) {
                const originalDuration =
                  elem.getAttribute('data-original-duration') || '20s';
                elem.style.animationDuration = originalDuration;
              }
            }, momentumDuration);
          }

          // Clear manual transforms
          elem.style.transform = '';
        });

        // Reset container visual effects
        container.style.filter = '';
        container.style.transition = 'filter 0.3s ease-out';

        setSwipeState((prev) => ({
          ...prev,
          isRotating: false,
          rotationSpeed: 0,
        }));
        return;
      }

      // Check if this was a tap (small movement) vs swipe
      const totalDeltaX = lastTouchRef.current.x - touchStartRef.current.x;
      const totalDeltaY = lastTouchRef.current.y - touchStartRef.current.y;
      const totalDistance = Math.sqrt(
        totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY
      );

      // Only create explosion for taps (not swipes)
      if (totalDistance < 15) {
        // Get the touch end coordinates
        const touchX = lastTouchRef.current.x;
        const touchY = lastTouchRef.current.y;

        // Create explosion effect at touch position
        createTouchExplosion(touchX, touchY, targetIcon);

        // Create ripple effect
        createTouchRipple(touchX, touchY);

        // Trigger haptic feedback if available
        if (navigator.vibrate) {
          // Differentiate vibration based on icon type
          if (targetIcon) {
            navigator.vibrate([50, 50, 50]); // Triple vibration for icon tap
          } else {
            navigator.vibrate(25); // Single vibration for general tap
          }
        }

        // Show tooltip briefly on tap if it's an icon
        if (targetIcon) {
          const tooltip = targetIcon.querySelector(
            '.absolute.-top-16'
          ) as HTMLElement;
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.pointerEvents = 'none';
            setTimeout(() => {
              if (tooltip) tooltip.style.opacity = '0';
            }, 2000);
          }
        }
      }
    };

    // Creates particle explosion effect at given coordinates
    const createTouchExplosion = (
      x: number,
      y: number,
      targetIcon?: Element | null
    ) => {
      if (
        !explosionParticlesRef.current ||
        performanceModeRef.current === 'low'
      )
        return;

      // Get container position
      const containerRect = container.getBoundingClientRect();

      // Calculate position relative to container
      const relX = x - containerRect.left;
      const relY = y - containerRect.top;

      // Get icon-specific color if tapping on an icon
      let colors = ['#fb923c', '#8b5cf6', '#06b6d4', '#22c55e'];
      if (targetIcon) {
        const iconContainer = targetIcon.querySelector(
          '.icon-container'
        ) as HTMLElement;
        if (iconContainer) {
          const glowColor =
            iconContainer.style.getPropertyValue('--glow-color') || '#fb923c';
          colors = [glowColor, '#ffffff', glowColor + '80'];
        }
      }

      // Create particles based on performance mode
      const particleCount =
        performanceModeRef.current === 'high'
          ? targetIcon
            ? 16
            : 12 // More particles for icon taps
          : performanceModeRef.current === 'medium'
          ? targetIcon
            ? 12
            : 8
          : targetIcon
          ? 8
          : 4;

      // Create and animate particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';

        // Random particle customization with better distribution
        const angle =
          (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 40 + 20;
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const lifespan = Math.random() * 400 + 600;

        // Calculate particle trajectory
        const xVelocity = Math.cos(angle) * speed;
        const yVelocity = Math.sin(angle) * speed;

        // Style the particle
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${relX}px;
          top: ${relY}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 11;
          box-shadow: 0 0 ${size * 2}px ${color};
          --x: ${xVelocity}px;
          --y: ${yVelocity}px;
        `;

        // Add to container and animate
        explosionParticlesRef.current.appendChild(particle);

        // Force reflow for animation to work
        void particle.offsetWidth;
        particle.classList.add('active');

        // Remove after animation completes
        setTimeout(() => {
          if (explosionParticlesRef.current?.contains(particle)) {
            explosionParticlesRef.current.removeChild(particle);
          }
        }, lifespan);
      }

      // Add a central flash effect for icon taps
      if (targetIcon) {
        const flash = document.createElement('div');
        flash.className = 'explosion-flash';
        flash.style.cssText = `
          position: absolute;
          width: 60px;
          height: 60px;
          left: ${relX}px;
          top: ${relY}px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 12;
          transform: translate(-50%, -50%) scale(0);
          animation: touch-explosion-ring 0.4s ease-out forwards;
        `;

        explosionParticlesRef.current.appendChild(flash);

        setTimeout(() => {
          if (explosionParticlesRef.current?.contains(flash)) {
            explosionParticlesRef.current.removeChild(flash);
          }
        }, 400);
      }
    };

    // Creates ripple effect at given coordinates
    const createTouchRipple = (x: number, y: number) => {
      if (!rippleEffectsRef.current) return;

      // Get container position
      const containerRect = container.getBoundingClientRect();

      // Calculate position relative to container
      const relX = x - containerRect.left;
      const relY = y - containerRect.top;

      // Create multiple ripple rings for better effect
      const rippleCount =
        performanceModeRef.current === 'high'
          ? 3
          : performanceModeRef.current === 'medium'
          ? 2
          : 1;

      for (let i = 0; i < rippleCount; i++) {
        setTimeout(() => {
          const ripple = document.createElement('div');
          ripple.className = 'touch-ripple';

          // Style the ripple with variation
          const size = 20 + i * 10;
          const opacity = 0.6 - i * 0.2;
          const duration = 800 + i * 200;

          ripple.style.cssText = `
            position: absolute;
            left: ${relX}px;
            top: ${relY}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            background: rgba(251, 146, 60, ${opacity});
            border: 2px solid rgba(251, 146, 60, ${opacity * 0.5});
            animation: touch-ripple-intensity ${
              duration / 1000
            }s ease-out forwards;
            z-index: ${9 - i};
          `;

          // Add to container and animate
          rippleEffectsRef.current!.appendChild(ripple);

          // Remove after animation completes
          setTimeout(() => {
            if (rippleEffectsRef.current?.contains(ripple)) {
              rippleEffectsRef.current.removeChild(ripple);
            }
          }, duration);
        }, i * 100);
      }
    };

    // Creates icon-specific explosion effect
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createIconExplosion = (
      x: number,
      y: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      iconData: any,
      iconIndex: number
    ) => {
      if (
        !explosionParticlesRef.current ||
        performanceModeRef.current === 'low'
      )
        return;

      const colors = [
        iconData.glowColor,
        '#ffffff',
        iconData.glowColor + '80',
        iconData.glowColor + '40',
      ];
      const particleCount =
        performanceModeRef.current === 'high'
          ? 20
          : performanceModeRef.current === 'medium'
          ? 15
          : 10;

      // Create particles in a more organized pattern
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle icon-specific';

        // Create both radial and spiral patterns
        const isSpiral = i % 3 === 0;
        let angle, speed;

        if (isSpiral) {
          angle = (i / particleCount) * Math.PI * 4 + (iconIndex * Math.PI) / 3;
          speed = 15 + (i % 3) * 10;
        } else {
          angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
          speed = 20 + Math.random() * 25;
        }

        const size = 3 + Math.random() * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const lifespan = 600 + Math.random() * 600;

        const xVelocity = Math.cos(angle) * speed;
        const yVelocity = Math.sin(angle) * speed;

        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: ${color};
          border-radius: 50%;
          pointer-events: none;
          z-index: 15;
          box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${
          iconData.glowColor
        }40;
          --x: ${xVelocity}px;
          --y: ${yVelocity}px;
          animation: particle-fragment ${lifespan / 1000}s ease-out forwards;
        `;

        explosionParticlesRef.current.appendChild(particle);

        setTimeout(() => {
          if (explosionParticlesRef.current?.contains(particle)) {
            explosionParticlesRef.current.removeChild(particle);
          }
        }, lifespan);
      }

      // Add icon-themed center flash
      const flash = document.createElement('div');
      flash.className = 'icon-explosion-flash';
      flash.style.cssText = `
        position: absolute;
        width: 80px;
        height: 80px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, ${iconData.glowColor}80 0%, ${iconData.glowColor}40 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 16;
        transform: translate(-50%, -50%) scale(0);
        animation: touch-explosion-ring 0.6s ease-out forwards;
        border: 3px solid ${iconData.glowColor}60;
      `;

      explosionParticlesRef.current.appendChild(flash);

      setTimeout(() => {
        if (explosionParticlesRef.current?.contains(flash)) {
          explosionParticlesRef.current.removeChild(flash);
        }
      }, 600);
    };

    // Creates icon-specific ripple effect
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const createIconRipple = (x: number, y: number, glowColor: string) => {
      if (!rippleEffectsRef.current) return;

      const rippleCount =
        performanceModeRef.current === 'high'
          ? 4
          : performanceModeRef.current === 'medium'
          ? 3
          : 2;

      for (let i = 0; i < rippleCount; i++) {
        setTimeout(() => {
          const ripple = document.createElement('div');
          ripple.className = 'icon-touch-ripple';

          const size = 30 + i * 15;
          const opacity = 0.8 - i * 0.15;
          const duration = 1000 + i * 300;

          // Convert hex color to rgba
          const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

          ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%) scale(0);
            background: ${hexToRgba(glowColor, opacity * 0.3)};
            border: 3px solid ${hexToRgba(glowColor, opacity * 0.6)};
            box-shadow: 0 0 ${size}px ${hexToRgba(glowColor, opacity * 0.4)};
            animation: touch-ripple-intensity ${
              duration / 1000
            }s ease-out forwards;
            z-index: ${12 - i};
          `;

          rippleEffectsRef.current!.appendChild(ripple);

          setTimeout(() => {
            if (rippleEffectsRef.current?.contains(ripple)) {
              rippleEffectsRef.current.removeChild(ripple);
            }
          }, duration);
        }, i * 150);
      }
    };

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, swipeState]);

  // Helper functions for touch effects (moved outside useEffect for broader scope)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTouchExplosion = (
    x: number,
    y: number,
    targetIcon?: Element | null
  ) => {
    if (!explosionParticlesRef.current || performanceModeRef.current === 'low')
      return;

    // Get container position
    const container = constellationContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to container
    const relX = x - containerRect.left;
    const relY = y - containerRect.top;

    // Get icon-specific color if tapping on an icon
    let colors = ['#fb923c', '#8b5cf6', '#06b6d4', '#22c55e'];
    if (targetIcon) {
      const iconContainer = targetIcon.querySelector(
        '.icon-container'
      ) as HTMLElement;
      if (iconContainer) {
        const glowColor =
          iconContainer.style.getPropertyValue('--glow-color') || '#fb923c';
        colors = [glowColor, '#ffffff', glowColor + '80'];
      }
    }

    // Create particles based on performance mode
    const particleCount =
      performanceModeRef.current === 'high'
        ? targetIcon
          ? 16
          : 12 // More particles for icon taps
        : performanceModeRef.current === 'medium'
        ? targetIcon
          ? 12
          : 8
        : targetIcon
        ? 8
        : 4;

    // Create and animate particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';

      // Random particle customization with better distribution
      const angle =
        (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 40 + 20;
      const size = Math.random() * 8 + 4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const lifespan = Math.random() * 400 + 600;

      // Calculate particle trajectory
      const xVelocity = Math.cos(angle) * speed;
      const yVelocity = Math.sin(angle) * speed;

      // Style the particle
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${relX}px;
        top: ${relY}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 11;
        box-shadow: 0 0 ${size * 2}px ${color};
        --x: ${xVelocity}px;
        --y: ${yVelocity}px;
      `;

      // Add to container and animate
      explosionParticlesRef.current.appendChild(particle);

      // Force reflow for animation to work
      void particle.offsetWidth;
      particle.classList.add('active');

      // Remove after animation completes
      setTimeout(() => {
        if (explosionParticlesRef.current?.contains(particle)) {
          explosionParticlesRef.current.removeChild(particle);
        }
      }, lifespan);
    }

    // Add a central flash effect for icon taps
    if (targetIcon) {
      const flash = document.createElement('div');
      flash.className = 'explosion-flash';
      flash.style.cssText = `
        position: absolute;
        width: 60px;
        height: 60px;
        left: ${relX}px;
        top: ${relY}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 12;
        transform: translate(-50%, -50%) scale(0);
        animation: touch-explosion-ring 0.4s ease-out forwards;
      `;

      explosionParticlesRef.current.appendChild(flash);

      setTimeout(() => {
        if (explosionParticlesRef.current?.contains(flash)) {
          explosionParticlesRef.current.removeChild(flash);
        }
      }, 400);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createTouchRipple = (x: number, y: number) => {
    if (!rippleEffectsRef.current) return;

    // Get container position
    const container = constellationContainerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to container
    const relX = x - containerRect.left;
    const relY = y - containerRect.top;

    // Create multiple ripple rings for better effect
    const rippleCount =
      performanceModeRef.current === 'high'
        ? 3
        : performanceModeRef.current === 'medium'
        ? 2
        : 1;

    for (let i = 0; i < rippleCount; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';

        // Style the ripple with variation
        const size = 20 + i * 10;
        const opacity = 0.6 - i * 0.2;
        const duration = 800 + i * 200;

        ripple.style.cssText = `
          position: absolute;
          left: ${relX}px;
          top: ${relY}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          background: rgba(251, 146, 60, ${opacity});
          border: 2px solid rgba(251, 146, 60, ${opacity * 0.5});
          animation: touch-ripple-intensity ${
            duration / 1000
          }s ease-out forwards;
          z-index: ${9 - i};
        `;

        // Add to container and animate
        rippleEffectsRef.current!.appendChild(ripple);

        // Remove after animation completes
        setTimeout(() => {
          if (rippleEffectsRef.current?.contains(ripple)) {
            rippleEffectsRef.current.removeChild(ripple);
          }
        }, duration);
      }, i * 100);
    }
  };

  const createIconExplosion = (
    x: number,
    y: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iconData: any,
    iconIndex: number
  ) => {
    if (!explosionParticlesRef.current || performanceModeRef.current === 'low')
      return;

    const colors = [
      iconData.glowColor,
      '#ffffff',
      iconData.glowColor + '80',
      iconData.glowColor + '40',
    ];
    const particleCount =
      performanceModeRef.current === 'high'
        ? 20
        : performanceModeRef.current === 'medium'
        ? 15
        : 10;

    // Create particles in a more organized pattern
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle icon-specific';

      // Create both radial and spiral patterns
      const isSpiral = i % 3 === 0;
      let angle, speed;

      if (isSpiral) {
        angle = (i / particleCount) * Math.PI * 4 + (iconIndex * Math.PI) / 3;
        speed = 15 + (i % 3) * 10;
      } else {
        angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
        speed = 20 + Math.random() * 25;
      }

      const size = 3 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const lifespan = 600 + Math.random() * 600;

      const xVelocity = Math.cos(angle) * speed;
      const yVelocity = Math.sin(angle) * speed;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 15;
        box-shadow: 0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${
        iconData.glowColor
      }40;
        --x: ${xVelocity}px;
        --y: ${yVelocity}px;
        animation: particle-fragment ${lifespan / 1000}s ease-out forwards;
      `;

      explosionParticlesRef.current.appendChild(particle);

      setTimeout(() => {
        if (explosionParticlesRef.current?.contains(particle)) {
          explosionParticlesRef.current.removeChild(particle);
        }
      }, lifespan);
    }

    // Add icon-themed center flash
    const flash = document.createElement('div');
    flash.className = 'icon-explosion-flash';
    flash.style.cssText = `
      position: absolute;
      width: 80px;
      height: 80px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, ${iconData.glowColor}80 0%, ${iconData.glowColor}40 40%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 16;
      transform: translate(-50%, -50%) scale(0);
      animation: touch-explosion-ring 0.6s ease-out forwards;
      border: 3px solid ${iconData.glowColor}60;
    `;

    explosionParticlesRef.current.appendChild(flash);

    setTimeout(() => {
      if (explosionParticlesRef.current?.contains(flash)) {
        explosionParticlesRef.current.removeChild(flash);
      }
    }, 600);
  };

  const createIconRipple = (x: number, y: number, glowColor: string) => {
    if (!rippleEffectsRef.current) return;

    const rippleCount =
      performanceModeRef.current === 'high'
        ? 4
        : performanceModeRef.current === 'medium'
        ? 3
        : 2;

    for (let i = 0; i < rippleCount; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.className = 'icon-touch-ripple';

        const size = 30 + i * 15;
        const opacity = 0.8 - i * 0.15;
        const duration = 1000 + i * 300;

        // Convert hex color to rgba
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };

        ripple.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(0);
          background: ${hexToRgba(glowColor, opacity * 0.3)};
          border: 3px solid ${hexToRgba(glowColor, opacity * 0.6)};
          box-shadow: 0 0 ${size}px ${hexToRgba(glowColor, opacity * 0.4)};
          animation: touch-ripple-intensity ${
            duration / 1000
          }s ease-out forwards;
          z-index: ${12 - i};
        `;

        rippleEffectsRef.current!.appendChild(ripple);

        setTimeout(() => {
          if (rippleEffectsRef.current?.contains(ripple)) {
            rippleEffectsRef.current.removeChild(ripple);
          }
        }, duration);
      }, i * 150);
    }
  };

  // GSAP animations
  useGSAP(() => {
    // 🚀 Performance Detection & Optimization
    const detectPerformanceMode = () => {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const hasHighPerformance =
        gl &&
        !isMobile &&
        navigator.hardwareConcurrency &&
        navigator.hardwareConcurrency >= 4;

      if (hasHighPerformance) {
        performanceModeRef.current = 'high';
      } else if (!isMobile) {
        performanceModeRef.current = 'medium';
      } else {
        performanceModeRef.current = 'low';
      }
    };

    detectPerformanceMode();

    // FPS monitoring for dynamic quality adjustment
    const monitorFPS = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastFrameTimeRef.current;

      if (deltaTime > 0) {
        const fps = 1000 / deltaTime;
        fpsCounterRef.current = fps;

        // Adjust performance mode based on FPS
        if (fps < 30 && performanceModeRef.current === 'high') {
          performanceModeRef.current = 'medium';
        } else if (fps < 20 && performanceModeRef.current === 'medium') {
          performanceModeRef.current = 'low';
        }
      }

      lastFrameTimeRef.current = currentTime;
    };

    // Hero entrance animation using the preset
    heroEntranceAnimation({
      greeting: greetingRef.current || undefined,
      name: nameRef.current || undefined,
      title: titleRef.current || undefined,
      subtitle: subtitleRef.current || undefined,
      buttons: buttonsRef.current
        ? (Array.from(buttonsRef.current.children) as HTMLElement[])
        : undefined,
      avatar: avatarRef.current || undefined,
    });

    // 🌟 WOW EFFECT 1: Typing Animation for Name
    if (nameRef.current) {
      const nameElement = nameRef.current.querySelector('span');
      if (nameElement) {
        const text = personalInfo.displayName;
        nameElement.textContent = '';

        gsap.fromTo(
          nameElement,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            delay: 1.2,
            onComplete: () => {
              let i = 0;
              const typeInterval = setInterval(() => {
                nameElement.textContent = text.slice(0, i + 1);
                i++;
                if (i >= text.length) clearInterval(typeInterval);
              }, 100);
            },
          }
        );
      }
    }

    // 🌟 WOW EFFECT 2: Mouse Parallax for Background
    if (mouseParallaxRef.current && sectionRef.current) {
      const parallaxElements = mouseParallaxRef.current.children;

      sectionRef.current.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        Array.from(parallaxElements).forEach((element, index) => {
          const speed = (index + 1) * 0.5;
          gsap.to(element, {
            x: xPos * speed * 20,
            y: yPos * speed * 20,
            duration: 0.8,
            ease: 'power2.out',
          });
        });
      });
    }

    // 🌟 WOW EFFECT 3: Interactive Magnetic Orbs
    if (interactiveOrbsRef.current) {
      const orbs = interactiveOrbsRef.current.children;

      Array.from(orbs).forEach((orb) => {
        const orbElement = orb as HTMLElement;

        orbElement.addEventListener('mouseenter', () => {
          gsap.to(orb, {
            scale: 1.5,
            boxShadow: '0 0 40px rgba(251, 146, 60, 0.6)',
            duration: 0.3,
          });
        });

        orbElement.addEventListener('mouseleave', () => {
          gsap.to(orb, {
            scale: 1,
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.2)',
            duration: 0.3,
          });
        });

        // Floating animation
        gsap.to(orb, {
          y: 'random(-20, 20)',
          x: 'random(-20, 20)',
          duration: 'random(4, 8)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 'random(0, 2)',
        });
      });
    }

    // 🌟 WOW EFFECT 4: Constellation Canvas Animation
    if (constellationRef.current) {
      const canvas = constellationRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
        }> = [];

        // Create particles
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
          });
        }

        const animateConstellation = () => {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update and draw particles
          particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(251, 146, 60, 0.3)';
            ctx.fill();

            // Connect nearby particles
            particles.forEach((otherParticle, j) => {
              if (i !== j) {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                  ctx.beginPath();
                  ctx.moveTo(particle.x, particle.y);
                  ctx.lineTo(otherParticle.x, otherParticle.y);
                  ctx.strokeStyle = `rgba(251, 146, 60, ${
                    0.1 * (1 - distance / 100)
                  })`;
                  ctx.stroke();
                }
              }
            });
          });

          requestAnimationFrame(animateConstellation);
        };
        animateConstellation();
      }
    }

    // 🌟 2025 ENHANCEMENT 1: Quantum Energy Field
    if (quantumFieldRef.current && avatarRef.current) {
      const canvas = quantumFieldRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 800;

        const quantumParticles: Array<{
          x: number;
          y: number;
          vx: number;
          vy: number;
          life: number;
          maxLife: number;
          energy: number;
        }> = [];

        let mouseX = 400;
        let mouseY = 400;

        // Listen for mouse movement
        avatarRef.current.addEventListener('mousemove', (e) => {
          const rect = avatarRef.current!.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
        });

        const createQuantumParticle = (x: number, y: number) => {
          quantumParticles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 0,
            maxLife: 60 + Math.random() * 60,
            energy: Math.random() * 0.5 + 0.3,
          });
        };

        const animateQuantumField = () => {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Create new particles around the center
          if (Math.random() > 0.7) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 100 + Math.random() * 100;
            createQuantumParticle(
              400 + Math.cos(angle) * radius,
              400 + Math.sin(angle) * radius
            );
          }

          // Animate particles
          quantumParticles.forEach((particle, index) => {
            particle.life++;

            // Magnetic effect towards mouse
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 200) {
              const force = ((200 - distance) / 200) * 0.1;
              particle.vx += (dx / distance) * force;
              particle.vy += (dy / distance) * force;
            }

            particle.x += particle.vx;
            particle.y += particle.vy;

            // Apply energy decay
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Draw particle
            const alpha =
              (1 - particle.life / particle.maxLife) * particle.energy;
            const size = particle.energy * 3;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(251, 146, 60, ${alpha})`;
            ctx.fill();

            // Create energy trails
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.3})`;
            ctx.fill();

            // Remove dead particles
            if (particle.life > particle.maxLife) {
              quantumParticles.splice(index, 1);
            }
          });

          requestAnimationFrame(animateQuantumField);
        };
        animateQuantumField();
      }
    }

    // 🌟 2025 ENHANCEMENT 2: Neural Network Overlay
    if (neuralNetworkRef.current) {
      const canvas = neuralNetworkRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 400;
        canvas.height = 400;

        const nodes: Array<{
          x: number;
          y: number;
          connections: number[];
          pulse: number;
        }> = [];

        // Create neural network nodes
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 150 + Math.random() * 50;
          nodes.push({
            x: 200 + Math.cos(angle) * radius,
            y: 200 + Math.sin(angle) * radius,
            connections: [],
            pulse: Math.random() * Math.PI * 2,
          });
        }

        // Create connections
        nodes.forEach((node, i) => {
          const connectionCount = 2 + Math.floor(Math.random() * 3);
          for (let j = 0; j < connectionCount; j++) {
            const targetIndex = Math.floor(Math.random() * nodes.length);
            if (targetIndex !== i && !node.connections.includes(targetIndex)) {
              node.connections.push(targetIndex);
            }
          }
        });

        const animateNeuralNetwork = () => {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw connections
          nodes.forEach((node) => {
            node.connections.forEach((connectionIndex) => {
              const target = nodes[connectionIndex];
              const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;

              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(target.x, target.y);
              ctx.strokeStyle = `rgba(251, 146, 60, ${0.3 * pulseIntensity})`;
              ctx.lineWidth = 1 + pulseIntensity;
              ctx.stroke();
            });
          });

          // Draw nodes
          nodes.forEach((node) => {
            node.pulse += 0.05;
            const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;

            ctx.beginPath();
            ctx.arc(node.x, node.y, 3 + pulseIntensity * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${0.7 + pulseIntensity * 0.3})`;
            ctx.fill();

            // Add glow effect
            ctx.beginPath();
            ctx.arc(node.x, node.y, 8 + pulseIntensity * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, ${0.1 * pulseIntensity})`;
            ctx.fill();
          });

          requestAnimationFrame(animateNeuralNetwork);
        };
        animateNeuralNetwork();
      }
    }

    // 🌟 2025 ENHANCEMENT 3: Reality Distortion Field
    if (realityDistortionRef.current && avatarRef.current) {
      const distortionElements = realityDistortionRef.current.children;

      avatarRef.current.addEventListener('mousemove', (e) => {
        const rect = avatarRef.current!.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const distanceFromCenter = Math.sqrt(
          Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
        );

        const maxDistance = 200;
        const distortionStrength = Math.max(
          0,
          1 - distanceFromCenter / maxDistance
        );

        Array.from(distortionElements).forEach((element, index) => {
          const htmlElement = element as HTMLElement;

          gsap.to(htmlElement, {
            x: (mouseX - centerX) * distortionStrength * 0.1,
            y: (mouseY - centerY) * distortionStrength * 0.1,
            scale: 1 + distortionStrength * 0.2,
            rotation: distortionStrength * 10 * (index % 2 === 0 ? 1 : -1),
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      avatarRef.current.addEventListener('mouseleave', () => {
        Array.from(distortionElements).forEach((element) => {
          gsap.to(element, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)',
          });
        });
      });
    }

    // 🌟 2025 ENHANCEMENT 4: Energy Portal Animation
    if (energyPortalRef.current) {
      const portalElements = energyPortalRef.current.children;

      Array.from(portalElements).forEach((element, index) => {
        const htmlElement = element as HTMLElement;

        gsap.to(htmlElement, {
          rotation: 360,
          duration: 20 + index * 5,
          ease: 'linear',
          repeat: -1,
        });

        gsap.to(htmlElement, {
          scale: 1.1,
          duration: 3 + index,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }

    // 🌟 2025 ENHANCEMENT 5: Plasma Rings System
    if (plasmaRingsRef.current) {
      const rings = plasmaRingsRef.current.children;

      Array.from(rings).forEach((ring, index) => {
        const htmlRing = ring as HTMLElement;

        // Rotation animation
        gsap.to(htmlRing, {
          rotation: 360,
          duration: 15 + index * 3,
          ease: 'linear',
          repeat: -1,
        });

        // Pulsing scale animation
        gsap.to(htmlRing, {
          scale: 1.05,
          duration: 2 + index * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });

        // Opacity breathing
        gsap.to(htmlRing, {
          opacity: 0.3,
          duration: 4 + index,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    }

    // 🌟 2025 ENHANCEMENT 6: Cosmic Waves Animation
    if (cosmicWavesRef.current && avatarRef.current) {
      const createWave = () => {
        const wave = document.createElement('div');
        wave.className =
          'cosmic-wave absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 pointer-events-none';
        wave.style.width = '160px';
        wave.style.height = '160px';
        wave.style.borderColor = 'rgba(251, 146, 60, 0.4)';
        wave.style.zIndex = '1';

        cosmicWavesRef.current!.appendChild(wave);

        gsap.fromTo(
          wave,
          {
            scale: 1,
            opacity: 0.6,
          },
          {
            scale: 3,
            opacity: 0,
            duration: 2,
            ease: 'power2.out',
            onComplete: () => {
              wave.remove();
            },
          }
        );
      };

      // Create waves periodically
      const waveInterval = setInterval(createWave, 3000);

      // Create wave on avatar hover
      avatarRef.current.addEventListener('mouseenter', createWave);

      // Cleanup interval on component unmount
      return () => clearInterval(waveInterval);
    }

    // 🌟 2025 ENHANCEMENT 7: Advanced Mouse Trail Effect
    if (mouseTrailRef.current && avatarRef.current) {
      const canvas = mouseTrailRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 800;

        const trailParticles: Array<{
          x: number;
          y: number;
          life: number;
          maxLife: number;
          hue: number;
        }> = [];

        let mouseX = 0;
        let mouseY = 0;

        avatarRef.current.addEventListener('mousemove', (e) => {
          const rect = avatarRef.current!.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;

          // Create trail particles based on performance mode
          const particleCount = performanceModeRef.current === 'high' ? 3 : 1;

          for (let i = 0; i < particleCount; i++) {
            trailParticles.push({
              x: mouseX + (Math.random() - 0.5) * 15,
              y: mouseY + (Math.random() - 0.5) * 15,
              life: 0,
              maxLife: 40,
              hue: (Date.now() * 0.01) % 360,
            });
          }
        });

        const animateMouseTrail = () => {
          if (!ctx) return;

          // Monitor FPS
          monitorFPS();

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          trailParticles.forEach((particle, index) => {
            particle.life++;

            const alpha = 1 - particle.life / particle.maxLife;
            const size = (1 - particle.life / particle.maxLife) * 6;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${alpha * 0.8})`;
            ctx.fill();

            // Remove dead particles
            if (particle.life > particle.maxLife) {
              trailParticles.splice(index, 1);
            }
          });

          animationFrameRef.current = requestAnimationFrame(animateMouseTrail);
        };
        animateMouseTrail();
      }
    }

    // 🌟 WOW EFFECT 5: Holographic Avatar Effect
    if (hologramRef.current && avatarRef.current) {
      const hologram = hologramRef.current;

      avatarRef.current.addEventListener('mouseenter', () => {
        gsap.to(hologram, {
          opacity: 1,
          scale: 1.02,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      avatarRef.current.addEventListener('mouseleave', () => {
        gsap.to(hologram, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    }

    // Animate background dots with scroll trigger
    if (bgDotsRef.current) {
      const primaryDots = bgDotsRef.current.querySelectorAll(
        '.gsap-dot[class*="bg-orange"]'
      );
      const secondaryDots = bgDotsRef.current.querySelectorAll(
        '.gsap-dot[class*="bg-purple"]'
      );
      const ambientOrbs = bgDotsRef.current.querySelectorAll(
        '.gsap-dot[class*="bg-gradient"]'
      );

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

    // Rotate border ring continuously with responsive speed
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 25, // Slower rotation for better UX
        ease: 'linear',
        repeat: -1,
      });
    }

    // Floating tech icons animation with responsive adjustments
    const techIcons = document.querySelectorAll('.tech-icon');
    techIcons.forEach((icon) => {
      const delay = parseFloat(icon.getAttribute('data-delay') || '0');

      // Gentle floating animation
      gsap.to(icon, {
        y: -8,
        duration: 4, // Slower for better UX
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });

      // Enhanced hover interactions with scale limit
      const element = icon as HTMLElement;
      element.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.15, // Reduced scale for mobile friendliness
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      element.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      // Touch interactions for mobile
      element.addEventListener('touchstart', () => {
        gsap.to(icon, {
          scale: 1.1,
          duration: 0.2,
          ease: 'power2.out',
        });
      });
      element.addEventListener('touchend', () => {
        gsap.to(icon, {
          scale: 1,
          duration: 0.2,
          ease: 'power2.out',
        });
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
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
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
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }

    // 🌟 2025 ENHANCEMENT 7: Advanced Mouse Trail Effect
    if (mouseTrailRef.current && avatarRef.current) {
      const canvas = mouseTrailRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 800;
        canvas.height = 800;

        const trailParticles: Array<{
          x: number;
          y: number;
          life: number;
          maxLife: number;
          hue: number;
          velocity: { x: number; y: number };
        }> = [];

        let mouseX = 0;
        let mouseY = 0;
        let lastMouseX = 0;
        let lastMouseY = 0;

        avatarRef.current.addEventListener('mousemove', (e) => {
          const rect = avatarRef.current!.getBoundingClientRect();
          lastMouseX = mouseX;
          lastMouseY = mouseY;
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;

          // Create trail particles based on performance mode
          const particleCount =
            performanceModeRef.current === 'high'
              ? 3
              : performanceModeRef.current === 'medium'
              ? 2
              : 1;

          for (let i = 0; i < particleCount; i++) {
            trailParticles.push({
              x: mouseX + (Math.random() - 0.5) * 20,
              y: mouseY + (Math.random() - 0.5) * 20,
              life: 0,
              maxLife: 60,
              hue: (Date.now() * 0.01) % 360,
              velocity: {
                x: (mouseX - lastMouseX) * 0.1,
                y: (mouseY - lastMouseY) * 0.1,
              },
            });
          }
        });

        const animateMouseTrail = () => {
          if (!ctx) return;

          // Monitor FPS
          monitorFPS();

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          trailParticles.forEach((particle, index) => {
            particle.life++;
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            particle.velocity.x *= 0.95;
            particle.velocity.y *= 0.95;

            const alpha = 1 - particle.life / particle.maxLife;
            const size = (1 - particle.life / particle.maxLife) * 8;

            // Create gradient for each particle
            const gradient = ctx.createRadialGradient(
              particle.x,
              particle.y,
              0,
              particle.x,
              particle.y,
              size
            );
            gradient.addColorStop(
              0,
              `hsla(${particle.hue}, 100%, 60%, ${alpha})`
            );
            gradient.addColorStop(
              0.5,
              `hsla(${particle.hue + 60}, 100%, 50%, ${alpha * 0.6})`
            );
            gradient.addColorStop(
              1,
              `hsla(${particle.hue + 120}, 100%, 40%, 0)`
            );

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Remove dead particles
            if (particle.life > particle.maxLife) {
              trailParticles.splice(index, 1);
            }
          });

          animationFrameRef.current = requestAnimationFrame(animateMouseTrail);
        };
        animateMouseTrail();
      }
    }

    // 🌟 2025 ENHANCEMENT 8: Dynamic Click Ripple Effects
    if (clickRipplesRef.current && avatarRef.current) {
      const createClickRipple = (x: number, y: number) => {
        const ripple = document.createElement('div');
        ripple.className =
          'click-ripple absolute rounded-full pointer-events-none';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background =
          'radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, rgba(168, 85, 247, 0.4) 50%, transparent 100%)';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.zIndex = '10';

        clickRipplesRef.current!.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1,
          },
          {
            scale: 12,
            opacity: 0,
            duration: 1.0,
            ease: 'power2.out',
            onComplete: () => {
              ripple.remove();
            },
          }
        );
      };

      // Click event listener
      avatarRef.current.addEventListener('click', (e) => {
        const rect = avatarRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createClickRipple(x, y);
      });

      // Touch event listener for mobile
      avatarRef.current.addEventListener('touchend', (e) => {
        e.preventDefault();
        const rect = avatarRef.current!.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        createClickRipple(x, y);
      });
    }

    // 🌟 2025 ENHANCEMENT 9: Dynamic Color Shifting
    if (colorShiftRef.current) {
      const shiftColors = () => {
        const time = Date.now() * 0.001;
        const hue1 = (time * 30) % 360;
        const hue2 = (time * 40 + 120) % 360;
        const hue3 = (time * 25 + 240) % 360;

        gsap.set(colorShiftRef.current, {
          background: `conic-gradient(
            hsla(${hue1}, 70%, 60%, 0.1) 0deg,
            hsla(${hue2}, 70%, 60%, 0.15) 120deg,
            hsla(${hue3}, 70%, 60%, 0.1) 240deg,
            hsla(${hue1}, 70%, 60%, 0.05) 360deg
          )`,
        });
      };

      gsap.ticker.add(shiftColors);
    }

    // 🌟 2025 ENHANCEMENT 10: 3D Depth Field Effect
    if (depthFieldRef.current) {
      const canvas = depthFieldRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = 400;
        canvas.height = 400;

        const depthParticles: Array<{
          x: number;
          y: number;
          z: number;
          size: number;
          speed: number;
          hue: number;
        }> = [];

        // Create depth particles
        const particleCount =
          performanceModeRef.current === 'high'
            ? 80
            : performanceModeRef.current === 'medium'
            ? 50
            : 30;

        for (let i = 0; i < particleCount; i++) {
          depthParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 1000,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
            hue: (Math.random() * 360) | 0,
          });
        }

        const animateDepthField = () => {
          if (!ctx) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          depthParticles.forEach((particle) => {
            particle.z -= particle.speed;

            if (particle.z <= 0) {
              particle.z = 1000;
              particle.x = Math.random() * canvas.width;
              particle.y = Math.random() * canvas.height;
            }

            const perspective = 400 / (400 + particle.z);
            const size = particle.size * perspective;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, ${perspective})`;
            ctx.fill();
          });

          requestAnimationFrame(animateDepthField);
        };
        animateDepthField();
      }
    }

    // Animate tech icons constellation with responsive orbits
    const techIconsConstellation = document.querySelector(
      '.tech-icons-constellation'
    );
    if (techIconsConstellation) {
      const icons =
        techIconsConstellation.querySelectorAll('.tech-icon-orbital');

      icons.forEach((icon, index) => {
        const delay = parseFloat(icon.getAttribute('data-delay') || '0');

        gsap.to(icon, {
          rotation: 360,
          duration: 20 + index * 5,
          ease: 'linear',
          repeat: -1,
          delay,
        });

        gsap.to(icon, {
          scale: 1.1,
          duration: 3 + index,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay,
        });
      });
    }

    // Enhanced avatar interactions
    if (avatarRef.current) {
      // Subtle scaling on hover
      avatarRef.current.addEventListener('mouseenter', () => {
        gsap.to(avatarRef.current, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      });

      avatarRef.current.addEventListener('mouseleave', () => {
        gsap.to(avatarRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    }

    // 🚀 Enhanced Button Interactions & UX Flow
    if (buttonsRef.current) {
      const buttons = Array.from(buttonsRef.current.children) as HTMLElement[];

      buttons.forEach((button, index) => {
        // Enhanced hover animations
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.08,
            y: -4,
            duration: 0.3,
            ease: 'power2.out',
          });

          // Add glow effect
          gsap.to(button, {
            boxShadow: '0 20px 40px rgba(251, 146, 60, 0.3)',
            duration: 0.3,
          });
        });

        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });

          gsap.to(button, {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
            duration: 0.3,
          });
        });

        // Click animation with ripple effect
        button.addEventListener('click', () => {
          // Scale down and up for click feedback
          gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(button, {
                scale: 1.05,
                duration: 0.2,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'elastic.out(1, 0.5)',
                  });
                },
              });
            },
          });

          // Create click ripple effect
          const ripple = document.createElement('span');
          ripple.className =
            'absolute inset-0 rounded-xl bg-white opacity-20 scale-0';
          button.appendChild(ripple);

          gsap.to(ripple, {
            scale: 1,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => {
              ripple.remove();
            },
          });
        });

        // Floating animation with staggered delay
        gsap.to(button, {
          y: -2,
          duration: 2 + index * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.2,
        });
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-32"
    >
      {/* 🚀 Debug Overlay for Mobile Touch Interactions */}
      {(debugMode !== 'auto' || process.env.NODE_ENV === 'development') && (
        <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl border border-gray-600 text-xs font-mono z-50 pointer-events-none">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMobile ? 'bg-orange-400' : 'bg-purple-400'
                }`}
              ></span>
              <span>Mode: {isMobile ? '📱 Mobile' : '🖥️ Desktop'}</span>
            </div>
            <div>Debug: {debugMode}</div>
            <div>Performance: {performanceModeRef.current?.toUpperCase()}</div>
            <div>FPS: {fpsCounterRef.current.toFixed(1)}</div>
            <div>
              Viewport: {windowDimensions.width}×{windowDimensions.height}
            </div>
            <div className="text-gray-400 mt-2 text-[10px]">
              Shift+Alt+D: Mobile | Shift+Ctrl+D: Desktop | Shift+D: Auto
            </div>
          </div>
        </div>
      )}
      {/* Background dots - enhanced with more layers and animation */}
      <div
        ref={bgDotsRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
      >
        {/* Multiple layers of dots with varying sizes, colors, and animations */}
        <div className="absolute inset-0 grid grid-cols-8 gap-4 opacity-30">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="gsap-dot rounded-full"
              style={{
                backgroundColor: `hsl(${(i * 15) % 360}, 70%, 60%)`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                animationDelay: `${Math.random() * 5}s`,
                gridColumn: `span ${Math.floor(Math.random() * 3) + 1}`,
                gridRow: `span ${Math.floor(Math.random() * 3) + 1}`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 grid grid-cols-8 gap-4 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="gsap-dot rounded-full"
              style={{
                backgroundColor: `hsl(${(i * 30) % 360}, 70%, 50%)`,
                width: `${Math.random() * 12 + 6}px`,
                height: `${Math.random() * 12 + 6}px`,
                animationDelay: `${Math.random() * 10}s`,
                gridColumn: `span ${Math.floor(Math.random() * 4) + 1}`,
                gridRow: `span ${Math.floor(Math.random() * 4) + 1}`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero section - refined layout and spacing */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between">
          {/* Left content - introduction and download section */}
          <div className="max-w-xl mb-16 lg:mb-0">
            {/* Enhanced greeting with dynamic effects */}
            <motion.div
              ref={greetingRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-lg sm:text-xl font-semibold text-gray-300 mb-4"
            >
              Hello, I&apos;m
            </motion.div>

            {/* Name with typing effect */}
            <motion.h1
              ref={nameRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl font-extrabold leading-tight mb-2"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
                {personalInfo.displayName}
              </span>
            </motion.h1>

            {/* Title and subtitle with staggered animation */}
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <motion.h2
                ref={titleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2 sm:mb-0"
              >
                Game Developer
              </motion.h2>
              <motion.p
                ref={subtitleRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-lg sm:text-xl text-gray-400 leading-relaxed"
              >
                Creating immersive experiences with Unity & Unreal Engine
              </motion.p>
            </div>

            {/* 🚀 REDESIGNED: Clean and Focused CTA Layout */}
            <motion.div
              ref={buttonsRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="hero-buttons mt-10 space-y-6"
            >
              {/* PRIMARY CTA - Single Focus Action */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={async () => {
                  setButtonStates((prev) => ({
                    ...prev,
                    viewWork: { isLoading: true, isPressed: true },
                  }));

                  if (navigator.vibrate) {
                    navigator.vibrate(50);
                  }

                  await new Promise((resolve) => setTimeout(resolve, 200));

                  if (onNavigate) {
                    onNavigate('portfolio');
                  } else {
                    const portfolioSection =
                      document.getElementById('portfolio');
                    if (portfolioSection) {
                      portfolioSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                    }
                  }

                  setButtonStates((prev) => ({
                    ...prev,
                    viewWork: { isLoading: false, isPressed: false },
                  }));
                }}
                disabled={buttonStates.viewWork.isLoading}
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-5 text-xl font-bold text-white bg-gradient-to-r from-orange-500 via-orange-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
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

                {/* Multiple shine effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-300/30 to-transparent -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1200 ease-out"></div>

                {/* Ripple effect */}
                {buttonStates.viewWork.isPressed && (
                  <div className="absolute inset-0 rounded-2xl animate-ping bg-white/30"></div>
                )}
              </motion.button>

              {/* SECONDARY ACTIONS - Elegant Link Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex items-center justify-center gap-8 text-sm"
              >
                {/* Download Resume Link */}
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={personalInfo.resume}
                  download="William_Resume.pdf"
                  onClick={async () => {
                    setButtonStates((prev) => ({
                      ...prev,
                      downloadResume: {
                        isLoading: true,
                        isPressed: true,
                        isSuccess: false,
                      },
                    }));

                    if (navigator.vibrate) {
                      navigator.vibrate(100);
                    }

                    await new Promise((resolve) => setTimeout(resolve, 800));

                    setButtonStates((prev) => ({
                      ...prev,
                      downloadResume: {
                        isLoading: false,
                        isPressed: false,
                        isSuccess: true,
                      },
                    }));

                    setTimeout(() => {
                      setButtonStates((prev) => ({
                        ...prev,
                        downloadResume: {
                          ...prev.downloadResume,
                          isSuccess: false,
                        },
                      }));
                    }, 2000);
                  }}
                  className="group flex items-center gap-2 text-gray-400 hover:text-orange-400 transition-all duration-300 border-b border-transparent hover:border-orange-400/50"
                  aria-label="Download resume PDF"
                >
                  {buttonStates.downloadResume.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : buttonStates.downloadResume.isSuccess ? (
                    <div className="w-4 h-4 text-green-400">
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
                <div className="w-px h-4 bg-gray-600"></div>

                {/* Contact Link */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={async () => {
                    setButtonStates((prev) => ({
                      ...prev,
                      contact: { isLoading: true, isPressed: true },
                    }));

                    if (navigator.vibrate) {
                      navigator.vibrate(75);
                    }

                    await new Promise((resolve) => setTimeout(resolve, 200));

                    if (onNavigate) {
                      onNavigate('contact');
                    } else {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }
                    }

                    setButtonStates((prev) => ({
                      ...prev,
                      contact: { isLoading: false, isPressed: false },
                    }));
                  }}
                  className="group flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-all duration-300 border-b border-transparent hover:border-purple-400/50"
                  aria-label="Navigate to contact section"
                >
                  {buttonStates.contact.isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  <span className="font-medium">Get In Touch</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right content - Enhanced Avatar with WOW Effect */}
          <div
            ref={avatarRef}
            className="relative flex items-center justify-center min-h-[400px]"
          >
            {/* 🌟 2025 ENHANCEMENT: Quantum Energy Field Canvas */}
            <canvas
              ref={quantumFieldRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60"
              style={{
                width: '400px',
                height: '400px',
                zIndex: 0,
              }}
            />

            {/* 🌟 2025 ENHANCEMENT: Neural Network Overlay Canvas */}
            <canvas
              ref={neuralNetworkRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40"
              style={{
                width: '400px',
                height: '400px',
                zIndex: 1,
              }}
            />

            {/* 🌟 2025 ENHANCEMENT: Reality Distortion Field */}
            <div
              ref={realityDistortionRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 2 }}
            >
              {/* Morphing geometric shapes */}
              <div
                className="absolute top-0 left-0 w-6 h-6 bg-orange-400/20 rotate-45 blur-sm"
                style={{ transform: 'translate(-30px, -30px)' }}
              />
              <div
                className="absolute top-0 right-0 w-4 h-4 bg-purple-400/20 rounded-full blur-sm"
                style={{ transform: 'translate(30px, -30px)' }}
              />
              <div
                className="absolute bottom-0 left-0 w-5 h-5 bg-orange-400/20 rounded-full blur-sm"
                style={{ transform: 'translate(-30px, 30px)' }}
              />
              <div
                className="absolute bottom-0 right-0 w-6 h-6 bg-purple-400/20 rotate-45 blur-sm"
                style={{ transform: 'translate(30px, 30px)' }}
              />
            </div>

            {/* 🌟 2025 ENHANCEMENT: Energy Portal Effect */}
            <div
              ref={energyPortalRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {/* Dimensional gateway rings */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                style={{
                  width: '450px',
                  height: '450px',
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.3), transparent, rgba(251, 146, 60, 0.3), transparent)',
                  filter: 'blur(3px)',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
                style={{
                  width: '500px',
                  height: '500px',
                  background:
                    'conic-gradient(from 180deg, transparent, rgba(168, 85, 247, 0.3), transparent, rgba(251, 146, 60, 0.2), transparent)',
                  filter: 'blur(5px)',
                }}
              />
            </div>

            {/* 🌟 2025 ENHANCEMENT: Plasma Rings System */}
            <div
              ref={plasmaRingsRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 3 }}
            >
              {/* Electric plasma rings */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-30"
                style={{
                  width: '350px',
                  height: '350px',
                  borderColor: 'rgba(251, 146, 60, 0.6)',
                  borderWidth: '1px',
                  filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.4))',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-25"
                style={{
                  width: '380px',
                  height: '380px',
                  borderColor: 'rgba(168, 85, 247, 0.6)',
                  borderWidth: '1px',
                  filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.4))',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-20"
                style={{
                  width: '420px',
                  height: '420px',
                  borderColor: 'rgba(6, 182, 212, 0.6)',
                  borderWidth: '1px',
                  filter: 'drop-shadow(0 0 20px rgba(6, 182, 212, 0.4))',
                }}
              />
            </div>

            {/* 🌟 2025 ENHANCEMENT: Cosmic Waves Container */}
            <div
              ref={cosmicWavesRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ zIndex: 2 }}
            />

            {/* Avatar container with perfect centering - using absolute positioning */}
            <div
              className="relative w-[400px] h-[400px] flex items-center justify-center"
              style={{ zIndex: 10 }}
            >
              {/* 🌟 WOW EFFECT: Outermost atmospheric ring - largest scale */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 animate-pulse"
                style={{
                  width: '400px',
                  height: '400px',
                  background:
                    'radial-gradient(circle, rgba(251, 146, 60, 0.15) 0%, rgba(168, 85, 247, 0.1) 50%, transparent 70%)',
                  filter: 'blur(20px)',
                  animationDuration: '4s',
                }}
              />

              {/* 🌟 WOW EFFECT: Large outer glow ring */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
                style={{
                  width: '320px',
                  height: '320px',
                  background:
                    'radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, rgba(168, 85, 247, 0.15) 60%, transparent 80%)',
                  filter: 'blur(15px)',
                  animation: 'pulse 3s ease-in-out infinite',
                }}
              />

              {/* 🌟 WOW EFFECT: Medium rotating conic gradient ring */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
                style={{
                  width: '280px',
                  height: '280px',
                  background:
                    'conic-gradient(from 180deg, transparent, rgba(251, 146, 60, 0.4), transparent, rgba(168, 85, 247, 0.3), transparent)',
                  animation: 'spin 25s linear infinite reverse',
                  filter: 'blur(1px)',
                }}
              />

              {/* 🌟 WOW EFFECT: Main rotating border ring - perfectly centered */}
              <div
                ref={ringRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 hover:opacity-90 transition-opacity duration-300"
                style={{
                  width: '240px',
                  height: '240px',
                  background:
                    'conic-gradient(from 0deg, #fb923c, #a855f7, #fb923c, #a855f7, #fb923c)',
                  padding: '3px',
                }}
              >
                <div className="w-full h-full bg-gray-900 rounded-full" />
              </div>

              {/* 🌟 WOW EFFECT: Inner energy ring with gradient */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 animate-pulse"
                style={{
                  width: '200px',
                  height: '200px',
                  background:
                    'linear-gradient(45deg, rgba(251, 146, 60, 0.3), rgba(168, 85, 247, 0.2))',
                  filter: 'blur(8px)',
                  animationDuration: '2s',
                }}
              />

              {/* 🌟 WOW EFFECT: Holographic shimmer overlay */}
              <div
                ref={hologramRef}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 scale-95 pointer-events-none transition-all duration-500"
                style={{
                  width: '180px',
                  height: '180px',
                  background:
                    'linear-gradient(45deg, rgba(6, 182, 212, 0.2), rgba(168, 85, 247, 0.15), rgba(251, 146, 60, 0.2))',
                  filter: 'blur(2px)',
                }}
              />

              {/* 🌟 WOW EFFECT: Subtle pulse ring for depth */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 animate-pulse"
                style={{
                  width: '170px',
                  height: '170px',
                  background:
                    'radial-gradient(circle, rgba(251, 146, 60, 0.2) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)',
                  animationDuration: '2.5s',
                }}
              />

              {/* Avatar with clean border - perfectly centered */}
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-full p-1 shadow-2xl"
                style={{
                  width: '160px',
                  height: '160px',
                }}
              >
                <Image
                  src={personalInfo.portrait}
                  alt={personalInfo.fullName}
                  width={320}
                  height={320}
                  className="w-full h-full rounded-full object-cover shadow-lg"
                  priority
                />

                {/* Avatar hover overlay effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400/0 via-transparent to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* 🌟 DESKTOP: Enhanced Floating Tech Icons - Original Style with Better Animations */}
              {isClient && !isMobile && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  {/* Corner tech icons with enhanced hover animations - Original Style Restored */}
                  {[
                    {
                      icon: '🎮',
                      position: 'top-8 left-8',
                      skill: 'Unity Engine',
                      delay: 0,
                      color: 'orange',
                    },
                    {
                      icon: '🛠️',
                      position: 'top-8 right-8',
                      skill: 'Unreal Engine',
                      delay: 0.5,
                      color: 'blue',
                    },
                    {
                      icon: '💎',
                      position: 'bottom-8 left-8',
                      skill: 'C# Expert',
                      delay: 1,
                      color: 'purple',
                    },
                    {
                      icon: '⚡',
                      position: 'bottom-8 right-8',
                      skill: 'C++/Modern C',
                      delay: 1.5,
                      color: 'cyan',
                    },
                    {
                      icon: '🎯',
                      position: 'top-1/2 left-4',
                      skill: 'Game Dev',
                      delay: 2,
                      color: 'green',
                    },
                    {
                      icon: '🔧',
                      position: 'top-1/2 right-4',
                      skill: 'Tools & IDE',
                      delay: 2.5,
                      color: 'yellow',
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`tech-icon absolute ${item.position} text-3xl cursor-pointer group hover:scale-125 hover:rotate-12 transition-all duration-500 pointer-events-auto`}
                      data-delay={item.delay}
                      style={{
                        filter: 'drop-shadow(0 0 12px rgba(251, 146, 60, 0.8))',
                        animation: `float-gentle 4s ease-in-out infinite`,
                        animationDelay: `${item.delay}s`,
                        transformOrigin: 'center',
                      }}
                    >
                      <div className="tech-icon-container relative">
                        {/* Enhanced icon background with animated glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-purple-500/30 rounded-full blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />

                        {/* Floating particle effect */}
                        <div
                          className="absolute inset-0 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-500"
                          style={{
                            background: `conic-gradient(from 0deg, transparent, rgba(251, 146, 60, 0.4), transparent)`,
                            animation: 'spin 8s linear infinite',
                          }}
                        />

                        {/* Main icon container with enhanced styling */}
                        <span className="relative z-10 block p-4 bg-gray-800/90 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl group-hover:shadow-orange-500/20 group-hover:border-orange-500/60 transition-all duration-500 group-hover:bg-gray-700/90">
                          <span className="block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            {item.icon}
                          </span>
                        </span>

                        {/* Enhanced tooltip with better positioning */}
                        <div
                          className="tech-icon-tooltip absolute -top-14 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none border border-gray-700/50 shadow-2xl whitespace-nowrap z-50"
                          style={{
                            boxShadow: '0 0 20px rgba(251, 146, 60, 0.3)',
                          }}
                        >
                          {item.skill}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                        </div>

                        {/* Pulse ring effect on hover */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-orange-400/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 🌟 MOBILE: Enhanced Animated Tech Icons Constellation */}
              {isClient && isMobile && (
                <div
                  ref={constellationContainerRef}
                  className={`tech-icons-constellation relative overflow-hidden ${performanceClass}`}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '90vw',
                    contain: 'layout style paint',
                  }}
                >
                  {[
                    {
                      icon: '🎮',
                      label: 'Unity Engine',
                      angle: 0,
                      radius: 180,
                      delay: 0,
                      duration: 20,
                      color: 'from-blue-400 to-indigo-500',
                      glowColor: '#3b82f6',
                      mobileAnimation: 'breathe',
                    },
                    {
                      icon: '🛠️',
                      label: 'Unreal Engine',
                      angle: 90,
                      radius: 160,
                      delay: 0.5,
                      duration: 25,
                      color: 'from-gray-400 to-slate-500',
                      glowColor: '#64748b',
                      mobileAnimation: 'pulse',
                    },
                    {
                      icon: '💎',
                      label: 'C# Expert',
                      angle: 180,
                      radius: 200,
                      delay: 1,
                      duration: 30,
                      color: 'from-purple-400 to-violet-500',
                      glowColor: '#8b5cf6',
                      mobileAnimation: 'glow',
                    },
                    {
                      icon: '⚡',
                      label: 'C#/C++/Modern C',
                      angle: 270,
                      radius: 175,
                      delay: 1.5,
                      duration: 22,
                      color: 'from-cyan-400 to-blue-500',
                      glowColor: '#06b6d4',
                      mobileAnimation: 'shake',
                    },
                    {
                      icon: '🎯',
                      label: 'OOP & SOLID',
                      angle: 45,
                      radius: 190,
                      delay: 2,
                      duration: 28,
                      color: 'from-orange-400 to-red-500',
                      glowColor: '#fb923c',
                      mobileAnimation: 'bounce',
                    },
                    {
                      icon: '🔧',
                      label: 'Tools & IDE',
                      angle: 315,
                      radius: 165,
                      delay: 2.5,
                      duration: 35,
                      color: 'from-green-400 to-emerald-500',
                      glowColor: '#22c55e',
                      mobileAnimation: 'rotate',
                    },
                  ].map((item, index) => {
                    // Mobile-responsive orbital radius calculation using state
                    const mobileScale = isMobile ? 0.6 : 1; // Scale down on mobile
                    const responsiveRadius = item.radius * mobileScale;

                    // Ensure orbit stays within viewport bounds on mobile
                    const maxRadius = isMobile
                      ? Math.min(120, windowDimensions.width * 0.25)
                      : item.radius;
                    const orbitRadius = Math.min(responsiveRadius, maxRadius);

                    const x =
                      Math.cos((item.angle * Math.PI) / 180) * orbitRadius;
                    const y =
                      Math.sin((item.angle * Math.PI) / 180) * orbitRadius;

                    return (
                      <div
                        key={index}
                        className="absolute tech-icon-orbital group cursor-pointer"
                        data-original-duration={`${item.duration}s`}
                        data-icon-label={item.label}
                        data-glow-color={item.glowColor}
                        style={
                          {
                            left: '50%',
                            top: '50%',
                            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                            zIndex: 5,
                            '--orbit-duration': `${item.duration}s`,
                            '--delay': `${item.delay}s`,
                            '--glow-color': item.glowColor,
                            '--orbit-radius': `${orbitRadius}px`,
                            animation: `orbit-smooth ${item.duration}s linear infinite`,
                            animationDelay: `${item.delay}s`,
                          } as React.CSSProperties
                        }
                        onClick={(e) => {
                          e.stopPropagation();

                          // Enhanced mobile touch interaction with individual icon handling
                          const rect = e.currentTarget.getBoundingClientRect();
                          const centerX = rect.left + rect.width / 2;
                          const centerY = rect.top + rect.height / 2;

                          // Create targeted explosion at icon center
                          if (constellationContainerRef.current) {
                            const containerRect =
                              constellationContainerRef.current.getBoundingClientRect();
                            const relX = centerX - containerRect.left;
                            const relY = centerY - containerRect.top;

                            // Create icon-specific explosion
                            createIconExplosion(relX, relY, item, index);

                            // Create focused ripple
                            createIconRipple(relX, relY, item.glowColor);

                            // Enhanced haptic feedback with pattern
                            if (navigator.vibrate) {
                              navigator.vibrate([30, 20, 50, 20, 30]);
                            }

                            // Show tooltip for longer duration
                            const iconElement =
                              e.currentTarget.closest('.tech-icon-orbital');
                            if (iconElement) {
                              const tooltip = iconElement.querySelector(
                                '.absolute.-top-16'
                              ) as HTMLElement;
                              if (tooltip) {
                                tooltip.style.opacity = '1';
                                tooltip.style.transform =
                                  'translateX(-50%) scale(1.05)';
                                tooltip.style.transition = 'all 0.3s ease-out';

                                setTimeout(() => {
                                  if (tooltip) {
                                    tooltip.style.opacity = '0';
                                    tooltip.style.transform =
                                      'translateX(-50%) scale(1)';
                                  }
                                }, 3000);
                              }
                            }

                            // Add temporary visual feedback to the icon
                            const iconContainer = e.currentTarget;
                            iconContainer.style.transform =
                              'translate(-50%, -50%) scale(1.2)';
                            iconContainer.style.filter = `brightness(1.5) saturate(1.5) drop-shadow(0 0 30px ${item.glowColor})`;
                            iconContainer.style.transition =
                              'all 0.2s ease-out';

                            setTimeout(() => {
                              iconContainer.style.transform =
                                'translate(-50%, -50%) scale(1)';
                              iconContainer.style.filter = '';
                              iconContainer.style.transition =
                                'all 0.5s ease-out';
                            }, 200);
                          }
                        }}
                      >
                        {/* Enhanced Orbital trail effect */}
                        <div
                          className="absolute inset-0 rounded-full opacity-20 pointer-events-none animate-pulse"
                          style={{
                            width: '70px',
                            height: '70px',
                            background: `radial-gradient(circle, ${item.glowColor}40 0%, transparent 70%)`,
                            filter: 'blur(12px)',
                            transform: 'translate(-50%, -50%)',
                            animation: 'trail-rotate 4s ease-in-out infinite',
                          }}
                        />

                        {/* Main icon container with enhanced mobile animations */}
                        <div
                          className={`tech-icon-container icon-container relative w-16 h-16 backdrop-blur-sm border border-gray-700/60 rounded-2xl flex items-center justify-center text-2xl shadow-2xl transition-all duration-700 
                          hover:scale-125 hover:rotate-12 hover:shadow-2xl
                          md:hover:scale-125 md:hover:rotate-12`}
                          style={
                            {
                              background: `linear-gradient(135deg, rgba(55, 65, 81, 0.95), rgba(31, 41, 55, 0.98))`,
                              boxShadow: `0 0 20px ${item.glowColor}60, inset 0 0 20px rgba(255, 255, 255, 0.1)`,
                              transform: 'translate(-50%, -50%)',
                              animation: `float-gentle 4s ease-in-out infinite, ${item.mobileAnimation}-continuous 6s ease-in-out infinite`,
                              animationDelay: `${index * 0.5}s, ${
                                index * 0.8 + 2
                              }s`,
                              '--glow-color': `${item.glowColor}60`,
                            } as React.CSSProperties
                          }
                        >
                          {/* Hover glow effect */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-30 rounded-2xl transition-all duration-700 blur-sm`}
                          />

                          {/* Mobile Auto-Glow Effect */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 animate-auto-glow rounded-2xl blur-sm`}
                            style={{
                              animationDelay: `${index * 1.5 + 3}s`,
                              animationDuration: '4s',
                            }}
                          />

                          {/* Spinning border on hover and mobile pulse */}
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-mobile-border-pulse"
                            style={{
                              background: `conic-gradient(from 0deg, ${item.glowColor}80, transparent, ${item.glowColor}80)`,
                              padding: '2px',
                              animation:
                                'spin 2s linear infinite, mobile-border-pulse 8s ease-in-out infinite',
                              animationDelay: `0s, ${index * 2}s`,
                            }}
                          >
                            <div className="w-full h-full bg-gray-800/90 rounded-2xl" />
                          </div>

                          {/* Icon with enhanced mobile effects */}
                          <span
                            className="group-hover:scale-110 transition-all duration-500 relative z-10 animate-icon-dance"
                            style={{
                              filter: `drop-shadow(0 0 8px ${item.glowColor}80)`,
                              textShadow: `0 0 10px ${item.glowColor}60`,
                              animation: `icon-dance 8s ease-in-out infinite`,
                              animationDelay: `${index * 1.2}s`,
                            }}
                          >
                            {item.icon}
                          </span>

                          {/* Enhanced tooltip with mobile-friendly positioning */}
                          <div
                            className="tech-icon-tooltip absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 group-active:opacity-100 transition-all duration-300 pointer-events-none border border-gray-700/50 shadow-xl whitespace-nowrap z-50"
                            style={{
                              boxShadow: `0 0 20px ${item.glowColor}40`,
                            }}
                          >
                            {item.label}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                          </div>

                          {/* Enhanced particle trail effect with mobile visibility */}
                          <div
                            className="absolute inset-0 rounded-full opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none animate-mobile-particles"
                            style={{
                              background: `conic-gradient(from 180deg, transparent, ${item.glowColor}60, transparent)`,
                              filter: 'blur(4px)',
                              animation:
                                'particle-drift 6s ease-in-out infinite, mobile-particles 10s ease-in-out infinite',
                              animationDelay: `${index * 0.8}s, ${
                                index * 2.5
                              }s`,
                            }}
                          />

                          {/* Mobile Touch Ripple Effect */}
                          <div
                            className="absolute inset-0 rounded-2xl opacity-0 animate-touch-ripple pointer-events-none"
                            style={{
                              background: `radial-gradient(circle, ${item.glowColor}30 0%, transparent 70%)`,
                              animation: `touch-ripple 12s ease-in-out infinite`,
                              animationDelay: `${index * 3}s`,
                            }}
                          />
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
                        transition={{
                          delay: 2.6 + categoryIndex * 0.2 + skillIndex * 0.1,
                        }}
                        className="flex items-center gap-3 px-4 py-3 bg-gray-700/50 backdrop-blur-sm rounded-2xl border border-gray-600/30 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 group/skill shadow-md hover:shadow-lg hover:shadow-orange-500/20"
                      >
                        <div className="group-hover/skill:scale-125 transition-transform duration-300">
                          <SkillIcon
                            skillId={skill.id}
                            className="w-6 h-6 text-orange-400"
                          />
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

        {/* 🌟 NEW: Statistics Section with Counter Animation */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 py-8"
        >
          {[
            { number: '15+', label: 'Projects Completed', icon: '🚀' },
            { number: '3+', label: 'Years Experience', icon: '⏰' },
            { number: '100%', label: 'Client Satisfaction', icon: '⭐' },
            { number: '24/7', label: 'Support Available', icon: '💬' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.4 + index * 0.1 }}
              className="text-center p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-2xl hover:border-orange-500/50 hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-orange-400 mb-2 group-hover:text-orange-300 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </section>
  );
};

export default Home;
