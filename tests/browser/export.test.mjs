// Export als ein Knopf mit Menü im Browser (exportMenue, js/seite.js; Leitfaden Abschn. 4 und 5.1, #130): ARIA,
// Tastatur, Maus, Klick ausserhalb, Rückmeldung im Knopf, Grösse der Touch-Ziele. Läuft in der CI im Job „browser“;
// lokal: node --test tests/browser/*.test.mjs (Playwright mit Chromium, mit CHROMIUM_PFAD=<Pfad> ein vorhandener Chrome).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { server } from '../../tools/server.mjs';

/** @import { Browser, BrowserContextOptions, Page } from 'playwright' */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
/** @type {import('node:http').Server} */
let srv;
/** @type {Browser} */
let browser;
let url = '';

before(async () => {
  srv = await server(ROOT);
  url = `http://127.0.0.1:${/** @type {import('node:net').AddressInfo} */ (srv.address()).port}/tests/browser/export.html`;
  const chrome = process.env.CHROMIUM_PFAD;
  // volles Chromium wie in help.test.mjs: chromium-headless-shell übernimmt die Emulation von pointer: coarse nicht
  browser = await chromium.launch(chrome ? { executablePath: chrome } : { channel: 'chromium' });
});
after(async () => { await browser?.close(); srv?.close(); });

/** Fehler der Seite je Seite, geprüft in schliessen(). @type {WeakMap<Page, string[]>} */
const FEHLER = new WeakMap();
/** @param {BrowserContextOptions} [o] @returns {Promise<Page>} */
async function seite(o = {}) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 600 }, ...o });
  const p = await ctx.newPage();
  /** @type {string[]} */
  const fehler = [];
  FEHLER.set(p, fehler);
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(url);
  await p.waitForSelector('body[data-bereit]');
  return p;
}
/** @param {Page} p */
async function schliessen(p) {
  const fehler = FEHLER.get(p) ?? [];
  await p.context().close();
  assert.deepEqual(fehler, [], 'Fehler auf der Seite');
}
/** @param {Page} p */
const zustand = (p) => p.evaluate(() => {
  const k = /** @type {HTMLElement} */ (document.getElementById('export'));
  const m = /** @type {HTMLElement} */ (document.getElementById('export-menue'));
  return { offen: !m.hidden, expanded: k.getAttribute('aria-expanded'), fokus: document.activeElement?.textContent ?? '', text: k.textContent };
});
/** @param {Page} p */
const aufrufe = (p) => p.evaluate(() => /** @type {{ aufrufe: string[] }} */ (/** @type {unknown} */ (window)).aufrufe.slice());

test('ARIA: Knopf mit Menü, Einträge als menuitem, anfangs zu', async () => {
  const p = await seite();
  const a = await p.evaluate(() => {
    const k = /** @type {HTMLElement} */ (document.getElementById('export'));
    const m = document.getElementById(k.getAttribute('aria-controls') ?? '');
    return {
      haspopup: k.getAttribute('aria-haspopup'), expanded: k.getAttribute('aria-expanded'),
      rolle: m?.getAttribute('role'), beschriftet: m?.getAttribute('aria-labelledby'), versteckt: m?.hidden,
      eintraege: [...(m?.children ?? [])].map((e) => [e.getAttribute('role'), e.getAttribute('tabindex'), e.textContent]),
    };
  });
  assert.equal(a.haspopup, 'menu');
  assert.equal(a.expanded, 'false');
  assert.equal(a.rolle, 'menu');
  assert.equal(a.beschriftet, 'export');
  assert.equal(a.versteckt, true);
  assert.deepEqual(a.eintraege.map((e) => e[0]), ['menuitem', 'menuitem', 'menuitem', 'menuitem']);
  assert.deepEqual(a.eintraege.map((e) => e[1]), ['-1', '-1', '-1', '-1'], 'Einträge nicht im Tab-Ablauf');
  assert.equal(await p.locator('#export-menue').isVisible(), false);
  await schliessen(p);
});

