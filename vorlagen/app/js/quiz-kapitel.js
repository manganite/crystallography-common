// Kapitel des Skripts für das Quiz (Auswahl, Stand, Links ins Skript) und die Liste der Experimente (Gliederung,
// #107), dazu der Name des Speichers im Browser.

/** @import { Kapitel } from '../lib/common/js/quiz-core.js' */

/** Kapitel des Skripts mit Anker (skript.html#…); kurz: Name auf den Auswahlknöpfen des Quiz und über den
 * Experimenten eines Kapitels. @type {Kapitel[]} */
export const KAPITEL = [
  { nr: 1, titel: 'Ein Kapitel des Grundstoffs', kurz: 'Grundstoff', anker: 'kapitel1' },
  { nr: 2, titel: 'Ein Vertiefungskapitel', kurz: 'Vertiefung', anker: 'kapitel2' },
];

/** Präfix der Einträge im Browser (<Präfix>-v1, -entwurf, -lauf). Einmal festlegen, nicht ohne Grund ändern (Leitfaden Abschn. 7, 8). */
export const SPEICHER = 'muster-quiz';
