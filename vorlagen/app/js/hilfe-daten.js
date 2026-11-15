// Daten der Hilfeseite (Leitfaden Abschn. 5.3): Zweck, Modi, Bereiche zum Nachschlagen, Anleitungen, Experimente,
// typische Fragen. Gemeinsame Texte (Link, Speicher, offline, Bedienkonzepte der Familie) kommen aus
// lib/common/js/hilfe-gemeinsam.js; `ergaenzungen` hängt Text der App an, `ohne` lässt einen weg. Die Anleitungen sind die
// Erste Schritte und weitere (`anleitungen`, nur hier), die Experimente wie in der App. Texte der Erste Schritte und
// Experimente in js/hilfetexte.js, Mechanik in lib/common/js/hilfe-seite.js.
// Bilder: node tools/common/hilfe-bilder.mjs (schreibt hilfe/), geprüft in tests/common.test.mjs.

import { ERSTE_SCHRITTE, ABLAEUFE } from './hilfetexte.js';
import { KAPITEL } from './quiz-kapitel.js';

/** @import { HilfeDaten } from '../lib/common/js/hilfe-seite.js' */

/**
 * Modi: Kennung wie in hilfetexte.js, Name wie auf dem Tab, Link-Adresse, die ihn wählt (in einer App mit Modus in der
 * Adresse, z. B. `#m=b`), wozu er dient. Die Vorlage führt den Modus nicht in der Adresse; ihr Modus B hat keine Inhalte
 * und fehlt hier deshalb. Die Adresse zeigt die App vor dem ersten Schritt (hier mit p2, der Schritt wählt p4mm).
 * Bereiche: je Bereich ein Bild mit nummerierten Marken (Einträge mit `zeige`, in ihrer Reihenfolge); `id` eines Eintrags
 * ist ein Anker (auf der Seite `<Modus>-<id>`), z. B. für den Verweis aus dem ⓘ (`hilfe` in SECTIONS).
 * @type {HilfeDaten}
 */
export const HILFE = {
  zweck: '<p>Die Muster-App zeigt, wie eine App der Familie aufgebaut ist. In einer App steht hier in zwei, drei Sätzen, wozu sie dient.</p>',
  modi: [
    { id: 'a', name: 'Modus A', hash: '#g=p2', zweck: 'Eine Gruppe wählen und ihre Symmetrieelemente ansehen.' },
  ],
  ueberblick: {
    id: 'aufbau', titel: 'Aufbau der App', ausschnitt: 'body',
    eintraege: [
      { zeige: 'header.top', name: 'Kopfzeile', text: 'Modi, Skript, Quiz, Link kopieren und die Hilfe („?“).' },
      { zeige: '#inhalt > .side', name: 'Seitenleiste', text: 'Was dargestellt wird: Gruppe, Gitter, Darstellung.' },
      { zeige: '#inhalt .p-a', name: 'Tafel A', text: 'Zeichnung mit Werkzeugen im Kopf.' },
      { zeige: '#inhalt .p-b', name: 'Tafel B', text: 'Zweite Darstellung desselben Zustands.' },
      { zeige: '#info', name: 'Kenndaten', text: 'Was die Darstellung zeigt, als Text.' },
    ],
  },
  bereiche: [
    {
      id: 'seitenleiste', modus: 'a', titel: 'Seitenleiste',
      eintraege: [
        { zeige: '#sec-experimente > summary', name: 'Experimente', text: 'Kleine Versuche zum Vermuten und Ausprobieren.' },
        { id: 'gruppe', zeige: '#ctl-gruppe > h2', name: 'Ebenengruppe', text: 'Gruppe wählen und Symmetrieelemente, Motiv und Zelle ein- oder ausblenden.' },
        { id: 'gitter', zeige: '#sec-gitter > summary', name: 'Gitter', text: 'Achsenverhältnis des Gitters.' },
        { id: 'darstellung', zeige: '#sec-view > summary', name: 'Darstellung', text: 'Farben und weitere Anzeigen.' },
        { zeige: '#reset-alles', name: 'Alle Einstellungen zurücksetzen', text: 'Startzustand; Quiz und Experimente bleiben.' },
      ],
    },
    {
      id: 'tafel-a', modus: 'a', titel: 'Tafel A', text: '<p>Die Zeichnung der gewählten Gruppe.</p>',
      eintraege: [
        { zeige: '#v-lupe', name: 'Lupe', text: 'Schalter: vergrössert die Zeichnung.' },
        { zeige: '#export-a', name: 'Export', text: 'Bild kopieren oder speichern.' },
        { name: 'Legende', text: 'Unter der Zeichnung: ihre Zeichen und Farben.' },
      ],
    },
  ],
  ersteSchritte: ERSTE_SCHRITTE,
  experimente: ABLAEUFE,
  fragen: [
    { id: 'gesperrt', frage: 'Warum ist „Beschriftung“ gesperrt?', antwort: '<p>Sie gilt dem Motiv in allgemeiner Lage; ohne Motiv gibt es nichts zu beschriften. Der Grund steht unter dem Schalter.</p>', app: '#g=p2' },
  ],
  ergaenzungen: { export: '<p>In der Muster-App exportiert nur Tafel A.</p>' },
  // die Vorlage gehört nicht zur Familie; ihre relativen Links auf die Apps führten ins Leere
  ohne: ['familie'],
  repo: 'manganite/crystallography-common',
  kapitel: KAPITEL,
};
