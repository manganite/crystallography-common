// Geführte Abläufe (js/ablauf.js, #87): Prüfung der Daten, Verzweigung und das HTML eines Schritts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeAblaeufe, nachKapitel, kapitelTitel, GLIEDERN_AB, naechster, neuerStand, schrittHTML, listeHTML, ansage, ablaufKarte, ergebnis, standLesen, standSchreiben, variante, waehleParameter, eintrag, schluessel, zuletzt } from '../js/ablauf.js';
import { leererFortschritt, vermerken, fortschrittAus } from '../js/quiz-core.js';
import { hmHTML, hklHTML } from '../js/format.js';

/** @import { Ablauf, Erzeugt } from '../js/ablauf.js' */
/** @import { Kapitel } from '../js/quiz-core.js' */

/** @type {Ablauf} */
const LINEAR = {
  id: 'lage', modus: 'a', titel: 'Spezielle Lage',
  schritte: [
    { frage: 'Was geschieht?', vermutung: ['weniger', 'gleich viele'], richtig: 0, handlung: { text: 'Setzen', hash: '#m=a&x=0' }, beobachtung: 'Weniger.', erklaerung: 'Weil …', skript: 'lage' },
    { frage: 'Und jetzt?', handlung: { text: 'Werkzeug', aktion: 'werkzeug' }, beobachtung: 'So.' },
  ],
};
/** @type {Ablauf} */
const BAUM = {
  id: 'bestimmen', titel: 'Bestimmen',
  schritte: [
    { id: 'm', frage: 'Spiegellinie?', vermutung: ['Ja', 'Nein'], weiter: { 0: 'g', 1: 'ende' } },
    { id: 'g', frage: 'Gleitspiegellinie?', vermutung: ['Ja', 'Nein'], weiter: { 0: 'ende', 1: 'ende' } },
    { id: 'ende', frage: 'Ergebnis', beobachtung: 'Fertig.' },
  ],
};

test('pruefeAblaeufe: gültige Daten ohne Fehler', () => {
  assert.deepEqual(pruefeAblaeufe([LINEAR, BAUM], { aktionen: ['werkzeug'], hashGueltig: (h) => h.startsWith('#m=') }), []);
});

