// Moduswahl als Tab-Muster (modusTabs in js/seite.js, #68), mit einer kleinen Nachbildung des DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';

class Knopf {
  /** @param {string} id @param {boolean} gewaehlt */
  constructor(id, gewaehlt) {
    this.id = id; this.disabled = false; this.tabIndex = 0; this.klicks = 0;
    /** @type {Record<string, string>} */
    this.attr = { role: 'tab', 'aria-selected': String(gewaehlt) };
  }
  /** @param {string} n */
  getAttribute(n) { return this.attr[n] ?? null; }
  /** @param {string} n @param {string} w */
  setAttribute(n, w) { this.attr[n] = w; }
  focus() { g.document.activeElement = this; }
  click() { this.klicks++; }
}
/** @type {Record<string, any>} */
const g = globalThis;
g.document = { activeElement: null };
const { modusTabs } = await import('../js/seite.js');

function aufbau() {
  const tabs = [new Knopf('tab-a', true), new Knopf('tab-b', false), new Knopf('tab-c', false)];
  /** @type {((e: { key: string, preventDefault: () => void }) => void) | null} */
  let taste = null;
  const liste = {
    querySelectorAll: () => tabs,
    /** @param {string} _t @param {any} f */
    addEventListener: (_t, f) => { taste = f; },
  };
  /** @type {Record<string, string>} */
  const attr = {};
  /** @param {string} n @param {string} w */
  const setze = (n, w) => { attr[n] = w; };
  const inhalt = { id: 'inhalt', attr, setAttribute: setze };
  const m = modusTabs(/** @type {any} */ (liste), /** @type {any} */ (inhalt));
  /** @param {string} key */
  const druecke = (key) => { let weg = false; /** @type {any} */ (taste)({ key, preventDefault: () => { weg = true; } }); return weg; };
  return { tabs, inhalt, m, druecke };
}

test('Tabs: aria-controls, gewählter Tab im Fokus-Ablauf, Panel beschriftet', () => {
  const { tabs, inhalt } = aufbau();
  for (const t of tabs) assert.equal(t.attr['aria-controls'], 'inhalt');
  assert.deepEqual(tabs.map((t) => t.tabIndex), [0, -1, -1]);
  assert.equal(inhalt.attr['aria-labelledby'], 'tab-a');
});

test('Tabs: Pfeiltasten mit Umlauf, Pos1 und Ende; gesperrte Tabs übersprungen; click löst den Modus aus', () => {
  const { tabs, druecke, m } = aufbau();
  tabs[0].focus();
  assert.ok(druecke('ArrowRight'));
  assert.equal(g.document.activeElement, tabs[1]); assert.equal(tabs[1].klicks, 1);
  m.markieren('tab-b');
  assert.deepEqual(tabs.map((t) => t.attr['aria-selected']), ['false', 'true', 'false']);
  assert.deepEqual(tabs.map((t) => t.tabIndex), [-1, 0, -1]);
  druecke('End'); assert.equal(g.document.activeElement, tabs[2]);
  druecke('ArrowRight'); assert.equal(g.document.activeElement, tabs[0]); // Umlauf
  druecke('ArrowLeft'); assert.equal(g.document.activeElement, tabs[2]);
  druecke('Home'); assert.equal(g.document.activeElement, tabs[0]);
  tabs[1].disabled = true;
  druecke('ArrowRight'); assert.equal(g.document.activeElement, tabs[2], 'gesperrter Tab übersprungen');
  assert.ok(!druecke('Enter'), 'andere Tasten bleiben unberührt');
});

test('Tabs: der schon gewählte Tab wird nicht noch einmal ausgelöst', () => {
  const { tabs, druecke } = aufbau();
  tabs[1].focus();
  druecke('ArrowLeft');
  assert.equal(tabs[0].klicks, 0);
});
