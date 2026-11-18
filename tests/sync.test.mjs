// Übernahme in eine App: Kopie, Manifest, Prüfung erkennt Änderungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, appendFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sync, syncKern, versionVon, MANIFEST, KERN_MANIFEST } from '../tools/sync.mjs';
import { pruefen } from '../tools/check.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

test('sync legt lib/common und tools/common mit Manifest an; check findet Änderungen', () => {
  const app = mkdtempSync(join(tmpdir(), 'app-'));
  try {
    writeFileSync(join(app, 'index.html'), '<!doctype html>');
    const { manifest } = sync(ROOT, app);
    assert.equal(manifest.version, versionVon(ROOT));
    assert.ok('lib/common/css/base.css' in manifest.files);
    assert.ok('lib/common/js/quiz-seite.js' in manifest.files);
    assert.ok('lib/common/js/typen.js' in manifest.files);
    assert.ok('tools/common/check.mjs' in manifest.files);
    assert.deepEqual(JSON.parse(readFileSync(join(app, MANIFEST), 'utf8')).files, manifest.files);
    assert.deepEqual(pruefen(app), []);
    appendFileSync(join(app, 'lib/common/css/base.css'), '\n/* geändert */');
    writeFileSync(join(app, 'lib/common/js/neu.js'), '');
    assert.deepEqual(pruefen(app).sort(), ['nicht im Manifest: lib/common/js/neu.js', 'verändert: lib/common/css/base.css']);
    // erneut übernehmen stellt den Stand wieder her
    sync(ROOT, app);
    assert.deepEqual(pruefen(app), []);
  } finally {
    rmSync(app, { recursive: true, force: true });
  }
});

test('Version: semver, gleich in js/version.js und CHANGELOG.md', () => {
  const v = versionVon(ROOT);
  assert.match(v, /^\d+\.\d+\.\d+$/);
  assert.match(readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf8'), new RegExp(`^## \\[${v.replace(/\./g, '\\.')}\\] - \\d{4}-\\d{2}-\\d{2}$`, 'm'));
});

/** Ein nachgebautes symcrys: package/ mit package.json, LICENSE und dist/ (wie npm pack es ablegt). */
function symcrysAttrappe(version = '0.2.0', gebaut = version) {
  const dir = mkdtempSync(join(tmpdir(), 'symcrys-quelle-'));
  const pkg = join(dir, 'package');
  mkdirSync(join(pkg, 'dist', 'pointGroups'), { recursive: true });
  writeFileSync(join(pkg, 'package.json'), JSON.stringify({ name: 'symcrys', version }));
  writeFileSync(join(pkg, 'LICENSE'), 'MIT License');
  writeFileSync(join(pkg, 'dist', 'version.js'), `export const VERSION = '${gebaut}';\n`);
  writeFileSync(join(pkg, 'dist', 'index.js'), "export * from './pointGroups/a.js';\n//# sourceMappingURL=index.js.map\n");
  writeFileSync(join(pkg, 'dist', 'index.js.map'), '{}');
  writeFileSync(join(pkg, 'dist', 'index.d.ts'), 'export {};\n');
  writeFileSync(join(pkg, 'dist', 'index.d.ts.map'), '{}');
  writeFileSync(join(pkg, 'dist', 'pointGroups', 'a.js'), 'export const A = 1;\n');
  return { dir, pkg };
}

test('syncKern übernimmt .js und .d.ts aus dist/ nach lib/kern/ mit Manifest; check findet Änderungen', () => {
  const app = mkdtempSync(join(tmpdir(), 'app-'));
  const { dir, pkg } = symcrysAttrappe();
  try {
    writeFileSync(join(app, 'index.html'), '<!doctype html>');
    assert.deepEqual(pruefen(app).filter((f) => f.includes('lib/kern')), []); // ohne Kern nichts zu prüfen
    const { manifest, warn } = syncKern(pkg, app);
    assert.equal(manifest.name, 'symcrys');
    assert.equal(manifest.version, '0.2.0');
    assert.equal(manifest.quelle, 'Checkout');
    assert.deepEqual(Object.keys(manifest.files).sort(), [
      'lib/kern/LICENSE.txt',
      'lib/kern/index.d.ts',
      'lib/kern/index.js',
      'lib/kern/pointGroups/a.js',
      'lib/kern/version.js',
    ]);
    assert.ok(warn.some((w) => w.includes('Release-Tag v0.2.0'))); // kein git-Checkout
    assert.deepEqual(JSON.parse(readFileSync(join(app, KERN_MANIFEST), 'utf8')).files, manifest.files);
    const kern = (/** @type {string[]} */ f) => f.filter((x) => x.includes('lib/kern'));
    assert.deepEqual(kern(pruefen(app)), []);
    appendFileSync(join(app, 'lib/kern/index.js'), '// geändert');
    writeFileSync(join(app, 'lib/kern/neu.js'), '');
    assert.deepEqual(kern(pruefen(app)).sort(), ['nicht im Manifest: lib/kern/neu.js', 'verändert: lib/kern/index.js']);
    rmSync(join(app, KERN_MANIFEST));
    assert.deepEqual(kern(pruefen(app)), [`${KERN_MANIFEST} fehlt`]);
  } finally {
    rmSync(app, { recursive: true, force: true });
    rmSync(dir, { recursive: true, force: true });
  }
});

test('syncKern nimmt das Paket symcrys-X.Y.Z.tgz und prüft Name und gebaute Version', () => {
  const app = mkdtempSync(join(tmpdir(), 'app-'));
  const { dir, pkg } = symcrysAttrappe('0.3.0');
  const falsch = symcrysAttrappe('0.3.0', '0.2.0');
  try {
    writeFileSync(join(app, 'index.html'), '<!doctype html>');
    const tgz = join(dir, 'symcrys-0.3.0.tgz');
    execFileSync('tar', ['-czf', tgz, '-C', dir, 'package']);
    const { manifest, warn } = syncKern(tgz, app);
    assert.deepEqual([manifest.version, manifest.tag, manifest.quelle], ['0.3.0', 'v0.3.0', 'symcrys-0.3.0.tgz']);
    assert.deepEqual(warn, []);
    assert.ok(existsSync(join(app, 'lib/kern/pointGroups/a.js')));
    assert.ok(!existsSync(join(app, 'lib/kern/index.js.map')));
    assert.ok(syncKern(falsch.pkg, app).warn.some((w) => w.includes('aus Version 0.2.0 gebaut')));
    writeFileSync(join(pkg, 'package.json'), JSON.stringify({ name: 'anderes', version: '1.0.0' }));
    assert.throws(() => syncKern(pkg, app), /nicht symcrys/);
  } finally {
    rmSync(app, { recursive: true, force: true });
    rmSync(dir, { recursive: true, force: true });
    rmSync(falsch.dir, { recursive: true, force: true });
  }
});