test('pruefeAblaeufe: findet die typischen Fehler', () => {
  const f = pruefeAblaeufe([
    LINEAR, // ohne aktionen: unbekannte Aktion
    { id: 'lage', titel: 'doppelt', schritte: [{ frage: '?', vermutung: ['a'], richtig: 3 }] },
    { id: 'kreis', titel: 'Schleife', schritte: [{ id: 'a', frage: '?', vermutung: ['x', 'y'], weiter: { 0: 'a', 1: 'fehlt' } }] },
    { id: 'beides', titel: 'Handlung', schritte: [{ frage: '?', handlung: { text: 't', hash: '#a', aktion: 'b' } }] },
  ], { hashGueltig: () => false });
  const hat = (/** @type {RegExp} */ r) => assert.ok(f.some((x) => r.test(x)), `${r} in ${JSON.stringify(f)}`);
  hat(/unbekannte Aktion werkzeug/);
  hat(/ungültige Adresse #m=a&x=0/);
  hat(/lage: id doppelt/);
  hat(/2–3 Antworten erwartet, 1/);
  hat(/richtig ausserhalb/);
  hat(/Ziel fehlt fehlt/);
  hat(/kreis: Schleife/);
  hat(/genau eines von hash und aktion/);
});

test('naechster: der Reihe nach, bei Verzweigung nach der Antwort', () => {
  assert.equal(naechster(LINEAR, 0, undefined), 1);
  assert.equal(naechster(LINEAR, 1, undefined), -1);
  assert.equal(naechster(BAUM, 0, 0), 1);
  assert.equal(naechster(BAUM, 0, 1), 2);
  assert.equal(naechster(BAUM, 0, undefined), -1);
  assert.equal(naechster(BAUM, 2, 0), -1);
});

test('schrittHTML: vor der Handlung keine Beobachtung, Weiter gesperrt', () => {
  const st = neuerStand(LINEAR);
  const h = schrittHTML(st, { skriptUrl: (a) => `skript.html#${a}` });
  assert.match(h, /Schritt 1 von 2/);
  assert.match(h, /class="linkbtn ablauf-tun" type="button" data-tun="1"/);
  assert.doesNotMatch(h, /Weniger\./);
  assert.match(h, /data-nav="weiter" disabled/);
  assert.match(h, /data-nav="zurueck" disabled/);
});

test('schrittHTML: nach der Handlung Beobachtung, Auflösung, Vorher/Nachher und Skript', () => {
  const st = neuerStand(LINEAR);
  st.gewaehlt[0] = 1; st.gezeigt.add(0); st.vorher[0] = '#alt'; st.nachher[0] = '#m=a&x=0';
  const h = schrittHTML(st, { skriptUrl: (a) => `skript.html#${a}` });
  assert.match(h, /Weniger\./);
  assert.match(h, /data-antwort="0" aria-pressed="false" class="richtig" aria-disabled="true">weniger <span class="ablauf-marke">✓ trifft zu<\/span>/);
  assert.match(h, /data-antwort="1" aria-pressed="true" class="falsch" aria-disabled="true">gleich viele <span class="ablauf-deine">\(deine Vermutung\)<\/span>/);
  assert.match(h, /data-vergleich="1">Vorher zeigen/);
  assert.match(h, /<a href="skript\.html#lage">Im Skript nachlesen<\/a>/);
  assert.doesNotMatch(h, /data-tun/);
  assert.match(h, /data-nav="weiter">Weiter/);
});

test('schrittHTML: ohne Änderung der Adresse kein Vorher/Nachher; letzter Schritt „Fertig“', () => {
  const st = neuerStand(LINEAR);
  st.weg.push(1); st.gezeigt.add(1); st.vorher[1] = '#x'; st.nachher[1] = '#x';
  const h = schrittHTML(st);
  assert.doesNotMatch(h, /data-vergleich/);
  assert.match(h, /data-nav="fertig">Fertig/);
  assert.match(h, /data-nav="zurueck">/);
});

test('schrittHTML: Verzweigung ohne „von n“, Antwort ohne Auflösung', () => {
  const st = neuerStand(BAUM);
  st.gewaehlt[0] = 1; st.gezeigt.add(0);
  const h = schrittHTML(st);
  assert.match(h, /Schritt 1</);
  assert.doesNotMatch(h, /von 3/);
  assert.doesNotMatch(h, /richtig|falsch|trifft zu/);
  assert.match(h, /aria-label="Deine Antwort"/);
});

test('listeHTML: Abläufe als Knöpfe, Stand wie im Quiz markiert, Übersicht und Löschen', () => {
  assert.doesNotMatch(listeHTML([LINEAR, BAUM]), /ablauf-stand|data-loeschen|✓/);
  const f = vermerken(leererFortschritt(), 'lage', true);
  let h = listeHTML([LINEAR, BAUM], f);
  assert.match(h, /<li class="done"><button class="linkbtn" type="button" data-ablauf="lage">Spezielle Lage <span aria-hidden="true">✓<\/span><span class="sr"> \(zuletzt richtig\)<\/span><\/button><\/li>/);
  assert.match(h, /<li><button class="linkbtn" type="button" data-ablauf="bestimmen">Bestimmen<\/button>/);
  assert.match(h, /Stand: 1 ✓ \(zuletzt richtig\), 0 ○ \(durchgespielt\), 1 offen\. <button class="linkbtn" type="button" data-loeschen="1">Stand löschen/);
  vermerken(f, 'lage', false);
  h = listeHTML([LINEAR, BAUM], f);
  assert.match(h, /<li class="gespielt">.*Spezielle Lage <span aria-hidden="true">○<\/span><span class="sr"> \(durchgespielt\)/);
  assert.match(h, /Stand: 0 ✓ \(zuletzt richtig\), 1 ○ \(durchgespielt\), 1 offen\./);
  // Einträge anderer Modi zählen in der Übersicht nicht mit
  assert.doesNotMatch(listeHTML([BAUM], f), /ablauf-stand/);
  assert.equal(listeHTML([]), '');
});

test('ergebnis: richtig, wenn es eine Auflösung gab und jede beim ersten Mal zutraf; nur der gegangene Weg zählt', () => {
  const st = neuerStand(LINEAR);
  st.weg.push(1); st.gewaehlt[0] = 0;
  assert.equal(ergebnis(st), true);
  st.gewaehlt[0] = 1;
  assert.equal(ergebnis(st), false);
  st.erste[0] = 1; st.gewaehlt[0] = 0;
  assert.equal(ergebnis(st), false, 'nach der Auflösung umgewählt zählt nicht');
  const b = neuerStand(BAUM); b.gewaehlt[0] = 1; b.weg.push(2);
  assert.equal(ergebnis(b), false, 'ohne Auflösung nur durchgespielt');
  /** @type {Ablauf} */
  const zwei = { id: 'z', titel: 'Z', schritte: [
    { id: 'f', frage: '?', vermutung: ['a', 'b'], weiter: { 0: 'x', 1: 'y' } },
    { id: 'x', frage: 'X', vermutung: ['1', '2'], richtig: 0 }, { id: 'y', frage: 'Y', vermutung: ['1', '2'], richtig: 1 },
  ] };
  const z = neuerStand(zwei); z.gewaehlt[0] = 0; z.gewaehlt[1] = 1; z.erste[1] = 1; // Zweig x falsch, dann zurück
  z.gewaehlt[0] = 1; z.weg.push(2); z.gewaehlt[2] = 1; z.erste[2] = 1;
  assert.equal(ergebnis(z), true, 'Antworten ausserhalb des Wegs zählen nicht');
});

test('standLesen/standSchreiben: Rundlauf, gesperrter und unbrauchbarer Speicher', () => {
  const alt = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  /** @type {Map<string, string>} */
  const m = new Map();
  try {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (/** @type {string} */ k) => m.get(k) ?? null, setItem: (/** @type {string} */ k, /** @type {string} */ v) => { m.set(k, v); } } });
    assert.deepEqual(standLesen('a-experimente'), leererFortschritt());
    standSchreiben('a-experimente', vermerken(leererFortschritt(), 'lage', true, 5));
    assert.deepEqual(standLesen('a-experimente').fragen.lage, { n: 1, r: 1, letzte: 1, t: 5 });
    for (const kaputt of ['x', '5', '{"v":1,"fragen":[]}', '{"v":2,"fragen":{}}']) { m.set('a-experimente', kaputt); assert.deepEqual(standLesen('a-experimente'), leererFortschritt(), kaputt); }
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('gesperrt'); } });
    assert.deepEqual(standLesen('a-experimente'), leererFortschritt());
    assert.doesNotThrow(() => standSchreiben('a-experimente', leererFortschritt()));
  } finally {
    if (alt) Object.defineProperty(globalThis, 'localStorage', alt); else delete (/** @type {any} */ (globalThis)).localStorage;
  }
  assert.deepEqual(fortschrittAus('{"v":1,"fragen":[]}'), leererFortschritt(), 'auch im Quiz: Array statt Objekt');
});

