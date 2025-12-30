'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
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
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
if (testimonialsItem.length > 0 && modalImg && modalTitle && modalText) {
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }
}

// add click event to modal close button
if (modalCloseBtn && modalContainer && overlay) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
if (selectItems.length > 0 && selectValue && select) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {

      const selectedValue = this.innerText.toLowerCase().trim();
      selectValue.innerText = this.innerText.trim();
      elementToggleFunc(select);
      
      // Use requestAnimationFrame for smooth filtering
      requestAnimationFrame(() => {
        filterFunc(selectedValue);
      });

    });
  }
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  // Use requestAnimationFrame for smoother performance
  requestAnimationFrame(() => {
    for (let i = 0; i < filterItems.length; i++) {
      if (selectedValue === "all") {
        filterItems[i].classList.add("active");
      } else if (selectedValue === filterItems[i].dataset.category) {
        filterItems[i].classList.add("active");
      } else {
        filterItems[i].classList.remove("active");
      }
    }
  });
}

// add event in all filter button items for large screen
if (filterBtn.length > 0 && selectValue) {
  let lastClickedBtn = filterBtn[0];

  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {
      // Debounce filter function for better performance
      const selectedValue = this.innerText.toLowerCase().trim();
      if (selectValue) {
        selectValue.innerText = this.innerText.trim();
      }
      
      // Use requestAnimationFrame for smooth filtering
      requestAnimationFrame(() => {
        filterFunc(selectedValue);
      });

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (formInputs.length > 0 && form && formBtn) {
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
}



// page navigation function
const initPageNavigation = function() {
  // page navigation variables
  const pageNavLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("[data-page]");
  
  if (pageNavLinks.length === 0 || pages.length === 0) {
    console.warn("Navigation elements not found");
    return;
  }
  
  // page navigation event
  pageNavLinks.forEach(link => {
    link.addEventListener("click", function () {
      
      // Get target page from data attribute or text content
      let targetPage = this.getAttribute("data-page-target");
      if (!targetPage) {
        // Use textContent instead of innerHTML to avoid whitespace issues
        targetPage = this.textContent.trim().toLowerCase();
      }
      
      // Remove active class from all pages and links
      pages.forEach(page => {
        page.classList.remove("active");
      });
      pageNavLinks.forEach(navLink => {
        navLink.classList.remove("active");
      });
      
      // Add active class to target page and clicked link
      pages.forEach(page => {
        if (targetPage === page.dataset.page) {
          page.classList.add("active");
          link.classList.add("active");
          window.scrollTo(0, 0);
          
          // Trigger skill progress bar animation when resume page is opened
          // Skills are now tabbed chips (no progress-bar animation)
        }
      });
      
    });
  });
};

// Initialize navigation - handle both cases (DOM ready or already loaded)
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initPageNavigation);
} else {
  // DOM is already loaded
  initPageNavigation();
}



const supportsIntersectionObserver =
  typeof window !== "undefined" && "IntersectionObserver" in window;

// Update total experience in About page stats
const updateAboutStats = function() {
  const totalExpStat = document.getElementById("total-exp-stat");
  if (!totalExpStat) return;
  
  // Calculate total experience (same logic as resume)
  const experienceItems = document.querySelectorAll(".timeline-item[data-exp-start]");
  let totalMonths = 0;
  const currentDate = new Date();
  
  experienceItems.forEach(item => {
    const startStr = item.getAttribute("data-exp-start");
    const endStr = item.getAttribute("data-exp-end");
    
    if (!startStr) return;
    
    const [startYear, startMonth] = startStr.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, 1);
    
    let endDate;
    if (endStr === "present") {
      endDate = currentDate;
    } else {
      const [endYear, endMonth] = endStr.split("-").map(Number);
      endDate = new Date(endYear, endMonth, 0);
    }
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    months += 1;
    
    totalMonths += months;
  });
  
  const years = Math.floor(totalMonths / 12);
  totalExpStat.textContent = years > 0 ? `${years}+` : `${totalMonths}+`;
};

