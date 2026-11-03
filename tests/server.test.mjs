// Statischer Server: liefert Dateien aus dem Ordner, aber nichts ausserhalb (auch keinen Nachbarordner).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { request } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { server } from '../tools/server.mjs';

// Rohe Anfrage (fetch würde ../ in der Adresse selbst auflösen)
const holen = (port, pfad) => new Promise((ok, fehler) => {
  const req = request({ host: '127.0.0.1', port, path: pfad }, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => ok({ status: res.statusCode, body }));
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
  const port = srv.address().port;
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
  const port = srv.address().port;
  try {
    assert.deepEqual(await holen(port, '/'), { status: 200, body: 'dach' });
    assert.deepEqual(await holen(port, '/app/'), { status: 200, body: 'app' });
    assert.equal((await holen(port, '/app')).status, 301);
    assert.equal((await holen(port, '/fehlt/')).status, 404);
  } finally {
    srv.close();
    rmSync(basis, { recursive: true, force: true });
  }
});
