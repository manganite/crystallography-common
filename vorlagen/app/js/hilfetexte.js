// Texte der Hilfen: Tooltips (Laptop) und ⓘ-Erklärungen je Abschnitt (Touch-Geräte).
// Die Mechanik steht in lib/common/js/help.js. Begriffe wie im Skript.

/** @import { Abschnitt } from '../lib/common/js/help.js' */
/** @import { Ablauf } from '../lib/common/js/ablauf.js' */

/** Tooltip-Texte je Element-ID. Bei Eingabefeldern erscheint der Tooltip an der ganzen Zeile. @type {Record<string, string>} */
export const TIPS = {
  'tab-a': 'Erster Modus der App.',
  'tab-b': 'Zweiter Modus der App.',
  'opt-elemente': 'Symmetrieelemente der gewählten Gruppe einblenden.',
  'opt-motiv': 'Ein Motiv in allgemeiner Lage, auf das alle Operationen der Gruppe wirken.',
  'opt-zelle': 'Die Elementarzelle des Gitters hervorheben.',
  'opt-beschr': 'Die Bilder des Motivs beschriften.',
  'lat-ba': 'Verhältnis der Gitterkonstanten b/a.',
  'v-farben': 'Symmetrieelemente in der Farbe ihrer Blickrichtung zeichnen (Positionen im Hermann-Mauguin-Symbol).',
  'v-achsen': 'Gitterachsen a und b einblenden.',
  'v-wahl': 'Beispiel für ein Auswahlfeld.',
  'reset-alles': 'Alle Einstellungen und den gespeicherten Zustand löschen und die App neu starten (der Fortschritt im Quiz bleibt).',
};

/** ⓘ-Erklärungen: je Abschnitt ein Einleitungssatz und die Elemente, deren Texte gezeigt werden. @type {Abschnitt[]} */
export const SECTIONS = [
  { heading: '#ctl-gruppe > h2', intro: 'Gruppe antippen: Die Tafeln zeigen ihre Symmetrieelemente.', ids: ['opt-elemente', 'opt-motiv', 'opt-zelle', 'opt-beschr'] },
  { heading: '#sec-gitter > summary', intro: 'Alles in diesem Abschnitt ändert das Gitter.', ids: ['lat-ba'] },
  { heading: '#sec-view > summary', ids: ['v-farben', 'v-achsen', 'v-wahl'] },
];

/** Beschriftung in der ⓘ-Erklärung, wo der Text des Elements nicht passt. @type {Record<string, string>} */
export const LABELS = {};

/**
 * Lernexperimente der Karte „Erste Schritte“ (lib/common/js/ablauf.js, Leitfaden Abschn. 5.3): je Modus wenige,
 * je Schritt Frage, Vermutung, Handlung (Link-Adresse oder Aktion der App), Beobachtung, Erklärung.
 * @type {Ablauf[]}
 */
export const ABLAEUFE = [
  {
    id: 'gruppe', modus: 'a', titel: 'Eine Gruppe wählen',
    schritte: [
      { frage: 'Wie viele Spiegellinien gehen durch einen 6-zähligen Drehpunkt in <i>p</i>6<i>mm</i>?', vermutung: ['drei', 'sechs'], richtig: 1,
        handlung: { text: '<i>p</i>6<i>mm</i> wählen', hash: '#g=p6mm' },
        beobachtung: 'Sechs, im Abstand von 30°.', erklaerung: 'Das Symbol nennt zwei Sorten: <i>m</i> an zweiter und an dritter Stelle.' },
      { frage: 'Wo liegen weitere Optionen?', handlung: { text: 'Darstellung öffnen', aktion: 'darstellung' },
        beobachtung: 'In den eingeklappten Abschnitten der Seitenleiste.' },
    ],
  },
];
