// Skript: Jeder Verweis „Abschnitt x.y“ bzw. „Abschn. x.y“ zeigt auf einen Abschnitt, den es gibt (#85). Die Nummern
// vergibt abschnitte() aus lib/common/js/skript-kern.js beim Laden; Zitate anderer Werke („Werk, Abschn. x.y“, mit
// Seitenangabe, in .quellen oder als Link) zählen nicht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pruefeAbschnittsverweise } from '../lib/common/js/skript-kern.js';

const html = readFileSync(new URL('../skript.html', import.meta.url), 'utf8');

test('Verweise auf Abschnitte treffen einen Abschnitt', () => {
  const { befunde, verweise } = pruefeAbschnittsverweise(html);
  assert.deepEqual(befunde, []);
  assert.ok(verweise > 0, 'keine Verweise gefunden; prüft der Test das Skript?');
});
