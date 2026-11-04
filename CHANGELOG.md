# Changelog

Alle nennenswerten Änderungen an den gemeinsamen Dateien werden hier festgehalten.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/). Solange die Version mit 0 beginnt, kann sich die Schnittstelle zwischen zwei Versionen ändern; der Abschnitt „Geändert“ sagt dann, was eine App anpassen muss.

## [Unreleased]

### Hinzugefügt

- **`vorlagen/app/.github/pull_request_template.md`:** PR-Vorlage für neue Apps, mit dem Punkt „Review durch einen unabhängigen Agenten“; derselbe Punkt in der PR-Vorlage dieses Repositorys.

### Geändert

- **Leitfaden** Abschn. 9: Die Übergangsregel mit `// @ts-nocheck` entfällt, alle Dateien in `js/`, `tools/` und `tests/` sind strikt typisiert (in common und beiden Apps umgesetzt). Abschn. 10, Schritt 6: Die PR-Vorlage kommt mit der Vorlage. Begründungen zu Hilfeseite und ESLint stehen jetzt in `CLAUDE.md`, Abschnitt „Entscheidungen der Familie“.
- **Leitfaden** Abschn. 9: In Datendateien ist eine Kennzeichnung der Typen erlaubt, als reine Typangabe ohne Laufzeitcode, je Tabelle einmal. Begründung in `CLAUDE.md`, „Entscheidungen der Familie“.

## [0.4.0] - 2026-11-04

ESLint als neue Prüfung `lint` (gemeinsame Regeln in `tools/eslint-basis.mjs`) und Leitfaden zu den „Erste Schritte“ je Modus und zur Hilfeseite. Für die Apps ändert sich zur Laufzeit nichts; beim Übernehmen muss eine App `eslint.config.mjs` anlegen und den Job `lint` einrichten (siehe „Hinzugefügt“).

### Hinzugefügt

