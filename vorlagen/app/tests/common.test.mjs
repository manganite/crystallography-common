// Gemeinsame Dateien der App-Familie (crystallography-common): Kopie unverändert, eingebunden, Speicher stabil.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pruefen } from '../tools/common/check.mjs';
import { SPEICHER } from '../js/quiz-kapitel.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
/** @param {string} p */
const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

test('lib/common und tools/common entsprechen dem Manifest (Änderungen gehören nach crystallography-common)', () => {
  assert.deepEqual(pruefen(ROOT), []);
});

test('jede Seite bindet Schriften, base.css und das Stylesheet ihres Seitentyps aus lib/common ein', () => {
  // die Hilfeseite sieht aus wie das Skript und lädt hilfe.css danach
  for (const [seite, ...typen] of [['index.html', 'app'], ['skript.html', 'skript'], ['quiz.html', 'quiz'], ['hilfe.html', 'skript', 'hilfe']]) {
    const html = read(seite);
    const links = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map((m) => m[1]);
    assert.deepEqual(links, ['lib/common/fonts/fonts.css', 'lib/common/css/base.css', ...typen.map((t) => `lib/common/css/${t}.css`)], seite);
    // eigene Stile der Seite stehen danach (überschreiben die gemeinsamen, nicht umgekehrt)
    const style = html.indexOf('<style>');
    if (style >= 0) assert.ok(style > html.indexOf(`lib/common/css/${typen.at(-1)}.css`), seite);
  }
});

test('Quiz: Speicher im Browser behält seinen Namen (sonst ginge der Stand der Studierenden verloren)', () => {
  assert.equal(SPEICHER, 'muster-quiz');
});

test('keine Kopien gemeinsamer Module mehr in js/', () => {
  for (const f of ['format.js', 'help.js', 'quiz-core.js']) assert.throws(() => read(`js/${f}`), `js/${f}`);
});

test('Erste Schritte und Lernexperimente: Daten vollständig (pruefeAblaeufe)', async () => {
  const { pruefeAblaeufe } = await import('../lib/common/js/ablauf.js');
  const { ABLAEUFE, ERSTE_SCHRITTE } = await import('../js/hilfetexte.js');
  const { KAPITEL } = await import('../js/quiz-kapitel.js');
  // In einer App: hashGueltig über die Prüffunktion der Adresse (Rundlauf), modi und anker aus der App
  const o = { aktionen: ['darstellung', 'experimente'], modi: ['a', 'b'], hashGueltig: (/** @type {string} */ h) => /^#g=p/.test(h) };
  // kapitel: ab 6 Experimenten je Modus braucht jedes ein bekanntes Kapitel (Gliederung der Liste, #107)
  assert.deepEqual(pruefeAblaeufe(ABLAEUFE, { ...o, kapitel: KAPITEL }), []);
  assert.deepEqual(pruefeAblaeufe(ERSTE_SCHRITTE, o), []);
});

test('Hilfeseite: Modi, abgebildete Bedienelemente und Bilder passen zur App (pruefeHilfe)', async () => {
  const { pruefeHilfe } = await import('../lib/common/js/hilfe-seite.js');
  const { HILFE } = await import('../js/hilfe-daten.js');
  const dateien = readdirSync(new URL('../hilfe/', import.meta.url));
  assert.deepEqual(pruefeHilfe(HILFE, { html: read('index.html'), dateien }), []);
  // „?“ führt zur Hilfeseite (Leitfaden Abschn. 5.3)
  assert.match(read('index.html'), /<a class="helpbtn" id="help-open" href="hilfe\.html"/);
});

test('Tooltips: jedes Bedienelement mit id hat einen, kurz (pruefeTooltips, Leitfaden Abschn. 5.3)', async () => {
  const { pruefeTooltips } = await import('../lib/common/js/help.js');
  const { TIPS } = await import('../js/hilfetexte.js');
  // Ausnahmen: selbsterklärende Links, Schliessen „×“, Export-Knöpfe mit Text (in einer App z. B. svg-a, png-a)
  assert.deepEqual(pruefeTooltips(read('index.html'), TIPS, { ohne: ['help-open', 'intro-close'] }), []);
});