test('Handlung gesperrt, bis eine Vermutung gewählt ist (Entscheidung Thomas, 7.11.2026)', () => {
  const st = neuerStand(LINEAR);
  assert.match(schrittHTML(st), /data-tun="1" disabled aria-describedby="ablauf-warum">Setzen<\/button><\/p><p class="ablauf-why" id="ablauf-warum">Zuerst eine Vermutung wählen\./);
  st.gewaehlt[0] = 0;
  assert.match(schrittHTML(st), /data-tun="1">Setzen</);
});

test('Verzweigung: Blatt ohne weiter endet; vor der Antwort „Weiter“ statt „Fertig“; Antworten bleiben wählbar', () => {
  /** @type {Ablauf} */
  const zwei = { id: 'z', titel: 'Z', schritte: [
    { id: 'f', frage: '?', vermutung: ['a', 'b'], weiter: { 0: 'x', 1: 'y' } },
    { id: 'x', frage: 'X', beobachtung: 'x' }, { id: 'y', frage: 'Y', beobachtung: 'y' },
  ] };
  assert.equal(naechster(zwei, 1, undefined), -1);
  assert.deepEqual(pruefeAblaeufe([zwei]), []);
  const st = neuerStand(zwei);
  assert.match(schrittHTML(st), /data-nav="weiter" disabled>Weiter/);
  st.gewaehlt[0] = 1; st.gezeigt.add(0);
  const h = schrittHTML(st);
  assert.doesNotMatch(h, /aria-disabled/);
  assert.match(h, /data-nav="weiter">Weiter/);
  st.weg.push(2);
  assert.match(schrittHTML(st), /data-nav="fertig">Fertig/);
});

