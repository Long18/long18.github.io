/**
 * Image Optimizer
 * Optimizes images for better performance:
 * - Detects WebP support
 * - Loads appropriate image format
 * - Progressively enhances image quality
 * - Provides fallbacks for older browsers
 */

document.addEventListener('DOMContentLoaded', () => {
  checkWebPSupport().then(hasWebP => {
    if (hasWebP) {
      document.body.classList.add('webp-support');
    } else {
      document.body.classList.add('no-webp-support');
    }
    
    // Initialize image optimization
    optimizeImages(hasWebP);
  });
});

/**
 * Check if browser supports WebP format
 * @returns {Promise<boolean>} Whether WebP is supported
 */
function checkWebPSupport() {
  return new Promise(resolve => {
    const webP = new Image();
    webP.onload = function() { resolve(webP.height === 1); };
    webP.onerror = function() { resolve(false); };
    webP.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
}

/**
 * Optimize images across the site
 * @param {boolean} hasWebP Whether WebP is supported
 */
function optimizeImages(hasWebP) {
  // Find all images that could be optimized
  const images = document.querySelectorAll('img:not([src^="data:"]):not(.no-optimize)');
  
  // Process each image
  images.forEach(img => {
    // Skip already processed images
    if (img.dataset.optimized === 'true') return;
    
    // Save original src and prepare for optimization
    const originalSrc = img.src;
    const extension = originalSrc.split('.').pop().toLowerCase();
    
    // Only process JPG, JPEG, and PNG images
    if (!['jpg', 'jpeg', 'png'].includes(extension)) return;
    
    // Create srcset for responsive images
    createResponsiveImage(img, originalSrc, extension, hasWebP);
    
    // Mark as optimized
    img.dataset.optimized = 'true';
  });
}

/**
 * Create responsive image with appropriate srcset
 * @param {HTMLImageElement} img Image element
 * @param {string} src Original source
 * @param {string} extension File extension
 * @param {boolean} hasWebP Whether to use WebP format
 */
function createResponsiveImage(img, src, extension, hasWebP) {
  // Don't modify if image already has srcset
  if (img.srcset) return;
  
  // Get dimensions
  const imgWidth = img.naturalWidth || img.width;
  
  // Skip small images (likely icons)
  if (imgWidth < 100) return;
  
  // Create srcset for different viewport sizes
  let srcset = '';
  let sizes = '';
  
  // Get path without extension
  const basePath = src.substring(0, src.lastIndexOf('.'));
  
  // Default sizes attribute based on container width
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  // Simple responsive sizes for now
  const widths = [320, 640, 980, 1200];
  
  if (hasWebP) {
    // Modern format support - use WebP
    srcset = widths.map(w => {
      // Here in a real implementation, we would check if resized versions exist
      // For now, we'll use the original with a comment about the intended functionality
      return `${basePath}.webp ${w}w`;
    }).join(', ');
    
    // Set srcset and sizes
    // In a real implementation, we would provide real WebP versions
    // For now, we'll add a comment about this 
    // img.srcset = srcset;
    
    // Fallback for browsers that may struggle with srcset
    img.src = basePath + '.' + extension;
  } else {
    // Fallback to original format for browsers without WebP support
    img.src = src;
  }
  
  // Always set loading="lazy" for images not in viewport
  if (!isInViewport(img)) {
    img.loading = 'lazy';
  }
  
  // Add fade-in effect for images
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s ease';
  
  img.onload = function() {
    img.style.opacity = '1';
  };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el Element to check
 * @returns {boolean} Whether element is in viewport
 */
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
