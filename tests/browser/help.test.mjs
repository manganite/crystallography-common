// Tooltips im Browser (js/help.js, #114): Maus, Tastatur, Touchscreen und der Wechsel zwischen ihnen, auch auf einem
// Gerät, dessen Browser den Touchscreen als primäres Zeigegerät meldet (pointer: coarse, z. B. Laptop mit Touchscreen
// unter Windows). Läuft in der CI im Job „browser“; lokal: node --test tests/browser/ (Playwright mit Chromium, mit
// KONTRASTE_CHROME=<Pfad> ein vorhandener Chrome).
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
  const chrome = process.env.KONTRASTE_CHROME;
  browser = await chromium.launch(chrome ? { executablePath: chrome } : {});
});
after(async () => { await browser?.close(); srv?.close(); });

/** Neue Seite mit den Testdaten. @param {BrowserContextOptions} [o] @returns {Promise<Page>} */
async function seite(o = {}) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 600 }, ...o });
  const p = await ctx.newPage();
  /** @type {string[]} */
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(url);
  await p.waitForSelector('body[data-bereit]');
  p.on('close', () => assert.deepEqual(fehler, []));
  return p;
}
/** Ist der Tooltip sichtbar, und mit welchem Text? @param {Page} p */
const tip = (p) => p.evaluate(() => { const t = document.getElementById('tip'); return t && !t.hidden ? t.textContent : null; });
/** Sichtbar? @param {Page} p @param {string} sel */
const sichtbar = (p, sel) => p.locator(sel).isVisible();
/** Mitte eines Elements. @param {Page} p @param {string} sel */
const mitte = async (p, sel) => { const b = await p.locator(sel).boundingBox(); if (!b) throw new Error(sel); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; };
/** Maus über ein Element und die Verzögerung abwarten. @param {Page} p @param {string} sel */
const ueberfahren = async (p, sel) => { const m = await mitte(p, sel); await p.mouse.move(m.x - 30, m.y - 40); await p.mouse.move(m.x, m.y, { steps: 3 }); await p.waitForTimeout(700); };

test('Laptop mit Maus: Tooltip beim Überfahren, Texte für die Maus, kein ⓘ', async () => {
  const p = await seite();
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await sichtbar(p, '#grob'), false);
  assert.equal(await sichtbar(p, '.infobtn'), false);
  await ueberfahren(p, '#knopf');
  assert.equal(await tip(p), 'Tooltip des Knopfs.');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  await p.close();
});

test('Tastatur: Tooltip beim Fokus, auch nach Tippen auf den Touchscreen', async () => {
  const p = await seite({ hasTouch: true });
  // mit Touchscreen ist das ⓘ sichtbar und kommt in der Reihenfolge vor dem Knopf
  for (let i = 0; i < 4 && await p.evaluate(() => document.activeElement?.id) !== 'knopf'; i++) await p.keyboard.press('Tab');
  assert.equal(await p.evaluate(() => document.activeElement?.id), 'knopf');
  assert.equal(await tip(p), 'Tooltip des Knopfs.');
  await p.tap('#feld');
  assert.equal(await tip(p), null, 'Tippen in ein Feld: kein Tooltip');
  await p.keyboard.press('Shift+Tab');
  assert.equal(await tip(p), 'Tooltip des Knopfs.', 'danach wieder die Tastatur');
  await p.close();
});

test('Touchscreen als primäres Zeigegerät (pointer: coarse): Tippen ohne, Maus mit Tooltip (#114)', async () => {
  const p = await seite({ hasTouch: true, isMobile: true });
  assert.equal(await p.evaluate(() => matchMedia('(pointer: coarse)').matches), true, 'Voraussetzung des Tests');
  // vor jeder Eingabe entscheidet die Media Query
  assert.equal(await sichtbar(p, '#grob'), true);
  assert.equal(await sichtbar(p, '#fein'), false);
  await p.tap('#knopf');
  await p.waitForTimeout(700);
  assert.equal(await tip(p), null);
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'touch');
  // dieselbe Seite mit einer Maus: Tooltip und Texte für die Maus, obwohl der Browser pointer: coarse meldet
  await ueberfahren(p, '#feld');
  assert.equal(await tip(p), 'Tooltip des Felds.');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await sichtbar(p, '#grob'), false);
  await p.close();
});

test('Laptop mit Touchscreen, der hover: hover meldet: nach dem Tippen Texte für Touch und ⓘ', async () => {
  // Die Emulation von Chromium meldet mit Touchscreen immer hover: none; deshalb eine Seite ohne Touchscreen und ein
  // Zeigerereignis vom Typ touch, wie es ein solcher Laptop beim Tippen auslöst.
  const p = await seite();
  assert.equal(await p.evaluate(() => matchMedia('(hover: hover)').matches), true, 'Voraussetzung des Tests');
  assert.equal(await sichtbar(p, '.infobtn'), false);
  await p.dispatchEvent('#h-a', 'pointerdown', { pointerType: 'touch', bubbles: true });
  assert.equal(await sichtbar(p, '.infobtn'), true);
  assert.equal(await sichtbar(p, '#grob'), true);
  assert.equal(await sichtbar(p, '#fein'), false);
  // mit der Maus danach: Texte für die Maus, das ⓘ bleibt und klappt die Erklärungen auf
  await p.click('.infobtn');
  assert.equal(await p.evaluate(() => document.documentElement.dataset.zeiger), 'maus');
  assert.equal(await sichtbar(p, '#fein'), true);
  assert.equal(await sichtbar(p, '.infobtn'), true);
  assert.match(await p.locator('.helpbox').innerText(), /Tooltip des Knopfs/);
  await p.close();
});
