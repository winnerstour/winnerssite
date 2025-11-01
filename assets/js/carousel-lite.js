// assets/js/carousel-lite.js
// Minimal horizontal carousel: scroll-snap based, arrows, dots, autoplay, pause on hover.
// Usage: new CarouselLite(rootEl, { autoplayMs: 4000, slidesPerView: {default:1, md:3, lg:4} })
(function(global){
  function qs(sel, ctx){ return (ctx||document).querySelector(sel); }
  function qsa(sel, ctx){ return Array.from((ctx||document).querySelectorAll(sel)); }

  function CarouselLite(root, opts){
    this.root = root;
    this.opts = Object.assign({
      autoplayMs: 4000,
      pauseOnHover: true,
      dots: true
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
      if (e.key === 'ArrowRight') { e.preventDefault(); self._next(); self._autoReset(); }
    });

    // Sync on scroll/resize
    let t;
    this.track.addEventListener('scroll', function(){
      clearTimeout(t);
      t = setTimeout(function(){ self._updateUI(self._idxFromScroll()); }, 100);
    });
    new ResizeObserver(function(){ self._updateUI(self._idxFromScroll()); }).observe(this.track);
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
      qsa('.cl-dot', this.dotsEl).forEach(function(d, idx){
        d.classList.toggle('is-active', idx === i);
        d.setAttribute('aria-current', idx === i ? 'true':'false');
      });
    }
  };

  CarouselLite.prototype._auto = function(){
    const self = this;
    if (!this.opts.autoplayMs) return;
    this._autoStop();
    this.timer = setInterval(function(){
      const slides = self._slides();
      if (!slides.length) return;
      const nextIdx = self._idxFromScroll()+1;
      if (nextIdx >= slides.length) {
        // loop para o início
        self._goTo(0);
      } else {
        self._goTo(nextIdx);
      }
    }, this.opts.autoplayMs);
  };

  CarouselLite.prototype._autoStop = function(){
    if (this.timer){ clearInterval(this.timer); this.timer = null; }
  };

  CarouselLite.prototype._autoReset = function(){
    this._autoStop();
    this._auto();
  };

  global.CarouselLite = CarouselLite;
})(window);
