/**
 * Modern UI/UX enhancements for portfolio website
 * Features:
 * - Dark/Light mode toggle
 * - Smooth scrolling
 * - Lazy loading images
 * - Enhanced animations
 * - Improved accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading overlay
  initLoadingOverlay();
  
  // Check for saved theme and apply it immediately before content is shown
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
  }
  
  // Add dark mode toggle and floating buttons
  initThemeToggle();
  
  // Enhance images with lazy loading
  initLazyLoading();
  
  // Add smooth scrolling to all internal links
  initSmoothScrolling();
  
  // Add animation classes to elements
  initAnimations();
  
  // Enhance accessibility
  improveAccessibility();
});

/**
 * Initialize loading overlay
 */
function initLoadingOverlay() {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        overlay.classList.add('hidden');
      }, 500);
    });
  }
}

/**
 * Initialize theme toggle (dark/light mode)
 */
function initThemeToggle() {
  // Get the existing theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  
  if (themeToggle) {
    console.log('Theme toggle button found:', themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    }
    
    // Remove any existing click listeners
    themeToggle.replaceWith(themeToggle.cloneNode(true));
    
    // Get the fresh reference after replacing
    const freshThemeToggle = document.getElementById('theme-toggle');
    
    // Add event listener for theme toggle using onclick for direct binding
    freshThemeToggle.onclick = function() {
      document.documentElement.classList.toggle('light-mode');
      const currentTheme = document.documentElement.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      console.log('Theme toggled to:', currentTheme);
    };
    
    // Ensure it's visible and clickable
    freshThemeToggle.style.pointerEvents = 'auto';
    freshThemeToggle.style.cursor = 'pointer';
    freshThemeToggle.style.zIndex = '10000';
  } else {
    // Fallback in case the button doesn't exist in HTML
    console.warn('Theme toggle button not found in HTML');
  }

  // Create back button for portfolio if on a detail page
  if (window.location.pathname.includes('portfolio/') && !document.querySelector('#portfolio-back-button')) {
    const backButton = document.createElement('button');
    backButton.className = 'button-floating';
    backButton.id = 'portfolio-back-button';
    backButton.setAttribute('aria-label', 'Back to portfolio');
    backButton.setAttribute('title', 'Back to portfolio');
    backButton.innerHTML = '<ion-icon name="arrow-back-outline"></ion-icon>';
    document.body.appendChild(backButton);
    
    // Add event listener for back button
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  // Add lazy-load class to all images
  const images = document.querySelectorAll('img:not([loading="lazy"])');
  images.forEach(img => {
    // Save original src
    if (!img.dataset.src && img.src) {
      img.dataset.src = img.src;
      img.classList.add('lazy-load');
      
      // Only set loading="lazy" for images not immediately visible
      const rect = img.getBoundingClientRect();
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      );
      
      if (!isVisible) {
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        img.setAttribute('loading', 'lazy');
      } else {
        img.classList.add('loaded');
      }
    }
  });
  
  // Set up intersection observer for lazy loading
  const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      }
    });
  });
  
  // Observe all lazy-load images
  document.querySelectorAll('img.lazy-load').forEach(img => {
    lazyImageObserver.observe(img);
  });
}

/**
 * Initialize smooth scrolling for all internal links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Get the target element
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Scroll smoothly to the target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without page reload (for browser history)
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Initialize animations for UI elements
 */
function initAnimations() {
  // Add animation classes to elements
  const animatedElements = document.querySelectorAll('.service-item, .timeline-item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.animation = 'fadeIn 0.8s ease forwards';
  });
  
  // Stagger animation delays
  document.querySelectorAll('.service-item').forEach((item, index) => {
    item.style.animationDelay = `${0.1 * (index + 1)}s`;
  });
  
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.animationDelay = `${0.1 * (index + 1)}s`;
  });
}

/**
 * Improve accessibility throughout the site
 */
function improveAccessibility() {
  // Add missing alt text to images
  document.querySelectorAll('img:not([alt])').forEach(img => {
    const parentText = img.parentElement.textContent.trim();
    if (parentText) {
      img.alt = parentText;
    } else {
      img.alt = 'Portfolio image';
    }
  });
  
  // Ensure all interactive elements are focusable
  document.querySelectorAll('a, button').forEach(el => {
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
  
  // Add ARIA labels to icons for screen readers
  document.querySelectorAll('ion-icon:not([aria-label])').forEach(icon => {
    const name = icon.getAttribute('name');
    if (name) {
      const label = name.replace(/-/g, ' ').replace(/outline$/, '');
      icon.setAttribute('aria-label', label);
    }
  });
}
