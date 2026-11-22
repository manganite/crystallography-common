// Prüft den Kopf einer Seite auf das, was Suchmaschinen und Vorschauen geteilter Links brauchen
// (Leitfaden Abschn. 9, „Auffindbarkeit“; crystallography-common#164): Sprache, Titel, Beschreibung,
// kanonische Adresse, Open Graph und strukturierte Daten (JSON-LD, schema.org). Ohne Browser: liest das
// HTML als Text. Aufruf im Test der App, je Seite:
//
//   assert.deepEqual(pruefeKopf(html, { adresse: 'https://manganite.github.io/<app>/skript.html' }), []);

/** Höchstlänge des Titels: Google zeigt etwa 60 Zeichen; was länger ist, wird abgeschnitten, nicht verworfen. */
export const TITEL_MAX = 80;
/** Länge der Beschreibung: kürzer sagt zu wenig, länger schneidet Google ab. */
export const BESCHREIBUNG_MIN = 50;
export const BESCHREIBUNG_MAX = 160;
/** Sprache und Region der Seiten (Open Graph). */
export const OG_LOCALE = 'de_CH';

/**
 * Die Entitäten, die in Attributwerten und im Titel der Seiten vorkommen, als Zeichen.
 * @param {string} s
 */
function entitaeten(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

/**
 * Wert eines Attributs im ersten Element, auf das der Ausdruck passt.
 * @param {string} kopf
 * @param {RegExp} element
 * @param {string} attribut
 * @returns {string | undefined}
 */
function attribut(kopf, element, attribut) {
  const tag = kopf.match(element)?.[0];
  const wert = tag?.match(new RegExp(`\\s${attribut}="([^"]*)"`))?.[1];
  return wert === undefined ? undefined : entitaeten(wert);
}

/**
 * Befunde zum Kopf einer Seite; leer, wenn alles stimmt.
 * @param {string} html ganze Seite
 * @param {{ adresse: string }} optionen `adresse`: kanonische Adresse der Seite auf der Live-Seite
 *   (Startseite der App mit Schrägstrich am Ende, nicht `index.html`)
 * @returns {string[]}
 */
export function pruefeKopf(html, { adresse }) {
  /** @type {string[]} */
  const befunde = [];
  const kopf = html.split(/<\/head>/i)[0] ?? '';
  if (!/<html[^>]*\slang="de"/.test(html)) befunde.push('<html lang="de"> fehlt');

  const titel = entitaeten(kopf.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? '');
  if (!titel) befunde.push('<title> fehlt oder ist leer');
  else if (titel.length > TITEL_MAX) befunde.push(`Titel länger als ${TITEL_MAX} Zeichen (${titel.length}): ${titel}`);

  const beschreibung = attribut(kopf, /<meta\s+name="description"[^>]*>/, 'content') ?? '';
  if (!beschreibung) befunde.push('<meta name="description"> fehlt oder ist leer');
  else if (beschreibung.length < BESCHREIBUNG_MIN || beschreibung.length > BESCHREIBUNG_MAX) {
    befunde.push(`Beschreibung hat ${beschreibung.length} Zeichen, erwartet ${BESCHREIBUNG_MIN} bis ${BESCHREIBUNG_MAX}`);
  }

  const kanonisch = attribut(kopf, /<link\s+rel="canonical"[^>]*>/, 'href');
  if (kanonisch !== adresse) befunde.push(`<link rel="canonical"> ist ${kanonisch ?? 'nicht vorhanden'}, erwartet ${adresse}`);

  /** @param {string} name */
  const og = (name) => attribut(kopf, new RegExp(`<meta\\s+property="og:${name}"[^>]*>`), 'content');
  /** @type {[string, string | undefined][]} */
  const erwartet = [
    ['type', 'website'],
    ['locale', OG_LOCALE],
    ['title', titel],
    ['description', beschreibung],
    ['url', adresse],
  ];
  for (const [name, wert] of erwartet) {
    if (og(name) !== wert) befunde.push(`og:${name} ist ${og(name) ?? 'nicht vorhanden'}, erwartet ${wert}`);
  }
  if (!og('site_name')) befunde.push('og:site_name fehlt');
  const bild = og('image');
  if (!bild || !bild.startsWith('https://')) befunde.push(`og:image fehlt oder ist keine absolute Adresse (${bild ?? '–'})`);

  const bloecke = [...kopf.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (bloecke.length !== 1) befunde.push(`erwartet genau ein <script type="application/ld+json">, gefunden ${bloecke.length}`);
  else {
    /** @type {any} */
    let daten;
    try {
      daten = JSON.parse(bloecke[0][1]);
    } catch (e) {
      befunde.push(`JSON-LD ist kein gültiges JSON: ${/** @type {Error} */ (e).message}`);
    }
    if (daten) {
      const typen = [daten['@type']].flat();
      if (daten['@context'] !== 'https://schema.org') befunde.push('JSON-LD: @context ist nicht https://schema.org');
      if (!typen.includes('LearningResource')) befunde.push(`JSON-LD: @type enthält nicht LearningResource (${typen.join(', ')})`);
      /** @type {[string, unknown][]} */
      const felder = [
        ['name', titel],
        ['description', beschreibung],
        ['url', adresse],
        ['inLanguage', 'de'],
      ];
      for (const [feld, wert] of felder) {
        if (daten[feld] !== wert) befunde.push(`JSON-LD: ${feld} ist ${JSON.stringify(daten[feld])}, erwartet ${JSON.stringify(wert)}`);
      }
    }
  }
  return befunde;
}
