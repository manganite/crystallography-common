// Hilfeseite (#24, #114): Bilder, Aufbau und Inhalt, gemeinsame Texte, Prüfung der Daten, Start eines Experiments aus der
// Adresse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hilfeBilder, hilfeHTML, hilfeInhalt, hilfeAnker, pruefeHilfe, experimentAusAdresse, EXPERIMENT_PARAM } from '../js/hilfe-seite.js';
import { UEBERBLICK, KONZEPTE, TECHNIK } from '../js/hilfe-gemeinsam.js';

/** @import { HilfeDaten } from '../js/hilfe-seite.js' */

/** @type {HilfeDaten} */
const DATEN = {
  modi: [{ id: 'a', name: 'Modus A', hash: '#m=a' }, { id: 'b', name: 'Modus B', hash: '#m=b' }, { id: 'c', name: 'Leer', hash: '#m=c' }],
  ersteSchritte: [
    { id: 'einstieg-a', modus: 'a', titel: 'Erste Schritte', schritte: [
      { frage: '<b>Gruppe wählen.</b>', handlung: { text: '<i>p</i>4 wählen', hash: '#m=a&g=p4' }, zeige: '#picker' },
      { frage: 'Darstellung ändern.', handlung: { text: 'öffnen', aktion: 'darstellung' }, zeige: '#sec-view' },
      { frage: 'Ohne Bild.' },
      { frage: 'Nach einer Aktion.', bild: '#m=a&g=p6', vorher: [{ klick: '#werkzeug' }, { ziehen: '#bild', punkte: [[0.2, 0.2], [0.8, 0.5]] }], zeige: '#picker' },
      { frage: 'Danach.', zeige: '#picker' },
    ] },
    { id: 'einstieg-b', modus: 'b', titel: 'Erste Schritte B', schritte: [{ frage: 'B', zeige: '#tab-b' }] },
  ],
  experimente: [
    { id: 'spiegel', modus: 'a', titel: 'Spiegellinien', schritte: [{ frage: 'Wie viele?', vermutung: ['2', '4'], richtig: 1, handlung: { text: 'zeigen', hash: '#m=a&g=p4mm' } }] },
    { id: 'spiegel-n', modus: 'a', titel: 'Erzeugt', params: () => ['3', '4'], make: (p) => [{ frage: `Bei ${p}?`, handlung: { text: 'x', hash: `#g=p${p}` } }] },
  ],
};

