document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const logoImg = document.getElementById('logoImg');
  const footerLogo = document.getElementById('footerLogo');
  const heroBg = document.getElementById('heroBg');
  const footerBrand = document.getElementById('footerBrand');
  const switcherButtons = document.querySelectorAll('.switcher-btn');

  // Theme configurations
  const themeConfig = {
    template1: {
      name: '42 Locations',
      logo: 'assets/logo_corporate.png',
      heroBg: 'assets/hero_42locations.png',
      subtitle: 'Premier Real Estate Services',
      title: 'Find Exclusive Properties<br/>in Chennai, Tamil Nadu',
      desc: 'Discover premium residential and commercial properties with expert guidance from 42 Locations – your trusted partner in Chennai real estate.'
    },
    template2: {
      name: '42 Locations',
      logo: 'assets/logo_eco.png',
      heroBg: 'assets/hero_greennest.png',
      subtitle: 'Sustainable Urban Living',
      title: 'Your Future Home,<br/>Nature\'s Best Choice',
      desc: 'Experience eco-friendly living with 42 Locations. We specialize in green communities and sustainable residential projects across Chennai.'
    },
    template3: {
      name: '42 Locations',
      logo: 'assets/logo_luxury.png',
      heroBg: 'assets/hero_urbanedge.png',
      subtitle: 'Luxury Living Reimagined',
      title: 'Elegance Redefined<br/>in Every Detail',
      desc: '42 Locations presents an exclusive collection of high-end penthouses and luxury estates for the discerning modern investor.'
    }
  };

  // --- Theme Switching via Button Group ---
  function switchTheme(selected) {
    const config = themeConfig[selected];

    // Update active button
    switcherButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === selected);
    });

    // Change data attribute (triggers all CSS changes)
    body.setAttribute('data-template', selected);

    // Animate logo swap
    logoImg.style.opacity = '0';
    logoImg.style.transform = 'scale(0.8)';
    setTimeout(() => {
      logoImg.src = config.logo;
      footerLogo.src = config.logo;
      logoImg.style.opacity = '1';
      logoImg.style.transform = 'scale(1)';
    }, 250);

    // Animate hero background swap
    heroBg.style.opacity = '0';
    setTimeout(() => {
      heroBg.style.backgroundImage = `url('${config.heroBg}')`;
      heroBg.style.opacity = '1';
    }, 400);

    // Update hero text
    document.getElementById('heroSubtitle').textContent = config.subtitle;
    document.getElementById('heroTitle').innerHTML = config.title;
    document.getElementById('heroDesc').textContent = config.desc;

    // Update footer brand
    if (footerBrand) footerBrand.textContent = config.name;

    // Re-trigger stat counter animation
    animateCounters();

    // Luxury: create/destroy particles
    handleParticles(selected);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  switcherButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTheme(btn.dataset.theme));
  });

  // --- Initialize ---
  heroBg.style.backgroundImage = `url('${themeConfig.template1.heroBg}')`;

  // --- Mobile Navigation ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // --- Sticky Header ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // --- Intersection Observer for Fade-in ---
  const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .property-card, .service-card, .testimonial-card').forEach(el => {
    observer.observe(el);
  });

  // --- Counter Animation ---
  function animateCounters() {
    document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      counter.textContent = '0';
      requestAnimationFrame(updateCounter);
    });
  }

  // Trigger counters when hero is visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  heroObserver.observe(document.getElementById('hero'));

  // --- Luxury Particles ---
  function handleParticles(template) {
    const container = document.getElementById('heroParticles');
    container.innerHTML = '';
    if (template !== 'template3') return;

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position:absolute;
        width:${Math.random() * 3 + 1}px;
        height:${Math.random() * 3 + 1}px;
        background:rgba(201,168,76,${Math.random() * 0.4 + 0.1});
        border-radius:50%;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        animation:float ${Math.random() * 6 + 4}s ease-in-out infinite;
        animation-delay:${Math.random() * 4}s;
      `;
      container.appendChild(particle);
    }

    // Add float animation if not already added
    if (!document.getElementById('particleStyle')) {
      const style = document.createElement('style');
      style.id = 'particleStyle';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-15px) translateX(-10px); opacity: 0.5; }
          75% { transform: translateY(-40px) translateX(5px); opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // --- Smooth Parallax for Hero BG on scroll ---
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `scale(1.08) translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });

  // --- Property Card Tilt Effect (subtle) ---
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});
