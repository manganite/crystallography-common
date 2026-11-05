// Quiz-Logik mit einer kleinen künstlichen Fragenbank: Kandidaten, Ziehen, Mischen, Auswerten, Fortschritt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STUFEN, ANTEILE, GEN_ANTEIL, GEN_GESAMT, rng, shuffle, kandidaten, zaehlen, ziehen, stellen, pruefen,
  leererFortschritt, fortschrittAus, vermerken, stand,
} from '../js/quiz-core.js';

/** @import { Frage, Generator, Kandidat, Stufe, Status } from '../js/quiz-core.js' */

/**
 * @param {string} id @param {Stufe} stufe @param {number} kapitel @param {Status} [status]
 * @returns {Frage}
 */
const frage = (id, stufe, kapitel, status = 'geprüft') => ({
  id, stufe, kapitel, status, typ: 'einfach', frage: id, antworten: ['a', 'b', 'c', 'd'], richtig: [0],
  hinweise: [null, 'b falsch', 'c falsch', 'd falsch'], erklaerung: '', quelle: '',
});
/** @type {Frage[]} */
const BANK = [];
for (const k of [1, 2]) for (const s of /** @type {Stufe[]} */ ([1, 2, 3])) for (let i = 0; i < 8; i++) BANK.push(frage(`k${k}-s${s}-${i}`, s, k));
BANK.push(frage('entwurf', 1, 1, 'entwurf'));
/** @type {Generator[]} */
const GEN = [{ id: 'gen', kapitel: 1, status: 'geprüft', stufen: [1, 2], params: (s) => ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((p) => `${s}-${p}`),
  make: (p) => ({ typ: 'einfach', frage: `g${p}`, antworten: ['x', 'y'], richtig: [1], erklaerung: '', quelle: '' }) }];

test('Stufen und Anteile', () => {
  assert.deepEqual(Object.keys(STUFEN), ['1', '2', '3']);
  for (const s of /** @type {Stufe[]} */ ([1, 2, 3])) assert.ok(Math.abs(Object.values(ANTEILE[s]).reduce((a, b) => a + b, 0) - 1) < 1e-9);
});

test('Kandidaten: Entwürfe nur auf Wunsch, Generatoren je Parameter und Stufe', () => {
  const k = kandidaten(BANK, GEN);
  assert.ok(!k.some((x) => x.key === 'entwurf'));
  assert.ok(kandidaten(BANK, GEN, { entwurf: true }).some((x) => x.key === 'entwurf'));
  assert.equal(k.filter((x) => x.gen).length, 20);
  assert.equal(zaehlen(k)[1][1], 8 + 10);
});

test('Ziehen: Anzahl, Kapitel, Stufe, höchstens 30 % je Generator und 50 % erzeugt', () => {
  const k = kandidaten(BANK, GEN);
  for (let seed = 1; seed < 40; seed++) {
    const z = ziehen(k, { stufe: 2, kapitel: [1], n: 10, rand: rng(seed) });
    assert.equal(z.length, 10);
    assert.ok(z.every((x) => x.kapitel === 1 && x.stufe <= 2));
    const gen = z.filter((x) => x.gen).length;
    assert.ok(gen <= 10 * GEN_ANTEIL && gen <= 10 * GEN_GESAMT);
  }
});

/** Anteile bezogen auf die tatsächliche Länge, unabhängig von der Rechnung in ziehen() (#61). @param {Kandidat[]} z */
const anteileEingehalten = (z) => {
  /** @type {Record<string, number>} */
  const je = {};
  for (const x of z) if (x.gen) je[x.gen.id] = (je[x.gen.id] || 0) + 1;
  const gesamt = Object.values(je).reduce((a, b) => a + b, 0);
  return Object.values(je).every((c) => c <= GEN_ANTEIL * z.length + 1e-9) && gesamt <= GEN_GESAMT * z.length + 1e-9;
};

