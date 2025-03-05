"use strict";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading overlay once page is loaded
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
    setTimeout(() => loadingOverlay.style.display = 'none', 500); // After transition completes
  }

  // element toggle function - more efficient implementation
  const elementToggleFunc = function (elem) {
    if (!elem) return;
    elem.classList.toggle("active");
  };

  // sidebar variables
  const sidebar = document.querySelector("[data-sidebar]");
  const sidebarBtn = document.querySelector("[data-sidebar-btn]");

  // sidebar toggle functionality for mobile
  if (sidebarBtn && sidebar) {
    sidebarBtn.addEventListener("click", function () {
      elementToggleFunc(sidebar);
    });
  }

  // testimonials variables
  const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
  const modalContainer = document.querySelector("[data-modal-container]");
  const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
  const overlay = document.querySelector("[data-overlay]");

  // modal variable
  const modalImg = document.querySelector("[data-modal-img]");
  const modalTitle = document.querySelector("[data-modal-title]");
  const modalText = document.querySelector("[data-modal-text]");

  // modal toggle function
  const testimonialsModalFunc = function () {
    if (modalContainer && overlay) {
      modalContainer.classList.toggle("active");
      overlay.classList.toggle("active");
    }
  };

  // add click event to all modal items
  if (testimonialsItem && testimonialsItem.length > 0) {
    testimonialsItem.forEach(item => {
      item.addEventListener("click", function () {
        const avatar = this.querySelector("[data-testimonials-avatar]");
        const title = this.querySelector("[data-testimonials-title]");
        const text = this.querySelector("[data-testimonials-text]");
        
        if (modalImg && avatar) modalImg.src = avatar.src;
        if (modalImg && avatar) modalImg.alt = avatar.alt;
        if (modalTitle && title) modalTitle.innerHTML = title.innerHTML;
        if (modalText && text) modalText.innerHTML = text.innerHTML;

        testimonialsModalFunc();
      });
    });
  }

  // add click event to modal close button
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

  // custom select variables
  const select = document.querySelector("[data-select]");
  const selectItems = document.querySelectorAll("[data-select-item]");
  const selectDetailItems = document.querySelectorAll("[data-detail-category]");
  const selectValue = document.querySelector("[data-select-value]");
  const filterBtn = document.querySelectorAll("[data-filter-btn]");
  const removeActive = document.querySelectorAll("[data-deactive-item]");
  const projectDetail = document.querySelectorAll("[project-detail]");
  const buttonBack = document.getElementById("portfolio-back-button");

  // improved detail category click handler with smoother scrolling
  if (selectDetailItems && selectDetailItems.length > 0) {
    selectDetailItems.forEach(item => {
      item.addEventListener("click", function () {
        const selectedType = this.dataset.detailCategory;
        filterFunc("");
        
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        // find data-detail-category same type in projectDetail class
        if (projectDetail && projectDetail.length > 0) {
          projectDetail.forEach(project => {
            if (project.dataset.detailCategory === selectedType) {
              project.classList.add("active");
              if (buttonBack) buttonBack.classList.remove("disabled-btn");
            } else {
              project.classList.remove("active");
            }
          });
        }
      });
    });
  }

  // Back button functionality with smooth scrolling
  if (buttonBack) {
    buttonBack.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      filterFunc("all");
      buttonBack.classList.add("disabled-btn");
    });
  }

  let clickEventAdded = false;

  if (select) {
    select.addEventListener("click", function () {
      elementToggleFunc(this);
      clickEventAdded = true;
    });
  }

  // add event in all select items
  if (selectItems && selectItems.length > 0) {
    selectItems.forEach((item, i) => {
      item.addEventListener("click", function () {
        if (!clickEventAdded) {
          elementToggleFunc(select);
        }
        
        let selectedValue = this.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText;
        if (select) elementToggleFunc(select);
        
        filterFunc(selectedValue);
        clickEventAdded = false;
      });
    });
  }

  // filter variables
  const filterItems = document.querySelectorAll("[data-filter-item]");

  const filterFunc = function (selectedValue) {
    if (filterItems && filterItems.length > 0) {
      filterItems.forEach(item => {
        if (selectedValue === "all") {
          item.classList.add("active");
        } else if (selectedValue === item.dataset.category) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }

    if (removeActive && removeActive.length > 0) {
      removeActive.forEach(item => {
        item.classList.remove("active");
      });
    }
  };

  // add event in all filter button items for large screen
  let lastClickedBtn = filterBtn && filterBtn.length > 0 ? filterBtn[0] : null;

  if (filterBtn && filterBtn.length > 0) {
    filterBtn.forEach(btn => {
      btn.addEventListener("click", function () {
        let selectedValue = this.innerText.toLowerCase();
        if (selectValue) selectValue.innerText = this.innerText;
        
        filterFunc(selectedValue);

        if (lastClickedBtn) lastClickedBtn.classList.remove("active");
        this.classList.add("active");
        lastClickedBtn = this;
      });
    });
  }

  // contact form variables
  const form = document.querySelector("[data-form]");
  const formInputs = document.querySelectorAll("[data-form-input]");
  const formBtn = document.querySelector("[data-form-btn]");

  // add event to all form input field
  if (formInputs && formInputs.length > 0 && form) {
    formInputs.forEach(input => {
      input.addEventListener("input", function () {
        // check form validation
        if (form.checkValidity()) {
          if (formBtn) formBtn.removeAttribute("disabled");
        } else {
          if (formBtn) formBtn.setAttribute("disabled", "");
        }
      });
    });
  }

  // page navigation variables
  const navigationLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");

  // add event to all nav link with smooth transitions
  if (navigationLinks && navigationLinks.length > 0 && pages) {
    navigationLinks.forEach((link, i) => {
      link.addEventListener("click", function () {
        filterFunc("all");
        if (selectValue) selectValue.innerText = "All";
        
        const targetPage = this.innerHTML.toLowerCase();
        
        pages.forEach((page, j) => {
          if (targetPage === page.dataset.page) {
            page.classList.add("active");
            navigationLinks[j].classList.add("active");
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          } else {
            page.classList.remove("active");
            navigationLinks[j].classList.remove("active");
          }
        });
      });
    });
  }

  // Improved image expansion function with better overlay
  window.expandImage = function(clickedImage) {
    if (!clickedImage || !clickedImage.querySelector("img")) return;
    
    const imgSrc = clickedImage.querySelector("img").src;
    const expandedImg = document.createElement("img");
    const overlay = createOverlay(expandedImg);

    // Create expanded image with improved styling
    expandedImg.src = imgSrc;
    expandedImg.style.maxHeight = "90%";
    expandedImg.style.maxWidth = "90%";
    expandedImg.style.objectFit = "contain";
    expandedImg.style.position = "fixed";
    expandedImg.style.top = "50%";
    expandedImg.style.left = "50%";
    expandedImg.style.transform = "translate(-50%, -50%)";
    expandedImg.style.zIndex = "9999";
    expandedImg.style.backgroundColor = "#fff0";
    expandedImg.style.borderRadius = "10px";
    expandedImg.style.cursor = "pointer";
    expandedImg.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";
    expandedImg.style.transition = "transform 0.3s ease";
    
    expandedImg.onclick = function () {
      document.body.removeChild(overlay);
      document.body.removeChild(expandedImg);
    };
    
    document.body.appendChild(expandedImg);
  }

  // Re-implement expandVideo with proper error checking
  window.expandVideo = function(clickedVideo) {
    if (!clickedVideo || !clickedVideo.querySelector("video") || 
        !clickedVideo.querySelector("video").querySelector("source")) return;
        
    const videoFiled = clickedVideo.querySelector("video");
    const videoSrc = videoFiled.querySelector("source").src;
    const expandedVideo = document.createElement("video");

    const overlay = createOverlay(expandedVideo);

    // Create expanded video
    expandedVideo.src = videoSrc;
    expandedVideo.currentTime = 0;
    expandedVideo.autoplay = true;
    expandedVideo.controls = true;
    expandedVideo.style.width = "100%";
    expandedVideo.style.height = "100%";
    expandedVideo.style.zIndex = "9999";
    expandedVideo.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    expandedVideo.style.position = "fixed";
    expandedVideo.style.top = "50%";
    expandedVideo.style.left = "50%";
    expandedVideo.style.transform = "translate(-50%, -50%)";
    expandedVideo.style.borderRadius = "10px";
    expandedVideo.style.cursor = "pointer";

    expandedVideo.onclick = function () {
      if (videoFiled) {
        videoFiled.currentTime = 0;
        videoFiled.pause();
      }
      document.body.removeChild(overlay);
      document.body.removeChild(expandedVideo);
    };
    
    document.body.appendChild(expandedVideo);
  };

  // Skills button handler
  const skillsButton = document.getElementById("skills-button");
  if (skillsButton && pages) {
    skillsButton.addEventListener("click", function () {
      const skillsSection = document.getElementById("skills");
      
      pages.forEach((page, i) => {
        if (page.dataset.page === "resume") {
          page.classList.add("active");
          if (navigationLinks && navigationLinks[i]) navigationLinks[i].classList.add("active");
          
          if (skillsSection) {
            setTimeout(() => {
              skillsSection.scrollIntoView({
                behavior: 'smooth'
              });
            }, 100);
          }
        } else {
          page.classList.remove("active");
          if (navigationLinks && navigationLinks[i]) navigationLinks[i].classList.remove("active");
        }
      });
    });
  }

  // Old version button handler
  const backToOldVersion = document.getElementById("old-version-button");
  if (backToOldVersion) {
    backToOldVersion.addEventListener("click", function () {
      window.location.href = "../v1.0";
    });
  }
});

// Helper function to create overlay
function createOverlay(elementToRemove) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  overlay.style.zIndex = "9998";
  overlay.style.transition = "opacity 0.3s ease";
  
  overlay.onclick = function () {
    overlay.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      if (document.body.contains(elementToRemove)) {
        document.body.removeChild(elementToRemove);
      }
    }, 300);
  };
  
  document.body.appendChild(overlay);
  
  // Force reflow to enable transition
  void overlay.offsetWidth;
  overlay.style.opacity = "1";
  
  return overlay;
}