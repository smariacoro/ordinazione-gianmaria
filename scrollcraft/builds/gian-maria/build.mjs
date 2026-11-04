// Builds the finished site into <project>/docs, the folder GitHub Pages publishes.
//   node build.mjs
// Writes one real HTML page per language, so language links work without scripts.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { T, LANGS, LANG_NAMES, MAPS, PARKING, STAY, SITE_URL, RSVP_ENDPOINT, RSVP_URL, RSVP_PHONE, RSVP_EMAIL } from "./src/content.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, "../../../docs");
const ENGINE = path.resolve(HERE, "../../../.claude/skills/scroll-craft/engine");
const A = path.join(OUT, "assets");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(A, "fonts"), { recursive: true });
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
// A custom domain lives in docs/CNAME, which this script would otherwise wipe on every build.
if (SITE_URL && !new URL(SITE_URL).hostname.endsWith(".github.io")) fs.writeFileSync(path.join(OUT, "CNAME"), new URL(SITE_URL).hostname + String.fromCharCode(10));

for (const f of ["scrollcraft.js", "scrollcraft.css"]) fs.copyFileSync(path.join(ENGINE, f), path.join(A, f));
fs.copyFileSync(path.join(HERE, "src/site.css"), path.join(A, "site.css"));
fs.copyFileSync(path.join(HERE, "src/page.js"), path.join(A, "page.js"));
for (const [pkg, files] of [
  ["bricolage-grotesque", ["bricolage-grotesque-latin-700-normal.woff2"]],
  ["figtree", ["figtree-latin-400-normal.woff2", "figtree-latin-700-normal.woff2"]],
]) for (const f of files) fs.copyFileSync(path.join(HERE, "node_modules/@fontsource", pkg, "files", f), path.join(A, "fonts", f));

// Images. Filter chains are written out so a re-crop is one line.
const FF = process.env.SCROLLCRAFT_FFMPEG || "ffmpeg";
const img = (src, name, width, extra = "", q = 74) => {
  const vf = (extra ? extra + "," : "") + `scale=${width}:-2:flags=lanczos`;
  execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", "-i", path.join(HERE, "originals", src), "-vf", vf, "-c:v", "libwebp", "-quality", String(q), path.join(A, name)]);
};
const dims = {};
const size = (name) => {
  const out = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0", path.join(A, name)], { encoding: "utf8" }).trim();
  const [w, h] = out.split(",").map(Number);
  dims[name] = { w, h };
};
img("facade.jpg", "facade-2200.webp", 2200); img("facade.jpg", "facade-1200.webp", 1200);
img("altar.jpg", "altar-2200.webp", 2200); img("altar.jpg", "altar-1200.webp", 1200);
img("castello.jpg", "castello-1100.webp", 1100);
size("castello-1100.webp");
// Share preview: WhatsApp and others are happier with a plain JPEG.
execFileSync(FF, ["-hide_banner", "-loglevel", "error", "-y", "-i", path.join(HERE, "originals/altar.jpg"), "-vf", "scale=1200:-2", "-q:v", "4", path.join(A, "anteprima.jpg")]);
// Licences that travel with the files they cover.
fs.copyFileSync(path.join(ENGINE, "../LICENSE"), path.join(A, "scrollcraft-LICENSE.txt"));
fs.copyFileSync(path.join(HERE, "node_modules/@fontsource/bricolage-grotesque/LICENSE"), path.join(A, "fonts/bricolage-grotesque-LICENSE.txt"));
fs.copyFileSync(path.join(HERE, "node_modules/@fontsource/figtree/LICENSE"), path.join(A, "fonts/figtree-LICENSE.txt"));

const fingerprint = (f) => createHash("sha256").update(fs.readFileSync(path.join(A, f))).digest("hex").slice(0, 10);
const VERSIONS = Object.fromEntries(["scrollcraft.css", "site.css", "scrollcraft.js", "page.js"].map((f) => [f, fingerprint(f)]));

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ext = 'target="_blank" rel="noopener"';

