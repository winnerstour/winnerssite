// assets/js/carousel-lite.js
// Minimal carousel: snap per page, dots, autoplay, pause on hover, keyboard, drag, wheel.
// Arrows are optional (not required in your case). Hide scrollbars via CSS in page.
(function(global){
  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  function debounce(fn, ms){ let t; return function(){ clearTimeout(t); t=setTimeout(fn, ms); }; }

  function CarouselLite(root, opts){
    this.root = root;
    this.opts = Object.assign({
      autoplayMs: 4000,
      pauseOnHover: true,
      dots: true,
      wheel: true
    }, opts || {});
    this.track  = qs('[data-role="track"]', root);
    this.prev   = qs('[data-action="prev"]', root);
    this.next   = qs('[data-action="next"]', root);
    this.dotsEl = qs('[data-role="dots"]', root);
    this.timer  = null;
    this._bind();
    this._buildDots();
    this._updateUI();
    this._auto();
  }

  CarouselLite.prototype._slides = function(){
    return qsa('[data-role="slide"]', this.root);
  };

  CarouselLite.prototype._idxFromScroll = function(){
    if (!this.track) return 0;
    return Math.round(this.track.scrollLeft / this.track.offsetWidth);
  };

  CarouselLite.prototype._goTo = function(i){
    const slides = this._slides();
    const clamped = Math.max(0, Math.min(i, slides.length-1));
    const x = clamped * this.track.offsetWidth;
    this.track.scrollTo({ left: x, behavior: 'smooth' });
    this._updateUI(clamped);
  };

  CarouselLite.prototype._next = function(){ this._goTo(this._idxFromScroll()+1); };
  CarouselLite.prototype._prev = function(){ this._goTo(this._idxFromScroll()-1); };

  CarouselLite.prototype._bind = function(){
    const self = this;
    if (this.prev) this.prev.addEventListener('click', function(){ self._prev(); self._autoReset(); });
    if (this.next) this.next.addEventListener('click', function(){ self._next(); self._autoReset(); });

    // Pause on hover
    if (this.opts.pauseOnHover){
      this.root.addEventListener('mouseenter', function(){ self._autoStop(); });
      this.root.addEventListener('mouseleave', function(){ self._auto(); });
    }

    // Keyboard
    this.root.addEventListener('keydown', function(e){
      if (e.key === 'ArrowLeft')  { e.preventDefault(); self._prev(); self._autoReset(); }
      if (e.key === 'ArrowRight'){ e.preventDefault(); self._next(); self._autoReset(); }
    });

    // Drag / swipe
    let isDown = false, startX = 0, startScroll = 0;
    this.track.addEventListener('pointerdown', (e) => {
      isDown = true; startX = e.clientX; startScroll = this.track.scrollLeft;
      this.track.setPointerCapture(e.pointerId);
      this.root.classList.add('is-dragging');
    });
    this.track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      this.track.scrollLeft = startScroll - dx;
    });
    const snapAfterDrag = () => { if (!isDown) this._goTo(this._idxFromScroll()); };
    this.track.addEventListener('pointerup',   () => { isDown=false; this.root.classList.remove('is-dragging'); snapAfterDrag(); });
    this.track.addEventListener('pointercancel',() => { isDown=false; this.root.classList.remove('is-dragging'); });

    // Wheel (principal interação no desktop)
    if (this.opts.wheel){
      const snapAfterWheel = debounce(() => { this._goTo(this._idxFromScroll()); }, 120);
      this.track.addEventListener('wheel', (e) => {
        // horizontal scroll com a roda; prevenimos o scroll da página
        e.preventDefault();
        const delta = (Math.abs(e.deltaY) > Math.abs(e.deltaX)) ? e.deltaY : e.deltaX;
        this.track.scrollLeft += delta;
        snapAfterWheel();
        this._autoReset();
      }, { passive: false });
    }

    // Sync on scroll/resize
    let t;
    this.track.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => this._updateUI(this._idxFromScroll()), 100);
    });
    new ResizeObserver(() => this._updateUI(this._idxFromScroll())).observe(this.track);
  };

  CarouselLite.prototype._buildDots = function(){
    if (!this.dotsEl) return;
    const slides = this._slides();
    this.dotsEl.innerHTML = '';
    for (let i=0;i<slides.length;i++){
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cl-dot';
      b.setAttribute('aria-label', 'Ir para slide '+(i+1));
      b.addEventListener('click', this._goTo.bind(this, i));
      this.dotsEl.appendChild(b);
    }
  };

  CarouselLite.prototype._updateUI = function(activeIdx){
    const i = (typeof activeIdx === 'number') ? activeIdx : this._idxFromScroll();
    if (this.prev) this.prev.disabled = (i === 0);
    const slides = this._slides();
    if (this.next) this.next.disabled = (i >= slides.length-1);
    if (this.dotsEl){
      qsa('.cl-dot', this.dotsEl).forEach((d, idx) => {
        d.classList.toggle('is-active', idx === i);
        d.setAttribute('aria-current', idx === i ? 'true':'false');
      });
    }
  };

  CarouselLite.prototype._auto = function(){
    if (!this.opts.autoplayMs) return;
    this._autoStop();
    this.timer = setInterval(() => {
      const slides = this._slides();
      if (!slides.length) return;
      const nextIdx = this._idxFromScroll()+1;
      if (nextIdx >= slides.length) this._goTo(0);
      else this._goTo(nextIdx);
    }, this.opts.autoplayMs);
  };

  CarouselLite.prototype._autoStop = function(){
    if (this.timer){ clearInterval(this.timer); this.timer = null; }
  };
  CarouselLite.prototype._autoReset = function(){ this._autoStop(); this._auto(); };

  global.CarouselLite = CarouselLite;
})(window);