test('pruefeAblaeufe: Antworten ohne Ziel, falsche Schlüssel, nicht erreichbar, Modus und Anker', () => {
  const f = pruefeAblaeufe([{ id: 'v', modus: 'q', titel: 'V', schritte: [
    { id: 'f', frage: '?', vermutung: ['1', '2', '3', '4', '5'], weiter: { 0: 'e', '1.0': 'e' }, skript: 'nix' },
    { id: 'e', frage: 'E', beobachtung: 'e' }, { id: 'tot', frage: 'T', beobachtung: 't' },
  ] }], { modi: ['a'], anker: ['lage'] });
  const hat = (/** @type {RegExp} */ r) => assert.ok(f.some((x) => r.test(x)), `${r} in ${JSON.stringify(f)}`);
  hat(/unbekannter Modus q/); hat(/unbekannte Antwort 1\.0/); hat(/Antwort 2 ohne Ziel/); hat(/Schritt 3: nicht erreichbar/); hat(/unbekannter Anker nix/);
  assert.ok(!f.some((x) => /Antworten erwartet/.test(x)), 'fünf Antworten ohne Handlung sind erlaubt');
});

test('ansage: Auflösung und Beobachtung als Text ohne HTML', () => {
  const st = neuerStand(LINEAR);
  st.gewaehlt[0] = 1; st.gezeigt.add(0);
  assert.equal(ansage(st), 'Zutreffend: weniger. Deine Vermutung: gleich viele. Weniger. Weil …');
  st.gewaehlt[0] = 0;
  assert.match(ansage(st), /^Zutreffend: weniger\. Deine Vermutung trifft zu\./);
  assert.equal(ansage(neuerStand(LINEAR)), '');
});

