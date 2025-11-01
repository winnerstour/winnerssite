import fs from "fs";
import path from "path";

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const EVENTS_DIR = path.join(ROOT, "data", "events");

export const handler = async (evt) => {
  try {
    const slug = (evt.queryStringParameters?.slug || "").trim();
    if (!slug) return { statusCode: 400, body: "slug obrigatório" };
    const fp = path.join(EVENTS_DIR, `${slug}.json`);
    if (!fs.existsSync(fp)) return { statusCode: 404, body: "evento não encontrado" };
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
