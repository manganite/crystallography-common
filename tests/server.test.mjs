// Statischer Server: liefert Dateien aus dem Ordner, aber nichts ausserhalb (auch keinen Nachbarordner).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { server } from '../tools/server.mjs';

// Rohe Anfrage (fetch würde ../ in der Adresse selbst auflösen)
/**
 * @param {number} port @param {string} pfad @param {boolean} [mitKopf]
 * @returns {Promise<{ status?: number, body: string, location?: string }>}
 */
const holen = (port, pfad, mitKopf = false) => new Promise((ok, fehler) => {
  const req = request({ host: '127.0.0.1', port, path: pfad }, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => ok(mitKopf ? { status: res.statusCode, body, location: res.headers.location } : { status: res.statusCode, body }));
  });
  req.on('error', fehler);
  req.end();
});

test('Server: Dateien im Ordner ja, ausserhalb und im Nachbarordner nein', async () => {
  const basis = mkdtempSync(join(tmpdir(), 'srv-'));
  const app = join(basis, 'app'), privat = join(basis, 'app-privat');
  mkdirSync(app); mkdirSync(privat);
  writeFileSync(join(app, 'index.html'), 'start');
  writeFileSync(join(privat, 'geheim.txt'), 'geheim');
  writeFileSync(join(basis, 'aussen.txt'), 'aussen');
  const srv = await server(app);
  const port = /** @type {import('node:net').AddressInfo} */ (srv.address()).port;
  try {
    assert.deepEqual(await holen(port, '/'), { status: 200, body: 'start' });
    for (const p of ['/%5c../app-privat/geheim.txt', '/../app-privat/geheim.txt', '/..%2fapp-privat/geheim.txt', '/%5c../aussen.txt', '/..%2f..%2fetc/passwd']) {
      const r = await holen(port, p);
      assert.notEqual(r.status, 200, p);
      assert.ok(!['geheim', 'aussen'].includes(r.body), p);
    }
  } finally {
    srv.close();
    rmSync(basis, { recursive: true, force: true });
  }
});

test('Server: Ordner liefern index.html, ohne Schrägstrich Umleitung', async () => {
  const basis = mkdtempSync(join(tmpdir(), 'srv-'));
  mkdirSync(join(basis, 'app'));
  writeFileSync(join(basis, 'index.html'), 'dach');
  writeFileSync(join(basis, 'app', 'index.html'), 'app');
  const srv = await server(basis);
  const port = /** @type {import('node:net').AddressInfo} */ (srv.address()).port;
  try {
    assert.deepEqual(await holen(port, '/'), { status: 200, body: 'dach' });
    assert.deepEqual(await holen(port, '/app/'), { status: 200, body: 'app' });
    assert.equal((await holen(port, '/app', true)).location, '/app/');
    const um = await holen(port, '/app?sw=1&blick=2', true);
    assert.equal(um.status, 301);
    assert.equal(um.location, '/app/?sw=1&blick=2');
    assert.equal((await holen(port, '/fehlt/')).status, 404);
  } finally {
    srv.close();
    rmSync(basis, { recursive: true, force: true });
  }
});

test('Server: ungültig kodierte Adresse ergibt 400, der Server läuft weiter (#62)', async () => {
  const basis = mkdtempSync(join(tmpdir(), 'srv-'));
  writeFileSync(join(basis, 'index.html'), 'start');
  const srv = await server(basis);
  const port = /** @type {import('node:net').AddressInfo} */ (srv.address()).port;
  try {
    for (const p of ['/%ZZ', '/%E0%A4%A', '/app/%']) assert.equal((await holen(port, p)).status, 400, p);
    assert.deepEqual(await holen(port, '/'), { status: 200, body: 'start' });
  } finally {
    srv.close();
    rmSync(basis, { recursive: true, force: true });
  }
});
