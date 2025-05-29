/**
 * Advanced Mobile UI Components
 * Features: Bottom sheets, floating panels, mobile modals, gesture-driven components
 */

class MobileUIComponents {
  constructor() {
    this.isEnabled = this.isMobileDevice();
    this.components = new Map();
    this.activeBottomSheet = null;
    this.swipeThreshold = 50;
    
    if (this.isEnabled) {
      this.init();
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  init() {
    this.createBottomSheets();
    this.createFloatingPanels();
    this.createMobileModals();
    this.setupSwipeCards();
    this.createActionSheets();
    this.addComponentStyles();
  }

  createBottomSheets() {
    // Portfolio details bottom sheet
    this.createBottomSheet('portfolio-details', {
      title: 'Project Details',
      content: this.getPortfolioDetailsContent(),
      height: '70vh',
      peekHeight: '100px'
    });

    // Contact bottom sheet
    this.createBottomSheet('contact-sheet', {
      title: 'Get In Touch',
      content: this.getContactSheetContent(),
      height: '60vh',
      peekHeight: '80px'
    });

    // Skills bottom sheet
    this.createBottomSheet('skills-sheet', {
      title: 'Technical Skills',
      content: this.getSkillsSheetContent(),
      height: '80vh',
      peekHeight: '120px'
    });
  }

  createBottomSheet(id, options) {
    const sheet = document.createElement('div');
    sheet.className = 'mobile-bottom-sheet';
    sheet.id = id;
    sheet.innerHTML = `
      <div class="bottom-sheet-backdrop"></div>
      <div class="bottom-sheet-container">
        <div class="bottom-sheet-handle"></div>
        <div class="bottom-sheet-header">
          <h3>${options.title}</h3>
          <button class="bottom-sheet-close">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>
        <div class="bottom-sheet-content">
          ${options.content}
        </div>
      </div>
    `;

    sheet.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10000;
      transform: translateY(calc(100% - ${options.peekHeight}));
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(sheet);
    this.setupBottomSheetEvents(sheet, options);
    this.components.set(id, sheet);

    return sheet;
  }

  setupBottomSheetEvents(sheet, options) {
    const container = sheet.querySelector('.bottom-sheet-container');
    const backdrop = sheet.querySelector('.bottom-sheet-backdrop');
    const closeBtn = sheet.querySelector('.bottom-sheet-close');
    const handle = sheet.querySelector('.bottom-sheet-handle');

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    // Touch events for dragging
    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
      container.style.transition = 'none';
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      if (deltaY > 0) { // Only allow dragging down
        const newTransform = Math.min(deltaY, window.innerHeight);
        sheet.style.transform = `translateY(${newTransform}px)`;
      }
    };

    const handleTouchEnd = (e) => {
      if (!isDragging) return;
      
      isDragging = false;
      container.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      const deltaY = currentY - startY;
      const isExpanded = sheet.classList.contains('expanded');
      
      if (deltaY > this.swipeThreshold) {
        if (isExpanded) {
          this.collapseBottomSheet(sheet, options);
        } else {
          this.hideBottomSheet(sheet);
        }
      } else if (deltaY < -this.swipeThreshold && !isExpanded) {
        this.expandBottomSheet(sheet);
      } else {
        // Snap back to current state
        if (isExpanded) {
          sheet.style.transform = 'translateY(0)';
        } else {
          sheet.style.transform = `translateY(calc(100% - ${options.peekHeight}))`;
        }
      }
    };

    handle.addEventListener('touchstart', handleTouchStart);
    handle.addEventListener('touchmove', handleTouchMove);
    handle.addEventListener('touchend', handleTouchEnd);

    // Click events
    backdrop.addEventListener('click', () => this.hideBottomSheet(sheet));
    closeBtn.addEventListener('click', () => this.hideBottomSheet(sheet));
    
    // Expand on content tap when collapsed
    container.addEventListener('click', () => {
      if (!sheet.classList.contains('expanded')) {
        this.expandBottomSheet(sheet);
      }
    });
  }

  showBottomSheet(id) {
    const sheet = this.components.get(id);
    if (!sheet) return;

    this.activeBottomSheet = sheet;
    sheet.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  hideBottomSheet(sheet) {
    sheet.classList.remove('visible', 'expanded');
    sheet.style.transform = 'translateY(100%)';
    document.body.style.overflow = '';
    this.activeBottomSheet = null;
  }

  expandBottomSheet(sheet) {
    sheet.classList.add('expanded');
    sheet.style.transform = 'translateY(0)';
  }

  collapseBottomSheet(sheet, options) {
    sheet.classList.remove('expanded');
    sheet.style.transform = `translateY(calc(100% - ${options.peekHeight}))`;
  }

  createFloatingPanels() {
    // Quick actions floating panel
    const quickPanel = this.createFloatingPanel('quick-actions-float', {
      content: this.getQuickActionsContent(),
      position: 'bottom-right',
      size: 'compact'
    });

    // Mini player for demos
    const miniPlayer = this.createFloatingPanel('demo-player', {
      content: this.getMiniPlayerContent(),
      position: 'bottom-left',
      size: 'small',
      draggable: true
    });
  }

  createFloatingPanel(id, options) {
    const panel = document.createElement('div');
    panel.className = `floating-panel ${options.size}`;
    panel.id = id;
    panel.innerHTML = `
      <div class="floating-panel-content">
        ${options.content}
      </div>
      ${options.draggable ? '<div class="drag-handle"><ion-icon name="reorder-three"></ion-icon></div>' : ''}
    `;

    const positions = {
      'bottom-right': 'bottom: 20px; right: 20px;',
      'bottom-left': 'bottom: 20px; left: 20px;',
      'top-right': 'top: 20px; right: 20px;',
      'top-left': 'top: 20px; left: 20px;'
    };

    panel.style.cssText = `
      position: fixed;
      ${positions[options.position]}
      background: rgba(15, 15, 35, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 219, 112, 0.3);
      border-radius: 16px;
      z-index: 1000;
      transform: scale(0.8) translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(panel);
    
    if (options.draggable) {
      this.makeDraggable(panel);
    }

    this.components.set(id, panel);
    return panel;
  }

  makeDraggable(element) {
    const handle = element.querySelector('.drag-handle');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    handle.addEventListener('touchstart', (e) => {
      isDragging = true;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      
      const rect = element.getBoundingClientRect();
      initialX = rect.left;
      initialY = rect.top;
      
      element.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      element.style.left = `${initialX + deltaX}px`;
      element.style.top = `${initialY + deltaY}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
    });

    document.addEventListener('touchend', () => {
      if (isDragging) {
        isDragging = false;
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Snap to edges if needed
        this.snapToEdge(element);
      }
    });
  }

