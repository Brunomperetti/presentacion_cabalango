(() => {
  'use strict';

  async function loadTourismData(url = 'data/turismo-2026.json') {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`No se pudieron cargar los datos (${response.status})`);
    return response.json();
  }

  function formatNumber(value, options = {}) {
    return new Intl.NumberFormat('es-AR', options).format(value);
  }

  function getValue(object, path) {
    return path.split('.').reduce((value, key) => value?.[key], object);
  }

  function formatValue(value, element) {
    if (element.dataset.format === 'millions') {
      return `${formatNumber(value / 1000000, { maximumFractionDigits: 2 })} millones`;
    }
    return `${element.dataset.prefix || ''}${formatNumber(value, { maximumFractionDigits: 1 })}${element.dataset.suffix || ''}`;
  }

  function hydrateData(data) {
    document.querySelectorAll('[data-path]').forEach((element) => {
      const value = getValue(data, element.dataset.path);
      if (value !== undefined) element.textContent = formatValue(value, element);
    });
  }

  function animateCounter(element, data) {
    const target = getValue(data, element.dataset.countPath);
    if (target === undefined) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = formatValue(target, element);
      return;
    }
    const start = performance.now();
    const duration = 1200;
    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - ((1 - progress) ** 3);
      element.textContent = formatValue(target * eased, element);
      if (progress < 1 && element.closest('.slide')?.classList.contains('is-active')) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  let tourismData;
  async function init() {
    tourismData = await loadTourismData();
    hydrateData(tourismData);
    const activeCounter = document.querySelector('.is-active [data-count-path]');
    if (activeCounter) animateCounter(activeCounter, tourismData);
  }

  document.addEventListener('cabalango:slidechange', (event) => {
    if (!tourismData) return;
    event.detail.slide.querySelectorAll('[data-count-path]').forEach((element) => animateCounter(element, tourismData));
  });

  init().catch((error) => console.error('[Cabalango] Error al cargar datos:', error));
  window.CabalangoCharts = { loadTourismData, formatNumber, getValue };
})();
