(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function play(slide) {
    if (reducedMotion.matches) return;
    const elements = slide.querySelectorAll('.animate-in');
    elements.forEach((element) => {
      element.style.removeProperty('transition');
      void element.offsetWidth;
      element.style.removeProperty('transition');
    });
  }

  window.CabalangoAnimations = { play, reducedMotion };
})();
