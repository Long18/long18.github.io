/**
 * Progressive Web App Manager
 * Features: App installation, offline support, background sync, push notifications
 */

class PWAManager {
  constructor() {
    this.deferredPrompt = null;
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    this.serviceWorker = null;
    this.installButton = null;
    
    this.init();
  }

  async init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupOfflineDetection();
    this.setupBackgroundSync();
    this.createInstallButton();
    this.setupPushNotifications();
    this.monitorAppUsage();
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        this.serviceWorker = registration;
        console.log('ServiceWorker registered successfully');
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateAvailable();
            }
          });
        });
        
      } catch (error) {
        console.error('ServiceWorker registration failed:', error);
      }
    }
  }

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    window.addEventListener('appinstalled', () => {
      this.hideInstallButton();
      this.trackEvent('pwa_installed');
      this.showInstallSuccess();
    });
  }

  createInstallButton() {
    if (this.isStandalone) return;

    this.installButton = document.createElement('button');
    this.installButton.className = 'pwa-install-button';
    this.installButton.innerHTML = `
      <ion-icon name="download-outline"></ion-icon>
      <span>Install App</span>
    `;
    this.installButton.style.display = 'none';
    
    this.installButton.addEventListener('click', () => {
      this.installApp();
    });

    // Add to floating actions or header
    const container = document.querySelector('.quick-actions-panel') || document.body;
    container.appendChild(this.installButton);

    this.addInstallButtonStyles();
  }

  addInstallButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .pwa-install-button {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--green-teal), #40ca7a);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 1001;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
      }

      .pwa-install-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
      }

      .pwa-install-button ion-icon {
        font-size: 18px;
      }

      .pwa-update-banner {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(15, 15, 35, 0.95);
        color: white;
        padding: 16px;
        text-align: center;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        z-index: 1002;
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255, 219, 112, 0.3);
      }

      .pwa-update-banner.show {
        transform: translateY(0);
      }

      .pwa-update-button {
        background: var(--green-teal);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 20px;
        margin-left: 12px;
        cursor: pointer;
        font-weight: 600;
      }

      .offline-indicator {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(15, 15, 35, 0.95);
        color: var(--green-teal);
        padding: 20px 30px;
        border-radius: 16px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 219, 112, 0.3);
        z-index: 10000;
        display: none;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }

  async installApp() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      this.trackEvent('pwa_install_accepted');
    } else {
      this.trackEvent('pwa_install_dismissed');
    }
    
    this.deferredPrompt = null;
  }

  showInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'flex';
    }
  }

  hideInstallButton() {
    if (this.installButton) {
      this.installButton.style.display = 'none';
    }
  }

  showUpdateAvailable() {
    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <span>A new version is available!</span>
      <button class="pwa-update-button" onclick="window.location.reload()">Update</button>
    `;
    
    document.body.appendChild(banner);
    setTimeout(() => banner.classList.add('show'), 100);
  }

  showInstallSuccess() {
    this.showToast('App installed successfully! You can now use it offline.', 'success');
  }

  setupOfflineDetection() {
    const updateOnlineStatus = () => {
      const indicator = this.getOfflineIndicator();
      
      if (!navigator.onLine) {
        indicator.innerHTML = `
          <ion-icon name="wifi-outline"></ion-icon>
          <div>You're offline</div>
          <small>Some features may be limited</small>
        `;
        indicator.style.display = 'block';
      } else {
        indicator.style.display = 'none';
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  getOfflineIndicator() {
    let indicator = document.querySelector('.offline-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'offline-indicator';
      document.body.appendChild(indicator);
    }
    return indicator;
  }

  setupBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      // Register background sync for form submissions
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('background-sync');
      });
    }
  }

  async setupPushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      // Only setup if user hasn't denied
      if (Notification.permission === 'default') {
        // Show subtle prompt for notifications later
        this.setupNotificationPrompt();
      }
    }
  }

  setupNotificationPrompt() {
    // Add notification prompt to settings or after user engagement
    const prompt = document.createElement('div');
    prompt.className = 'notification-prompt';
    prompt.innerHTML = `
      <div class="prompt-content">
        <h4>Stay Updated</h4>
        <p>Get notified about new projects and updates</p>
        <div class="prompt-actions">
          <button class="prompt-allow">Allow</button>
          <button class="prompt-dismiss">Not now</button>
        </div>
      </div>
    `;

    // Add to accessibility panel or show after user interaction
    this.addNotificationPromptStyles();
  }

  addNotificationPromptStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .notification-prompt {
        background: rgba(15, 15, 35, 0.95);
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-radius: 12px;
        padding: 20px;
        margin: 16px 0;
        backdrop-filter: blur(10px);
      }

      .notification-prompt h4 {
        margin: 0 0 8px 0;
        color: var(--green-teal);
      }

      .notification-prompt p {
        margin: 0 0 16px 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }

      .prompt-actions {
        display: flex;
        gap: 12px;
      }

      .prompt-allow, .prompt-dismiss {
        padding: 8px 16px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .prompt-allow {
        background: var(--green-teal);
        color: white;
      }

      .prompt-dismiss {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
      }
    `;
    document.head.appendChild(style);
  }

  monitorAppUsage() {
    // Track app usage patterns for optimization
    let startTime = Date.now();
    let interactions = 0;

    document.addEventListener('click', () => interactions++);
    document.addEventListener('scroll', () => interactions++);
    document.addEventListener('touchstart', () => interactions++);

    // Send usage data periodically
    setInterval(() => {
      if (interactions > 0) {
        this.trackEvent('app_engagement', {
          duration: Date.now() - startTime,
          interactions: interactions
        });
        interactions = 0;
        startTime = Date.now();
      }
    }, 60000); // Every minute
  }

  trackEvent(eventName, data = {}) {
    // Send to analytics
    if (window.gtag) {
      gtag('event', eventName, data);
    }
    
    // Store locally for offline sync
    const events = JSON.parse(localStorage.getItem('offline_events') || '[]');
    events.push({
      event: eventName,
      data: data,
      timestamp: Date.now()
    });
    localStorage.setItem('offline_events', JSON.stringify(events));
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `pwa-toast toast-${type}`;
    toast.textContent = message;
    
    const style = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 15, 35, 0.95);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 219, 112, 0.3);
      z-index: 10000;
      animation: slideUp 0.3s ease;
    `;
    
    toast.style.cssText = style;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideDown 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize PWA Manager
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PWAManager;
}