  snapToEdge(element) {
    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Snap to closest edge
    if (rect.left < windowWidth / 2) {
      element.style.left = '20px';
    } else {
      element.style.left = `${windowWidth - rect.width - 20}px`;
    }
    
    // Keep within viewport bounds
    if (rect.top < 20) {
      element.style.top = '20px';
    } else if (rect.bottom > windowHeight - 20) {
      element.style.top = `${windowHeight - rect.height - 20}px`;
    }
  }

  createMobileModals() {
    // Image gallery modal
    this.createMobileModal('image-gallery', {
      content: this.getImageGalleryContent(),
      fullscreen: true,
      swipeToClose: true
    });

    // Video player modal
    this.createMobileModal('video-player', {
      content: this.getVideoPlayerContent(),
      fullscreen: true,
      swipeToClose: true
    });
  }

  createMobileModal(id, options) {
    const modal = document.createElement('div');
    modal.className = 'mobile-modal';
    modal.id = id;
    modal.innerHTML = `
      <div class="mobile-modal-backdrop"></div>
      <div class="mobile-modal-container ${options.fullscreen ? 'fullscreen' : ''}">
        <div class="mobile-modal-header">
          <div class="modal-drag-indicator"></div>
          <button class="mobile-modal-close">
            <ion-icon name="close"></ion-icon>
          </button>
        </div>
        <div class="mobile-modal-content">
          ${options.content}
        </div>
      </div>
    `;

    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10001;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    `;

    document.body.appendChild(modal);
    this.setupMobileModalEvents(modal, options);
    this.components.set(id, modal);

    return modal;
  }

  setupMobileModalEvents(modal, options) {
    const backdrop = modal.querySelector('.mobile-modal-backdrop');
    const container = modal.querySelector('.mobile-modal-container');
    const closeBtn = modal.querySelector('.mobile-modal-close');

    backdrop.addEventListener('click', () => this.closeMobileModal(modal));
    closeBtn.addEventListener('click', () => this.closeMobileModal(modal));

    if (options.swipeToClose) {
      this.setupSwipeToClose(modal, container);
    }
  }

  setupSwipeToClose(modal, container) {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      isDragging = true;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      
      if (deltaY > 0) {
        container.style.transform = `translateY(${deltaY}px)`;
        const opacity = Math.max(0.3, 1 - (deltaY / window.innerHeight));
        modal.style.opacity = opacity;
      }
    });

    container.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      isDragging = false;
      const deltaY = currentY - startY;
      
      if (deltaY > this.swipeThreshold * 2) {
        this.closeMobileModal(modal);
      } else {
        container.style.transform = 'translateY(0)';
        modal.style.opacity = '1';
      }
    });
  }

  openMobileModal(id) {
    const modal = this.components.get(id);
    if (!modal) return;

    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';
  }

  closeMobileModal(modal) {
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.body.style.overflow = '';
    
    const container = modal.querySelector('.mobile-modal-container');
    container.style.transform = 'translateY(0)';
  }

  setupSwipeCards() {
    const cards = document.querySelectorAll('.swipe-card, .project-item, .service-item');
    
    cards.forEach(card => {
      this.makeSwipeable(card);
    });
  }

  makeSwipeable(card) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    card.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      card.style.transition = 'none';
    });

    card.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;
      
      card.style.transform = `translateX(${deltaX}px) rotate(${deltaX * 0.1}deg)`;
      card.style.opacity = Math.max(0.5, 1 - Math.abs(deltaX) / 200);
    });

    card.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      isDragging = false;
      const deltaX = currentX - startX;
      
      card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      if (Math.abs(deltaX) > this.swipeThreshold) {
        // Swipe action
        const direction = deltaX > 0 ? 'right' : 'left';
        this.handleSwipeAction(card, direction);
      } else {
        // Snap back
        card.style.transform = 'translateX(0) rotate(0deg)';
        card.style.opacity = '1';
      }
    });
  }

  handleSwipeAction(card, direction) {
    // Custom swipe actions
    const event = new CustomEvent('mobileSwipeAction', {
      detail: { card, direction }
    });
    
    document.dispatchEvent(event);
    
    // Default behavior: remove card
    card.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'}) rotate(${direction === 'right' ? '30deg' : '-30deg'})`;
    card.style.opacity = '0';
    
    setTimeout(() => {
      card.style.transform = 'translateX(0) rotate(0deg)';
      card.style.opacity = '1';
    }, 300);
  }

