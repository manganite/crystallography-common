// Hermann-Mauguin-Symbole und Indizes mit Querstrich.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hmParts, hmHTML, hmText, hklHTML, indices } from '../js/format.js';

test('HM-Symbol: Querstrich über der Zahl nach dem Minus', () => {
  assert.deepEqual(hmParts('-43m'), [{ t: '4', bar: true }, { t: '3', bar: false }, { t: 'm', bar: false }]);
  assert.equal(hmHTML('m-3m'), 'm<span class="ov">3</span>m');
  assert.equal(hmText('-6m2'), '6̅m2');
});

test('Indizes: negative mit Querstrich, vierstellig mit i = −(h + k)', () => {
  assert.equal(hklHTML([1, -1, 0]), '(1<span class="ov">1</span>0)');
  assert.deepEqual(indices([1, 0, 1], true), [1, 0, -1, 1]);
});
