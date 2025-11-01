// INDEX v6.1 — Contorno Branco na TopBar
(function(){
  function isAbs(u){ return /^https?:\/\//i.test(u); }
  function norm(u){ if(!u) return ''; if (isAbs(u)) return u; if (u.charAt(0)=='/') return u; return '/' + u.replace(/^\.\//,''); }

  function injectCSS(){
    var css = ""
+ ":root{--topbar-bg:#FF6D2D;--topbar-fg:#fff;--ring:#222;--ring-offset:#fff;--grid-gap:24px;--wrap:1920px;--side-pad:12px;}"
+ "body{--card-radius:16px;}"
+ ".wt-header{display:none!important;}"
+ ".container, .content, .site-container, .page-wrap, .wrap, .inner, main, .main, .section, .sections, .page-content, .wt-container, .wt-content, .wt-main, .events-section, #events, #eventsSection, #eventsWrapper{max-width:var(--wrap); width:calc(100% - (var(--side-pad)*2)); margin-left:auto; margin-right:auto; padding-left:var(--side-pad); padding-right:var(--side-pad);}"
+ ".topbar{position:sticky;top:0;z-index:60;background:var(--topbar-bg);color:var(--topbar-fg);}"
+ ".topbar__inner{max-width:var(--wrap);margin:0 auto;display:flex;align-items:center;justify-content:center;padding:10px var(--side-pad);gap:12px; position:relative;" 
+ "color: #fff; text-shadow: 1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;}" // NOVO: Aplica contorno branco no texto da barra
+ ".menu-area{position:absolute;left:var(--side-pad);display:flex;align-items:center;gap:10px;}"
+ ".menu-button{display:flex;align-items:center;gap:10px;cursor:pointer;}"
+ ".menu-button .burger{position:relative;width:22px;height:14px;}"
+ ".menu-button .burger:before,.menu-button .burger:after,.menu-button .burger div{content:'';position:absolute;left:0;right:0;height:2px;background:var(--topbar-fg);}"
+ ".menu-button .burger:before{top:0;}"
+ ".menu-button .burger div{top:6px;}"
+ ".menu-button .burger:after{bottom:0;}"
+ ".menu-label{font-weight:800;color:var(--topbar-fg);}"
+ ".logo-center{font-weight:900;letter-spacing:.3px;}"
+ ".topbar__cta{position:absolute;right:var(--side-pad);display:flex;align-items:center;gap:10px;}"
+ ".btn{display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:9999px;font-weight:900;letter-spacing:.15px;line-height:1; text-decoration:none;}"
+ ".btn:focus{outline:2px solid var(--ring); outline-offset:2px;}"
+ ".btn-whatsapp{background:#10B160;color:#fff;}"
+ ".btn-whatsapp:hover{background:#0e9b54; transform:translateY(-1px);}"
+ ".btn-whatsapp:active{transform:translateY(0);}"
+ ".btn-whatsapp .label{ text-transform:uppercase; font-size:12px; }"
+ ".btn-whatsapp svg{width:16px;height:16px;display:block; flex-shrink:0;}"
+ "#eventsGrid,#eventGrid{display:grid;gap:var(--grid-gap);grid-template-columns:1fr;align-items:start;}"
+ "@media(min-width:700px){#eventsGrid,#eventGrid{grid-template-columns:repeat(2,1fr);} }"
+ "@media(min-width:1024px){#eventsGrid,#eventGrid{grid-template-columns:repeat(3,1fr);} }"
+ "@media(min-width:1280px){#eventsGrid,#eventGrid{grid-template-columns:repeat(4,1fr);} }"
+ ".card{border-radius:var(--card-radius); overflow:hidden; position:relative; outline:2px solid transparent; outline-offset:2px; transition:outline-color .15s, box-shadow .15s;}"
+ ".card:focus,.card:hover{ outline-color: var(--ring); box-shadow: 0 0 0 4px var(--ring-offset); }"
+ ".card__cover{position:relative; width:100%; aspect-ratio:16/9; overflow:hidden; background:#fff; border-top-left-radius:inherit; border-top-right-radius:inherit;}"
+ ".card__img{position:absolute; inset:0; width:100%; height:100%; display:block; object-fit:cover; object-position:center center;}"
+ ".card__body{padding:10px 14px 14px;}"
+ ".card__title{font-weight:900;margin:2px 0 6px;}"
+ ".card__desc{color:#444; line-height:1.35; margin:0;}";
    var s=document.createElement('style'); s.appendChild(document.createTextNode(css)); document.head.appendChild(s);
  }

  function ensureTopBar(){
    if (document.getElementById('indexTopBar')) return;
    var bar = document.createElement('div'); bar.id='indexTopBar'; bar.className='topbar';
    bar.innerHTML = '<div class="topbar__inner">'
      + '<div class="menu-area">'
      +   '<div class="menu-button" id="menuBtn"><div class="burger"><div></div></div><span class="menu-label">MENU</span></div>'
      + '</div>'
      + '<div class="logo-center">WINNERS TOUR</div>'
      + '<div class="topbar__cta">'
      +   '<a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/5541999450111?text=Ol%C3%A1!%20Quero%20ajuda%20com%20minha%20reserva%20ou%20um%20or%C3%A7amento.">'
      +     '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M19.11 17.26c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.64.14-.19.29-.73.9-.9 1.09-.17.19-.35.21-.64.07-.28-.14-1.17-.43-2.22-1.37-.82-.73-1.38-1.63-1.54-1.91-.16-.29-.02-.45.12-.59.12-.12.28-.31.42-.47.14-.16.19-.28.28-.47.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.1-.23-.56-.47-.48-.64-.49l-.55-.01c-.19 0-.5.07-.76.36s-.99.97-.99 2.36 1.02 2.74 1.16 2.93c.14.19 2 3.05 4.84 4.28.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.64-.67 1.87-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.53-.33zM16.05 3C9.93 3 5 7.93 5 14.05c0 2.34.68 4.53 1.85 6.37L5 29l8.81-1.83c1.79 1.1 3.9 1.74 6.24 1.74 6.12 0 11.05-4.93 11.05-11.05S22.17 3 16.05 3z"/></svg>'
      +     '<span class="label">WHATSAPP</span>'
      +   '</a>'
      + '</div>'
      + '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function nukeOldHeader(){
    var remove = function(){
      document.querySelectorAll('header.wt-header, .wt-header').forEach(function(h){
        if (h && h.parentNode) h.parentNode.removeChild(h);
      });
    };
    remove();
    var mo = new MutationObserver(remove);
    mo.observe(document.documentElement, {childList:true, subtree:true});
  }

  async function tryFetch(paths){
    for (var i=0;i<paths.length;i++){
      try{ var r=await fetch(paths[i],{cache:'no-store'}); if(r.ok){ return await r.json(); } }catch(e){}
    }
    return null;
  }
  async function loadEvents(){
    var j = await tryFetch(['/assets/data/events.json','data/events.json','/data/events.json','/assets/data/events/index.json','assets/data/events/index.json','/assets/data/events-list.json','/assets/data/list.json']);
    if (j){ if (Array.isArray(j)) return j; if (Array.isArray(j.events)) return j.events; }
    if (Array.isArray(window.__EVENTS)) return window.__EVENTS;
    var man = await tryFetch(['/assets/data/manifest.json','assets/data/manifest.json']);
    if (man && Array.isArray(man.events)) return man.events;
    return [];
  }
  function imageCandidates(ev){
    var slug=(ev.slug||ev.id||'').toLowerCase();
    var arr=['/assets/img/banners/'+slug+'-banner.webp','/assets/img/banners/'+slug+'.webp','/assets/img/banners/'+slug+'.jpg','/assets/img/banners/'+slug+'.png',ev.banner,ev.image,ev.cardImage,(ev.seo&&ev.seo.image)];
    var out=[],seen={}; for (var i=0;i<arr.length;i++){ var u=arr[i]; if(!u) continue; u=norm(u); if(!seen[u]){seen[u]=1; out.push(u);} } out.push('/assets/img/banners/placeholder.webp'); return out;
  }
  function buildCard(ev){
    var slug=(ev.slug||ev.id||'').toLowerCase();
    var href=ev.url||('event.html?slug='+encodeURIComponent(slug));
    var when=ev.dateShort||ev.dateHuman||ev.date||'';
    var desc=ev.subtitle||ev.tagline||ev.description||'';
    var title=ev.title||ev.name||slug;
    var cands=imageCandidates(ev); var first=cands[0], rest=cands.slice(1);
    return '<a class="card" href="'+href+'" tabindex="0">'
      + '<div class="card__cover"><img class="card__img" alt="'+title+'" src="'+first+'" data-fallback="'+rest.join('|')+'" loading="lazy"></div>'
      + '<div class="card__body"><div class="card__title">'+title+'</div><p class="card__desc">'+(when? ('<strong>'+when+'</strong> — ') : '')+desc+'</p></div>'
      + '</a>';
  }
  function wireFallbacks(scope){
    var imgs=(scope||document).querySelectorAll('img.card__img[data-fallback]');
    imgs.forEach(function(img){
      img.onerror=function(){ var list=(img.getAttribute('data-fallback')||'').split('|').filter(Boolean); if(!list.length) return; var next=list.shift(); img.setAttribute('data-fallback', list.join('|')); img.src=next; };
    });
  }

  (async function init(){
    injectCSS();
    nukeOldHeader();
    ensureTopBar();
    var grid=document.getElementById('eventsGrid') || document.getElementById('eventGrid');
    if (!grid){ console.warn('eventsGrid não encontrado'); return; }
    var list=await loadEvents();
    grid.innerHTML=list.map(buildCard).join(''); wireFallbacks(grid);
  })();
})();