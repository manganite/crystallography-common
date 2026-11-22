// Prüfung des Kopfs einer Seite (tools/kopf-pruefen.mjs, Leitfaden Abschn. 9, Auffindbarkeit, #164).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('jede fehlende oder abweichende Angabe gibt einen Befund', () => {
  /** @type {[string, (h: string) => string, RegExp][]} */
  const faelle = [
    ['Sprache', (h) => h.replace('lang="de"', 'lang="en"'), /lang="de"/],
    ['Titel leer', (h) => h.replace(`<title>${TITEL}</title>`, '<title> </title>'), /<title> fehlt/],
    ['Titel zu lang', (h) => h.replaceAll(TITEL, 'x'.repeat(TITEL_MAX + 1)), /Titel länger/],
    ['Beschreibung fehlt', (h) => h.replace(/<meta name="description"[^>]*>/, ''), /description"> fehlt/],
    ['Beschreibung zu lang', (h) => h.replaceAll(BESCHREIBUNG, 'y'.repeat(BESCHREIBUNG_MAX + 1)), /Beschreibung hat 161 Zeichen/],
    ['canonical falsch', (h) => h.replace(`<link rel="canonical" href="${ADRESSE}">`, '<link rel="canonical" href="https://manganite.github.io/muster-app/index.html">'), /canonical/],
    ['og:title abweichend', (h) => h.replace(`property="og:title" content="${TITEL}"`, 'property="og:title" content="Anders"'), /og:title ist Anders/],
    ['og:locale fehlt', (h) => h.replace(/<meta property="og:locale"[^>]*>/, ''), /og:locale ist nicht vorhanden/],
    ['og:image relativ', (h) => h.replace('content="https://manganite.github.io/muster-app/icons/vorschau.png"', 'content="icons/vorschau.png"'), /og:image/],
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

test('die Seiten der Vorlage erfüllen die Prüfung', () => {
  const live = 'https://manganite.github.io/muster-app/';
  for (const [datei, adresse] of [['index.html', live], ['skript.html', `${live}skript.html`], ['quiz.html', `${live}quiz.html`], ['hilfe.html', `${live}hilfe.html`]]) {
    const html = readFileSync(new URL(`../vorlagen/app/${datei}`, import.meta.url), 'utf8');
    assert.deepEqual(pruefeKopf(html, { adresse }), [], datei);
  }
});