const ics = (t) => [
  "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Ordinazione fra Gian Maria//IT", "CALSCALE:GREGORIAN",
  "BEGIN:VEVENT", "UID:ordinazione-20261212@gian-maria", "DTSTAMP:20261104T120000Z", "DTSTART:20261212T100000Z", "DTEND:20261212T120000Z",
  `SUMMARY:${t.cal1}`, `LOCATION:${"Corso Cardinali Vannutelli 2\\, Genazzano (RM)"}`, "END:VEVENT",
  "BEGIN:VEVENT", "UID:primamessa-20261213@gian-maria", "DTSTAMP:20261104T120000Z", "DTSTART:20261213T101500Z",
  `SUMMARY:${t.cal2}`, `LOCATION:${"Corso Cardinali Vannutelli 2\\, Genazzano (RM)"}`, "END:VEVENT",
  "END:VCALENDAR", "",
].join("\r\n");

// Drawn flags: flag emoji show up as plain letters on Windows.
const FLAG_ART = {
  it: '<path fill="#fff" d="M0 0h60v40H0z"/><path fill="#009246" d="M0 0h20v40H0z"/><path fill="#ce2b37" d="M40 0h20v40H40z"/>',
  en: '<path fill="#012169" d="M0 0h60v40H0z"/><path stroke="#fff" stroke-width="8" d="M0 0l60 40M60 0L0 40"/><path stroke="#c8102e" stroke-width="3.5" d="M0 0l60 40M60 0L0 40"/><path stroke="#fff" stroke-width="13" d="M30 0v40M0 20h60"/><path stroke="#c8102e" stroke-width="8" d="M30 0v40M0 20h60"/>',
  fr: '<path fill="#fff" d="M0 0h60v40H0z"/><path fill="#0055a4" d="M0 0h20v40H0z"/><path fill="#ef4135" d="M40 0h20v40H40z"/>',
  de: '<path fill="#000" d="M0 0h60v14H0z"/><path fill="#d00" d="M0 13.3h60v14H0z"/><path fill="#ffce00" d="M0 26.7h60V40H0z"/>',
  es: '<path fill="#c60b1e" d="M0 0h60v40H0z"/><path fill="#ffc400" d="M0 10h60v20H0z"/>',
};
const flag = (l) => `<svg class="flag" width="26" height="17" viewBox="0 0 60 40" aria-hidden="true" focusable="false">${FLAG_ART[l]}</svg>`;

const CHAPTERS = ["programma", "dove", "parcheggi", "rinfresco", "dormire", "sacerdoti", "conferma"];