  createActionSheets() {
    // Share action sheet
    this.createActionSheet('share-actions', {
      title: 'Share Portfolio',
      actions: [
        { label: 'Copy Link', icon: 'copy', action: () => this.copyPortfolioLink() },
        { label: 'Share via Email', icon: 'mail', action: () => this.shareViaEmail() },
        { label: 'Share on Social', icon: 'share-social', action: () => this.shareOnSocial() },
        { label: 'Generate QR Code', icon: 'qr-code', action: () => this.generateQRCode() }
      ]
    });
  }

  createActionSheet(id, options) {
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    sheet.id = id;
    
    const actionsHTML = options.actions.map(action => `
      <div class="action-item" data-action="${action.label}">
        <ion-icon name="${action.icon}"></ion-icon>
        <span>${action.label}</span>
      </div>
    `).join('');
    
    sheet.innerHTML = `
      <div class="action-sheet-backdrop"></div>
      <div class="action-sheet-container">
        <div class="action-sheet-header">
          <h4>${options.title}</h4>
        </div>
        <div class="action-sheet-actions">
          ${actionsHTML}
        </div>
        <div class="action-sheet-cancel">
          <button>Cancel</button>
        </div>
      </div>
    `;

    sheet.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 10002;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;

    document.body.appendChild(sheet);
    this.setupActionSheetEvents(sheet, options);
    this.components.set(id, sheet);

    return sheet;
  }

