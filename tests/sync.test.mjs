// Übernahme in eine App: Kopie, Manifest, Prüfung erkennt Änderungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, appendFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sync, versionVon, MANIFEST } from '../tools/sync.mjs';
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
