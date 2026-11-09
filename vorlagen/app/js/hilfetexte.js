// Texte der Hilfen: Tooltips (Laptop) und ⓘ-Erklärungen je Abschnitt (Touch-Geräte).
// Die Mechanik steht in lib/common/js/help.js. Begriffe wie im Skript.

/** @import { Abschnitt } from '../lib/common/js/help.js' */
/** @import { Ablauf, Erzeugt } from '../lib/common/js/ablauf.js' */

/**
 * Tooltip-Texte je Element-ID, je ein kurzer Satz (Leitfaden Abschn. 5.3; höchstens TIP_MAX Zeichen, geprüft in
 * tests/common.test.mjs). Jedes Bedienelement hat einen, ausser selbsterklärenden Links, Schliessen „×“,
 * Export-Knöpfen mit Text und Köpfen einklappbarer Abschnitte. Bei Eingabefeldern erscheint der Tooltip an der ganzen Zeile.
 * @type {Record<string, string>}
 */
export const TIPS = {
  'copy-link': 'Link auf genau diese Ansicht in die Zwischenablage kopieren, z. B. für Folien.',
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
  'reset-alles': 'Alle Einstellungen löschen und die App neu starten; Quiz und Experimente behalten ihren Stand.',
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
 * Erste Schritte (lib/common/js/ablauf.js, Leitfaden Abschn. 5.3): je Modus ein kurzer Ablauf zur Bedienung,
 * Schritte ohne Vermutung; der letzte verweist auf die Experimente. Sie sind zugleich die Anleitungen der Hilfeseite
 * (js/hilfe-daten.js): zeige = Selektor des Bedienelements, das ihr Bild markiert (tools/common/hilfe-bilder.mjs).
 * @type {Ablauf[]}
 */
export const ERSTE_SCHRITTE = [
  {
    id: 'einstieg-a', modus: 'a', titel: 'Erste Schritte',
    schritte: [
      { frage: '<b>Gruppe wählen.</b> Ein Knopf je Gruppe, geordnet nach Kristallsystem.', handlung: { text: '<i>p</i>4<i>mm</i> wählen', hash: '#g=p4mm' }, zeige: '#picker' },
      { frage: '<b>Darstellung ändern.</b> Weitere Optionen liegen in den eingeklappten Abschnitten.', handlung: { text: 'Darstellung öffnen', aktion: 'darstellung' }, zeige: '#sec-view > summary' },
      { frage: '<b>Ausprobieren.</b> Unter „Experimente“ stehen kleine Versuche: erst vermuten, dann ausprobieren.', handlung: { text: 'Experimente öffnen', aktion: 'experimente' }, zeige: '#sec-experimente > summary' },
    ],
  },
];

/**
 * Lernexperimente im Abschnitt „Experimente“ (lib/common/js/ablauf.js, Leitfaden Abschn. 5.3): je Modus einige,
 * je Schritt Frage, Vermutung, Handlung (Link-Adresse oder Aktion der App), Beobachtung, Erklärung. Ein Ablauf mit
 * params und make wird erzeugt (#92): je Parameter eine Aufgabe, am Ende „Neue Aufgabe“. In einer App prüft ein
 * Test die Aussage für jeden Parameter gegen ihre Daten; die Reihenfolge der Antworten wechselt mit dem Parameter.
 * kapitel: Nummer im Skript wie im Quiz (js/quiz-kapitel.js); ab 6 Experimenten je Modus gliedert die Liste danach (#107).
 * @type {(Ablauf | Erzeugt)[]}
 */
export const ABLAEUFE = [
  {
    id: 'spiegel', modus: 'a', kapitel: 1, titel: 'Spiegellinien zählen',
    schritte: [
      { frage: 'Wie viele Spiegellinien gehen durch einen 6-zähligen Drehpunkt in <i>p</i>6<i>mm</i>?', vermutung: ['drei', 'sechs'], richtig: 1,
        handlung: { text: '<i>p</i>6<i>mm</i> wählen', hash: '#g=p6mm' },
        beobachtung: 'Sechs, im Abstand von 30°.', erklaerung: 'Das Symbol nennt zwei Sorten: <i>m</i> an zweiter und an dritter Stelle.' },
    ],
  },
  {
    // erzeugt: n-zähliger Drehpunkt in pnmm, durch ihn gehen n Spiegellinien
    id: 'spiegel-n', modus: 'a', kapitel: 1, titel: 'Spiegellinien durch einen Drehpunkt',
    params: () => ['2', '4', '6'],
    make: (n) => {
      // Antworten je Parameter in anderer Reihenfolge, damit die richtige nicht immer an derselben Stelle steht
      const k = Number(n), alle = [k / 2, k, 2 * k], dreh = ['2', '4', '6'].indexOf(n);
      const vermutung = [...alle.slice(dreh), ...alle.slice(0, dreh)].map(String);
      return [{
      frage: `Wie viele Spiegellinien gehen durch einen ${n}-zähligen Drehpunkt in <i>p</i>${n}<i>mm</i>?`,
      vermutung, richtig: vermutung.indexOf(n),
      handlung: { text: `<i>p</i>${n}<i>mm</i> wählen`, hash: `#g=p${n}mm` },
      beobachtung: `${n} Spiegellinien.`, erklaerung: `Die Spiegelung erzeugt mit der ${n}-zähligen Drehung ${n} Spiegellinien.`,
      }];
    },
  },
];
