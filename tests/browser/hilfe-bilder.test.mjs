// Bildwerkzeug der Hilfeseite (tools/hilfe-bilder.mjs, #114) an der Vorlage: alle Bilder entstehen ohne Fehler und
// ohne Nummer in der Notlösung (auch das Übersichtsbild, dessen Bausteine am Rand und dicht nebeneinander liegen), und
// `vorher` (Klick, Ziehen) wirkt auf das Bild. Läuft in der CI im Job „browser“ (Kopie der Vorlage in einem
// temporären Ordner, die Vorlage selbst bleibt unverändert).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sync } from '../../tools/sync.mjs';
import { hilfeBilderErzeugen } from '../../tools/hilfe-bilder.mjs';

/** @import { HilfeDaten } from '../../js/hilfe-seite.js' */

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('hilfe-bilder: Vorlage ohne Fehler, Übersicht ohne Notlösung, vorher wirkt', { timeout: 300000 }, async () => {
  const ordner = mkdtempSync(join(tmpdir(), 'hilfe-bilder-'));
  try {
    const app = join(ordner, 'app');
    cpSync(join(ROOT, 'vorlagen/app'), app, { recursive: true });
    sync(ROOT, app);
    /** @type {{ HILFE: HilfeDaten }} */
    const { HILFE } = await import(pathToFileURL(join(app, 'js/hilfe-daten.js')).href);
    // zwei Schritte mit demselben Element, der zweite mit `vorher`: Lupe einschalten und über Tafel A ziehen
    const schritt = { frage: 'Lupe', zeige: '#v-lupe' };
    /** @type {HilfeDaten} */
    const daten = { ...HILFE, anleitungen: [...(HILFE.anleitungen ?? []), { id: 'probe', titel: 'Probe', schritte: [
      schritt,
      { ...schritt, vorher: [{ klick: '#v-lupe' }, { ziehen: '#bild-a', punkte: [[0.3, 0.3], [0.6, 0.6]] }] },
    ] }] };
    const { dateien, fehler } = await hilfeBilderErzeugen({ root: app, daten });
    assert.deepEqual(fehler, []);
    assert.ok(dateien.includes('aufbau.png') && dateien.includes('probe-1.png') && dateien.includes('probe-2.png'), dateien.join(', '));
    for (const f of dateien) assert.ok(statSync(join(app, 'hilfe', f)).size > 1000, f);
    assert.notDeepEqual(readFileSync(join(app, 'hilfe/probe-2.png')), readFileSync(join(app, 'hilfe/probe-1.png')), 'vorher ändert das Bild (Lupe gewählt)');
  } finally {
    rmSync(ordner, { recursive: true, force: true });
  }
});
