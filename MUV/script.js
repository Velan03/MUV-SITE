// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS animation library
  AOS.init({
    once: true,
    duration: 800,
    offset: 100,
  })

  // Hide loading overlay after page loads
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("loading-overlay").classList.add("hidden")
    }, 1500)
  })


  let currentLanguage = "en";

  // Selectors
  const languageSelector = document.querySelector(".language-selector");
  const dropdown = document.querySelector(".language-dropdown");
  const languageOptions = document.querySelectorAll(".language-option");

  // Toggle dropdown on click
  languageSelector.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent event bubbling
    dropdown.classList.toggle("show");
  });

  // Handle language selection
  languageOptions.forEach((option) => {
    option.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent event bubbling

      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);

      // Update selected language display
      document.querySelector(".selected-language span").textContent = lang.toUpperCase();

      // Show toast notification
      showToast(`Language changed to ${getLanguageName(lang)}`);

      // Hide dropdown after selection
      dropdown.classList.remove("show");
    });
  });

  // Close dropdown if clicking outside
  document.addEventListener("click", () => {
    dropdown.classList.remove("show");
  });

  function getLanguageName(code) {
    const names = {
      en: "English",
      es: "Español",
      hi: "हिन्दी",
      ta: "தமிழ்",
      te: "తెలుగు",
    };
    return names[code] || code.toUpperCase();
  }




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
      showToast("Dark mode enabled")
    } else {
      body.classList.remove("dark-theme")
      localStorage.setItem("theme", "light")
      showToast("Light mode enabled")
    }
  })

  // Translation functionality
  function changeLanguage(lang) {
    if (!translations[lang]) {
      console.error(`Translation for ${lang} not available`)
      return
    }

    currentLanguage = lang
    localStorage.setItem("language", lang)

    // Update all elements with data-translate attribute
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate")
      const keys = key.split(".")
      let translation = translations[lang]

      // Navigate through nested objects
      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k]
        } else {
          translation = null
          break
        }
      }

      if (translation) {
        element.textContent = translation
      }
    })

    // Update placeholder attributes
    document.querySelectorAll("[data-translate-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-translate-placeholder")
      const keys = key.split(".")
      let translation = translations[lang]

      for (const k of keys) {
        if (translation && translation[k]) {
          translation = translation[k]
        } else {
          translation = null
          break
        }
      }

      if (translation) {
        element.placeholder = translation
      }
    })
  }

  // Load saved language preference
  const savedLanguage = localStorage.getItem("language") || "en"
  changeLanguage(savedLanguage)
  document.querySelector(".selected-language span").textContent = savedLanguage.toUpperCase()

  // Hero Section Rotation
  let currentHeroIndex = 0
  const heroSection = document.querySelector(".hero-section")
  const heroTitle = document.querySelector(".hero-title")
  const heroDescription = document.querySelector(".hero-description")
  const heroIndicators = document.querySelectorAll(".hero-indicator")

  function updateHero(index) {
    const hero = heroMovies[index]

    // Fade out
    heroSection.style.opacity = "0"

    setTimeout(() => {
      // Update content
      heroTitle.textContent = hero.title
      heroDescription.textContent = hero.description
      document.querySelector(".hero-info span:nth-child(2)").innerHTML =
        `<i class="far fa-calendar-alt me-1"></i>${hero.year}`
      document.querySelector(".hero-info span:nth-child(3)").innerHTML =
        `<i class="fas fa-film me-1"></i>${hero.rating}`
      document.querySelector(".hero-info span:nth-child(4)").innerHTML =
        `<i class="far fa-clock me-1"></i>${hero.duration}`

      // Update background
      heroSection.style.backgroundImage = `url('${hero.image}')`

      // Update indicators
      heroIndicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === index)
      })

      // Fade in
      heroSection.style.opacity = "1"
    }, 500)
  }

  // Auto rotate hero section every 8 seconds
  setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length
    updateHero(currentHeroIndex)
  }, 8000)

  // Click on hero indicators
  heroIndicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      currentHeroIndex = index
      updateHero(currentHeroIndex)
    })
  })

  // Initialize Swiper carousels
  const swiperOptions = {
    slidesPerView: "auto",
    spaceBetween: 20,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      576: {
        slidesPerView: 3,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 15,
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1200: {
        slidesPerView: 6,
        spaceBetween: 20,
      },
    },
  }

  // Create movie cards and populate swipers
  function createMovieCard(movie) {
    const slide = document.createElement("div")
    slide.className = "swiper-slide"
    slide.setAttribute("data-category", movie.genre.join(" "))
    slide.setAttribute("data-id", movie.id)

    let badgeHTML = ""
    if (movie.category === "new") {
      badgeHTML = `<span class="new-badge">New</span>`
    } else if (movie.match) {
      badgeHTML = `<span class="match-badge">${movie.match}% Match</span>`
    } else if (movie.category === "coming") {
      badgeHTML = `<span class="coming-badge">Coming Soon</span>`
    }

    slide.innerHTML = `
            <div class="movie-card">
                <div class="card-poster">
                    <img src="${movie.image}" alt="${movie.title}">
                    <div class="card-overlay">
                        <div class="card-buttons">
                            <button class="card-btn play-btn" data-id="${movie.id}"><i class="fas fa-play"></i></button>
                            <button class="card-btn ${movie.category === "mylist" ? "remove-btn" : "add-btn"}" data-id="${movie.id}">
                                <i class="fas ${movie.category === "mylist" ? "fa-minus" : "fa-plus"}</i>
                            </button>
                            <button class="card-btn info-btn" data-id="${movie.id}"><i class="fas fa-info-circle"></i></button>
                        </div>
                    </div>
                    ${badgeHTML}
                </div>
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.year}</span>
                        <span>${movie.rating}</span>
                    </div>
                    <p>${movie.description}</p>
                </div>
            </div>
        `

    return slide
  }

  // Populate swipers with movie data
  function populateSwipers() {
    const trendingSwiper = document.querySelector("#trending-swiper .swiper-wrapper")
    const tvSwiper = document.querySelector("#tv-swiper .swiper-wrapper")
    const newSwiper = document.querySelector("#new-swiper .swiper-wrapper")
    const mylistSwiper = document.querySelector("#mylist-swiper .swiper-wrapper")

    // Clear existing content
    trendingSwiper.innerHTML = ""
    tvSwiper.innerHTML = ""
    newSwiper.innerHTML = ""
    mylistSwiper.innerHTML = ""

    // Filter and populate
    moviesData
      .filter((movie) => movie.category === "trending")
      .forEach((movie) => {
        trendingSwiper.appendChild(createMovieCard(movie))
      })

    moviesData
      .filter((movie) => movie.category === "tv")
      .forEach((movie) => {
        tvSwiper.appendChild(createMovieCard(movie))
      })

    moviesData
      .filter((movie) => movie.category === "new")
      .forEach((movie) => {
        newSwiper.appendChild(createMovieCard(movie))
      })

    moviesData
      .filter((movie) => movie.category === "mylist")
      .forEach((movie) => {
        mylistSwiper.appendChild(createMovieCard(movie))
      })
  }

  // Initialize swipers after populating
  function initializeSwipers() {
    new Swiper("#trending-swiper", {
      ...swiperOptions,
      navigation: {
        nextEl: "#trending-next",
        prevEl: "#trending-prev",
      },
    })

    new Swiper("#tv-swiper", {
      ...swiperOptions,
      navigation: {
        nextEl: "#tv-next",
        prevEl: "#tv-prev",
      },
    })

    new Swiper("#new-swiper", {
      ...swiperOptions,
      navigation: {
        nextEl: "#new-next",
        prevEl: "#new-prev",
      },
    })

    new Swiper("#mylist-swiper", {
      ...swiperOptions,
      navigation: {
        nextEl: "#mylist-next",
        prevEl: "#mylist-prev",
      },
    })
  }

  // Populate and initialize swipers
  populateSwipers()
  initializeSwipers()

  // Category Filter Functionality
  const filterButtons = document.querySelectorAll(".filter-btn")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      const filter = this.getAttribute("data-filter")

      // Filter all movie cards
      document.querySelectorAll(".swiper-slide").forEach((card) => {
        if (filter === "all") {
          card.style.display = "block"
        } else {
          const categories = card.getAttribute("data-category").split(" ")
          if (categories.includes(filter)) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        }
      })
    })
  })

  // Movie Modal Functionality
  const movieModalElement = document.getElementById("movieModal")
  const movieModal = new bootstrap.Modal(movieModalElement)
  const modalTitle = document.querySelector(".modal-title")
  const modalPoster = document.querySelector(".modal-poster")
  const modalDescription = document.querySelector(".movie-description")
  const modalGenre = document.getElementById("modal-genre")
  const modalYear = document.querySelector(".year-info")
  const modalRating = document.querySelector(".rating-info")
  const modalDuration = document.querySelector(".duration-info")
  const modalMatch = document.querySelector(".match-badge")
  const modalListBtn = document.getElementById("modal-list-btn")
  const trailerBtn = document.getElementById("play-trailer")
  const trailerContainer = document.querySelector(".trailer-container")
  const trailerIframe = document.getElementById("trailer-iframe")

  // Handle movie info button clicks
  document.addEventListener("click", (e) => {
    if (e.target.closest(".info-btn") || e.target.closest(".btn-more-info")) {
      const id = e.target.closest(".info-btn")?.getAttribute("data-id") || heroMovies[currentHeroIndex].id

      // Find movie by ID
      const movie = moviesData.find((m) => m.id == id) || heroMovies.find((m) => m.id == id)

      if (movie) {
        // Update modal content
        modalTitle.textContent = movie.title
        modalPoster.src = movie.image
        modalPoster.alt = movie.title
        modalDescription.textContent = movie.description
        modalGenre.textContent = Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre
        modalYear.textContent = movie.year
        modalRating.textContent = movie.rating
        modalDuration.textContent = movie.duration

        if (movie.match) {
          modalMatch.textContent = `${movie.match}% Match`
          modalMatch.style.display = "inline-block"
        } else {
          modalMatch.style.display = "none"
        }

        // Update list button
        if (movie.category === "mylist") {
          modalListBtn.innerHTML = `<i class="fas fa-minus me-2"></i><span data-translate="modal.removeFromList">Remove from My List</span>`
        } else {
          modalListBtn.innerHTML = `<i class="fas fa-plus me-2"></i><span data-translate="modal.addToList">Add to My List</span>`
        }

        // Set trailer URL if available
        if (movie.trailer) {
          trailerBtn.style.display = "block"
          trailerIframe.src = "" // Reset iframe
        } else {
          trailerBtn.style.display = "none"
        }

        // Hide trailer container initially
        trailerContainer.classList.add("d-none")

        // Show modal
        movieModal.show()
      }
    }
  })

  // Play trailer button
  trailerBtn.addEventListener("click", () => {
    const id = modalTitle.textContent
    const movie = moviesData.find((m) => m.title === id)

    if (movie && movie.trailer) {
      trailerIframe.src = movie.trailer
      trailerContainer.classList.remove("d-none")
    }
  })

  // Reset trailer when modal is closed
  document.getElementById("movieModal").addEventListener("hidden.bs.modal", () => {
    trailerIframe.src = ""
    trailerContainer.classList.add("d-none")
  })

  // Add/Remove from My List functionality
  document.addEventListener("click", (e) => {
    if (e.target.closest(".add-btn") || e.target.closest(".remove-btn") || e.target.closest(".btn-add-list")) {
      const isRemove = e.target.closest(".remove-btn")
      const id = e.target.closest(".add-btn, .remove-btn")?.getAttribute("data-id") || heroMovies[currentHeroIndex].id

      // Find movie by ID
      const movie = moviesData.find((m) => m.id == id) || heroMovies.find((m) => m.id == id)

      if (movie) {
        if (isRemove) {
          // Remove from My List
          movie.category = movie.originalCategory || "trending"
          showToast("Removed from your list")
        } else {
          // Add to My List
          movie.originalCategory = movie.category
          movie.category = "mylist"
          showToast("Added to your list")
        }

        // Refresh swipers
        populateSwipers()
        initializeSwipers()
      }
    }
  })

  // Search Functionality
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");
  const searchResults = document.querySelector(".search-results");
  
  function performSearch() {
      const searchTerm = searchInput.value.trim().toLowerCase();
  
      // Clear previous results
      searchResults.innerHTML = "";
  
      // If search term is too short, hide results and return
      if (searchTerm.length < 2) {
          searchResults.classList.remove("show");
          return;
      }
  
      // Filter movies based on search term
      const results = moviesData.filter(
          (movie) =>
              movie.title.toLowerCase().includes(searchTerm) ||
              (movie.genre && movie.genre.some((g) => g.toLowerCase().includes(searchTerm)))
      );
  
      if (results.length === 0) {
          // Show "No results found" message
          searchResults.innerHTML = `<div class="p-3 text-center">No results found</div>`;
      } else {
          // Display results (limit to 5)
          results.slice(0, 5).forEach((movie) => {
              const resultItem = document.createElement("div");
              resultItem.className = "search-result-item";
              resultItem.setAttribute("data-id", movie.id);
  
              resultItem.innerHTML = `
                  <img src="${movie.image}" alt="${movie.title}">
                  <div class="search-result-info">
                      <h4>${movie.title}</h4>
                      <p>${movie.year} • ${movie.rating}</p>
                  </div>
              `;
  
              searchResults.appendChild(resultItem);
          });
      }
  
      // Show results container
      searchResults.classList.add("show");
  }
  
  // Event Listeners
  searchInput.addEventListener("input", performSearch);
  
  searchBtn.addEventListener("click", () => {
      performSearch();
  });
  
  searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
          performSearch();
      }
  });
  
  // Hide search results when clicking outside
  document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
          searchResults.classList.remove("show");
      }
  });
  
  // Handle search result clicks
  searchResults.addEventListener("click", (e) => {
      const resultItem = e.target.closest(".search-result-item");
      if (resultItem) {
          const id = resultItem.getAttribute("data-id");
          const movie = moviesData.find((m) => m.id == id);
  
          if (movie) {
              // Update modal content and show it
              modalTitle.textContent = movie.title;
              modalPoster.src = movie.image;
              modalPoster.alt = movie.title;
              modalDescription.textContent = movie.description;
              modalGenre.textContent = Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre;
              modalYear.textContent = movie.year;
              modalRating.textContent = movie.rating;
              modalDuration.textContent = movie.duration;
  
              if (movie.match) {
                  modalMatch.textContent = `${movie.match}% Match`;
                  modalMatch.style.display = "inline-block";
              } else {
                  modalMatch.style.display = "none";
              }
  
              // Update list button
              if (movie.category === "mylist") {
                  modalListBtn.innerHTML = `<i class="fas fa-minus me-2"></i><span data-translate="modal.removeFromList">Remove from My List</span>`;
              } else {
                  modalListBtn.innerHTML = `<i class="fas fa-plus me-2"></i><span data-translate="modal.addToList">Add to My List</span>`;
              }
  
              // Set trailer URL if available
              if (movie.trailer) {
                  trailerBtn.style.display = "block";
                  trailerIframe.src = ""; // Reset iframe
              } else {
                  trailerBtn.style.display = "none";
              }
  
              // Hide trailer container initially
              trailerContainer.classList.add("d-none");
  
              // Show modal
              movieModal.show();
  
              // Clear search
              searchInput.value = "";
              searchResults.classList.remove("show");
          }
      }
  });
  
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

  // Toast notification function
  function showToast(message, type = "info") {
    const toast = document.getElementById("toast")
    const toastBody = toast.querySelector(".toast-body")

    // Set message
    toastBody.textContent = message

    // Set toast type
    toast.className = "toast"
    switch (type) {
      case "success":
        toast.classList.add("bg-success", "text-white")
        break
      case "error":
        toast.classList.add("bg-danger", "text-white")
        break
      case "warning":
        toast.classList.add("bg-warning")
        break
      default:
        toast.classList.add("bg-info", "text-white")
    }

    // Show toast
    const bsToast = new bootstrap.Toast(toast)
    bsToast.show()
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const email = this.querySelector('input[type="email"]').value
      const consent = this.querySelector("#newsletter-consent").checked

      if (!consent) {
        showToast("Please agree to receive promotional emails", "warning")
        return
      }

      // In a real app, you would send this to your server
      console.log("Newsletter subscription:", { email, consent })

      // Show success message
      showToast("Thank you for subscribing!", "success")

      // Reset form
      this.reset()
    })
  }

  // Show welcome toast on first visit
  if (!localStorage.getItem("visited")) {
    setTimeout(() => {
      showToast("Welcome to MuvView!", "success")
      localStorage.setItem("visited", "true")
    }, 2000)
  }

  // Mock data for translations, heroMovies, moviesData, and Swiper
  const translations = {
    en: {
      modal: {
        removeFromList: "Remove from My List",
        addToList: "Add to My List",
      },
    },
    es: {
      modal: {
        removeFromList: "Eliminar de mi lista",
        addToList: "Añadir a mi lista",
      },
    },
  }

  const heroMovies = [
    {
      id: 1,
      title: "Hero Movie 1",
      description: "Description for Hero Movie 1",
      year: 2023,
      rating: "8.5",
      duration: "2h 30m",
      image: "https://via.placeholder.com/1920x1080",
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
    {
      id: 2,
      title: "Hero Movie 2",
      description: "Description for Hero Movie 2",
      year: 2024,
      rating: "9.0",
      duration: "2h 15m",
      image: "https://via.placeholder.com/1920x1080",
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
  ]

  const moviesData = [
    {
      id: 101,
      title: "Trending Movie 1",
      description: "Description for Trending Movie 1",
      year: 2022,
      rating: "7.8",
      duration: "1h 45m",
      image: "https://via.placeholder.com/300x450",
      category: "trending",
      genre: ["Action", "Adventure"],
      match: 92,
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
    {
      id: 102,
      title: "TV Show 1",
      description: "Description for TV Show 1",
      year: 2023,
      rating: "8.2",
      duration: "45m",
      image: "https://via.placeholder.com/300x450",
      category: "tv",
      genre: ["Drama", "Mystery"],
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
    {
      id: 103,
      title: "New Movie 1",
      description: "Description for New Movie 1",
      year: 2024,
      rating: "8.9",
      duration: "2h 0m",
      image: "https://via.placeholder.com/300x450",
      category: "new",
      genre: ["Sci-Fi", "Thriller"],
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
    {
      id: 104,
      title: "My List Movie 1",
      description: "Description for My List Movie 1",
      year: 2021,
      rating: "7.5",
      duration: "1h 30m",
      image: "https://via.placeholder.com/300x450",
      category: "mylist",
      genre: ["Comedy", "Romance"],
      trailer: "https://www.youtube.com/embed/VIDEO_ID",
    },
  ]

  const Swiper = window.Swiper
})

