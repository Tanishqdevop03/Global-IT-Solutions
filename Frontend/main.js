document.addEventListener("DOMContentLoaded", () => {
  /* ================= HERO CANVAS ================= */
  const heroCanvas = document.getElementById("bgCanvas");
  const heroCtx = heroCanvas.getContext("2d");
  let hw, hh;
  let mouse = { x: null, y: null };
  let dots = [];

  function resizeHeroCanvas() {
    const container = document.querySelector(".hero-canvas");
    hw = heroCanvas.width = container.offsetWidth;
    hh = heroCanvas.height = container.offsetHeight;
  }

  function Dot() {
    this.x = Math.random() * hw;
    this.y = Math.random() * hh;
    this.r = Math.random() * 2 + 1;
    this.dx = Math.random() * 0.5 - 0.25;
    this.dy = Math.random() * 0.5 - 0.25;
  }

  Dot.prototype.update = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x < 0 || this.x > hw) this.dx *= -1;
    if (this.y < 0 || this.y > hh) this.dy *= -1;

    if (mouse.x !== null && mouse.y !== null) {
      let dx = this.x - mouse.x;
      let dy = this.y - mouse.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        this.x += dx * 0.002;
        this.y += dy * 0.002;
      }
    }
  };

  Dot.prototype.draw = function () {
    heroCtx.beginPath();
    heroCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    heroCtx.fillStyle = "rgba(87, 51, 158, 0.7)";
    heroCtx.fill();
  };

  function setupHeroCanvas() {
    resizeHeroCanvas();
    dots = [];
    for (let i = 0; i < 100; i++) dots.push(new Dot());
    animateHeroCanvas();
  }

  function animateHeroCanvas() {
    heroCtx.clearRect(0, 0, hw, hh);
    dots.forEach(dot => {
      dot.update();
      dot.draw();
    });
    requestAnimationFrame(animateHeroCanvas);
  }

  heroCanvas.addEventListener("mousemove", e => {
    const rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroCanvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", resizeHeroCanvas);
  setupHeroCanvas();

  /* ================= CARDS REVEAL ================= */
  const revealCards = () => {
    document.querySelectorAll(".card").forEach(card => {
      const top = card.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.9) card.classList.add("reveal");
    });
  };
  window.addEventListener("scroll", revealCards);
  revealCards();

  /* ================= SERVICES TAB SWITCH ================= */
  const tabs = document.querySelectorAll(".split-tab");
  const panels = document.querySelectorAll(".split-panel");
  let activeIndex = 0;

  function activateTab(index) {
    if (index === activeIndex) return;
    tabs.forEach(tab => tab.classList.remove("active"));
    tabs[index].classList.add("active");

    panels.forEach((panel, i) => {
      panel.classList.remove("active", "previous");
      if (i === index) panel.classList.add("active");
      else if (i === activeIndex) panel.classList.add("previous");
    });

    activeIndex = index;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("mouseenter", () => activateTab(index));
    tab.addEventListener("focus", () => activateTab(index));
    tab.addEventListener("touchstart", () => activateTab(index), { passive: true });
  });

  /* ================= HEADER BG CHANGE ON SCROLL ================= */
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  /* ================= ABOUT CANVAS ================= */
  const aboutCanvas = document.getElementById("aboutCanvas");
  const aboutCtx = aboutCanvas.getContext("2d");
  let aw, ah;

  function resizeAboutCanvas() {
    aw = aboutCanvas.width = window.innerWidth;
    ah = aboutCanvas.height = window.innerHeight;
  }
  resizeAboutCanvas();
  window.addEventListener("resize", resizeAboutCanvas);

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * aw,
    y: Math.random() * ah,
    radius: Math.random() * 1.5 + 0.5,
    speedX: Math.random() * 0.3 - 0.15,
    speedY: Math.random() * 0.3 - 0.15,
    opacity: Math.random() * 0.3 + 0.1
  }));

  function animateAboutCanvas() {
    aboutCtx.clearRect(0, 0, aw, ah);

    // Subtle grid
    aboutCtx.strokeStyle = "rgba(26, 15, 85, 0.03)";
    for (let x = 0; x < aw; x += 60) {
      aboutCtx.beginPath();
      aboutCtx.moveTo(x, 0);
      aboutCtx.lineTo(x, ah);
      aboutCtx.stroke();
    }
    for (let y = 0; y < ah; y += 60) {
      aboutCtx.beginPath();
      aboutCtx.moveTo(0, y);
      aboutCtx.lineTo(aw, y);
      aboutCtx.stroke();
    }

    // Particles
    particles.forEach(p => {
      aboutCtx.beginPath();
      aboutCtx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
      aboutCtx.fillStyle = `rgba(124, 95, 230, ${p.opacity})`;
      aboutCtx.fill();
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > aw) p.speedX *= -1;
      if (p.y < 0 || p.y > ah) p.speedY *= -1;
    });

    requestAnimationFrame(animateAboutCanvas);
  }
  animateAboutCanvas();

  /* ================= SECTION REVEAL OBSERVER ================= */
  const targets = document.querySelectorAll("section, footer");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.3 });
  targets.forEach(el => observer.observe(el));

  /* ================= SMOOTH SCROLL (Only for # Links) ================= */
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
});

//form submission
// form submission (matches your current HTML)
const form = document.querySelector(".connect-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // grab values by order in form
  const inputs = form.querySelectorAll("input, textarea");
  const formData = {
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    subject: inputs[3].value,
    message: inputs[4].value,
  };

  // create / reuse status message element
  let statusEl = form.querySelector(".status-msg");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.className = "status-msg";
    form.appendChild(statusEl);
  }

  statusEl.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:3000/api/send-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      statusEl.textContent = "✅ Message sent successfully!";
      form.reset();
    } else {
      statusEl.textContent = `❌ Error: ${data.error || "Failed to send message"}`;
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = "❌ Something went wrong!";
  }
});