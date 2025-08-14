document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Theme setup
  const THEME_KEY = 'rekogen_theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const toggleFab = document.getElementById('theme-toggle-fab');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggleBtn) toggleBtn.textContent = '☀️';
      if (toggleFab) toggleFab.textContent = '☀️';
      if (toggleFab) toggleFab.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      if (toggleBtn) toggleBtn.textContent = '🌙';
      if (toggleFab) toggleFab.textContent = '🌙';
      if (toggleFab) toggleFab.setAttribute('aria-pressed', 'false');
    }
  };

  const preferred = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(preferred);

  // Expose toggle function globally (for inline fallback or other scripts)
  window.toggleTheme = () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  const attachToggle = (el) => {
    if (!el) return;
    el.addEventListener('click', window.toggleTheme);
  };
  attachToggle(toggleBtn);
  attachToggle(toggleFab);

  // Partials loader
  async function includePartials() {
    const elements = document.querySelectorAll('[data-include]');
    await Promise.all(
      Array.from(elements).map(async (el) => {
        const url = el.getAttribute('data-include');
        const res = await fetch(url, { cache: 'no-cache' });
        el.innerHTML = await res.text();
      })
    );
    // Mark active nav link
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar .nav-link').forEach((a) => {
      if (a.getAttribute('href') === current) {
        a.classList.add('active');
      }
    });
  }

  // Waitlist form
  const form = document.getElementById('waitlist-form');
  const emailInput = document.getElementById('email');
  const messageEl = document.getElementById('waitlist-message');

  const setMessage = (text, type = 'secondary') => {
    if (!messageEl) return;
    messageEl.className = `small mt-3 text-${type}`;
    messageEl.textContent = text;
  };

  if (form && emailInput) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      const isValid = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
      if (!isValid) {
        emailInput.classList.add('is-invalid');
        setMessage('Please enter a valid email.', 'danger');
        return;
      }

      emailInput.classList.remove('is-invalid');
      setMessage('Submitting...', 'secondary');

      try {
        await new Promise((res) => setTimeout(res, 800));
        setMessage('Thanks! You\'re on the list. We\'ll be in touch soon.', 'success');
        form.reset();
      } catch (err) {
        setMessage('Something went wrong. Please try again.', 'danger');
      }
    });
  }

  // Contact form (Meet the Dev)
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('contact-name') || {}).value?.trim() || '';
      const email = (document.getElementById('contact-email') || {}).value?.trim() || '';
      const message = (document.getElementById('contact-message') || {}).value?.trim() || '';

      // simple validation
      const validEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
      if (!name) { contactForm.querySelector('#contact-name')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-name')?.classList.remove('is-invalid'); }
      if (!validEmail) { contactForm.querySelector('#contact-email')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-email')?.classList.remove('is-invalid'); }
      if (!message) { contactForm.querySelector('#contact-message')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-message')?.classList.remove('is-invalid'); }
      if (!name || !validEmail || !message) {
        if (contactStatus) { contactStatus.className = 'small mt-3 text-danger'; contactStatus.textContent = 'Please complete all fields.'; }
        return;
      }

      const subject = encodeURIComponent(`RekoGen contact from ${name}`);
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        message
      ];
      const body = encodeURIComponent(bodyLines.join('\n'));
      const mailto = `mailto:hello@rekogen.app?subject=${subject}&body=${body}`;
      if (contactStatus) { contactStatus.className = 'small mt-3 text-secondary'; contactStatus.textContent = 'Opening your email client…'; }
      window.location.href = mailto;
    });
  }

  // Scroll progress
  const sp = document.getElementById('scroll-progress');
  if (sp) {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
      sp.style.width = pct + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  includePartials().then(() => {
    // After navbar/footer injected, re-attach theme toggle in case FAB was added later (some pages)
    const fab = document.getElementById('theme-toggle-fab');
    attachToggle(fab);
  });
}); 