/**
 * Digital Clock — Vercel Design System & Modern Web Standards
 * Features:
 * - Tri-state Theme Toggle (System, Light, Dark) with View Transitions API & FOUC-prevention
 * - High-precision drift-free time rendering
 * - 12H / 24H formats & customizable seconds display
 * - Day progress percentage calculation
 * - World timezones support (Local, UTC, New York, London, Tokyo)
 * - Synthesized Web Audio chime
 * - Keyboard shortcuts (F, T, Space, S) & Fullscreen support
 */

(() => {
  'use strict';

  // --- State Configuration ---
  const state = {
    theme: 'system', // 'system' | 'light' | 'dark'
    format12h: true,
    showSeconds: true,
    timezone: 'UTC', // Default to Coordinated Universal Time
    hourlyChime: false,
    lastChimedHour: -1
  };

  // Supported Timezones (Global Reference Cities & UTC)
  const timezoneLabels = {
    'UTC': 'Coordinated Universal Time (UTC)',
    'America/New_York': 'New York (EDT)',
    'Europe/London': 'London (BST)',
    'Asia/Kolkata': 'New Delhi / IST',
    'Asia/Tokyo': 'Tokyo (JST)',
    'Australia/Sydney': 'Sydney (AEDT)'
  };

  // --- DOM Elements ---
  const elements = {
    // 2-Mode Theme Switch (Light & Dark)
    themePillIndicator: document.getElementById('themePillIndicator'),
    themeLightBtn: document.getElementById('themeLightBtn'),
    themeDarkBtn: document.getElementById('themeDarkBtn'),
    activeThemeInfo: document.getElementById('activeThemeInfo'),

    // Clock Face
    hoursVal: document.getElementById('hoursVal'),
    minutesVal: document.getElementById('minutesVal'),
    secondsVal: document.getElementById('secondsVal'),
    periodContainer: document.getElementById('periodContainer'),
    periodVal: document.getElementById('periodVal'),
    secondsItems: document.querySelectorAll('.seconds-item'),
    periodItems: document.querySelectorAll('.period-item'),
    fullDateText: document.getElementById('fullDateText'),
    weekNumberText: document.getElementById('weekNumberText'),
    dayPercentText: document.getElementById('dayPercentText'),
    dayProgressBar: document.getElementById('dayProgressBar'),
    timezoneText: document.getElementById('timezoneText'),

    // Controls
    btn12h: document.getElementById('btn12h'),
    btn24h: document.getElementById('btn24h'),
    toggleSecondsBtn: document.getElementById('toggleSecondsBtn'),
    toggleChimeBtn: document.getElementById('toggleChimeBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    fullscreenIcon: document.getElementById('fullscreenIcon'),
    tzChips: document.querySelectorAll('.tz-chip'),
    toastContainer: document.getElementById('toastContainer'),

    // Universal Branding & About Modal
    footerAboutBtn: document.getElementById('footerAboutBtn'),
    aboutDialog: document.getElementById('aboutDialog'),
    footerBranding: document.getElementById('footerBranding')
  };

  // --- Audio Context for Gentle Synthesized Chime ---
  let audioCtx = null;
  function playGentleChime(freq = 587.33, freq2 = 880) { // D5 to A5
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq2, now + 0.1);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + 0.8);
      osc2.start(now + 0.1);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  // --- Theme Management ---
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const systemDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function updateThemePill(targetBtn) {
    if (!targetBtn || !elements.themePillIndicator) return;
    const parentRect = targetBtn.parentElement.getBoundingClientRect();
    const btnRect = targetBtn.getBoundingClientRect();
    const offsetLeft = btnRect.left - parentRect.left;
    elements.themePillIndicator.style.width = `${btnRect.width}px`;
    elements.themePillIndicator.style.transform = `translateX(${offsetLeft}px)`;
  }

  function applyTheme(themeMode, animate = true) {
    const applyLogic = () => {
      state.theme = themeMode === 'dark' ? 'dark' : 'light';

      // Update ARIA & Button states (2 modes: Light & Dark, Icons only)
      if (elements.themeLightBtn && elements.themeDarkBtn) {
        const isLight = state.theme === 'light';
        elements.themeLightBtn.setAttribute('aria-checked', isLight ? 'true' : 'false');
        elements.themeDarkBtn.setAttribute('aria-checked', !isLight ? 'true' : 'false');
        updateThemePill(isLight ? elements.themeLightBtn : elements.themeDarkBtn);
      }

      try { localStorage.setItem('color-scheme', state.theme); } catch (e) {}
      if (metaColorScheme) metaColorScheme.content = state.theme;
      document.documentElement.setAttribute('data-theme', state.theme);
      elements.activeThemeInfo.textContent = `${state.theme.charAt(0).toUpperCase() + state.theme.slice(1)} mode`;
    };

    // Use Modern View Transitions API if supported and requested
    if (animate && document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => {
        applyLogic();
      });
    } else {
      applyLogic();
    }
  }

  function initTheme() {
    // Automatically identify device/system theme unless user has saved preference
    let activeTheme = 'light';
    try {
      const stored = localStorage.getItem('color-scheme');
      if (stored === 'light' || stored === 'dark') {
        activeTheme = stored;
      } else {
        activeTheme = systemDarkMedia.matches ? 'dark' : 'light';
      }
    } catch (e) {
      activeTheme = systemDarkMedia.matches ? 'dark' : 'light';
    }

    applyTheme(activeTheme, false);

    // Reposition pill on window resize
    window.addEventListener('resize', () => {
      const activeBtn = state.theme === 'light' ? elements.themeLightBtn : elements.themeDarkBtn;
      if (activeBtn) updateThemePill(activeBtn);
    });

    // 2-mode icon buttons event listeners
    elements.themeLightBtn?.addEventListener('click', () => applyTheme('light', true));
    elements.themeDarkBtn?.addEventListener('click', () => applyTheme('dark', true));

    // Auto-detect system theme changes
    systemDarkMedia.addEventListener('change', (e) => {
      // If user hasn't explicitly set a preference or to match system changes automatically
      applyTheme(e.matches ? 'dark' : 'light', true);
    });

    // Multi-tab storage sync
    window.addEventListener('storage', (e) => {
      if (e.key === 'color-scheme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        applyTheme(e.newValue, false);
      }
    });
  }

  // --- Toast Notification Feedback ---
  function showToast(message, duration = 2500) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  }

  // --- Date & Time Calculation Engine ---
  function getISOWeekNumber(date) {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  }

  function getTimezoneOffsetString(date, tz) {
    try {
      if (tz === 'UTC') return 'UTC+00:00';
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz === 'local' ? undefined : tz,
        timeZoneName: 'shortOffset'
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find(p => p.type === 'timeZoneName');
      return tzPart ? tzPart.value : 'UTC';
    } catch (e) {
      return 'UTC';
    }
  }

  function updateClock() {
    const now = new Date();

    // Calculate time components in the selected timezone
    let tzHours = now.getUTCHours();
    let tzMinutes = now.getUTCMinutes();
    let tzSeconds = now.getUTCSeconds();

    try {
      const tzParts = new Intl.DateTimeFormat('en-US', {
        timeZone: state.timezone,
        hourCycle: 'h23',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).formatToParts(now);

      tzParts.forEach(p => {
        if (p.type === 'hour') tzHours = parseInt(p.value, 10);
        if (p.type === 'minute') tzMinutes = parseInt(p.value, 10);
        if (p.type === 'second') tzSeconds = parseInt(p.value, 10);
      });
    } catch (e) {}

    // Strict AM / PM determination:
    // Morning (0:00 - 11:59) -> AM
    // Afternoon / Evening / Night (12:00 - 23:59) -> PM
    const period = tzHours >= 12 ? 'PM' : 'AM';
    const h12 = tzHours % 12 || 12;
    const hours = state.format12h ? String(h12).padStart(2, '0') : String(tzHours).padStart(2, '0');
    const minutes = String(tzMinutes).padStart(2, '0');
    const seconds = String(tzSeconds).padStart(2, '0');

    // Update digits
    if (elements.hoursVal.textContent !== hours) elements.hoursVal.textContent = hours;
    if (elements.minutesVal.textContent !== minutes) elements.minutesVal.textContent = minutes;
    if (elements.secondsVal.textContent !== seconds) elements.secondsVal.textContent = seconds;

    // Period indicator (AM/PM) and pulsing colon separator for 12H mode
    elements.periodItems.forEach(el => el.classList.toggle('hidden', !state.format12h));
    if (state.format12h && elements.periodVal.textContent !== period) {
      elements.periodVal.textContent = period;
    }

    // Format full date in selected timezone
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: state.timezone
    };
    const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    elements.fullDateText.textContent = formattedDate;

    // Week number
    const weekNum = getISOWeekNumber(now);
    elements.weekNumberText.textContent = `W${String(weekNum).padStart(2, '0')}`;

    // Timezone badge
    const tzLabel = timezoneLabels[state.timezone] || state.timezone;
    const offsetStr = getTimezoneOffsetString(now, state.timezone);
    elements.timezoneText.textContent = `${tzLabel} (${offsetStr})`;

    // Calculate Day Progress in the selected timezone
    const secondsToday = (tzHours * 3600) + (tzMinutes * 60) + tzSeconds;
    const dayProgress = Math.min(100, Math.max(0, (secondsToday / 86400) * 100));
    const percentStr = `${dayProgress.toFixed(1)}%`;
    elements.dayPercentText.textContent = percentStr;
    elements.dayProgressBar.style.width = percentStr;
    elements.dayProgressBar.parentElement.setAttribute('aria-valuenow', dayProgress.toFixed(0));

    // Hourly chime check
    if (state.hourlyChime && minutes === '00' && seconds === '00') {
      const currentHour = tzHours;
      if (state.lastChimedHour !== currentHour) {
        state.lastChimedHour = currentHour;
        playGentleChime();
        showToast(`🔔 Hourly Chime (${hours} ${state.format12h ? period : ':00'})`);
      }
    }
  }

  // High precision timer loop using requestAnimationFrame + sync
  function startClockLoop() {
    updateClock();
    function tick() {
      updateClock();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // --- Toolbar & Controls Handlers ---
  function initControls() {
    // 12H / 24H Toggle
    elements.btn12h.addEventListener('click', () => {
      state.format12h = true;
      elements.btn12h.classList.add('active');
      elements.btn24h.classList.remove('active');
      updateClock();
    });

    elements.btn24h.addEventListener('click', () => {
      state.format12h = false;
      elements.btn24h.classList.add('active');
      elements.btn12h.classList.remove('active');
      updateClock();
    });

    // Seconds Toggle
    elements.toggleSecondsBtn.addEventListener('click', () => {
      state.showSeconds = !state.showSeconds;
      elements.toggleSecondsBtn.classList.toggle('active', state.showSeconds);
      elements.toggleSecondsBtn.setAttribute('aria-pressed', state.showSeconds ? 'true' : 'false');
      elements.secondsItems.forEach(el => el.classList.toggle('hidden', !state.showSeconds));
    });

    // Chime Toggle
    elements.toggleChimeBtn.addEventListener('click', () => {
      state.hourlyChime = !state.hourlyChime;
      elements.toggleChimeBtn.classList.toggle('active', state.hourlyChime);
      elements.toggleChimeBtn.setAttribute('aria-pressed', state.hourlyChime ? 'true' : 'false');
      if (state.hourlyChime) {
        playGentleChime();
        showToast('Chime enabled: Plays every hour');
      } else {
        showToast('Chime disabled');
      }
    });

    // Automatically identify device timezone and switch to it without manual intervention
    const detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    state.timezone = detectedTz;

    // Ensure detected timezone has a registered label
    if (!timezoneLabels[state.timezone]) {
      const cityName = state.timezone.replace(/_/g, ' ').split('/').pop();
      timezoneLabels[state.timezone] = `${cityName} (${state.timezone})`;
    }

    // Match or dynamically add chip for detected device timezone
    let matchedChip = null;
    elements.tzChips.forEach(chip => {
      if (chip.dataset.tz === state.timezone ||
          (state.timezone === 'Asia/Calcutta' && chip.dataset.tz === 'Asia/Kolkata') ||
          (state.timezone === 'Asia/Kolkata' && chip.dataset.tz === 'Asia/Kolkata')) {
        matchedChip = chip;
      }
    });

    if (matchedChip) {
      elements.tzChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      matchedChip.classList.add('active');
      matchedChip.setAttribute('aria-selected', 'true');
    } else {
      // If the detected device timezone isn't in predefined chips, dynamically prepend it
      const tzContainer = document.querySelector('.tz-chips-group');
      if (tzContainer) {
        elements.tzChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });

        const devChip = document.createElement('button');
        devChip.type = 'button';
        devChip.className = 'tz-chip active';
        devChip.dataset.tz = state.timezone;
        devChip.dataset.name = timezoneLabels[state.timezone];
        devChip.setAttribute('role', 'tab');
        devChip.setAttribute('aria-selected', 'true');
        devChip.textContent = state.timezone.split('/').pop().replace(/_/g, ' ');

        devChip.addEventListener('click', () => {
          document.querySelectorAll('.tz-chip').forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-selected', 'false');
          });
          devChip.classList.add('active');
          devChip.setAttribute('aria-selected', 'true');
          state.timezone = devChip.dataset.tz;
          updateClock();
          showToast(`Timezone: ${devChip.dataset.name}`);
        });

        tzContainer.prepend(devChip);
        elements.tzChips = document.querySelectorAll('.tz-chip');
      }
    }

    // Timezone Chips Click Handler
    elements.tzChips.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.tzChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        state.timezone = chip.dataset.tz;
        updateClock();
        const friendlyName = timezoneLabels[state.timezone] || chip.dataset.name || chip.textContent;
        showToast(`Timezone: ${friendlyName}`);
      });
    });

    // Fullscreen Toggle
    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('fullscreenchange', () => {
      const isFullscreen = !!document.fullscreenElement;
      document.documentElement.classList.toggle('is-fullscreen', isFullscreen);
      elements.fullscreenBtn.title = isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen (F)';
      elements.fullscreenIcon.innerHTML = isFullscreen
        ? '<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>'
        : '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>';
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is focusing an input or interactive control
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        // Toggle between 2 modes: light <-> dark
        applyTheme(state.theme === 'dark' ? 'light' : 'dark', true);
      } else if (e.key === ' ') {
        e.preventDefault();
        // Toggle 12h/24h
        if (state.format12h) {
          elements.btn24h.click();
        } else {
          elements.btn12h.click();
        }
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        elements.toggleSecondsBtn.click();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        if (elements.aboutDialog?.open) {
          elements.aboutDialog.close();
        } else if (elements.aboutDialog) {
          elements.aboutDialog.showModal();
        }
      }
    });
  }

  // --- Universal App Branding & About Modal Initialization ---
  function initUniversalBranding() {
    if (typeof window.AppInfo !== 'undefined' && elements.aboutDialog) {
      elements.aboutDialog.innerHTML = window.AppInfo.getAboutDialogHTML();
      if (elements.footerBranding) {
        elements.footerBranding.innerHTML = window.AppInfo.getBrandingHTML();
      }

      function openAbout() {
        if (!elements.aboutDialog.open) {
          elements.aboutDialog.showModal();
        }
      }

      function closeAbout() {
        if (elements.aboutDialog.open) {
          elements.aboutDialog.close();
        }
      }

      // Open triggers
      elements.footerAboutBtn?.addEventListener('click', openAbout);
      document.getElementById('seoAboutTrigger')?.addEventListener('click', openAbout);
      document.getElementById('faqAboutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        openAbout();
      });

      // Back to top trigger
      const backToTopBtn = document.getElementById('backToTopBtn');
      backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      // Dynamic copyright year in knowledge bottom bar
      const bottomCopyrightText = document.getElementById('bottomCopyrightText');
      if (bottomCopyrightText) {
        bottomCopyrightText.textContent = `© ${new Date().getFullYear()} Prometrion. All rights reserved.`;
      }

      // Close trigger inside dialog
      const closeBtn = document.getElementById('closeAboutBtn');
      closeBtn?.addEventListener('click', closeAbout);

      // Click on backdrop to close
      elements.aboutDialog.addEventListener('click', (e) => {
        const rect = elements.aboutDialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX && e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          closeAbout();
        }
      });
    }
  }

  // --- Initialize App ---
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initControls();
    initUniversalBranding();
    startClockLoop();
  });
})();
