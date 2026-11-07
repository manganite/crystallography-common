// Geführte Abläufe (js/ablauf.js, #87): Prüfung der Daten, Verzweigung und das HTML eines Schritts.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeAblaeufe, naechster, neuerStand, schrittHTML, listeHTML, ansage } from '../js/ablauf.js';

/** @import { Ablauf } from '../js/ablauf.js' */

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
  hat(/beides, Schritt 1: Beobachtung fehlt/);
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

test('listeHTML: Abläufe als Knöpfe, erledigte markiert', () => {
  const h = listeHTML([LINEAR, BAUM], new Set(['lage']));
  assert.match(h, /<li class="done"><button class="linkbtn" type="button" data-ablauf="lage">Spezielle Lage <span aria-hidden="true">✓<\/span><span class="sr"> \(erledigt\)<\/span><\/button><\/li>/);
  assert.match(h, /data-ablauf="bestimmen"/);
  assert.equal(listeHTML([]), '');
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