test('Maus: öffnen, Eintrag wählen, Rückmeldung im Knopf; Klick ausserhalb schliesst', async () => {
  const p = await seite();
  await p.click('#export');
  assert.deepEqual(await zustand(p), { offen: true, expanded: 'true', fokus: 'Kopieren (PNG)', text: 'Export' });
  assert.equal(await p.locator('#export-menue').isVisible(), true);
  await p.click('text=Kopieren (PNG)');
  assert.deepEqual(await aufrufe(p), ['kopieren']);
  await p.waitForFunction(() => document.getElementById('export')?.textContent === 'Kopiert');
  // Name des Knopfs bleibt, die Rückmeldung steht auch in der Statusmeldung (Screenreader)
  assert.deepEqual(await p.evaluate(() => [document.getElementById('export')?.getAttribute('aria-label'),
    document.querySelector('#export-menue + [role="status"]')?.textContent]), ['Export', 'Kopiert']);
  const z = await zustand(p);
  assert.equal(z.offen, false);
  assert.equal(z.expanded, 'false');
  await p.waitForFunction(() => document.getElementById('export')?.textContent === 'Export', null, { timeout: 3000 });
  // abgelehntes Promise und sofortiger Fehler: „Nicht möglich“
  await p.click('#export');
  await p.click('text=PNG-Datei speichern');
  await p.waitForFunction(() => document.getElementById('export')?.textContent === 'Nicht möglich');
  await p.click('#export');
  await p.click('text=Wirft');
  assert.equal((await zustand(p)).text, 'Nicht möglich');
  // Klick ausserhalb schliesst, ohne etwas auszulösen; erneuter Klick auf den Knopf schliesst ebenso
  await p.click('#export');
  await p.mouse.click(700, 500);
  assert.equal((await zustand(p)).offen, false);
  await p.click('#export');
  await p.click('#export');
  assert.equal((await zustand(p)).offen, false);
  assert.deepEqual(await aufrufe(p), ['kopieren', 'png']);
  await schliessen(p);
});

test('Tastatur: Pfeile, Pos1, Ende, Enter, Esc, Tab', async () => {
  const p = await seite();
  await p.focus('#export');
  await p.keyboard.press('ArrowDown');
  assert.equal((await zustand(p)).fokus, 'Kopieren (PNG)');
  await p.keyboard.press('ArrowUp');
  assert.equal((await zustand(p)).fokus, 'Wirft', 'Umlauf nach oben');
  await p.keyboard.press('ArrowDown');
  assert.equal((await zustand(p)).fokus, 'Kopieren (PNG)', 'Umlauf nach unten');
  await p.keyboard.press('End');
  assert.equal((await zustand(p)).fokus, 'Wirft');
  await p.keyboard.press('Home');
  await p.keyboard.press('ArrowDown');
  assert.equal((await zustand(p)).fokus, 'SVG-Datei speichern');
  await p.keyboard.press('Enter');
  assert.deepEqual(await aufrufe(p), ['svg']);
  let z = await zustand(p);
  assert.equal(z.offen, false);
  assert.equal(z.fokus, 'Export', 'Fokus zurück auf dem Knopf');
  // Pfeil auf öffnet auf dem letzten Eintrag, Esc schliesst und gibt den Fokus zurück
  await p.keyboard.press('ArrowUp');
  assert.equal((await zustand(p)).fokus, 'Wirft');
  await p.keyboard.press('Escape');
  z = await zustand(p);
  assert.deepEqual([z.offen, z.expanded, z.fokus], [false, 'false', 'Export']);
  // Leertaste öffnet, Tab schliesst und geht weiter
  await p.keyboard.press(' ');
  assert.equal((await zustand(p)).fokus, 'Kopieren (PNG)');
  await p.keyboard.press('Tab');
  z = await zustand(p);
  assert.equal(z.offen, false);
  assert.equal(z.fokus, 'Zweites', 'nächstes Bedienelement');
  assert.deepEqual(await aufrufe(p), ['svg']);
  await schliessen(p);
});