test('Ziehen: 30 % je Generator und 50 % erzeugt gelten für die tatsächliche Länge (#61)', () => {
  /** @param {string} id @returns {Generator} */
  const g = (id) => ({ ...GEN[0], id, stufen: [1], params: () => Array.from({ length: 20 }, (_, i) => String(i)) });
  const viele = [g('a'), g('b'), g('c')];
  for (const hand of [0, 1, 2, 3, 5, 8]) {
    const k = kandidaten(BANK.filter((q) => q.kapitel === 1 && q.stufe === 1).slice(0, hand), viele);
    for (const n of [5, 10, 20]) for (let seed = 1; seed < 30; seed++) {
      const z = ziehen(k, { stufe: 1, n, rand: rng(seed) });
      assert.ok(z.length <= n);
      assert.ok(anteileEingehalten(z), `hand ${hand}, n ${n}, seed ${seed}: ${z.map((x) => x.key).join(' ')}`);
    }
  }
  // Fall aus dem Review: 2 handgeschriebene Fragen, ein Generator, n = 10 → höchstens 30 % aus dem Generator
  const k = kandidaten(BANK.filter((q) => q.kapitel === 1 && q.stufe === 1).slice(0, 2), [g('a')]);
  for (let seed = 1; seed < 30; seed++) assert.ok(anteileEingehalten(ziehen(k, { stufe: 1, n: 10, rand: rng(seed) })));
  // volle Quizrunde mit 5 Fragen: höchstens 1 je Generator (nicht 2 durch Runden)
  const voll = kandidaten(BANK, viele);
  for (let seed = 1; seed < 30; seed++) assert.ok(anteileEingehalten(ziehen(voll, { stufe: 1, kapitel: [1], n: 5, rand: rng(seed) })));
});

test('Kandidaten: derselbe Parameter auf zwei Stufen ist ein Fehler (#60)', () => {
  /** @type {Generator} */
  const doppelt = { ...GEN[0], id: 'd', stufen: [1, 2], params: () => ['p'] };
  assert.throws(() => kandidaten([], [doppelt]), /d:p doppelt/);
  /** @type {Generator} */
  const getrennt = { ...GEN[0], id: 'd', stufen: [1, 2], params: (s) => [`p${s}`] };
  assert.equal(kandidaten([], [getrennt]).length, 2);
});

test('Ziehen: Vorrang für nie beantwortete Fragen', () => {
  const k = kandidaten(BANK, []).filter((x) => x.kapitel === 2 && x.stufe === 1);
  const p = leererFortschritt();
  for (const x of k.slice(0, 4)) vermerken(p, x.key, true);
  const z = ziehen(k, { stufe: 1, n: 4, progress: p, rand: rng(3) });
  assert.ok(z.every((x) => !p.fragen[x.key]));
});

test('Stellen und Prüfen: gemischte Antworten, richtige mitgeführt', () => {
  const q = stellen({ key: 'a', stufe: 1, kapitel: 1, frage: BANK[0] }, rng(7));
  assert.equal(q.antworten[q.richtig[0]], 'a');
  assert.equal(q.hinweise?.[q.richtig[0]], null);
  assert.ok(pruefen(q, q.richtig));
  assert.ok(!pruefen(q, [...q.richtig, (q.richtig[0] + 1) % 4]));
  assert.deepEqual(shuffle([1, 2, 3], rng(1)).sort(), [1, 2, 3]);
});

test('Fortschritt: speichern, lesen, Unbrauchbares ergibt leeren Stand', () => {
  const p = vermerken(vermerken(leererFortschritt(), 'x', false, 1), 'x', true, 2);
  assert.deepEqual(p.fragen.x, { n: 2, r: 1, letzte: 1, t: 2 });
  assert.deepEqual(fortschrittAus(JSON.stringify(p)), p);
  assert.deepEqual(fortschrittAus('kaputt'), leererFortschritt());
  /** @type {Kandidat[]} */
  const kands = [{ key: 'x', stufe: 1, kapitel: 1 }, { key: 'y', stufe: 1, kapitel: 1 }];
  assert.deepEqual(stand(kands, p), { 1: { gesamt: 2, richtig: 1 } });
});