function page(lang) {
  const t = T[lang];
  const root = lang === "it" ? "" : "../";
  const a = (f) => `${root}assets/${f}`;
  const langHref = (l) => (l === lang ? "./" : l === "it" ? "../" : lang === "it" ? `${l}/` : `../${l}/`);
  const langLinks = LANGS.map((l) => `<a href="${langHref(l)}" hreflang="${l}" lang="${l}" data-lang${l === lang ? ' aria-current="true"' : ""}>${flag(l)}${LANG_NAMES[l]}</a>`).join("");
  const navLinks = CHAPTERS.map((c) => `<a href="#${c}">${esc(t.nav[c])}</a>`).join("");
  const rows = (rs) => rs.map(([k, v]) => `<div class="prog__row"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const rsvpForm = RSVP_ENDPOINT ? `<form class="rsvp" method="post" action="${esc(RSVP_ENDPOINT)}" data-sending="${esc(t.fSending)}" data-error="${esc(t.fError)}">
          <div class="rsvp__trap" aria-hidden="true"><input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></div>
          <div class="rsvp__field"><label for="f-name">${esc(t.fName)}</label><input id="f-name" name="name" type="text" required maxlength="120" autocomplete="name"></div>
          <div class="rsvp__field"><label for="f-count">${esc(t.fCount)}</label><input id="f-count" class="rsvp__count" name="people" type="number" inputmode="numeric" min="1" max="99" value="1" required></div>
          <div class="rsvp__field"><label for="f-food">${esc(t.fFood)}</label><textarea id="f-food" name="food" maxlength="1000" rows="2"></textarea></div>
          <button class="btn" type="submit">${esc(t.cta)}</button>
          <p class="rsvp__status" role="status" aria-live="polite"></p>
          <p class="rsvp__note">${esc(t.fNote)}</p>
        </form>
        <p class="rsvp__done" role="status" hidden>${esc(t.fDone)}</p>` : "";
  const rsvpBtns = [
    RSVP_URL && `<a class="btn" href="${esc(RSVP_URL)}" ${ext}>${esc(t.rsvpForm)}</a>`,
    RSVP_PHONE && `<a class="btn btn--quiet" href="tel:${esc(RSVP_PHONE.replace(/\s/g, ""))}">${esc(t.rsvpCall)} ${esc(RSVP_PHONE)}</a>`,
    RSVP_EMAIL && `<a class="btn btn--quiet" href="mailto:${esc(RSVP_EMAIL)}">${esc(t.rsvpMail)}</a>`,
  ].filter(Boolean).join("");
  const alternates = SITE_URL ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${l === "it" ? "" : l + "/"}">`).join("\n") : "";
  const og = SITE_URL ? `<meta property="og:url" content="${SITE_URL}${lang === "it" ? "" : lang + "/"}">\n<meta property="og:image" content="${SITE_URL}assets/anteprima.jpg">` : "";

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<meta name="theme-color" content="#131f3f">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.desc)}">
${og}
${alternates}
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%23131f3f'/><path d='M9 26V15a7 7 0 0 1 14 0v11z' fill='%23f4f5f1'/></svg>">
<link rel="preload" href="${a("fonts/bricolage-grotesque-latin-700-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${a("fonts/figtree-latin-400-normal.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${a("scrollcraft.css")}?v=${VERSIONS["scrollcraft.css"]}">
<link rel="stylesheet" href="${a("site.css")}?v=${VERSIONS["site.css"]}">
<noscript><style>.rsvp{display:none}[data-sc-cue]{opacity:1!important}[data-sc-reveal]{clip-path:none!important}.door__stage{height:auto}.door__plane{position:static}.door__far{display:none}.door__greet{position:static;max-width:none;border-radius:0}.door__near img{height:60vh;transform:none!important}</style></noscript>
</head>
<body>
<a class="skip" href="#contenuto">${esc(t.skip)}</a>

<header class="bar">
  <div class="wrap bar__in">
    <a class="bar__here" href="#top">${esc((t.name.charAt(0).toUpperCase() + t.name.slice(1)).replace(" Candelora", ""))}</a>
    <div class="bar__tools">
      <details class="drop lang">
        <summary aria-label="${esc(t.languages)}: ${LANG_NAMES[lang]}">${flag(lang)}<span class="lang__name">${LANG_NAMES[lang]}</span><svg class="lang__caret" width="12" height="8" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg></summary>
        <nav class="menu__panel lang__panel" aria-label="${esc(t.languages)}">${langLinks}</nav>
      </details>
      <details class="drop menu">
        <summary><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" stroke-width="2.4"/></svg>${esc(t.menu)}</summary>
        <nav class="menu__panel" aria-label="${esc(t.menu)}">${navLinks}</nav>
      </details>
    </div>
  </div>
</header>

<main id="top">

  <section class="title" data-sc-act="flow">
    <div class="wrap">
      <h1><small>${esc(t.kicker)}</small>${esc(t.name.replace(" Candelora", ""))}<br>Candelora</h1>
      <div class="title__row">
        <div class="title__facts">
          <p class="title__date">${esc(t.date)}</p>
          <p class="title__place">${esc(t.place)}</p>
        </div>
        <a class="btn" href="#conferma">${esc(t.cta)}</a>
      </div>
    </div>
  </section>

  <section class="door" data-sc-act="pin" data-sc-span="3.2">
    <div class="door__stage" data-sc-stage>
      <div class="door__plane door__near"><img src="${a("facade-2200.webp")}" srcset="${a("facade-1200.webp")} 1200w, ${a("facade-2200.webp")} 2200w" sizes="(orientation: portrait) 240vh, 100vw" alt="${esc(t.facadeAlt)}"></div>
      <div class="door__plane door__far"><img src="${a("altar-2200.webp")}" srcset="${a("altar-1200.webp")} 1200w, ${a("altar-2200.webp")} 2200w" sizes="(orientation: portrait) 240vh, 100vw" alt="${esc(t.altarAlt)}"></div>
      <p class="door__greet" data-sc-cue="0.74 1 0.08 0"><strong>${esc(t.greetA)}</strong> ${esc(t.greetB)}</p>
    </div>
  </section>

  <nav class="index" id="contenuto" aria-labelledby="index-t">
    <div class="wrap">
      <h2 id="index-t" class="index__t">${esc(t.indexTitle)}</h2>
      <div class="index__list">${navLinks}</div>
    </div>
  </nav>

  <section class="chap" id="programma" data-chapter="${esc(t.nav.programma)}">
    <div class="wrap">
      <h2>${esc(t.progTitle)}</h2>
      <div class="days">
        <div class="day"><h3>${esc(t.day1)}</h3><dl>${rows(t.day1rows)}</dl></div>
        <div class="day day--second"><h3>${esc(t.day2)}</h3><dl>${rows(t.day2rows)}</dl></div>
      </div>
      <div class="btns prog__after"><a class="btn btn--quiet" href="${a(`calendario-${lang}.ics`)}" download="ordinazione-gian-maria.ics">${esc(t.calendar)}</a></div>
    </div>
  </section>

  <section class="chap chap--cobalt where" id="dove" data-chapter="${esc(t.nav.dove)}">
    <div class="wrap">
      <h2 class="index__t">${esc(t.whereTitle)}</h2>
      <p class="where__big">${esc(t.whereBig)}</p>
      <span class="where__strike" aria-hidden="true">Genzano</span>
      <div class="where__foot">
        <p class="where__not">${esc(t.whereNot)}</p>
        <div class="where__addr"><strong>${esc(t.whereName)}</strong><span>${esc(t.whereAddr)}</span><a class="btn" href="${esc(MAPS.santuario)}" ${ext}>${esc(t.map)}</a></div>
      </div>
    </div>
  </section>

  <section class="chap" id="parcheggi" data-sc-act="flow" data-chapter="${esc(t.nav.parcheggi)}">
    <div class="wrap park">
      <div class="park__fig">
        <h2>${esc(t.parkTitle)}</h2>
        <p class="lede" style="margin-top:1.25rem">${esc(t.parkIntro)}</p>
        <figure style="margin-top:1.75rem">
          <div class="frame" data-sc-reveal="up" data-sc-reveal-at="0 0.08"><img src="${a("castello-1100.webp")}" width="${dims["castello-1100.webp"].w}" height="${dims["castello-1100.webp"].h}" alt="${esc(t.castleAlt)}" loading="lazy" decoding="async" data-sc-parallax="0.5"></div>
          <figcaption>${esc(t.castleCap)}</figcaption>
        </figure>
      </div>
      <div>
        <ol class="park__list">
          ${PARKING.map((p) => `<li class="park__item"><div><h3>${esc(p.name)}</h3>${p.k ? `<p>${esc(t.park[p.k])}</p>` : ""}<a class="btn btn--quiet" href="${esc(p.q)}" ${ext} aria-label="${esc(t.map)}: ${esc(p.name)}">${esc(t.map)}</a></div></li>`).join("\n          ")}
        </ol>
        <p class="park__vigili">${esc(t.vigili)}</p>
      </div>
    </div>
  </section>

  <section class="chap chap--night" id="rinfresco" data-chapter="${esc(t.nav.rinfresco)}">
    <div class="wrap meal">
      <h2>${esc(t.mealTitle)}</h2>
      <div class="meal__body">
        <p class="lede">${esc(t.mealText)}</p>
        <strong>${esc(t.mealAddr)}</strong>
        <div class="btns">
          <a class="btn" href="${esc(MAPS.aminta)}" ${ext}>${esc(t.map)}</a>
          <a class="btn btn--quiet" href="https://www.amintaresort.it/" ${ext}>${esc(t.website)}</a>
        </div>
      </div>
    </div>
  </section>

  <section class="chap" id="dormire" data-chapter="${esc(t.nav.dormire)}">
    <div class="wrap">
      <h2>${esc(t.stayTitle)}</h2>
      <p class="lede">${esc(t.stayIntro)}</p>
      <ul class="stay__list">
        ${STAY.map((s) => `<li class="stay__item">
          <h3>${esc(s.name)}</h3>
          ${s.addr ? `<p>${esc(s.addr)}</p>` : ""}
          ${s.k ? `<p>${esc(t.stayNotes[s.k])}</p>` : ""}
          ${s.tel ? `<p><a href="tel:${esc(s.tel.replace(/\s/g, ""))}">${esc(s.tel)}</a></p>` : ""}
          ${s.mail ? `<p><a href="mailto:${esc(s.mail)}">${esc(s.mail)}</a></p>` : ""}
          <div class="btns">
            ${s.tel ? `<a class="btn" href="tel:${esc(s.tel.replace(/\s/g, ""))}" aria-label="${esc(t.call)}: ${esc(s.name)}">${esc(t.call)}</a>` : ""}
            ${s.web ? `<a class="btn btn--quiet" href="${esc(s.web)}" ${ext} aria-label="${esc(t.website)}: ${esc(s.name)}">${esc(t.website)}</a>` : ""}
            <a class="btn btn--quiet" href="${esc(s.map)}" ${ext} aria-label="${esc(t.map)}: ${esc(s.name)}">${esc(t.map)}</a>
          </div>
        </li>`).join("\n        ")}
      </ul>
    </div>
  </section>

  <section class="chap chap--night" id="sacerdoti" data-chapter="${esc(t.nav.sacerdoti)}">
    <div class="wrap">
      <h2>${esc(t.priestTitle)}</h2>
      <p class="lede">${esc(t.priestIntro)}</p>
      <div class="priest__grid">
        <div class="priest__col"><h3>${esc(t.priestBring)}</h3><ul>${t.priestBringList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        <div class="priest__col"><h3>${esc(t.priestGiven)}</h3><ul>${t.priestGivenList.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
    </div>
  </section>

  <section class="letter" id="conferma" data-chapter="${esc(t.nav.conferma)}">
    <div class="wrap">
      <h2>${esc(t.rsvpTitle)}</h2>
      <strong class="letter__by">${esc(t.rsvpBy)}</strong>
      <div class="letter__grid">
        <div class="letter__body">
          ${t.letter.map((p) => `<p>${esc(p)}</p>`).join("\n          ")}
          <p class="letter__sign">${esc(t.sign)}</p>
          ${rsvpBtns ? `<div class="btns">${rsvpBtns}</div>` : ""}
        </div>
        <div class="letter__form">${rsvpForm}</div>
      </div>
      <footer class="colophon">
        <div class="colophon__links">
          <a class="btn btn--quiet" href="#top">${esc(t.top)}</a>
          <button class="btn btn--quiet" type="button" data-print hidden>${esc(t.print)}</button>
        </div>
        <p style="max-width:none">${esc(t.credits)}</p>
      </footer>
    </div>
  </section>

</main>

<script src="${a("scrollcraft.js")}?v=${VERSIONS["scrollcraft.js"]}"></script>
<script src="${a("page.js")}?v=${VERSIONS["page.js"]}"></script>
</body>
</html>
`;
}

for (const l of LANGS) {
  const dir = l === "it" ? OUT : path.join(OUT, l);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), page(l));
  fs.writeFileSync(path.join(A, `calendario-${l}.ics`), ics(T[l]));
}

// Guard: no em dash anywhere visible, and every language has every key.
const keys = Object.keys(T.it);
for (const l of LANGS) {
  for (const k of keys) if (!(k in T[l])) throw new Error(`Missing ${k} in ${l}`);
  if (JSON.stringify(T[l]).includes("—")) throw new Error(`Em dash in ${l}`);
}
console.log("Built", LANGS.length, "languages into", OUT);