- **ESLint** (empfohlene Regeln) als CI-Job `lint` (#27): gemeinsame Regeln in `tools/eslint-basis.mjs`, `eslint.config.mjs` in common und in der Vorlage, Job `lint` auch in der Vorlage. Die Pakete für ESLint werden auch im Job `typen` installiert, damit `tsc` die Konfiguration prüft. Eine App muss beim Übernehmen `eslint.config.mjs` anlegen, die Jobs `typen` und `lint` wie in der Vorlage einrichten und ihre Befunde beheben; Thomas ergänzt `lint` in der Regel „main schützen“.
- **Leitfaden** Abschn. 9: Regel zu ESLint; Abschn. 10: Prüfung `lint` in der Regel „main schützen“.

### Geändert

- **Leitfaden** Abschn. 5.1 und 5.3: Erste Schritte je Modus, nur beim ersten Aufruf eines Modus; neu eine Hilfeseite `hilfe.html` mit Anleitungen nach Aufgaben, „?“ führt dorthin. Die Regel „keine ausführlichen Erklärseiten in der App“ entfällt (Issue #24).
- **`tools/skript-pdf.mjs`:** `anzahl` ohne unnötigen Startwert (Befund von ESLint, Verhalten gleich).
- **Vorlage, `tools/moodle-export.mjs`:** ungenutzter Parameter als `_angabe` gekennzeichnet.

## [0.3.1] - 2026-11-04

Leitfaden („Daten getrennt vom Code“, Ausnahmen von der Typprüfung) und eine kleine Korrektur an den Typen des Quiz. Für die Apps ändert sich zur Laufzeit nichts.

### Hinzugefügt

- **Leitfaden** Abschn. 7: Fragenbank als ES-Modul mit Begründung; sie enthält nur Literale und reine Formatierungshelfer, berechnete Fragen gehören in die Generatoren.
- **Leitfaden** Abschn. 9: Grundsatz „Daten getrennt vom Code“ für alle fachlichen Inhalte und Texte (Datendateien als ES-Module); Abschn. 7 verweist für die Fragenbank darauf.

### Geändert

- **`js/quiz-core.js`:** Im Typ `Frageinhalt` ist `pruefung.art` freiwillig, wie es `fragenliste/extract.mjs` schon behandelt (ein Generator in plane-groups liefert Prüfangaben ohne `art`).
- **Leitfaden** Abschn. 9: Ausnahmen von der Typprüfung während der Umstellung einer App als `// @ts-nocheck` am Dateianfang (statt in der `tsconfig.json`), damit neue Dateien von selbst geprüft werden.

## [0.3.0] - 2026-11-04

Typprüfung mit TypeScript über JSDoc-Typen (Issue #19, Schritt 1). Am Verhalten ändert sich nichts. Eine App muss beim Übernehmen `lib/common/js/typen.js` in die Offline-Liste von `sw.js` aufnehmen.

### Hinzugefügt

- **`js/typen.js`:** gemeinsame Typen ohne Laufzeitcode: `Vec2`, `Vec3`, `Mat2`, `Mat3` und gekennzeichnete Typen `Richtung`, `Normale`, `Grad`, `Bogenmass`, `Fraktional<V>`, `Kartesisch<V>`. `tests/typen.typen.js` belegt, dass Vertauschungen gemeldet werden.
- **Typen des Quiz** in `js/quiz-core.js` (`Frage`, `Frageinhalt`, `Generator`, `Kapitel`, `Kandidat`, `Fortschritt` u. a.), für die Fragenbanken der Apps; Typen der Hilfen (`Abschnitt`, `Hilfetexte`) in `js/help.js`.
- **`tsconfig.json`** und CI-Job `typen` (TypeScript 7.0.2, strikt): `js/`, `tools/`, `tests/`, `fragenliste/` und die Vorlage.
- **Vorlage:** `tsconfig.json`, Job `typen` in `ci.yml`, `typen.js` in der Offline-Liste; die Dateien der Muster-App sind strikt typisiert.
- **Leitfaden** Abschn. 9: Regel zur Typprüfung; Abschn. 10: Prüfung `typen` in der Regel „main schützen“.

### Geändert

- **Alle Dateien in `js/` und `tools/`** sind mit JSDoc strikt typisiert. Wo die Typprüfung `null` nicht ausschliessen kann, stehen Umwandlungen oder Abfragen, die das Verhalten nicht ändern.
- **`tests/quiz-core.test.mjs`:** Parameter des Test-Generators als Zeichenketten, wie in den Apps.
- **`vorlagen/app/README.md`:** Abschnitt „Links auf Ansichten“ heisst „Link-Adressen“, wie im Leitfaden.

## [0.2.0] - 2026-11-04

Arbeitsbereich mit allen Repositories, gemeinsamer GitHub-Auftritt (README-Gliederung, SECURITY, Vorlagen für Issues, CodeQL) und zwei Korrekturen aus CodeQL, die die Apps betreffen: Maskierung in `help.js` und im Moodle-Export. Für die Apps ändert sich an der Schnittstelle nichts.

### Hinzugefügt

- **`kristallographie.code-workspace`:** VS-Code-Arbeitsbereich mit allen Repositories der Familie; Kopien des gemeinsamen Codes in den Apps sind darin schreibgeschützt.
- **Vorlagen:** `vorlagen/app/README.md` mit der gemeinsamen Gliederung der READMEs (wie in der App „Stereographische Projektion“), `SECURITY.md`, Vorlagen für Issues (Fehler, fachlicher Hinweis, Vorschlag), Kurzfassung und Stichwörter in `CITATION.cff`.
- **Leitfaden:** GitHub-Auftritt und Einstellungen der Repositories (Abschn. 9 und 10); jedes README nennt im Abschnitt „Entstehung“, dass das Projekt mit Hilfe von Claude Code entstanden ist.
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

[Unreleased]: https://github.com/manganite/crystallography-common/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.4.0
[0.3.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.1
[0.3.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.0
[0.2.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.2.0
[0.1.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.1
[0.1.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.0
