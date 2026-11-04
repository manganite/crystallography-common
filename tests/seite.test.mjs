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

/** Nachgebildete Art als Art des DOM (nur für die Typprüfung). @param {Function} k */
const art = (k) => /** @type {new () => Element} */ (/** @type {unknown} */ (k));

const { nachId, $, eingabe, auswahl, knopf, abschnitt, grafik, element, elemente } = await import('../js/seite.js');

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
  assert.throws(() => grafik('info'), /#info ist HTMLElement_, erwartet SVGSVGElement_$/);
  assert.equal(nachId('los', art(HTMLButtonElement_)), ids.los);
  assert.throws(() => nachId('los', art(HTMLSelectElement_)), /#los ist HTMLButtonElement_, erwartet HTMLSelectElement_$/);
});

test('Gleicher Name, andere Art (anderes Fenster oder Dokument): Meldung sagt es', () => {
  const fremd = class HTMLInputElement {};
  ids.fremd = /** @type {Element_} */ (new fremd());
  assert.throws(() => eingabe('fremd'), /ist HTMLInputElement, erwartet HTMLInputElement_$/);
  g.HTMLInputElement = class HTMLInputElement extends HTMLElement_ {};
  try {
    assert.throws(() => eingabe('fremd'), /ist HTMLInputElement, erwartet HTMLInputElement \(aus einem anderen Fenster oder Dokument\)/);
  } finally { g.HTMLInputElement = HTMLInputElement_; delete ids.fremd; }
});

test('Elemente zum Selektor: geprüft, elemente() erlaubt eine leere Liste', () => {
  assert.equal(element('.zeile'), sel['.zeile'][0]);
  assert.throws(() => element('.leer'), /Kein Element zu \.leer/);
  assert.throws(() => element('.bild'), /zu \.bild ist SVGSVGElement_, erwartet HTMLElement_$/);
  assert.equal(element('.bild', art(SVGSVGElement_)), sel['.bild'][0]);
  assert.deepEqual(elemente('.zeile'), sel['.zeile']);
  assert.ok(Array.isArray(elemente('.zeile')));
  assert.equal(elemente('.leer').length, 0);
  assert.throws(() => elemente('.bild'), /zu \.bild ist SVGSVGElement_, erwartet HTMLElement_$/);
  assert.equal(elemente('.bild', art(SVGSVGElement_)).length, 1);
  assert.throws(() => elemente('.zeile', art(HTMLButtonElement_)), /zu \.zeile ist HTMLElement_, erwartet HTMLButtonElement_$/);
});