test('ansage: Querstrich als „quer“ wie in der Darstellung für Screenreader, Entitäten aus esc() als Zeichen (#90, #82)', () => {
  /** @type {Ablauf} */
  const a = {
    id: 'q', titel: 'Querstrich',
    schritte: [{
      frage: 'Welche Gruppe?', vermutung: ['<span class="ov">4</span>2<i>m</i>', '4'], richtig: 0,
      handlung: { text: 'Zeigen', hash: '#g=-42m' },
      beobachtung: '(<span class="ov">1</span><span class="ov">1</span>1) und (1<span class="ov">1</span>0) &amp; m<span class="ov">3</span>m',
      erklaerung: 'Lage <span class="ov"><i>x</i></span>+½, <span id="a" class=\'x ov\'>1</span>, <SPAN CLASS="ov">2</SPAN>, <span class="ovs">3</span>',
    }],
  };
  const st = neuerStand(a);
  st.gewaehlt[0] = 1; st.gezeigt.add(0);
  // vor #90 in stereography gemessen: „Deine Vermutung: 4.“ und „(111) …“ ohne die Querstriche
  assert.equal(ansage(st), 'Zutreffend: 4 quer 2m. Deine Vermutung: 4. (1 quer 1 quer 1) und (1 1 quer 0) & m 3 quer m Lage x quer +½, 1 quer, 2 quer, 3');
  // Symbole aus hmHTML/hklHTML mit ihrem Ansagetext (#82)
  st.ablauf.schritte[0].vermutung = [hmHTML('-42m'), hmHTML('4/mmm')];
  st.ablauf.schritte[0].beobachtung = `Die Form ${hklHTML([1, -1, 1], false, ['{', '}'])} in ${hmHTML('m-3m')}.`;
  delete st.ablauf.schritte[0].erklaerung;
  assert.equal(ansage(st), 'Zutreffend: 4 quer, 2, m. Deine Vermutung: 4 über m, m, m. Die Form {1, 1 quer, 1} in m, 3 quer, m.');
  // Leerraum: Bindestrich, deutsche Anführungszeichen, Verhältnis
  st.ablauf.schritte[0].beobachtung = `Die ${hmHTML('-4')}-Achse, „${hmHTML('mm2')}“, 2 : 1.`;
  assert.match(ansage(st), /Die 4 quer-Achse, „m, m, 2“, 2 : 1\.$/);
});

test('Erste Schritte (liste: false): Bedienschritte ohne Vermutung, überspringbar, ohne „Alle Experimente“', () => {
  /** @type {Ablauf} */
  const einstieg = { id: 'einstieg', titel: 'Erste Schritte', schritte: [
    { frage: '<b>Gruppe wählen.</b> …', handlung: { text: 'p4mm wählen', hash: '#g=p4mm' } },
    { frage: '<b>Darstellung.</b> …', handlung: { text: 'öffnen', aktion: 'darstellung' } },
  ] };
  assert.deepEqual(pruefeAblaeufe([einstieg], { aktionen: ['darstellung'] }), []);
  const h = schrittHTML(neuerStand(einstieg), { liste: false });
  assert.doesNotMatch(h, /Alle Experimente/);
  assert.match(h, /data-tun="1">p4mm wählen/);
  assert.match(h, /data-nav="weiter">Weiter/);
});

/** Erzeugtes Experiment (#92): Zahl der Pole je Gruppe. @type {Erzeugt} */
const GEN = {
  id: 'polzahl', modus: 'a', titel: 'Wie viele Pole?',
  params: () => ['2', '4', '6'],
  make: (p) => [{ frage: `Gruppe ${p}?`, vermutung: [p, String(2 * Number(p))], richtig: 0, handlung: { text: 'Zeigen', hash: `#g=${p}` }, beobachtung: `${p} Pole.` }],
};

