# Muster-App

[![CI](https://github.com/manganite/muster-app/actions/workflows/ci.yml/badge.svg)](https://github.com/manganite/muster-app/actions/workflows/ci.yml)
[![Deploy](https://github.com/manganite/muster-app/actions/workflows/deploy.yml/badge.svg)](https://github.com/manganite/muster-app/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/manganite/muster-app)](https://github.com/manganite/muster-app/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<!-- Gliederung gleich in allen Apps der Familie (LEITFADEN.md, Abschn. 9). Abschnitte, die für
     eine App nicht passen, entfallen; die Reihenfolge bleibt. -->

Interaktive Lern-App für eine Einführung in die Kristallographie, entstanden aus der Vorlesung Kristallographie an der ETH Zürich: … (Inhalt in einem Satz). Dazu ein Skript und ein Übungsquiz. Für Laptop, iPad und Telefon; läuft im Browser, als Web-App auf dem Homescreen und offline.

Teil einer Familie von Lern-Apps mit gemeinsamer Grundlage: [crystallography-common](https://github.com/manganite/crystallography-common).

### [Zur App: manganite.github.io/muster-app](https://manganite.github.io/muster-app/)

<!-- Bildschirmfoto der App (hell), etwa 1600 px breit; Alternativtext beschreibt, was zu sehen ist. -->
![… (was das Bild zeigt)](docs/screenshot.png)

## Funktionen

- **…:** je Modus bzw. Werkzeug ein Punkt, Begriffe wie im Skript.
- **[Skript](https://manganite.github.io/muster-app/skript.html)** mit … Kapiteln: … Die Abbildungen zeichnet der Code der App, jede mit Link in die App; Vertiefungen sind gekennzeichnet. Auch als [PDF](https://manganite.github.io/muster-app/skript.pdf).
- **[Quiz](https://manganite.github.io/muster-app/quiz.html)** zu allen Kapiteln in drei Stufen (1 Grundlagen, 2 Anwendung, 3 Vertiefung) mit sofortiger Rückmeldung, Link ins Skript und in die App. Standardmässig nur fachlich geprüfte Fragen; „Auch ungeprüfte Fragen zeigen“ nimmt die Entwürfe dazu. Der Stand bleibt nur im Browser.

## Nutzung

### Im Browser

Die App läuft in aktuellen Versionen von Safari, Chrome, Edge und Firefox: **https://manganite.github.io/muster-app/**. Eine Installation ist nicht nötig. Einstellungen bleiben im Browser gespeichert; „Link kopieren“ erzeugt einen Link auf genau die aktuelle Ansicht, etwa für Folien.

### Als Web-App auf dem Homescreen

Die App lässt sich wie eine installierte App mit eigenem Symbol und ohne Browserleiste starten:

- **iPad und iPhone (Safari):** App öffnen, auf das Teilen-Symbol tippen (Quadrat mit Pfeil nach oben), dann **„Zum Home-Bildschirm“** und **„Hinzufügen“**.
- **Android (Chrome):** App öffnen, Menü **⋮** antippen, dann **„Zum Startbildschirm hinzufügen“** bzw. **„App installieren“**.
- **Laptop (Chrome oder Edge):** App öffnen, in der Adressleiste auf das Symbol **„App installieren“** klicken (Chrome) bzw. Menü **…** → **Apps** → **„Diese Website als App installieren“** (Edge).

### Offline

Nach dem ersten Aufruf hält ein Service Worker alle Dateien vor; die App funktioniert dann auch ohne Netz, im Browser wie auf dem Homescreen. Erscheint eine neue Version, lädt die App sie beim nächsten Öffnen mit Netz und startet einmal neu; Einstellungen bleiben erhalten.

### Lokal ausführen

Die App ist eine statische Webseite ohne Build-Schritt und ohne Abhängigkeiten.

1. Dateien holen: auf der [Release-Seite](https://github.com/manganite/muster-app/releases/latest) unter „Assets“ **Source code (zip)** herunterladen und entpacken, oder
   ```bash
   git clone https://github.com/manganite/muster-app.git
   ```
2. Im Ordner einen lokalen Webserver starten, zum Beispiel mit Python 3:
   ```bash
   cd muster-app
   python3 -m http.server 8000
   ```
   (unter Windows `py -m http.server 8000`)
3. Im Browser **http://localhost:8000** öffnen.

Ein Doppelklick auf `index.html` genügt nicht: Browser laden die JavaScript-Module der App nicht von `file://`-Adressen.

## Links auf Ansichten

Der Zustand steht lesbar in der Adresse, z. B. `#m=a&g=p4mm`. Geschrieben wird nur, was vom Startzustand abweicht. Die Link-Adressen sind eine Schnittstelle (Skript, Quiz, andere Apps der Familie) und bleiben stabil; alte Links werden umgerechnet (Test `tests/zustand.test.mjs`):

| Schlüssel | Bedeutung | Werte (Startwert fett) |
|---|---|---|
| `m` | Modus | **`a`**, `b` |
| `g` | Gruppe | Kurzsymbol, z. B. `p4mm` |

## Konventionen

- Achsen, Blickrichtung, Symbole und Zählweisen, soweit sie von einer Konvention abhängen (mit Quelle). Eigene Festlegungen der App als solche genannt.

## Entwicklung

### Aufbau

| Datei | Inhalt |
|---|---|
| `index.html`, `js/main.js` | Oberfläche und Bedienung der App |
| `js/hilfetexte.js` | Texte der Tooltips und ⓘ-Erklärungen |
| `skript.html`, `js/skript.js` | Skript; Abbildungen aus dem Code der App |
| `quiz.html`, `js/quiz.js`, `js/quiz-kapitel.js`, `js/quiz-bank.js` | Quiz: Ablauf aus `lib/common/`, Kapitel und Fragen dieser App |
| `tools/moodle-export.mjs`, `tools/skript-pdf.mjs` | Moodle-Export und PDF des Skripts |
| `tools/quiz-quelle.mjs` | Fragen und Bilder für die gemeinsame Fragenliste der Familie (crystallography-common, `fragenliste/`) |
| `js/version.js`, `sw.js` | Versionsnummer, Service Worker für den Offline-Betrieb |
| `manifest.webmanifest`, `icons/` | Favicon und Homescreen-Icons |
| `lib/common/`, `tools/common/` | Gemeinsame Grundlage aus [crystallography-common](https://github.com/manganite/crystallography-common) als Kopie mit fester Version (`lib/common/MANIFEST.json`): Stile, Schriften, Hilfen, Quiz, Skript-Bausteine, Formatierung, Werkzeuge. Nicht von Hand ändern. |
| `tests/` | Automatische Tests (Node, ohne Abhängigkeiten) |

### Gemeinsame Grundlage

Die App gehört zu einer Familie von Lern-Apps mit gleichem Aussehen, gleicher Bedienung und gleich aufgebautem Skript und Quiz. Was sich teilen lässt, liegt in [crystallography-common](https://github.com/manganite/crystallography-common), dort steht auch der [Leitfaden](https://github.com/manganite/crystallography-common/blob/main/LEITFADEN.md). Eine neue Version übernimmt man von einem Release-Tag:

```bash
node tools/common/sync.mjs ../crystallography-common
```

`tests/common.test.mjs` prüft, dass die Kopie dem Manifest entspricht. Änderungen an gemeinsamen Dateien gehören nach crystallography-common, nicht in die Kopie.

### Tests

```bash
node --test tests/*.test.mjs
```

Geprüft werden … (was die Tests der App absichern), dazu die Quizfragen, die Release-Konsistenz (Version, Changelog, Offline-Liste), die Kopie der gemeinsamen Dateien und dass App, Skript und README für sich verständlich sind (keine Verweise auf Lehrveranstaltungen). Dieselben Tests laufen bei jedem Pull Request in GitHub Actions, zusammen mit der PDF-Fassung des Skripts.

- Skript als PDF: `node tools/skript-pdf.mjs [Ausgabedatei]` (braucht Playwright mit Chromium)
- Quiz für Moodle: `node tools/moodle-export.mjs quiz.xml` (mit `--entwurf` auch die ungeprüften Fragen)

### Versionen und Releases

Die App folgt [Semantic Versioning](https://semver.org/lang/de/); Änderungen stehen im [CHANGELOG](CHANGELOG.md). Jede Änderung geht über einen Branch und einen Pull Request nach `main` (`main` ist geschützt; die CI muss grün sein). Die Live-Seite ändert sich nur mit einem Release:

1. Release-PR: Version in `js/version.js`, `sw.js` und `CITATION.cff` (mit `date-released`) erhöhen; in `CHANGELOG.md` die Einträge unter `## [Unreleased]` unter eine neue Überschrift `## [x.y.z] - JJJJ-MM-TT` verschieben und die Links am Ende ergänzen.
2. Nach dem Merge den Tag auf den neuesten Stand von `main` setzen:
   ```bash
   git fetch && git log --oneline -1 origin/main     # ist das der Release-PR?
   git tag -a vX.Y.Z -m "vX.Y.Z" origin/main && git push origin vX.Y.Z
   ```

Der Tag startet zwei Workflows: `release.yml` legt das GitHub-Release mit den Notizen aus dem Changelog und dem Skript als PDF an, `deploy.yml` prüft und veröffentlicht den Stand auf GitHub Pages.

## Grundlagen und Quellen

- International Tables for Crystallography, Vol. A (2006): …
- W. Borchardt-Ott, H. Sowa: *Kristallographie. Eine Einführung für Studierende der Naturwissenschaften*, Springer, Berlin 2018, [doi:10.1007/978-3-662-56816-3](https://doi.org/10.1007/978-3-662-56816-3): Begriffe.
- … (weitere Quellen mit dem, wofür sie stehen). Die Quellen je Kapitel stehen im Skript.

## Rückmeldungen

Fehler, fachliche Hinweise zu Skript und Quiz und Vorschläge bitte als [Issue](https://github.com/manganite/muster-app/issues/new/choose). Sicherheitslücken nicht öffentlich melden, sondern wie in [SECURITY.md](SECURITY.md) beschrieben.

## Zitieren

Wer die App in Lehre oder Publikationen nennt, findet die Angaben in [`CITATION.cff`](CITATION.cff) bzw. auf GitHub unter „Cite this repository“.

## Lizenz

Code: [MIT](LICENSE). Schriften in `lib/common/fonts/`: SIL Open Font License 1.1 (Lizenztexte liegen bei). Weitere mitgelieferte Bibliotheken mit ihrer Lizenz hier nennen.
