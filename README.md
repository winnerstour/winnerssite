# Netlify Package — Eventos dinâmicos

## O que é
Funções serverless que **listam** e **entregam** eventos direto da pasta `data/events/*.json` e banners em `assets/img/banners/`, **sem manifest manual** e **sem editar HTML**.

## Estrutura esperada do projeto
```
/data/events/*.json            # seus arquivos de evento (slug == nome do arquivo)
/assets/img/banners/{slug}-banner.webp (ou .jpg/.jpeg/.png)
/index.html
/evento.html
/netlify/functions/events.js
/netlify/functions/event.js
/netlify.toml
```

## Como usar
1. Copie a pasta `netlify/` e `netlify.toml` para a raiz do seu site.
2. Publique no Netlify (ou rode local com `netlify dev`).

Rotas disponíveis:
- `GET /api/events` → lista todos (gera cards)
- `GET /api/event?slug={slug}` → JSON do evento

## Patch rápido no front

### index.html
```html
<script>
(async () => {
  const r = await fetch("/api/events");
  const { events } = await r.json();
  window.__EVENTS = events;
  if (typeof renderEventCards === "function") renderEventCards(events);
})();
</script>
```

### evento.html
```html
<script>
function getSlug(){ return new URLSearchParams(location.search).get("slug")||""; }
(async () => {
  const slug = getSlug(); if(!slug) return;
  const r = await fetch(`/api/event?slug=${encodeURIComponent(slug)}`);
  if (!r.ok) return console.error("Evento não encontrado");
  const ev = await r.json();
  window.__EVENT = ev;
  if (typeof hydrateEventPage === "function") hydrateEventPage(ev);
})();
</script>
```

## Local (opcional)
- Instale o Netlify CLI: `npm i -g netlify-cli`
- Rode: `netlify dev` (na raiz do projeto)
- Acesse: `http://localhost:8888/api/events`
