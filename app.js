(function () {
  "use strict";

  const TYPE_LABELS = {
    android: "Android",
    ios: "iOS",
    web: "Web",
    "ai-tool": "AI Tool",
    workflow: "Workflow",
    extension: "Extension",
    other: "Other",
  };

  const TYPE_GLOW = {
    all: "155,109,255",
    android: "66,133,244",
    ios: "10,132,255",
    web: "79,70,229",
    "ai-tool": "155,109,255",
    workflow: "107,77,184",
    extension: "245,158,11",
    other: "155,109,255",
  };

  const SHIPKARO_MARK =
    '<img src="assets/favicon.png" alt="" width="22" height="22" class="sk-brand-icon" loading="lazy" decoding="async">';

  const TYPE_ICONS = {
    all: SHIPKARO_MARK,
    android: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12 3.84 21.85C3.34 21.61 3 21.09 3 20.5Z" fill="#4285F4"/><path d="M16.81 15.12L6.05 21.34 14.54 12.85 16.81 15.12Z" fill="#34A853"/><path d="M20.16 10.81c.34.27.58.69.58 1.19s-.22.92-.57 1.18l-4.31 2.32-3.5-3.5 3.5-3.5 4.27 2.31c.35.28.59.7.59 1.19s-.24.91-.58 1.19Z" fill="#FBBC04"/><path d="M6.05 2.66 16.81 8.88 14.54 11.15 3.84 2.15C4.34 1.91 4.86 2.05 6.05 2.66Z" fill="#EA4335"/></svg>',
    ios: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" fill="#0A84FF"/><path fill="#FFF" d="M15.87 12.15c-.03-2.14 1.75-3.17 1.83-3.21-1-.58-2.28-.93-3.65-.93-1.87 0-3.41 1.1-4.31 1.1-.92 0-2.33-1.06-3.83-1.03-1.97.03-3.78 1.14-4.8 2.9-2.05 3.55-1.67 8.79 1.47 11.96 1.01 1.09 2.21 2.31 3.79 2.27 1.53-.06 2.1-.99 3.94-.99 1.84 0 2.36.99 3.97.96 1.64-.03 2.68-1.12 3.68-2.21 1.16-1.27 1.64-2.5 1.67-2.56-.04-.02-3.21-1.23-3.24-4.89z"/><path fill="#FFF" d="M13.32 5.28c.85-1.03 1.42-2.47 1.26-3.9-1.22.05-2.69.81-3.56 1.84-.79.92-1.48 2.39-1.3 3.8 1.37.11 2.77-.69 3.6-1.74z"/></svg>',
    web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#EEF2FF"/><path fill="#EA4335" d="M12 3a9 9 0 019 9h-9V3z"/><path fill="#34A853" d="M12 21a9 9 0 01-9-9h9v9z"/><path fill="#FBBC04" d="M12 12h9a9 9 0 01-9 9v-9z"/><path fill="#4285F4" d="M3 12a9 9 0 019-9v9H3z"/><circle cx="12" cy="12" r="3.2" fill="#fff"/></svg>',
    "ai-tool": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 14.2 9.2 22 11l-7.8 1.8L12 20l-2.2-7.2L2 11l7.8-1.8L12 2Z" fill="#9B6DFF"/><path d="M19 14.5 20 18l3.5 1-3.5 1-1 3.5-1-3.5-3.5-1 3.5-1 1-3.5Z" fill="#EC4899"/><path d="M5 4.5 5.8 7 8.5 7.8 5.8 8.5 5 11l-.8-2.5L1.5 7.8 4.2 7 5 4.5Z" fill="#06B6D4"/></svg>',
    workflow: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="7" height="6" rx="2" fill="#9B6DFF"/><rect x="14" y="4" width="7" height="6" rx="2" fill="#06B6D4"/><rect x="8.5" y="14" width="7" height="6" rx="2" fill="#EC4899"/><path d="M6.5 10v3h5v1M17.5 10v3h-5v1" stroke="#6B4DB8" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
    extension: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 14.5 8.5H22l-6 4.5 2.5 8.5L12 16l-6.5 5 2.5-8.5-6-4.5h7.5L12 2Z" fill="#F59E0B"/><path d="M12 5.5 13.4 10h4.6l-3.7 2.7 1.4 4.5L12 14.8l-3.7 2.4 1.4-4.5L6 10h4.6L12 5.5Z" fill="#FBBF24"/></svg>',
    other: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="12" r="3" fill="#9B6DFF"/><circle cx="12" cy="12" r="3" fill="#EC4899"/><circle cx="17" cy="12" r="3" fill="#06B6D4"/></svg>',
  };

  function parseRgb(rgb) {
    return rgb.split(",").map((s) => Number(s.trim()));
  }

  function boostGlow(rgb, lift = 1.15) {
    const parts = parseRgb(rgb);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return rgb;
    const [r, g, b] = parts;
    const max = Math.max(r, g, b, 1);
    return `${Math.min(255, (r / max) * 255 * lift) | 0},${Math.min(255, (g / max) * 255 * lift) | 0},${Math.min(255, (b / max) * 255 * lift) | 0}`;
  }

  function neonFromIconGlow(iconRgb) {
    const [r, g, b] = parseRgb(iconRgb);
    const max = Math.max(r, g, b, 1);
    const min = Math.min(r, g, b);
    const sat = Math.max(max - min, 1);
    const nr = Math.min(255, min + sat * 1.55);
    const ng = Math.min(255, (g / max) * 255 * 1.48);
    const nb = Math.min(255, (b / max) * 255 * 1.48);
    return `${nr | 0},${ng | 0},${nb | 0}`;
  }

  function neonSecondaryFrom(iconRgb) {
    const [r, g, b] = parseRgb(iconRgb);
    return boostGlow(
      `${Math.min(255, r + 18) | 0},${Math.min(255, g + 28) | 0},${Math.min(255, b + 12) | 0}`,
      1.32
    );
  }

  function applyGlowVars(host, iconRgb) {
    if (!host) return;
    const icon = boostGlow(iconRgb);
    host.style.setProperty("--icon-glow", icon);
    host.style.setProperty("--neon-glow", neonFromIconGlow(icon));
    host.style.setProperty("--neon-glow-2", neonSecondaryFrom(icon));
  }

  function cardGlowSet(product, meta) {
    const icon = cardGlowRgb(product, meta);
    return {
      icon,
      neon: neonFromIconGlow(icon),
      neon2: neonSecondaryFrom(icon),
    };
  }

  function hexToRgb(hex) {
    if (!hex) return TYPE_GLOW.other;
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    if (Number.isNaN(n)) return TYPE_GLOW.other;
    return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  }

  function cardGlowRgb(product, meta) {
    if (!meta.icon) {
      const fb = window.ShipIcons.build(product);
      return boostGlow(hexToRgb(fb.glow));
    }
    return boostGlow(TYPE_GLOW[product.type] || TYPE_GLOW.other);
  }

  const glowCache = new Map();
  let glowCanvas;

  function sampleIconGlow(img) {
    const host = img.closest(".product-card") || img.closest(".detail-book");
    if (!host) return;

    const key = img.currentSrc || img.src;
    if (glowCache.has(key)) {
      applyGlowVars(host, glowCache.get(key));
      return;
    }

    const run = () => {
      try {
        if (!glowCanvas) {
          glowCanvas = document.createElement("canvas");
          glowCanvas.width = glowCanvas.height = 14;
        }
        const ctx = glowCanvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.clearRect(0, 0, 14, 14);
        ctx.drawImage(img, 0, 0, 14, 14);
        const d = ctx.getImageData(0, 0, 14, 14).data;
        let bestSat = 0;
        let br = 155;
        let bg = 109;
        let bb = 255;
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;

        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 40) continue;
          const pr = d[i];
          const pg = d[i + 1];
          const pb = d[i + 2];
          if (pr > 245 && pg > 245 && pb > 245) continue;
          const max = Math.max(pr, pg, pb);
          const min = Math.min(pr, pg, pb);
          const sat = max - min;
          if (sat > bestSat) {
            bestSat = sat;
            br = pr;
            bg = pg;
            bb = pb;
          }
          r += pr;
          g += pg;
          b += pb;
          n++;
        }

        const glow = boostGlow(
          bestSat > 18
            ? `${br},${bg},${bb}`
            : n
              ? `${(r / n) | 0},${(g / n) | 0},${(b / n) | 0}`
              : TYPE_GLOW[host.dataset.type] || TYPE_GLOW.other
        );

        glowCache.set(key, glow);
        applyGlowVars(host, glow);
      } catch {
        /* cross-origin or tainted canvas — keep type fallback */
      }
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(run, { timeout: 300 });
    } else {
      setTimeout(run, 0);
    }
  }

  function platformChip(type) {
    const label = typeLabel(type);
    const icon = TYPE_ICONS[type] || TYPE_ICONS.other;
    return `<span class="platform-chip platform-chip--${escapeHtml(type)}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${icon}</span>`;
  }

  function isSquareIconUrl(url) {
    if (!url) return false;
    const u = url.toLowerCase();
    if (
      u.includes("google.com/s2/favicons") ||
      u.includes("apps.apple.com/assets/favicon") ||
      u.includes("630wa") ||
      u.includes("placeholder.mill") ||
      u.includes("og-image") ||
      u.includes("logo-dark") ||
      u.includes("logo.") ||
      u.endsWith(".ico")
    ) {
      return false;
    }
    if (u.includes("googleusercontent.com")) return true;
    if (u.includes("mzstatic.com") && (u.includes("appicon") || u.includes("128x128") || u.includes("64x64"))) return true;
    if (u.includes("apple-touch-icon")) return true;
    return false;
  }

  function normalizeIconUrl(url) {
    if (!url || !isSquareIconUrl(url)) return null;
    if (url.includes("googleusercontent.com")) {
      const base = url.split("=")[0];
      return `${base}=w128-h128-rw`;
    }
    if (url.includes("mzstatic.com") && !url.match(/\d+x\d+bb/)) {
      return url.replace(/\/\d+x\d+[^/]*$/, "/128x128bb.jpg");
    }
    return url;
  }

  function isGenericIcon(url) {
    return !isSquareIconUrl(url);
  }

  const TYPE_ORDER = ["android", "ios", "web", "ai-tool", "extension", "workflow", "other"];

  let products = [];
  let enrichment = {};
  let activeTab = "all";
  let searchQuery = "";
  let sortBy = "name-asc";
  let lastFocus = null;

  const els = {
    grid: document.getElementById("product-grid"),
    empty: document.getElementById("empty-state"),
    tabs: document.getElementById("category-tabs"),
    search: document.getElementById("search"),
    sort: document.getElementById("sort"),
    totalCount: document.getElementById("total-count"),
    visibleCount: document.getElementById("visible-count"),
    resultsText: document.getElementById("results-text"),
    clearFilters: document.getElementById("clear-filters"),
    overlay: document.getElementById("detail-overlay"),
    book: document.getElementById("detail-book"),
    detailContent: document.getElementById("detail-content"),
    detailClose: document.getElementById("detail-close"),
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function typeLabel(type) {
    return TYPE_LABELS[type] || type;
  }

  const STAR_PATH =
    "M12 2.2l2.86 5.8 6.4.93-4.63 4.52 1.09 6.37L12 17.1l-5.72 3.02 1.09-6.37L2.74 8.93l6.4-.93L12 2.2z";

  function productRating(product) {
    let h = 2166136261;
    const key = product.id + product.name;
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    const tenths = 45 + (h % 6);
    return tenths / 10;
  }

  function renderStars(rating) {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const fill = Math.min(1, Math.max(0, rating - i));
      const pct = Math.round(fill * 100);
      stars.push(`<span class="star" aria-hidden="true">
        <svg class="star-empty" viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg>
        <span class="star-fill" style="width:${pct}%"><svg viewBox="0 0 24 24"><path d="${STAR_PATH}"/></svg></span>
      </span>`);
    }
    return stars.join("");
  }

  function renderRating(product, className) {
    const rating = productRating(product);
    const label = rating.toFixed(1);
    return `<div class="${className}" aria-label="Rating ${label} out of 5 stars">
      <span class="card-rating-num">${label}</span>
      <span class="card-rating-sep" aria-hidden="true"></span>
      <span class="card-stars">${renderStars(rating)}</span>
    </div>`;
  }

  function getMeta(product, { full = false } = {}) {
    const e = enrichment[product.id];
    const rawSummary = e?.summary || product.description;
    return {
      icon: normalizeIconUrl(product.icon || e?.icon),
      title: cleanTitle(e?.title, product.name),
      summary: full ? rawSummary : cleanSummary(rawSummary, product.description, 140),
      about: full ? buildAboutText(product, e) : cleanSummary(rawSummary, product.description, 140),
      source: e?.source || product.link || null,
      fromWeb: Boolean(e?.summary && e.summary !== product.description),
    };
  }

  function isBoilerplate(text) {
    return /^Download .+ on the App\s*Store/i.test(text) || /^See screenshots/i.test(text);
  }

  function buildAboutText(product, e) {
    const live = e?.summary?.trim();
    const listing = product.description?.trim();
    const goodLive = live && !isBoilerplate(live) ? live : null;
    if (goodLive && listing && goodLive !== listing) return `${goodLive}\n\n${listing}`;
    return goodLive || listing || "";
  }

  function cleanSummary(text, fallback, maxLen = 320) {
    if (!text || isBoilerplate(text)) return fallback;
    if (!maxLen) return text;
    return text.length > maxLen ? `${text.slice(0, maxLen - 1)}…` : text;
  }

  function cleanTitle(title, fallback) {
    if (!title) return fallback;
    return (
      title
        .replace(/\s*[-–|]\s*Apps on Google Play$/i, "")
        .replace(/\s*[-–|]\s*App Store$/i, "")
        .replace(/\s*[-–|]\s*Product Hunt$/i, "")
        .replace(/\s*[-–|]\s*Shopify App Store$/i, "")
        .trim() || fallback
    );
  }

  function linkLabel(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      if (host.includes("play.google.com")) return "Play Store";
      if (host.includes("apps.apple.com")) return "App Store";
      if (host.includes("producthunt.com")) return "Product Hunt";
      if (host.includes("shopify.com")) return "Shopify";
      return "Visit live";
    } catch {
      return "Visit live";
    }
  }

  function renderIcon(product, sizeClass) {
    const meta = getMeta(product);
    const lg = sizeClass?.includes("lg");
    const px = lg ? 104 : 80;
    const fallback = window.ShipIcons.build(product);

    if (meta.icon) {
      return `<div class="icon-stage ${sizeClass || ""}">
        <div class="card-icon card-icon--app" data-product-id="${escapeHtml(product.id)}">
          <div class="icon-tile">
            <img src="${escapeHtml(meta.icon)}" alt="" width="${px}" height="${px}" loading="lazy" decoding="async"
              class="app-icon-img">
          </div>
          <div class="icon-fallback" hidden aria-hidden="true">${fallback.svg}</div>
        </div>
      </div>`;
    }

    return `<div class="icon-stage ${sizeClass || ""}">
      <div class="card-icon card-icon--generated" data-scene="${escapeHtml(fallback.scene)}" data-glow="${boostGlow(hexToRgb(fallback.glow))}">
        <div class="icon-tile">${fallback.svg}</div>
      </div>
    </div>`;
  }

  function swapToFallback(img) {
    const wrap = img.closest(".card-icon");
    const host = img.closest(".product-card") || img.closest(".detail-book");
    const fb = wrap?.querySelector(".icon-fallback");
    if (!fb) return;
    const svg = fb.querySelector("svg");
    const scene = svg?.dataset?.scene;
    img.remove();
    fb.hidden = false;
    wrap.classList.remove("card-icon--app");
    wrap.classList.add("card-icon--generated");
    if (scene) wrap.dataset.scene = scene;
    const productId = wrap.dataset.productId;
    const product = products.find((p) => p.id === productId);
    if (product && host) {
      const built = window.ShipIcons.build(product);
      const glow = boostGlow(hexToRgb(built.glow));
      wrap.dataset.glow = glow;
      applyGlowVars(host, glow);
    }
  }

  function attachIconFallbacks(root) {
    root.querySelectorAll(".card-icon--app img").forEach((img) => {
      img.onerror = () => swapToFallback(img);
      img.onload = () => {
        const { naturalWidth: w, naturalHeight: h } = img;
        if (!w || !h) return;
        if (Math.abs(w - h) > Math.max(w, h) * 0.12) {
          swapToFallback(img);
          return;
        }
        sampleIconGlow(img);
      };
      if (img.complete && img.naturalWidth) {
        const { naturalWidth: w, naturalHeight: h } = img;
        if (w && h && Math.abs(w - h) <= Math.max(w, h) * 0.12) sampleIconGlow(img);
      }
    });

    root.querySelectorAll(".card-icon--generated[data-glow]").forEach((wrap) => {
      const host = wrap.closest(".product-card") || wrap.closest(".detail-book");
      if (host) applyGlowVars(host, wrap.dataset.glow);
    });
  }

  function sortProducts(list) {
    const sorted = [...list];
    switch (sortBy) {
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "type":
        sorted.sort((a, b) => {
          const ta = TYPE_ORDER.indexOf(a.type);
          const tb = TYPE_ORDER.indexOf(b.type);
          const ai = ta === -1 ? 99 : ta;
          const bi = tb === -1 ? 99 : tb;
          if (ai !== bi) return ai - bi;
          return a.name.localeCompare(b.name);
        });
        break;
      case "has-link":
        sorted.sort((a, b) => {
          const la = a.link ? 0 : 1;
          const lb = b.link ? 0 : 1;
          if (la !== lb) return la - lb;
          return a.name.localeCompare(b.name);
        });
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  }

  function filterProducts() {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (activeTab !== "all" && p.type !== activeTab) return false;
      if (!q) return true;
      const m = getMeta(p);
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        (p.builder && p.builder.toLowerCase().includes(q))
      );
    });
  }

  function renderCard(product) {
    const meta = getMeta(product);
    const cityLine = product.city
      ? `<span class="builder-city">${escapeHtml(product.city)}</span>`
      : "";

    const linkBlock = product.link
      ? `<a class="card-link" href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer" data-stop-card>
          ${escapeHtml(linkLabel(product.link))}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M7 17L17 7M17 7H9M17 7v8"/></svg>
        </a>`
      : `<span class="card-no-link">No link yet</span>`;

    const glow = cardGlowSet(product, meta);

    return `<article class="product-card" data-type="${escapeHtml(product.type)}" data-id="${escapeHtml(product.id)}"
      style="--icon-glow: ${glow.icon}; --neon-glow: ${glow.neon}; --neon-glow-2: ${glow.neon2}"
      role="listitem" tabindex="0" aria-label="Open details for ${escapeHtml(product.name)}">
      <div class="card-visual">
        <div class="card-visual-bg" aria-hidden="true"></div>
        ${renderIcon(product)}
        ${platformChip(product.type)}
        <span class="card-peek" aria-hidden="true">Open →</span>
      </div>
      <div class="card-body">
        <h3 class="card-name">${escapeHtml(meta.title)}</h3>
        ${renderRating(product, "card-rating")}
        <p class="card-desc">${escapeHtml(meta.summary)}</p>
      </div>
      <div class="card-footer">
        <div class="builder-info">
          <span class="builder-label">Shipped by</span>
          <span class="builder-name">${escapeHtml(product.builder)}</span>
          ${cityLine}
        </div>
        ${linkBlock}
      </div>
    </article>`;
  }

  function renderDetail(product) {
    const meta = getMeta(product, { full: true });
    const city = product.city ? ` · ${escapeHtml(product.city)}` : "";
    const statusPill = product.link
      ? '<span class="detail-status detail-status--live">Live</span>'
      : '<span class="detail-status detail-status--soon">Link pending</span>';

    const linksBlock = product.link
      ? `<a class="btn btn-ink detail-cta" href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(linkLabel(product.link))} →
          </a>
          <a class="detail-source-link" href="${escapeHtml(product.link)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(shortUrl(product.link))}
          </a>`
      : `<p class="detail-soon">Live link coming soon — still shipped, still counts.</p>`;

    const aboutParagraphs = meta.about
      .split(/\n\n+/)
      .filter((p) => p.trim())
      .map((p, i) =>
        i === 0
          ? `<p class="detail-lead">${escapeHtml(p.trim())}</p>`
          : `<p class="detail-desc">${escapeHtml(p.trim())}</p>`
      )
      .join("");

    return `
      <article class="book-sheet">
        <header class="detail-masthead">
          <div class="detail-masthead-visual">
            <div class="detail-icon-aura" aria-hidden="true"></div>
            <div class="detail-icon-frame">
              ${renderIcon(product, "card-icon--lg")}
            </div>
          </div>
          <div class="detail-masthead-body">
            <div class="detail-masthead-tags">
              ${platformChip(product.type)}
              ${statusPill}
            </div>
            <h2 class="detail-title" id="detail-title">${escapeHtml(meta.title)}</h2>
            ${renderRating(product, "card-rating detail-rating")}
            <p class="detail-byline">
              <span class="detail-byline-label">Shipped by</span>
              <strong>${escapeHtml(product.builder)}</strong>${city}
            </p>
          </div>
        </header>

        <section class="detail-about" aria-labelledby="detail-about-label">
          <h3 class="detail-section-label" id="detail-about-label">About this ship</h3>
          <div class="detail-prose">${aboutParagraphs}</div>
        </section>

        <section class="detail-actions" aria-label="Visit product">
          <h3 class="detail-section-label">Open ship</h3>
          <div class="detail-actions-inner">
            ${linksBlock}
          </div>
        </section>
      </article>`;
  }

  function shortUrl(url) {
    try {
      const u = new URL(url);
      const path = u.pathname.replace(/\/$/, "");
      const shown = u.hostname.replace(/^www\./, "") + path;
      return shown.length > 48 ? `${shown.slice(0, 45)}…` : shown;
    } catch {
      return url;
    }
  }

  function openDetail(id) {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    lastFocus = document.activeElement;
    const meta = getMeta(product);
    els.detailContent.innerHTML = renderDetail(product);
    els.book.dataset.type = product.type;
    applyGlowVars(els.book, cardGlowRgb(product, meta));
    attachIconFallbacks(els.detailContent);
    els.overlay.hidden = false;
    document.body.classList.add("modal-open");

    requestAnimationFrame(() => {
      els.overlay.classList.add("is-open");
      els.detailClose.focus();
    });
  }

  function closeDetail() {
    els.overlay.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    const onEnd = (e) => {
      if (e.target !== els.book) return;
      els.book.removeEventListener("transitionend", onEnd);
      els.overlay.hidden = true;
      els.detailContent.innerHTML = "";
      lastFocus?.focus();
    };

    els.book.addEventListener("transitionend", onEnd);
    setTimeout(() => {
      if (!els.overlay.classList.contains("is-open")) {
        els.overlay.hidden = true;
        els.detailContent.innerHTML = "";
        lastFocus?.focus();
      }
    }, 500);
  }

  function onGridClick(e) {
    if (e.target.closest("[data-stop-card]")) return;
    const card = e.target.closest(".product-card");
    if (!card) return;
    openDetail(card.dataset.id);
  }

  function onGridKeydown(e) {
    if (e.target.closest("[data-stop-card]")) return;
    const card = e.target.closest(".product-card");
    if (!card) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail(card.dataset.id);
    }
  }

  function renderTabs() {
    const counts = {};
    products.forEach((p) => {
      counts[p.type] = (counts[p.type] || 0) + 1;
    });

    const types = Object.keys(counts).sort((a, b) => {
      const ia = TYPE_ORDER.indexOf(a);
      const ib = TYPE_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    const tabs = [{ id: "all", label: "All", count: products.length }];
    types.forEach((type) => {
      tabs.push({ id: type, label: typeLabel(type), count: counts[type] });
    });

    els.tabs.innerHTML = tabs
      .map((tab) => {
        const selected = activeTab === tab.id;
        const icon = TYPE_ICONS[tab.id] || TYPE_ICONS.other;
        return `<button type="button" class="category-tab" role="tab" data-type="${escapeHtml(tab.id)}"
          aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">
          <span class="tab-icon">${icon}</span>
          <span class="tab-label">${escapeHtml(tab.label)}</span>
          <span class="tab-count">${tab.count}</span>
        </button>`;
      })
      .join("");
  }

  function animateCount(el, target) {
    const start = Number(el.textContent) || 0;
    if (start === target) return;
    const duration = 400;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function updateUI() {
    const filtered = sortProducts(filterProducts());

    els.grid.innerHTML = filtered.map(renderCard).join("");
    attachIconFallbacks(els.grid);
    els.empty.hidden = filtered.length > 0;
    els.grid.hidden = filtered.length === 0;

    animateCount(els.visibleCount, filtered.length);

    const hasFilters = searchQuery.trim() || activeTab !== "all";
    if (els.clearFilters) {
      els.clearFilters.disabled = !hasFilters;
      els.clearFilters.classList.toggle("is-dimmed", !hasFilters);
      els.clearFilters.setAttribute("aria-disabled", String(!hasFilters));
    }

    if (hasFilters) {
      const tabName = activeTab === "all" ? "" : ` · ${typeLabel(activeTab)}`;
      els.resultsText.textContent = `Showing ${filtered.length} of ${products.length}${tabName}`;
    } else {
      els.resultsText.textContent = `All ${products.length} community ships · click a card to open`;
    }
  }

  let searchTimer;
  function onSearchInput(e) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchQuery = e.target.value;
      updateUI();
    }, 120);
  }

  function onSortChange(e) {
    sortBy = e.target.value;
    updateUI();
  }

  function onTabClick(e) {
    const tab = e.target.closest(".category-tab");
    if (!tab) return;
    activeTab = tab.dataset.type;
    renderTabs();
    updateUI();
  }

  function onTabKeydown(e) {
    const tabs = [...els.tabs.querySelectorAll(".category-tab")];
    const current = tabs.findIndex((t) => t.dataset.type === activeTab);
    if (current === -1) return;

    let next = current;
    if (e.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;

    e.preventDefault();
    activeTab = tabs[next].dataset.type;
    renderTabs();
    updateUI();
    els.tabs.querySelector(`[data-type="${activeTab}"]`)?.focus();
  }

  function clearAllFilters() {
    searchQuery = "";
    activeTab = "all";
    els.search.value = "";
    renderTabs();
    updateUI();
  }

  function initCounter() {
    const target = products.length;
    els.totalCount.dataset.target = target;
    animateCount(els.totalCount, target);
  }

  async function init() {
    try {
      const [prodRes, enrichRes] = await Promise.all([
        fetch("products.json"),
        fetch("enrichment.json"),
      ]);
      if (!prodRes.ok) throw new Error("Failed to load products");
      products = await prodRes.json();
      if (enrichRes.ok) enrichment = await enrichRes.json();
    } catch (err) {
      els.resultsText.textContent = "Could not load products.json";
      console.error(err);
      return;
    }

    initCounter();
    renderTabs();
    updateUI();

    els.search.addEventListener("input", onSearchInput);
    els.sort.addEventListener("change", onSortChange);
    els.tabs.addEventListener("click", onTabClick);
    els.tabs.addEventListener("keydown", onTabKeydown);
    els.clearFilters?.addEventListener("click", clearAllFilters);
    els.grid.addEventListener("click", onGridClick);
    els.grid.addEventListener("keydown", onGridKeydown);
    els.detailClose.addEventListener("click", closeDetail);
    els.overlay.querySelector("[data-close]").addEventListener("click", closeDetail);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els.overlay.hidden) closeDetail();
    });

    const nav = document.getElementById("site-nav");
    if (nav) {
      const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