test('Erzeugte Abläufe: Prüfung jeder Variante, typische Fehler', () => {
  assert.deepEqual(pruefeAblaeufe([GEN, LINEAR], { aktionen: ['werkzeug'], hashGueltig: (h) => h.startsWith('#') }), []);
  const f = pruefeAblaeufe([
    { ...GEN, make: (p) => [{ frage: '?', vermutung: ['a'], richtig: 0, handlung: { text: 't', hash: `#${p}` }, beobachtung: 'b' }] },
    { id: 'leer', titel: 'L', params: () => [], make: () => [] },
    { id: 'doppelt', titel: 'D', params: () => ['x', 'x'], make: () => [{ frage: 'X', beobachtung: 'x' }] },
    /** @type {any} */ ({ id: 'ohne', titel: 'O', params: () => ['x'] }),
    /** @type {any} */ ({ id: 'nurmake', titel: 'M', make: () => [] }),
    { id: 'a:b', titel: 'Doppelpunkt', schritte: [{ frage: 'X', beobachtung: 'x' }] },
  ], { hashGueltig: (h) => h !== '#4' });
  const hat = (/** @type {RegExp} */ r) => assert.ok(f.some((x) => r.test(x)), `${r} in ${JSON.stringify(f)}`);
  hat(/^polzahl:2, Schritt 1: 2–3 Antworten erwartet/); hat(/^polzahl:4, Schritt 1: ungültige Adresse #4/);
  hat(/leer: keine Parameter/); hat(/doppelt: Parameter doppelt/); hat(/ohne: erzeugt braucht params und make/); hat(/a:b: id mit Doppelpunkt/); hat(/nurmake: make ohne params/);
});

test('waehleParameter: nie gespielt vor zuletzt falsch vor zuletzt richtig, nicht dieselbe Aufgabe wie eben', () => {
  const f = leererFortschritt();
  assert.equal(waehleParameter(GEN, f, () => 0), '2');
  assert.equal(waehleParameter(GEN, f, () => 0.99), '6');
  assert.equal(waehleParameter(GEN, f, () => 0, '2'), '4');
  vermerken(f, 'polzahl:2', true); vermerken(f, 'polzahl:4', false);
  assert.equal(waehleParameter(GEN, f, () => 0), '6', 'nie gespielt zuerst');
  vermerken(f, 'polzahl:6', true);
  assert.equal(waehleParameter(GEN, f, () => 0.5), '4', 'dann zuletzt falsch');
  assert.equal(waehleParameter(GEN, f, () => 0, '4'), '2', 'ohne die eben gestellte');
  assert.equal(waehleParameter({ ...GEN, params: () => ['2'] }, f, () => 0, '2'), '2', 'nur ein Parameter: dieselbe');
});

test('Erzeugte Abläufe: Schlüssel id:parameter, Liste mit ↻ und dem zuletzt gespielten Stand, „Neue Aufgabe“ am Ende', () => {
  const v = variante(GEN, '4');
  assert.equal(schluessel(v), 'polzahl:4'); assert.equal(schluessel(LINEAR), 'lage');
  assert.equal(v.schritte[0].frage, 'Gruppe 4?');
  const f = leererFortschritt();
  assert.equal(eintrag(GEN, f), undefined);
  vermerken(f, 'polzahl:2', true, 1); vermerken(f, 'polzahl:4', false, 2);
  assert.equal(eintrag(GEN, f)?.letzte, 0, 'der zuletzt gespielte zählt');
  assert.equal(eintrag({ ...GEN, id: 'pol' }, f), undefined, 'nur Schlüssel mit genau dieser id');
  assert.equal(zuletzt(GEN, f), '4');
  assert.equal(eintrag({ ...GEN, params: () => ['2'] }, f)?.letzte, 1, 'entfernte Parameter zählen nicht');
  assert.doesNotMatch(schrittHTML(Object.assign(neuerStand(v), { gewaehlt: { 0: 0 }, gezeigt: new Set([0]) }), { liste: false }), /data-nav="neu"/, 'nicht in den Erste Schritten');
  const h = listeHTML([GEN], f);
  assert.match(h, /Wie viele Pole\? <span class="ablauf-neu" aria-hidden="true">↻<\/span><span class="sr"> \(immer neue Aufgaben\)<\/span> <span aria-hidden="true">○/);
  const st = neuerStand(v);
  assert.match(schrittHTML(st), /data-nav="neu" disabled>Neue Aufgabe/, 'gesperrt bis zur Handlung, wie „Fertig“');
  st.gewaehlt[0] = 0; st.gezeigt.add(0);
  assert.match(schrittHTML(st), /data-nav="neu">Neue Aufgabe<\/button><button class="linkbtn" type="button" data-nav="fertig">Fertig/);
  assert.doesNotMatch(schrittHTML(Object.assign(neuerStand(LINEAR), { weg: [0, 1], gezeigt: new Set([0, 1]) })), /data-nav="neu"/, 'feste Abläufe ohne');
});

test('ablaufKarte: Live-Region beim Wechsel des Modus geleert, ausstehende Ansage entfällt (#90)', async () => {
  // kleine Nachbildung des DOM: nur, was ablaufKarte für Klicks und die Ansage braucht
  /** @type {Record<string, any>} */
  const g = globalThis;
  class HTMLElement {}
  class HTMLButtonElement extends HTMLElement {
    /** @param {Record<string, string>} dataset */
    constructor(dataset) { super(); this.dataset = dataset; this.disabled = false; }
    getAttribute() { return null; }
    closest() { return this; }
  }
  /** @type {Map<number, () => void>} */
  const rahmen = new Map();
  let nr = 0;
  Object.assign(g, {
    HTMLElement, HTMLButtonElement,
    requestAnimationFrame: (/** @type {() => void} */ f) => { rahmen.set(++nr, f); return nr; },
    cancelAnimationFrame: (/** @type {number} */ n) => { rahmen.delete(n); },
  });
  const malen = () => { const f = [...rahmen.values()]; rahmen.clear(); f.forEach((x) => x()); };
  try {
    const inhalt = { innerHTML: '', querySelector: () => null };
    const live = { textContent: '' };
    /** @type {(e: { target: any }) => void} */
    let klick = () => {};
    const el = {
      /** @param {string} _h Gerüst aus Inhalt und Live-Region (hier schon vorhanden) */
      set innerHTML(_h) { /* nichts */ },
      firstElementChild: inhalt, lastElementChild: live,
      addEventListener: (/** @type {string} */ _t, /** @type {any} */ f) => { klick = f; },
    };
    const k = ablaufKarte(/** @type {any} */ (el), [LINEAR, { ...LINEAR, id: 'b-lage', modus: 'b' }], { anwenden: () => {}, adresse: () => '#' });
    const druecke = (/** @type {Record<string, string>} */ d) => klick({ target: new HTMLButtonElement(d) });
    k.modus('a'); k.starte('lage');
    druecke({ antwort: '1' }); druecke({ tun: '1' }); malen();
    assert.match(live.textContent, /^Zutreffend: weniger\./);
    k.modus('b');
    assert.equal(live.textContent, '', 'Text des vorigen Modus geleert');
    // ausstehende Ansage: ein Moduswechsel vor dem nächsten Bild verwirft sie
    k.modus('a'); k.starte('lage'); druecke({ antwort: '0' }); druecke({ tun: '1' });
    k.modus('b'); malen();
    assert.equal(live.textContent, '');
  } finally {
    for (const n of ['HTMLElement', 'HTMLButtonElement', 'requestAnimationFrame', 'cancelAnimationFrame']) delete g[n];
  }
});

// Gliederung nach Kapiteln (#107): ab 6 Experimenten je Modus, Reihenfolge der Kapitel, darin der Daten
/** @type {Kapitel[]} */
const KAP = [{ nr: 1, titel: 'Erstes', kurz: 'Eins', anker: 'k1' }, { nr: 2, titel: 'Zweites', kurz: 'Zwei', anker: 'k2' }, { nr: 3, titel: 'Drittes', kurz: 'Drei', anker: 'k3' }];
/** Experiment mit einem Schritt. @param {string} id @param {number} [kapitel] @param {string} [modus] @returns {Ablauf} */
const ex = (id, kapitel, modus = 'a') => ({ id, modus, ...(kapitel === undefined ? {} : { kapitel }), titel: `T-${id}`, schritte: [{ frage: id, beobachtung: 'b' }] });

test('nachKapitel: Schwelle 6, Reihenfolge der Kapitel, ohne Kapitel zuletzt', () => {
  assert.equal(GLIEDERN_AB, 6);
  const fuenf = ['a', 'b', 'c', 'd', 'e'].map((id) => ex(id, 2));
  assert.deepEqual(nachKapitel(fuenf, KAP), [{ kapitel: null, eintraege: fuenf }], 'unter 6: eine Gruppe ohne Kapitel');
  const sechs = [ex('a', 3), ex('b', 1), ex('c'), ex('d', 3), ex('e', 1), ex('f', 9)];
  assert.deepEqual(nachKapitel(sechs, []), [{ kapitel: null, eintraege: sechs }], 'ohne Kapitel: flach');
  assert.deepEqual(nachKapitel(sechs), [{ kapitel: null, eintraege: sechs }]);
  const g = nachKapitel(sechs, KAP);
  // Kapitel 2 hat keine Einträge und entfällt; unbekanntes Kapitel 9 und fehlendes zu „Weitere“
  assert.deepEqual(g.map((x) => [x.kapitel?.nr ?? null, x.eintraege.map((e) => e.id)]), [[1, ['b', 'e']], [3, ['a', 'd']], [null, ['c', 'f']]]);
  assert.equal(kapitelTitel(KAP[1]), '2 Zwei');
  assert.equal(kapitelTitel(null), 'Weitere');
});

test('listeHTML: ab 6 Einträgen Überschriften je Kapitel, durchgehend nummeriert', () => {
  const sechs = [ex('a', 3), ex('b', 1), ex('c', 1), ex('d', 3), ex('e', 1), ex('f', 3)];
  const h = listeHTML(sechs, leererFortschritt(), KAP);
  assert.deepEqual([...h.matchAll(/<h3 class="ablauf-kapitel">([^<]*)<\/h3>/g)].map((m) => m[1]), ['1 Eins', '3 Drei']);
  assert.deepEqual([...h.matchAll(/data-ablauf="([^"]+)"/g)].map((m) => m[1]), ['b', 'c', 'e', 'a', 'd', 'f']);
  assert.match(h, /<\/h3><ol class="ablauf-liste">/, 'erste Liste ohne start');
  assert.match(h, /<h3 class="ablauf-kapitel">3 Drei<\/h3><ol class="ablauf-liste" start="4">/);
  // unter der Schwelle oder ohne Kapitel: flach wie bisher
  assert.doesNotMatch(listeHTML(sechs.slice(0, 5), leererFortschritt(), KAP), /<h3|start=/);
  assert.doesNotMatch(listeHTML(sechs), /<h3|start=/);
  // Stand über den ganzen Modus
  const f = leererFortschritt();
  vermerken(f, 'b', true); vermerken(f, 'f', false);
  assert.match(listeHTML(sechs, f, KAP), /Stand: 1 ✓ \(zuletzt richtig\), 1 ○ \(durchgespielt\), 4 offen/);
});

test('pruefeAblaeufe: Kapitel bekannt, ab 6 je Modus vorhanden', () => {
  const nr = KAP.map((k) => k.nr);
  // Modus a: 6 Einträge (davon einer ohne Modus, er zählt in jedem Modus), Modus b: 2
  const daten = [ex('a1', 1), ex('a2', 2), ex('a3', 2), ex('a4'), ex('a5', 3), ex('alle', 1, undefined), ex('b1', undefined, 'b'), ex('b2', 7, 'b')];
  assert.deepEqual(pruefeAblaeufe(daten, { kapitel: nr }), [
    'b2: unbekanntes Kapitel 7',
    'a4: Kapitel fehlt (ab 6 Experimenten je Modus nach Kapiteln gegliedert)',
  ]);
  // b1 fehlt erst, wenn Modus b die Schwelle erreicht
  assert.deepEqual(pruefeAblaeufe(daten.filter((a) => a.id !== 'a4'), { kapitel: nr }), ['b2: unbekanntes Kapitel 7']);
  // ohne die Option keine Prüfung der Kapitel
  assert.deepEqual(pruefeAblaeufe(daten), []);
  // modi übergeben: auch ein Modus, in dem nur Experimente ohne Modus stehen, zählt
  const ohneModus = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((id) => ex(id, undefined, undefined));
  assert.equal(pruefeAblaeufe(ohneModus, { kapitel: nr }).length, 6);
  assert.equal(pruefeAblaeufe(ohneModus, { kapitel: nr, modi: ['a', 'b'] }).length, 6, 'je Experiment nur einmal gemeldet');
});
