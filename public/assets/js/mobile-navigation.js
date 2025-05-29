/**
 * Mobile Navigation Enhancements
 * Features: Tab bar navigation, floating action button, pull-to-refresh, smart suggestions
 */

class MobileNavigation {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.currentSection = 'about';
    this.navigationHistory = [];
    this.quickActions = [];
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    this.createBottomTabBar();
    this.createFloatingActionButton();
    this.setupPullToRefresh();
    this.createBreadcrumbs();
    this.setupKeyboardNavigation();
    this.createQuickActions();
    this.addMobileOptimizations();
  }

  createBottomTabBar() {
    const tabBar = document.createElement('div');
    tabBar.className = 'mobile-tab-bar';
    tabBar.innerHTML = `
      <div class="tab-item" data-section="about">
        <ion-icon name="person-outline"></ion-icon>
        <span>About</span>
      </div>
      <div class="tab-item" data-section="resume">
        <ion-icon name="document-text-outline"></ion-icon>
        <span>Resume</span>
      </div>
      <div class="tab-item" data-section="portfolio">
        <ion-icon name="briefcase-outline"></ion-icon>
        <span>Portfolio</span>
      </div>
      <div class="tab-item" data-section="contact">
        <ion-icon name="mail-outline"></ion-icon>
        <span>Contact</span>
      </div>
    `;

    // Add styles
    tabBar.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: rgba(15, 15, 35, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 219, 112, 0.3);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom);
    `;

    document.body.appendChild(tabBar);

    // Add tab styles
    this.addTabStyles();

    // Add event listeners
    tabBar.addEventListener('click', (e) => {
      const tabItem = e.target.closest('.tab-item');
      if (tabItem) {
        const section = tabItem.dataset.section;
        this.navigateToSection(section);
        this.updateActiveTab(section);
      }
    });

    // Initialize active state
    this.updateActiveTab('about');
  }

  addTabStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mobile-tab-bar .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px;
        border-radius: 12px;
        transition: all 0.3s ease;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.7);
        min-width: 60px;
      }

      .mobile-tab-bar .tab-item:hover {
        background: rgba(255, 219, 112, 0.1);
        color: var(--green-teal);
      }

      .mobile-tab-bar .tab-item.active {
        background: rgba(255, 219, 112, 0.2);
        color: var(--green-teal);
        transform: translateY(-2px);
      }

      .mobile-tab-bar .tab-item ion-icon {
        font-size: 20px;
        margin-bottom: 4px;
      }

      .mobile-tab-bar .tab-item span {
        font-size: 11px;
        font-weight: 500;
      }

      .mobile-tab-bar .tab-item.active span {
        font-weight: 600;
      }

      /* Add bottom padding to main content to avoid tab bar overlap */
      @media (max-width: 768px) {
        main {
          padding-bottom: 80px !important;
        }
      }

      /* Floating Action Button */
      .mobile-fab {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--green-teal), #40ca7a);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 1001;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        font-size: 24px;
      }

      .mobile-fab:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.4);
      }

      .mobile-fab:active {
        transform: scale(0.95);
      }

      /* Pull to Refresh */
      .pull-to-refresh {
        position: fixed;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 15, 35, 0.9);
        color: var(--green-teal);
        padding: 15px 30px;
        border-radius: 30px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 219, 112, 0.3);
        transition: all 0.3s ease;
        z-index: 1002;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .pull-to-refresh.active {
        top: 20px;
      }

      .pull-to-refresh .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 219, 112, 0.3);
        border-top: 2px solid var(--green-teal);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Breadcrumb Navigation */
      .mobile-breadcrumb {
        position: fixed;
        top: 10px;
        left: 10px;
        right: 10px;
        background: rgba(15, 15, 35, 0.8);
        backdrop-filter: blur(10px);
        padding: 8px 16px;
        border-radius: 20px;
        border: 1px solid rgba(255, 219, 112, 0.3);
        z-index: 999;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .mobile-breadcrumb .back-btn {
        background: none;
        border: none;
        color: var(--green-teal);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
      }

      /* Quick Actions Panel */
      .quick-actions-panel {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-radius: 16px;
        padding: 16px;
        transform: translateY(100%) scale(0.8);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        min-width: 200px;
      }

      .quick-actions-panel.active {
        transform: translateY(0) scale(1);
        opacity: 1;
      }

      .quick-action-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 8px;
      }

      .quick-action-item:hover {
        background: rgba(255, 219, 112, 0.1);
        color: var(--green-teal);
      }

      .quick-action-item:last-child {
        margin-bottom: 0;
      }

      .quick-action-item ion-icon {
        font-size: 18px;
        color: var(--green-teal);
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .sidebar {
          transform: translateX(-100%) !important;
        }
        
        .main-content {
          margin-left: 0 !important;
        }

        /* Improve touch targets */
        button, .clickable, .service-item, .project-item {
          min-height: 44px !important;
          min-width: 44px !important;
        }

        /* Optimize scroll performance */
        * {
          -webkit-overflow-scrolling: touch;
        }
      }
    `;

    document.head.appendChild(style);
  }

  createFloatingActionButton() {
    const fab = document.createElement('button');
    fab.className = 'mobile-fab';
    fab.innerHTML = '<ion-icon name="apps-outline"></ion-icon>';
    fab.setAttribute('aria-label', 'Quick actions menu');

    document.body.appendChild(fab);

    fab.addEventListener('click', () => {
      this.toggleQuickActions();
    });
  }

  setupPullToRefresh() {
    let startY = 0;
    let pullDistance = 0;
    const threshold = 100;
    let isPulling = false;

    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'pull-to-refresh';
    refreshIndicator.innerHTML = `
      <div class="spinner"></div>
      <span>Pull to refresh</span>
    `;
    document.body.appendChild(refreshIndicator);

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = true;
      }
    });

    document.addEventListener('touchmove', (e) => {
      if (!isPulling) return;

      const currentY = e.touches[0].clientY;
      pullDistance = currentY - startY;

      if (pullDistance > 0 && pullDistance < threshold) {
        refreshIndicator.style.top = `${-60 + (pullDistance * 0.5)}px`;
        refreshIndicator.querySelector('span').textContent = 'Pull to refresh';
      } else if (pullDistance >= threshold) {
        refreshIndicator.classList.add('active');
        refreshIndicator.querySelector('span').textContent = 'Release to refresh';
      }
    });

    document.addEventListener('touchend', () => {
      if (isPulling && pullDistance >= threshold) {
        this.performRefresh();
      }
      
      refreshIndicator.classList.remove('active');
      refreshIndicator.style.top = '-60px';
      isPulling = false;
      pullDistance = 0;
    });
  }

  performRefresh() {
    // Simulate refresh action
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  createBreadcrumbs() {
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'mobile-breadcrumb';
    breadcrumb.innerHTML = `
      <button class="back-btn" aria-label="Go back">
        <ion-icon name="arrow-back-outline"></ion-icon>
      </button>
      <span class="current-section">About</span>
    `;

    document.body.appendChild(breadcrumb);

    breadcrumb.querySelector('.back-btn').addEventListener('click', () => {
      this.goBack();
    });
  }

  createQuickActions() {
    const panel = document.createElement('div');
    panel.className = 'quick-actions-panel';
    
    const actions = [
      { icon: 'download-outline', label: 'Download Resume', action: () => this.downloadResume() },
      { icon: 'share-outline', label: 'Share Portfolio', action: () => this.sharePortfolio() },
      { icon: 'moon-outline', label: 'Toggle Theme', action: () => this.toggleTheme() },
      { icon: 'accessibility-outline', label: 'Accessibility', action: () => this.toggleAccessibility() },
      { icon: 'language-outline', label: 'Language', action: () => this.changeLanguage() }
    ];

    panel.innerHTML = actions.map(action => `
      <div class="quick-action-item" data-action="${action.action.name}">
        <ion-icon name="${action.icon}"></ion-icon>
        <span>${action.label}</span>
      </div>
    `).join('');

    document.body.appendChild(panel);

    // Add event listeners
    panel.addEventListener('click', (e) => {
      const actionItem = e.target.closest('.quick-action-item');
      if (actionItem) {
        const actionName = actionItem.dataset.action;
        const action = actions.find(a => a.action.name === actionName);
        if (action) {
          action.action();
          this.toggleQuickActions(); // Close panel after action
        }
      }
    });

    this.quickActionsPanel = panel;
  }

  toggleQuickActions() {
    this.quickActionsPanel.classList.toggle('active');
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Arrow key navigation
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            this.navigatePrevious();
            break;
          case 'ArrowRight':
            this.navigateNext();
            break;
          case 'Home':
            this.navigateToSection('about');
            break;
          case 'End':
            this.navigateToSection('contact');
            break;
        }
      }
    });
  }

  addMobileOptimizations() {
    // Optimize viewport for mobile
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';

    // Add mobile-specific meta tags
    const mobileMetaTags = [
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'format-detection', content: 'telephone=no' }
    ];

    mobileMetaTags.forEach(tag => {
      if (!document.querySelector(`meta[name="${tag.name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = tag.name;
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      });
      
      input.addEventListener('blur', () => {
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
      });
    });
  }

  // Navigation methods
  navigateToSection(sectionName) {
    this.navigationHistory.push(this.currentSection);
    this.currentSection = sectionName;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.mobile-breadcrumb .current-section');
    if (breadcrumb) {
      breadcrumb.textContent = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);
    }

    // Trigger navigation
    const navigationLinks = document.querySelectorAll('[data-nav-link]');
    const targetLink = Array.from(navigationLinks).find(link => 
      link.textContent.toLowerCase().includes(sectionName.toLowerCase())
    );
    
    if (targetLink) {
      targetLink.click();
    }
  }

  updateActiveTab(sectionName) {
    const tabs = document.querySelectorAll('.mobile-tab-bar .tab-item');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.section === sectionName) {
        tab.classList.add('active');
      }
    });
  }

  goBack() {
    if (this.navigationHistory.length > 0) {
      const previousSection = this.navigationHistory.pop();
      this.navigateToSection(previousSection);
    }
  }

  navigatePrevious() {
    const sections = ['about', 'resume', 'portfolio', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);
    if (currentIndex > 0) {
      this.navigateToSection(sections[currentIndex - 1]);
    }
  }

  navigateNext() {
    const sections = ['about', 'resume', 'portfolio', 'contact'];
    const currentIndex = sections.indexOf(this.currentSection);
    if (currentIndex < sections.length - 1) {
      this.navigateToSection(sections[currentIndex + 1]);
    }
  }

  // Quick action methods
  downloadResume() {
    const link = document.createElement('a');
    link.href = '/assets/documents/resume.pdf';
    link.download = 'Long_Luong_Resume.pdf';
    link.click();
  }

  sharePortfolio() {
    if (navigator.share) {
      navigator.share({
        title: 'Long Luong - Portfolio',
        text: 'Check out my portfolio!',
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Portfolio URL copied to clipboard!');
      });
    }
  }

  toggleTheme() {
    const themeButton = document.querySelector('.theme-toggle') || 
                      document.querySelector('[data-theme-toggle]');
    if (themeButton) {
      themeButton.click();
    }
  }

  toggleAccessibility() {
    document.body.classList.toggle('accessibility-mode');
    localStorage.setItem('accessibilityMode', document.body.classList.contains('accessibility-mode'));
  }

  changeLanguage() {
    // Implement language switching logic
    const languages = ['en', 'vi', 'ja'];
    const currentLang = localStorage.getItem('language') || 'en';
    const currentIndex = languages.indexOf(currentLang);
    const nextLang = languages[(currentIndex + 1) % languages.length];
    
    localStorage.setItem('language', nextLang);
    // Trigger language change event
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: nextLang } }));
  }
}

// Initialize mobile navigation
document.addEventListener('DOMContentLoaded', () => {
  window.mobileNavigation = new MobileNavigation();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileNavigation;
}
