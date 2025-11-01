// tools/build-manifest.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// Ajuste estes caminhos se o seu projeto usa "assets/data" em vez de "data"
const EVENTS_DIRS = [
  path.join(ROOT, "data", "events"),
  path.join(ROOT, "assets", "data", "events"),
];
const BANNERS_DIR = path.join(ROOT, "assets", "img", "banners");

const FALLBACK_BANNER = "/assets/img/banners/fallback.webp"; // ajuste se quiser

const tryPaths = async (paths) => {
  for (const p of paths) {
    try {
      const st = await fs.stat(p);
      if (st.isFile()) return p;
    } catch {}
  }
  return null;
};

const loadJSON = async (file) => {
  const txt = await fs.readFile(file, "utf8");
  return JSON.parse(txt);
};

const pick = (...vals) => vals.find(Boolean);

const firstExisting = async (base, exts = [".webp", ".jpg", ".jpeg", ".png"]) => {
  const candidates = exts.map((ext) => path.join(BANNERS_DIR, base + ext));
  const hit = await tryPaths(candidates);
  if (!hit) return null;
  // transformar caminho do disco em caminho público
  const rel = path.relative(ROOT, hit).split(path.sep).join("/");
  return "/" + rel;
};

const summarise = (ev) => {
  // tenta campos comuns; se não houver, cria a partir do subtitle
  const s = pick(ev.summary, ev.resume, ev.description, ev.subtitle, ev.sub);
  if (!s) return "";
  const clean = String(s).replace(/\s+/g, " ").trim();
  return clean.length > 240 ? clean.slice(0, 237) + "…" : clean;
};

const pickBanner = async (slug, ev) => {
  // prioridade: banner explícito no evento
  if (ev.banner && /^https?:|^\//.test(ev.banner)) return ev.banner;

  // tenta seo.image
  if (ev.seo?.image && /^https?:|^\//.test(ev.seo.image)) return ev.seo.image;

  // tenta nome canônico /assets/img/banners/{slug}-banner.{ext}
  const fromSlug = await firstExisting(`${slug}-banner`);
  if (fromSlug) return fromSlug;

  // tenta /assets/img/banners/{slug}.{ext}
  const fromSlugPlain = await firstExisting(`${slug}`);
  if (fromSlugPlain) return fromSlugPlain;

  // fallback
  return FALLBACK_BANNER;
};

const findEventsDir = async () => {
  for (const dir of EVENTS_DIRS) {
    try {
      const st = await fs.stat(dir);
      if (st.isDirectory()) return dir;
    } catch {}
  }
  return null;
};

async function main() {
  const eventsDir = await findEventsDir();
  if (!eventsDir) {
    console.error("❌ Não encontrei a pasta de eventos (data/events ou assets/data/events).");
    process.exit(1);
  }

  const files = (await fs.readdir(eventsDir))
    .filter((f) => f.endsWith(".json"))
    .sort();

  const items = [];
  for (const f of files) {
    const slug = path.basename(f, ".json");
    try {
      const ev = await loadJSON(path.join(eventsDir, f));
      const title = pick(ev.title, ev.name, slug).toString();
      const banner = await pickBanner(slug, ev);
      const summary = summarise(ev);
      const emoji = pick(ev.emoji, ev.icon, "📌");

      items.push({
        slug,
        title,
        emoji,
        summary,
        banner,
      });
    } catch (e) {
      console.warn(`⚠️  Ignorando ${f}:`, e.message);
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    events: items,
  };

  // escreve em /data/manifest.json (ou cria a pasta)
  const outDir = path.join(ROOT, "data");
  try { await fs.mkdir(outDir, { recursive: true }); } catch {}
  const outFile = path.join(outDir, "manifest.json");
  await fs.writeFile(outFile, JSON.stringify(out, null, 2), "utf8");

  console.log(`✅ Manifest gerado em ${outFile} com ${items.length} evento(s).`);
}

main().catch((e) => {
  console.error("❌ Erro geral:", e);
  process.exit(1);
});
