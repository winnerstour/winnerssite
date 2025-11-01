// event-carousel.js (v15.7 - Corrigido: TypeError, Borda Dinâmica, Descrição Formatada)
function q(k){return new URLSearchParams(location.search).get(k)||"";}
async function loadJSON(url){ const r=await fetch(url,{cache:"no-store"}); if(!r.ok) throw new Error(url+" "+r.status); return r.json(); }
const DATA_BASE="/assets/data";
const IMG_FALLBACK="data:image:png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqMBR2F2kXUAAAAASUVORK5CYII=";

const Icons={plane:`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2.5 19l8-7-8-7 1.5-1 10 8 7-6v4l-7 6-10 8z"/></svg>`,
bed:`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 10h-8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10h2v-3h16v3h2v-6a2 2 0 00-2-2zM5 7h6v3H5V7z"/></svg>`,
brief:`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M10 4h4a2 2 0 012 2v2h4a1 1 0 011 1v3H3V9a1 1 0 011-1h4V6a2 2 0 012-2zm4 4V6h-4v2h4zM3 13h18v5a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"/></svg>`,
king:`<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2l2 3 3-2 1 3 3-1-2 3 3 2-3 1 1 3-3-2-2 3-2-3-3 2 1-3-3-1 3-2-2-3 3 1 1-3 3 2zM6 20h12v2H6z"/></svg>`,
bulb:`<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M9 21h6v-1H9v1zm3-20a7 7 0 00-4 12.9V17h8v-3.1A7 7 0 0012 1z"/></svg>`};

// Mapeamento de cor da borda baseado na Categoria (1 a 4)
const categoryColors = {
    1: 'border: 2px solid #3b82f6;', // Bate e Volta (Azul)
    2: 'border: 2px solid #10b981;', // Econômico (Verde)
    3: 'border: 2px solid #f97316;', // Conforto/Produtividade (Laranja)
    4: 'border: 2px solid #ef4444;', // VIP/Diretoria (Vermelho)
};

// Modificação: Garante que 'tag' seja string e trata o caso onde é um número (como a categoria)
function iconForTag(tag){
    const tagStr = String(tag || "").toLowerCase();
    
    if(tagStr.includes("bate") || tagStr === '1') return {svg:Icons.plane, cls:"text-blue-600", btn:"bg-blue-600 hover:bg-blue-800", border_color:"#3b82f6"}; 
    if(tagStr.includes("business") || tagStr === '3') return {svg:Icons.brief, cls:"text-orange-600", btn:"bg-orange-600 hover:bg-orange-800", border_color:"#f97316"}; 
    if(tagStr.includes("executive")||tagStr.includes("king") || tagStr === '4') return {svg:Icons.king, cls:"text-red-600", btn:"bg-red-600 hover:bg-red-800", border_color:"#ef4444"}; 
    // Padrão (Econômico) ou categoria 2
    return {svg:Icons.bed, cls:"text-yellow-600", btn:"bg-yellow-600 hover:bg-yellow-800", border_color:"#10b981"};
}
const safeImg=(src)=> (src && typeof src==='string') ? src : IMG_FALLBACK;

