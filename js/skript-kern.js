// Skript: gemeinsame Teile aller Apps der Familie. Inhaltsverzeichnis mit Kennzeichnung der Vertiefungen,
// Links „In der App öffnen“, Nachladen aufwendiger Abbildungen beim Hineinscrollen, Querstriche in SVG-Text.
// Die Abbildungen selbst zeichnet jede App mit ihrem eigenen Code. Stile in css/skript.css.

import { elemente } from './seite.js';

/**
 * „In der App öffnen“ an die Bildunterschrift einer Abbildung mit data-app (Link-Adresse der App).
 * @param {HTMLElement} fig
 * @param {string} [seite]
 */
export function appLink(fig, seite = 'index.html') {
  const cap = fig.querySelector('figcaption');
  if (!cap || cap.querySelector('.to-app')) return;
  const a = document.createElement('a');
  a.className = 'to-app';
  a.href = seite + fig.dataset.app;
  a.textContent = fig.closest('.fig-grid5') ? 'App' : 'In der App öffnen';
  cap.append(' ', a);
}

// ------------------------------------------------------------------ Nachladen beim Hineinscrollen
// Für Abbildungen, die viel kosten (z. B. 3D-Ansichten mit WebGL: Browser halten nur wenige Kontexte gleichzeitig,
// Safari auf iPhone/iPad etwa 8). Nur Abbildungen in der Nähe des sichtbaren Bereichs leben: beim Hineinscrollen
// zeigen(fig), beim Verlassen freigeben(fig). Rückgabe: lebt(fig), z. B. um nach einem asynchronen Laden zu prüfen,
// ob die Abbildung inzwischen wieder aus dem Bild gescrollt ist.
/**
 * @param {Element[]} figs
 * @param {{ zeigen: (fig: Element) => unknown, freigeben: (fig: Element) => void, fehlertext?: string, rand?: string }} optionen
 * @returns {{ lebt: (fig: Element) => boolean }}
 */
export function nachladen(figs, { zeigen, freigeben, fehlertext = 'Die Abbildung konnte nicht geladen werden.', rand = '300px 0px' }) {
  /** @type {Set<Element>} */
  const live = new Set();
  /** @param {Element} fig */
  const lebt = (fig) => live.has(fig);
  if (!figs.length) return { lebt };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) { live.delete(e.target); freigeben(e.target); continue; }
      if (live.has(e.target)) continue;
      live.add(e.target);
      let p;
      try { p = Promise.resolve(zeigen(e.target)); } catch (err) { p = Promise.reject(err); }
      p.catch((err) => {
        const art = e.target.querySelector('.fig-art');
        if (art) art.innerHTML = `<p class="fig-err">${fehlertext}</p>`;
        console.error(err);
      });
    }
  }, { rootMargin: rand });
  figs.forEach((f) => io.observe(f));
  return { lebt };
}

// ------------------------------------------------------------------ Querstriche in gezeichneten Abbildungen
// In SVG-Text sitzt text-decoration: overline auf Höhe der Oberlänge, deutlich zu hoch, und läuft über
// benachbarte Ziffern durch. Deshalb eigene Striche knapp über jeder Ziffer
// (<tspan class="ovs">); Lage aus der gerenderten Schrift, Farbe wie der Text.
export function querstriche() {
  for (const old of document.querySelectorAll('.ovs-bar')) old.remove();
  for (const text of elemente('figure svg text', SVGTextElement)) {
    const marked = [...text.querySelectorAll('tspan.ovs')];
    if (!marked.length) continue;
    const cs = getComputedStyle(text);
    const fs = parseFloat(cs.fontSize);
    const h = Math.max(1, 0.075 * fs);
    const base = parseFloat(text.getAttribute('y') ?? '');
    let i = 0;
    for (const node of text.childNodes) {
      const n = [...(node.textContent ?? '')].length;
      if (node instanceof Element && node.classList.contains('ovs')) {
        for (let k = 0; k < n; k++) {
          const e = text.getExtentOfChar(i + k);
          const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          r.setAttribute('class', 'ovs-bar');
          r.setAttribute('x', (e.x + 0.09 * fs).toFixed(1));
          r.setAttribute('y', (base - 0.82 * fs - h).toFixed(1));
          r.setAttribute('width', Math.max(1, e.width - 0.18 * fs).toFixed(1));
          r.setAttribute('height', h.toFixed(2));
          r.style.fill = cs.fill;
          text.after(r);
        }
      }
      i += n;
    }
  }
}

