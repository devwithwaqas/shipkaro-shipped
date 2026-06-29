/**
 * Fetches real icons + descriptions from product URLs.
 * Run: node enrich.mjs
 */
import { readFileSync, writeFileSync } from "fs";

const PRODUCTS = JSON.parse(readFileSync("products.json", "utf8"));
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function absUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

function meta(html, prop) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return decodeEntities(m[1].trim());
  }
  return null;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isBadIcon(url) {
  if (!url) return true;
  const u = url.toLowerCase();
  if (u.includes("google.com/s2/favicons")) return true;
  if (u.includes("apps.apple.com/assets/favicon")) return true;
  if (u.includes("630wa") || u.includes("placeholder.mill")) return true;
  if (u.includes("logo-dark") || u.includes("/logo.")) return true;
  if (u.endsWith(".ico")) return true;
  if (u.includes("og-image") && !u.includes("mzstatic") && !u.includes("googleusercontent")) return true;
  return false;
}

function normalizePlayIcon(url) {
  if (!url?.includes("googleusercontent.com")) return url;
  return `${url.split("=")[0]}=w128-h128-rw`;
}

function appStoreIcon(html) {
  const jsonArt =
    html.match(/"artworkUrl512":"([^"]+)"/) ||
    html.match(/"artworkUrl100":"([^"]+)"/) ||
    html.match(/"artworkUrl60":"([^"]+)"/);
  if (jsonArt) return jsonArt[1].replace(/\\u002F/g, "/").replace(/\\/g, "");

  const thumbs = [...html.matchAll(/https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\/[^"'\s<>]+/gi)];
  for (const m of thumbs) {
    const url = m[0];
    if (url.includes("Placeholder") || url.includes("630wa")) continue;
    if (url.includes("AppIcon") || url.includes("/icon/")) {
      return url.replace(/\/\d+x\d+bb\.[a-z]+$/i, "/128x128bb.jpg");
    }
  }
  return null;
}

function playStoreIcon(html) {
  const all = [...html.matchAll(/https:\/\/play-lh\.googleusercontent\.com\/[^"'\s<>]+/g)];
  if (!all.length) return null;
  const best = all.find((m) => m[0].length > 80) || all[0];
  return normalizePlayIcon(best[0].split("=")[0]);
}

function pickIcon(html, pageUrl) {
  if (pageUrl.includes("play.google.com")) {
    const icon = playStoreIcon(html);
    if (icon) return icon;
  }

  if (pageUrl.includes("apps.apple.com")) {
    const icon = appStoreIcon(html);
    if (icon) return icon;
  }

  const apple =
    html.match(/<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']apple-touch-icon["']/i);
  if (apple) {
    const url = absUrl(pageUrl, apple[1]);
    if (!isBadIcon(url)) return url;
  }

  const iconLink =
    html.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)/i) ||
    html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']icon["']/i);
  if (iconLink && !iconLink[1].endsWith(".svg")) {
    const url = absUrl(pageUrl, iconLink[1]);
    if (!isBadIcon(url)) return url;
  }

  const og = meta(html, "og:image");
  if (og && !isBadIcon(og)) return absUrl(pageUrl, og);

  return null;
}

function pickSummary(html) {
  return (
    meta(html, "og:description") ||
    meta(html, "description") ||
    meta(html, "twitter:description") ||
    null
  );
}

function pickTitle(html) {
  return meta(html, "og:title") || meta(html, "twitter:title") || null;
}

async function fetchPage(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return { html: await res.text(), finalUrl: res.url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function enrichProduct(product) {
  if (!product.link) return null;

  const page = await fetchPage(product.link);
  if (!page) {
    return {
      icon: null,
      title: product.name,
      summary: product.description,
      source: product.link,
      fetched: false,
    };
  }

  const { html, finalUrl } = page;
  let icon = pickIcon(html, finalUrl);
  if (isBadIcon(icon)) icon = null;

  return {
    icon,
    title: pickTitle(html) || product.name,
    summary: pickSummary(html) || product.description,
    source: finalUrl,
    fetched: Boolean(icon),
  };
}

async function pool(items, limit, fn) {
  const out = {};
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      const p = items[idx];
      out[p.id] = await fn(p);
      const mark = out[p.id]?.icon ? "✓" : "·";
      process.stdout.write(`${mark} ${p.name}\n`);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return out;
}

console.log(`Enriching ${PRODUCTS.filter((p) => p.link).length} products…\n`);
const enrichment = await pool(PRODUCTS.filter((p) => p.link), 6, enrichProduct);
const withIcons = Object.values(enrichment).filter((e) => e?.icon).length;
writeFileSync("enrichment.json", JSON.stringify(enrichment, null, 2));
console.log(`\nDone — ${withIcons}/${PRODUCTS.filter((p) => p.link).length} proper icons saved`);
