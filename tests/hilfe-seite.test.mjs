// Hilfeseite (#24): Bilder je Schritt, Inhalt, Prüfung der Daten, Start eines Experiments aus der Adresse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hilfeBilder, hilfeHTML, hilfeInhalt, pruefeHilfe, experimentAusAdresse, EXPERIMENT_PARAM } from '../js/hilfe-seite.js';

/** @import { HilfeDaten } from '../js/hilfe-seite.js' */

/** @type {HilfeDaten} */
const DATEN = {
  modi: [{ id: 'a', name: 'Modus A', hash: '#m=a' }, { id: 'b', name: 'Modus B', hash: '#m=b' }, { id: 'c', name: 'Leer', hash: '#m=c' }],
  ersteSchritte: [
    { id: 'einstieg-a', modus: 'a', titel: 'Erste Schritte', schritte: [
      { frage: '<b>Gruppe wählen.</b>', handlung: { text: '<i>p</i>4 wählen', hash: '#m=a&g=p4' }, zeige: '#picker' },
      { frage: 'Darstellung ändern.', handlung: { text: 'öffnen', aktion: 'darstellung' }, zeige: '#sec-view' },
      { frage: 'Ohne Bild.' },
    ] },
    { id: 'einstieg-b', modus: 'b', titel: 'Erste Schritte B', schritte: [{ frage: 'B', zeige: '#tab-b' }] },
  ],
  experimente: [
    { id: 'spiegel', modus: 'a', titel: 'Spiegellinien', schritte: [{ frage: 'Wie viele?', vermutung: ['2', '4'], richtig: 1, handlung: { text: 'zeigen', hash: '#m=a&g=p4mm' } }] },
    { id: 'spiegel-n', modus: 'a', titel: 'Erzeugt', params: () => ['3', '4'], make: (p) => [{ frage: `Bei ${p}?`, handlung: { text: 'x', hash: `#g=p${p}` } }] },
  ],
};

test('Bilder: je Schritt mit zeige eines; Adresse = letzter Zustand davor, sonst der Modus', () => {
  assert.deepEqual(hilfeBilder(DATEN), [
    { datei: 'einstieg-a-1.png', adresse: '#m=a', zeige: '#picker', ablauf: 'einstieg-a', nr: 1 },
    { datei: 'einstieg-a-2.png', adresse: '#m=a&g=p4', zeige: '#sec-view', ablauf: 'einstieg-a', nr: 2 },
    { datei: 'einstieg-b-1.png', adresse: '#m=b', zeige: '#tab-b', ablauf: 'einstieg-b', nr: 1 },
  ]);
});

test('Inhalt: Anleitungen mit Bildern und Links, Experimente als Liste, leere Modi entfallen', () => {
  const h = hilfeHTML(DATEN);
  assert.match(h, /<section class="hilfe-modus" id="modus-a">/);
  assert.match(h, /id="modus-b"/);
  assert.doesNotMatch(h, /modus-c/);
  assert.match(h, /<img src="hilfe\/einstieg-a-1\.png" alt="Ausschnitt der App: p4 wählen, das Bedienelement ist markiert"/);
  assert.match(h, /href="index\.html#m=a&amp;g=p4">In der App zeigen/);
  // ein Schritt mit Aktion hat keinen Link (die Aktion steht nicht in der Adresse)
  assert.equal(h.match(/In der App zeigen/g)?.length, 1);
  assert.match(h, /href="index\.html\?experiment=spiegel#m=a">In der App ausprobieren/);
  assert.match(h, /<b>Erzeugt<\/b> <span class="hilfe-erzeugt"[^>]*>↻<\/span><br>Bei 3\?/);
  // keine Auflösung auf der Hilfeseite
  assert.doesNotMatch(h, /Wie viele\?[\s\S]*<li>2/);
  assert.equal(h.match(/<img /g)?.length, 3);
  const inhalt = hilfeInhalt(DATEN);
  assert.match(inhalt, /href="#modus-a">Modus A<\/a><ol><li><a href="#einstieg-a">Erste Schritte<\/a><\/li><li><a href="#experimente-a">Experimente/);
  assert.doesNotMatch(inhalt, /modus-c/);
  assert.match(hilfeHTML({ ...DATEN, app: 'app.html', bilder: 'bilder/' }), /src="bilder\/einstieg-a-1\.png"[\s\S]*href="app\.html#m=a&amp;g=p4"/);
});

test('Prüfung: fehlende Elemente, Bilder, überzählige Bilder, unbekannte Modi', () => {
  const html = '<div id="picker"></div><details id="sec-view"></details><button id="tab-b"></button>';
  const dateien = ['einstieg-a-1.png', 'einstieg-a-2.png', 'einstieg-b-1.png'];
  assert.deepEqual(pruefeHilfe(DATEN, { html, dateien }), []);
  const f = pruefeHilfe({ ...DATEN, experimente: [{ ...DATEN.experimente[0], modus: 'x' }], modi: [...DATEN.modi, { id: 'd', name: 'D', hash: 'm=d' }] },
    { html: html.replace('id="tab-b"', ''), dateien: [...dateien.slice(1), 'alt.png'] });
  assert.deepEqual(f, [
    'spiegel: unbekannter Modus x',
    'Modus d: Adresse muss mit # beginnen',
    'einstieg-a, Schritt 1: Bild einstieg-a-1.png fehlt (node tools/common/hilfe-bilder.mjs)',
    'einstieg-b, Schritt 1: Element #tab-b fehlt in der App',
    'überzähliges Bild alt.png',
  ]);
});

test('Experiment aus der Adresse: startet bekannte, entfernt den Parameter immer', () => {
  const g = /** @type {any} */ (globalThis);
  const alt = { location: g.location, history: g.history };
  /** @param {string} href */
  const lauf = (href) => {
    /** @type {string[]} */
    const gestartet = [];
    let neu = '';
    g.location = new URL(href);
    g.history = { state: null, replaceState: (/** @type {unknown} */ _s, /** @type {string} */ _t, /** @type {string} */ u) => { neu = u; } };
    const id = experimentAusAdresse({ starte: (i) => gestartet.push(i) }, ['spiegel']);
    return { id, gestartet, neu };
  };
  try {
    assert.deepEqual(lauf(`http://x/app/index.html?${EXPERIMENT_PARAM}=spiegel&a=1#m=a`), { id: 'spiegel', gestartet: ['spiegel'], neu: '/app/index.html?a=1#m=a' });
    assert.deepEqual(lauf(`http://x/index.html?${EXPERIMENT_PARAM}=unbekannt#m=a`), { id: null, gestartet: [], neu: '/index.html#m=a' });
    assert.deepEqual(lauf('http://x/index.html#m=a'), { id: null, gestartet: [], neu: '' });
  } finally {
    g.location = alt.location; g.history = alt.history;
  }
});
