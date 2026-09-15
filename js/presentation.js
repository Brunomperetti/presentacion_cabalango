(() => {
  'use strict';

  const slides = [...document.querySelectorAll('.slide')];
  const previousButton = document.querySelector('[data-previous-slide]');
  const nextButtons = [...document.querySelectorAll('[data-next-slide]')];
  const fullscreenButton = document.querySelector('[data-fullscreen]');
  const currentLabel = document.querySelector('[data-current-slide]');
  const totalLabel = document.querySelector('[data-total-slides]');
  const progress = document.querySelector('[data-progress]');
  let currentIndex = 0;
  let touchStart = null;

  const pad = (number) => String(number).padStart(2, '0');

  function indexFromHash() {
    const match = window.location.hash.match(/^#slide-(\d+)$/);
    if (!match) return 0;
    return Math.min(Math.max(Number(match[1]) - 1, 0), slides.length - 1);
  }

  function showSlide(index, options = {}) {
    const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
    currentIndex = nextIndex;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.classList.toggle('is-before', slideIndex < currentIndex);
      slide.setAttribute('aria-hidden', String(!isActive));
      slide.inert = !isActive;
    });

    currentLabel.textContent = pad(currentIndex + 1);
    totalLabel.textContent = pad(slides.length);
    progress.style.width = `${((currentIndex + 1) / slides.length) * 100}%`;
    previousButton.disabled = currentIndex === 0;
    nextButtons.forEach((button) => { button.disabled = currentIndex === slides.length - 1; });

    const nextHash = `#slide-${currentIndex + 1}`;
    if (window.location.hash !== nextHash) {
      const method = options.replaceHistory ? 'replaceState' : 'pushState';
      window.history[method](null, '', nextHash);
    }

    document.title = `Cabalango · ${currentIndex + 1}/${slides.length}`;
    window.CabalangoAnimations?.play(slides[currentIndex]);
    window.CabalangoTracking?.trackSlideView(slides[currentIndex].id);
  }

  const next = () => showSlide(currentIndex + 1);
  const previous = () => showSlide(currentIndex - 1);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  document.addEventListener('keydown', (event) => {
    if (event.target.matches('input, textarea, select')) return;
    const actions = {
      ArrowRight: next,
      PageDown: next,
      ' ': next,
      ArrowLeft: previous,
      PageUp: previous,
      Home: () => showSlide(0),
      End: () => showSlide(slides.length - 1),
      f: toggleFullscreen,
      F: toggleFullscreen,
    };
    if (actions[event.key]) {
      event.preventDefault();
      actions[event.key]();
    }
  });

  document.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      deltaX < 0 ? next() : previous();
    }
    touchStart = null;
  }, { passive: true });

  previousButton.addEventListener('click', previous);
  nextButtons.forEach((button) => button.addEventListener('click', next));
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute('aria-label', isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa');
  });
  window.addEventListener('hashchange', () => showSlide(indexFromHash(), { replaceHistory: true }));

  showSlide(indexFromHash(), { replaceHistory: true });
})();
