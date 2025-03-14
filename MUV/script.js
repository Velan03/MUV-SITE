// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
    // Theme Switcher
    const themeToggle = document.getElementById("checkbox")
    const body = document.body
  
    // Check for saved theme preference or use preferred color scheme
    const currentTheme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  
    // Apply saved theme on page load
    if (currentTheme === "dark") {
      body.classList.add("dark-theme")
      themeToggle.checked = true
    } else {
      body.classList.remove("dark-theme")
      themeToggle.checked = false
    }
  
    // Toggle theme when switch is clicked
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        body.classList.add("dark-theme")
        localStorage.setItem("theme", "dark")
      } else {
        body.classList.remove("dark-theme")
        localStorage.setItem("theme", "light")
      }
    })
  
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        const targetElement = document.querySelector(targetId)
  
        if (targetElement) {
          // Add active class to clicked nav link
          document.querySelectorAll(".nav-link").forEach((link) => {
            link.classList.remove("active")
          })
          this.classList.add("active")
  
          // Smooth scroll to target
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        }
      })
    })
  
    // Back to Top Button
    const backToTopButton = document.getElementById("back-to-top")
  
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("show")
      } else {
        backToTopButton.classList.remove("show")
      }
    })
  
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  
    // Carousel Navigation
    const carousels = [
      { id: "trending-carousel", prevBtn: "trending-prev", nextBtn: "trending-next" },
      { id: "tv-carousel", prevBtn: "tv-prev", nextBtn: "tv-next" },
      { id: "new-carousel", prevBtn: "new-prev", nextBtn: "new-next" },
      { id: "mylist-carousel", prevBtn: "mylist-prev", nextBtn: "mylist-next" },
    ]
  
    carousels.forEach((carousel) => {
      const carouselElement = document.getElementById(carousel.id)
      const prevButton = document.getElementById(carousel.prevBtn)
      const nextButton = document.getElementById(carousel.nextBtn)
  
      if (carouselElement && prevButton && nextButton) {
        // Calculate scroll distance (width of one movie card + gap)
        const scrollDistance = 290 // 270px card width + 20px gap
  
        prevButton.addEventListener("click", () => {
          carouselElement.scrollBy({
            left: -scrollDistance,
            behavior: "smooth",
          })
        })
  
        nextButton.addEventListener("click", () => {
          carouselElement.scrollBy({
            left: scrollDistance,
            behavior: "smooth",
          })
        })
      }
    })
  
    // Navbar Scroll Effect
    const navbar = document.querySelector(".navbar")
  
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.style.padding = "10px 0"
        navbar.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)"
      } else {
        navbar.style.padding = "15px 0"
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
      }
    })
  
    // Add fade-in animation to sections
    const sections = document.querySelectorAll(".movie-section")
  
    // Create Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )
  
    // Observe each section
    sections.forEach((section) => {
      observer.observe(section)
    })
  
    // Add pulse animation to play button
    const playButton = document.querySelector(".btn-play")
    if (playButton) {
      playButton.classList.add("pulse")
    }
  
    // Movie Card Hover Effect
    const movieCards = document.querySelectorAll(".movie-card")
  
    movieCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        // Bring hovered card to front
        movieCards.forEach((c) => {
          c.style.zIndex = 1
        })
        this.style.zIndex = 10
      })
    })
  
    // Search Functionality
    const searchInput = document.querySelector(".search-input")
    const searchBtn = document.querySelector(".search-btn")
  
    searchBtn.addEventListener("click", () => {
      performSearch()
    })
  
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        performSearch()
      }
    })
  
    function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase()
      if (searchTerm) {
        // In a real application, this would search the database
        // For demo purposes, we'll just alert the search term
        alert(`Searching for: ${searchTerm}`)
        searchInput.value = ""
      }
    }
  
    // Simulate loading of hero background image
    const heroSection = document.querySelector(".hero-section")
    if (heroSection) {
      // Replace placeholder with actual image (in a real app, this would be dynamic)
      heroSection.style.backgroundImage = 'url("https://via.placeholder.com/1920x1080")'
  
      // Add loading animation
      heroSection.classList.add("fade-in")
    }
  })
  
  