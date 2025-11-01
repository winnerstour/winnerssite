// assets/js/ux-overrides.js
(function(){
  function $(sel, ctx){ return (ctx||document).querySelector(sel); }
  function $all(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  function pickLargestTextInHeader(){
    const header = $('header'); if(!header) return null;
    const candidates = $all('h1, h2, .logo, .brand, .title, .site-title, .logo-text, span, strong', header)
      .filter(el => (el.textContent||'').trim().length >= 5);
    if(!candidates.length) return null;
    let best = null, bestSize = 0;
    for(const el of candidates){
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize)||0;
      if(size > bestSize){ best = el; bestSize = size; }
    }
    return best;
  }

  function markSiteTitle(){
    const el = pickLargestTextInHeader();
    if(el){ el.classList.add('wt-site-title'); }
  }

  function fixMenuWhats(){
    const menuEl = $all('a, button', $('header')).find(e => /menu/i.test(e.textContent||''));
    if(menuEl){ menuEl.classList.add('wt-no-stroke'); }

    const whatEl = $all('a, button', document).find(e => /whats/i.test(e.textContent||'') || /wa\.me|api\.whatsapp/i.test(e.getAttribute('href')||''));
    if(whatEl){
      whatEl.classList.add('wt-no-stroke');
      const img = whatEl.querySelector('img, svg');
      if(img){ img.classList.add('wt-whatsapp-icon'); }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    markSiteTitle();
    fixMenuWhats();
  });
})();