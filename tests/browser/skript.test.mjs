// Abschnittsnummern und Verweise im Skript (abschnitte, js/skript-kern.js; #85): Nummern in Überschriften und
// Inhaltsverzeichnis, Verweise als Links mit Titel, Zitate anderer Werke und Links bleiben Text. Läuft in der CI im
// Job „browser“; lokal: node --test tests/browser/*.test.mjs (mit CHROMIUM_PFAD=<Pfad> ein vorhandener Chrome).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { server } from '../../tools/server.mjs';

/** @import { Browser } from 'playwright' */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
/** @type {import('node:http').Server} */
let srv;
/** @type {Browser} */
let browser;
let url = '';

before(async () => {
  srv = await server(ROOT);
  url = `http://127.0.0.1:${/** @type {import('node:net').AddressInfo} */ (srv.address()).port}/tests/browser/skript.html`;
  const chrome = process.env.CHROMIUM_PFAD;
  browser = await chromium.launch(chrome ? { executablePath: chrome } : { channel: 'chromium' });
});
after(async () => { await browser?.close(); srv?.close(); });

test('abschnitte: Nummern und Links', async () => {
  const p = await browser.newPage();
  /** @type {string[]} */
  const fehler = [];
  p.on('pageerror', (e) => fehler.push(String(e)));
  await p.goto(url);
  await p.waitForSelector('body[data-bereit]');
  const r = await p.evaluate(() => ({
    anzahl: /** @type {any} */ (window).anzahl,
    h3: [...document.querySelectorAll('article h3')].map((h) => h.textContent),
    toc: [...document.querySelectorAll('.toc ol ol a')].map((a) => a.textContent),
    links: [...document.querySelectorAll('a.abschnitt-link')].map((a) => `${a.textContent}|${a.getAttribute('href')}|${a.getAttribute('title')}`),
    p1: document.getElementById('p1')?.textContent,
    p2: document.getElementById('p2')?.textContent,
    quelle: document.querySelector('#q a'),
  }));
  assert.equal(r.anzahl, 3);
  assert.deepEqual(r.h3, ['1.1 Erster', '1.2 Zweiter', '2.1 Dritter'], 'Nummern einmal, auch nach zweitem Aufruf');
  assert.deepEqual(r.toc, ['1.1 Erster', '1.2 Zweiter', '2.1 Dritter']);
  assert.deepEqual(r.links, [
    'Abschnitt 1.2|#b|1.2 Zweiter',
    'Abschnitte 1.1|#a|1.1 Erster',
    '2.1|#c|2.1 Dritter',
    'Abschn. 1.2|#b|1.2 Zweiter',
    'Abschnitts 2.1|#c|2.1 Dritter',
  ]);
  assert.equal(await p.locator('svg a, #p3 b a').count(), 0, 'kein Link in SVG und über eine Elementgrenze');
  assert.equal(r.p1, 'Siehe Abschnitt 1.2 und Skript, Abschnitt 1.1; Abschnitte 1.1–2.1, auch Werk, Abschn. 1.1.', 'Text unverändert');
  assert.match(r.p2 ?? '', /\(Abschnitt 9\.9\)/);
  assert.equal(r.quelle, null, 'Quellen bleiben Text');
  // ein Link führt zum Abschnitt
  await p.click('#p1 a.abschnitt-link');
  assert.equal(await p.evaluate(() => location.hash), '#b');
  assert.deepEqual(fehler, []);
  await p.close();
});
