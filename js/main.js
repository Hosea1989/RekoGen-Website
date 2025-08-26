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

  // Resend configuration - Replace with your actual API key
  const RESEND_API_KEY = 're_HYZofdps_H7vYj61PhrcDuvrj5yJA8xfL';
  const FROM_EMAIL = 'hello@rekogen.app'; // Your verified domain email

  // Email sending function using Resend
  async function sendEmail(to, subject, htmlContent, textContent = '') {
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_YOUR_API_KEY_HERE') {
      console.warn('Resend API key not configured');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [to],
          subject: subject,
          html: htmlContent,
          text: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for text version
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to send email');
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

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

  // Random brand text function (RekoGen or Japanese spelling)
  const setRandomBrandText = () => {
    const brandTextEl = document.querySelector('.navbar-brand.brand-text');
    if (brandTextEl) {
      const brandOptions = [
        'Reko<span class="brand-accent">Gen</span>',
        'レコ<span class="brand-accent">ジェン</span>'
      ];
      const randomBrand = brandOptions[Math.floor(Math.random() * brandOptions.length)];
      brandTextEl.innerHTML = randomBrand;
    }
  };

  // Waitlist form with Supabase
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
      const submitBtn = form.querySelector('button[type="submit"]');

      const name = (document.getElementById('name') || {}).value?.trim() || '';
      const email = emailInput.value.trim();
      const platform = (document.getElementById('platform') || {}).value?.trim() || 'ios';
      const experience = (document.getElementById('experience') || {}).value || '';
      const referrer = (document.getElementById('referrer') || {}).value || '';
      const notes = (document.getElementById('notes') || {}).value?.trim() || '';
      const consent = (document.getElementById('consent') || {}).checked || false;

      const isValidEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
      if (!isValidEmail) {
        emailInput.classList.add('is-invalid');
        setMessage('Please enter a valid email.', 'danger');
        return;
      }
      // Removed consent validation - now optional

      emailInput.classList.remove('is-invalid');
      setMessage('Submitting...', 'secondary');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting…'; }

      try {
        // Debug: Check if Supabase is available
        console.log('Supabase URL:', window.SUPABASE_URL);
        console.log('Supabase Key:', window.SUPABASE_ANON_KEY ? 'Present' : 'Missing');
        console.log('Supabase object:', typeof supabase);

        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
          throw new Error('Supabase credentials not configured');
        }

        if (typeof supabase === 'undefined') {
          throw new Error('Supabase client not loaded');
        }

        // Initialize Supabase client
        const { createClient } = supabase;
        const supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

        console.log('Supabase client created, attempting to insert...');

        const payload = {
          name,
          email,
          platform,
          experience,
          referrer,
          notes,
          consent,
          page: location.href,
          user_agent: navigator.userAgent
        };

        console.log('Payload:', payload);

        const { data, error } = await supabaseClient
          .from('waitlist')
          .insert([payload])
          .select();

        console.log('Supabase response:', { data, error });

        if (error) {
          console.error('Supabase error details:', error);
          if (error.code === '23505') { // Unique constraint violation
            setMessage('This email is already on the waitlist!', 'warning');
          } else if (error.code === '42P01') { // Table doesn't exist
            setMessage('Database not set up yet. Please contact support.', 'danger');
          } else {
            setMessage(`Error: ${error.message}`, 'danger');
          }
        } else {
          console.log('Success! Data inserted:', data);
          
          // Send welcome email
          const welcomeEmail = await sendEmail(
            email,
            'Welcome to RekoGen! 🎬',
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #111827;">Welcome to RekoGen! 🎬</h2>
              <p>Hi ${name || 'there'},</p>
              <p>Thanks for joining the RekoGen waitlist! You're now on the list to get early access to the app that helps you discover amazing anime and find where to watch them.</p>
              
              <h3 style="color: #374151;">What's Next?</h3>
              <ul>
                <li>📱 <strong>iOS Beta:</strong> Join our TestFlight for early access</li>
                <li>🎯 <strong>Personalized Recommendations:</strong> Get anime picks tailored to your taste</li>
                <li>🌐 <strong>Realms Community:</strong> Connect with fellow anime fans</li>
                <li>📺 <strong>Streaming Info:</strong> Know exactly where to watch each anime</li>
              </ul>
              
              <p>We'll keep you updated on our progress and let you know as soon as you can try RekoGen!</p>
              
              <p>Best regards,<br>Damien<br><em>Creator of RekoGen</em></p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
              <p style="font-size: 12px; color: #6b7280;">
                You're receiving this because you joined the RekoGen waitlist. 
                <a href="mailto:hello@rekogen.app" style="color: #3b82f6;">Unsubscribe</a>
              </p>
            </div>
            `
          );
          
          if (welcomeEmail.success) {
            console.log('Welcome email sent successfully');
          } else {
            console.warn('Failed to send welcome email:', welcomeEmail.error);
          }
          
          setMessage('Thanks! You\'re on the list. We\'ll be in touch soon.', 'success');
          form.reset();
        }
      } catch (err) {
        console.error('Submission error:', err);
        setMessage(`Error: ${err.message}`, 'danger');
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Notify Me'; }
      }
    });
  }

  // Contact form (Meet the Dev) with Supabase
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      
      const name = (document.getElementById('contact-name') || {}).value?.trim() || '';
      const email = (document.getElementById('contact-email') || {}).value?.trim() || '';
      const feedbackType = (document.getElementById('contact-type') || {}).value?.trim() || '';
      const message = (document.getElementById('contact-message') || {}).value?.trim() || '';

      // simple validation
      const validEmail = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
      if (!name) { contactForm.querySelector('#contact-name')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-name')?.classList.remove('is-invalid'); }
      if (!validEmail) { contactForm.querySelector('#contact-email')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-email')?.classList.remove('is-invalid'); }
      if (!feedbackType) { contactForm.querySelector('#contact-type')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-type')?.classList.remove('is-invalid'); }
      if (!message) { contactForm.querySelector('#contact-message')?.classList.add('is-invalid'); } else { contactForm.querySelector('#contact-message')?.classList.remove('is-invalid'); }
      if (!name || !validEmail || !feedbackType || !message) {
        if (contactStatus) { contactStatus.className = 'small mt-3 text-danger'; contactStatus.textContent = 'Please complete all fields.'; }
        return;
      }

      if (contactStatus) { contactStatus.className = 'small mt-3 text-secondary'; contactStatus.textContent = 'Sending...'; }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }

      try {
        // Debug: Check if Supabase is available
        console.log('Contact form - Supabase URL:', window.SUPABASE_URL);
        console.log('Contact form - Supabase Key:', window.SUPABASE_ANON_KEY ? 'Present' : 'Missing');
        console.log('Contact form - Supabase object:', typeof supabase);

        if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
          throw new Error('Supabase credentials not configured');
        }

        if (typeof supabase === 'undefined') {
          throw new Error('Supabase client not loaded');
        }

        // Initialize Supabase client
        const { createClient } = supabase;
        const supabaseClient = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

        console.log('Contact form - Supabase client created, attempting to insert...');

        const payload = {
          name,
          email,
          message,
          category: 'contact',
          page: location.href,
          user_agent: navigator.userAgent
        };
        
        // Add feedback_type to message if available
        if (feedbackType) {
          payload.message = `[${feedbackType.toUpperCase()}] ${message}`;
        }

        console.log('Contact form - Payload:', payload);

        const { data, error } = await supabaseClient
          .from('feedback')
          .insert([payload])
          .select();

        console.log('Contact form - Supabase response:', { data, error });

        if (error) {
          console.error('Contact form - Supabase error details:', error);
          if (error.code === '42P01') { // Table doesn't exist
            if (contactStatus) { contactStatus.className = 'small mt-3 text-danger'; contactStatus.textContent = 'Database not set up yet. Please contact support.'; }
          } else {
            if (contactStatus) { contactStatus.className = 'small mt-3 text-danger'; contactStatus.textContent = `Error: ${error.message}`; }
          }
        } else {
          console.log('Contact form - Success! Data inserted:', data);
          
          // Send notification email to you
          const notificationEmail = await sendEmail(
            'hello@rekogen.app', // Your email
            `New ${feedbackType} from ${name} - RekoGen Contact`,
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #111827;">New Contact Form Submission</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Feedback Type:</strong> ${feedbackType}</p>
                <p><strong>Page:</strong> ${location.href}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #92400e; margin-top: 0;">Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 20px;">
                <a href="mailto:${email}?subject=Re: Your RekoGen feedback" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to ${name}</a>
              </div>
            </div>
            `
          );
          
          if (notificationEmail.success) {
            console.log('Notification email sent successfully');
          } else {
            console.warn('Failed to send notification email:', notificationEmail.error);
          }
          
          if (contactStatus) { contactStatus.className = 'small mt-3 text-success'; contactStatus.textContent = 'Message sent! I\'ll get back to you soon.'; }
          contactForm.reset();
        }
      } catch (err) {
        console.error('Contact form - Submission error:', err);
        if (contactStatus) { contactStatus.className = 'small mt-3 text-danger'; contactStatus.textContent = `Error: ${err.message}`; }
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
      }
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
    // After navbar/footer injected, set random brand text
    setRandomBrandText();
    
    // Re-attach theme toggle in case FAB was added later (some pages)
    const fab = document.getElementById('theme-toggle-fab');
    attachToggle(fab);
    
    // Initialize before/after slider
    initBeforeAfterSlider();
  });
});

