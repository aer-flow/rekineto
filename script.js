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
  // 6. Showcase sections
  // ====================
  function initShowcaseSections() {
    const services = [
      { num: '1', image: 'img/service-1.jpg', imageAlt: 'Kinetoterapie ortopedică', name: 'Kinetoterapie', italic: 'Ortopedică', copy: 'Recuperare post-operator, fracturi, entorse, luxații. Evaluare biomecanică completă, plan construit pe obiective măsurabile, ședințe 1-on-1 și ajustări săptămânale.', tag: 'Genunchi · Șold · Umăr', stat: '~12 ședințe medii', href: 'kinetoterapie-ortopedica.html' },
      { num: '2', image: 'img/service-2.jpg', imageAlt: 'Kinetoterapie neurologică', name: 'Kinetoterapie', italic: 'Neurologică', copy: 'Post-AVC, Parkinson, scleroză multiplă, neuropatii. Lucrăm pe mobilitate, echilibru și autonomie, cu progres urmărit săptămânal.', tag: 'Mobilitate · Echilibru', stat: '8+ ani specializare', href: 'kinetoterapie-neurologica.html' },
      { num: '3', image: 'img/service-3.jpg', imageAlt: 'Recuperare post-traumatică', name: 'Recuperare', italic: 'Post-Traumatică', copy: 'Programe complete după accidente, create pentru a reconstrui forța, mobilitatea și încrederea în mișcare.', tag: 'Forță · Mobilitate', stat: 'Plan etapizat', href: 'recuperare-post-traumatica.html' },
      { num: '4', image: 'img/service-4.jpg', imageAlt: 'Kinetoterapie pediatrică', name: 'Kinetoterapie', italic: 'Pediatrică', copy: 'Pentru bebeluși, copii și adolescenți: postură, scolioze, dezvoltare motrică și lucru adaptat vârstei.', tag: 'Postură · Motricitate', stat: '0-18 ani', href: 'kinetoterapie-pediatrica.html' },
      { num: '5', image: 'img/service-5.jpg', imageAlt: 'Recuperare sportivă', name: 'Recuperare', italic: 'Sportivă', copy: 'Programe return-to-play pentru sportivi amatori și profesioniști, cu accent pe prevenția recidivelor.', tag: 'Performanță · Prevenție', stat: 'Return-to-play', href: 'recuperare-sportiva.html' },
      { num: '6', image: 'img/service-6.jpg', imageAlt: 'Terapia durerii cronice', name: 'Terapia', italic: 'Durerii Cronice', copy: 'Durere de spate, cervicalgie, hernie de disc și fibromialgie, abordate prin plan progresiv și măsurabil.', tag: 'Abordare integrativă', stat: '16 ședințe medii', href: 'kinetoterapie-durere-cronica.html' }
    ];
    const serviceRoot = document.querySelector('[data-services-section]');
    if (serviceRoot) {
      let active = 0;
      const setService = (idx) => {
        active = (idx + services.length) % services.length;
        const item = services[active];
        serviceRoot.querySelector('[data-service-num]').textContent = item.num;
        serviceRoot.querySelector('[data-service-name]').textContent = item.name;
        serviceRoot.querySelector('[data-service-italic]').textContent = item.italic;
        serviceRoot.querySelector('[data-service-copy]').textContent = item.copy;
        serviceRoot.querySelector('[data-service-tag]').textContent = item.tag;
        serviceRoot.querySelector('[data-service-stat]').textContent = item.stat;
        serviceRoot.querySelector('[data-service-link]').setAttribute('href', item.href);
        const image = serviceRoot.querySelector('[data-service-image]');
        image.setAttribute('src', item.image);
        image.setAttribute('alt', item.imageAlt);
        serviceRoot.querySelector('[data-service-pager]').textContent = `${item.num} / 6`;
        serviceRoot.querySelectorAll('[data-service]').forEach(btn => {
          btn.classList.toggle('is-active', Number(btn.dataset.service) === active);
        });
      };
      serviceRoot.querySelectorAll('[data-service]').forEach(btn => {
        btn.addEventListener('mouseenter', () => setService(Number(btn.dataset.service)));
        btn.addEventListener('click', () => setService(Number(btn.dataset.service)));
      });
      serviceRoot.querySelectorAll('[data-service-prev]').forEach(btn => btn.addEventListener('click', () => setService(active - 1)));
      serviceRoot.querySelectorAll('[data-service-next]').forEach(btn => btn.addEventListener('click', () => setService(active + 1)));
      setService(active);
    }

    const zones = [
      { idx: '1', name: 'Gât', italic: '& Cervical', zone: 'Cervical', conds: 'Cervicalgie, hernie disc cervicală, dureri de cap, torticolis' },
      { idx: '2', name: 'Umăr', italic: '& Braț', zone: 'Membre superioare', conds: 'Capsulită, rupturi de coif, tendinită, sindrom de tunel carpian' },
      { idx: '3', name: 'Spate', italic: '& Coloană', zone: 'Toracic + Lombar', conds: 'Lombalgie, hernie de disc, sciatică, scolioză, spondiloză' },
      { idx: '4', name: 'Genunchi', italic: '& Șold', zone: 'Membre inferioare', conds: 'Recuperare post-operator, artroză, ligament încrucișat, leziuni de menisc' },
      { idx: '5', name: 'Gleznă', italic: '& Picior', zone: 'Distal', conds: 'Entorse, fasciită plantară, tendinită Ahile, picior plat' },
      { idx: '6', name: 'Sistem', italic: 'Neurologic', zone: 'SNC + SNP', conds: 'Post-AVC, Parkinson, scleroză multiplă, paralizie facială' }
    ];
    const treatRoot = document.querySelector('[data-treat-section]');
    if (treatRoot) {
      const setZone = (idx) => {
        const zone = zones[idx];
        treatRoot.querySelector('[data-zone-index]').textContent = `Zona ${zone.idx} · ${zone.zone}`;
        treatRoot.querySelector('[data-zone-name]').textContent = zone.name;
        treatRoot.querySelector('[data-zone-italic]').textContent = zone.italic;
        treatRoot.querySelector('[data-zone-lede]').textContent = `${zone.conds}. Plan personalizat pe baza evaluării biomecanice, cu obiective măsurabile la fiecare etapă.`;
        treatRoot.querySelector('[data-zone-conds]').textContent = zone.conds;
        treatRoot.querySelectorAll('[data-zone]').forEach(btn => {
          btn.classList.toggle('is-active', Number(btn.dataset.zone) === idx);
        });
      };
      treatRoot.querySelectorAll('[data-zone]').forEach(btn => {
        btn.addEventListener('click', () => setZone(Number(btn.dataset.zone)));
      });
      setZone(2);
    }
  }
  initShowcaseSections();

  // ====================
  // 7. Subpage header always solid
  // ====================
  if (document.body.classList.contains('subpage-body') || document.querySelector('.subpage-hero')) {
    if (header) header.classList.add('is-subpage');
  }
});
