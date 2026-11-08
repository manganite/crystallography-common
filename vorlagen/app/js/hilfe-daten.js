// Daten der Hilfeseite (Leitfaden Abschn. 5.3): Modi der App und ihre Anleitungen. Die Anleitungen sind die Erste
// Schritte, dazu die Experimente als Liste; Texte in js/hilfetexte.js, Mechanik in lib/common/js/hilfe-seite.js.
// Bilder: node tools/common/hilfe-bilder.mjs (schreibt hilfe/<Ablauf>-<Nr>.png), geprüft in tests/common.test.mjs.

import { ERSTE_SCHRITTE, ABLAEUFE } from './hilfetexte.js';

/** @import { HilfeDaten } from '../lib/common/js/hilfe-seite.js' */

/** Modus: Kennung wie in hilfetexte.js, Name wie auf dem Tab, Link-Adresse, die ihn wählt. @type {HilfeDaten} */
export const HILFE = {
  modi: [
    { id: 'a', name: 'Modus A', hash: '#g=p4mm' },
    { id: 'b', name: 'Modus B', hash: '#g=p4mm' },
  ],
  ersteSchritte: ERSTE_SCHRITTE,
  experimente: ABLAEUFE,
};