  setupActionSheetEvents(sheet, options) {
    const backdrop = sheet.querySelector('.action-sheet-backdrop');
    const cancelBtn = sheet.querySelector('.action-sheet-cancel button');
    const actionItems = sheet.querySelectorAll('.action-item');

    backdrop.addEventListener('click', () => this.hideActionSheet(sheet));
    cancelBtn.addEventListener('click', () => this.hideActionSheet(sheet));

    actionItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        options.actions[index].action();
        this.hideActionSheet(sheet);
      });
    });
  }

  showActionSheet(id) {
    const sheet = this.components.get(id);
    if (!sheet) return;

    sheet.style.transform = 'translateY(0)';
    document.body.style.overflow = 'hidden';
  }

  hideActionSheet(sheet) {
    sheet.style.transform = 'translateY(100%)';
    document.body.style.overflow = '';
  }

  // Content generators
  getPortfolioDetailsContent() {
    return `
      <div class="portfolio-details">
        <div class="project-gallery">
          <div class="gallery-main">
            <img src="assets/images/placeholder.png" alt="Project Screenshot" />
          </div>
          <div class="gallery-thumbs">
            <img src="assets/images/pic-1.png" alt="Thumb 1" />
            <img src="assets/images/pic-2.png" alt="Thumb 2" />
            <img src="assets/images/pic-3.png" alt="Thumb 3" />
          </div>
        </div>
        <div class="project-info">
          <div class="project-meta">
            <span class="project-category">Web Development</span>
            <span class="project-date">2024</span>
          </div>
          <h4>Project Title</h4>
          <p>Detailed description of the project, technologies used, and key features implemented.</p>
          <div class="project-tech">
            <span class="tech-tag">React</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Node.js</span>
          </div>
          <div class="project-actions">
            <button class="btn-primary">View Live</button>
            <button class="btn-secondary">View Code</button>
          </div>
        </div>
      </div>
    `;
  }

  getContactSheetContent() {
    return `
      <div class="contact-form-mobile">
        <div class="contact-methods">
          <a href="mailto:your.email@example.com" class="contact-method">
            <ion-icon name="mail"></ion-icon>
            <span>Email</span>
          </a>
          <a href="tel:+1234567890" class="contact-method">
            <ion-icon name="call"></ion-icon>
            <span>Phone</span>
          </a>
          <a href="https://linkedin.com/in/yourprofile" class="contact-method">
            <ion-icon name="logo-linkedin"></ion-icon>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/yourusername" class="contact-method">
            <ion-icon name="logo-github"></ion-icon>
            <span>GitHub</span>
          </a>
        </div>
        <form class="quick-contact-form">
          <input type="text" placeholder="Your Name" required>
          <input type="email" placeholder="Your Email" required>
          <textarea placeholder="Your Message" rows="4" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    `;
  }

  getSkillsSheetContent() {
    return `
      <div class="skills-mobile">
        <div class="skill-categories">
          <div class="skill-category">
            <h4>Frontend</h4>
            <div class="skills-grid">
              <div class="skill-item">
                <span>React</span>
                <div class="skill-level">
                  <div class="skill-progress" style="width: 90%"></div>
                </div>
              </div>
              <div class="skill-item">
                <span>TypeScript</span>
                <div class="skill-level">
                  <div class="skill-progress" style="width: 85%"></div>
                </div>
              </div>
              <div class="skill-item">
                <span>CSS/SCSS</span>
                <div class="skill-level">
                  <div class="skill-progress" style="width: 95%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="skill-category">
            <h4>Backend</h4>
            <div class="skills-grid">
              <div class="skill-item">
                <span>Node.js</span>
                <div class="skill-level">
                  <div class="skill-progress" style="width: 80%"></div>
                </div>
              </div>
              <div class="skill-item">
                <span>Python</span>
                <div class="skill-level">
                  <div class="skill-progress" style="width: 75%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getQuickActionsContent() {
    return `
      <div class="quick-actions-grid">
        <button class="quick-action" onclick="window.mobileUIComponents.showBottomSheet('contact-sheet')">
          <ion-icon name="mail"></ion-icon>
          <span>Contact</span>
        </button>
        <button class="quick-action" onclick="window.mobileUIComponents.showActionSheet('share-actions')">
          <ion-icon name="share"></ion-icon>
          <span>Share</span>
        </button>
        <button class="quick-action" onclick="window.print()">
          <ion-icon name="download"></ion-icon>
          <span>Download</span>
        </button>
      </div>
    `;
  }

  getMiniPlayerContent() {
    return `
      <div class="mini-player">
        <div class="player-info">
          <span>Demo Video</span>
        </div>
        <div class="player-controls">
          <button class="play-btn">
            <ion-icon name="play"></ion-icon>
          </button>
          <button class="expand-btn">
            <ion-icon name="expand"></ion-icon>
          </button>
        </div>
      </div>
    `;
  }

  getImageGalleryContent() {
    return `
      <div class="mobile-gallery">
        <div class="gallery-container">
          <div class="gallery-item active">
            <img src="assets/images/pic-1.png" alt="Gallery Image 1" />
          </div>
          <div class="gallery-item">
            <img src="assets/images/pic-2.png" alt="Gallery Image 2" />
          </div>
          <div class="gallery-item">
            <img src="assets/images/pic-3.png" alt="Gallery Image 3" />
          </div>
        </div>
        <div class="gallery-controls">
          <button class="gallery-prev">
            <ion-icon name="chevron-back"></ion-icon>
          </button>
          <div class="gallery-indicators">
            <span class="indicator active"></span>
            <span class="indicator"></span>
            <span class="indicator"></span>
          </div>
          <button class="gallery-next">
            <ion-icon name="chevron-forward"></ion-icon>
          </button>
        </div>
      </div>
    `;
  }

  getVideoPlayerContent() {
    return `
      <div class="mobile-video-player">
        <video controls poster="assets/images/thumbnail.png">
          <source src="assets/videos/demo.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="video-info">
          <h4>Project Demo</h4>
          <p>Live demonstration of the project features and functionality.</p>
        </div>
      </div>
    `;
  }

  addComponentStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Bottom Sheets */
      .mobile-bottom-sheet {
        display: none;
      }
      
      .mobile-bottom-sheet.visible {
        display: block;
      }
      
      .bottom-sheet-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .mobile-bottom-sheet.visible .bottom-sheet-backdrop {
        opacity: 1;
      }
      
      .bottom-sheet-container {
        position: relative;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px 20px 0 0;
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-bottom: none;
        color: white;
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .bottom-sheet-handle {
        width: 40px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
        margin: 12px auto 8px;
        cursor: grab;
      }
      
      .bottom-sheet-header {
        display: flex;
        justify-content: between;
        align-items: center;
        padding: 0 20px 16px;
        border-bottom: 1px solid rgba(255, 219, 112, 0.2);
      }
      
      .bottom-sheet-header h3 {
        margin: 0;
        color: var(--green-teal);
        flex: 1;
      }
      
      .bottom-sheet-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .bottom-sheet-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      .bottom-sheet-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Floating Panels */
      .floating-panel {
        max-width: 280px;
      }
      
      .floating-panel.compact {
        width: 200px;
      }
      
      .floating-panel.small {
        width: 160px;
      }
      
      .floating-panel.visible {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
      
      .floating-panel-content {
        padding: 16px;
        color: white;
      }
      
      .drag-handle {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 32px;
        height: 32px;
        background: rgba(255, 219, 112, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        color: var(--green-teal);
        font-size: 16px;
      }
      
      .drag-handle:active {
        cursor: grabbing;
      }
      
      /* Mobile Modals */
      .mobile-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
      }
      
      .mobile-modal-container {
        position: relative;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px 20px 0 0;
        border: 1px solid rgba(255, 219, 112, 0.3);
        margin-top: 60px;
        height: calc(100vh - 60px);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        color: white;
      }
      
      .mobile-modal-container.fullscreen {
        margin-top: 0;
        height: 100vh;
        border-radius: 0;
      }
      
      .mobile-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 219, 112, 0.2);
      }
      
      .modal-drag-indicator {
        width: 40px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 2px;
      }
      
      .mobile-modal-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24px;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.2s ease;
      }
      
      .mobile-modal-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Action Sheets */
      .action-sheet-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
      }
      
      .action-sheet-container {
        position: relative;
        background: rgba(15, 15, 35, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 20px 20px 0 0;
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-bottom: none;
        color: white;
        padding: 20px 0;
      }
      
      .action-sheet-header {
        text-align: center;
        padding: 0 20px 16px;
        border-bottom: 1px solid rgba(255, 219, 112, 0.2);
      }
      
      .action-sheet-header h4 {
        margin: 0;
        color: var(--green-teal);
      }
      
      .action-sheet-actions {
        padding: 16px 0;
      }
      
      .action-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .action-item:hover {
        background: rgba(255, 219, 112, 0.1);
      }
      
      .action-item ion-icon {
        font-size: 20px;
        color: var(--green-teal);
        width: 24px;
      }
      
      .action-item span {
        flex: 1;
        font-size: 16px;
      }
      
      .action-sheet-cancel {
        border-top: 1px solid rgba(255, 219, 112, 0.2);
        padding: 16px 20px 0;
      }
      
      .action-sheet-cancel button {
        width: 100%;
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: rgba(255, 255, 255, 0.8);
        padding: 12px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .action-sheet-cancel button:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      /* Quick Actions */
      .quick-actions-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }
      
      .quick-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 8px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 219, 112, 0.3);
        border-radius: 12px;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .quick-action:hover {
        background: rgba(255, 219, 112, 0.2);
        transform: translateY(-2px);
      }
      
      .quick-action ion-icon {
        font-size: 20px;
        color: var(--green-teal);
      }
      
      .quick-action span {
        font-size: 12px;
        font-weight: 600;
      }
      
      /* Mobile specific styles */
      @media (max-width: 768px) {
        .floating-panel.visible {
          animation: fadeInUp 0.3s ease;
        }
        
        .mobile-bottom-sheet.visible {
          animation: slideUp 0.3s ease;
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes slideUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(calc(100% - var(--peek-height, 100px)));
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Utility methods for action sheet actions
  copyPortfolioLink() {
    navigator.clipboard.writeText(window.location.href);
    this.showToast('Portfolio link copied to clipboard!');
  }

  shareViaEmail() {
    const subject = encodeURIComponent('Check out this portfolio');
    const body = encodeURIComponent(`I thought you might be interested in this portfolio: ${window.location.href}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }

  shareOnSocial() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this amazing portfolio!');
    
    if (navigator.share) {
      navigator.share({
        title: 'Portfolio',
        text: 'Check out this portfolio',
        url: window.location.href,
      });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
    }
  }

  generateQRCode() {
    // Generate QR code for portfolio URL
    this.showToast('QR Code generation feature coming soon!');
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'mobile-toast';
    toast.textContent = message;
    toast.style.cssText = `
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
      opacity: 0;
      animation: toastSlide 3s ease forwards;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// Initialize Mobile UI Components
document.addEventListener('DOMContentLoaded', () => {
  window.mobileUIComponents = new MobileUIComponents();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileUIComponents;
}
