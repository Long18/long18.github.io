/**
 * Mobile CSS Optimizations and Responsive Enhancements
 * Features: Critical CSS, responsive images, touch optimizations, dark mode
 */

class MobileCSSOptimizer {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.criticalCSS = new Set();
    this.deferredStyles = new Set();
    this.currentTheme = 'dark';
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  }

  init() {
    this.optimizeCriticalCSS();
    this.setupResponsiveImages();
    this.addTouchOptimizations();
    this.implementDarkModeOptimizations();
    this.addMobileSpecificStyles();
    this.optimizeAnimations();
    this.setupViewportOptimizations();
    this.addPrintStyles();
  }

  optimizeCriticalCSS() {
    // Identify and inline critical CSS
    const criticalSelectors = [
      'body', 'html', '.main-content', '.hero-section',
      '.navigation', '.sidebar', '.loading-overlay'
    ];

    const criticalStyles = `
      /* Critical Mobile-First Styles */
      * {
        box-sizing: border-box;
        -webkit-tap-highlight-color: transparent;
      }
      
      html {
        font-size: 16px;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        scroll-behavior: smooth;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeSpeed;
        background: #0f0f23;
        color: #ffffff;
        overflow-x: hidden;
      }
      
      /* Critical layout components */
      .main-content {
        min-height: 100vh;
        padding: 0;
        margin: 0;
      }
      
      .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      
      /* Loading state */
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0f0f23;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;

    this.injectCriticalCSS(criticalStyles);
  }

  injectCriticalCSS(styles) {
    const style = document.createElement('style');
    style.setAttribute('data-critical', 'true');
    style.textContent = styles;
    document.head.insertBefore(style, document.head.firstChild);
  }

  setupResponsiveImages() {
    // Add responsive image loading and optimization
    const responsiveCSS = `
      /* Responsive Images */
      img {
        max-width: 100%;
        height: auto;
        display: block;
        loading: lazy;
      }
      
      .responsive-image {
        position: relative;
        overflow: hidden;
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      .responsive-image img {
        transition: opacity 0.3s ease;
        opacity: 0;
      }
      
      .responsive-image img.loaded {
        opacity: 1;
      }
      
      /* Picture element optimizations */
      picture {
        display: block;
        width: 100%;
      }
      
      /* WebP support detection */
      .webp-support .webp-image {
        background-image: url('/assets/images/hero-bg.webp');
      }
      
      .no-webp .webp-image {
        background-image: url('/assets/images/hero-bg.jpg');
      }
    `;

    this.addStyles(responsiveCSS, 'responsive-images');
    this.setupImageLazyLoading();
    this.detectWebPSupport();
  }

  setupImageLazyLoading() {
    // Enhanced lazy loading with intersection observer
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  loadImage(img) {
    const container = img.closest('.responsive-image');
    if (container) {
      container.classList.add('loading');
    }

    // Create responsive srcset
    const baseSrc = img.dataset.src;
    if (baseSrc) {
      const srcset = this.generateResponsiveSrcset(baseSrc);
      if (srcset) {
        img.srcset = srcset;
        img.sizes = '(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1200px) 1200px, 1920px';
      }
      img.src = baseSrc;
    }

    img.onload = () => {
      img.classList.add('loaded');
      if (container) {
        container.classList.remove('loading');
        container.classList.add('loaded');
      }
    };

    img.onerror = () => {
      if (container) {
        container.classList.remove('loading');
        container.classList.add('error');
      }
    };
  }

  generateResponsiveSrcset(baseSrc) {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const sizes = [480, 768, 1200, 1920];
    
    for (const ext of extensions) {
      if (baseSrc.includes(ext)) {
        const baseUrl = baseSrc.replace(ext, '');
        return sizes.map(size => `${baseUrl}-${size}w${ext} ${size}w`).join(', ');
      }
    }
    return null;
  }

  detectWebPSupport() {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      if (webp.height === 2) {
        document.documentElement.classList.add('webp-support');
      } else {
        document.documentElement.classList.add('no-webp');
      }
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  }

  addTouchOptimizations() {
    const touchCSS = `
      /* Touch Optimizations */
      * {
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0.1);
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Re-enable selection for text content */
      p, h1, h2, h3, h4, h5, h6, span, div[class*="text"], .content {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Touch targets */
      button, a, [role="button"], .clickable {
        min-height: 44px;
        min-width: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      /* Touch feedback */
      button:active, a:active, [role="button"]:active {
        transform: scale(0.98);
        opacity: 0.8;
      }
      
      /* Touch ripple effect */
      .touch-ripple {
        position: relative;
        overflow: hidden;
      }
      
      .touch-ripple::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
      }
      
      .touch-ripple:active::before {
        width: 300px;
        height: 300px;
      }
      
      /* Scroll optimizations */
      .scroll-container {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        scroll-behavior: smooth;
      }
      
      /* Form optimizations */
      input, textarea, select {
        font-size: 16px; /* Prevent zoom on iOS */
        -webkit-appearance: none;
        border-radius: 8px;
        padding: 12px 16px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }
      
      input:focus, textarea:focus, select:focus {
        outline: 2px solid var(--green-teal, #20b2aa);
        outline-offset: 2px;
      }
    `;

    this.addStyles(touchCSS, 'touch-optimizations');
    this.setupTouchRipples();
  }

  setupTouchRipples() {
    // Add touch ripple effect to interactive elements
    const rippleElements = document.querySelectorAll('button, .btn, .nav-link, .project-item');
    
    rippleElements.forEach(element => {
      if (!element.classList.contains('touch-ripple')) {
        element.classList.add('touch-ripple');
      }
    });
  }

  implementDarkModeOptimizations() {
    const darkModeCSS = `
      /* Dark Mode Optimizations */
      :root {
        --bg-primary: #0f0f23;
        --bg-secondary: #1a1a2e;
        --bg-tertiary: #16213e;
        --text-primary: #ffffff;
        --text-secondary: rgba(255, 255, 255, 0.8);
        --text-tertiary: rgba(255, 255, 255, 0.6);
        --accent-primary: #20b2aa;
        --accent-secondary: #ffdb70;
        --border-color: rgba(255, 255, 255, 0.1);
        --shadow-color: rgba(0, 0, 0, 0.5);
      }
      
      /* Light mode variables */
      .light-mode {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --bg-tertiary: #e9ecef;
        --text-primary: #212529;
        --text-secondary: #495057;
        --text-tertiary: #6c757d;
        --accent-primary: #0d6efd;
        --accent-secondary: #fd7e14;
        --border-color: rgba(0, 0, 0, 0.1);
        --shadow-color: rgba(0, 0, 0, 0.1);
      }
      
      /* Apply color scheme */
      body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* Auto dark mode based on system preference */
      @media (prefers-color-scheme: light) {
        :root {
          --bg-primary: #ffffff;
          --bg-secondary: #f8f9fa;
          --text-primary: #212529;
          --text-secondary: #495057;
        }
      }
      
      /* Reduced contrast for accessibility */
      @media (prefers-contrast: no-preference) {
        .reduce-contrast {
          --text-primary: rgba(255, 255, 255, 0.9);
          --text-secondary: rgba(255, 255, 255, 0.7);
        }
      }
      
      /* High contrast mode */
      @media (prefers-contrast: high) {
        :root {
          --text-primary: #ffffff;
          --text-secondary: #ffffff;
          --border-color: #ffffff;
        }
        
        button, a {
          border: 2px solid currentColor;
        }
      }
    `;

    this.addStyles(darkModeCSS, 'dark-mode');
    this.setupThemeToggle();
  }

  setupThemeToggle() {
    // Create theme toggle if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
      const themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      themeToggle.innerHTML = '🌙';
      themeToggle.setAttribute('aria-label', 'Toggle dark mode');
      
      const toggleStyles = `
        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          font-size: 20px;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .theme-toggle:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.2);
        }
        
        .light-mode .theme-toggle {
          background: rgba(0, 0, 0, 0.1);
          color: #333;
        }
      `;
      
      this.addStyles(toggleStyles, 'theme-toggle');
      
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      document.body.appendChild(themeToggle);
    }
  }

  toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (isLight) {
      document.body.classList.remove('light-mode');
      this.currentTheme = 'dark';
      if (themeToggle) themeToggle.innerHTML = '🌙';
    } else {
      document.body.classList.add('light-mode');
      this.currentTheme = 'light';
      if (themeToggle) themeToggle.innerHTML = '☀️';
    }
    
    localStorage.setItem('theme', this.currentTheme);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: this.currentTheme }
    }));
  }

  addMobileSpecificStyles() {
    const mobileCSS = `
      /* Mobile-Specific Optimizations */
      @media (max-width: 768px) {
        /* Optimize font sizes */
        html {
          font-size: 14px;
        }
        
        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        h3 { font-size: 1.5rem; }
        h4 { font-size: 1.25rem; }
        h5 { font-size: 1.125rem; }
        h6 { font-size: 1rem; }
        
        /* Optimize spacing */
        .container {
          padding: 0 16px;
        }
        
        .section {
          padding: 40px 0;
        }
        
        /* Navigation optimizations */
        .navbar {
          padding: 8px 16px;
        }
        
        .nav-link {
          padding: 12px 16px;
          font-size: 14px;
        }
        
        /* Card optimizations */
        .card {
          margin-bottom: 16px;
          border-radius: 12px;
        }
        
        /* Grid optimizations */
        .grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        /* Sidebar optimizations */
        .sidebar {
          position: fixed;
          top: 0;
          left: -100%;
          width: 280px;
          height: 100vh;
          z-index: 1000;
          transition: left 0.3s ease;
        }
        
        .sidebar.open {
          left: 0;
        }
        
        /* Main content adjustments */
        .main-content {
          margin-left: 0;
          padding-top: 60px;
        }
        
        /* Portfolio grid */
        .portfolio-grid {
          grid-template-columns: 1fr;
        }
        
        /* Modal optimizations */
        .modal {
          margin: 0;
          width: 100%;
          height: 100%;
          border-radius: 0;
        }
        
        .modal-content {
          padding: 20px 16px;
        }
      }
      
      /* Small mobile devices */
      @media (max-width: 480px) {
        html {
          font-size: 13px;
        }
        
        .container {
          padding: 0 12px;
        }
        
        .section {
          padding: 30px 0;
        }
        
        /* Button optimizations */
        .btn {
          width: 100%;
          margin-bottom: 8px;
        }
        
        .btn-group .btn {
          width: auto;
          flex: 1;
        }
      }
      
      /* Landscape orientation */
      @media (max-height: 480px) and (orientation: landscape) {
        .hero-section {
          min-height: 100vh;
          padding: 20px 0;
        }
        
        .section {
          padding: 20px 0;
        }
      }
    `;

    this.addStyles(mobileCSS, 'mobile-specific');
  }

  optimizeAnimations() {
    const animationCSS = `
      /* Animation Optimizations */
      
      /* Respect user motion preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      /* Optimized animations for mobile */
      @media (max-width: 768px) {
        /* Reduce animation complexity */
        .animate-float {
          animation-duration: 4s;
        }
        
        .animate-spin {
          animation-duration: 2s;
        }
        
        .animate-pulse {
          animation-duration: 3s;
        }
        
        /* GPU acceleration for smooth animations */
        .animate-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Intersection-based animations */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-on-scroll.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Performance-optimized keyframes */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 30px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translate3d(30px, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      
      /* Loading animations */
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
    `;

    this.addStyles(animationCSS, 'animations');
    this.setupScrollAnimations();
  }

  setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '-50px 0px'
    });

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      scrollObserver.observe(el);
    });
  }

  setupViewportOptimizations() {
    // Optimize viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      // Reset viewport to prevent scaling issues
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
      
      // Trigger resize event after orientation change
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });

    // Handle safe area insets for newer devices
    const safeAreaCSS = `
      /* Safe Area Insets */
      @supports(padding: max(0px)) {
        .safe-area-inset-top {
          padding-top: max(16px, env(safe-area-inset-top));
        }
        
        .safe-area-inset-bottom {
          padding-bottom: max(16px, env(safe-area-inset-bottom));
        }
        
        .safe-area-inset-left {
          padding-left: max(16px, env(safe-area-inset-left));
        }
        
        .safe-area-inset-right {
          padding-right: max(16px, env(safe-area-inset-right));
        }
      }
    `;

    this.addStyles(safeAreaCSS, 'safe-area');
  }

  addPrintStyles() {
    const printCSS = `
      /* Print Styles */
      @media print {
        * {
          color: #000 !important;
          background: #fff !important;
          box-shadow: none !important;
          text-shadow: none !important;
        }
        
        body {
          font-size: 12pt;
          line-height: 1.4;
        }
        
        h1, h2, h3, h4, h5, h6 {
          page-break-after: avoid;
          color: #000 !important;
        }
        
        p, blockquote, li {
          orphans: 3;
          widows: 3;
        }
        
        blockquote, li {
          page-break-inside: avoid;
        }
        
        img {
          max-width: 100% !important;
          page-break-inside: avoid;
        }
        
        /* Hide non-essential elements */
        .no-print,
        .navigation,
        .sidebar,
        .theme-toggle,
        .mobile-fab,
        .accessibility-panel {
          display: none !important;
        }
        
        /* Ensure links are visible */
        a[href]:after {
          content: " (" attr(href) ")";
          font-size: 0.8em;
          color: #666;
        }
        
        a[href^="#"]:after,
        a[href^="javascript:"]:after {
          content: "";
        }
      }
    `;

    this.addStyles(printCSS, 'print');
  }

  addStyles(css, id) {
    // Check if styles already exist
    if (document.getElementById(`mobile-css-${id}`)) {
      return;
    }

    const style = document.createElement('style');
    style.id = `mobile-css-${id}`;
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Utility methods
  loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
      if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.innerHTML = '☀️';
      }
    }
  }

  getDOMContentLoadedPromise() {
    return new Promise(resolve => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resolve);
      } else {
        resolve();
      }
    });
  }

  // Performance monitoring
  measurePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
    }
  }
}

// Initialize CSS optimizer
document.addEventListener('DOMContentLoaded', () => {
  window.mobileCSSOptimizer = new MobileCSSOptimizer();
  
  // Load saved theme immediately
  window.mobileCSSOptimizer.loadSavedTheme();
  
  // Start performance monitoring
  window.mobileCSSOptimizer.measurePerformance();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileCSSOptimizer;
}
