// assets/js/index-categories.js
(function(){
  (function ensureBase(){
    if (window.asset && window.pageUrl) return;
    const parts = location.pathname.split('/').filter(Boolean);
    let base = './'; if (parts.length) base = `/${parts[0]}/`;
    window.asset = function(path){ if (path.startsWith('/')) path = path.slice(1); return base + path; };
    window.pageUrl = function(page){ if (!page) return base; if (page.startsWith('/')) page = page.slice(1); return base + page; };
  })();

  const GRID_SEL = '#eventsGrid';
  const WRAP_SEL = '#categoryWrap';
  const AUTOPLAY_MS = 4000;
  const MAX_PER_CATEGORY = 20;

  function groupBy(arr, key){
    return arr.reduce((acc, it) => {
      const k = (it[key] || 'Outros').trim();
      (acc[k] = acc[k] || []).push(it);
      return acc;
    }, {});
  }

  function cardHTML(ev){
    const slug = ev.slug;
    const hero = window.asset(`assets/img/banners/${slug}-hero.webp`);
    const banner = window.asset(`assets/img/banners/${slug}-banner.webp`);
    const href = window.pageUrl(`evento.html?slug=${encodeURIComponent(slug)}`);
    const subtitle = ev.subtitle ? `<p class="subtitle">${ev.subtitle}</p>` : '';
    return `
      <div class="cl-slide" data-role="slide">
        <a class="card" href="${href}" aria-label="${ev.title||slug}">
          <div class="media"><img loading="lazy" src="${hero}" onerror="this.onerror=null;this.src='${banner}'" alt="${ev.title||slug}"></div>
          <div class="body">
            <h3 class="title">${ev.title||slug}</h3>
            ${subtitle}
          </div>
        </a>
      </div>`;
  }

  function sectionHTML(category, items){
    const slides = items.slice(0, MAX_PER_CATEGORY).map(cardHTML).join('');
    return `
      <section class="cat-section" data-component="carousel-lite" tabindex="0">
        <div class="cat-header"><h2 class="cat-title">${category}</h2></div>
        <div class="cl-track" data-role="track">${slides}</div>
        <div class="cl-dots" data-role="dots"></div>
      </section>`;
  }

  function bootCarousels(){
    (window.__CAROUSELS__||[]).forEach(c => c._autoStop());
    window.__CAROUSELS__ = [];
    document.querySelectorAll('[data-component="carousel-lite"]').forEach(rootEl => {
      const instance = new CarouselLite(rootEl, { autoplayMs: AUTOPLAY_MS, wheel: true });
      window.__CAROUSELS__.push(instance);
    });
  }

  async function loadAndRender(){
    const url = window.asset('assets/data/events/index.json') + `?v=${Date.now()}`;
    const res = await fetch(url, { cache:'no-store' });
    if (!res.ok) throw new Error('index.json não encontrado');
    const events = await res.json();

    const groups = groupBy(events, 'category_macro');
    const orderedCats = Object.keys(groups).sort((a,b)=> groups[b].length - groups[a].length);

    const wrap = document.querySelector(WRAP_SEL) || (function(){
      const m = document.querySelector('main') || document.body;
      const sec = document.createElement('section'); sec.id = 'categoryWrap';
      m.insertBefore(sec, m.firstChild.nextSibling); return sec;
    })();
    wrap.innerHTML = orderedCats.map(cat => sectionHTML(cat, groups[cat])).join('');

    const grid = document.querySelector(GRID_SEL);
    if (grid) {
      grid.innerHTML = events.map(ev => `
        <a class="card" href="${window.pageUrl('evento.html?slug='+encodeURIComponent(ev.slug))}">
          <div class="media"><img loading="lazy" src="${window.asset('assets/img/banners/'+ev.slug+'-hero.webp')}" onerror="this.onerror=null;this.src='${window.asset('assets/img/banners/'+ev.slug+'-banner.webp')}'" alt="${ev.title||ev.slug}"></div>
          <div class="body">
            <h3 class="title">${ev.title||ev.slug}</h3>
            ${ev.subtitle ? `<p class="subtitle">${ev.subtitle}</p>` : ''}
          </div>
        </a>`).join('');
    }

    bootCarousels();
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadAndRender().catch(err => console.error('Falha ao renderizar categorias:', err));
  });
})();
