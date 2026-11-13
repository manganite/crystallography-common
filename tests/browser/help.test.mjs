// Tooltips und ⓘ im Browser (js/help.js, #114, #140): Maus, Tastatur, Touchscreen und der Wechsel zwischen ihnen, auch auf
// einem Gerät, dessen Browser den Touchscreen als primäres Zeigegerät meldet (pointer: coarse, z. B. Laptop mit
// Touchscreen unter Windows); das ⓘ auf allen Geräten, ohne allein umzubrechen. Läuft in der CI im Job „browser“; lokal: node --test tests/browser/*.test.mjs (Playwright mit Chromium, mit
// CHROMIUM_PFAD=<Pfad> ein vorhandener Chrome).
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
  url = `http://127.0.0.1:${/** @type {import('node:net').AddressInfo} */ (srv.address()).port}/tests/browser/help.html`;
  const chrome = process.env.CHROMIUM_PFAD;
  // volles Chromium im neuen Headless-Modus: chromium-headless-shell (Vorgabe) übernimmt die Emulation von pointer:
  // coarse nicht, die Voraussetzung des dritten Tests (in der CI festgestellt)
  browser = await chromium.launch(chrome ? { executablePath: chrome } : { channel: 'chromium' });
});
after(async () => { await browser?.close(); srv?.close(); });

/** Fehler der Seite je Seite, geprüft in schliessen(). @type {WeakMap<Page, string[]>} */
const FEHLER = new WeakMap();
/** Neue Seite mit den Testdaten. @param {BrowserContextOptions} [o] @returns {Promise<Page>} */
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
/** Seite schliessen; Fehler der Seite lassen den Test scheitern. @param {Page} p */
async function schliessen(p) {
  const fehler = FEHLER.get(p) ?? [];
  await p.context().close();
  assert.deepEqual(fehler, [], 'Fehler auf der Seite');
}
/** Ist der Tooltip sichtbar, und mit welchem Text? @param {Page} p */
const tip = (p) => p.evaluate(() => { const t = document.getElementById('tip'); return t && !t.hidden ? t.textContent : null; });
/** Sichtbar? @param {Page} p @param {string} sel */
const sichtbar = (p, sel) => p.locator(sel).isVisible();
/** Mitte eines Elements. @param {Page} p @param {string} sel */
const mitte = async (p, sel) => { const b = await p.locator(sel).boundingBox(); if (!b) throw new Error(sel); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
/** Maus über ein Element. @param {Page} p @param {string} sel */
const ueberfahren = async (p, sel) => { const m = await mitte(p, sel); await p.mouse.move(m.x - 30, m.y - 40); await p.mouse.move(m.x, m.y, { steps: 3 }); };
/** Warten, bis der Tooltip erscheint (Verzögerung 450 ms). @param {Page} p */
const tipAbwarten = (p) => p.waitForFunction(() => document.getElementById('tip')?.hidden === false, null, { timeout: 3000 });

/** Breite des ersten ⓘ. @param {Page} p */
const infoBreite = async (p) => Math.round((await p.locator('.infobtn').first().boundingBox())?.width ?? 0);

test('Laptop mit Maus: Tooltip beim Überfahren, Texte für die Maus, ⓘ mit kleiner Trefferfläche (#140)', async () => {
  const p = await seite();
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await sichtbar(p, '#grob'), false);
  assert.equal(await sichtbar(p, '#h-a .infobtn'), true);
  assert.equal(await infoBreite(p), 28);
  // das ⓘ hat selbst einen Tooltip (Leitfaden 5.3)
  await ueberfahren(p, '#sect-lang .infobtn');
  await tipAbwarten(p);
  assert.match(String(await tip(p)), /Erklärungen zu diesem Abschnitt/);
  // mit der Maus aufklappen: Einleitung und Tooltips des Abschnitts
  await p.click('#sect-lang .infobtn');
  assert.match(await p.locator('#sect-lang .helpbox').innerText(), /Einleitung des Abschnitts\.[\s\S]*Tooltip 2\./);
  await ueberfahren(p, '#knopf');
  await tipAbwarten(p);
  assert.equal(await tip(p), 'Tooltip des Knopfs.');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  await schliessen(p);
});

test('Tastatur: Tooltip beim Fokus, auch nach Tippen auf den Touchscreen', async () => {
  const p = await seite({ hasTouch: true });
  // das ⓘ kommt in der Reihenfolge vor dem Knopf
  for (let i = 0; i < 4 && await p.evaluate(() => document.activeElement?.id) !== 'knopf'; i++) await p.keyboard.press('Tab');
  assert.equal(await p.evaluate(() => document.activeElement?.id), 'knopf');
  assert.equal(await tip(p), 'Tooltip des Knopfs.');
  await p.tap('#feld');
  assert.equal(await tip(p), null, 'Tippen in ein Feld: kein Tooltip');
  await p.keyboard.press('Shift+Tab');
  assert.equal(await tip(p), 'Tooltip des Knopfs.', 'danach wieder die Tastatur');
  await schliessen(p);
});