// Before/After Slider functionality
function initBeforeAfterSlider() {
  const slider = document.querySelector('.before-after-slider');
  if (!slider) return;

  const afterLayer = slider.querySelector('.slider-after');
  const handle = slider.querySelector('.slider-handle');
  if (!afterLayer || !handle) return;

  let isPointerDown = false;
  let pendingX = null;
  let rafId = null;

  const getPercentFromClientX = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const clamped = Math.max(rect.left, Math.min(rect.right, clientX));
    const pct = ((clamped - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, pct));
  };

  const render = () => {
    if (pendingX === null) return;
    const percent = getPercentFromClientX(pendingX);
    afterLayer.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    handle.style.left = `${percent}%`;
    rafId = null;
  };

  const schedule = (clientX) => {
    pendingX = clientX;
    if (rafId === null) {
      rafId = requestAnimationFrame(render);
    }
  };

  const onPointerDown = (e) => {
    isPointerDown = true;
    slider.setPointerCapture?.(e.pointerId);
    schedule(e.clientX);
    e.preventDefault();
  };

  const onPointerMove = (e) => {
    if (!isPointerDown) return;
    schedule(e.clientX);
  };

  const onPointerUp = () => {
    isPointerDown = false;
  };

  // Use Pointer Events for unified handling
  handle.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointerdown', (e) => {
    if (e.target === slider || e.target.classList.contains('slider-line')) {
      onPointerDown(e);
    }
  });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });

  // Initialize at 50%
  const rect = slider.getBoundingClientRect();
  const midX = rect.left + rect.width * 0.5;
  schedule(midX);
} 