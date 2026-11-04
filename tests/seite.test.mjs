// Geprüfte Helfer für Elemente der Seite (js/seite.js), mit einer kleinen Nachbildung des DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';

// Nur die Arten, die die Helfer prüfen; die Nachbildung ersetzt den Browser.
class Element_ {}
class HTMLElement_ extends Element_ {}
class HTMLInputElement_ extends HTMLElement_ {}
class HTMLSelectElement_ extends HTMLElement_ {}
class HTMLButtonElement_ extends HTMLElement_ {}
class HTMLDetailsElement_ extends HTMLElement_ {}
class SVGSVGElement_ extends Element_ {}
/** @type {Record<string, unknown>} */
const g = globalThis;
Object.assign(g, {
  HTMLElement: HTMLElement_, HTMLInputElement: HTMLInputElement_, HTMLSelectElement: HTMLSelectElement_,
  HTMLButtonElement: HTMLButtonElement_, HTMLDetailsElement: HTMLDetailsElement_, SVGSVGElement: SVGSVGElement_,
});
/** @type {Record<string, Element_>} */
const ids = {
  feld: new HTMLInputElement_(), wahl: new HTMLSelectElement_(), los: new HTMLButtonElement_(),
  mehr: new HTMLDetailsElement_(), info: new HTMLElement_(), bild: new SVGSVGElement_(),
};
/** @type {Record<string, Element_[]>} */
const sel = { '.zeile': [new HTMLElement_(), new HTMLElement_()], '.leer': [], '.bild': [new SVGSVGElement_()] };
g.document = {
  getElementById: (/** @type {string} */ id) => ids[id] ?? null,
  querySelector: (/** @type {string} */ s) => (sel[s] ?? [])[0] ?? null,
  querySelectorAll: (/** @type {string} */ s) => sel[s] ?? [],
};

const { $, eingabe, auswahl, knopf, abschnitt, grafik, element, elemente } = await import('../js/seite.js');

test('Elemente nach ID: richtige Art wird zurückgegeben', () => {
  assert.equal(eingabe('feld'), ids.feld);
  assert.equal(auswahl('wahl'), ids.wahl);
  assert.equal(knopf('los'), ids.los);
  assert.equal(abschnitt('mehr'), ids.mehr);
  assert.equal(grafik('bild'), ids.bild);
  assert.equal($('info'), ids.info);
  assert.equal($('feld'), ids.feld, 'ein Eingabefeld ist auch ein HTML-Element');
});

test('Elemente nach ID: fehlendes Element oder falsche Art wirft einen Fehler mit der ID', () => {
  assert.throws(() => $('gibtsnicht'), /#gibtsnicht fehlt/);
  assert.throws(() => eingabe('los'), /#los ist HTMLButtonElement_, erwartet HTMLInputElement_/);
  assert.throws(() => $('bild'), /#bild ist SVGSVGElement_, erwartet HTMLElement_/);
  assert.throws(() => grafik('info'), /#info/);
});

test('Elemente zum Selektor: geprüft, elemente() erlaubt eine leere Liste', () => {
  assert.equal(element('.zeile'), sel['.zeile'][0]);
  assert.throws(() => element('.leer'), /Kein Element zu \.leer/);
  assert.throws(() => element('.bild'), /\.bild/);
  assert.equal(elemente('.zeile').length, 2);
  assert.equal(elemente('.leer').length, 0);
  assert.throws(() => elemente('.bild'), /\.bild/);
});
