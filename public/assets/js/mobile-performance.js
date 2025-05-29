/**
 * Mobile Performance Optimization System
 * Features: Lazy loading, image optimization, battery monitoring, memory management
 */

class MobilePerformanceOptimizer {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.performanceMetrics = {};
    this.imageObserver = null;
    this.batteryLevel = 1;
    this.isLowPowerMode = false;
    this.memoryThreshold = 50; // MB
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async init() {
    await this.initBatteryMonitoring();
    this.initMemoryMonitoring();
    this.initPerformanceMonitoring();
    this.setupLazyLoading();
    this.optimizeImages();
    this.implementVirtualScrolling();
    this.setupPreloading();
    this.createPerformanceIndicator();
    this.optimizeAnimations();
  }

  async initBatteryMonitoring() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        this.batteryLevel = battery.level;
        this.isLowPowerMode = battery.level < 0.2;

        battery.addEventListener('levelchange', () => {
          this.batteryLevel = battery.level;
          this.isLowPowerMode = battery.level < 0.2;
          this.adjustPerformanceBasedOnBattery();
        });

        battery.addEventListener('chargingchange', () => {
          this.adjustPerformanceBasedOnBattery();
        });
      } catch (error) {
        console.warn('Battery API not available');
      }
    }
  }

  initMemoryMonitoring() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memoryInfo = performance.memory;
        const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
        
        if (usedMB > this.memoryThreshold) {
          this.enableLowMemoryMode();
        }
        
        this.performanceMetrics.memory = {
          used: usedMB,
          total: memoryInfo.totalJSHeapSize / 1024 / 1024,
          limit: memoryInfo.jsHeapSizeLimit / 1024 / 1024
        };
      };

      setInterval(checkMemory, 5000);
      checkMemory();
    }
  }

  initPerformanceMonitoring() {
    // FPS monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.fps = frameCount;
        
        // Adjust quality based on FPS
        if (frameCount < 30) {
          this.enableLowPerformanceMode();
        } else if (frameCount > 50) {
          this.enableHighPerformanceMode();
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFPS);
    };
    
    requestAnimationFrame(monitorFPS);

    // Network monitoring
    if ('connection' in navigator) {
      const connection = navigator.connection;
      this.performanceMetrics.network = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      };

      connection.addEventListener('change', () => {
        this.performanceMetrics.network = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
        this.adjustPerformanceBasedOnNetwork();
      });
    }
  }

  setupLazyLoading() {
    // Enhanced lazy loading with intersection observer
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.imageObserver.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all images with data-src
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));

    // Also observe dynamically added images
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const lazyImages = node.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => this.imageObserver.observe(img));
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    // Create a new image to test loading
    const imageLoader = new Image();
    
    imageLoader.onload = () => {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };

    imageLoader.onerror = () => {
      img.classList.add('error');
      // Fallback to placeholder
      img.src = '/assets/images/placeholder.png';
    };

    imageLoader.src = src;
  }

  optimizeImages() {
    // Create responsive images with WebP support
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach(img => {
      if (img.src && !img.dataset.optimized) {
        this.createResponsiveImage(img);
        img.dataset.optimized = 'true';
      }
    });
  }

  createResponsiveImage(img) {
    const src = img.src;
    const basePath = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();

    // Check WebP support
    const supportsWebP = document.body.classList.contains('webp-support');
    
    if (supportsWebP) {
      // Create WebP srcset
      const webpSrcset = [
        `${basePath}-400w.webp 400w`,
        `${basePath}-800w.webp 800w`,
        `${basePath}-1200w.webp 1200w`
      ].join(', ');

      img.srcset = webpSrcset;
      img.sizes = '(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px';
    }

    // Add loading strategy based on device capabilities
    if (this.isLowPowerMode || this.performanceMetrics.network?.effectiveType === 'slow-2g') {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
  }

  implementVirtualScrolling() {
    // Virtual scrolling for large lists
    const largeContainers = document.querySelectorAll('.large-list, .portfolio-grid');
    
    largeContainers.forEach(container => {
      this.setupVirtualScrolling(container);
    });
  }

  setupVirtualScrolling(container) {
    const items = Array.from(container.children);
    const itemHeight = 200; // Estimated item height
    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(containerHeight / itemHeight) + 2; // Buffer

    let scrollTop = 0;
    let startIndex = 0;

    const updateVisibleItems = () => {
      const newStartIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = Math.min(newStartIndex + visibleItems, items.length);

      if (newStartIndex !== startIndex) {
        startIndex = newStartIndex;

        // Hide all items
        items.forEach(item => item.style.display = 'none');

        // Show visible items
        for (let i = startIndex; i < endIndex; i++) {
          if (items[i]) {
            items[i].style.display = 'block';
            items[i].style.transform = `translateY(${i * itemHeight}px)`;
          }
        }
      }
    };

    container.addEventListener('scroll', () => {
      scrollTop = container.scrollTop;
      requestAnimationFrame(updateVisibleItems);
    });

    updateVisibleItems();
  }

  setupPreloading() {
    // Preload critical resources
    const criticalResources = [
      '/assets/css/style.css',
      '/assets/js/script.js',
      '/assets/images/avatar.png'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      
      if (resource.endsWith('.css')) {
        link.as = 'style';
      } else if (resource.endsWith('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
        link.as = 'image';
      }
      
      link.href = resource;
      document.head.appendChild(link);
    });

    // Intelligent preloading based on user behavior
    this.setupIntelligentPreloading();
  }

  setupIntelligentPreloading() {
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;

      // Preload next section if scrolling down
      if (scrollDirection === 'down') {
        this.preloadNextSection();
      }
    });

    // Preload on hover with delay
    document.addEventListener('mouseenter', (e) => {
      if (e.target.tagName === 'A' && e.target.href) {
        setTimeout(() => {
          this.preloadPage(e.target.href);
        }, 100);
      }
    }, true);
  }

  preloadNextSection() {
    const sections = ['about', 'resume', 'portfolio', 'contact'];
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      this.preloadSectionAssets(nextSection);
    }
  }

  preloadSectionAssets(section) {
    // Define assets for each section
    const sectionAssets = {
      resume: ['/assets/images/resume-bg.jpg'],
      portfolio: ['/assets/images/portfolio-1.jpg', '/assets/images/portfolio-2.jpg'],
      contact: ['/assets/images/contact-bg.jpg']
    };

    const assets = sectionAssets[section] || [];
    assets.forEach(asset => {
      if (!document.querySelector(`link[href="${asset}"]`)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = asset;
        document.head.appendChild(link);
      }
    });
  }

  preloadPage(url) {
    if (!document.querySelector(`link[href="${url}"]`)) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    }
  }

  createPerformanceIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'performance-indicator';
    indicator.innerHTML = `
      <div class="perf-metrics">
        <span class="fps-counter">FPS: --</span>
        <span class="memory-usage">Memory: --</span>
        <span class="battery-level">Battery: --</span>
      </div>
    `;

    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 10px;
      font-family: monospace;
      z-index: 10000;
      display: none;
    `;

    document.body.appendChild(indicator);

    // Show in development or when debug mode is enabled
    if (localStorage.getItem('showPerformanceMetrics') === 'true') {
      indicator.style.display = 'block';
    }

    // Update metrics
    setInterval(() => {
      const fpsCounter = indicator.querySelector('.fps-counter');
      const memoryUsage = indicator.querySelector('.memory-usage');
      const batteryLevel = indicator.querySelector('.battery-level');

      if (fpsCounter) fpsCounter.textContent = `FPS: ${this.performanceMetrics.fps || '--'}`;
      if (memoryUsage) memoryUsage.textContent = `Memory: ${Math.round(this.performanceMetrics.memory?.used || 0)}MB`;
      if (batteryLevel) batteryLevel.textContent = `Battery: ${Math.round(this.batteryLevel * 100)}%`;
    }, 1000);
  }

  optimizeAnimations() {
    // Reduce animations in low power mode
    if (this.isLowPowerMode) {
      document.body.classList.add('reduced-motion');
      
      // Override CSS animations
      const style = document.createElement('style');
      style.textContent = `
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-delay: 0 !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Use will-change property for animating elements
    const animatedElements = document.querySelectorAll('.animated, .hover-effect, .transition');
    animatedElements.forEach(el => {
      el.style.willChange = 'transform, opacity';
    });
  }

  // Performance adjustment methods
  adjustPerformanceBasedOnBattery() {
    if (this.isLowPowerMode) {
      this.enableLowPowerMode();
    } else {
      this.disableLowPowerMode();
    }
  }

  adjustPerformanceBasedOnNetwork() {
    const connection = this.performanceMetrics.network;
    
    if (connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g') {
      this.enableDataSaverMode();
    } else {
      this.disableDataSaverMode();
    }
  }

  enableLowPowerMode() {
    document.body.classList.add('low-power-mode');
    
    // Reduce animation frequency
    this.reduceAnimations();
    
    // Lower image quality
    this.lowerImageQuality();
    
    // Pause non-essential features
    this.pauseNonEssentialFeatures();
  }

  disableLowPowerMode() {
    document.body.classList.remove('low-power-mode');
    this.restoreFullFeatures();
  }

  enableLowMemoryMode() {
    document.body.classList.add('low-memory-mode');
    
    // Clean up unused resources
    this.cleanupResources();
    
    // Reduce cache sizes
    this.reduceCacheSizes();
  }

  enableDataSaverMode() {
    document.body.classList.add('data-saver-mode');
    
    // Disable auto-playing videos
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => video.removeAttribute('autoplay'));
    
    // Reduce image quality
    this.lowerImageQuality();
  }

  disableDataSaverMode() {
    document.body.classList.remove('data-saver-mode');
  }

  enableLowPerformanceMode() {
    document.body.classList.add('low-performance-mode');
    this.reduceAnimations();
  }

  enableHighPerformanceMode() {
    document.body.classList.remove('low-performance-mode');
    this.restoreFullFeatures();
  }

  // Helper methods
  reduceAnimations() {
    const style = document.createElement('style');
    style.id = 'reduced-animations';
    style.textContent = `
      .low-power-mode * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
      }
    `;
    document.head.appendChild(style);
  }

  lowerImageQuality() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.srcset) {
        // Use lowest resolution in srcset
        const srcsetEntries = img.srcset.split(',');
        const lowestRes = srcsetEntries[0].trim().split(' ')[0];
        img.src = lowestRes;
        img.removeAttribute('srcset');
      }
    });
  }

  pauseNonEssentialFeatures() {
    // Pause particle systems
    const particleSystems = document.querySelectorAll('.particle-system');
    particleSystems.forEach(system => {
      system.style.display = 'none';
    });

    // Reduce scroll effects
    window.removeEventListener('scroll', this.scrollHandler);
  }

  restoreFullFeatures() {
    // Remove performance limitation styles
    const reducedAnimations = document.getElementById('reduced-animations');
    if (reducedAnimations) {
      reducedAnimations.remove();
    }

    // Restore particle systems
    const particleSystems = document.querySelectorAll('.particle-system');
    particleSystems.forEach(system => {
      system.style.display = '';
    });
  }

  cleanupResources() {
    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        const oldCaches = cacheNames.filter(name => !name.includes('v2.0.0'));
        oldCaches.forEach(cacheName => caches.delete(cacheName));
      });
    }

    // Remove unused DOM elements
    const hiddenElements = document.querySelectorAll('[style*="display: none"]');
    hiddenElements.forEach(el => {
      if (!el.classList.contains('important')) {
        el.remove();
      }
    });
  }

  reduceCacheSizes() {
    // Limit cache entries
    if ('caches' in window) {
      caches.open('dynamic-v2.0.0').then(cache => {
        cache.keys().then(requests => {
          if (requests.length > 50) {
            // Remove oldest entries
            const oldestRequests = requests.slice(0, requests.length - 30);
            oldestRequests.forEach(request => cache.delete(request));
          }
        });
      });
    }
  }

  getCurrentSection() {
    const sections = document.querySelectorAll('[data-page]');
    let currentSection = 'about';
    
    sections.forEach(section => {
      if (section.classList.contains('active')) {
        currentSection = section.dataset.page;
      }
    });
    
    return currentSection;
  }

  // Public API
  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  enableDebugMode() {
    localStorage.setItem('showPerformanceMetrics', 'true');
    document.querySelector('.performance-indicator').style.display = 'block';
  }

  disableDebugMode() {
    localStorage.setItem('showPerformanceMetrics', 'false');
    document.querySelector('.performance-indicator').style.display = 'none';
  }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.mobilePerformanceOptimizer = new MobilePerformanceOptimizer();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobilePerformanceOptimizer;
}
