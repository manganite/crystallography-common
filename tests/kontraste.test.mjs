// Kontraste der Farben aus css/base.css nach WCAG 2.2, hell und dunkel (Leitfaden Abschn. 5.4, #65). Geprüft werden die
// Paare, die die gemeinsamen Stile verwenden; die gerenderten Seiten misst tools/kontraste.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { kontrast, ueber, SCHWELLE } from '../tools/kontraste.mjs';

const css = readFileSync(new URL('../css/base.css', import.meta.url), 'utf8');
/** @param {string} block */
const farben = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const HELL = farben(css.slice(css.indexOf(':root, .theme-light'), css.indexOf('@media (prefers-color-scheme: dark)')));
const DUNKEL = farben(css.slice(css.indexOf(':root[data-theme="dark"]')));
/** @typedef {[number, number, number, number]} RGBA */
/** @param {string} h @returns {RGBA} */
const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 1];
/** color-mix(in srgb, a p, b) wie in den Stilen. @param {string} a @param {number} p @param {string} b */
const misch = (a, p, b) => { const [r, g, bl] = rgb(a); return ueber([r, g, bl, p], rgb(b)); };

/** Ein Paar: Name, Vordergrund, Hintergrund (Variable oder Mischung), Schwelle. @typedef {{ name: string, fg: string, bg: string | ((f: Record<string, string>) => RGBA), soll: number }} Paar */
/** @param {string} name @param {string} fg @param {Paar['bg']} bg @param {number} soll @returns {Paar} */
const paar = (name, fg, bg, soll) => ({ name, fg, bg, soll });
/** @param {string} art @param {string[]} vorne @param {string[]} hinten @param {number} soll */
const alle = (art, vorne, hinten, soll) => vorne.flatMap((fg) => hinten.map((bg) => paar(`${art} ${fg} auf ${bg}`, fg, bg, soll)));

/** Die Paare, die die gemeinsamen Stile verwenden. @type {Paar[]} */
const PAARE = [
  ...alle('Text', ['ink', 'muted', 'accent', 'accent2'], ['bg', 'surface', 'paper'], SCHWELLE.text),
  // Farben der Blickrichtungen und Formen als Text (Kenndaten, Blickrichtungen und Beschriftungen in stereography)
  ...alle('Text', ['dir1', 'dir2', 'dir3', 'ax2', 'ax6'], ['bg', 'surface', 'paper'], SCHWELLE.text),
  ...alle('Text', ['fc0', 'fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc7'], ['surface', 'paper'], SCHWELLE.text),
  // gewählte Tabs, Gruppen, Segmente, Tooltip: paper auf ink; gewähltes Werkzeug: paper auf accent
  paar('Text paper auf ink', 'paper', 'ink', SCHWELLE.text),
  paar('Text paper auf accent', 'paper', 'accent', SCHWELLE.text),
  // Quiz: Buchstabe der richtigen bzw. falschen Antwort
  paar('Text paper auf ax2', 'paper', 'ax2', SCHWELLE.text),
  paar('Text paper auf ax6', 'paper', 'ax6', SCHWELLE.text),
  // Warnkasten (app.css): Überschrift in accent2 auf 8 % accent2 über surface
  paar('Text accent2 im Warnkasten', 'accent2', (f) => misch(f.accent2, 0.08, f.surface), SCHWELLE.text),
  // getönte Kästen: Trenner Vertiefung (skript.css .teil, 13 % ax3, der dunkelste), Grundlagen (6 % fc3),
  // Hilfekasten (app.css .helpbox, 6 % accent über paper), Antworten im Quiz (9 % ax2, 8 % ax6 über paper);
  // jeweils muted und accent (Links) als Text
  ...[['Trenner', (/** @type {Record<string, string>} */ f) => misch(f.ax3, 0.13, f.surface)],
    ['Grundlagen', (/** @type {Record<string, string>} */ f) => misch(f.fc3, 0.06, f.surface)],
    ['Hilfekasten', (/** @type {Record<string, string>} */ f) => misch(f.accent, 0.06, f.paper)],
    ['richtige Antwort', (/** @type {Record<string, string>} */ f) => misch(f.ax2, 0.09, f.paper)],
    ['falsche Antwort', (/** @type {Record<string, string>} */ f) => misch(f.ax6, 0.08, f.paper)]]
    .flatMap(([name, bg]) => ['muted', 'accent'].map((fg) => paar(`Text ${fg} im Kasten ${name}`, fg, /** @type {Paar['bg']} */ (bg), SCHWELLE.text))),
  // Fokusrahmen (accent) auf allen Flächen
  ...alle('Fokus', ['accent'], ['bg', 'surface', 'paper'], SCHWELLE.grafik),
  // Farben der Symmetrie, der Formen und der Konstruktion als Grafik auf der Tafel und auf der Karte (Legende).
  // Nicht geprüft, weil nur stützend (Leitfaden 5.4): --net (Hilfsnetz), --line (Rahmen, Hilfslinien), --crystal und
  // --crystal2 (Tönung von Flächen mit eigenem Umriss).
  ...alle('Grafik', ['ax2', 'ax3', 'ax4', 'ax6', 'dir1', 'dir2', 'dir3', 'mirror', 'edge', 'upper', 'normal', 'ray', 'accent', 'accent2',
    'fc0', 'fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc7'], ['surface', 'paper'], SCHWELLE.grafik),
  // Grenze von Eingabefeldern (select) gegen die Karte und das Feld selbst (WCAG 1.4.11, Entscheidung Thomas, 8.11.2026)
  ...alle('Feld', ['field'], ['bg', 'surface', 'paper'], SCHWELLE.grafik),
  // Fortschrittsbalken (quiz.css): Füllung auf der Spur in --line
  paar('Balken ax2 auf line', 'ax2', 'line', SCHWELLE.grafik),
  paar('Balken accent auf line', 'accent', 'line', SCHWELLE.grafik),
];

for (const [schema, f] of /** @type {const} */ ([['hell', HELL], ['dunkel', DUNKEL]])) {
  test(`Kontraste der Farben, ${schema}`, () => {
    /** @type {string[]} */
    const fehler = [];
    for (const { name, fg, bg, soll } of PAARE) {
      assert.ok(f[fg], `${schema}: --${fg} fehlt`);
      const grund = typeof bg === 'function' ? bg(f) : rgb(f[bg]);
      const k = kontrast(rgb(f[fg]), grund);
      if (k < soll) fehler.push(`${name}: ${k.toFixed(2)} : 1 (Soll ${soll})`);
    }
    assert.deepEqual(fehler, []);
  });
}

test('kontrast: Werte nach WCAG', () => {
  assert.equal(kontrast([0, 0, 0, 1], [255, 255, 255, 1]), 21);
  assert.equal(kontrast([255, 255, 255, 1], [255, 255, 255, 1]), 1);
  // #767676 auf Weiss: die bekannte Grenze 4,54 : 1
  assert.equal(kontrast(rgb('#767676'), rgb('#ffffff')).toFixed(2), '4.54');
});
