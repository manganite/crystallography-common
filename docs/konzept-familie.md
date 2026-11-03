# App-Familie: Organisation und gemeinsame Grundlage

> **Status (geprüft 3.11.2026, nachträglich ergänzt):** Umgesetzt (common v0.1.1, Stereo-App v1.11.0/v1.12.0, plane-groups v1.0.0). Überholt:
> - „Eigenes Claude-Projekt je neuer App“ und „Leitfaden als Dokument in jedes Projekt“: ersetzt durch `CLAUDE.md` in den Repositories und ein gemeinsames Projekt „Kristallographie Apps“; der Leitfaden ist `LEITFADEN.md` (die Kopie `claude/leitfaden-familie.md` ist überholt).
> - „Reziprokes Gitter keiner App zugeordnet“: gehört in die 2D-App (Nachtrag unten).
> - „Bewusst noch nicht gemeinsam: Anordnung der Tafeln und 3D-Ansicht“: Issue #6.
> - Die geplante 3D-App (Raumgitter, Raumgruppen): Issue #9; eigenes Repository später.
>
> Der Text darunter ist der Stand des Konzepts und wird nicht mehr nachgeführt. Was heute gilt, steht in `CLAUDE.md` und im `LEITFADEN.md` von crystallography-common; offene Punkte stehen in den GitHub Issues.

Stand 3.11.2026. Entscheidungen mit Thomas im Gespräch vom 30.10.2026; Nachträge vom 3.11.2026 am Ende.

## Entscheidungen