test('Touchscreen als primäres Zeigegerät (pointer: coarse): Tippen ohne, Maus mit Tooltip (#114)', async () => {
  const p = await seite({ hasTouch: true, isMobile: true });
  assert.equal(await p.evaluate(() => matchMedia('(pointer: coarse)').matches), true, 'Voraussetzung des Tests');
  // vor jeder Eingabe entscheidet die Media Query
  assert.equal(await sichtbar(p, '#grob'), true);
  assert.equal(await sichtbar(p, '#fein'), false);
  await p.tap('#knopf');
  await p.waitForTimeout(700); // länger als die Verzögerung von 450 ms: es darf keiner erscheinen
  assert.equal(await tip(p), null);
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'touch');
  // dieselbe Seite mit einer Maus: Tooltip und Texte für die Maus, obwohl der Browser pointer: coarse meldet
  assert.equal(await infoBreite(p), 40);
  await ueberfahren(p, '#feld');
  await tipAbwarten(p);
  assert.equal(await tip(p), 'Tooltip des Felds.');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await sichtbar(p, '#grob'), false);
  assert.equal(await infoBreite(p), 28, 'mit der Maus kleines ⓘ, obwohl pointer: coarse');
  await schliessen(p);
});

test('Laptop mit Touchscreen, der hover: hover meldet: nach dem Tippen Texte für Touch und grosses ⓘ', async () => {
  // Die Emulation von Chromium meldet mit Touchscreen immer hover: none; deshalb eine Seite ohne Touchscreen und ein
  // Zeigerereignis vom Typ touch, wie es ein solcher Laptop beim Tippen auslöst.
  const p = await seite();
  assert.equal(await p.evaluate(() => matchMedia('(hover: hover)').matches), true, 'Voraussetzung des Tests');
  await p.dispatchEvent('#h-a', 'pointerdown', { pointerType: 'touch', bubbles: true });
  assert.equal(await infoBreite(p), 40);
  assert.equal(await sichtbar(p, '#grob'), true);
  assert.equal(await sichtbar(p, '#fein'), false);
  // mit der Maus danach: Texte für die Maus, das ⓘ wieder klein, es klappt die Erklärungen auf
  await p.click('#h-a .infobtn');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await infoBreite(p), 28);
  assert.match(await p.locator('.helpbox').innerText(), /Tooltip des Knopfs/);
  await schliessen(p);
});

test('ⓘ bricht nie allein in eine neue Zeile, mit Maus und Touch (#140)', async () => {
  for (const o of [{}, { hasTouch: true, isMobile: true }]) {
    const p = await seite(o);
    const r = await p.evaluate(() => [...document.querySelectorAll('details.sect > summary')].map((s) => {
      const btn = /** @type {Element} */ (s.querySelector('.infobtn'));
      const b = btn.getBoundingClientRect();
      // Zeile des letzten Zeichens vor dem ⓘ
      const wort = /** @type {Node} */ (btn.previousSibling);
      const rg = document.createRange();
      rg.selectNodeContents(wort);
      const z = [...rg.getClientRects()].at(-1);
      return {
        titel: s.querySelector('.sumtitel')?.textContent,
        hinweis: s.querySelector('.sumlabel > .sumhint')?.textContent,
        zeilen: (() => {
          const t = document.createRange();
          t.selectNodeContents(/** @type {Node} */ (s.querySelector('.sumtitel')));
          return new Set([...t.getClientRects()].map((q) => Math.round(q.bottom))).size;
        })(),
        gleicheZeile: !!z && b.top + b.height / 2 > z.top && b.top + b.height / 2 < z.bottom,
        symbol: wort instanceof Element ? wort.id : '',
      };
    }));
    assert.equal(r.length, 2);
    for (const x of r) assert.equal(x.gleicheZeile, true, `ⓘ in eigener Zeile: ${x.titel}`);
    // Titel unverändert (das ⓘ hat keinen Text ausser „i“), Hinweis ausserhalb des Titels
    assert.equal(r[0].titel, 'Symmetrie und allgemeine Lagei');
    assert.equal(r[0].hinweis, 'Gerüst, Objekt');
    assert.ok(r[0].zeilen >= 2, 'Voraussetzung: der Titel bricht um');
    // endet der Titel mit einem Element, bleibt es beim ⓘ
    assert.equal(r[1].symbol, 'symbol');
    assert.ok(r[1].zeilen >= 2, 'Voraussetzung: auch dieser Titel bricht um');
    await schliessen(p);
  }
});
