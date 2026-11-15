// Tooltips im Browser (#114): der Prüfhelfer für die Apps (tools/tooltips-pruefen.mjs) und Tooltips an gesperrten
// Knöpfen in Chromium, Firefox und WebKit (Safari), soweit diese Browser installiert sind; ein Browser, der sich nicht
// starten lässt, wird mit Grund übersprungen. In der CI: Chromium und Firefox im Job „browser“ (Ubuntu), WebKit im Job
// „webkit“ (macOS, dort startet WebKit ohne Pakete aus apt). Lokal: node --test tests/browser/*.test.mjs.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { server } from '../../tools/server.mjs';
import { fehlendeTooltips } from '../../tools/tooltips-pruefen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
/** @type {import('node:http').Server} */
let srv;
let url = '';
before(async () => {
  srv = await server(ROOT);
  url = `http://127.0.0.1:${/** @type {import('node:net').AddressInfo} */ (srv.address()).port}/tests/browser/help.html`;
});
after(() => { srv?.close(); });

/** @param {import('playwright').BrowserType} art */
const starten = (art) => art === chromium
  ? chromium.launch(process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : { channel: 'chromium' })
  : art.launch();

test('fehlendeTooltips: meldet nur Bedienelemente ohne Tooltip, die keine Ausnahme sind', async () => {
  const b = await starten(chromium);
  try {
    const p = await b.newPage();
    await p.goto(url);
    await p.waitForSelector('body[data-bereit]');
    // nicht gemeldet: Knöpfe mit Tooltip (auch gesperrt, ohne id, im Code erzeugt, in Abschnitten), Link, Experiment
    // (geprüft im Bereich #tipprobe; die übrigen Karten der Testseite dienen anderen Tests)
    const imBereich = (/** @type {string[]} */ l) => l.filter((x) => x.includes('#tipprobe'));
    assert.deepEqual(imBereich(await fehlendeTooltips(p)), ['button in #tipprobe „Fehlt“']);
    assert.deepEqual(imBereich(await fehlendeTooltips(p, { ohne: ['[data-art="b"]'] })), []);
  } finally { await b.close(); }
});

for (const [name, art] of /** @type {const} */ ([['Chromium', chromium], ['Firefox', firefox], ['WebKit (Safari)', webkit]])) {
  test(`Tooltip an einem gesperrten Knopf mit der Maus: ${name}`, async (t) => {
    /** @type {import('playwright').Browser} */
    let b;
    try { b = await starten(art); } catch (e) {
      t.skip(`${name} lässt sich nicht starten: ${String(e).split('\n').slice(0, 4).join(' ')}`);
      return;
    }
    try {
      const p = await b.newPage();
      await p.goto(url);
      await p.waitForSelector('body[data-bereit]');
      const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await p.locator('#gesperrt').boundingBox());
      await p.mouse.move(box.x - 20, box.y - 20);
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 4 });
      await p.waitForFunction(() => document.getElementById('tip')?.hidden === false, null, { timeout: 3000 }).catch(() => {});
      assert.equal(await p.evaluate(() => document.getElementById('tip')?.hidden === false ? document.getElementById('tip')?.textContent : null), 'Tooltip des gesperrten Knopfs.');
    } finally { await b.close(); }
  });
}
