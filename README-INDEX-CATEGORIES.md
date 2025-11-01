# Index por categorias + carrossel (JS separado, CSS inline)
Arquivos neste pacote:
- `assets/js/carousel-lite.js` — carrossel leve (scroll-snap, setas, dots, autoplay).
- `assets/js/index-categories.js` — agrupa por `category_macro`, renderiza carrosséis por categoria acima do grid e mantém o grid completo.

## Como integrar no `index.html`
1) Mantenha **CSS inline** na página (você controla). Adicione este bloco no `<head>`:

```html
<style>
/* --- estilos do carrossel e das seções de categoria --- */
#categoryWrap { display:grid; gap:20px; margin:10px 0 24px; }
.cat-section { display:grid; gap:10px; background:transparent; }
.cat-header { display:flex; align-items:center; justify-content:space-between; gap:10px; }
.cat-title { margin:0; font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:.02em; }
.cat-actions { display:flex; gap:8px; }
.cl-btn { appearance:none; border:1px solid rgba(15,23,42,.12); background:#fff; color:#111827; border-radius:12px; padding:8px 12px; font-weight:800; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.cl-btn:disabled { opacity:.5; cursor:not-allowed; }

/* track + slides */
.cl-track { display:grid; grid-auto-flow:column; grid-auto-columns:100%; gap:12px;
  overflow:auto; scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; scroll-behavior:smooth; padding-bottom:6px; }
@media (min-width:640px){ .cl-track { grid-auto-columns:calc((100% - 12px)/2); } }
@media (min-width:1024px){ .cl-track { grid-auto-columns:calc((100% - 36px)/4); } } /* 4 por página */
.cl-slide { scroll-snap-align:start; }

/* card reutiliza seu visual da home */
.card { background:#fff; border:1px solid rgba(15,23,42,.08); border-radius:16px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,.06); transition:transform .15s ease, box-shadow .15s ease; display:block; }
.card:hover{ transform: translateY(-2px); box-shadow:0 8px 22px rgba(0,0,0,.08); }
.media { width:100%; aspect-ratio:3/1; background:#e5e7eb; overflow:hidden; }
.media img { width:100%; height:100%; object-fit:cover; display:block; }
.body { padding:12px 14px 14px; }
.title { margin:0 0 6px 0; font-weight:900; text-transform:uppercase; font-size:16px; }
.subtitle { margin:0; color:#46505a; font-size:.95rem; }

/* dots */
.cl-dots { display:flex; justify-content:center; align-items:center; gap:6px; }
.cl-dot { width:8px; height:8px; border-radius:999px; background:#cbd5e1; border:0; }
.cl-dot.is-active { width:22px; background:#111827; transition:.2s; }
</style>
```

2) Inclua **os scripts** **antes** de `</body>` (depois do seu autoload de eventos, se houver):
```html
<script src="./assets/js/carousel-lite.js"></script>
<script src="./assets/js/index-categories.js" defer></script>
```

3) Garanta que o `index.html` tem:
```html
<main class="container">
  <h1 class="page-title">Eventos</h1>
  <section id="categoryWrap"></section>   <!-- os carrosseis entram aqui -->
  <section id="eventsGrid" class="grid" aria-live="polite"></section> <!-- grid completo -->
</main>
```

4) O script busca `assets/data/events/index.json` e usa `category_macro` como agrupador.
   - Imagem: `<slug>-hero.webp` com fallback `<slug>-banner.webp`.
   - Link: `evento.html?slug=<slug>`.

5) Autoplay
   - Intervalo padrão: **4000ms**. Para alterar, abra `index-categories.js` e ajuste `AUTOPLAY_MS`.

## Observação
- Funciona com `window.asset()`/`window.pageUrl()` (do seu `base-path.js`). Se você não usar, o script cria um fallback que resolve para `/<repo>/` (GitHub Pages) ou `./` (Netlify/local).