function hotelCard(h){
  const stars=h.stars?`${h.stars}☆ `:""; 
  
  const category = h.category || 2; 
  const ic = iconForTag(category);
  const title=`${stars}${h.name||"Hotel"}`;
  
  const url = h.book_url || h.url || '#';
  const slug=h.id || '';
  const hotelImgSrc = `/assets/img/hotels/${slug}.webp`;
  const coverStyleInline = categoryColors[category] || categoryColors[2];
  
  // 1. Formatação da Descrição e Informações combinadas:
  const distanceInfo = h.distance_min ? `<em>Distância: ${h.distance_min} min</em>` : '';
  const nightlyFrom = h.nightly_from_brl ? `R$ ${h.nightly_from_brl} / noite.` : 'Sob consulta';
  const priceInfo = `<strong>Diárias: a partir de ${nightlyFrom}</strong>`;
  const desc = h.description || 'Informações de acomodação indisponíveis.';
  
  const combinedInfo = `
    ${desc} 
    <br> 
    ${distanceInfo} 
    — 
    ${priceInfo}
  `;

  // 2. Aplica as bordas arredondadas na imagem de capa
  return `<article class="hotel-card shrink-0 mr-4 p-4 text-center flex flex-col items-center">
    <div class="aspect-[2/3] bg-neutral-100 rounded-xl mb-3 flex items-center justify-center text-neutral-500 overflow-hidden" style="${coverStyleInline}; border-radius: 12px;">
      <img src="${hotelImgSrc}" alt="${h.name||''}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${safeImg(h.image)}'">
    </div>
    <div class="flex items-center justify-center gap-2 mb-1">
        <h3 class="title-font whitespace-nowrap truncate text-[0.95rem] md:text-[1.05rem] leading-none font-extrabold">${title}</h3>
    </div>
    
    <p class="hotel-card-body-text section-lead text-sm leading-snug flex-1">${combinedInfo}</p> 

    <a href="${url}" class="mt-3 w-full rounded-xl ${ic.btn} text-white py-2 text-sm inline-block text-center tracking-wide font-semibold uppercase">RESERVAR</a>
  </article>`;
}
function motivoCard(m){
  // Removido 'text-center' dos elementos para confiar 100% no base.css e evitar conflito com classes utilitárias
  // O padding-left/right do motivoCard também foi removido para facilitar a centralização
  return `<article class="motivo shrink-0 mr-4 p-6 rounded-2xl bg-white shadow-sm">
    <div class="mb-2 motivo__emoji">${m.emoji || '💡'}</div>
    <h3 class="title-font truncate text-[0.95rem] md:text-[1.05rem] leading-none font-extrabold motivo__title">${m.title||''}</h3>
    <p class="text-sm text-gray-700 leading-relaxed motivo__text">${m.text||''}</p>
  </article>`;
}


// --- FUNÇÕES DE RENDERIZAÇÃO (MOVIDAS PARA CIMA PARA GARANTIR DEFINIÇÃO) ---
function renderHotels(hotels){ const track=document.querySelector('#track'); if(!track) return;
  const arr=Array.isArray(hotels)?hotels.filter(h => h.type === 'hotel' || h.type === 'daytrip').slice(0,8):[]; 
  track.innerHTML=arr.map(hotelCard).join(''); 
}
function renderMotivos(motivos){ const track=document.querySelector('#track2'); if(!track) return;
  const arr=Array.isArray(motivos)?motivos:[]; track.innerHTML=arr.map(motivoCard).join('');
}
// --------------------------------------------------------------------------


