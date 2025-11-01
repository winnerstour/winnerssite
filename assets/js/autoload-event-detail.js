// assets/js/autoload-event-detail.js
function __getSlug(){ return new URLSearchParams(location.search).get('slug') || ''; }

(async () => {
  const slug = __getSlug(); if (!slug) { console.warn('Slug ausente na URL'); return; }
  try {
    const url = `./assets/data/events/${slug}.json?v=${Date.now()}`;
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Evento não encontrado: ${slug}`);
    const ev = await r.json();
    window.__EVENT = ev;

    if (typeof hydrateEventPage === 'function') {
      hydrateEventPage(ev);
      return;
    }

    const root = document.querySelector('#event-content') || document.querySelector('main') || document.body;
    const banner = `./assets/img/banners/${slug}-banner.webp`;
    const html = `
      <figure class="event-banner">
        <img src="${banner}" alt="${ev.title}">
      </figure>
      <h1>${ev.title}</h1>
      ${ev.subtitle ? `<p>${ev.subtitle}</p>` : ''}
    `;
    root.insertAdjacentHTML('afterbegin', html);
  } catch (e) {
    console.error('Erro ao carregar evento:', e);
  }
})();