- **Drei Apps**, je mit App, Skript und Quiz: Stereographische Projektion (bestehend), **2D** (Schwerpunkt Ebenengruppen, weniger das Gitter; soll im Herbstsemester 2026 bereitstehen, gut 14 Tage ab 30.10.2026), **3D** (Raumgitter, Raumgruppen). Das reziproke Gitter ist noch keiner App zugeordnet.
- **Eigene Repositories** je App, untereinander verlinkt; die Apps sollen für Studierende als Geschwister erkennbar sein (Layout, Farben, Bedienung, Quiz mit identischer Funktion, Skript mit gleichem Layoutkonzept, enge Verzahnung).
- **Gemeinsames Repository** [manganite/crystallography-common](https://github.com/manganite/crystallography-common) **vor** der ersten neuen App angelegt; die Stereo-App zuerst darauf umgestellt (Vorschlag Thomas).
- **Eigenes Claude-Projekt je neuer App.** Die Notizen dieses Projekts sind aus anderen Projekten nicht lesbar; deshalb kommen der Leitfaden (claude/leitfaden-familie.md) und das Vorlesungs-PDF als Dokumente in jedes neue Projekt.
- Umfang des Umbaus nicht eingeschränkt (Thomas: „Schränke Dich also nicht ein“).

## Einbindung

- Die Apps enthalten eine **Kopie mit fester Version**: `lib/common/` (css, js, fonts; wird veröffentlicht) und `tools/common/` (Werkzeuge). `lib/common/MANIFEST.json` hält Version, Tag, Commit und Prüfsummen fest; `tests/common.test.mjs` prüft die Kopie.
- Übernahme: `node tools/common/sync.mjs ../crystallography-common` von einem Release-Tag. Nie in der Kopie ändern.
- Kein Laden von einer gemeinsamen Adresse zur Laufzeit (sonst ändern sich alle Apps ohne Release).
- crystallography-common hat eigene Versionen (SemVer, beginnt bei 0.1.0; solange 0.x, kann sich die Schnittstelle ändern) und eigene Releases über Tags.

## Aufteilung (v0.1.0)

| Teil | Gemeinsam (crystallography-common) | Bleibt in der Stereo-App |
|---|---|---|
| Farben, Schriften, Typografie, Kopfzeile | `css/base.css`, `fonts/` | – |
| Farben der Symmetrie (ax2–ax6, dir1–dir3, fc0–fc7) | in `base.css`, gleiche Bedeutung in allen Apps | – |
| Werkbank: Seitenleiste, Karten, Bedienelemente, Abschnitte, Gruppenwahl, Tafeln, Legende, Kenndaten, Erste Schritte, Tooltip, ⓘ, Telefon/Touch | `css/app.css` | Anordnung der Tafeln (`.layout`), Stereogramm, 3D, Blickrichtungen, Zonen, Formtabelle |
| Skript: Inhaltsverzeichnis, Kästen, Vertiefungen, Abbildungsrahmen, Tabellen | `css/skript.css`, `js/skript-kern.js` | eigene Abbildungen (Stereogramm, 3D, Projektionsskizze, Wachstum, Hexagon, Perowskit, Symbollegende) |
| Quiz | `css/quiz.css`, `js/quiz-core.js`, `js/quiz-seite.js` (`initQuiz`) | Fragenbank, Generatoren, Kapitel und Speichername (`js/quiz-kapitel.js`), Bildfunktion |
| Hilfen | Mechanik `js/help.js` (`initHelp`) | Texte `js/hilfetexte.js` |
| Formatierung HM-Symbole, Indizes | `js/format.js` | – |
| Offline, Versionsnummer | `js/seite.js` (`offline`, `versionEintragen`) | `sw.js` mit Dateiliste und Cache-Präfix |
| Werkzeuge | `tools/sync.mjs`, `check.mjs`, `moodle.mjs`, `skript-pdf.mjs`, `server.mjs` | `tools/moodle-export.mjs`, `tools/skript-pdf.mjs` (App-spezifische Angaben) |
| Vorlage für neue Apps | `vorlagen/app/` (lauffähige Muster-App, zugleich Musterseite) | – |
| Leitfaden | `LEITFADEN.md` | – |

Bewusst noch nicht gemeinsam: Anordnung der Tafeln und 3D-Ansicht (`view3d.js`); wird mit der 2D-App entschieden.

## Prüfung des Umbaus der Stereo-App

- Berechnete Stile (inklusive ::before/::after) und Lage aller Elemente in 51 Ansichten (App, Skript, Quiz; Laptop, iPad quer/hochkant, Telefon; hell/dunkel; geöffnete Abschnitte, Tooltip, ⓘ, Quizablauf bis zur Auswertung) vor und nach dem Umbau gleich. Einzige Abweichung: 5 Pixel in einer WebGL-Ansicht, die auch beim Wiederholen des alten Stands auftreten.
- Skript-PDF: 68 Seiten, gleicher Text.
- Moodle-Export vor und nach dem Umbau byte-gleich (367 Fragen).
- Speichername des Quiz unverändert (`stereo-quiz-v1`, `-entwurf`, `-lauf`), damit der Stand der Studierenden erhalten bleibt.

## Pull Requests

- manganite/crystallography-common#1 (erste Fassung, v0.1.0)
- manganite/crystallography-common#2 (v0.1.1: Server prüft Pfade richtig; Hinweis von Copilot in #44)
- manganite/stereography#44 (Umstellung auf die gemeinsame Grundlage, mit v0.1.1; gemergt 30.10.2026, Merge-Commit a02083c)
- Tags v0.1.0 und v0.1.1 von Thomas gesetzt; Releases angelegt.

## Reihenfolge der Veröffentlichung (Schritte 1–3 erledigt)

1. PR in crystallography-common mergen, Tag `v0.1.0` setzen (Release-Workflow legt das GitHub-Release an).
2. Stereo-App von `v0.1.0` neu synchronisieren (nur das Manifest ändert sich: Tag und Commit), PR mergen.
3. Release der Stereo-App (v1.11.0).
4. Danach: Konzept der 2D-App, neues Claude-Projekt, neues Repository aus `vorlagen/app/`.

## Nachträge (3.11.2026)

- **Stereo-App:** v1.11.0 (30.10.2026, auf crystallography-common v0.1.1) und v1.12.0 (31.10.2026: Aufstellung B im Modus „Kristallformen“, `blick=1–3` im Link für Verweise aus der 2D-App) veröffentlicht.
- **Reziprokes Gitter:** gehört in die 2D-App (Entscheidung Thomas, 30.10.2026; Details in `konzept-2d-app.md`).
- **Koordination der Repositories** (Entscheidung Thomas, November 2026, aus einem anderen Chat): Das Projektwissen steht als `CLAUDE.md` in den Repositories und wird per PR nachgeführt; offene Aufgaben stehen als GitHub Issues. Das ersetzt die getrennten Claude-Projekte je App (Abschnitt „Entscheidungen“) als Ort des Projektwissens.
