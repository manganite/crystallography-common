// Moodle-Export (tools/moodle.mjs): Maskierung in Text und Attributen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frageXML, xmlEsc, attrEsc } from '../tools/moodle.mjs';

test('Maskierung: Text ohne, Attribute mit doppelten Anführungszeichen', () => {
  assert.equal(xmlEsc('a < b & "c"'), 'a &lt; b &amp; "c"');
  assert.equal(attrEsc('a < b & "c"'), 'a &lt; b &amp; &quot;c&quot;');
});

test('Alternativtexte von Bildern bleiben gültige Attribute, auch mit Anführungszeichen', () => {
  const kapitel = [{ nr: 1, titel: 'Kapitel' }];
  const bildSVG = () => '<svg xmlns="http://www.w3.org/2000/svg"/>';
  const q = {
    id: 'x-1-01', kapitel: 1, typ: 'bild-bild', frage: 'Welches?', bild: '#a', bildAlt: 'Bild "A"',
    antworten: [{ app: '#b', alt: 'Antwort "B"' }, { app: '#c', alt: 'C' }], richtig: [0], erklaerung: 'weil', quelle: 'Q',
  };
  const xml = frageXML(q, { kapitel, bildSVG });
  assert.match(xml, /alt="Bild &quot;A&quot;"/);
  assert.match(xml, /alt="Antwort &quot;B&quot;"/);
  assert.doesNotMatch(xml, /alt="[^"]*"[^ >]/);
});
