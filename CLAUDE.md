# CLAUDE.md – App-Familie Kristallographie

Gilt für alle Repositories der Familie: `crystallography-common` (dieses Repository) und die Apps
(`stereography`, `plane-groups`, weitere). Jede App hat eine eigene `CLAUDE.md`, die zuerst auf diese
Datei verweist. Regeln für Inhalt, Gestaltung, Skript und Quiz stehen in [LEITFADEN.md](LEITFADEN.md),
Aufbau und Werkzeuge im README; was dort steht, wird hier nicht wiederholt.

## Pflege dieser Dateien

- Ändert ein PR eine Entscheidung, eine Konvention oder einen Ablauf, wird `CLAUDE.md` (bzw.
  `LEITFADEN.md`) **im selben PR** nachgeführt. Die PR-Vorlage fragt das ab.
- Hierher gehört, was dauerhaft gilt. Offene Aufgaben und der Stand laufender Arbeit gehören in GitHub
  Issues bzw. `LEITFADEN.md` Abschn. 11, nicht in `CLAUDE.md`.
- Die Repositories sind öffentlich; diese Dateien also auch.

## Arbeitsbereich

Die Repositories liegen nebeneinander in einem Ordner, damit eine Sitzung alle sieht:

```
<ordner>/crystallography-common
<ordner>/stereography
<ordner>/plane-groups
```

In einer Cloud-Sitzung fehlende Repositories klonen (`https://github.com/manganite/<name>`).

## Arbeitsweise mit Thomas

- Deutsch, Schweizer Schreibung (ss). Bei Unklarem nachfragen, nicht raten; Nichtwissen zugeben.
  Präzise, auf das Wesentliche beschränkt, nachprüfbar. Zielführende Vorschläge von sich aus sind
  erwünscht.
- Thomas ist Fachautor und gibt Skript und Quiz fachlich frei.

## Git, PRs und Releases

- Jede Änderung auf einem eigenen Branch, dann PR nach `main`. CI (`test`, in Apps auch `pdf`) und
  Copilot-Review abwarten, Befunde prüfen und beantworten, dann Bericht an Thomas.
- **Mergen nur auf ausdrückliches OK von Thomas.**
- Releases über einen eigenen Release-PR: Version und CHANGELOG, in den Apps zusätzlich `sw.js` und
  `CITATION.cff` (`tests/release.test.mjs` prüft `js/version.js`, `sw.js` und CHANGELOG, nicht
  `CITATION.cff`).
- **Tags setzt Thomas lokal**, mit der Noreply-Adresse, sonst lehnt GitHub den Push ab (GH007,
  „email privacy restrictions“). Vorher `git fetch` und `git log --oneline -1 origin/main` prüfen
  (der erste Tag v1.4.0 der Stereo-App zeigte auf den Commit vor dem Release-PR):
  `git -c user.email=6277652+manganite@users.noreply.github.com tag -a vX.Y.Z -m "…" origin/main`
- Commits enden mit `Co-Authored-By: …` und `Claude-Session: …`; PR-Texte mit
  „🤖 Generated with Claude Code“ und dem Sitzungslink.

## Grenzen der Cloud-Sitzung (claude.ai)

- Tag-Push und Tag-API scheitern (403); Tags und Releases legt Thomas an.
- GraphQL ist gesperrt, also kein `gh pr create`. Über REST: PR anlegen
  `gh api repos/manganite/<repo>/pulls`, mergen `gh api -X PUT …/pulls/N/merge`, Review-Threads
  auflösen `…/pulls/N/ccr/comments/ID/resolve`. Nur Repo-Endpunkte sind erlaubt.
- github.io ist nicht erreichbar; die Live-Seite lässt sich nicht selbst prüfen. Deploy-Status über
  `repos/…/deployments?environment=github-pages`.
- Thomas' Zotero ist erreichbar, wenn sein Computer verbunden ist (Zotero-Werkzeuge der Sitzung).

## Gemeinsamer Code: Ablauf einer Änderung

1. Änderung hier in `crystallography-common` (Branch, PR, Tests). Nie in `lib/common/` oder
   `tools/common/` einer App.
2. Release von common: Version in `js/version.js` und CHANGELOG, Release-PR, Thomas setzt den Tag.
3. Je App ein PR: `git checkout vX.Y.Z` in common, dann in der App
   `node tools/common/sync.mjs ../crystallography-common`; Tests der App laufen lassen
   (`tests/common.test.mjs` prüft die Kopie gegen das Manifest).
4. Je App über einen Release-PR veröffentlichen, wenn Thomas das will.

Bei einem Umbau ohne sichtbare Änderung (z. B. Umzug auf common, Stereo-App v1.11.0) vorher und nachher
vergleichen: berechnete Stile inkl. `::before`/`::after` und die Lage aller Elemente in allen Ansichten
mit Playwright, dazu Skript-PDF (Text) und Moodle-Export (bytegleich). Eigenschaften vor dem Hashen
sortieren (Reihenfolge variiert zwischen Browserstarts); einige Pixel Abweichung in WebGL-Ansichten
treten auch beim Wiederholen auf.

## Neue App

Ablauf in `LEITFADEN.md` Abschn. 10 (inkl. `CLAUDE.md` und Tag-Regel für GitHub Pages; Letztere
fehlte beim ersten Release von plane-groups) und `vorlagen/README.md`.

## Literatur

- Quellen liegen in Thomas' Zotero. Zitiert wird mit gedruckten Seitenzahlen. Folien der Vorlesung nur
  als Massstab für Umfang und Begriffe, nie als Quelle.
- PDF-Seite ≠ gedruckte Seite: Hoffmann gedruckt = PDF − 12, Kleber gedruckt = PDF − 16.
  Borchardt-Ott Tab. 9.4 und viele Aufgaben liegen nur als Bild vor (Seite als Bild lesen).
- **Bücher nicht blind übernehmen:** Abbildungen und Lösungen nachrechnen (Lösungen bei Borchardt-Ott
  verweisen oft nur auf Abbildungen). Bekannte Fehler stehen in der `CLAUDE.md` der jeweiligen App.
- Keine Abbildungen aus Büchern oder Folien übernehmen, auch nicht in Quiz und Moodle-Export; nur
  selbst erzeugte Bilder.
