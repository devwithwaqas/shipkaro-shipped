/* Generative flat illustrations — brand palette only, zero network */
window.ShipIcons = (function () {
  "use strict";

  const C = {
    purple: "#9B6DFF",
    deep: "#6B4DB8",
    soft: "#F5F0FF",
    light: "#EDE6FF",
    paper: "#FFFFFF",
    cream: "#FAF8F4",
    ink: "#0E0B14",
    ink2: "#2A2533",
    mute: "#6B6677",
    rule: "#E8E5EE",
  };

  const PALETTES = [
    { bg: C.soft, a: C.purple, b: C.deep, c: C.light, ink: C.deep },
    { bg: C.paper, a: C.deep, b: C.purple, c: C.soft, ink: C.ink },
    { bg: C.light, a: C.purple, b: C.ink2, c: C.paper, ink: C.deep },
    { bg: C.purple, a: C.paper, b: C.light, c: C.deep, ink: C.paper },
    { bg: C.cream, a: C.deep, b: C.purple, c: C.rule, ink: C.ink },
    { bg: C.deep, a: C.soft, b: C.purple, c: C.light, ink: C.paper },
    { bg: C.paper, a: C.purple, b: C.light, c: C.deep, ink: C.ink2 },
    { bg: C.soft, a: C.ink2, b: C.purple, c: C.deep, ink: C.ink },
    { bg: C.light, a: C.deep, b: C.soft, c: C.purple, ink: C.deep },
    { bg: C.purple, a: C.deep, b: C.paper, c: C.soft, ink: C.paper },
    { bg: C.cream, a: C.purple, b: C.deep, c: C.light, ink: C.ink2 },
    { bg: C.deep, a: C.purple, b: C.paper, c: C.soft, ink: C.paper },
  ];

  const LAYOUTS = ["solid", "split", "corner", "ring", "stripe", "dots"];

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  function pick(text, rules, fallback) {
    for (const r of rules) if (r.re.test(text)) return r.id;
    return fallback;
  }

  function sceneId(product) {
    const t = `${product.name} ${product.description}`.toLowerCase();
    return pick(t, [
      { id: "voice", re: /voice|speak|dictat|transcri|audio|whisper/ },
      { id: "faith", re: /prayer|quran|muslim|islam|azan|adhan|dhikr|wird|aaghosh/ },
      { id: "health", re: /health|med|fitness|calorie|vital|medicine|jacked|motherhood/ },
      { id: "money", re: /budget|expense|cash|invoice|payroll|fuel|stock|subscription|ledger|spend|balancio|wallet|stamp/ },
      { id: "photo", re: /photo|image|color|art|enhancer|upscal|editor|palette|lumex/ },
      { id: "game", re: /game|card|thulla|arrow|drift|quiz|brain|doom|ronaldo/ },
      { id: "map", re: /map|route|bus|traffic|itinerary|travel|locovise|boardspy|karachi/ },
      { id: "food", re: /recipe|food|begum|cook|chef/ },
      { id: "shield", re: /security|shield|proof|scanner|cspm|beruni/ },
      { id: "tasks", re: /task|habit|streak|notes|mentor|noti|remind|todo/ },
      { id: "social", re: /share|community|chat|mentorship|dropwise/ },
      { id: "shop", re: /shopify|inventory|hostel|wardrobe|commerce/ },
      { id: "video", re: /video|player|downloader|film/ },
      { id: "data", re: /data|analytics|insight|founder|prd|admob/ },
      { id: "car", re: /car|fuel|whispercar|vehicle/ },
      { id: "book", re: /poetry|quran|read|journal|sentence|vocabulary|mnemonic/ },
      { id: "ai", re: /\bai\b|gpt|gemini|neural|llm|intelli|autoremind/ },
      { id: "rocket", re: /ship|launch|cohort|kit/ },
    ], ["abstract", "orbit", "stack", "beam", "tiles", "wave"][hash(product.id) % 6]);
  }

  function bgLayer(layout, p, id) {
    const r = 18;
  const split = hash(id) % 2 === 0;
    if (layout === "split") {
      return `<path d="M0 0h64v64H0z" fill="${p.bg}"/><path d="M0 0h64L${split ? "0 64" : "64 0"}z" fill="${p.c}" opacity="0.9"/>`;
    }
    if (layout === "corner") {
      return `<rect width="64" height="64" rx="${r}" fill="${p.bg}"/><circle cx="${split ? 52 : 12}" cy="${split ? 12 : 52}" r="22" fill="${p.c}" opacity="0.55"/>`;
    }
    if (layout === "ring") {
      return `<rect width="64" height="64" rx="${r}" fill="${p.bg}"/><circle cx="32" cy="32" r="26" fill="none" stroke="${p.c}" stroke-width="3" opacity="0.45"/>`;
    }
    if (layout === "stripe") {
      const stripes = Array.from({ length: 5 }, (_, i) =>
        `<rect x="${i * 14 - 4}" y="0" width="8" height="64" fill="${p.c}" opacity="0.12" transform="rotate(24 32 32)"/>`
      ).join("");
      return `<rect width="64" height="64" rx="${r}" fill="${p.bg}"/>${stripes}`;
    }
    if (layout === "dots") {
      let dots = "";
      for (let y = 8; y < 56; y += 12) {
        for (let x = 8; x < 56; x += 12) {
          if ((x + y + hash(id)) % 3 === 0) dots += `<circle cx="${x}" cy="${y}" r="1.5" fill="${p.a}" opacity="0.25"/>`;
        }
      }
      return `<rect width="64" height="64" rx="${r}" fill="${p.bg}"/>${dots}`;
    }
    return `<rect width="64" height="64" rx="${r}" fill="${p.bg}"/>`;
  }

  const SCENES = {
    voice(s, p) {
      const bars = [14, 22, 30, 24, 34, 20, 28];
      return bars.map((h, i) =>
        `<rect x="${14 + i * 6}" y="${36 - h / 2}" width="4" rx="2" height="${h}" fill="${p.a}"/>`
      ).join("") + `<ellipse cx="32" cy="46" rx="18" ry="4" fill="${p.b}" opacity="0.15"/>`;
    },
    faith(s, p) {
      return `<path d="M32 14c-9 0-14 6-14 13 0 10 14 21 14 21s14-11 14-21c0-7-5-13-14-13z" fill="${p.a}"/><circle cx="32" cy="27" r="5" fill="${p.bg}"/>`;
    },
    health(s, p) {
      return `<path d="M32 22c-6-8-16-2-12 6 2 5 12 14 12 14s10-9 12-14c4-8-6-14-12-6z" fill="${p.a}"/><path d="M20 44h24" stroke="${p.b}" stroke-width="2" stroke-linecap="round"/>`;
    },
    money(s, p) {
      return `<rect x="18" y="20" width="28" height="20" rx="4" fill="${p.a}"/><rect x="22" y="24" width="28" height="20" rx="4" fill="${p.b}" opacity="0.85"/><circle cx="36" cy="34" r="5" fill="${p.bg}"/>`;
    },
    photo(s, p) {
      return `<rect x="16" y="18" width="32" height="26" rx="4" fill="${p.b}"/><circle cx="32" cy="30" r="8" fill="none" stroke="${p.bg}" stroke-width="2"/><circle cx="32" cy="30" r="3" fill="${p.a}"/><circle cx="40" cy="22" r="2" fill="${p.c}"/>`;
    },
    game(s, p) {
      const rot = (s.h % 3) * 8 - 8;
      return `<rect x="18" y="22" width="28" height="20" rx="6" fill="${p.a}" transform="rotate(${rot} 32 32)"/><circle cx="26" cy="30" r="2.5" fill="${p.bg}"/><circle cx="38" cy="30" r="2.5" fill="${p.bg}"/><path d="M28 36h8" stroke="${p.bg}" stroke-width="2" stroke-linecap="round"/>`;
    },
    map(s, p) {
      return `<path d="M16 22l12-6 12 6 12-6v28l-12 6-12-6-12 6z" fill="none" stroke="${p.a}" stroke-width="2"/><circle cx="32" cy="30" r="4" fill="${p.b}"/><path d="M32 26v8M28 30h8" stroke="${p.bg}" stroke-width="1.5"/>`;
    },
    food(s, p) {
      return `<path d="M24 38c0-8 8-14 8-18 0 4 8 10 8 18z" fill="${p.a}"/><ellipse cx="32" cy="40" rx="14" ry="5" fill="${p.b}" opacity="0.35"/><path d="M20 40h24" stroke="${p.ink}" stroke-width="1.5" opacity="0.2"/>`;
    },
    shield(s, p) {
      return `<path d="M32 14l16 7v12c0 10-16 17-16 17S16 43 16 33V21z" fill="${p.a}"/><path d="M32 22v16M26 30h12" stroke="${p.bg}" stroke-width="2" stroke-linecap="round"/>`;
    },
    tasks(s, p) {
      return `<rect x="20" y="18" width="24" height="28" rx="3" fill="${p.b}" opacity="0.2"/><path d="M24 26l4 4 8-8" stroke="${p.a}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 36h16M24 42h12" stroke="${p.a}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`;
    },
    social(s, p) {
      return `<circle cx="24" cy="28" r="5" fill="${p.a}"/><circle cx="40" cy="28" r="5" fill="${p.b}"/><circle cx="32" cy="40" r="5" fill="${p.a}" opacity="0.7"/><path d="M27 31l3 6M37 31l-3 6" stroke="${p.ink}" stroke-width="1.5" opacity="0.2"/>`;
    },
    shop(s, p) {
      return `<path d="M20 26h24l-2 18H22z" fill="${p.a}"/><path d="M24 26c0-5 4-8 8-8s8 3 8 8" fill="none" stroke="${p.b}" stroke-width="2.5"/>`;
    },
    video(s, p) {
      return `<rect x="18" y="20" width="28" height="22" rx="3" fill="${p.b}"/><path d="M30 26l10 6-10 6z" fill="${p.a}"/>`;
    },
    data(s, p) {
      const hs = [12, 18, 10, 22, 14];
      return hs.map((h, i) =>
        `<rect x="${18 + i * 7}" y="${42 - h}" width="5" rx="1" height="${h}" fill="${i % 2 ? p.b : p.a}"/>`
      ).join("") + `<path d="M16 44h32" stroke="${p.ink}" stroke-width="1" opacity="0.15"/>`;
    },
    car(s, p) {
      return `<path d="M18 34h28l-3-8H21z" fill="${p.a}"/><rect x="16" y="34" width="32" height="8" rx="3" fill="${p.b}"/><circle cx="24" cy="42" r="3" fill="${p.ink}" opacity="0.35"/><circle cx="40" cy="42" r="3" fill="${p.ink}" opacity="0.35"/>`;
    },
    book(s, p) {
      return `<path d="M22 18h10v28H22c0-9-2-16-2-16s2-7 2-12z" fill="${p.a}"/><path d="M42 18H32v28h10c0-9 2-16 2-16s-2-7-2-12z" fill="${p.b}"/><path d="M32 18v28" stroke="${p.ink}" stroke-width="1" opacity="0.15"/>`;
    },
    ai(s, p) {
      const n = 6 + (s.h % 4);
      let nodes = "";
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = 32 + Math.cos(a) * 14;
        const y = 32 + Math.sin(a) * 14;
        nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="${i % 2 ? p.b : p.a}"/>`;
      }
      return `<circle cx="32" cy="32" r="8" fill="${p.a}"/><circle cx="32" cy="32" r="4" fill="${p.bg}"/>${nodes}`;
    },
    rocket(s, p) {
      return `<path d="M32 14l6 14h-4l2 16-4-10-4 10 2-16h-4z" fill="${p.a}"/><ellipse cx="32" cy="46" rx="10" ry="3" fill="${p.b}" opacity="0.25"/>`;
    },
    abstract(s, p) {
      const k = s.h % 5;
      if (k === 0) return `<path d="M16 40L32 16l16 24z" fill="${p.a}" opacity="0.9"/><circle cx="32" cy="38" r="6" fill="${p.b}"/>`;
      if (k === 1) return `<rect x="20" y="20" width="24" height="24" rx="6" fill="${p.a}" transform="rotate(12 32 32)"/><rect x="24" y="24" width="16" height="16" rx="4" fill="${p.b}" opacity="0.5"/>`;
      if (k === 2) return `<circle cx="32" cy="32" r="16" fill="${p.a}"/><circle cx="32" cy="32" r="8" fill="${p.bg}"/><circle cx="32" cy="32" r="3" fill="${p.b}"/>`;
      if (k === 3) return `<path d="M20 44V20h8v16h8V20h8v24" fill="${p.a}"/>`;
      return `<path d="M18 32c0-8 6-14 14-14s14 6 14 14" fill="none" stroke="${p.a}" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="32" r="5" fill="${p.b}"/>`;
    },
    orbit(s, p) {
      return `<ellipse cx="32" cy="32" rx="20" ry="8" fill="none" stroke="${p.a}" stroke-width="2" transform="rotate(${s.h % 60 - 30} 32 32)"/><circle cx="32" cy="32" r="9" fill="${p.b}"/><circle cx="${32 + (s.h % 14)}" cy="${28 - (s.h % 8)}" r="4" fill="${p.a}"/>`;
    },
    stack(s, p) {
      return `<rect x="18" y="26" width="28" height="18" rx="3" fill="${p.b}" opacity="0.35"/><rect x="20" y="22" width="28" height="18" rx="3" fill="${p.a}" opacity="0.6"/><rect x="22" y="18" width="28" height="18" rx="3" fill="${p.a}"/>`;
    },
    beam(s, p) {
      return `<path d="M14 46L32 18l18 28H14z" fill="${p.a}" opacity="0.25"/><path d="M22 46L32 26l10 20" fill="${p.b}"/>`;
    },
    tiles(s, p) {
      const cols = [[18, 18], [34, 18], [18, 34], [34, 34]];
      return cols.map(([x, y], i) =>
        `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${i % 2 ? p.b : p.a}" opacity="${0.5 + (i * 0.12)}"/>`
      ).join("");
    },
    wave(s, p) {
      return `<path d="M12 36c6-8 10-8 16 0s10 8 16 0 10-8 16 0" fill="none" stroke="${p.a}" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="24" r="6" fill="${p.b}"/>`;
    },
  };

  function build(product) {
    if (product.icon) {
      return { remote: product.icon, scene: "custom" };
    }

    const h = hash(product.id);
    const h2 = hash(product.name + product.type);
    const palette = PALETTES[h % PALETTES.length];
    const layout = LAYOUTS[h2 % LAYOUTS.length];
    let scene = sceneId(product);
    if (!SCENES[scene]) scene = "abstract";

    const variant = (h + h2) % 7;
    if (variant === 1 && scene === "ai") scene = "abstract";
    if (variant === 2 && SCENES.orbit) scene = ["orbit", "stack", "beam", "tiles", "wave"][h % 5];

    const s = { h, h2, variant };
    const draw = SCENES[scene] || SCENES.abstract;
    const uid = `ic-${product.id.replace(/[^a-z0-9]/gi, "")}`;

    const svg = `<svg viewBox="0 0 64 64" width="64" height="64" class="icon-art" data-scene="${scene}" aria-hidden="true">
      <defs><clipPath id="${uid}"><rect width="64" height="64" rx="18"/></clipPath></defs>
      <g clip-path="url(#${uid})">${bgLayer(layout, palette, product.id)}${draw(s, palette)}</g>
    </svg>`;

    return { svg, scene, palette: palette.bg, glow: palette.a };
  }

  return { build };
})();