// Smooth scroll animations on page load
const initScrollAnimations = function() {
  if (!supportsIntersectionObserver) {
    // Fallback: ensure content is visible (no observer animations)
    const sections = document.querySelectorAll(".timeline, .skills-section, .achievements-section, .service, .quick-stats, .about-text");
    sections.forEach(section => {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
      section.style.transition = "";
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe sections for fade-in animation
  const sections = document.querySelectorAll(".timeline, .skills-section, .achievements-section, .service, .quick-stats, .about-text");
  sections.forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(section);
  });
  
  // Animate stat cards with stagger
  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.9)";
    card.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    
    const cardObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
          cardObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    cardObserver.observe(card);
  });
};

// Calculate dynamic experience duration for "Present" positions
const calculateExperienceDuration = function() {
  const durationBadges = document.querySelectorAll(".timeline-duration-badge[data-start-date], .duration-tag[data-start-date]");
  
  durationBadges.forEach(badge => {
    const startDateStr = badge.getAttribute("data-start-date");
    if (!startDateStr) return;
    
    // Parse start date (format: "YYYY-MM")
    const [year, month] = startDateStr.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1); // Month is 0-indexed
    const currentDate = new Date();
    
    // Calculate difference
    let years = currentDate.getFullYear() - startDate.getFullYear();
    let months = currentDate.getMonth() - startDate.getMonth();
    
    // Adjust if current month is before start month
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Format duration text
    let durationText = "";
    if (years > 0) {
      durationText = years === 1 ? "1 year" : `${years} years`;
      if (months > 0) {
        durationText += ` ${months} month${months > 1 ? "s" : ""}`;
      }
    } else {
      durationText = months === 1 ? "1 month" : `${months} months`;
    }
    
    // Update badge text
    badge.textContent = durationText;
  });
};

// Calculate total experience across all positions
const calculateTotalExperience = function() {
  const experienceItems = document.querySelectorAll(".timeline-item[data-exp-start]");
  const totalBadge = document.getElementById("total-experience");
  
  if (!totalBadge || experienceItems.length === 0) return;
  
  let totalMonths = 0;
  const currentDate = new Date();
  
  experienceItems.forEach(item => {
    const startStr = item.getAttribute("data-exp-start");
    const endStr = item.getAttribute("data-exp-end");
    
    if (!startStr) return;
    
    // Parse start date
    const [startYear, startMonth] = startStr.split("-").map(Number);
    const startDate = new Date(startYear, startMonth - 1, 1);
    
    // Parse end date
    let endDate;
    if (endStr === "present") {
      endDate = currentDate;
    } else {
      const [endYear, endMonth] = endStr.split("-").map(Number);
      endDate = new Date(endYear, endMonth, 0); // Last day of the month
    }
    
    // Calculate months between dates
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months += endDate.getMonth() - startDate.getMonth();
    
    // Add 1 to include both start and end months
    months += 1;
    
    totalMonths += months;
  });
  
  // Convert total months to years and months
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  // Format total experience text
  let totalText = "Total: ";
  if (years > 0) {
    totalText += years === 1 ? "1 year" : `${years} years`;
    if (months > 0) {
      totalText += ` ${months} month${months > 1 ? "s" : ""}`;
    }
  } else {
    totalText += months === 1 ? "1 month" : `${months} months`;
  }
  
  totalBadge.textContent = totalText;
};

// Update experience duration periodically (every day)
const initExperienceDuration = function() {
  calculateExperienceDuration();
  calculateTotalExperience();
  // Update once per day (86400000 ms)
  setInterval(() => {
    calculateExperienceDuration();
    calculateTotalExperience();
  }, 86400000);
};

// Observe all skill categories when page loads
document.addEventListener("DOMContentLoaded", function() {
  // Defer non-critical initializations for better performance
  requestAnimationFrame(() => {
    // Skill progress-bar animation removed (skills are now tabbed chips)

    // Initialize scroll animations (defer for better initial load)
    setTimeout(() => {
      try {
        initScrollAnimations();
      } catch (e) {
        console.error("Scroll animations init failed", e);
      }
    }, 100);

    // Initialize dynamic experience calculation
    try {
      initExperienceDuration();
    } catch (e) {
      console.error("Experience duration init failed", e);
    }

    // Update About page stats
    try {
      updateAboutStats();
      setInterval(() => {
        updateAboutStats();
      }, 86400000);
    } catch (e) {
      console.error("About stats init failed", e);
    }
  });
});



// Accordion removed (resume sections are now always-visible)