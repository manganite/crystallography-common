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

const { nachId, $, eingabe, auswahl, knopf, abschnitt, grafik, element, elemente, alleEinstellungenZuruecksetzen } = await import('../js/seite.js');

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

/**
 * Globale Eigenschaften für einen Test ersetzen und danach wiederherstellen; über Beschreibungen, weil Node
 * (ab Version 25) localStorage selbst als Eigenschaft mit Getter mitbringt.
 * @param {Record<string, PropertyDescriptor>} neu @param {() => void} f
 */
function mitGlobalen(neu, f) {
  const alt = Object.fromEntries(Object.keys(neu).map((k) => [k, Object.getOwnPropertyDescriptor(globalThis, k)]));
  for (const [k, d] of Object.entries(neu)) Object.defineProperty(globalThis, k, { configurable: true, ...d });
  try { f(); } finally {
    for (const [k, d] of Object.entries(alt)) {
      if (d) Object.defineProperty(globalThis, k, d); else delete g[k];
    }
  }
}

test('Alle Einstellungen zurücksetzen: löscht die Einträge der App ausser dem Quiz, lädt ohne Hash neu, löscht beim Verlassen nochmals', () => {
  /** @type {Map<string, string>} */
  const speicher = new Map([['app-zustand', '{}'], ['app-intro', 'a'], ['app-quiz', '{}'], ['app-quiz-lauf', '1'],
    ['andere-zustand', '{}'], ['app', 'x'], ['appx-zustand', '{}']]);
  const nachgebildet = {
    get length() { return speicher.size; },
    key: (/** @type {number} */ i) => [...speicher.keys()][i] ?? null,
    removeItem: (/** @type {string} */ k) => { speicher.delete(k); },
  };
  /** @type {(() => void)[]} */
  const beimVerlassen = [];
  /** @type {string[]} */
  const ziele = [];
  mitGlobalen({
    localStorage: { value: nachgebildet },
    window: { value: { addEventListener: (/** @type {string} */ typ, /** @type {() => void} */ f) => { if (typ === 'pagehide') beimVerlassen.push(f); } } },
    location: { value: { pathname: '/app/', search: '?sw', hash: '#m=a', replace: (/** @type {string} */ z) => { ziele.push(z); } } },
  }, () => {
    alleEinstellungenZuruecksetzen('app');
    const bleibt = ['app-quiz', 'app-quiz-lauf', 'andere-zustand', 'app', 'appx-zustand'];
    assert.deepEqual([...speicher.keys()], bleibt, 'Quiz, andere Apps und Einträge ohne „app-“ bleiben');
    assert.deepEqual(ziele, ['/app/?sw'], 'ohne Hash, Suchteil bleibt');
    speicher.set('app-abschnitte', '[]'); // die App speichert beim Verlassen noch etwas
    beimVerlassen.forEach((f) => f());
    assert.deepEqual([...speicher.keys()], bleibt);
  });
  // Gesperrter Speicher: Schon der Zugriff auf localStorage wirft (SecurityError) bzw. removeItem wirft.
  // Kein Fehler, trotzdem neu laden.
  for (const localStorage of [{ get() { throw new Error('gesperrt'); } },
    { value: { length: 1, key: () => 'app-zustand', removeItem: () => { throw new Error('gesperrt'); } } }]) {
    mitGlobalen({
      localStorage,
      window: { value: { addEventListener: () => {} } },
      location: { value: { pathname: '/app/', search: '', replace: (/** @type {string} */ z) => { ziele.push(z); } } },
    }, () => {
      const vorher = ziele.length;
      assert.doesNotThrow(() => alleEinstellungenZuruecksetzen('app'));
      assert.equal(ziele.length, vorher + 1);
    });
  }
});
