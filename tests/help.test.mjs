// Tooltips (js/help.js, #114): Prüfhelfer für die Tests der Apps. Das Verhalten im Browser prüft
// tests/browser/help.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeTooltips, TIP_MAX } from '../js/help.js';

const HTML = `
<a class="helpbtn" id="help-open" href="hilfe.html">?</a>
<button id="angle-btn" type="button">Winkel</button>
<button type="button" data-fig="a">A</button>
<input type="range" id="lat">
<input type="hidden" id="versteckt">
<select id='gruppe'></select>
<button class="intro-x" id="intro-close" type="button" aria-label="Schliessen">×</button>
<textarea id="notiz"></textarea>`;

test('pruefeTooltips: jedes Bedienelement mit id hat einen Tooltip oder ist Ausnahme', () => {
  const tips = { 'angle-btn': 'Winkel zwischen zwei Flächenpolen messen.', lat: 'Breite', gruppe: 'Gruppe wählen', notiz: 'Notiz' };
  assert.deepEqual(pruefeTooltips(HTML, tips, { ohne: ['help-open', 'intro-close'] }), []);
  // fehlend: Link, Schliessen und Textfeld; versteckte Eingaben und Elemente ohne id zählen nicht
  assert.deepEqual(pruefeTooltips(HTML, { 'angle-btn': 'x', lat: 'x', gruppe: 'x' }), [
    'a#help-open: kein Tooltip', 'button#intro-close: kein Tooltip', 'textarea#notiz: kein Tooltip',
  ]);
});

test('pruefeTooltips: Ausnahmen müssen vorkommen und dürfen keinen Tooltip haben', () => {
  const tips = { 'angle-btn': 'x', lat: 'x', gruppe: 'x', notiz: 'x', 'intro-close': 'Schliessen' };
  assert.deepEqual(pruefeTooltips(HTML, tips, { ohne: ['help-open', 'intro-close', 'png-a'] }), [
    'intro-close: Ausnahme, hat aber einen Tooltip',
    'png-a: Ausnahme, aber kein Bedienelement mit dieser id im HTML',
  ]);
});

test('pruefeTooltips: Höchstlänge ohne Auszeichnung, Entitäten als ein Zeichen', () => {
  assert.equal(TIP_MAX, 120);
  const genau = 'a'.repeat(118) + '&amp;' + '<i>b</i>'; // 120 Zeichen
  const zuLang = genau + 'c';
  const tips = { 'angle-btn': genau, lat: zuLang, gruppe: 'x', notiz: 'x' };
  assert.deepEqual(pruefeTooltips(HTML, tips, { ohne: ['help-open', 'intro-close'] }), ['lat: Tooltip mit 121 Zeichen, länger als 120']);
  assert.deepEqual(pruefeTooltips(HTML, tips, { ohne: ['help-open', 'intro-close'], max: 200 }), []);
});
