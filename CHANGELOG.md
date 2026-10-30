# Changelog

Alle nennenswerten Änderungen an den gemeinsamen Dateien werden hier festgehalten.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/). Solange die Version mit 0 beginnt, kann sich die Schnittstelle zwischen zwei Versionen ändern; der Abschnitt „Geändert“ sagt dann, was eine App anpassen muss.

## [Unreleased]

## [0.1.0] - 2026-10-30

Erste Fassung, herausgelöst aus der App „Stereographische Projektion“ (v1.10.0). Die App sieht mit diesen Dateien genau so aus wie vorher.

### Hinzugefügt

- **Stile:** `css/base.css` (Farben hell/dunkel mit den Farben der Symmetrie, Schriften, Typografie, Kopfzeile), `css/app.css` (Werkbank: Seitenleiste, Karten, Bedienelemente, Abschnitte, Tafeln, Legende, Kenndaten, Erste Schritte, Hilfen, Telefon und Touch), `css/skript.css` (Inhaltsverzeichnis, Kästen, Vertiefungen, Abbildungsrahmen, Tabellen), `css/quiz.css`.
- **Schriften:** IBM Plex Sans und Mono, Source Serif 4.
- **Module:** `format.js` (HM-Symbole, Indizes), `help.js` (Tooltips und ⓘ-Erklärungen; Texte von der App), `quiz-core.js` (Quiz-Logik; Kapitel und Speichername von der App), `quiz-seite.js` (Quiz-Seite, `initQuiz`), `skript-kern.js` (Inhaltsverzeichnis, „In der App öffnen“, Nachladen, Querstriche), `seite.js` (Versionsnummer, Offline-Betrieb).
- **Werkzeuge:** `sync.mjs` und `check.mjs` (Kopie mit fester Version in einer App), `moodle.mjs` (Moodle-XML), `skript-pdf.mjs` (Skript als PDF), `server.mjs`.
- **Vorlagen** für eine neue App, **Leitfaden** für die App-Familie.

[Unreleased]: https://github.com/manganite/crystallography-common/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.0
