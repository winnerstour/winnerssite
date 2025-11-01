import fs from "fs";
import path from "path";

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const EVENTS_DIR = path.join(ROOT, "data", "events");
const BANNERS_DIR = path.join(ROOT, "assets", "img", "banners");

function safeReadJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); }
  catch { return null; }
}

function pickSubtitle(ev) {
  return ev.subtitle || ev.summary || ev.badge || ev.initial_description || ev.description || ev.sub || "";
}

function resolveBanner(slug, ev) {
  // Prioridade: banner_path, seo.image, arquivo físico por padrão {slug}-banner
  if (ev.banner_path && (ev.banner_path.startsWith("/") || ev.banner_path.startsWith("http"))) {
    return ev.banner_path;
  }
  if (ev.seo && ev.seo.image) return ev.seo.image;
  const exts = ["webp","jpg","jpeg","png"];
  for (const ext of exts) {
    const fp = path.join(BANNERS_DIR, `${slug}-banner.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}-banner.${ext}`;
  }
  // fallback genérico
  for (const ext of exts) {
    const fp = path.join(BANNERS_DIR, `${slug}.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}.${ext}`;
  }
  return `/assets/img/banners/fallback.webp`;
}

export const handler = async () => {
  try {
    if (!fs.existsSync(EVENTS_DIR)) {
      return { statusCode: 200, headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ count: 0, events: [] }) };
    }
    const files = fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith(".json"));
    const events = [];
    for (const f of files) {
      const ev = safeReadJSON(path.join(EVENTS_DIR, f));
      if (!ev || !ev.slug || !ev.title) continue;
      const slug = `${ev.slug}`.trim();
      events.push({
        slug,
        title: `${ev.title}`.trim(),
        subtitle: `${pickSubtitle(ev)}`.trim(),
        emoji: ev.emoji || "",
        banner: resolveBanner(slug, ev),
        url: `evento.html?slug=${slug}`,
        dateHuman: ev.date_human || "",
        dateShort: ev.date_short || ""
      });
    }
    events.sort((a,b)=> a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" }));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      body: JSON.stringify({ count: events.length, events }, null, 2)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
