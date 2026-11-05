# Changelog

Alle nennenswerten Änderungen an den gemeinsamen Dateien werden hier festgehalten.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/). Solange die Version mit 0 beginnt, kann sich die Schnittstelle zwischen zwei Versionen ändern; der Abschnitt „Geändert“ sagt dann, was eine App anpassen muss.

## [Unreleased]

### Hinzugefügt

- **`css/app.css`:** Stile für Werkzeuge (Leitfaden Abschn. 5.2): gewählt (`.tools button[aria-pressed="true"]`, Akzentfarbe) und gesperrt (`.tools button:disabled`, `.seg button:disabled`, blass, ohne Hover). Die Vorlage zeigt beides in Tafel A (#53). Für die Apps: eigene Regeln dafür entfernen; plane-groups hat sie im `<style>` von `index.html`, stereography setzt für `.stereo-tools` eigene Regeln (Klasse `tools` ergänzen und die Regel für `aria-pressed` entfernen).

### Geändert

- **Leitfaden Abschn. 5.2:** Werkzeuge (Knöpfe einer Tafel, deren einziger Zweck die Art der Eingabe ist, z. B. Zeichnen, Radieren, Zone, Winkel) schliessen sich wie eine Auswahl aus und werden abgewählt, wenn ein anderes Werkzeug oder eine andere Funktion sie ausschliesst; ausgeschlossen sind sie sichtbar gesperrt, mit Grund bei der Tafel; in einem Modus ohne sie fehlen sie. Schalter, auch Knöpfe für die Ansicht wie die Lupe, bleiben „gesperrt, nicht abgewählt“. Für die Apps: nichts anzupassen (plane-groups setzt es so um; in stereography schliessen sich Zone und Winkel aus, Zone fehlt im Punktgruppenmodus). Sichtbare Sperre im gemeinsamen CSS: #53.

## [0.7.0] - 2026-11-05

„Alle Einstellungen zurücksetzen“ gemeinsam, PDF des Skripts ohne geteilte Bildraster. Für die Apps: den Knopf nach Leitfaden Abschn. 5.2 einrichten und `alleEinstellungenZuruecksetzen('<präfix>')` aufrufen.

### Hinzugefügt

- **„Alle Einstellungen zurücksetzen“** (#48): `alleEinstellungenZuruecksetzen(praefix)` in `js/seite.js` löscht alle Einträge der App im Speicher des Browsers ausser denen des Quiz (auch nochmals bei `pagehide`) und lädt die Seite ohne Hash neu. Die Vorlage hat den Knopf. Umsetzung in den Apps (Ort, ID, Präfix): Leitfaden Abschn. 5.2. In plane-groups ändert sich damit das Verhalten (Neuladen; auch offene Abschnitte und Tafel am Telefon werden zurückgesetzt), in stereography nicht.

### Behoben

- **PDF des Skripts** (#43): Ein Raster aus kleinen Abbildungen (`.fig-grid5`) wird nicht mehr über einen Seitenumbruch verteilt. In plane-groups stand Abb. 2.3 bisher auf zwei Seiten (jetzt eine Seite mehr, 79 statt 78; Abb. 5.1 ist höher als eine Seite und beginnt jetzt auf einer neuen), in der Vorlage Abb. 1.6; stereography unverändert.

## [0.6.0] - 2026-11-05

Anordnung der Tafeln gemeinsam in `css/app.css` und die Vorlage als vollständige Musterseite. Für die Apps: die eigenen Regeln für die Anordnung aus dem `<style>` von `index.html` entfernen; Tafeln heissen `.p-a`/`.p-b`, der Umschalter setzt `data-fig="a"`/`"b"` (siehe „Geändert“). Sonst ändert sich zur Laufzeit nichts.

### Hinzugefügt

- **Vorlage als Musterseite** (#7): Das Skript der Vorlage zeigt jetzt alle gemeinsamen Formen für Abbildungen (`fig-row`, `fig-row3`, `fig-cols`, `fig-grid5`, `fig-narrow`, `fig-note`), eine Abbildung mit Regler (`slider`, im PDF als fester Zustand), Formel (`formel`), Schema (`schema`), Tabelle mit Unterschrift (`tab`, `tabwrap`, `tab-wrap`, `caption`), einen Vertiefungsabschnitt (Etikett auch im Inhaltsverzeichnis), Lernziele zur Vertiefung (`.box > h5`) und einen Querstrich (`ov`). Leitfaden Abschn. 6: Regel zu den Nummern von Abbildungen und Tabellen, wie in den Apps.

### Geändert

- **Anordnung der Tafeln in `css/app.css`** (#6): `.layout`, `.figs`, `.p-a`, `.p-b`, `.info` und der Umschalter auf dem Telefon (`body[data-fig="a"|"b"]`) stehen jetzt gemeinsam, wie sie in beiden Apps und der Vorlage gleich standen. Für die Apps: die eigenen Regeln dafür aus dem `<style>` von `index.html` entfernen; Tafeln heissen `.p-a`/`.p-b`, der Umschalter setzt `data-fig="a"`/`"b"`. Eine App mit anderer Anordnung überschreibt die Regeln samt Umbrüchen (Leitfaden Abschn. 5.1). Ohne JavaScript zeigt das Telefon beide Tafeln, wenn `<body>` kein `data-fig` hat; die Vorlage setzt `data-fig="a"`.

### Entfernt

- **Ungenutzte Klassen** `narrow-only`, `wide-only` (`css/app.css`) und `.toc .todo` (`css/skript.css`): in keiner App und nicht in der Vorlage verwendet.

### Behoben

- **Unterschrift einer Tabelle** (`.tab caption`): nie breiter als der Rahmen (`.tabwrap`); auf dem Telefon lief sie mit der Tabelle aus dem Bild. Keine App nutzt bisher `caption`; Skript und PDF der Apps unverändert (nachgeprüft).

## [0.5.0] - 2026-11-04

Geprüfte Helfer für Elemente der Seite in `js/seite.js` und Leitfaden zur Kennzeichnung der Typen in Datendateien. Für die Apps: Die Quiz-Seite meldet ein fehlendes Element oder eines der falschen Art jetzt beim ersten Zugriff mit der ID, das Skript Elemente der falschen Art mit dem Selektor; beim Übernehmen die eigenen Kopien der Helfer durch die gemeinsamen ersetzen (Leitfaden Abschn. 9).

### Hinzugefügt

- **`js/seite.js`: geprüfte Helfer für Elemente der Seite** (#30): `nachId(id, Art)` und die Kurzformen `$`, `eingabe`, `auswahl`, `knopf`, `abschnitt`, `grafik`, dazu `element(sel, Art)` und `elemente(sel, Art)` für Selektoren (ohne Art: HTML-Element; `elemente` gibt eine Liste zurück, auch eine leere). Sie werfen einen Fehler mit der ID bzw. dem Selektor, wenn das Element fehlt oder eine andere Art hat. Test `tests/seite.test.mjs`. Regel im Leitfaden Abschn. 9.
- **`vorlagen/app/.github/pull_request_template.md`:** PR-Vorlage für neue Apps, mit dem Punkt „Review durch einen unabhängigen Agenten“; derselbe Punkt in der PR-Vorlage dieses Repositorys.

### Geändert

- **`js/quiz-seite.js`, `js/skript-kern.js`** und die Vorlage (`vorlagen/app/js/main.js`, `skript.js`) nutzen die Helfer aus `seite.js` statt eigener Umwandlungen; in der Vorlage sind die Knöpfe der Ersten Schritte jetzt Pflicht (vorher still übergangen, wenn sie fehlten). Für die Apps: Fehlt ein Element der Quiz-Seite oder hat es eine andere Art, meldet das Quiz jetzt beim ersten Zugriff einen Fehler mit der ID. Beim Übernehmen die eigenen Kopien der Helfer durch die gemeinsamen ersetzen (Leitfaden Abschn. 9).
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

[Unreleased]: https://github.com/manganite/crystallography-common/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.7.0
[0.6.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.6.0
[0.5.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.5.0
[0.4.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.4.0
[0.3.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.1
[0.3.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.0
[0.2.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.2.0
[0.1.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.1
[0.1.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.0