// ------------------------------------------------------------------ Inhaltsverzeichnis
export function inhaltsverzeichnis() {
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  const byId = new Map(links.map((a) => [(a.getAttribute('href') ?? '').slice(1), a]));
  const secs = elemente('main section[id]').filter((s) => byId.has(s.id));
  if (!secs.length) return;
  // Vertiefungen im Inhaltsverzeichnis kennzeichnen; die Einstufung steht nur am Abschnitt (data-level)
  for (const s of secs) {
    if (s.dataset.level !== 'vertiefung') continue;
    // ganze Kapitel: Randlinie am Eintrag (unter der Zwischenüberschrift „Vertiefungen“)
    if (s.parentElement?.tagName === 'ARTICLE') { byId.get(s.id)?.parentElement?.classList.add('vertiefung'); continue; }
    const tag = document.createElement('span');
    tag.className = 'etikett';
    tag.textContent = 'Vertiefung';
    byId.get(s.id)?.append(tag);
  }
  const io = new IntersectionObserver(() => {
    // aktueller Abschnitt: der letzte, dessen Anfang oberhalb der Bildschirmmitte liegt
    let cur = secs[0];
    for (const s of secs) if (s.getBoundingClientRect().top < window.innerHeight * 0.35) cur = s;
    for (const a of links) a.removeAttribute('aria-current');
    byId.get(cur.id)?.setAttribute('aria-current', 'true');
  }, { threshold: [0, 1], rootMargin: '0px 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));
  // Telefon: Inhaltsverzeichnis nach Auswahl schliessen
  const det = /** @type {HTMLDetailsElement | null} */ (document.querySelector('.toc details'));
  if (det && window.matchMedia('(max-width: 899px)').matches) det.open = false;
  for (const a of links) a.addEventListener('click', () => { if (det && window.matchMedia('(max-width: 899px)').matches) det.open = false; });
}

// ------------------------------------------------------------------ Abschnittsnummern und Verweise (#85)
// Jeder Abschnitt (<section> mit <h3> direkt in einem Kapitel mit <h2><span class="nr">) bekommt Kapitel und
// laufende Nummer, z. B. „8.2“, in der Überschrift und im Inhaltsverzeichnis; Abschnitte, die Vertiefung sind,
// zählen mit. Verweise im Text wie „Abschnitt 8.2“, „Abschn. 8.2“ oder „Abschnitte 3.3–3.4“ werden Links auf den
// Abschnitt (Titel als Tooltip). Kein Verweis auf einen eigenen Abschnitt ist:
// - Text in .quellen und in Links (Querverweise auf das Skript einer anderen App sind schon Links);
// - eine Nummer mit drei Stufen („Abschn. 2.2.7“, International Tables);
// - ein Zitat „Werk, Abschn. x.y“ (Komma davor) oder mit Seitenangabe („Abschn. 7.2, S. 104“).
// Die Tests der Apps prüfen mit pruefeAbschnittsverweise, dass jeder Verweis einen Abschnitt trifft.

const ZAHL = String.raw`\d+\.\d+(?![.\d]*\d)`;
const VERWEIS = new RegExp(String.raw`(?:Abschnitte?|Abschn\.)\s+${ZAHL}(?:\s*(?:,|und|bis|–|-)\s*${ZAHL})*`, 'g');
/** Werke, deren Abschnitte ein Skript zitiert; ein Verweis im selben Satz ohne Zitierform wird gemeldet. */
const WERKE = /Borchardt|Hoffmann|Kleber|Schwarzenbach|Conway|Paufler|Brückler|Rosebrock|Glosauer|Wipf|Wagner|Schattschneider|Grünbaum|ebenda/;

/**
 * Verweise auf eigene Abschnitte in einem Text, je Nummer ein Treffer. Der erste Treffer eines Verweises beginnt
 * beim Wort („Abschnitt 4.2“), weitere stehen nur auf ihrer Nummer („und 3.4“). Zitate anderer Werke (Komma davor,
 * Seitenangabe danach) zählen nicht.
 * @param {string} text
 * @returns {{ start: number, ende: number, nummer: string }[]}
 */
export function abschnittsverweise(text) {
  /** @type {{ start: number, ende: number, nummer: string }[]} */
  const treffer = [];
  for (const m of text.matchAll(VERWEIS)) {
    const start = m.index ?? 0;
    const ende = start + m[0].length;
    if (/,\s*$/.test(text.slice(Math.max(0, start - 3), start))) continue;
    if (/^,\s*S\.\s/.test(text.slice(ende, ende + 6))) continue;
    let erste = true;
    for (const z of m[0].matchAll(new RegExp(ZAHL, 'g'))) {
      const s = start + (z.index ?? 0);
      treffer.push({ start: erste ? start : s, ende: s + z[0].length, nummer: z[0] });
      erste = false;
    }
  }
  return treffer;
}

const LEER = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const BLOCK = new Set(['p', 'li', 'ul', 'ol', 'dl', 'dt', 'dd', 'div', 'section', 'article', 'figure', 'figcaption',
  'table', 'caption', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'nav', 'header', 'footer', 'main', 'aside', 'details', 'summary']);
/** @type {Record<string, string>} */
const ENTITAETEN = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', thinsp: ' ' };
/** @param {string} s */
const entschluesseln = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (e, n) => {
  if (n[0] === '#') return String.fromCodePoint(n[1] === 'x' || n[1] === 'X' ? parseInt(n.slice(2), 16) : Number(n.slice(1)));
  return ENTITAETEN[n] ?? e;
});

/**
 * Gliederung und Text eines Skripts aus dem HTML, ohne Browser (für die Tests der Apps): Nummern der Abschnitte wie
 * abschnitte() sie vergibt, und der Text des Artikels, in dem Links und .quellen durch Platzhalter ersetzt sind.
 * @param {string} html
 * @returns {{ nummern: Map<string, { id: string, titel: string }>, text: string }}
 */
export function skriptGliederung(html) {
  /** @type {Map<string, { id: string, titel: string }>} */
  const nummern = new Map();
  /** @type {{ tag: string, klasse: string, id: string, kapitel?: { nr: string, n: number } }[]} */
  const stapel = [];
  let text = '';
  /** @type {{ nr: string, n: number } | null} */
  let kapitelNr = null; // Kapitel, dessen <h2> gerade gelesen wird
  let nrText = '';
  /** @type {{ nummer: string, id: string } | null} */
  let h3 = null;
  let h3Text = '';
  const tok = /<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>|<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  for (const m of html.matchAll(tok)) {
    const [, , zu, name, attr = '', roh] = m;
    if (roh !== undefined) {
      if (!stapel.some((e) => e.tag === 'article')) continue;
      const t = entschluesseln(roh);
      const gesperrt = stapel.some((e) => ['a', 'h1', 'h2', 'h3'].includes(e.tag) || /\bquellen\b/.test(e.klasse));
      text += gesperrt ? '\u0000'.repeat(t.length) : t;
      if (stapel.some((e) => e.klasse.split(/\s+/).includes('nr')) && kapitelNr) nrText += t;
      if (h3) h3Text += t;
      continue;
    }
    if (!name) continue;
    const tag = name.toLowerCase();
    if (BLOCK.has(tag)) text += '\n';
    if (zu) {
      const i = stapel.map((e) => e.tag).lastIndexOf(tag);
      if (i < 0) continue;
      if (tag === 'h2' && kapitelNr) { kapitelNr.nr = nrText.trim(); kapitelNr = null; }
      if (tag === 'h3' && h3) { nummern.set(h3.nummer, { id: h3.id, titel: h3Text.replace(/\s+/g, ' ').trim() }); h3 = null; }
      stapel.length = i;
      continue;
    }
    if (LEER.has(tag) || /\/\s*$/.test(attr)) continue;
    const klasse = attr.match(/\bclass\s*=\s*["']([^"']*)/)?.[1] ?? '';
    const id = attr.match(/\bid\s*=\s*["']([^"']*)/)?.[1] ?? '';
    const oben = stapel[stapel.length - 1];
    /** @type {{ tag: string, klasse: string, id: string, kapitel?: { nr: string, n: number } }} */
    const eintrag = { tag, klasse, id };
    if (tag === 'section' && oben?.tag === 'article') eintrag.kapitel = { nr: '', n: 0 };
    if (tag === 'h2' && oben?.kapitel) { kapitelNr = oben.kapitel; nrText = ''; }
    if (tag === 'h3' && oben?.tag === 'section') {
      const kap = stapel[stapel.length - 2]?.kapitel;
      if (kap?.nr) { h3 = { nummer: `${kap.nr}.${++kap.n}`, id: oben.id }; h3Text = ''; }
    }
    stapel.push(eintrag);
  }
  return { nummern, text };
}

/**
 * Prüfung für die Tests der Apps: Jeder Verweis „Abschnitt x.y“ im Skript zeigt auf einen Abschnitt, den es gibt,
 * und steht nicht im selben Satz wie ein zitiertes Werk (dort gehört die Zitierform „Werk, Abschn. x.y“ hin).
 * Rückgabe: Befunde (leer, wenn alles stimmt) und die Zahl der Verweise.
 * @param {string} html
 * @returns {{ befunde: string[], verweise: number }}
 */
export function pruefeAbschnittsverweise(html) {
  const { nummern, text } = skriptGliederung(html);
  /** @type {string[]} */
  const befunde = [];
  const treffer = abschnittsverweise(text);
  for (const t of treffer) {
    const umfeld = text.slice(Math.max(0, t.start - 40), t.ende + 20).replace(/\s+/g, ' ');
    if (!nummern.has(t.nummer)) befunde.push(`Abschnitt ${t.nummer} gibt es nicht: „…${umfeld}…“`);
    const satz = text.slice(0, t.start).split(/[.!?]\s|\n/).pop() ?? '';
    if (WERKE.test(satz)) befunde.push(`Abschnitt ${t.nummer} im Satz eines zitierten Werks (Zitierform „Werk, Abschn. x.y“?): „…${umfeld}…“`);
  }
  return { befunde, verweise: treffer.length };
}

/**
 * Abschnittsnummern in Überschriften und Inhaltsverzeichnis schreiben und Verweise im Text verlinken (#85). Vor
 * inhaltsverzeichnis() aufrufen. Rückgabe: Nummer → Abschnitt.
 * @returns {Map<string, HTMLElement>}
 */
export function abschnitte() {
  /** @type {Map<string, HTMLElement>} */
  const nummern = new Map();
  const artikel = document.querySelector('main article');
  if (!artikel) return nummern;
  for (const kap of artikel.querySelectorAll(':scope > section')) {
    const nr = kap.querySelector(':scope > h2 .nr')?.textContent?.trim();
    if (!nr) continue;
    let n = 0;
    for (const s of kap.querySelectorAll(':scope > section')) {
      const h = s.querySelector(':scope > h3');
      if (!(s instanceof HTMLElement) || !h) continue;
      const nummer = `${nr}.${++n}`;
      nummern.set(nummer, s);
      if (h.querySelector(':scope > .nr')) continue;
      s.dataset.titel = `${nummer} ${(h.textContent ?? '').replace(/\s+/g, ' ').trim()}`;
      const span = document.createElement('span');
      span.className = 'nr';
      span.textContent = nummer;
      // Leerzeichen nach der Nummer, damit Lesezeichen im PDF und vorgelesener Text „8.2 Titel“ lauten
      h.prepend(span, ' ');
      const toc = s.id ? document.querySelector(`.toc a[href="#${CSS.escape(s.id)}"]`) : null;
      if (toc && !toc.querySelector('.nr')) toc.prepend(span.cloneNode(true), ' ');
    }
  }
  // Text des Artikels am Stück, damit Komma und Seitenangabe über Grenzen von Elementen hinweg erkannt werden
  /** @type {{ node: Text, start: number }[]} */
  const teile = [];
  let text = '';
  /** @type {Element | null} */
  let block = null;
  const w = document.createTreeWalker(artikel, NodeFilter.SHOW_TEXT);
  for (let node = /** @type {Text | null} */ (w.nextNode()); node; node = /** @type {Text | null} */ (w.nextNode())) {
    const el = node.parentElement;
    const b = el?.closest(`${[...BLOCK].join(',')}`) ?? null;
    if (b !== block) { text += '\n'; block = b; }
    const t = node.data;
    if (el?.closest('a, .quellen, h1, h2, h3, script, style')) { text += '\u0000'.repeat(t.length); continue; }
    teile.push({ node, start: text.length });
    text += t;
  }
  const treffer = abschnittsverweise(text);
  for (let i = teile.length - 1; i >= 0; i--) {
    const { node, start } = teile[i];
    const ende = start + node.data.length;
    for (const t of treffer.filter((x) => x.start >= start && x.ende <= ende).reverse()) {
      const ziel = nummern.get(t.nummer);
      if (!ziel) continue;
      const rest = node.splitText(t.start - start);
      rest.splitText(t.ende - t.start);
      const a = document.createElement('a');
      a.className = 'abschnitt-link';
      a.href = `#${ziel.id}`;
      a.title = ziel.dataset.titel ?? '';
      rest.replaceWith(a);
      a.append(rest);
    }
  }
  return nummern;
}
