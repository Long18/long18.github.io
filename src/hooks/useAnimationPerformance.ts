import { useState, useEffect, useRef } from 'react';

export type PerformanceMode = 'high' | 'medium' | 'low';

interface AnimationPerformanceHook {
  performanceMode: PerformanceMode;
  isMobile: boolean;
  isClient: boolean;
  fps: number;
  deviceCapabilities: {
    hasWebGL: boolean;
    hardwareConcurrency: number;
    deviceMemory: number | undefined;
    connectionType: string | undefined;
  };
}

export const useAnimationPerformance = (): AnimationPerformanceHook => {
  const [performanceMode, setPerformanceMode] = useState<PerformanceMode>('high');
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [fps, setFps] = useState(60);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasWebGL: false,
    hardwareConcurrency: 4,
    deviceMemory: undefined as number | undefined,
    connectionType: undefined as string | undefined,
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // Detect device capabilities
  useEffect(() => {
    setIsClient(true);

    const updateDimensions = () => {
      const width = window.innerWidth;
      const isMobileByWidth = width <= 768;
      const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileByWidth || isMobileByUA);
    };

    const detectCapabilities = () => {
      // WebGL detection
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasWebGL = !!gl;

      // Hardware capabilities
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      
      // Device memory (if available)
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      
      // Connection type (if available)
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
      const connectionType = connection?.effectiveType;

      setDeviceCapabilities({
        hasWebGL,
        hardwareConcurrency,
        deviceMemory,
        connectionType,
      });

      // Determine initial performance mode
      let initialMode: PerformanceMode = 'high';
      
      if (isMobile) {
        initialMode = 'medium';
      }
      
      if (!hasWebGL || hardwareConcurrency < 4) {
        initialMode = 'low';
      }
      
      if (deviceMemory && deviceMemory < 4) {
        initialMode = 'low';
      }
      
      if (connectionType && ['slow-2g', '2g'].includes(connectionType)) {
        initialMode = 'low';
      }

      setPerformanceMode(initialMode);
    };

    updateDimensions();
    detectCapabilities();

    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isMobile]);

  // FPS monitoring
  useEffect(() => {
    if (!isClient) return;

    const measureFPS = (timestamp: number) => {
      frameCountRef.current++;
      
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastTimeRef.current;
      
      // Calculate FPS every second
      if (elapsed >= 1000) {
        const currentFPS = Math.round((frameCountRef.current * 1000) / elapsed);
        setFps(currentFPS);
        
        // Adjust performance mode based on FPS
        if (currentFPS < 20 && performanceMode !== 'low') {
          setPerformanceMode('low');
          console.log('🔧 Performance Mode: Switched to LOW (FPS:', currentFPS, ')');
        } else if (currentFPS < 40 && currentFPS >= 20 && performanceMode === 'high') {
          setPerformanceMode('medium');
          console.log('🔧 Performance Mode: Switched to MEDIUM (FPS:', currentFPS, ')');
        } else if (currentFPS >= 50 && performanceMode !== 'high' && !isMobile) {
          setPerformanceMode('high');
          console.log('🔧 Performance Mode: Switched to HIGH (FPS:', currentFPS, ')');
        }
        
        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }
      
      animationFrameRef.current = requestAnimationFrame(measureFPS);
    };

    // Start FPS monitoring only if animations are expected to run
    if (performanceMode !== 'low') {
      animationFrameRef.current = requestAnimationFrame(measureFPS);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, performanceMode, isMobile]);

  return {
    performanceMode,
    isMobile,
    isClient,
    fps,
    deviceCapabilities,
  };
};

export default useAnimationPerformance;