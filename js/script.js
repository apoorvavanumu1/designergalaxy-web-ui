// =========================================================
// DESIGNER GALAXY WEBSITE — JS
// Preloader, custom cursor, scroll progress, staggered reveal,
// typing effect, tilt cards, magnetic buttons, counters,
// portfolio filter, brand toggle nav, back-to-top, contact form
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Preloader ----------
     `load` waits on every remote image, so on a slow or offline connection the
     page would sit behind the dark veil. The timeout is a hard ceiling. */
  const preloader = document.getElementById("preloader");
  let preloaderDone = false;

  function hidePreloader() {
    if (preloaderDone || !preloader) return;
    preloaderDone = true;
    preloader.classList.add("loaded");
  }

  window.addEventListener("load", () => setTimeout(hidePreloader, 300));
  setTimeout(hidePreloader, 2500);

  /* ---------- Navigation ----------
     Same markup, two shapes: a vertical rail on desktop, a horizontal top bar
     with a dropdown sheet below 768px. Both toggles drive the one `.open` state. */
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const navToggles = [
    document.getElementById("sidebarToggleBtn"),
    document.getElementById("navBurger")
  ].filter(Boolean);
  const sidebarLinks = sidebar ? Array.from(sidebar.querySelectorAll(".sidebar-nav a")) : [];
  const isMobileNav = () => window.innerWidth <= 768;

  // No-op placeholder so link/keyboard handlers below are always safe to call
  let closeSidebar = () => {};

  if (sidebar && sidebarOverlay && navToggles.length) {
    const setExpanded = (state) => {
      navToggles.forEach(btn => {
        btn.setAttribute("aria-expanded", String(state));
        btn.classList.toggle("active", state);
      });
    };

    const openSidebar = () => {
      sidebar.classList.add("open");
      sidebarOverlay.classList.add("show");
      setExpanded(true);
      // Only the mobile sheet covers the page, so only it locks scrolling
      if (isMobileNav()) document.body.classList.add("nav-open");
    };

    closeSidebar = () => {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("show");
      setExpanded(false);
      document.body.classList.remove("nav-open");
    };

    navToggles.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
      });
    });

    sidebarLinks.forEach(link => link.addEventListener("click", () => closeSidebar()));

    sidebarOverlay.addEventListener("click", () => closeSidebar());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });

    // Close only when the layout actually switches shape — a plain resize also
    // fires when a mobile browser's URL bar collapses, which must not shut the menu.
    let wasMobile = isMobileNav();
    window.addEventListener("resize", () => {
      if (isMobileNav() !== wasMobile) {
        wasMobile = isMobileNav();
        closeSidebar();
      }
    });
  }

  /* ---------- Nav active state follows the scroll position ---------- */
  const navTargets = sidebarLinks
    .map(link => {
      const id = link.getAttribute("href") || "";
      return { link, section: id.startsWith("#") ? document.querySelector(id) : null };
    })
    .filter(item => item.section);

  function syncActiveNav() {
    if (!navTargets.length) return;
    const offset = (isMobileNav() ? 70 : 0) + window.innerHeight * 0.28;
    let current = navTargets[0];

    navTargets.forEach(item => {
      if (item.section.getBoundingClientRect().top - offset <= 0) current = item;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = navTargets[navTargets.length - 1];
    }

    navTargets.forEach(item => item.link.classList.toggle("active", item === current));
  }

  /* ---------- Scroll Progress Bar ---------- */
  const progressBar = document.getElementById("progressBar");

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }

  /* ---------- Custom Cursor ---------- */
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");
  const isTouch = window.matchMedia("(hover: none)").matches;

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + "px";
      cursorDot.style.top = mouseY + "px";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + "px";
      cursorRing.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = document.querySelectorAll("a, button, .service-row, .team-panel, .portfolio-item");
    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
    });
  }

  /* ---------- Scroll Reveal (with stagger) ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  revealEls.forEach((el, idx) => {
    el.style.setProperty("--reveal-delay", (idx % 4) * 0.1 + "s");
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Skills stagger index ---------- */
  document.querySelectorAll(".skills span").forEach((el, idx) => {
    el.style.setProperty("--i", idx);
  });

  /* ---------- Animated Counters ---------- */
  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = +el.getAttribute("data-target");
    let count = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      count += step;
      el.classList.add("counting");
      if (count >= target) {
        el.textContent = target;
        clearInterval(interval);
      } else {
        el.textContent = count;
      }
      setTimeout(() => el.classList.remove("counting"), 150);
    }, 20);
  }

  /* ---------- Tilt Effect on Cards (pointer devices only) ---------- */
  if (!isTouch) {
    document.querySelectorAll(".review-card").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(700px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }

  /* ---------- Team Panel Expand on Click ---------- */
  const teamPanels = document.querySelectorAll(".team-panel");
  teamPanels.forEach(panel => {
    panel.addEventListener("click", () => {
      teamPanels.forEach(p => p.classList.remove("active"));
      panel.classList.add("active");
    });
  });

  /* ---------- Magnetic Buttons (pointer devices only) ---------- */
  if (!isTouch) {
    document.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.25}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- Hero logo: monogram fallback when logo.png is unavailable ---------- */
  const heroFrame = document.getElementById("heroFrame");
  const heroLogo = heroFrame && heroFrame.querySelector(".hero-brand-logo");
  if (heroFrame && heroLogo) {
    const markMissing = () => heroFrame.classList.add("logo-missing");
    heroLogo.addEventListener("error", markMissing);
    // The request may already have failed before this script ran
    if (heroLogo.complete && heroLogo.naturalWidth === 0) markMissing();
  }

  /* ---------- Hero Image Parallax on Mouse Move ----------
     Applied to the .hero-image wrapper, not the frame: the frame runs the
     floatImg keyframes, and a CSS animation outranks an inline transform. */
  const heroParallax = document.querySelector(".hero-image");
  const heroSection = document.querySelector(".hero");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (heroParallax && heroSection && !isTouch && !prefersReducedMotion) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroParallax.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
    heroSection.addEventListener("mouseleave", () => {
      heroParallax.style.transform = "translate(0, 0)";
    });
  }

  /* ---------- Portfolio Filter (with animated entrance) ---------- */
  const filterButtons = document.querySelectorAll(".filter-buttons button");
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  function showPortfolioItems(items) {
    items.forEach((item, idx) => {
      item.classList.remove("hidden", "shown");
      setTimeout(() => item.classList.add("shown"), idx * 80);
    });
  }
  showPortfolioItems(Array.from(portfolioItems));

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      const visible = [];

      portfolioItems.forEach(item => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || filter === category) {
          item.classList.remove("hidden");
          visible.push(item);
        } else {
          item.classList.remove("shown");
          item.classList.add("hidden");
        }
      });

      showPortfolioItems(visible);
    });
  });

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById("backToTop");

  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 500);
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- One rAF-throttled scroll pass ----------
     Progress bar, back-to-top and nav highlighting share a single listener so
     scrolling stays smooth on low-powered phones. */
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      updateProgressBar();
      updateBackToTop();
      syncActiveNav();
      scrollTicking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ---------- Contact Form (Demo Handler) ---------- */
  const contactForm = document.getElementById("contactForm");

  // File attachment: show selected filename
  const attachmentInput = document.getElementById("attachment");
  const fileUploadText = document.getElementById("fileUploadText");
  if (attachmentInput && fileUploadText) {
    attachmentInput.addEventListener("change", () => {
      if (attachmentInput.files && attachmentInput.files.length > 0) {
        fileUploadText.textContent = attachmentInput.files[0].name;
      } else {
        fileUploadText.textContent = "Attach a file (PDF, image or document)";
      }
    });
  }

  if (contactForm) contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !message) {
      alert("Please fill in your name and message.");
      return;
    }

    // DEMO ONLY: replace this with a real form service (Formspree, Getform, etc.)
    // or redirect to WhatsApp with a pre-filled message like below:
    //
    // const phone = "919876543210";
    // const text = encodeURIComponent(`Hi, I'm ${name}. ${message}`);
    // window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

    alert("Thank you! Your enquiry has been noted. (Connect this form to a real backend/service to receive it.)");
    contactForm.reset();
    if (fileUploadText) fileUploadText.textContent = "Attach a file (PDF, image or document)";
  });

});