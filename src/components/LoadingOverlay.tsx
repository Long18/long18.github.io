'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingOverlay() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Performance tracking
    if (window.performance) {
      const pageLoadTime =
        window.performance.timing.domContentLoadedEventEnd -
        window.performance.timing.navigationStart;
      console.log('Page load time:', pageLoadTime + 'ms');
    }

    // Hide loading overlay after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[60000] flex items-center justify-center bg-gradient-to-br from-eerie-black-2 via-smoky-black to-eerie-black-1"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-transparent to-orange-400/5" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(251,146,60,0.15) 1px, transparent 0)`,
                backgroundSize: '20px 20px',
              }}
            />
          </div>

          <div className="relative z-10 text-center">
            {/* Enhanced Loading Spinner */}
            <motion.div className="relative mb-8">
              {/* Outer Ring */}
              <motion.div
                className="w-16 h-16 border-4 border-orange-400/30 rounded-full absolute"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />

              {/* Inner Spinner */}
              <motion.div
                className="w-16 h-16 border-4 border-transparent border-t-orange-400 border-r-orange-400 rounded-full"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />

              {/* Center Dot */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>

            {/* Enhanced Loading Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2"
            >
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-white via-white-1 to-orange-200 bg-clip-text">
                Loading Portfolio
              </h2>
              <motion.p
                className="text-white-2/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Preparing awesome projects...
              </motion.p>
            </motion.div>

            {/* Loading Progress Dots */}
            <motion.div
              className="flex justify-center gap-1 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-orange-400/60 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
