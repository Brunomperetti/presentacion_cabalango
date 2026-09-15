(() => {
  'use strict';

  const log = (event, data) => console.info(`[Cabalango] ${event}`, data);
  const trackSlideView = (slideId) => log('slide_view', { slideId });
  const trackExternalLink = (label) => log('external_link', { label });
  const trackAppOpen = (source) => log('app_open', { source });
  const trackQrSource = (source) => log('qr_source', { source });

  window.CabalangoTracking = {
    trackSlideView,
    trackExternalLink,
    trackAppOpen,
    trackQrSource,
  };
})();
