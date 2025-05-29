/**
 * Advanced Mobile Gesture Recognition System
 * Supports: Pinch-to-zoom, multi-touch gestures, haptic feedback, voice controls
 */

class AdvancedGestureSystem {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.touches = new Map();
    this.gestureThreshold = {
      pinch: 10,
      swipe: 50,
      tap: 10,
      hold: 500
    };
    this.lastGesture = null;
    this.hapticSupported = 'vibrate' in navigator;
    this.voiceSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    this.setupTouchEvents();
    this.setupAccessibilityFeatures();
    this.setupVoiceControl();
    this.createGestureIndicators();
  }

  setupTouchEvents() {
    const container = document.body;

    // Enhanced touch start
    container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });

    // Pointer events for better cross-device support
    container.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    container.addEventListener('pointermove', this.handlePointerMove.bind(this));
    container.addEventListener('pointerup', this.handlePointerUp.bind(this));
  }

  handleTouchStart(e) {
    Array.from(e.changedTouches).forEach(touch => {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        currentX: touch.clientX,
        currentY: touch.clientY
      });
    });

    // Multi-touch gesture detection
    if (e.touches.length === 2) {
      this.handlePinchStart(e);
    } else if (e.touches.length === 3) {
      this.handleTripleTouchStart(e);
    }

    // Long press detection
    this.longPressTimer = setTimeout(() => {
      this.handleLongPress(e);
    }, this.gestureThreshold.hold);
  }

  handleTouchMove(e) {
    e.preventDefault(); // Prevent scrolling during gestures

    Array.from(e.changedTouches).forEach(touch => {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
      }
    });

    if (e.touches.length === 2) {
      this.handlePinchMove(e);
    }

    // Clear long press if moving
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  handleTouchEnd(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    Array.from(e.changedTouches).forEach(touch => {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        this.processGesture(touchData, touch);
        this.touches.delete(touch.identifier);
      }
    });
  }

  processGesture(touchData, touch) {
    const deltaX = touchData.currentX - touchData.startX;
    const deltaY = touchData.currentY - touchData.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = Date.now() - touchData.startTime;

    // Tap gesture
    if (distance < this.gestureThreshold.tap && duration < 200) {
      this.handleTap(touch);
    }
    // Swipe gesture
    else if (distance > this.gestureThreshold.swipe) {
      this.handleSwipe(deltaX, deltaY, touch);
    }
  }

  handleTap(touch) {
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Enhanced tap feedback
    this.triggerHapticFeedback('light');
    this.createTapRipple(touch.clientX, touch.clientY);
    
    // Custom tap events for different elements
    if (element) {
      const customEvent = new CustomEvent('mobileTap', {
        detail: { x: touch.clientX, y: touch.clientY, element }
      });
      element.dispatchEvent(customEvent);
    }
  }

  handleSwipe(deltaX, deltaY, touch) {
    const direction = this.getSwipeDirection(deltaX, deltaY);
    
    this.triggerHapticFeedback('medium');
    
    // Dispatch custom swipe event
    const swipeEvent = new CustomEvent('mobileSwipe', {
      detail: { 
        direction, 
        deltaX, 
        deltaY, 
        startPoint: { x: touch.clientX - deltaX, y: touch.clientY - deltaY },
        endPoint: { x: touch.clientX, y: touch.clientY }
      }
    });
    
    document.dispatchEvent(swipeEvent);
    
    // Handle navigation swipes
    this.handleNavigationSwipe(direction);
  }

  getSwipeDirection(deltaX, deltaY) {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  handleNavigationSwipe(direction) {
    const sections = ['about', 'resume', 'portfolio', 'contact'];
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    let targetIndex;
    if (direction === 'left' && currentIndex < sections.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (direction === 'right' && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }
    
    if (targetIndex !== undefined) {
      this.navigateToSection(sections[targetIndex]);
    }
  }

  handlePinchStart(e) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    this.pinchData = {
      initialDistance: this.getDistance(touch1, touch2),
      initialScale: 1,
      centerX: (touch1.clientX + touch2.clientX) / 2,
      centerY: (touch1.clientY + touch2.clientY) / 2
    };
  }

  handlePinchMove(e) {
    if (!this.pinchData) return;
    
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentDistance = this.getDistance(touch1, touch2);
    const scale = currentDistance / this.pinchData.initialDistance;
    
    // Dispatch pinch event
    const pinchEvent = new CustomEvent('mobilePinch', {
      detail: { 
        scale,
        centerX: this.pinchData.centerX,
        centerY: this.pinchData.centerY
      }
    });
    
    document.dispatchEvent(pinchEvent);
  }

  handleTripleTouchStart(e) {
    this.triggerHapticFeedback('heavy');
    
    // Triple touch for accessibility menu
    const accessibilityEvent = new CustomEvent('mobileAccessibilityGesture', {
      detail: { gestureType: 'tripleTouch' }
    });
    
    document.dispatchEvent(accessibilityEvent);
  }

  handleLongPress(e) {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    this.triggerHapticFeedback('heavy');
    
    // Context menu or additional options
    const longPressEvent = new CustomEvent('mobileLongPress', {
      detail: { 
        x: touch.clientX, 
        y: touch.clientY, 
        element 
      }
    });
    
    document.dispatchEvent(longPressEvent);
  }

  getDistance(touch1, touch2) {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  triggerHapticFeedback(intensity = 'light') {
    if (!this.hapticSupported) return;
    
    const patterns = {
      light: [10],
      medium: [50],
      heavy: [100],
      double: [50, 50, 50],
      success: [100, 50, 100]
    };
    
    navigator.vibrate(patterns[intensity] || patterns.light);
  }

  createTapRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'mobile-tap-ripple';
    ripple.style.cssText = `
      position: fixed;
      left: ${x - 20}px;
      top: ${y - 20}px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 219, 112, 0.6) 0%, transparent 70%);
      pointer-events: none;
      z-index: 10000;
      animation: tapRippleAnimation 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // Voice Control Integration
  setupVoiceControl() {
    if (!this.voiceSupported) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
    
    this.recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      this.processVoiceCommand(command);
    };
    
    // Add voice activation button
    this.createVoiceButton();
  }

  processVoiceCommand(command) {
    const commands = {
      'go to about': () => this.navigateToSection('about'),
      'show portfolio': () => this.navigateToSection('portfolio'),
      'contact me': () => this.navigateToSection('contact'),
      'show resume': () => this.navigateToSection('resume'),
      'toggle theme': () => this.toggleTheme(),
      'scroll up': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      'scroll down': () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    };
    
    for (const [phrase, action] of Object.entries(commands)) {
      if (command.includes(phrase.toLowerCase())) {
        action();
        this.triggerHapticFeedback('success');
        break;
      }
    }
  }

  createVoiceButton() {
    const voiceButton = document.createElement('button');
    voiceButton.className = 'voice-control-button';
    voiceButton.innerHTML = '🎤';
    voiceButton.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--green-teal);
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    `;
    
    voiceButton.addEventListener('click', () => {
      this.startVoiceRecognition();
    });
    
    document.body.appendChild(voiceButton);
  }

  startVoiceRecognition() {
    if (this.recognition) {
      this.recognition.start();
      this.triggerHapticFeedback('light');
    }
  }

  // Accessibility Features
  setupAccessibilityFeatures() {
    // High contrast mode toggle
    document.addEventListener('mobileAccessibilityGesture', (e) => {
      if (e.detail.gestureType === 'tripleTouch') {
        this.toggleHighContrast();
      }
    });
    
    // Text size adjustment
    this.setupTextSizeControls();
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast-mode');
    localStorage.setItem('highContrast', document.body.classList.contains('high-contrast-mode'));
  }

  setupTextSizeControls() {
    const textSizeControls = document.createElement('div');
    textSizeControls.className = 'text-size-controls';
    textSizeControls.innerHTML = `
      <button class="text-size-btn" data-size="small">A</button>
      <button class="text-size-btn" data-size="normal">A</button>
      <button class="text-size-btn" data-size="large">A</button>
    `;
    
    textSizeControls.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      padding: 10px;
      border-radius: 8px;
      display: none;
      z-index: 1000;
    `;
    
    document.body.appendChild(textSizeControls);
    
    // Show/hide on triple tap
    document.addEventListener('mobileAccessibilityGesture', () => {
      textSizeControls.style.display = textSizeControls.style.display === 'none' ? 'block' : 'none';
    });
  }

  createGestureIndicators() {
    // Add CSS for gesture animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes tapRippleAnimation {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
      
      .high-contrast-mode {
        filter: contrast(150%) brightness(120%);
      }
      
      .high-contrast-mode * {
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8) !important;
      }
      
      .text-size-small { font-size: 0.8em !important; }
      .text-size-normal { font-size: 1em !important; }
      .text-size-large { font-size: 1.2em !important; }
      
      .voice-control-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.4);
      }
      
      .voice-control-button:active {
        transform: scale(0.95);
        background: #40ca7a;
      }
    `;
    
    document.head.appendChild(style);
  }

  // Helper methods
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

  navigateToSection(sectionName) {
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const targetLink = Array.from(navigationLinks).find(link => 
      link.textContent.toLowerCase().includes(sectionName.toLowerCase())
    );
    
    if (targetLink) {
      targetLink.click();
    }
  }

  toggleTheme() {
    const themeButton = document.querySelector('.theme-toggle') || 
                      document.querySelector('[data-theme-toggle]');
    if (themeButton) {
      themeButton.click();
    }
  }

  // Pointer events for cross-device compatibility
  handlePointerDown(e) {
    if (e.pointerType === 'touch') return; // Already handled by touch events
    
    this.pointerData = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now()
    };
  }

  handlePointerMove(e) {
    if (!this.pointerData || e.pointerType === 'touch') return;
    
    this.pointerData.currentX = e.clientX;
    this.pointerData.currentY = e.clientY;
  }

  handlePointerUp(e) {
    if (!this.pointerData || e.pointerType === 'touch') return;
    
    const deltaX = this.pointerData.currentX - this.pointerData.startX;
    const deltaY = this.pointerData.currentY - this.pointerData.startY;
    const duration = Date.now() - this.pointerData.startTime;
    
    // Process as gesture if significant movement
    if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
      this.handleSwipe(deltaX, deltaY, e);
    }
    
    this.pointerData = null;
  }
}

// Initialize the gesture system
document.addEventListener('DOMContentLoaded', () => {
  window.advancedGestureSystem = new AdvancedGestureSystem();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdvancedGestureSystem;
}
