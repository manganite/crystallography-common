# crystallography-common

[![CI](https://github.com/manganite/crystallography-common/actions/workflows/ci.yml/badge.svg)](https://github.com/manganite/crystallography-common/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/manganite/crystallography-common)](https://github.com/manganite/crystallography-common/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Gemeinsame Grundlage einer Familie von Lern-Apps zur Kristallographie, entstanden aus der Vorlesung Kristallographie an der ETH Zürich. Jede App besteht aus der App selbst, einem Skript und einem Quiz; alle Apps sollen für Studierende als Geschwister erkennbar sein: gleiches Layout, gleiche Farben, gleiche Bedienung, gleicher Aufbau von Skript und Quiz.

| App | Inhalt | Repository |
|---|---|---|
| [Stereographische Projektion](https://manganite.github.io/stereography/) | Punktgruppen, Kristallformen, Stereogramme | [manganite/stereography](https://github.com/manganite/stereography) |
| 2D (in Arbeit) | Gitter und Ebenengruppen | – |
| 3D (geplant) | Raumgitter und Raumgruppen | – |

Wie die Apps aussehen und sich verhalten sollen, steht im **[Leitfaden](LEITFADEN.md)**. Dieses Repository enthält den Teil davon, der sich als Code teilen lässt.

## Inhalt

| Ordner | Datei | Zweck |
|---|---|---|
| `css/` | `base.css` | Farben hell/dunkel (inklusive der Farben für Symmetrieelemente), Schriften, Grundtypografie, Kopfzeile |
| | `app.css` | Werkbank der App: Seitenleiste mit Karten, Bedienelemente, einklappbare Abschnitte, Tafeln, Legende, Kenndaten, Erste Schritte, Tooltip, ⓘ-Erklärungen, Telefon und Touch |
| | `skript.css` | Skript: Inhaltsverzeichnis, Lesebreite, Kästen (Lernziele, Merke, Zusammenfassung, Grundlagen, Vertiefung, In der App), Vertiefungskapitel, Abbildungsrahmen, Tabellen, Quellen |
| | `quiz.css` | Quiz: Auswahl (Stufen, Kapitel, Anzahl), Frage, Antworten, Rückmeldung, Auswertung |
| `fonts/` | | IBM Plex Sans und Mono, Source Serif 4 (selbst gehostet, SIL Open Font License) |
| `js/` | `format.js` | Hermann-Mauguin-Symbole und Millersche Indizes mit Querstrich |
| | `help.js` | Mechanik der Hilfen: Tooltips (Laptop), ⓘ-Erklärungen je Abschnitt (Touch); Texte liefert die App |
| | `quiz-core.js` | Quiz-Logik ohne Seite: Kandidaten, Ziehen nach Stufen und Vorrang, Mischen, Auswerten, Fortschritt |
| | `quiz-seite.js` | Quiz-Seite: Auswahl, Fragen mit sofortiger Rückmeldung, Auswertung, Fortschritt im Browser |
| | `skript-kern.js` | Skript: Inhaltsverzeichnis mit Kennzeichnung der Vertiefungen, „In der App öffnen“, Nachladen beim Hineinscrollen, Querstriche in SVG-Text |
| | `seite.js` | Versionsnummer eintragen, Offline-Betrieb (Service Worker) |
| | `version.js` | Version dieses Repositories |
| `tools/` | `sync.mjs` | Kopie mit fester Version in eine App übernehmen |
| | `check.mjs` | Kopie in einer App gegen ihr Manifest prüfen |
| | `moodle.mjs` | Quizfragen als Moodle-XML |
| | `skript-pdf.mjs` | Skript als PDF (A4) mit Playwright |
| | `server.mjs` | kleiner statischer Webserver für Werkzeuge und Tests |
| `vorlagen/` | | Ausgangspunkt für eine neue App (Seiten, Service Worker, Workflows, Tests) |

Nicht hier, sondern in den Apps: alles Fachliche (Gruppen, Gitter, Formen), die Abbildungen, die Anordnung der Tafeln, Texte der Hilfen, Fragen und Kapitel.

## Einbinden in eine App

Die Apps haben keinen Build-Schritt. Sie enthalten eine **Kopie mit fester Version**:

- `lib/common/` mit `css/`, `js/`, `fonts/` (wird mit der App veröffentlicht und offline vorgehalten)
- `tools/common/` mit den Werkzeugen (nur für die Entwicklung)
- `lib/common/MANIFEST.json` mit Version, Tag, Commit und einer Prüfsumme je Datei

So bleibt jede App eigenständig veröffentlichbar und offline nutzbar. Eine Änderung hier erreicht eine App erst, wenn sie die neue Version übernimmt und selbst ein Release macht.

### Neue Version übernehmen

```bash
cd crystallography-common
git fetch --tags && git checkout v0.1.1      # gewünschter Release-Tag
cd ../stereography
node tools/common/sync.mjs ../crystallography-common
node --test tests/*.test.mjs                 # u. a. tests/common.test.mjs prüft die Kopie
```

Das Werkzeug warnt, wenn der Stand kein Release-Tag ist oder ungespeicherte Änderungen hat. Die Kopie in der App wird nie von Hand geändert; `tests/common.test.mjs` schlägt sonst fehl. Änderungen gehören in dieses Repository.

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
import { appLink, nachladen, querstriche, inhaltsverzeichnis } from '../lib/common/js/skript-kern.js';
import { versionEintragen, offline } from '../lib/common/js/seite.js';
```

Eine neue App beginnt mit den Dateien aus [`vorlagen/`](vorlagen/README.md).

## Entwicklung

Ohne Abhängigkeiten; Tests mit Node 22:

```bash
node --test tests/*.test.mjs
```

Versionen nach [Semantic Versioning](https://semver.org/lang/de/), Änderungen in [CHANGELOG.md](CHANGELOG.md). Ein Release entsteht mit einem Tag `vX.Y.Z`, der zu `js/version.js` passt. Solange die Version mit 0 beginnt, kann sich die Schnittstelle noch ändern: Was wirklich allen Apps gemeinsam ist, zeigt sich erst mit der zweiten App.

## Lizenz

Code: [MIT](LICENSE). Schriften: SIL Open Font License 1.1 (siehe `fonts/LICENSE-*.txt`).
