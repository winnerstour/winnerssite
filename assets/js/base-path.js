// assets/js/base-path.js
// Resolve BASE path para GitHub Pages (ex.: /winnerssite/) ou raiz local.
// Retorna algo tipo "/winnerssite/" ou "./" quando adequado.
(function () {
  const seg = location.pathname.split('/').filter(Boolean);
  // Caso padrão de GitHub Pages de projeto: https://user.github.io/<repo>/...
  // seg[0] é o <repo> (ex.: 'winnerssite')
  let BASE = './';
  if (seg.length > 0) {
    // Evita duplicar quando já estiver no nível do repo
    BASE = `/${seg[0]}/`;
  }
  // Se estiver na raiz (ex.: custom domain) e não houver seg[0], mantemos "./"
  window.__BASE_PATH__ = BASE;
})();
