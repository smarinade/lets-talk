/*
 * Registreert de service worker zodat de app installeerbaar is en offline werkt.
 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((error) => {
      console.warn('Offline-modus niet beschikbaar:', error);
    });
  });
})();
