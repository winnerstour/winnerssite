// assets/js/event-page-lite.js
// Página de evento: carrega assets/data/events/<slug>.json e preenche banner/title/subtitle.
// Funciona com window.asset/pageUrl se base-path.js existir; caso contrário, cria um fallback.
(function(){
  // helpers BASE fallback
  (function ensureBase(){
    if (window.asset && window.pageUrl) return;
    const parts = location.pathname.split('/').filter(Boolean);
    let base = './'; if (parts.length) base = `/${parts[0]}/`;
    window.asset = function(path){ if (path.startsWith('/')) path = path.slice(1); return base + path; };
    window.pageUrl = function(page){ if (!page) return base; if (page.startsWith('/')) page = page.slice(1); return base + page; };
  })();

  function getSlug(){ return new URLSearchParams(location.search).get('slug') || ''; }

  async function loadEvent(){
    const slug = getSlug(); if(!slug) return;
    try{
      const url = window.asset(`assets/data/events/${slug}.json`) + `?v=${Date.now()}`;
      const res = await fetch(url, { cache:'no-store' });
      if (!res.ok) throw new Error('Evento não encontrado');
      const ev = await res.json();

      const titleEl = document.getElementById('title');
      const subEl = document.getElementById('subtitle');
      const bannerEl = document.getElementById('banner');

      titleEl.textContent = ev.title || slug;
      subEl.textContent = ev.subtitle || '';

      // Banner preferencial: -banner.webp; fallback: -hero.webp
      bannerEl.src = window.asset(`assets/img/banners/${slug}-banner.webp`);
      bannerEl.alt = ev.title || slug;
      bannerEl.onerror = () => { bannerEl.src = window.asset(`assets/img/banners/${slug}-hero.webp`); };

      // Campos opcionais
      const info = document.getElementById('eventInfo');
      let hasInfo = false;
      if (ev.venue && document.getElementById('venueTxt')){ document.getElementById('venueTxt').textContent = ev.venue; hasInfo = true; }
      // datas podem vir como ev.date, ev.dates, ev.start/end — mostramos o que vier
      const dTxt = ev.date || ev.dates || (ev.start && ev.end ? `${ev.start} a ${ev.end}` : '');
      if (dTxt && document.getElementById('dateTxt')){ document.getElementById('dateTxt').textContent = dTxt; hasInfo = true; }
      if (hasInfo) info.hidden = false;
    } catch(e){
      console.error('Erro ao carregar evento:', e);
    }
  }

  document.addEventListener('DOMContentLoaded', loadEvent);
})();
