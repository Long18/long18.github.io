/**
 * Enhanced Mobile Performance Monitor
 * Features: FPS monitoring, memory usage, network quality, battery optimization
 */

class MobilePerformanceMonitor {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.metrics = {
      fps: [],
      memory: [],
      network: [],
      battery: null,
      renderTime: []
    };
    this.thresholds = {
      lowFPS: 30,
      highMemory: 100, // MB
      slowNetwork: 1000 // ms
    };
    this.adaptiveMode = false;
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async init() {
    this.setupFPSMonitoring();
    this.setupMemoryMonitoring();
    this.setupNetworkMonitoring();
    this.setupBatteryMonitoring();
    this.setupRenderTimeMonitoring();
    this.createPerformancePanel();
    this.startAdaptiveOptimizations();
  }

  setupFPSMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measureFPS = (currentTime) => {
      frameCount++;
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.metrics.fps.push(fps);
        
        // Keep only last 10 measurements
        if (this.metrics.fps.length > 10) {
          this.metrics.fps.shift();
        }
        
        // Trigger adaptive optimizations if FPS is low
        if (fps < this.thresholds.lowFPS) {
          this.optimizeForLowFPS();
        }
        
        frameCount = 0;
        lastTime = currentTime;
        
        this.updatePerformancePanel();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);
  }

  setupMemoryMonitoring() {
    if (performance.memory) {
      setInterval(() => {
        const memory = {
          used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(performance.memory.totalJSHeapSize / 1048576),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
        
        this.metrics.memory.push(memory);
        
        if (this.metrics.memory.length > 10) {
          this.metrics.memory.shift();
        }
        
        // Trigger garbage collection hints if memory is high
        if (memory.used > this.thresholds.highMemory) {
          this.optimizeMemoryUsage();
        }
        
      }, 5000); // Every 5 seconds
    }
  }

  setupNetworkMonitoring() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateNetworkInfo = () => {
        const networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        };
        
        this.metrics.network.push(networkInfo);
        
        if (this.metrics.network.length > 5) {
          this.metrics.network.shift();
        }
        
        // Optimize for slow networks
        if (connection.rtt > this.thresholds.slowNetwork || connection.saveData) {
          this.optimizeForSlowNetwork();
        }
      };
      
      connection.addEventListener('change', updateNetworkInfo);
      updateNetworkInfo();
    }
  }

  async setupBatteryMonitoring() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        
        const updateBatteryInfo = () => {
          this.metrics.battery = {
            level: Math.round(battery.level * 100),
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          };
          
          // Optimize for low battery
          if (this.metrics.battery.level < 20 && !this.metrics.battery.charging) {
            this.optimizeForLowBattery();
          }
        };
        
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        updateBatteryInfo();
        
      } catch (error) {
        console.log('Battery API not available');
      }
    }
  }

  setupRenderTimeMonitoring() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.metrics.renderTime.push(entry.duration);
          
          if (this.metrics.renderTime.length > 20) {
            this.metrics.renderTime.shift();
          }
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    // Measure custom render times
    this.measureRenderTime('page-load', () => {
      // Mark when page is interactive
      if (document.readyState === 'complete') {
        performance.mark('page-interactive');
        performance.measure('page-load', 'navigationStart', 'page-interactive');
      }
    });
  }

  measureRenderTime(name, callback) {
    performance.mark(`${name}-start`);
    callback();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  optimizeForLowFPS() {
    if (this.adaptiveMode) return;
    
    console.log('Optimizing for low FPS');
    document.body.classList.add('performance-low');
    
    // Reduce animation complexity
    const style = document.createElement('style');
    style.id = 'fps-optimization';
    style.textContent = `
      .performance-low * {
        animation-duration: 0.1s !important;
        transition-duration: 0.1s !important;
        will-change: auto !important;
      }
      
      .performance-low .tech-icons-constellation {
        animation: none !important;
      }
      
      .performance-low .particle-system {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
    this.adaptiveMode = true;
  }

  optimizeMemoryUsage() {
    console.log('Optimizing memory usage');
    
    // Clear unnecessary caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('v1')) {
            caches.delete(name);
          }
        });
      });
    }
    
    // Suggest garbage collection
    if (window.gc) {
      window.gc();
    }
    
    // Remove unused event listeners
    this.cleanupEventListeners();
  }

  optimizeForSlowNetwork() {
    console.log('Optimizing for slow network');
    document.body.classList.add('slow-network');
    
    // Reduce image quality
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const src = img.getAttribute('data-src');
      if (src && !src.includes('low-quality')) {
        img.setAttribute('data-src', src.replace(/\.(jpg|jpeg|png)/, '-low-quality.$1'));
      }
    });
    
    // Disable auto-playing animations
    const style = document.createElement('style');
    style.id = 'network-optimization';
    style.textContent = `
      .slow-network video {
        autoplay: false !important;
      }
      
      .slow-network .auto-animation {
        animation-play-state: paused !important;
      }
    `;
    
    document.head.appendChild(style);
  }

  optimizeForLowBattery() {
    console.log('Optimizing for low battery');
    document.body.classList.add('battery-saver');
    
    // Reduce screen brightness effect
    const style = document.createElement('style');
    style.id = 'battery-optimization';
    style.textContent = `
      .battery-saver {
        filter: brightness(0.8) !important;
      }
      
      .battery-saver * {
        animation-play-state: paused !important;
        transition: none !important;
      }
      
      .battery-saver .background-animation {
        display: none !important;
      }
    `;
    
    document.head.appendChild(style);
    
    // Disable haptic feedback
    if (window.mobileAccessibility) {
      window.mobileAccessibility.disableHaptics = true;
    }
  }

  cleanupEventListeners() {
    // Remove unused event listeners to free memory
    const unusedElements = document.querySelectorAll('.removed, .hidden');
    unusedElements.forEach(element => {
      element.remove();
    });
  }

  createPerformancePanel() {
    const panel = document.createElement('div');
    panel.className = 'performance-panel';
    panel.innerHTML = `
      <div class="performance-header">
        <h4>Performance</h4>
        <button class="close-performance">×</button>
      </div>
      <div class="performance-metrics">
        <div class="metric">
          <span class="metric-label">FPS:</span>
          <span class="metric-value" id="fps-value">--</span>
        </div>
        <div class="metric">
          <span class="metric-label">Memory:</span>
          <span class="metric-value" id="memory-value">--</span>
        </div>
        <div class="metric">
          <span class="metric-label">Network:</span>
          <span class="metric-value" id="network-value">--</span>
        </div>
        <div class="metric">
          <span class="metric-label">Battery:</span>
          <span class="metric-value" id="battery-value">--</span>
        </div>
      </div>
      <div class="performance-actions">
        <button class="optimize-btn">Auto Optimize</button>
        <button class="reset-btn">Reset</button>
      </div>
    `;
    
    panel.style.cssText = `
      position: fixed;
      top: 50%;
      right: -300px;
      transform: translateY(-50%);
      width: 280px;
      background: rgba(15, 15, 35, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 219, 112, 0.3);
      border-radius: 16px 0 0 16px;
      padding: 20px;
      z-index: 10000;
      color: white;
      transition: right 0.3s ease;
    `;
    
    document.body.appendChild(panel);
    
    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'performance-toggle';
    toggleBtn.innerHTML = '📊';
    toggleBtn.style.cssText = `
      position: fixed;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      background: rgba(15, 15, 35, 0.8);
      border: 1px solid rgba(255, 219, 112, 0.3);
      border-radius: 50%;
      color: var(--green-teal);
      cursor: pointer;
      z-index: 10001;
      font-size: 16px;
    `;
    
    document.body.appendChild(toggleBtn);
    
    this.setupPanelEvents(panel, toggleBtn);
    this.addPerformancePanelStyles();
  }

  setupPanelEvents(panel, toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = panel.style.right === '0px';
      panel.style.right = isOpen ? '-300px' : '0px';
    });
    
    panel.querySelector('.close-performance').addEventListener('click', () => {
      panel.style.right = '-300px';
    });
    
    panel.querySelector('.optimize-btn').addEventListener('click', () => {
      this.startAdaptiveOptimizations();
    });
    
    panel.querySelector('.reset-btn').addEventListener('click', () => {
      this.resetOptimizations();
    });
  }

  addPerformancePanelStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .performance-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255, 219, 112, 0.2);
      }
      
      .performance-header h4 {
        margin: 0;
        color: var(--green-teal);
      }
      
      .close-performance {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
      }
      
      .performance-metrics {
        margin-bottom: 16px;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;
      }
      
      .metric-label {
        color: rgba(255, 255, 255, 0.8);
      }
      
      .metric-value {
        color: var(--green-teal);
        font-weight: 600;
      }
      
      .performance-actions {
        display: flex;
        gap: 8px;
      }
      
      .optimize-btn, .reset-btn {
        flex: 1;
        padding: 8px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      
      .optimize-btn {
        background: var(--green-teal);
        color: white;
      }
      
      .reset-btn {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
      }
    `;
    document.head.appendChild(style);
  }

  updatePerformancePanel() {
    const fpsValue = document.getElementById('fps-value');
    const memoryValue = document.getElementById('memory-value');
    const networkValue = document.getElementById('network-value');
    const batteryValue = document.getElementById('battery-value');
    
    if (fpsValue && this.metrics.fps.length > 0) {
      const avgFPS = Math.round(this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length);
      fpsValue.textContent = `${avgFPS}`;
      fpsValue.style.color = avgFPS < 30 ? '#ff6b6b' : avgFPS < 50 ? '#ffd93d' : '#6bcf7f';
    }
    
    if (memoryValue && this.metrics.memory.length > 0) {
      const lastMemory = this.metrics.memory[this.metrics.memory.length - 1];
      memoryValue.textContent = `${lastMemory.used}MB`;
      memoryValue.style.color = lastMemory.used > 100 ? '#ff6b6b' : '#6bcf7f';
    }
    
    if (networkValue && this.metrics.network.length > 0) {
      const lastNetwork = this.metrics.network[this.metrics.network.length - 1];
      networkValue.textContent = lastNetwork.effectiveType || 'Unknown';
    }
    
    if (batteryValue && this.metrics.battery) {
      batteryValue.textContent = `${this.metrics.battery.level}%`;
      batteryValue.style.color = this.metrics.battery.level < 20 ? '#ff6b6b' : '#6bcf7f';
    }
  }

  startAdaptiveOptimizations() {
    console.log('Starting adaptive optimizations');
    
    // Monitor performance continuously
    setInterval(() => {
      const avgFPS = this.metrics.fps.length > 0 ? 
        this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length : 60;
      
      const lastMemory = this.metrics.memory.length > 0 ? 
        this.metrics.memory[this.metrics.memory.length - 1] : { used: 0 };
      
      // Auto-optimize based on thresholds
      if (avgFPS < this.thresholds.lowFPS) {
        this.optimizeForLowFPS();
      }
      
      if (lastMemory.used > this.thresholds.highMemory) {
        this.optimizeMemoryUsage();
      }
      
    }, 10000); // Check every 10 seconds
  }

  resetOptimizations() {
    console.log('Resetting optimizations');
    
    // Remove optimization classes
    document.body.classList.remove('performance-low', 'slow-network', 'battery-saver');
    
    // Remove optimization styles
    ['fps-optimization', 'network-optimization', 'battery-optimization'].forEach(id => {
      const style = document.getElementById(id);
      if (style) style.remove();
    });
    
    this.adaptiveMode = false;
    
    // Re-enable features
    if (window.mobileAccessibility) {
      window.mobileAccessibility.disableHaptics = false;
    }
  }

  getPerformanceReport() {
    return {
      averageFPS: this.metrics.fps.length > 0 ? 
        this.metrics.fps.reduce((a, b) => a + b, 0) / this.metrics.fps.length : null,
      memoryUsage: this.metrics.memory.length > 0 ? 
        this.metrics.memory[this.metrics.memory.length - 1] : null,
      networkQuality: this.metrics.network.length > 0 ? 
        this.metrics.network[this.metrics.network.length - 1] : null,
      batteryLevel: this.metrics.battery,
      adaptiveMode: this.adaptiveMode,
      timestamp: Date.now()
    };
  }
}

// Initialize Performance Monitor
document.addEventListener('DOMContentLoaded', () => {
  window.mobilePerformanceMonitor = new MobilePerformanceMonitor();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobilePerformanceMonitor;
}
