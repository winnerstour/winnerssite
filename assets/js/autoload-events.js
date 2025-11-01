// assets/js/autoload-events.js
// Força carregamento do manifesto estático e renderiza os cards mesmo que a página não tenha container prévio.
// Corrige o link para 'evento.html' (sem o 'n').
(async () => {
  try {
    const url = `./assets/data/events/index.json?v=${Date.now()}`; // evita cache teimoso
    const r = await fetch(url, { cache: 'no-store' });
    const events = await r.json();
    window.__EVENTS = events;

    // 1) Se existir função do projeto, priorize
    if (typeof renderEventCards === 'function') {
      renderEventCards(events);
    }

    // 2) Encontre/Crie container padrão visível
    let container = document.querySelector('#event-list, [data-event-list], .event-grid, .cards');
    if (!container) {
      // cria abaixo do primeiro <h1>
      const h1 = document.querySelector('h1');
      container = document.createElement('section');
      container.className = 'event-grid';
      container.setAttribute('data-event-list', '1');
      if (h1 && h1.parentNode) {
        h1.parentNode.insertBefore(container, h1.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }

    // 3) Render simples (não quebra o layout existente)
    container.innerHTML = events.map(ev => {
      const img = ev.image || `./assets/img/banners/${ev.slug}-hero.webp`;
      return `
        <article class="event-card">
          <a href="./evento.html?slug=${ev.slug}" aria-label="${ev.title}">
            <img src="${img}" alt="${ev.title}" loading="lazy">
            <h2>${ev.title}</h2>
            ${ev.subtitle ? `<p>${ev.subtitle}</p>` : ''}
          </a>
        </article>
      `;
    }).join('');

  } catch (e) {
    console.error('Erro ao carregar eventos:', e);
  }
})();
