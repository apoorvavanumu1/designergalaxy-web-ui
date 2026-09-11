// =========================================================
// DESIGNER GALAXY WEBSITE — JS
// Preloader, custom cursor, scroll progress, staggered reveal,
// typing effect, tilt cards, magnetic buttons, counters,
// portfolio filter, brand toggle nav, back-to-top, contact form
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader && preloader.classList.add("loaded"), 300);
  });

  /* ---------- Vertical Sidebar Toggle ---------- */
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  if (sidebarToggleBtn && sidebar && sidebarOverlay) {
    function openSidebar() {
      sidebar.classList.add("open");
      sidebarOverlay.classList.add("show");
      sidebarToggleBtn.classList.add("active");
      sidebarToggleBtn.setAttribute("aria-expanded", "true");
    }
    function closeSidebar() {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("show");
      sidebarToggleBtn.classList.remove("active");
      sidebarToggleBtn.setAttribute("aria-expanded", "false");
    }

    sidebarToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.contains("open") ? closeSidebar() : openSidebar();
    });

    // close when a nav link is clicked
    sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeSidebar);
    });

    // close when clicking the overlay
    sidebarOverlay.addEventListener("click", closeSidebar);

    // close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSidebar();
    });
  }

  /* ---------- Scroll Progress Bar ---------- */
  const progressBar = document.getElementById("progressBar");

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgressBar);
  updateProgressBar();

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

  /* ---------- Tilt Effect on Cards ---------- */
  const tiltCards = document.querySelectorAll(".review-card");
  tiltCards.forEach(card => {
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

  /* ---------- Team Panel Expand on Click ---------- */
  const teamPanels = document.querySelectorAll(".team-panel");
  teamPanels.forEach(panel => {
    panel.addEventListener("click", () => {
      teamPanels.forEach(p => p.classList.remove("active"));
      panel.classList.add("active");
    });
  });

  /* ---------- Magnetic Buttons ---------- */
  const magneticButtons = document.querySelectorAll(".btn");
  magneticButtons.forEach(btn => {
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

  /* ---------- Hero Image Parallax on Mouse Move ---------- */
  const heroImage = document.querySelector(".hero-image-frame");
  const heroSection = document.querySelector(".hero");
  if (heroImage && heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
    heroSection.addEventListener("mouseleave", () => {
      heroImage.style.transform = "translate(0, 0)";
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
  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

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

  contactForm.addEventListener("submit", (e) => {
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
