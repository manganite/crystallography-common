// Daten der Hilfeseite (Leitfaden Abschn. 5.3): Modi der App und ihre Anleitungen. Die Anleitungen sind die Erste
// Schritte, dazu die Experimente als Liste; Texte in js/hilfetexte.js, Mechanik in lib/common/js/hilfe-seite.js.
// Bilder: node tools/common/hilfe-bilder.mjs (schreibt hilfe/<Ablauf>-<Nr>.png), geprüft in tests/common.test.mjs.

import { ERSTE_SCHRITTE, ABLAEUFE } from './hilfetexte.js';

/** @import { HilfeDaten } from '../lib/common/js/hilfe-seite.js' */

/**
 * Modi: Kennung wie in hilfetexte.js, Name wie auf dem Tab, Link-Adresse, die ihn wählt (in einer App mit Modus in der
 * Adresse, z. B. `#m=b`). Die Vorlage führt den Modus nicht in der Adresse; ihr Modus B hat keine Erste Schritte und
 * fehlt hier deshalb. Die Adresse zeigt die App vor dem ersten Schritt (hier mit p2, der Schritt wählt p4mm).
 * @type {HilfeDaten}
 */
export const HILFE = {
  modi: [
    { id: 'a', name: 'Modus A', hash: '#g=p2' },
  ],
  ersteSchritte: ERSTE_SCHRITTE,
  experimente: ABLAEUFE,
};
