# crystallography-common

[![CI](https://github.com/manganite/crystallography-common/actions/workflows/ci.yml/badge.svg)](https://github.com/manganite/crystallography-common/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/manganite/crystallography-common)](https://github.com/manganite/crystallography-common/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Gemeinsame Grundlage einer Familie von Lern-Apps zur Kristallographie, entstanden aus der Vorlesung Kristallographie an der ETH Zürich. Jede App besteht aus der App selbst, einem Skript und einem Quiz; alle Apps sollen für Studierende als Geschwister erkennbar sein: gleiches Layout, gleiche Farben, gleiche Bedienung, gleicher Aufbau von Skript und Quiz.

| App | Inhalt | Repository |
|---|---|---|
| [Stereographische Projektion](https://manganite.github.io/stereography/) | Punktgruppen, Kristallformen, Stereogramme | [manganite/stereography](https://github.com/manganite/stereography) |
| [Symmetrie in der Ebene](https://manganite.github.io/plane-groups/) | Gitter, Elementarzelle, 17 Ebenengruppen | [manganite/plane-groups](https://github.com/manganite/plane-groups) |
| 3D (geplant) | Raumgitter und Raumgruppen | – |

Wie die Apps aussehen und sich verhalten sollen, steht im **[Leitfaden](LEITFADEN.md)**. Dieses Repository enthält den Teil davon, der sich als Code teilen lässt.

## Inhalt

| Ordner | Datei | Zweck |
|---|---|---|
| `css/` | `base.css` | Farben hell/dunkel (inklusive der Farben für Symmetrieelemente), Schriften, Grundtypografie, Kopfzeile |
| | `app.css` | Werkbank der App: Anordnung der Tafeln, Seitenleiste mit Karten, Bedienelemente, einklappbare Abschnitte, Tafeln, Legende, Kenndaten, Erste Schritte, Tooltip, ⓘ-Erklärungen, Telefon und Touch |
| | `skript.css` | Skript: Inhaltsverzeichnis, Lesebreite, Kästen (Lernziele, Merke, Zusammenfassung, Grundlagen, Vertiefung, In der App), Vertiefungskapitel, Abbildungsrahmen, Tabellen, Quellen |
| | `quiz.css` | Quiz: Auswahl (Stufen, Kapitel, Anzahl), Frage, Antworten, Rückmeldung, Auswertung |
| | `hilfe.css` | Hilfeseite (nach `skript.css`): Bereiche mit nummerierten Bildern, Anleitungen mit Bildern der Bedienung, Liste der Experimente, Fragen |
| `fonts/` | | IBM Plex Sans und Mono, Source Serif 4 (selbst gehostet, SIL Open Font License) |
| `js/` | `format.js` | Hermann-Mauguin-Symbole und Millersche Indizes mit Querstrich |
| | `ablauf.js` | Geführte Abläufe: Lernexperimente im Abschnitt „Experimente“ (Frage, Vermutung, Handlung, Beobachtung, Vorher/Nachher, Stand wie im Quiz, erzeugte Varianten) und kurze Erste Schritte (`liste: false`), Verzweigung für die Bestimmung; ab 6 Experimenten je Modus und im Schnitt 2 je Kapitel nach Kapiteln gegliedert (`kapitel`); `pruefeAblaeufe` für die Tests der App |
| | `help.js` | Mechanik der Hilfen: Tooltips (Laptop), ⓘ-Erklärungen je Abschnitt (alle Geräte); Texte liefert die App |
| | `hilfe-seite.js` | Hilfeseite als Anleitung: Überblick, Bedienkonzepte, je Modus Bereiche zum Nachschlagen, Anleitungen und Experimente (mit „In der App ausprobieren“, `?experiment=<id>`, in der App `experimentAusAdresse`), typische Fragen, Link und Geräte; `pruefeHilfe` und `hilfeAnker` für die Tests der App |
| | `hilfe-gemeinsam.js` | Gemeinsame Texte der Hilfeseite (Daten): Teile, Familie, Bedienkonzepte, Link, Speicher, offline, Export, Geräte, Tastatur |
| | `quiz-core.js` | Quiz-Logik ohne Seite: Kandidaten, Ziehen nach Stufen und Vorrang, Mischen, Auswerten, Fortschritt |
| | `quiz-seite.js` | Quiz-Seite: Auswahl, Fragen mit sofortiger Rückmeldung, Auswertung, Fortschritt im Browser |
| | `skript-kern.js` | Skript: Abschnittsnummern und Verweise als Links (`abschnitte`, für die Tests `pruefeAbschnittsverweise`), Inhaltsverzeichnis mit Kennzeichnung der Vertiefungen, „In der App öffnen“, Nachladen beim Hineinscrollen, Querstriche in SVG-Text |
| | `seite.js` | Elemente der Seite mit Prüfung der Art (nach ID `$`, `eingabe`, `auswahl`, `knopf`, `abschnitt`, `grafik`, `nachId`; nach Selektor `element`, `elemente`), Versionsnummer eintragen, „Alle Einstellungen zurücksetzen“ (`alleEinstellungenZuruecksetzen`, Präfix der App), Offline-Betrieb (Service Worker), Bildexport als Knopf mit Menü (`exportMenue`, mit `herunterladen` und `inZwischenablage`) |
| | `version.js` | Version dieses Repositories |
| | `typen.js` | Gemeinsame Typen für die Typprüfung, ohne Laufzeitcode: Vektoren, Matrizen und gekennzeichnete Typen (Richtung/Normale, Grad/Bogenmass, fraktional/kartesisch). Die Typen des Quiz stehen in `quiz-core.js`. |
| `tools/` | `sync.mjs` | Kopie mit fester Version in eine App übernehmen; mit `--kern` den Rechenkern symcrys (unten) |
| | `check.mjs` | Kopien in einer App gegen ihr Manifest prüfen (`lib/common/`, `tools/common/`, `lib/kern/`) |
| | `moodle.mjs` | Quizfragen als Moodle-XML |
| | `skript-pdf.mjs` | Skript als PDF (A4) mit Playwright |
| | `hilfe-bilder.mjs` | Bilder der Hilfeseite mit Playwright: Ausschnitt der App je Schritt einer Anleitung mit `zeige` (Bedienelement umrahmt) und je Bereich zum Nachschlagen (Elemente nummeriert) (in der App `node tools/common/hilfe-bilder.mjs`) |
| | `tooltips-pruefen.mjs` | Für die Browserläufe der Apps: sichtbare Bedienelemente ohne Tooltip, auch ohne `id` und im Code erzeugte (`fehlendeTooltips`, Ausnahmen nach Leitfaden 5.3) |
| | `kontraste.mjs` | Kontraste der gerenderten Seiten nach WCAG 2.2 messen (unten) |
| | `server.mjs` | kleiner statischer Webserver für Werkzeuge und Tests; direkt gestartet bedient er den Arbeitsordner wie GitHub Pages |
| `vorlagen/` | | Ausgangspunkt für eine neue App (Seiten, Service Worker, Workflows, Tests) |
| `fragenliste/` | `extract.mjs`, `vorlage.html` | Gemeinsame Fragenliste aller Apps (Artifact in claude.ai): Fragen aus `tools/quiz-quelle.mjs` jeder App, Prüfung der Entwürfe, Rückmeldungen. Wird nicht in die Apps kopiert. |
| (oberste Ebene) | `kristallographie.code-workspace` | VS-Code-Arbeitsbereich mit allen Repositories der Familie |

Nicht hier, sondern im Rechenkern [symcrys](https://github.com/manganite/symcrys) bzw. in den Apps: alles Fachliche (Gruppen, Gitter, Formen), die Abbildungen, die Grösse der Darstellung in den Tafeln (und eine abweichende Anordnung), Texte der Hilfen, Fragen und Kapitel.

## Einbinden in eine App

Die Apps haben keinen Build-Schritt. Sie enthalten eine **Kopie mit fester Version**:

- `lib/common/` mit `css/`, `js/`, `fonts/` (wird mit der App veröffentlicht und offline vorgehalten)
- `tools/common/` mit den Werkzeugen (nur für die Entwicklung)
- `lib/common/MANIFEST.json` mit Version, Tag, Commit und einer Prüfsumme je Datei

So bleibt jede App eigenständig veröffentlichbar und offline nutzbar. Eine Änderung hier erreicht eine App erst, wenn sie die neue Version übernimmt und selbst ein Release macht.

### Neue Version übernehmen

```bash
cd crystallography-common
git fetch --tags && git checkout v0.23.0     # gewünschter Release-Tag
cd ../stereography
node tools/common/sync.mjs ../crystallography-common
node --test tests/*.test.mjs                 # u. a. tests/common.test.mjs prüft die Kopie
```

Das Werkzeug warnt, wenn der Stand kein Release-Tag ist oder ungespeicherte Änderungen hat. Die Kopie in der App wird nie von Hand geändert; `tests/common.test.mjs` schlägt sonst fehl. Änderungen gehören in dieses Repository.

### Rechenkern symcrys

Die Berechnungen (Gruppen, Aufstellungen, Symbole, Eigenschaften, Symmetrieelemente) liegen im eigenen Projekt [symcrys](https://github.com/manganite/symcrys), englisch und in TypeScript (#99). Eine App bindet es wie die gemeinsamen Dateien als **Kopie mit fester Version** ein:

- `lib/kern/` mit den JavaScript-Dateien und Typen (`.js`, `.d.ts`) aus `dist/` eines Release von symcrys und dessen Lizenz (`LICENSE.txt`); wird mit der App veröffentlicht, die `.js` hält der Service Worker offline vor, die `.d.ts` braucht nur die Typprüfung
- `lib/kern/MANIFEST.json` mit Version, Tag, Herkunft und einer Prüfsumme je Datei

```bash
cd stereography
node tools/common/sync.mjs --kern ../symcrys-0.2.0.tgz   # Paket aus dem Release von symcrys auf GitHub
# oder aus einem Checkout:  cd ../symcrys && git checkout v0.2.0 && npm ci && npm run build && cd ../stereography
#                           node tools/common/sync.mjs --kern ../symcrys
node --test tests/*.test.mjs                 # tests/common.test.mjs prüft auch diese Kopie
```

```js
import { operations, symmetryDirections } from '../lib/kern/index.js';
```

Die App ruft symcrys mit seinen englischen Namen auf, ohne Übersetzungsschicht; die Typprüfung (`checkJs`) liest die `.d.ts` neben `index.js`. Source-Maps kommen nicht mit, weil `src/` von symcrys nicht kopiert wird. Das Werkzeug warnt bei einem Checkout, der nicht der Release-Tag ist, ungespeicherte Änderungen hat oder dessen `dist/` aus einer anderen Version gebaut ist. symcrys kennt weder dieses Repository noch die Apps.

### Seiten einer App

```html
<link rel="stylesheet" href="lib/common/fonts/fonts.css">
<link rel="stylesheet" href="lib/common/css/base.css">
<link rel="stylesheet" href="lib/common/css/app.css">   <!-- bzw. skript.css, quiz.css -->
<style>/* nur was diese App betrifft */</style>
```

```js
import { initHelp } from '../lib/common/js/help.js';
import { initQuiz } from '../lib/common/js/quiz-seite.js';
import { abschnitte, appLink, nachladen, querstriche, inhaltsverzeichnis } from '../lib/common/js/skript-kern.js';
import { versionEintragen, offline } from '../lib/common/js/seite.js';
```

Eine neue App beginnt mit den Dateien aus [`vorlagen/`](vorlagen/README.md).

## Entwicklung

Ohne Abhängigkeiten; Tests mit Node 22:

```bash
node --test tests/*.test.mjs
```

Browsertests (`tests/browser/`, CI-Job `browser`) prüfen, was nur im Browser prüfbar ist, z. B. Tooltips bei Maus, Tastatur und Touchscreen; sie brauchen Playwright mit Chromium (Pakete wie unten, dazu einmal `npx playwright install chromium`; mit `CHROMIUM_PFAD=<Pfad>` ein vorhandener Chrome):

```bash
node --test tests/browser/*.test.mjs
```

Typprüfung mit TypeScript über JSDoc-Typen (`tsconfig.json`, strikt) und ESLint (`eslint.config.mjs`, gemeinsame Regeln in `tools/eslint-basis.mjs`); Regeln im [Leitfaden](LEITFADEN.md), Abschn. 9. Beide werden nur dafür installiert, in der CI in den Jobs `typen` und `lint`; Versionen wie dort, alle Pakete in einem Befehl (ein zweites `npm install --no-save` entfernt die zuvor installierten):

```bash
npm install --no-save typescript@7.0.2 @types/node@22.20.5 playwright@1.52.0 eslint@10.14.0 @eslint/js@10.0.1 globals@17.14.0
npx tsc -p .                  # js/, tools/, tests/, fragenliste/
node tools/sync.mjs vorlagen/app && npx tsc -p vorlagen/app
npx eslint .                  # ohne die Vorlage
(cd vorlagen/app && ../../node_modules/.bin/eslint .)
```

Kontraste der gerenderten Seiten (Leitfaden Abschn. 5.4) im Arbeitsordner mit den Apps messen, hell und dunkel; braucht Playwright mit Chromium (mit `CHROMIUM_PFAD=<Pfad>` ein vorhandener Chrome):

```bash
node tools/kontraste.mjs                      # App, Skript und Quiz jeder App daneben
node tools/kontraste.mjs ../ "stereography/#m=form" plane-groups/skript.html
```

Ausgabe: Text unter der Schwelle (Exitcode 1) und Grafik unter 3 : 1 zur Durchsicht, je nach Farbpaar gruppiert. In einer App liegt das Werkzeug als `tools/common/kontraste.mjs` und misst ohne Angabe ebenfalls alle Apps im Arbeitsordner; Grenzen der Messung im Kopf der Datei.

`tests/typen.typen.js` belegt, dass die gekennzeichneten Typen aus `js/typen.js` Vertauschungen melden; die Datei läuft nur in der Typprüfung. Mit den installierten Paketen zeigt VS Code die Meldungen in geöffneten Dateien, ohne weitere Einstellung.

Versionen nach [Semantic Versioning](https://semver.org/lang/de/), Änderungen in [CHANGELOG.md](CHANGELOG.md). Ein Release entsteht mit einem Tag `vX.Y.Z`, der zu `js/version.js` passt; Ablauf wie in den Apps ([Vorlage, „Versionen und Releases“](vorlagen/app/README.md#versionen-und-releases)), mit drei Unterschieden: kein `sw.js` und kein `CITATION.cff`; der Tag startet nur `release.yml`, das GitHub-Release ohne PDF (es gibt keine Live-Seite und kein Skript). Im Release-PR auch die Version in „Neue Version übernehmen“ (oben) und im Beispiel von `.github/ISSUE_TEMPLATE/fehler.yml` nachführen. Solange die Version mit 0 beginnt, kann sich die Schnittstelle noch ändern: Was wirklich allen Apps gemeinsam ist, zeigt sich erst mit der zweiten App.

## Entstehung

Code, Leitfaden und Vorlagen sind mit Hilfe von [Claude Code](https://claude.com/claude-code), einem KI-Werkzeug von Anthropic, entstanden. Die Entscheidungen und die fachliche Freigabe der Inhalte liegen bei Thomas Lottermoser (ETH Zürich).

## Rückmeldungen

Fehler, fachliche Hinweise und Vorschläge zu einer App bitte im Repository der App (Tabelle oben), was alle Apps gleich betrifft hier als [Issue](https://github.com/manganite/crystallography-common/issues/new/choose). Sicherheitslücken nicht öffentlich melden, sondern wie in [SECURITY.md](SECURITY.md) beschrieben.

## Lizenz

Code: [MIT](LICENSE). Schriften: SIL Open Font License 1.1 (siehe `fonts/LICENSE-*.txt`).
