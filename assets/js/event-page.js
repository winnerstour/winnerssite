// event-page.js (com alteração na barra de título para texto branco com contorno)
import { bootEventCarousels } from '/assets/js/event-carousel.js';
window.addEventListener('DOMContentLoaded', ()=> bootEventCarousels());
// EVENT v5.3 — barra #FF5F2D, countdown #fff2cd (AGORA TRANSPARENTE E TEXTO VERMELHO), HERO sem textos
// Carrega HOTÉIS a partir de assets/data/venues/{venue}.json (type: "hotel") + fallbacks
(function () {
  var qs = new URLSearchParams(location.search);
  function slugFromPath() { var p = location.pathname.split('/').pop() || ''; return p.replace(/\.html$/i, '', ''); }
  function getSlug() { return (qs.get('slug') || slugFromPath() || '').toLowerCase(); }
  function upper(s) { return (s || '').toUpperCase(); }
  function isAbs(u) { return /^https?:\/\//i.test(u); }
  function norm(u) { if (!u) return ''; if (isAbs(u)) return u; if (u.charAt(0) === '/') return u; return '/' + u.replace(/^\.\//, ''); }

  (function injectBarsCSS(){
    var css = ""
+ ":root{--bar-main:#FF5F2D;--bar-count:#fff2cd;--wrap-max:1100px;--bar-dark:#111;--red-600:#dc2626;}" // Novo: --red-600
+ ".event-bar{width:100%;display:block;}"
+ ".event-bar__inner{max-width:var(--wrap-max);margin:0 auto;display:flex;align-items:center;justify-content:center;gap:12px;padding:10px 16px;font-weight:800;letter-spacing:.3px;}"
+ ".event-bar--main{background:var(--bar-main);color:#fff;text-shadow: 1px 1px 0 var(--bar-dark), -1px -1px 0 var(--bar-dark), 1px -1px 0 var(--bar-dark), -1px 1px 0 var(--bar-dark);}" // Alterado: texto para branco e adicionado contorno preto
+ ".event-bar--count{background:transparent;color:var(--bar-dark);}" // Alterado: fundo para transparente
+ ".event-bar--count .eb-text{text-transform:uppercase;}" // Adicionado: garante maiúsculas
+ ".event-bar--count .eb-text span{font-weight:900;}" // Adicionado: garante negrito
+ ".event-bar--count .count-text{color:var(--red-600);}" // Adicionado: cor vermelha (red-600) para o texto
+ ".eb-text{display:flex;align-items:center;gap:10px;flex-wrap:wrap;text-align:center;}"
+ ".eb-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.9;}"
+ "#eventTitleDateBar .title-text{font-size:clamp(16px,2vw,20px);font-weight:900;}"
+ "#countdownBar .count-text{font-size:clamp(16px,2vw,20px);font-weight:900;}";
    var tag = document.createElement('style'); tag.type = 'text/css'; tag.appendChild(document.createTextNode(css));
    document.head.appendChild(tag);
  })();

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  
  function fmtMonth(monthIndex) {
    const name = monthNames[monthIndex];
    if (name.length <= 6) { // Verifica se o nome do mês tem 6 letras ou menos
      return name; // Ex: Maio, Junho, Julho, Agosto
    }
    // Retorna a abreviação (3 primeiras letras)
    return name.substring(0, 3); // Ex: Jan, Fev, Mar
  }
  
  function fmtDateBar(ev){
    if (!ev || !ev.startDate) return ev.dateHuman || '';
    var A = new Date(ev.startDate), hasEnd = !!ev.endDate, B = hasEnd ? new Date(ev.endDate) : null;
    
    const fmtA = fmtMonth(A.getMonth());
    const dayA = String(A.getDate()).padStart(1,'0'); // Dia sem padding de 0 para 1 dígito

    if (hasEnd && !isNaN(B) && (A.getMonth()!==B.getMonth() || A.getFullYear()!==B.getFullYear())){
      const fmtB = fmtMonth(B.getMonth());
      const dayB = String(B.getDate()).padStart(1,'0');
      // Ex: 30 Mai a 1 Jun
      return `${dayA} ${fmtA} a ${dayB} ${fmtB}`; 
    } else if (hasEnd && !isNaN(B)) {
      const dayB = String(B.getDate()).padStart(1,'0');
      // Ex: 30–31 Mai
      return `${dayA}–${dayB} ${fmtA}`; 
    } else {
      // Ex: 30 Mai
      return `${dayA} ${fmtA}`;
    }
  }
  
  function normalizeEvent(ev){
    if (!ev || typeof ev!=='object') return ev;
    ev.slug       = (ev.slug || getSlug() || '').toLowerCase();
    ev.startDate  = ev.startDate  || ev.start || ev.dateISO || ev.dateStartISO || ev.start_date || null;
    ev.endDate    = ev.endDate    || ev.end   || ev.end_date || null;
    ev.dateHuman  = ev.dateHuman  || ev.date  || ev.data || '';
    ev.placeHuman = ev.placeHuman || ev.place || ev.local || ev.city_state || '';
    ev.city       = ev.city || (ev.placeHuman ? (ev.placeHuman.split(',')[0]||'') : '');
    ev.venueSlug  = ev.venueSlug || ev.venue_slug || ev.venue || ev.localSlug || null;
    return ev;
  }
  async function fetchJSON(url){ try{ var r=await fetch(url,{cache:'no-store'}); if(r.ok) return await r.json(); }catch(e){} return null; }
  async function fetchFirst(paths){ for (var i=0;i<paths.length;i++){ var j=await fetchJSON(paths[i]); if(j) return j; } return null; }
  function ensureEl(id, cls, after){ var el=document.getElementById(id); if(el) return el; el=document.createElement('div'); el.id=id; if(cls) el.className=cls; if(after&&after.parentNode){ after.parentNode.insertBefore(el, after.nextSibling); } else { document.body.appendChild(el);} return el; }

  function imageCandidatesFor(ev, venue){
    var slug = (ev.slug || getSlug()).toLowerCase();
    var arr = ['/assets/img/banners/' + slug + '-banner.webp','/assets/img/banners/' + slug + '.webp','/assets/img/banners/' + slug + '.jpg','/assets/img/banners/' + slug + '.png',ev.banner, ev.image, ev.heroImage,(ev.seo && ev.seo.image),(venue && venue.banner)];
    var out=[], seen={}; for (var i=0;i<arr.length;i++){ var u=arr[i]; if(!u) continue; u=norm(u); if(!seen[u]){ seen[u]=1; out.push(u);} } out.push('/assets/img/banners/placeholder-hero.webp'); return out;
  }
  function renderHero(ev, venue){
    ev = normalizeEvent(ev);
    var hero   = document.querySelector('.hero');
    var heroBg = document.getElementById('heroBg');
    if (hero) hero.style.backgroundColor = '#000';
    if (!heroBg) return;
    var ov = document.querySelector('.hero-overlay'); if (ov) ov.style.display='none';
    heroBg.style.filter = 'none';
    heroBg.style.backgroundImage = 'none';
    heroBg.innerHTML = '';
    var wrap = document.createElement('div'); wrap.className = 'hero-wrap';
    var img = document.createElement('img'); img.id = 'heroImg'; img.alt = (ev.title || ev.shortTitle || 'Evento');
    var cands = imageCandidatesFor(ev, venue);
    var idx = 0; function tryNext(){ if(idx>=cands.length) return; img.src = cands[idx++]; }
    img.onerror = tryNext; tryNext(); img.loading = 'eager'; img.decoding = 'async';
    wrap.appendChild(img); heroBg.appendChild(wrap);
    var $title = document.getElementById('evTitle'); if ($title) $title.style.display = 'none';
    var $sub   = document.getElementById('evSubtitle'); if ($sub) $sub.style.display = 'none';
  }

  function ensureTitleDateBar(ev){
    var hero = document.querySelector('.hero'); if (!hero) return;
    if (document.getElementById('eventTitleDateBar')) return;
    var bar = document.createElement('div');
    bar.id = 'eventTitleDateBar'; bar.className = 'event-bar event-bar--main';
    // Alterado o HTML para que a data também use a classe de título
    bar.innerHTML = '<div class="event-bar__inner"><div class="eb-text"><span class="title-text" id="ebTitle"></span><span class="eb-dot"></span><span class="title-text" id="ebDate"></span></div></div>';
    hero.parentNode.insertBefore(bar, hero.nextSibling);
    var t = upper(ev.title || ev.shortTitle || 'EVENTO'); var d = fmtDateBar(ev);
    var tNode = document.getElementById('ebTitle'); if (tNode) tNode.textContent = t;
    var dNode = document.getElementById('ebDate');  if (dNode) dNode.textContent = d;
  }
  function ensureCountdownBar(){
    var hotelCarousel = document.getElementById('hotel-carousel'); // Novo ponto de âncora
    if (!hotelCarousel) return; // Se o carrossel de hotéis não existir, não insere.
    if (document.getElementById('countdownBar')) return;
    var bar = document.createElement('div');
    bar.id = 'countdownBar'; bar.className = 'event-bar event-bar--count';
    bar.innerHTML = '<div class="event-bar__inner"><div class="eb-text"><span class="count-text" id="ebCountText">CONTAGEM REGRESSIVA! FALTAM -- DIAS</span></div></div>';
    hotelCarousel.parentNode.insertBefore(bar, hotelCarousel);
  }
  function startCountdown(ev){
    ev = normalizeEvent(ev); var startISO = ev.startDate || null; if (!startISO) return;
    ensureCountdownBar();
    var $txt = document.getElementById('ebCountText');
    function daysLeft(){ var now = new Date(); var target = new Date(startISO); var ms = target - now; return Math.max(0, Math.ceil(ms / 86400000)); }
    function tick(){ var d = daysLeft(); if ($txt) $txt.textContent = 'CONTAGEM REGRESSIVA! FALTAM ' + d + ' DIAS'; }
    tick(); setInterval(tick, 21600000);
  }

  async function loadReasons(ev){
    if (Array.isArray(ev.reasons) && ev.reasons.length) return ev.reasons;
    if (Array.isArray(ev.motivos) && ev.motivos.length) return ev.motivos;
    var tries = [
      '/assets/data/reasons/'+ev.slug+'.json','assets/data/reasons/'+ev.slug+'.json',
      '/data/reasons/'+ev.slug+'.json','data/reasons/'+ev.slug+'.json'
    ];
    for (var i=0;i<tries.length;i++){
      var j = await fetchJSON(tries[i]);
      if (j){ if (Array.isArray(j)) return j; if (j.reasons && Array.isArray(j.reasons)) return j.reasons; if (j.motivos && Array.isArray(j.motivos)) return j.motivos; }
    }
    return [];
  }
  function renderReasons(reasons){
    var section = document.getElementById('motivos-carousel'); // Mostrar a seção do carrossel se houver motivos
    if (section) section.style.display = (reasons && reasons.length) ? 'block' : 'none';
    
    // Altera o título dinâmico da seção de motivos
    var motivosTitle = document.getElementById('motivosTitle');
    var evTitle = (document.getElementById('evTitle') && document.getElementById('evTitle').textContent) || 'EVENTO';
    
    // Evita usar o "TÍTULO" padrão se ele ainda não foi preenchido
    if (motivosTitle && evTitle && evTitle !== 'TÍTULO'){
        motivosTitle.textContent = '6 MOTIVOS PRA IR À ' + evTitle.toUpperCase();
    }
  }

  (async function init(){
    var slug = getSlug();
    var ev = await fetchFirst(['/assets/data/events/'+slug+'.json','assets/data/events/'+slug+'.json','/assets/data/'+slug+'.json','/data/events/'+slug+'.json','/data/'+slug+'.json']);
    if (!ev){ console.error('Evento não encontrado:', slug); return; }
    var venue = null; var venueSlug = (ev.venueSlug || ev.venue_slug || ev.venue || ev.localSlug || null);
    if (venueSlug){ venue = await fetchFirst(['/assets/data/venues/'+venueSlug+'.json','assets/data/venues/'+venueSlug+'.json','/data/venues/'+venueSlug+'.json']); }
    renderHero(ev, venue); ensureTitleDateBar(normalizeEvent(ev));
    startCountdown(ev);
    try{ var reasons = await loadReasons(normalizeEvent(ev)); renderReasons(reasons); }catch(e){ console.warn('Motivos não carregados', e); }
  })();
})();