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
      { frage: 'Nach einer Aktion.', bild: '#m=a&g=p6', zeige: '#picker' },
      { frage: 'Danach.', zeige: '#picker' },
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
    // nach einer Aktion: Adresse aus bild, sie gilt auch für die folgenden Schritte
    { datei: 'einstieg-a-4.png', adresse: '#m=a&g=p6', zeige: '#picker', ablauf: 'einstieg-a', nr: 4 },
    { datei: 'einstieg-a-5.png', adresse: '#m=a&g=p6', zeige: '#picker', ablauf: 'einstieg-a', nr: 5 },
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
  assert.match(h, /<b>Erzeugt<\/b> <span class="hilfe-erzeugt" aria-hidden="true">↻<\/span><span class="sr"> \(immer neue Aufgaben\)<\/span><br>Bei 3\?/);
  // keine Auflösung auf der Hilfeseite
  assert.doesNotMatch(h, /Wie viele\?[\s\S]*<li>2/);
  assert.equal(h.match(/<img /g)?.length, 5);
  const inhalt = hilfeInhalt(DATEN);
  assert.match(inhalt, /href="#modus-a">Modus A<\/a><ol><li><a href="#einstieg-a">Erste Schritte<\/a><\/li><li><a href="#experimente-a">Experimente/);
  assert.doesNotMatch(inhalt, /modus-c/);
  assert.match(hilfeHTML({ ...DATEN, app: 'app.html', bilder: 'bilder/' }), /src="bilder\/einstieg-a-1\.png"[\s\S]*href="app\.html#m=a&amp;g=p4"/);
});

test('Experimente nach Kapiteln wie in der App (#107): ab 6 je Modus, sonst eine Liste ohne Überschrift', () => {
  const kapitel = [{ nr: 1, titel: 'Eins', kurz: 'Eins', anker: 'k1' }, { nr: 2, titel: 'Zwei', kurz: 'Zwei', anker: 'k2' }];
  /** @param {string} id @param {number} [k] */
  const ex = (id, k) => ({ id, modus: 'a', ...(k === undefined ? {} : { kapitel: k }), titel: `T-${id}`, schritte: [{ frage: `F-${id}` }] });
  const sechs = [ex('p', 2), ex('q', 1), ex('r', 2), ex('s', 1), ex('t'), ex('u', 1)];
  const h = hilfeHTML({ ...DATEN, experimente: sechs, kapitel });
  const teil = h.slice(h.indexOf('id="experimente-a"'));
  assert.deepEqual([...teil.matchAll(/<h4>([^<]*)<\/h4>/g)].map((m) => m[1]), ['1 Eins', '2 Zwei', 'Weitere']);
  assert.deepEqual([...teil.matchAll(/<b>T-(\w)<\/b>/g)].map((m) => m[1]), ['q', 's', 'u', 'p', 'r', 't']);
  assert.equal(teil.match(/<ul class="hilfe-liste">/g)?.length, 3);
  // unter der Schwelle (DATEN: zwei Experimente) wie bisher
  const flach = hilfeHTML({ ...DATEN, kapitel });
  assert.doesNotMatch(flach, /<h4>/);
  assert.equal(flach.match(/<ul class="hilfe-liste">/g)?.length, 1);
});

test('Prüfung: fehlende Elemente, Bilder, überzählige Bilder, unbekannte Modi', () => {
  const html = '<div id="picker"></div><details id="sec-view"></details><button id="tab-b"></button>';
  const dateien = ['einstieg-a-1.png', 'einstieg-a-2.png', 'einstieg-a-4.png', 'einstieg-a-5.png', 'einstieg-b-1.png'];
  assert.deepEqual(pruefeHilfe(DATEN, { html, dateien }), []);
  const leer = { id: 'leer', titel: 'Leer', params: () => [], make: () => [] };
  const ohneId = { id: 'einstieg-c', modus: 'a', titel: 'C', schritte: [{ frage: 'C', zeige: '.tabs button' }] };
  const f = pruefeHilfe({ ...DATEN, ersteSchritte: [...DATEN.ersteSchritte, ohneId], experimente: [{ ...DATEN.experimente[0], modus: 'x' }, leer], modi: [...DATEN.modi, { id: 'd', name: 'D', hash: 'm=d' }] },
    { html: html.replace('id="tab-b"', ''), dateien: [...dateien.slice(1), 'einstieg-c-1.png', 'alt.png'] });
  assert.deepEqual(f, [
    'spiegel: unbekannter Modus x',
    'Modus d: Adresse muss mit # beginnen',
    'einstieg-a, Schritt 1: Bild einstieg-a-1.png fehlt (node tools/common/hilfe-bilder.mjs)',
    'einstieg-b, Schritt 1: Element #tab-b fehlt in der App',
    'einstieg-c, Schritt 1: zeige muss mit #id beginnen (.tabs button)',
    'leer: keine Parameter',
    'überzähliges Bild alt.png',
  ]);
  // ein erzeugtes Experiment ohne Parameter erscheint ohne Frage, statt make(undefined) aufzurufen
  assert.match(hilfeHTML({ ...DATEN, experimente: [{ ...leer, modus: 'a' }] }), /<b>Leer<\/b>[^\n]*\n {2}<br><a class="to-app"/);
});

test('Alternativtext: Querstriche, Symbole und Zeichen wie in der Ansage', () => {
  const h = hilfeHTML({ modi: [DATEN.modi[0]], experimente: [], ersteSchritte: [{ id: 'q', modus: 'a', titel: 'Q', schritte: [
    { frage: 'x', handlung: { text: '<span class="ov">4</span>&nbsp;&amp; <span role="img" aria-label="4 quer, 2, m"><span class="ov">4</span>2m</span> wählen', hash: '#m=a' }, zeige: '#picker' },
  ] }] });
  assert.match(h, /alt="Ausschnitt der App: 4 quer &amp; 4 quer, 2, m wählen, das Bedienelement ist markiert"/);
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
    const id = experimentAusAdresse({ starte: (i) => gestartet.push(i) }, ['spiegel'], () => gestartet.push('offen'));
    return { id, gestartet, neu };
  };
  try {
    assert.deepEqual(lauf(`http://x/app/index.html?${EXPERIMENT_PARAM}=spiegel&a=1#m=a`), { id: 'spiegel', gestartet: ['offen', 'spiegel'], neu: '/app/index.html?a=1#m=a' });
    assert.deepEqual(lauf(`http://x/index.html?${EXPERIMENT_PARAM}=unbekannt#m=a`), { id: null, gestartet: [], neu: '/index.html#m=a' });
    assert.deepEqual(lauf('http://x/index.html#m=a'), { id: null, gestartet: [], neu: '' });
  } finally {
    g.location = alt.location; g.history = alt.history;
  }
});
