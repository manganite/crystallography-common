# Vorlage für eine neue App

`vorlagen/app/` ist eine lauffähige **Muster-App** mit allen gemeinsamen Bausteinen: Werkbank (Kopfzeile, Seitenleiste, Tafeln, Kenndaten, Erste Schritte, Hilfen, Telefon), Skript (Inhaltsverzeichnis, alle Kastentypen, Vertiefungskapitel, Abbildung mit „In der App öffnen“), Quiz (zwei Beispielfragen als Entwurf), Service Worker, Tests, Workflows, README, CHANGELOG, CITATION. Sie dient zugleich als **Musterseite**, um Änderungen an den gemeinsamen Stilen hell und dunkel anzusehen.

## Ansehen

```bash
node tools/sync.mjs vorlagen/app          # lib/common/ und tools/common/ anlegen (nicht im Repository)
cd vorlagen/app && python3 -m http.server 8000
```

## Neue App anlegen

1. Leeres Repository auf GitHub anlegen (Name auf Englisch, z. B. `plane-groups`), klonen.
2. Inhalt von `vorlagen/app/` hineinkopieren (ohne `lib/common/` und `tools/common/`).
3. Gemeinsame Dateien von einem Release-Tag übernehmen:
   ```bash
   cd crystallography-common && git checkout vX.Y.Z
   node tools/sync.mjs ../plane-groups
   ```
4. Ersetzen (alle Fundstellen, z. B. mit Suchen und Ersetzen im Editor):

   | Platzhalter | Wo | Ersetzen durch |
   |---|---|---|
   | `Muster-App` | Titel in allen Seiten, Manifest, README, CITATION, Werkzeuge | Name der App |
   | `muster-app` | Adressen in README, CITATION, `tools/skript-pdf.mjs` | Name des Repositories |
   | `muster-quiz` | `js/quiz-kapitel.js`, `tests/common.test.mjs` | Präfix für den Speicher des Quiz (danach nie ändern) |
   | `muster-` | `sw.js` (Cache), `js/main.js` (`muster-intro`) | eigenes Präfix (danach nie ändern) |
   | Icons | `icons/` | eigene Icons (gleicher Stil: Motiv der App auf hellem Grund) |

5. Muster ersetzen: `js/main.js` (Logik der App, Bausteine und Klassennamen beibehalten), Anordnung der Tafeln im `<style>` von `index.html`, `js/hilfetexte.js`, Skriptkapitel, Fragen.
6. Offline-Liste in `sw.js` nachführen, sobald Dateien dazukommen (`tests/release.test.mjs` meldet fehlende).
7. GitHub: Pages auf „GitHub Actions“ stellen, Beschreibung und Themen setzen; die App in die Tabelle im README von crystallography-common aufnehmen.

Regeln für Gestaltung, Bedienung, Skript und Quiz: [LEITFADEN.md](../LEITFADEN.md).
