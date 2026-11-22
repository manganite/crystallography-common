// Prüfung des Kopfs einer Seite (tools/kopf-pruefen.mjs, Leitfaden Abschn. 9, Auffindbarkeit, #164).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeKopf, TITEL_MAX, BESCHREIBUNG_MAX } from '../tools/kopf-pruefen.mjs';

const ADRESSE = 'https://manganite.github.io/muster-app/skript.html';
const TITEL = 'Skript: Muster-App &amp; mehr';
const BESCHREIBUNG = 'Eine Beschreibung mit &quot;Anführungszeichen&quot; und genug Zeichen für die Prüfung der Länge.';
const LD = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: 'Skript: Muster-App & mehr',
  description: 'Eine Beschreibung mit "Anführungszeichen" und genug Zeichen für die Prüfung der Länge.',
  url: ADRESSE,
  inLanguage: 'de',
  learningResourceType: 'Skript',
  educationalLevel: 'Hochschule',
  author: { '@type': 'Person', name: 'A. Autor' },
  license: 'https://opensource.org/licenses/MIT',
  isPartOf: { '@type': 'WebSite', url: 'https://manganite.github.io/de/' },
};

/** Eine gültige Seite; `aendern` ersetzt Teile davon. @param {(html: string) => string} [aendern] */
function seite(aendern = (h) => h) {
  return aendern(`<!doctype html>
<html lang="de">
<head>
<title>${TITEL}</title>
<meta name="description" content="${BESCHREIBUNG}">
<link rel="canonical" href="${ADRESSE}">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_CH">
<meta property="og:site_name" content="Muster-App">
<meta property="og:title" content="${TITEL}">
<meta property="og:description" content="${BESCHREIBUNG}">
<meta property="og:url" content="${ADRESSE}">
<meta property="og:image" content="https://manganite.github.io/muster-app/icons/vorschau.png">
<script type="application/ld+json">${JSON.stringify(LD)}</script>
</head>
<body><title>nicht im Kopf</title></body>
</html>`);
}

test('eine vollständige Seite ergibt keine Befunde (Entitäten werden vor dem Vergleich aufgelöst)', () => {
  assert.deepEqual(pruefeKopf(seite(), { adresse: ADRESSE }), []);
});

test('Reihenfolge und Schreibweise der Attribute, Entitäten und Kommentare stören nicht', () => {
  const html = seite((h) =>
    h
      .replace('<meta property="og:locale" content="de_CH">', "<META CONTENT='de_CH' Property='og:locale'>")
      .replace(`<link rel="canonical" href="${ADRESSE}">`, `<link href="${ADRESSE}" rel="canonical">`)
      .replace(`<title>${TITEL}</title>`, '<title>Skript: Muster-App &#38; mehr</title>')
      .replace('<head>', '<head>\n<!-- <meta name="description" content="auskommentiert"> -->'),
  );
  assert.deepEqual(pruefeKopf(html, { adresse: ADRESSE }), []);
  // ein Gedankenstrich als Zeichen im Titel und als Entität in og:title ist derselbe Titel
  const strich = seite((h) =>
    h
      .replace(`<title>${TITEL}</title>`, '<title>Skript – Muster</title>')
      .replace(`property="og:title" content="${TITEL}"`, 'property="og:title" content="Skript &ndash; Muster"')
      .replace('"name":"Skript: Muster-App & mehr"', '"name":"Skript – Muster"'),
  );
  assert.deepEqual(pruefeKopf(strich, { adresse: ADRESSE }), []);
});

test('jede fehlende oder abweichende Angabe gibt einen Befund', () => {
  /** @type {[string, (h: string) => string, RegExp][]} */
  const faelle = [
    ['Sprache', (h) => h.replace('lang="de"', 'lang="en"'), /lang="de"/],
    ['Titel leer', (h) => h.replace(`<title>${TITEL}</title>`, '<title> </title>'), /<title> fehlt/],
    ['Titel zu lang', (h) => h.replaceAll(TITEL, 'x'.repeat(TITEL_MAX + 1)), /Titel länger/],
    ['Beschreibung fehlt', (h) => h.replace(/<meta name="description"[^>]*>/, ''), /description"> fehlt/],
    ['Beschreibung zu lang', (h) => h.replaceAll(BESCHREIBUNG, 'y'.repeat(BESCHREIBUNG_MAX + 1)), new RegExp(`Beschreibung hat ${BESCHREIBUNG_MAX + 1} Zeichen`)],
    ['canonical falsch', (h) => h.replace(`<link rel="canonical" href="${ADRESSE}">`, '<link rel="canonical" href="https://manganite.github.io/muster-app/index.html">'), /canonical/],
    ['og:title abweichend', (h) => h.replace(`property="og:title" content="${TITEL}"`, 'property="og:title" content="Anders"'), /og:title ist Anders/],
    ['og:locale fehlt', (h) => h.replace(/<meta property="og:locale"[^>]*>/, ''), /og:locale ist nicht vorhanden/],
    ['og:image relativ', (h) => h.replace('content="https://manganite.github.io/muster-app/icons/vorschau.png"', 'content="icons/vorschau.png"'), /og:image/],
    ['og:image anderes Bild', (h) => h.replace('content="https://manganite.github.io/muster-app/icons/vorschau.png"', 'content="https://example.org/x.png"'), /og:image/],
    ['Beschreibung doppelt', (h) => h.replace('<link rel="canonical"', `<meta name="description" content="${BESCHREIBUNG}">\n<link rel="canonical"`), /description"> steht 2-mal/],
    ['Titel nur im Inhalt', (h) => h.replace(`<title>${TITEL}</title>`, ''), /<title> fehlt/],
    ['JSON-LD null', (h) => h.replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, '$1null$2'), /kein Objekt/],
    ['JSON-LD ohne Lizenz', (h) => h.replace(/"license":"[^"]*",/, ''), /license fehlt/],
    ['og:site_name fehlt', (h) => h.replace(/<meta property="og:site_name"[^>]*>/, ''), /og:site_name fehlt/],
    ['kein JSON-LD', (h) => h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ''), /genau ein/],
    ['JSON-LD ungültig', (h) => h.replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, '$1{kein json$2'), /kein gültiges JSON/],
    ['JSON-LD falscher Typ', (h) => h.replace('"LearningResource"', '"Thing"'), /LearningResource/],
    ['JSON-LD andere Adresse', (h) => h.replace(`"url":"${ADRESSE}"`, '"url":"https://example.org/"'), /JSON-LD: url/],
  ];
  for (const [name, aendern, erwartet] of faelle) {
    const befunde = pruefeKopf(seite(aendern), { adresse: ADRESSE });
    assert.ok(befunde.some((b) => erwartet.test(b)), `${name}: ${JSON.stringify(befunde)}`);
  }
});
