/**
 * Advanced Mobile Accessibility Features
 * Features: Voice navigation, screen reader optimization, touch accessibility, adaptive UI
 */

class MobileAccessibility {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.voiceCommands = new Map();
    this.screenReaderMode = false;
    this.highContrastMode = false;
    this.largeTextMode = false;
    this.motionReducedMode = false;
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    this.setupVoiceCommands();
    this.setupScreenReaderOptimizations();
    this.setupTouchAccessibility();
    this.setupAdaptiveUI();
    this.createAccessibilityPanel();
    this.setupGestureRecognition();
    this.monitorUserPreferences();
  }

  setupVoiceCommands() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    // Define voice commands
    this.voiceCommands.set('home', () => this.navigateToSection('about'));
    this.voiceCommands.set('portfolio', () => this.navigateToSection('portfolio'));
    this.voiceCommands.set('resume', () => this.navigateToSection('resume'));
    this.voiceCommands.set('contact', () => this.navigateToSection('contact'));
    this.voiceCommands.set('scroll up', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    this.voiceCommands.set('scroll down', () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    this.voiceCommands.set('read page', () => this.readPageContent());
    this.voiceCommands.set('high contrast', () => this.toggleHighContrast());
    this.voiceCommands.set('large text', () => this.toggleLargeText());
    this.voiceCommands.set('reduce motion', () => this.toggleReducedMotion());

    this.recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Voice command:', command);
      
      // Find matching command
      for (const [key, action] of this.voiceCommands) {
        if (command.includes(key)) {
          action();
          this.provideFeedback(`Executed: ${key}`);
          break;
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    // Add voice activation button
    this.createVoiceButton();
  }

  createVoiceButton() {
    const voiceButton = document.createElement('button');
    voiceButton.className = 'voice-control-btn';
    voiceButton.innerHTML = `
      <ion-icon name="mic-outline"></ion-icon>
      <span class="sr-only">Voice Control</span>
    `;
    voiceButton.setAttribute('aria-label', 'Activate voice control');
    
    voiceButton.addEventListener('click', () => {
      if (this.recognition) {
        this.recognition.start();
        voiceButton.classList.add('listening');
        this.provideFeedback('Listening...');
        
        setTimeout(() => {
          voiceButton.classList.remove('listening');
        }, 5000);
      }
    });

    // Style the voice button
    this.addVoiceButtonStyles();
    document.body.appendChild(voiceButton);
  }

  addVoiceButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .voice-control-btn {
        position: fixed;
        top: 120px;
        right: 20px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #8b5cf6, #06b6d4);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .voice-control-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
      }
      
      .voice-control-btn.listening {
        animation: pulse 1s infinite;
        background: linear-gradient(135deg, #ef4444, #f59e0b);
      }
      
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
        70% { box-shadow: 0 0 0 20px rgba(139, 92, 246, 0); }
        100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
      }
      
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(style);
  }

  setupScreenReaderOptimizations() {
    // Enhance ARIA labels and landmarks
    this.enhanceARIALabels();
    this.addLandmarks();
    this.improveHeadingStructure();
    this.addSkipLinks();
  }

  enhanceARIALabels() {
    // Add comprehensive ARIA labels
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const text = element.textContent || element.value || element.placeholder;
        if (text) {
          element.setAttribute('aria-label', text.trim());
        }
      }
    });

    // Add role attributes where missing
    document.querySelectorAll('.navigation, .menu').forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', 'navigation');
      }
    });

    document.querySelectorAll('.button, .btn').forEach(el => {
      if (el.tagName !== 'BUTTON' && !el.getAttribute('role')) {
        el.setAttribute('role', 'button');
      }
    });
  }

  addLandmarks() {
    // Add main landmark if missing
    if (!document.querySelector('main')) {
      const mainContent = document.querySelector('.main-content, #main, .content');
      if (mainContent && mainContent.tagName !== 'MAIN') {
        mainContent.setAttribute('role', 'main');
      }
    }

    // Add navigation landmarks
    document.querySelectorAll('nav, .navbar, .navigation').forEach(nav => {
      if (!nav.getAttribute('role')) {
        nav.setAttribute('role', 'navigation');
      }
    });
  }

  improveHeadingStructure() {
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > currentLevel + 1) {
        console.warn(`Heading level skip detected: ${heading.tagName} after h${currentLevel}`);
      }
      currentLevel = level;
    });
  }

  addSkipLinks() {
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.3s ease;
      `;

      skipLink.addEventListener('focus', () => {
        skipLink.style.opacity = '1';
        skipLink.style.transform = 'translateY(0)';
      });

      skipLink.addEventListener('blur', () => {
        skipLink.style.opacity = '0';
        skipLink.style.transform = 'translateY(-100%)';
      });

      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }

  setupTouchAccessibility() {
    // Improve touch targets
    this.improveTouchTargets();
    this.addTouchGestures();
    this.setupHapticFeedback();
  }

  improveTouchTargets() {
    const minTouchSize = 44; // 44px minimum for accessibility
    const smallElements = document.querySelectorAll('button, a, input, [role="button"]');
    
    smallElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.width < minTouchSize || rect.height < minTouchSize) {
        element.style.minWidth = `${minTouchSize}px`;
        element.style.minHeight = `${minTouchSize}px`;
        element.style.display = 'inline-flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
      }
    });
  }

  addTouchGestures() {
    let startY = 0;
    let startTime = 0;
    const gestureThreshold = 100;
    const timeThreshold = 300;

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        startTime = Date.now();
      }
    });

    document.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const endY = e.changedTouches[0].clientY;
        const endTime = Date.now();
        const deltaY = startY - endY;
        const deltaTime = endTime - startTime;

        // Two-finger tap for accessibility menu
        if (e.touches.length === 0 && e.changedTouches.length === 1 && deltaTime < timeThreshold) {
          // Check for double tap
          if (this.lastTapTime && endTime - this.lastTapTime < 500) {
            this.toggleAccessibilityPanel();
          }
          this.lastTapTime = endTime;
        }
      }
    });
  }

  setupHapticFeedback() {
    // Add haptic feedback for important actions
    const importantElements = document.querySelectorAll('.btn-primary, .submit-btn, .nav-link');
    
    importantElements.forEach(element => {
      element.addEventListener('click', () => {
        if (navigator.vibrate) {
          navigator.vibrate(50); // Short vibration for feedback
        }
      });
    });

    // Different vibration patterns for different actions
    document.querySelectorAll('[data-haptic]').forEach(element => {
      element.addEventListener('click', () => {
        const pattern = element.getAttribute('data-haptic');
        switch (pattern) {
          case 'light':
            navigator.vibrate && navigator.vibrate(50);
            break;
          case 'medium':
            navigator.vibrate && navigator.vibrate(100);
            break;
          case 'heavy':
            navigator.vibrate && navigator.vibrate([100, 50, 100]);
            break;
        }
      });
    });
  }

  setupAdaptiveUI() {
    // Detect user preferences
    this.detectPreferences();
    this.adaptToPreferences();
    this.monitorBatteryLevel();
  }

  detectPreferences() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.motionReducedMode = true;
      document.body.classList.add('reduce-motion');
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.highContrastMode = true;
      document.body.classList.add('high-contrast');
    }

    // Check for color scheme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('prefer-dark');
    }
  }

  adaptToPreferences() {
    // Adapt animations based on motion preference
    if (this.motionReducedMode) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Adapt colors for high contrast
    if (this.highContrastMode) {
      const style = document.createElement('style');
      style.textContent = `
        .high-contrast {
          filter: contrast(150%) brightness(1.2);
        }
        .high-contrast button, .high-contrast a {
          border: 2px solid currentColor !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  monitorBatteryLevel() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBatteryOptimizations = () => {
          if (battery.level < 0.2) { // Low battery
            this.enablePowerSaveMode();
          } else {
            this.disablePowerSaveMode();
          }
        };

        battery.addEventListener('levelchange', updateBatteryOptimizations);
        updateBatteryOptimizations();
      });
    }
  }

  enablePowerSaveMode() {
    document.body.classList.add('power-save-mode');
    // Reduce animations and visual effects
    const style = document.createElement('style');
    style.id = 'power-save-styles';
    style.textContent = `
      .power-save-mode * {
        animation: none !important;
        transition: none !important;
      }
      .power-save-mode .loading-overlay,
      .power-save-mode .particle-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  disablePowerSaveMode() {
    document.body.classList.remove('power-save-mode');
    const powerSaveStyles = document.getElementById('power-save-styles');
    if (powerSaveStyles) {
      powerSaveStyles.remove();
    }
  }

  createAccessibilityPanel() {
    const panel = document.createElement('div');
    panel.className = 'accessibility-panel';
    panel.innerHTML = `
      <div class="accessibility-header">
        <h3>Accessibility Options</h3>
        <button class="close-panel" aria-label="Close accessibility panel">×</button>
      </div>
      <div class="accessibility-options">
        <label class="option-item">
          <input type="checkbox" id="high-contrast-toggle">
          <span>High Contrast</span>
        </label>
        <label class="option-item">
          <input type="checkbox" id="large-text-toggle">
          <span>Large Text</span>
        </label>
        <label class="option-item">
          <input type="checkbox" id="reduce-motion-toggle">
          <span>Reduce Motion</span>
        </label>
        <label class="option-item">
          <input type="checkbox" id="screen-reader-mode">
          <span>Screen Reader Mode</span>
        </label>
        <button class="voice-control-toggle">Enable Voice Control</button>
        <button class="read-page-btn">Read Page Aloud</button>
      </div>
    `;

    this.addAccessibilityPanelStyles();
    document.body.appendChild(panel);
    this.setupAccessibilityPanelEvents();
  }

  addAccessibilityPanelStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-radius: 16px;
        padding: 24px;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        min-width: 300px;
        max-width: 400px;
        color: white;
      }
      
      .accessibility-panel.active {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
      }
      
      .accessibility-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 1px solid rgba(255, 219, 112, 0.2);
        padding-bottom: 12px;
      }
      
      .accessibility-header h3 {
        margin: 0;
        color: var(--green-teal, #20b2aa);
        font-size: 18px;
      }
      
      .close-panel {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      .close-panel:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .accessibility-options {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .option-item {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        padding: 8px;
        border-radius: 8px;
        transition: background 0.2s ease;
      }
      
      .option-item:hover {
        background: rgba(255, 219, 112, 0.1);
      }
      
      .option-item input[type="checkbox"] {
        width: 20px;
        height: 20px;
        accent-color: var(--green-teal, #20b2aa);
      }
      
      .voice-control-toggle,
      .read-page-btn {
        background: linear-gradient(135deg, var(--green-teal, #20b2aa), #06b6d4);
        border: none;
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      .voice-control-toggle:hover,
      .read-page-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(32, 178, 170, 0.3);
      }
      
      /* High contrast mode styles */
      .high-contrast {
        filter: contrast(150%) brightness(1.2);
      }
      
      /* Large text mode styles */
      .large-text * {
        font-size: 1.2em !important;
        line-height: 1.5 !important;
      }
      
      /* Reduced motion styles */
      .reduce-motion *,
      .reduce-motion *::before,
      .reduce-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
    document.head.appendChild(style);
  }

  setupAccessibilityPanelEvents() {
    const panel = document.querySelector('.accessibility-panel');
    
    // Close panel
    panel.querySelector('.close-panel').addEventListener('click', () => {
      this.hideAccessibilityPanel();
    });

    // High contrast toggle
    panel.querySelector('#high-contrast-toggle').addEventListener('change', (e) => {
      this.toggleHighContrast(e.target.checked);
    });

    // Large text toggle
    panel.querySelector('#large-text-toggle').addEventListener('change', (e) => {
      this.toggleLargeText(e.target.checked);
    });

    // Reduce motion toggle
    panel.querySelector('#reduce-motion-toggle').addEventListener('change', (e) => {
      this.toggleReducedMotion(e.target.checked);
    });

    // Screen reader mode
    panel.querySelector('#screen-reader-mode').addEventListener('change', (e) => {
      this.toggleScreenReaderMode(e.target.checked);
    });

    // Voice control toggle
    panel.querySelector('.voice-control-toggle').addEventListener('click', () => {
      if (this.recognition) {
        this.recognition.start();
        this.provideFeedback('Voice control activated');
      }
    });

    // Read page button
    panel.querySelector('.read-page-btn').addEventListener('click', () => {
      this.readPageContent();
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && panel.classList.contains('active')) {
        this.hideAccessibilityPanel();
      }
    });
  }

  // Accessibility toggle methods
  toggleHighContrast(force) {
    this.highContrastMode = force !== undefined ? force : !this.highContrastMode;
    document.body.classList.toggle('high-contrast', this.highContrastMode);
    localStorage.setItem('highContrast', this.highContrastMode);
    this.provideFeedback(`High contrast ${this.highContrastMode ? 'enabled' : 'disabled'}`);
  }

  toggleLargeText(force) {
    this.largeTextMode = force !== undefined ? force : !this.largeTextMode;
    document.body.classList.toggle('large-text', this.largeTextMode);
    localStorage.setItem('largeText', this.largeTextMode);
    this.provideFeedback(`Large text ${this.largeTextMode ? 'enabled' : 'disabled'}`);
  }

  toggleReducedMotion(force) {
    this.motionReducedMode = force !== undefined ? force : !this.motionReducedMode;
    document.body.classList.toggle('reduce-motion', this.motionReducedMode);
    localStorage.setItem('reduceMotion', this.motionReducedMode);
    this.provideFeedback(`Reduced motion ${this.motionReducedMode ? 'enabled' : 'disabled'}`);
  }

  toggleScreenReaderMode(force) {
    this.screenReaderMode = force !== undefined ? force : !this.screenReaderMode;
    document.body.classList.toggle('screen-reader-mode', this.screenReaderMode);
    
    if (this.screenReaderMode) {
      this.enhanceForScreenReader();
    }
    
    localStorage.setItem('screenReaderMode', this.screenReaderMode);
    this.provideFeedback(`Screen reader mode ${this.screenReaderMode ? 'enabled' : 'disabled'}`);
  }

  enhanceForScreenReader() {
    // Add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-live-region';
    liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(liveRegion);

    // Announce page changes
    this.liveRegion = liveRegion;
  }

  // Panel methods
  toggleAccessibilityPanel() {
    const panel = document.querySelector('.accessibility-panel');
    if (panel.classList.contains('active')) {
      this.hideAccessibilityPanel();
    } else {
      this.showAccessibilityPanel();
    }
  }

  showAccessibilityPanel() {
    const panel = document.querySelector('.accessibility-panel');
    panel.classList.add('active');
    
    // Focus management
    const firstFocusable = panel.querySelector('input, button');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  hideAccessibilityPanel() {
    const panel = document.querySelector('.accessibility-panel');
    panel.classList.remove('active');
  }

  // Utility methods
  navigateToSection(section) {
    const element = document.getElementById(section) || document.querySelector(`[data-page="${section}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  provideFeedback(message) {
    // Visual feedback
    this.showToast(message);
    
    // Screen reader feedback
    if (this.liveRegion) {
      this.liveRegion.textContent = message;
    }
    
    // Voice feedback (if speech synthesis is available)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = 0.3;
      utterance.rate = 1.2;
      speechSynthesis.speak(utterance);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'accessibility-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 15, 35, 0.9);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10001;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '1';
    }, 100);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  readPageContent() {
    if (!('speechSynthesis' in window)) {
      this.provideFeedback('Text-to-speech not supported');
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    // Get main content
    const mainContent = document.querySelector('main, .main-content, [role="main"]');
    const content = mainContent ? mainContent.textContent : document.body.textContent;
    
    // Clean up the text
    const cleanText = content
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?;:()-]/g, '')
      .trim();

    if (cleanText) {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9;
      utterance.volume = 0.7;
      
      utterance.onstart = () => {
        this.provideFeedback('Reading page content');
      };
      
      utterance.onend = () => {
        this.provideFeedback('Finished reading');
      };

      speechSynthesis.speak(utterance);
    }
  }

  setupGestureRecognition() {
    // Three-finger tap for accessibility panel
    let touchCount = 0;
    let touchTimer = null;

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 3) {
        touchCount++;
        
        if (touchTimer) {
          clearTimeout(touchTimer);
        }
        
        touchTimer = setTimeout(() => {
          if (touchCount === 1) {
            this.toggleAccessibilityPanel();
          }
          touchCount = 0;
        }, 500);
      }
    });
  }

  monitorUserPreferences() {
    // Load saved preferences
    const savedPrefs = {
      highContrast: localStorage.getItem('highContrast') === 'true',
      largeText: localStorage.getItem('largeText') === 'true',
      reduceMotion: localStorage.getItem('reduceMotion') === 'true',
      screenReaderMode: localStorage.getItem('screenReaderMode') === 'true'
    };

    // Apply saved preferences
    if (savedPrefs.highContrast) this.toggleHighContrast(true);
    if (savedPrefs.largeText) this.toggleLargeText(true);
    if (savedPrefs.reduceMotion) this.toggleReducedMotion(true);
    if (savedPrefs.screenReaderMode) this.toggleScreenReaderMode(true);

    // Monitor media query changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    motionQuery.addListener((e) => {
      if (e.matches && !this.motionReducedMode) {
        this.toggleReducedMotion(true);
      }
    });

    contrastQuery.addListener((e) => {
      if (e.matches && !this.highContrastMode) {
        this.toggleHighContrast(true);
      }
    });
  }
}

// Initialize mobile accessibility
document.addEventListener('DOMContentLoaded', () => {
  window.mobileAccessibility = new MobileAccessibility();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileAccessibility;
}
