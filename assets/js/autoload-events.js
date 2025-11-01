// assets/js/autoload-events.js
// Usa __BASE_PATH__ para montar URLs corretas no GitHub Pages.
(async () => {
  try {
    const BASE = window.__BASE_PATH__ || './';
    const r = await fetch(`${BASE}assets/data/events/index.json?v=${Date.now()}`, { cache: 'no-store' });
    const events = await r.json();
    window.__EVENTS = events;

    // Container
    let container = document.querySelector('#event-list, [data-event-list], .event-grid, .cards');
    if (!container) {
      const h1 = document.querySelector('h1');
      container = document.createElement('section');
      container.className = 'event-grid';
      container.setAttribute('data-event-list', '1');
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(container, h1.nextSibling);
      else document.body.appendChild(container);
    }

    // Render
    container.innerHTML = events.map(ev => {
      const slug = ev.slug;
      const img = `${BASE}assets/img/banners/${slug}-hero.webp`;
      const sub = ev.subtitle ? `<p>${ev.subtitle}</p>` : '';
      return `
        <article class="event-card">
          <a href="${BASE}evento.html?slug=${slug}" aria-label="${ev.title}">
            <img src="${img}" alt="${ev.title}" loading="lazy"
                 onerror="this.onerror=null;this.src='${BASE}assets/img/banners/placeholder.webp'">
            <h2>${ev.title}</h2>
            ${sub}
          </a>
        </article>
      `;
    }).join('');

  } catch (e) {
    console.error('Erro ao carregar eventos:', e);
  }
})();
