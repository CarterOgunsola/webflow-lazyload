// Enhanced Video Lazy Loading Script for Webflow
// Incorporates Google Developers best practices + existing functionality

(function () {
  "use strict";

  // Configuration
  const MARGIN = "50px";

  // Create intersection observer for automatic lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          loadVideo(element);
          observer.unobserve(element);
        }
      });
    },
    {
      rootMargin: MARGIN,
      threshold: 0.1,
    }
  );

  // Function to load video based on type
  function loadVideo(element) {
    // Handle HTML5 video elements
    if (element.tagName === "VIDEO") {
      // Handle data-src on the video element itself
      if (element.dataset.src) {
        element.src = element.dataset.src;
        element.removeAttribute("data-src");
      }

      // Handle source elements with data-src (Google's recommended approach)
      const sources = element.querySelectorAll("source[data-src]");
      sources.forEach((source) => {
        source.src = source.dataset.src;
        source.removeAttribute("data-src");
      });

      // Load the video and remove lazy class
      element.load();
      element.classList.remove("lazy");
      element.dataset.loaded = "true";

      // Add hover-to-preload metadata for better UX (Google's suggestion)
      if (
        !element.hasAttribute("onmouseenter") &&
        element.getAttribute("preload") === "none"
      ) {
        element.addEventListener("mouseenter", function () {
          if (this.getAttribute("preload") === "none") {
            this.setAttribute("preload", "metadata");
          }
        });
      }
    } else if (element.tagName === "IFRAME") {
      // Handle embedded videos (YouTube, Vimeo, etc.)
      if (element.dataset.src || element.dataset.lazySrc) {
        element.src = element.dataset.src || element.dataset.lazySrc;
        element.removeAttribute("data-src");
        element.removeAttribute("data-lazy-src");
      }
    }

    // Add loaded class for styling
    element.classList.add("lazy-loaded");
    element.dataset.loaded = "true";

    console.log("Video lazy loaded:", element);
  }

  // Setup click-to-load for Vimeo players
  function setupVimeoClickToLoad() {
    const vimeoPlayers = document.querySelectorAll(
      '.vimeo-player:not([data-vimeo-loaded="true"])'
    );

    vimeoPlayers.forEach((player) => {
      const iframe = player.querySelector(".vimeo-player__iframe");
      const playButton = player.querySelector('[data-vimeo-control="play"]');

      if (iframe && playButton) {
        // Store original src and clear it
        if (iframe.src && !iframe.dataset.lazySrc) {
          iframe.dataset.lazySrc = iframe.src;
          iframe.removeAttribute("src");
        }

        // Load video when play button is clicked
        playButton.addEventListener("click", function () {
          if (!iframe.src && iframe.dataset.lazySrc) {
            iframe.src = iframe.dataset.lazySrc;
            player.dataset.vimeoLoaded = "true";
            console.log("Vimeo video loaded on click:", iframe);
          }
        });
      }
    });
  }

  // Auto-setup function that converts existing videos to lazy loading
  function autoSetupExistingVideos() {
    // Handle regular video and iframe elements
    const existingVideos = document.querySelectorAll(
      "video[src], iframe[src], video:not([data-src]):not(.lazy)"
    );

    existingVideos.forEach((video) => {
      // Skip if already setup for lazy loading
      if (
        video.dataset.src ||
        video.dataset.lazySrc ||
        video.classList.contains("lazy-video") ||
        video.dataset.loaded
      ) {
        return;
      }

      // Skip Vimeo players with specific class (handled separately)
      if (video.closest(".vimeo-player")) {
        return;
      }

      if (video.tagName === "VIDEO") {
        // Apply Google's best practices for video elements

        // Set preload="none" if not already set (saves bandwidth)
        if (!video.hasAttribute("preload")) {
          video.setAttribute("preload", "none");
        }

        // If it's an autoplay video (GIF replacement), handle differently
        if (video.hasAttribute("autoplay")) {
          // For autoplay videos, move sources to data-src
          const sources = video.querySelectorAll("source[src]");
          if (sources.length > 0) {
            sources.forEach((source) => {
              source.dataset.src = source.src;
              source.removeAttribute("src");
            });
            video.classList.add("lazy");
          }
        } else {
          // For regular videos, just ensure preload="none" and add hover enhancement
          video.addEventListener("mouseenter", function () {
            if (this.getAttribute("preload") === "none") {
              this.setAttribute("preload", "metadata");
            }
          });
          // Don't lazy load these since preload="none" already handles it
          return;
        }
      } else if (video.tagName === "IFRAME") {
        // Handle iframe embeds
        if (video.src) {
          video.dataset.src = video.src;
          video.removeAttribute("src");
        }
      }

      // Add lazy loading class and observe
      video.classList.add("lazy-video");
      observer.observe(video);
    });
  }

  // Setup lazy loading for elements that already have data-src or lazy class
  function setupExistingLazyVideos() {
    // Find videos already setup with data-src, lazy class, or specific classes
    const lazyVideos = document.querySelectorAll(
      [
        "video.lazy:not([data-loaded])",
        "video[data-src]:not([data-loaded])",
        "iframe[data-src]:not([data-loaded])",
        ".g_visual_video:not([data-loaded])",
      ].join(", ")
    );

    lazyVideos.forEach((video) => {
      if (!video.classList.contains("lazy-video")) {
        video.classList.add("lazy-video");
      }
      observer.observe(video);
    });

    console.log(
      `Set up lazy loading for ${lazyVideos.length} pre-configured lazy videos`
    );
  }

  // Preload poster images for LCP optimization (Google's recommendation)
  function preloadCriticalPosters() {
    const aboveFoldVideos = document.querySelectorAll("video[poster]");
    aboveFoldVideos.forEach((video, index) => {
      // Only preload the first few poster images (likely above the fold)
      if (index < 2 && video.poster) {
        const rect = video.getBoundingClientRect();
        // If video is likely above the fold
        if (rect.top < window.innerHeight) {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = video.poster;
          link.as = "image";
          if (index === 0) {
            link.setAttribute("fetchpriority", "high");
          }
          document.head.appendChild(link);
          console.log("Preloaded critical poster:", video.poster);
        }
      }
    });
  }

  // Initialize everything
  function init() {
    console.log(
      "Initializing enhanced video lazy loading with Google best practices..."
    );

    // Preload critical poster images first
    preloadCriticalPosters();

    // Setup different types of lazy loading
    autoSetupExistingVideos();
    setupExistingLazyVideos();
    setupVimeoClickToLoad();

    const totalVideos = document.querySelectorAll("video, iframe").length;
    const lazyVideos = document.querySelectorAll(".lazy-video, .lazy").length;
    console.log(
      `Enhanced lazy loading initialized - ${lazyVideos} lazy videos out of ${totalVideos} total`
    );
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
