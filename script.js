/* =========================================================
   KINETO TEMPLATE — Interactions
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ====================
  // 1. Sticky header on scroll
  // ====================
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ====================
  // 2. Mobile menu toggle
  // ====================
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
      const open = document.body.classList.contains('menu-open');
      menuToggle.setAttribute('aria-label', open ? 'Închide meniul' : 'Deschide meniul');
      menuToggle.querySelector('i').classList.toggle('fa-bars', !open);
      menuToggle.querySelector('i').classList.toggle('fa-xmark', open);
    });
    document.querySelectorAll('.site-nav a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
      });
    });
  }

  // ====================
  // 3. Reveal on scroll
  // ====================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  // ====================
  // 4. FAQ accordion
  // ====================
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  // ====================
  // 5. Booking calendar
  // ====================
  function initBooking() {
    const calGrid = document.getElementById('cal-grid');
    const calMonth = document.getElementById('cal-month');
    const calPrev = document.getElementById('cal-prev');
    const calNext = document.getElementById('cal-next');
    const slotsGrid = document.getElementById('slots-grid');
    const slotsTitle = document.getElementById('slots-title');
    const serviceContainer = document.getElementById('bk-services');
    const sumService = document.getElementById('sum-service');
    const sumDate = document.getElementById('sum-date');
    const sumTime = document.getElementById('sum-time');
    const confirmBtn = document.getElementById('booking-confirm');
    if (!calGrid) return;

    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selectedDate = null;
    let selectedTime = null;
    let selectedService = 'Kineto ortopedică';

    const monthNames = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];
    const allSlots = ['08:30','09:30','10:30','11:30','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

    function buildCalendar() {
      calGrid.innerHTML = '';
      calMonth.textContent = `${monthNames[viewMonth]} ${viewYear}`;
      const firstDay = new Date(viewYear, viewMonth, 1);
      const lastDay = new Date(viewYear, viewMonth + 1, 0);
      const startWeekday = (firstDay.getDay() + 6) % 7; // Mon=0

      for (let i = 0; i < startWeekday; i++) {
        const e = document.createElement('div');
        e.className = 'cal-cell empty';
        calGrid.appendChild(e);
      }

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cal-cell';
        cell.textContent = d;
        const dt = new Date(viewYear, viewMonth, d);
        const isPast = dt < new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const isSunday = dt.getDay() === 0;
        if (isPast || isSunday) {
          cell.classList.add('disabled');
          cell.disabled = true;
        } else {
          cell.addEventListener('click', () => selectDate(dt, cell));
        }
        if (selectedDate &&
            dt.getFullYear() === selectedDate.getFullYear() &&
            dt.getMonth() === selectedDate.getMonth() &&
            dt.getDate() === selectedDate.getDate()) {
          cell.classList.add('selected');
        }
        calGrid.appendChild(cell);
      }
    }

    function selectDate(dt, cell) {
      selectedDate = dt;
      selectedTime = null;
      document.querySelectorAll('.cal-cell.selected').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      renderSlots();
      updateSummary();
    }

    function renderSlots() {
      if (!selectedDate) {
        slotsGrid.innerHTML = '<span class="slots-empty">Alege o zi din calendar pentru a vedea sloturile disponibile</span>';
        slotsTitle.textContent = 'Selectează o zi';
        return;
      }
      const dayStr = `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]}`;
      slotsTitle.textContent = `Sloturi pentru ${dayStr}`;
      slotsGrid.innerHTML = '';
      const seed = selectedDate.getDate() + selectedDate.getMonth();
      allSlots.forEach((slot, idx) => {
        const isOccupied = (seed + idx) % 4 === 0;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn' + (isOccupied ? ' occupied' : '');
        btn.textContent = slot;
        btn.disabled = isOccupied;
        if (!isOccupied) {
          btn.addEventListener('click', () => {
            selectedTime = slot;
            document.querySelectorAll('.slot-btn.selected').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            updateSummary();
          });
        }
        slotsGrid.appendChild(btn);
      });
    }

    function updateSummary() {
      sumService.textContent = selectedService;
      if (selectedDate) {
        sumDate.textContent = `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
      } else {
        sumDate.textContent = '—';
      }
      sumTime.textContent = selectedTime || '—';
    }

    if (serviceContainer) {
      serviceContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.service-pill');
        if (!pill) return;
        document.querySelectorAll('.service-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedService = pill.textContent.trim();
        updateSummary();
      });
    }

    if (calPrev) calPrev.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      buildCalendar();
    });
    if (calNext) calNext.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      buildCalendar();
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        if (!selectedDate || !selectedTime) {
          e.preventDefault();
          alert('Te rugăm să alegi data și ora înainte de a continua.');
          return;
        }
        const dateStr = `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        alert(`Programare aleasă: ${selectedService}, ${dateStr}, ora ${selectedTime}.`);
      });
    }

    buildCalendar();
    updateSummary();
  }
  initBooking();

  // ====================
  // 6. Subpage header always solid
  // ====================
  if (document.body.classList.contains('subpage-body') || document.querySelector('.subpage-hero')) {
    if (header) header.classList.add('is-subpage');
  }
});
