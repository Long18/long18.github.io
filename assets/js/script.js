"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

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
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectProject = document.querySelector("[project-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectDetailItems = document.querySelectorAll("[data-detail-category]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const removeActive = document.querySelectorAll("[data-deactive-item]");
const projectDetail = document.querySelectorAll("[project-detail]");
const buttonBack = document.getElementById("portfolio-back-button");

// if data-detail-category clicked, remove active at data-deactive-item contain data-select-item same type
for (let i = 0; i < selectDetailItems.length; i++) {
  selectDetailItems[i].addEventListener("click", function () {
    const selectedType = this.dataset.detailCategory;
    filterFunc("");

    // find data-detail-category same type in projectDetail class
    for (let j = 0; j < projectDetail.length; j++) {
      if (projectDetail[j].dataset.detailCategory === selectedType) {
        projectDetail[j].classList.add("active");
        buttonBack.classList.remove("disabled-btn");
      } else {
        projectDetail[j].classList.remove("active");
      }
    }

  });
}

buttonBack.addEventListener("click", function () {
  window.scrollTo(0, 0);
  filterFunc("all");
  buttonBack.classList.add("disabled-btn");
})

let clickEventAdded = false;

select.addEventListener("click", function () {
  elementToggleFunc(this);
  clickEventAdded = true;
  if (!clickEventAdded) {
    elementToggleFunc(select);
  }
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    if (!clickEventAdded) {
      elementToggleFunc(select);
    }
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
    clickEventAdded = false;
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");
const filterDetailItems = document.querySelectorAll("[data-detail-category]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else
    if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
  for (let i = 0; i < removeActive.length; i++) {
    removeActive[i].classList.remove("active");
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    filterFunc("all");
    selectValue.innerText = "All";
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

function createOverlay(elementToRemove) {
  var overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  overlay.style.zIndex = "9998";
  overlay.onclick = function () {
    document.body.removeChild(overlay);
    document.body.removeChild(elementToRemove);
  };
  document.body.appendChild(overlay);
  document.body.appendChild(overlay);

  return overlay;
}

function expandImage(clickedImage) {
  var imgSrc = clickedImage.querySelector("img").src;
  var expandedImg = document.createElement("img");

  var overlay = createOverlay(expandedImg);

  // Create expanded image
  expandedImg.src = imgSrc;
  expandedImg.style.height = "100%";
  expandedImg.style.position = "fixed";
  expandedImg.style.top = "50%";
  expandedImg.style.left = "50%";
  expandedImg.style.transform = "translate(-50%, -50%)";
  expandedImg.style.zIndex = "9999";
  expandedImg.style.backgroundColor = "#fff";
  expandedImg.style.borderRadius = "10px";
  expandedImg.style.cursor = "pointer";
  expandedImg.onclick = function () {
    document.body.removeChild(overlay);
    document.body.removeChild(expandedImg);
  };
  document.body.appendChild(expandedImg);
}


function expandVideo(clickedVideo) {
  var videoFiled = clickedVideo.querySelector("video");
  var videoSrc = videoFiled.querySelector("source").src;
  var expandedVideo = document.createElement("video");

  var overlay = createOverlay(expandedVideo);

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
    videoFiled.currentTime = 0;
    videoFiled.pause();
    document.body.removeChild(overlay);
    document.body.removeChild(expandedVideo);
  };
  overlay.appendChild(expandedVideo);
}

var skillsButton = document.getElementById("skills-button");
// when user click, active pages = "resume"
skillsButton.addEventListener("click", function () {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].dataset.page === "resume") {
      pages[i].classList.add("active");
      navigationLinks[i].classList.add("active");
      window.scrollTo(0, document.getElementById("skills").offsetTop);
    } else {
      pages[i].classList.remove("active");
      navigationLinks[i].classList.remove("active");
    }
  }
})

var backToOldVersion = document.getElementById("old-version-button");
backToOldVersion.addEventListener("click", function () {
  window.location.href = "../v1.0";
})