test('Bilder: je Schritt mit zeige eines; Adresse = letzter Zustand davor, sonst der Modus; vorher nur im eigenen Bild', () => {
  /** @param {string} datei @param {string} adresse @param {string} zeige @param {string} quelle */
  const b = (datei, adresse, zeige, quelle) => ({ datei, adresse, zeige: [zeige], nummern: false, quelle });
  assert.deepEqual(hilfeBilder(DATEN), [
    b('einstieg-a-1.png', '#m=a', '#picker', 'einstieg-a, Schritt 1'),
    b('einstieg-a-2.png', '#m=a&g=p4', '#sec-view', 'einstieg-a, Schritt 2'),
    // nach einer Aktion: Adresse aus bild, sie gilt auch für die folgenden Schritte
    // vorher gilt nur für das Bild seines Schritts
    { ...b('einstieg-a-4.png', '#m=a&g=p6', '#picker', 'einstieg-a, Schritt 4'), vorher: [{ klick: '#werkzeug' }, { ziehen: '#bild', punkte: [[0.2, 0.2], [0.8, 0.5]] }] },
    b('einstieg-a-5.png', '#m=a&g=p6', '#picker', 'einstieg-a, Schritt 5'),
    b('einstieg-b-1.png', '#m=b', '#tab-b', 'einstieg-b, Schritt 1'),
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

test('Experimente nach Kapiteln wie in der App (#107): ab 6 je Modus und im Schnitt 2 je Kapitel, sonst eine Liste ohne Überschrift', () => {
  const kapitel = [{ nr: 1, titel: 'Eins', kurz: 'Eins', anker: 'k1' }, { nr: 2, titel: 'Zwei', kurz: 'Zwei', anker: 'k2' }];
  /** @param {string} id @param {number} [k] */
  const ex = (id, k) => ({ id, modus: 'a', ...(k === undefined ? {} : { kapitel: k }), titel: `T-${id}`, schritte: [{ frage: `F-${id}` }] });
  const sechs = [ex('p', 2), ex('q', 1), ex('r', 2), ex('s', 1), ex('t'), ex('u', 1)];
  const h = hilfeHTML({ ...DATEN, experimente: sechs, kapitel });
  const teil = h.slice(h.indexOf('id="experimente-a"'));
  assert.deepEqual([...teil.matchAll(/<h4>(?:<span class="sr">Kapitel <\/span>)?([^<]*)<\/h4>/g)].map((m) => m[1]), ['1 Eins', '2 Zwei', 'Weitere']);
  assert.deepEqual([...teil.matchAll(/<b>T-(\w)<\/b>/g)].map((m) => m[1]), ['q', 's', 'u', 'p', 'r', 't']);
  assert.equal(teil.match(/<ul class="hilfe-liste">/g)?.length, 3);
  // ein Experiment ohne Modus zählt wie in der App in jedem Modus: Modus b kommt so auf 6 und wird gegliedert
  /** @param {string} id @param {number} k */
  const exB = (id, k) => ({ ...ex(id, k), modus: 'b' });
  const ohneModus = { id: 'alle', kapitel: 2, titel: 'T-alle', schritte: [{ frage: 'F-alle' }] };
  const b = hilfeHTML({ ...DATEN, experimente: [exB('v', 1), exB('w', 1), exB('x', 2), exB('y', 2), exB('z', 1), ohneModus], kapitel });
  const teilB = b.slice(b.indexOf('id="experimente-b"'), b.indexOf('id="modus-c"'));
  assert.match(b, /id="modus-c"[\s\S]*T-alle/, 'auch in einem Modus ohne eigene Experimente, wie in der App');
  assert.deepEqual([...teilB.matchAll(/<b>T-(\w+)<\/b>/g)].map((m) => m[1]), ['v', 'w', 'z', 'x', 'y', 'alle']);
  assert.match(b, /id="experimente-a"[\s\S]*T-alle[\s\S]*id="experimente-b"/, 'auch im ersten Modus');
  assert.match(hilfeInhalt({ ...DATEN, experimente: [ohneModus] }), /href="#experimente-b"/);
  // ab 6, aber im Schnitt unter 2 je Gruppe (Kapitel 1, 2, „Weitere“ und ein drittes): flach, in der Reihenfolge der Daten
  const kapitel3 = [...kapitel, { nr: 3, titel: 'Drei', kurz: 'Drei', anker: 'k3' }];
  const verteilt = [ex('p', 1), ex('q', 2), ex('r', 3), ex('s', 3), ex('t'), ex('u')];
  const teilV = hilfeHTML({ ...DATEN, experimente: verteilt, kapitel: kapitel3 });
  const v = teilV.slice(teilV.indexOf('id="experimente-a"'), teilV.indexOf('id="experimente-b"'));
  assert.doesNotMatch(v, /<h4>/);
  assert.equal(v.match(/<ul class="hilfe-liste">/g)?.length, 1);
  assert.deepEqual([...v.matchAll(/<b>T-(\w)<\/b>/g)].map((m) => m[1]), ['p', 'q', 'r', 's', 't', 'u']);
  // unter der Schwelle (DATEN: zwei Experimente) wie bisher
  const flach = hilfeHTML({ ...DATEN, kapitel });
  assert.doesNotMatch(flach, /<h4>/);
  assert.equal(flach.match(/<ul class="hilfe-liste">/g)?.length, 1);
});

test('Prüfung: fehlende Elemente, Bilder, überzählige Bilder, unbekannte Modi', () => {
  const html = '<div id="picker"></div><details id="sec-view"></details><button id="tab-b"></button><button id="werkzeug"></button><svg id="bild"></svg>';
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
    'einstieg-c, Schritt 1: Selektor muss mit #id beginnen (.tabs button)',
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

test('Experiment aus der Adresse: wechselt den Modus, schliesst die Erste Schritte, startet; entfernt den Parameter immer', () => {
  const g = /** @type {any} */ (globalThis);
  const alt = { location: g.location, history: g.history };
  const experimente = [{ id: 'spiegel', modus: 'b' }, { id: 'ohne' }];
  /** @param {string} href @param {boolean} [mitOptionen] */
  const lauf = (href, mitOptionen = true) => {
    /** @type {string[]} */
    const gestartet = [];
    let neu = '';
    g.location = new URL(href);
    g.history = { state: null, replaceState: (/** @type {unknown} */ _s, /** @type {string} */ _t, /** @type {string} */ u) => { neu = u; } };
    const o = { modusWaehlen: (/** @type {string} */ m) => gestartet.push(`modus ${m}`), einstiegSchliessen: () => gestartet.push('einstieg zu'), oeffnen: () => gestartet.push('offen') };
    const id = experimentAusAdresse({ starte: (i) => gestartet.push(i) }, experimente, mitOptionen ? o : undefined);
    return { id, gestartet, neu };
  };
  try {
    // in den Modus des Experiments (aus einem anderen Modus beendete der Abgleich der Karte es sonst gleich wieder)
    assert.deepEqual(lauf(`http://x/app/index.html?${EXPERIMENT_PARAM}=spiegel&a=1#m=a`), { id: 'spiegel', gestartet: ['modus b', 'einstieg zu', 'offen', 'spiegel'], neu: '/app/index.html?a=1#m=a' });
    // ohne Modus: kein Wechsel; ohne Hash (Erste Schritte erschienen zugleich): sie werden geschlossen
    assert.deepEqual(lauf(`http://x/index.html?${EXPERIMENT_PARAM}=ohne`), { id: 'ohne', gestartet: ['einstieg zu', 'offen', 'ohne'], neu: '/index.html' });
    assert.deepEqual(lauf(`http://x/index.html?${EXPERIMENT_PARAM}=ohne`, false), { id: 'ohne', gestartet: ['ohne'], neu: '/index.html' });
    assert.deepEqual(lauf(`http://x/index.html?${EXPERIMENT_PARAM}=unbekannt#m=a`), { id: null, gestartet: [], neu: '/index.html#m=a' });
    assert.deepEqual(lauf('http://x/index.html#m=a'), { id: null, gestartet: [], neu: '' });
  } finally {
    g.location = alt.location; g.history = alt.history;
  }
});

/** Daten mit allen Teilen der Anleitung (#114). @type {HilfeDaten} */
const VOLL = {
  ...DATEN,
  zweck: '<p>Zweck der App.</p>',
  modi: [{ ...DATEN.modi[0], zweck: 'Wozu A.' }, DATEN.modi[1], DATEN.modi[2]],
  ueberblick: { id: 'aufbau', titel: 'Aufbau', ausschnitt: 'body', eintraege: [{ zeige: 'header.top', name: 'Kopfzeile', text: 'oben' }, { zeige: '#info', name: 'Kenndaten', text: 'unten' }] },
  konzepte: [{ id: 'einrasten', titel: 'Einrasten', text: '<p>Rastet ein.</p>' }],
  bereiche: [
    { id: 'seitenleiste', modus: 'a', titel: 'Seitenleiste', text: '<p>Links.</p>', eintraege: [
      { id: 'gitter', zeige: '#sec-gitter > summary', name: 'Gitter', text: 'Achsen.' },
      { zeige: '#picker', name: 'Gruppen', text: 'Wahl.' },
      { name: 'Hinweis', text: 'ohne Nummer.' },
    ] },
    { id: 'darstellung', titel: 'Darstellung', ausschnitt: '#sec-view', eintraege: [{ id: 'farben', zeige: '#v-farben', name: 'Farben', text: 'f.' }] },
  ],
  anleitungen: [{ id: 'winkel', modus: 'b', titel: 'Winkel messen', schritte: [{ frage: 'Werkzeug wählen.', handlung: { text: 'x', hash: '#m=b&w=1' }, zeige: '#winkel' }] }],
  fragen: [{ id: 'gesperrt', frage: 'Warum gesperrt?', antwort: '<p>Darum.</p>', app: '#m=a&g=p2', skript: 'gitter' }],
  ergaenzungen: { export: '<p>Nur Tafel A.</p>' },
  ohne: ['familie'],
  repo: 'manganite/muster',
};

test('Aufbau: Überblick, Bedienkonzepte, je Modus Bereiche, Anleitungen und Experimente, Fragen, zuletzt Link und Geräte', () => {
  const h = hilfeHTML(VOLL);
  const reihe = ['id="ueberblick"', 'id="teile"', 'id="modi"', 'id="aufbau"', 'id="rueckmeldung"', 'id="konzepte"', 'id="konzept-seitenleiste-tafel"',
    'id="konzept-einrasten"', 'id="modus-a"', 'id="a-seitenleiste"', 'id="a-darstellung"', 'id="einstieg-a"', 'id="experimente-a"', 'id="modus-b"',
    'id="b-darstellung"', 'id="einstieg-b"', 'id="winkel"', 'id="fragen"', 'id="frage-gesperrt"', 'id="technik"', 'id="technik-link"'];
  const stellen = reihe.map((x) => h.indexOf(x));
  assert.ok(stellen.every((x) => x >= 0), reihe.filter((_, i) => stellen[i] < 0).join(', '));
  assert.deepEqual([...stellen].sort((x, y) => x - y), stellen, 'Reihenfolge der Teile');
  // Modi mit Zweck und Link auf ihr Kapitel; Zweck auch unter der Überschrift des Modus
  assert.match(h, /<li><a href="#modus-a"><b>Modus A<\/b><\/a>: Wozu A\.<\/li>/);
  assert.match(h, /<h2>Modus A<\/h2>\n<p>Wozu A\.<\/p>/);
  // gemeinsame Texte: alle ausser den ausgelassenen, mit Ergänzung der App
  for (const t of [...UEBERBLICK, ...KONZEPTE, ...TECHNIK]) {
    if (t.id === 'familie') assert.doesNotMatch(h, /id="familie"/);
    else assert.ok(h.includes(t.titel), t.id);
  }
  assert.match(h, /id="technik-export">\n<h3>Bilder exportieren<\/h3>[\s\S]*?<p>Nur Tafel A\.<\/p>\n<\/section>/);
  assert.match(h, /href="https:\/\/github\.com\/manganite\/muster\/issues\/new\/choose"/);
  // Fragen mit Link in die App und ins Skript
  assert.match(h, /<h3>Warum gesperrt\?<\/h3>\n<p>Darum\.<\/p>\n<p class="hilfe-links"><a class="to-app" href="index\.html#m=a&amp;g=p2">In der App zeigen<\/a> · <a href="skript\.html#gitter">Im Skript nachlesen<\/a><\/p>/);
  // Inhaltsverzeichnis in derselben Gliederung
  const inhalt = hilfeInhalt(VOLL);
  assert.match(inhalt, /^<ol><li><a href="#ueberblick">Überblick<\/a><ol><li><a href="#teile">/);
  assert.match(inhalt, /<a href="#modus-a">Modus A<\/a><ol><li><a href="#a-seitenleiste">Seitenleiste<\/a><\/li><li><a href="#a-darstellung">Darstellung<\/a><\/li><li><a href="#einstieg-a">/);
  assert.match(inhalt, /<a href="#modus-b">Modus B<\/a><ol><li><a href="#b-darstellung">Darstellung<\/a><\/li><li><a href="#einstieg-b">Erste Schritte B<\/a><\/li><li><a href="#winkel">Winkel messen/);
  assert.match(inhalt, /<a href="#fragen">Typische Fragen<\/a><\/li><li><a href="#technik">/);
  // ohne neue Daten: Überblick mit gemeinsamen Texten, Konzepte, Modi, Technik
  assert.match(hilfeHTML(DATEN), /id="ueberblick"[\s\S]*id="konzepte"[\s\S]*id="modus-a"[\s\S]*id="technik"/);
  assert.doesNotMatch(hilfeHTML(DATEN), /id="modi"|id="fragen"|id="rueckmeldung"/);
});

test('Bereiche: Bild mit nummerierten Marken je Modus, Liste in derselben Reihenfolge, Anker <Modus>-<id>', () => {
  const bilder = hilfeBilder(VOLL);
  assert.deepEqual(bilder.filter((b) => b.nummern), [
    { datei: 'aufbau.png', adresse: '#m=a', zeige: ['header.top', '#info'], nummern: true, ausschnitt: 'body', quelle: 'aufbau' },
    { datei: 'a-seitenleiste.png', adresse: '#m=a', zeige: ['#sec-gitter > summary', '#picker'], nummern: true, quelle: 'a-seitenleiste' },
    // ohne Modus: in jedem Modus, je mit eigenem Bild in dessen Zustand
    { datei: 'a-darstellung.png', adresse: '#m=a', zeige: ['#v-farben'], nummern: true, ausschnitt: '#sec-view', quelle: 'a-darstellung' },
    { datei: 'b-darstellung.png', adresse: '#m=b', zeige: ['#v-farben'], nummern: true, ausschnitt: '#sec-view', quelle: 'b-darstellung' },
    { datei: 'c-darstellung.png', adresse: '#m=c', zeige: ['#v-farben'], nummern: true, ausschnitt: '#sec-view', quelle: 'c-darstellung' },
  ]);
  // weitere Anleitungen haben Bilder wie die Erste Schritte
  assert.ok(bilder.some((b) => b.datei === 'winkel-1.png' && b.adresse === '#m=b' && !b.nummern));
  const h = hilfeHTML(VOLL);
  assert.match(h, /<section class="hilfe-bereich" id="a-seitenleiste">\n<h3>Seitenleiste<\/h3>\n<p>Links\.<\/p>\n<figure class="hilfe-bild"><img src="hilfe\/a-seitenleiste\.png" alt="Ausschnitt der App: Seitenleiste, die Bedienelemente nummeriert wie in der Liste darunter"/);
  assert.match(h, /<ol class="hilfe-marken">\n<li id="a-gitter"><b>Gitter<\/b>: Achsen\.<\/li>\n<li><b>Gruppen<\/b>: Wahl\.<\/li>\n<\/ol>\n<ul class="hilfe-weitere">\n<li><b>Hinweis<\/b>: ohne Nummer\.<\/li>/);
  // ein Modus, der nur einen gemeinsamen Bereich hat, erscheint (wie in der App: der Bereich gilt dort)
  assert.match(h, /id="modus-c"[\s\S]*id="c-farben"/);
  // Anker in der Reihenfolge der Seite
  const anker = hilfeAnker(VOLL);
  assert.ok(anker.indexOf('a-gitter') > anker.indexOf('a-seitenleiste') && anker.indexOf('a-gitter') < anker.indexOf('a-darstellung'));
});

test('Prüfung der Anleitung: doppelte Anker und Bilder, gemeinsame Texte, Adressen der Fragen, Verweise aus dem ⓘ', () => {
  const html = '<div id="picker"></div><details id="sec-view"><input id="v-farben"></details><button id="tab-b"></button><button id="werkzeug"></button><svg id="bild"></svg><details id="sec-gitter"></details><div id="info"></div><b id="winkel"></b>';
  const dateien = hilfeBilder(VOLL).map((b) => b.datei);
  assert.deepEqual(pruefeHilfe(VOLL, { html, dateien, verweise: ['{modus}-gitter', '{modus}-farben', 'konzept-einrasten', 'technik-link'] }), []);
  const f = pruefeHilfe({
    ...VOLL,
    fragen: [...(VOLL.fragen ?? []), { id: 'x', frage: 'X', antwort: '', app: 'm=a' }],
    konzepte: [{ id: 'einrasten', titel: 'E', text: '' }, { id: 'einrasten', titel: 'E2', text: '' }],
    bereiche: [...(VOLL.bereiche ?? []), { id: 'neu', modus: 'z', titel: 'Neu', eintraege: [{ zeige: '#fehlt', name: 'F', text: '' }] }],
    ergaenzungen: { unbekannt: '', export: '' }, ohne: ['familie', 'export'],
  }, { html, dateien, verweise: ['{modus}-fehlt', 'fehlt'] });
  assert.deepEqual(f, [
    'neu: unbekannter Modus z',
    'Frage x: Adresse muss mit # beginnen',
    'Anker konzept-einrasten doppelt',
    'kein gemeinsamer Text unbekannt (ergaenzungen, ohne)',
    'export: ergänzt und ausgelassen',
    'Verweis auf #{modus}-fehlt: kein solcher Anker auf der Hilfeseite',
    'Verweis auf #fehlt: kein solcher Anker auf der Hilfeseite',
  ]);
  // Marken eines Bereichs: Element mit ID fehlt; Bild fehlt; ein Bereich eines unbekannten Modus hat kein Bild
  const g = pruefeHilfe(VOLL, { html: html.replace('<div id="info"></div>', ''), dateien: dateien.filter((d) => d !== 'a-seitenleiste.png') });
  assert.deepEqual(g, ['aufbau: Element #info fehlt in der App', 'a-seitenleiste: Bild a-seitenleiste.png fehlt (node tools/common/hilfe-bilder.mjs)']);
});

test('Gemeinsame Texte: eindeutige Kennungen, Titel und Text, keine Verweise auf Vorlesung oder Folien', () => {
  const alle = [...UEBERBLICK, ...KONZEPTE, ...TECHNIK];
  assert.equal(new Set(alle.map((t) => t.id)).size, alle.length);
  for (const t of alle) {
    assert.ok(t.titel && t.text.trim().startsWith('<p>'), t.id);
    assert.doesNotMatch(t.text, /Vorlesung|Folien? \d|ß/, t.id);
  }
});

test('pruefeHilfe: vorher mit #id, mindestens zwei Punkte in [0, 1], nur mit zeige und nicht in Experimenten', () => {
  const html = '<div id="picker"></div><div id="sec-view"></div><div id="tab-b"></div><div id="bild"></div>';
  /** @type {import('../js/hilfe-seite.js').HilfeDaten} */
  const d = {
    modi: [{ id: 'a', name: 'A', hash: '#m=a' }],
    ersteSchritte: [{ id: 'e', modus: 'a', titel: 'E', schritte: [
      { frage: '1', vorher: [{ klick: '.ohne-id' }, { ziehen: '#bild', punkte: [[0.5, 0.5]] }], zeige: '#picker' },
      { frage: '2', vorher: [{ ziehen: '#fehlt', punkte: [[0, 0], [1.2, 0.5]] }], zeige: '#picker' },
      { frage: '3', vorher: [{ klick: '#picker' }] },
    ] }],
    experimente: [{ id: 'x', modus: 'a', titel: 'X', schritte: [{ frage: '?', vorher: [{ klick: '#picker' }] }] }],
  };
  const f = pruefeHilfe(d, { html, dateien: ['e-1.png', 'e-2.png'] });
  for (const teil of ['Selektor muss mit #id beginnen (.ohne-id)', 'mindestens zwei Punkte', 'Element #fehlt fehlt', 'Punkte zwischen 0 und 1', 'Schritt 3: vorher ohne zeige', 'x: vorher gilt nur in Anleitungen']) {
    assert.ok(f.some((m) => m.includes(teil)), `${teil} fehlt in ${f.join(' | ')}`);
  }
});
