# Changelog

Alle nennenswerten Änderungen an den gemeinsamen Dateien werden hier festgehalten.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/). Solange die Version mit 0 beginnt, kann sich die Schnittstelle zwischen zwei Versionen ändern; der Abschnitt „Geändert“ sagt dann, was eine App anpassen muss.

## [Unreleased]

### Hinzugefügt

- **`kristallographie.code-workspace`:** VS-Code-Arbeitsbereich mit allen Repositories der Familie; Kopien des gemeinsamen Codes in den Apps sind darin schreibgeschützt.
- **Vorlagen:** `vorlagen/app/README.md` mit der gemeinsamen Gliederung der READMEs (wie in der App „Stereographische Projektion“), `SECURITY.md`, Vorlagen für Issues (Fehler, fachlicher Hinweis, Vorschlag), Kurzfassung und Stichwörter in `CITATION.cff`.
- **Leitfaden:** GitHub-Auftritt und Einstellungen der Repositories (Abschn. 9 und 10).
- **`SECURITY.md`** und Vorlagen für Issues auch in diesem Repository.
- **CodeQL** in der erweiterten Einrichtung (`.github/workflows/codeql.yml`, `.github/codeql/codeql-config.yml`), ohne Tests; dieselben Dateien für die Apps in `vorlagen/app/` (ohne Tests und die Kopie der gemeinsamen Dateien).
- **`tests/moodle.test.mjs`:** Maskierung im Moodle-Export.
- **`tools/server.mjs`:** Ordner liefern ihre `index.html` (ohne Schrägstrich am Ende Umleitung). Direkt gestartet (`node tools/server.mjs [ordner] [port]`) bedient der Server den Arbeitsordner wie GitHub Pages, Standard Port 8000.

### Behoben

- **`tools/moodle.mjs`:** Alternativtexte von Bildern (`alt="…"`) maskierten keine doppelten Anführungszeichen; ein solcher Text hätte das Attribut im Moodle-XML abgebrochen. Neu `attrEsc` (Befund von CodeQL).
- **`js/help.js`:** In den ⓘ-Erklärungen wurde der Text eines Bedienelements als HTML wieder eingesetzt; ein `<` oder `&` darin wäre als Markup gelesen worden. Er wird jetzt maskiert (Befund von CodeQL).
- **Fragenliste:** Kennungen und Kurznamen der Apps in Filterknöpfen und Kapitelauswahl maskiert.

## [0.1.1] - 2026-10-30

### Behoben

- **`tools/server.mjs`:** Die Prüfung, ob eine angefragte Datei im Ordner liegt, verglich nur den Anfang des Pfads. Eine Anfrage wie `/%5c../app-privat/datei` konnte so eine Datei aus einem Nachbarordner mit gleichem Namensanfang liefern. Jetzt zählt der relative Pfad (Hinweis aus dem Code-Review in manganite/stereography#44). Der Server läuft nur lokal für die PDF-Erzeugung; neuer Test `tests/server.test.mjs`.

## [0.1.0] - 2026-10-30

Erste Fassung, herausgelöst aus der App „Stereographische Projektion“ (v1.10.0). Die App sieht mit diesen Dateien genau so aus wie vorher.

### Hinzugefügt

- **Stile:** `css/base.css` (Farben hell/dunkel mit den Farben der Symmetrie, Schriften, Typografie, Kopfzeile), `css/app.css` (Werkbank: Seitenleiste, Karten, Bedienelemente, Abschnitte, Tafeln, Legende, Kenndaten, Erste Schritte, Hilfen, Telefon und Touch), `css/skript.css` (Inhaltsverzeichnis, Kästen, Vertiefungen, Abbildungsrahmen, Tabellen), `css/quiz.css`.
- **Schriften:** IBM Plex Sans und Mono, Source Serif 4.
- **Module:** `format.js` (HM-Symbole, Indizes), `help.js` (Tooltips und ⓘ-Erklärungen; Texte von der App), `quiz-core.js` (Quiz-Logik; Kapitel und Speichername von der App), `quiz-seite.js` (Quiz-Seite, `initQuiz`), `skript-kern.js` (Inhaltsverzeichnis, „In der App öffnen“, Nachladen, Querstriche), `seite.js` (Versionsnummer, Offline-Betrieb).
- **Werkzeuge:** `sync.mjs` und `check.mjs` (Kopie mit fester Version in einer App), `moodle.mjs` (Moodle-XML), `skript-pdf.mjs` (Skript als PDF), `server.mjs`.
- **Vorlagen** für eine neue App, **Leitfaden** für die App-Familie.

[Unreleased]: https://github.com/manganite/crystallography-common/compare/v0.1.1...HEAD
[0.1.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.1
[0.1.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.0
