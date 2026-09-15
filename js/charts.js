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

  // Punto de extensión para gráficos SVG accesibles de la segunda etapa.
  window.CabalangoCharts = { loadTourismData, formatNumber };
})();
