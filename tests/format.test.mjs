// Hermann-Mauguin-Symbole und Indizes mit Querstrich.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hmParts, hmHTML, hmText, hklHTML, indices, esc, hmLabel, hklLabel } from '../js/format.js';

test('HM-Symbol: Querstrich über der Zahl nach dem Minus', () => {
  assert.deepEqual(hmParts('-43m'), [{ t: '4', bar: true }, { t: '3', bar: false }, { t: 'm', bar: false }]);
  assert.equal(hmHTML('m-3m'), '<span role="img" aria-label="m, 3 quer, m">m<span class="ov">3</span>m</span>');
  assert.equal(hmText('-6m2'), '6̅m2');
});

test('Indizes: negative mit Querstrich, vierstellig mit i = −(h + k)', () => {
  assert.equal(hklHTML([1, -1, 0]), '(<span role="img" aria-label="1, 1 quer, 0">1<span class="ov">1</span>0</span>)');
  assert.equal(hklHTML([0, 0, 1], false, ['[', ']']), '[<span role="img" aria-label="0, 0, 1">001</span>]');
  assert.deepEqual(indices([1, 0, 1], true), [1, 0, -1, 1]);
});

test('esc: Text und Attributwerte maskiert (#64)', () => {
  assert.equal(esc(`<a href="x" title='y'>&</a>`), '&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  assert.equal(esc(42), '42');
});

test('Ansagetext für Screenreader (#82, Entscheidungen Thomas 8.11.2026): Zeichen einzeln, „quer“, „über“, „Punkt“', () => {
  // 222 und (110) sonst als Zahl gelesen, 4̄ als „minus 4“
  assert.equal(hmLabel('222'), '2, 2, 2');
  assert.equal(hmLabel('-42m'), '4 quer, 2, m');
  assert.equal(hmLabel('4/mmm'), '4 über m, m, m');
  assert.equal(hmLabel('2/m 2/m 2/m'), '2 über m, 2 über m, 2 über m');
  assert.equal(hmLabel('-1'), '1 quer');
  assert.equal(hmLabel('..m'), 'Punkt, Punkt, m');
  assert.equal(hmLabel('4m.m'), '4, m, Punkt, m');
  assert.equal(hklLabel([1, -1, 0]), '1, 1 quer, 0');
  assert.equal(hklLabel([1, 0, 1], true), '1, 0, 1 quer, 1', 'Miller-Bravais mit i');
  assert.equal(hklLabel([10, -1, 0]), '10, 1 quer, 0', 'zweistellige Indizes bleiben eine Zahl');
  assert.match(hmHTML('<"'), /aria-label="&lt;, &quot;">&lt;&quot;</, 'Ansagetext maskiert');
});