test('Touch (pointer: coarse): Knopf, Einträge und Symbolknopf mindestens 40 px', async () => {
  const p = await seite({ hasTouch: true, isMobile: true });
  assert.equal(await p.evaluate(() => matchMedia('(pointer: coarse)').matches), true, 'Voraussetzung des Tests');
  await p.tap('#export');
  assert.equal((await zustand(p)).offen, true);
  const masse = await p.evaluate(() => [...document.querySelectorAll('#export, #export-menue button, #lupe')]
    .map((e) => { const r = e.getBoundingClientRect(); return [e.id || e.textContent, Math.round(r.width), Math.round(r.height)]; }));
  for (const [name, b, h] of masse) {
    assert.ok(Number(h) >= 40, `${name}: Höhe ${h}`);
    if (name === 'lupe') assert.ok(Number(b) >= 40, `${name}: Breite ${b}`);
  }
  // Tippen ausserhalb schliesst
  await p.tap('svg');
  assert.equal((await zustand(p)).offen, false);
  await schliessen(p);
});

test('Knopf am Anfang einer Zeile: Menü linksbündig, innerhalb der Tafel', async () => {
  const p = await seite();
  const lage = async () => p.evaluate(() => {
    const t = /** @type {HTMLElement} */ (document.querySelector('.panel')).getBoundingClientRect();
    const m = /** @type {HTMLElement} */ (document.getElementById('export-menue')).getBoundingClientRect();
    return { innen: m.left >= t.left && m.right <= t.right };
  });
  await p.click('#export');
  assert.equal((await lage()).innen, true, 'Knopf rechts im Kopf');
  await p.keyboard.press('Escape');
  // schmalere Tafel, Titel über die ganze erste Zeile: Lupe und Knopf beginnen die zweite Zeile, links ist für das
  // rechtsbündige Menü kein Platz
  await p.evaluate(() => {
    /** @type {HTMLElement} */ (document.querySelector('.panel')).style.width = '300px';
    /** @type {HTMLElement} */ (document.querySelector('.panel-head .t')).style.flexBasis = '100%';
    /** @type {HTMLElement} */ (document.querySelector('.panel-head')).style.justifyContent = 'flex-start';
  });
  await p.click('#export');
  assert.equal((await lage()).innen, true, 'Knopf am Zeilenanfang');
  assert.equal(await p.evaluate(() => document.getElementById('export-menue')?.classList.contains('links')), true);
  await schliessen(p);
});

test('Zwei Menüs auf einer Seite, Shift+Tab, Klick auf ein anderes Bedienelement', async () => {
  const p = await seite();
  const offen = () => p.evaluate(() => ['export-menue', 'export2-menue'].map((id) => !document.getElementById(id)?.hidden));
  await p.click('#export');
  assert.deepEqual(await offen(), [true, false]);
  await p.click('#export2');
  assert.deepEqual(await offen(), [false, true], 'das andere schliesst');
  await p.keyboard.press('Enter');
  assert.deepEqual(await aufrufe(p), ['zweites']);
  // Shift+Tab im Menü: schliesst, Fokus auf dem Knopf
  await p.focus('#export');
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Shift+Tab');
  assert.deepEqual(await offen(), [false, false]);
  assert.equal(await p.evaluate(() => document.activeElement?.id), 'export');
  // Klick auf ein anderes Bedienelement schliesst
  await p.click('#export');
  await p.click('#lupe');
  assert.deepEqual(await offen(), [false, false]);
  // ein zweites Menü für denselben Knopf und ein leeres sind Fehler
  assert.match(await p.evaluate(() => {
    const { exportMenue } = /** @type {{ exportMenue: typeof import('../../js/seite.js').exportMenue }} */ (/** @type {unknown} */ (window));
    const k = /** @type {HTMLButtonElement} */ (document.getElementById('export'));
    try { exportMenue(k, [{ text: 'x', tun: () => {} }]); return 'kein Fehler'; } catch (e) { return String(e); }
  }), /hat schon ein Menü/);
  await schliessen(p);
});
