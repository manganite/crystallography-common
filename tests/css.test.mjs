// Farben: hell und dunkel definieren dieselben Variablen; beide dunklen Blöcke (System und data-theme) sind gleich.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const css = readFileSync(new URL('../css/base.css', import.meta.url), 'utf8');
const vars = (block) => Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const blockAfter = (marker) => {
  const i = css.indexOf(marker);
  assert.ok(i >= 0, marker);
  const j = css.indexOf('{', i + marker.length - 1);
  return css.slice(j + 1, css.indexOf('}', j));
};

const hell = vars(blockAfter(':root, .theme-light {'));
const dunkelSystem = vars(blockAfter(':root:not([data-theme="light"]) {'));
const dunkelSchalter = vars(blockAfter(':root[data-theme="dark"] {'));
const FARBEN = Object.keys(hell).filter((k) => !k.startsWith('font-'));

test('jede Farbe des hellen Modus hat eine dunkle Entsprechung, in beiden dunklen Blöcken gleich', () => {
  for (const k of FARBEN) assert.ok(k in dunkelSystem, `--${k} fehlt im dunklen Block (System)`);
  assert.deepEqual(dunkelSystem, dunkelSchalter);
  for (const k of Object.keys(dunkelSystem)) assert.ok(k in hell, `--${k} nur dunkel`);
});

test('Farben der Symmetrie sind vorhanden (gleiche Bedeutung in allen Apps)', () => {
  for (const k of ['ax2', 'ax3', 'ax4', 'ax6', 'dir1', 'dir2', 'dir3', ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `fc${i}`)]) assert.ok(k in hell, k);
});

test('Stylesheets verwenden nur definierte Variablen', () => {
  const definiert = new Set([...Object.keys(hell), 'ovt', 'dc', 'zc']);
  for (const f of readdirSync(new URL('../css/', import.meta.url))) {
    const text = readFileSync(new URL(`../css/${f}`, import.meta.url), 'utf8');
    for (const m of text.matchAll(/var\(--([\w-]+)/g)) {
      // --ovt, --dc, --zc setzen die Seiten bzw. Elemente selbst (mit Rückfallwert)
      assert.ok(definiert.has(m[1]) || /var\(--[\w-]+,/.test(m[0] + text.slice(m.index + m[0].length, m.index + m[0].length + 1)), `${f}: --${m[1]}`);
    }
  }
});

test('Schriften: jede in fonts.css genannte Datei ist vorhanden', () => {
  const fonts = readFileSync(new URL('../fonts/fonts.css', import.meta.url), 'utf8');
  const da = new Set(readdirSync(new URL('../fonts/', import.meta.url)));
  const urls = [...fonts.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)].map((m) => m[1]);
  assert.ok(urls.length > 0);
  for (const u of urls) assert.ok(da.has(u.replace(/^\.\//, '')), u);
});
