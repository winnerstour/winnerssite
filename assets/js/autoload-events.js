// assets/js/autoload-events.js
// Força o uso de caminho relativo ./assets/... para evitar quebrar no GitHub Pages (/winnerssite/).
// Ignora ev.image do index.json e sempre monta a URL com base no slug.
// Adiciona fallback relativo para placeholder.
(async () => {
  try {
    const url = `./assets/data/events/index.json?v=${Date.now()}`;
    const r = await fetch(url, { cache: 'no-store' });
    const events = await r.json();
    window.__EVENTS = events;

    // Cria/encontra container
    let container = document.querySelector('#event-list, [data-event-list], .event-grid, .cards');
    if (!container) {
      const h1 = document.querySelector('h1');
      container = document.createElement('section');
      container.className = 'event-grid';
      container.setAttribute('data-event-list', '1');
      if (h1 && h1.parentNode) h1.parentNode.insertBefore(container, h1.nextSibling);
      else document.body.appendChild(container);
    }

    const html = events.map(ev => {
      const slug = ev.slug;
      const img = `./assets/img/banners/${slug}-hero.webp`;
      const subtitle = ev.subtitle ? `<p>${ev.subtitle}</p>` : '';
      return `
        <article class="event-card">
          <a href="./evento.html?slug=${slug}" aria-label="${ev.title}">
            <img src="${img}" alt="${ev.title}" loading="lazy"
                 onerror="this.onerror=null;this.src='./assets/img/banners/placeholder.webp'">
            <h2>${ev.title}</h2>
            ${subtitle}
          </a>
        </article>
      `;
    }).join('');

    container.innerHTML = html;

  } catch (e) {
    console.error('Erro ao carregar eventos:', e);
  }
})();
