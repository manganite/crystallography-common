// Skript: Abschnittsnummern und Verweise (js/skript-kern.js, #85), ohne Browser. Das Verlinken im Browser prüft
// tests/browser/skript.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abschnittsverweise, skriptGliederung, pruefeAbschnittsverweise } from '../js/skript-kern.js';

/** @param {string} t */
const nummern = (t) => abschnittsverweise(t).map((x) => x.nummer);
/** @param {string} t */
const texte = (t) => abschnittsverweise(t).map((x) => t.slice(x.start, x.ende));

test('abschnittsverweise: Formen eines Verweises', () => {
  assert.deepEqual(texte('wie in Abschnitt 4.2 gezeigt'), ['Abschnitt 4.2']);
  assert.deepEqual(texte('(Abschn. 4.2)'), ['Abschn. 4.2']);
  assert.deepEqual(texte('Abschnitt 1.2.'), ['Abschnitt 1.2'], 'Punkt am Satzende gehört nicht dazu');
  assert.deepEqual(texte('Abschnitte 3.3–3.4'), ['Abschnitte 3.3', '3.4']);
  assert.deepEqual(texte('Abschnitte 2.5 und 3.4, Kapitel 5'), ['Abschnitte 2.5', '3.4']);
  assert.deepEqual(texte('Abschnitte 2.5, 3.1 und 10.12'), ['Abschnitte 2.5', '3.1', '10.12']);
  assert.deepEqual(abschnittsverweise('Abschnitt 4.2 und Abschnitte 1.1–1.2').map((x) => x.einzeln), [true, false, false]);
  assert.deepEqual(texte('des Abschnitts 3.1 und in den Abschnitten 3.1 und 3.2'), ['Abschnitts 3.1', 'Abschnitten 3.1', '3.2']);
});

test('abschnittsverweise: keine Verweise auf andere Werke', () => {
  assert.deepEqual(nummern('Borchardt-Ott & Sowa, Abschn. 7.1, Abb. 7.12'), [], 'Zitierform mit Komma');
  assert.deepEqual(nummern('Hoffmann (2016),\n        Abschn. 4.2'), [], 'Komma vor einem Zeilenumbruch mit Einrückung');
  assert.deepEqual(nummern('umgekehrt (Abschn. 7.2, S. 104, Fussnote 6)'), [], 'Seitenangabe');
  assert.deepEqual(nummern('Schraubenachse (Abschn. 2.2.7)'), [], 'drei Stufen');
  assert.deepEqual(nummern('Abschnitt 4'), [], 'Kapitel ohne Abschnitt');
  assert.deepEqual(nummern('Abb. 4.2 und Kap. 3.1'), []);
});

const HTML = `<!doctype html><html><body>
<nav class="toc"><ol><li><a href="#k1"><span class="nr">1</span>Eins</a><ol><li><a href="#a">A</a></li></ol></li></ol></nav>
<main><article>
<section id="aufbau"><h2>So ist das Skript aufgebaut</h2><p>Abschnitt 9.9 hier nicht, weil ohne Nummer?</p></section>
<section id="k1"><h2><span class="nr">1</span>Eins</h2>
  <p>Einleitung, siehe Abschnitt 1.2 und <a href="https://x/skript.html#y">Skript, Abschnitt 7.7</a>.</p>
  <section id="a"><h3>Erster &amp; bester</h3><p>Text<br>mehr <img src="x.png" alt=""></p></section>
  <div class="box vertiefung"><h4>Vertiefung</h4><p>Kein Abschnitt.</p></div>
  <section id="b" data-level="vertiefung" data-id="x"><h3>Zweiter</h3><p>Vgl. Abschn.&nbsp;1.1 und Abschnitt 1.3.</p>
    <figure><svg viewBox="0 0 10 10"><text x="1" y="1">Abschnitt 1.1</text><path d="M0 0" /></svg></figure></section>
  <div class="quellen"><ul><li>Hoffmann (2016), Abschn. 4.2</li><li>Kleber Abschnitt 5.5</li></ul></div>
</section>
<section id="k2"><h2><span class="nr">2</span>Zwei</h2>
  <section id="c"><h3>Dritter</h3><p>Hoffmann zeigt das anders (Abschnitt 2.1). Doppelt: Abschnitt 1.1 „Erster &amp; bester“.</p></section>
  <section class=x><h3>Ohne id</h3><p>Wie in Abschnitt <b>1.1</b>.</p></section>
</section>
</article></main></body></html>`;

test('skriptGliederung: Nummern je Kapitel, Vertiefungen zählen mit', () => {
  const { nummern: n, text } = skriptGliederung(HTML);
  assert.deepEqual([...n].map(([k, v]) => `${k} ${v.id} ${v.titel}`), ['1.1 a Erster & bester', '1.2 b Zweiter', '2.1 c Dritter', '2.2  Ohne id']);
  assert.ok(!text.includes('7.7') && !text.includes('4.2') && !text.includes('5.5'), 'Links und Quellen sind gesperrt');
  assert.equal(text.match(/Abschnitt 1\.1/g)?.length, 1, 'Text in SVG ist gesperrt (nur der Verweis in Abschnitt 2.1 zählt)');
});

test('pruefeAbschnittsverweise: fehlender Abschnitt und Verweis im Satz eines Werks', () => {
  const { befunde, verweise } = pruefeAbschnittsverweise(HTML);
  assert.equal(verweise, 6);
  assert.deepEqual(befunde.map((b) => b.replace(/:.*/, '')), [
    'Abschnitt 2.2 „Ohne id“ hat keine id; Verweise darauf werden kein Link',
    'Verweis auf Abschnitt 1.1 über eine Elementgrenze (Wort und Nummer im selben Text schreiben)',
    'Abschnitt 9.9 gibt es nicht',
    'Abschnitt 1.3 gibt es nicht',
    'Abschnitt 2.1 im Satz eines zitierten Werks (Zitierform „Werk, Abschn. x.y“?)',
    'Abschnitt 1.1',
  ]);
  assert.match(befunde[5], /Titel steht schon im Text/);
  assert.ok(befunde.every((b) => !b.includes('\u0000') && !b.includes('\u0001')), 'keine Steuerzeichen in den Befunden');
});