// LÓGICA DE CARROSSEL REESCRITA PARA MOVIMENTO LINEAR/CIRCULAR HÍBRIDO
function wireCarousel(trackSel, prevSel, nextSel){
  const track=document.querySelector(trackSel), prev=document.querySelector(prevSel), next=document.querySelector(nextSel); 
  if(!track||!prev||!next) return;
  const slides=()=>[...track.querySelectorAll('article.shrink-0')]; 
  let index=0; // Índice do primeiro item visível
  let autoplayInterval;

  // Calcula a largura exata de um único slide (incluindo margem/gap)
  function slideWidth(){ 
      const el=slides()[0]; 
      if(!el) return 0; 
      const rect=el.getBoundingClientRect(); 
      // Assume-se que o gap é 1rem (16px) como definido no CSS #track
      const gap=16; 
      const mr=parseFloat(getComputedStyle(el).marginRight||0)||0;
      return rect.width + Math.max(gap, mr);
  }

  // Estima o número de slides visíveis para calcular o limite
  function getVisibleCount(trackElement) {
    const slide = slides()[0];
    if (!slide) return 1;
    // Pega a largura do container visível
    const containerWidth = trackElement.clientWidth;
    const slideW = slide.offsetWidth; 
    // Calcula quantos slides cabem (arredonda para baixo)
    const visibleCount = Math.floor(containerWidth / slideW);
    // Para telas menores, onde visibleCount é 1 (ou menos), garantimos 1
    return Math.max(1, visibleCount);
  }

  function update(noAnim=false){ 
      const w=slideWidth(); 
      const total = slides().length;
      const visible = getVisibleCount(track);
      
      // O maxIndex é o último índice do primeiro item do grupo visível.
      const maxIndex = Math.max(0, total - visible); 
      const isMobileView = (visible === 1); // Considera mobile se apenas 1 item é visível

      // Garante que o index não passe de maxIndex
      index = Math.min(index, maxIndex);
      
      if(w<=0) return; 
      if(noAnim) track.style.transition='none'; 
      
      // Translação: move o track pela largura do slide individual * o índice
      track.style.transform=`translateX(-${index * w}px)`; 
      if(noAnim) requestAnimationFrame(()=>track.style.transition='transform 200ms ease'); 

      // Controla a visibilidade dos botões
      if (isMobileView) {
          // No mobile (circular), botões sempre visíveis (controle feito na lógica go())
          prev.style.display = 'flex';
          next.style.display = 'flex';
      } else {
          // No desktop (linear), trava os botões no início e fim
          prev.style.display = (index > 0) ? 'flex' : 'none';
          next.style.display = (index < maxIndex) ? 'flex' : 'none';
      }
  }
  
  // Função de movimento linear (desktop) ou circular (mobile)
  function go(d){ 
      const total=slides().length; 
      if(total===0) return; 
      
      let newIndex = index + d;
      const visible = getVisibleCount(track);
      const maxIndex = Math.max(0, total - visible); 
      const isMobileView = (visible === 1);

      if (isMobileView) {
          // Lógica Circular (Mobile)
          index = (newIndex + total) % total; 
      } else {
          // Lógica Linear (Desktop)
          newIndex = Math.max(0, Math.min(newIndex, maxIndex));
          if (newIndex !== index) {
            index = newIndex;
          } else {
            // Se travou no desktop, não faz nada
            return;
          }
      }
      
      update(); 
  }
  
  // --- Autoplay Logic ---
  function startAutoplay() {
    stopAutoplay(); // Limpa anterior
    autoplayInterval = setInterval(() => {
        const total = slides().length;
        if (total === 0) return;
        
        const visible = getVisibleCount(track);
        const maxIndex = Math.max(0, total - visible); 
        const isMobileView = (visible === 1);

        if (isMobileView) {
            // Mobile (Circular): Avança para o próximo (volta ao 0 se no último)
            index = (index + 1) % total;
        } else {
            // Desktop (Linear): Avança, mas volta ao 0 quando chega no final visível (maxIndex)
            index = (index + 1) % (maxIndex + 1); // Garante que volte ao 0 após o maxIndex
        }
        update();
    }, 6000); // 6 segundos
  }

  function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
  }

  // EVENT LISTENERS
  prev.addEventListener('click',() => { stopAutoplay(); go(-1); }); 
  next.addEventListener('click',() => { stopAutoplay(); go(1); }); 
  
  // Reinicia Autoplay após o usuário interagir (opcional, aqui desliga)
  track.addEventListener('mouseover', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay); // Reinicia ao tirar o mouse

  window.addEventListener('resize',()=>update(true)); 
  
  // Inicialização
  setTimeout(()=>update(true), 0);
  startAutoplay();
}

export async function bootEventCarousels(){
  const slug=q('slug'); if(!slug){ console.warn('Sem ?slug='); return; }
  let ev={}; try{ ev=await loadJSON(`${DATA_BASE}/events/${slug}.json`); }catch(e){ console.warn('events json', e); }
  const venueSlug=ev.venue_slug||ev.venue||''; let venue={};
  if(venueSlug){ try{ venue=await loadJSON(`${DATA_BASE}/venues/${venueSlug}.json`); }catch(e){ console.warn('venues json', e); } }
  const hotels = venue.hotels || [];
  renderHotels(hotels);
  renderMotivos(ev.motivos||[]);
  
  // garantir posicionamento relativo mesmo sem CSS
  try{document.getElementById('hotel-carousel').style.position='relative';}catch(e){}
  try{document.getElementById('motivos-carousel').style.position='relative';}catch(e){}
  
  // Inicializa a navegação
  wireCarousel('#track','#prevBtn','#nextBtn');
  wireCarousel('#track2','#prevBtn2','#nextBtn2');
}