# CLAUDE.md – App-Familie Kristallographie

Gilt für alle Repositories der Familie: `crystallography-common` (dieses Repository) und die Apps
(`stereography`, `plane-groups`, weitere). Jede App hat eine eigene `CLAUDE.md`, die diese Datei
einbindet. Regeln für Inhalt, Gestaltung, Skript und Quiz stehen im Leitfaden, Aufbau und Werkzeuge
im README; was dort steht, wird hier nicht wiederholt. Der Leitfaden wird mit dieser Datei geladen:
@LEITFADEN.md

## Pflege dieser Dateien

- Ändert ein PR eine Entscheidung, eine Konvention oder einen Ablauf, wird `CLAUDE.md` (bzw.
  `LEITFADEN.md`) **im selben PR** nachgeführt. Die PR-Vorlage fragt das ab.
- **Jede Art von Information hat genau einen Ort**, damit nichts auseinanderläuft:

  | Was | Wo |
  |---|---|
  | Regeln für Inhalt, Gestaltung, Skript, Quiz, Technik (alle Apps) | `LEITFADEN.md` (common) |
  | Arbeitsweise, Abläufe, Entscheidungen mit Grund, Fallstricke, Literatur | `CLAUDE.md` (common bzw. App) |
  | Aufbau, Link-Adressen, Werkzeuge, Release-Ablauf einer App | `README.md` der App |
  | Offene Aufgaben, Ideen, offene Fragen, Stand laufender Arbeit | GitHub Issues des betroffenen Repos (Label `idee` für nicht Beauftragtes) |
  | Konzepte (ausführliche Begründungen, Entwürfe) | `docs/` des betroffenen Repos; nach der Umsetzung mit Statuskopf (was umgesetzt, was überholt, wo es jetzt steht) und nicht mehr nachgeführt |
  | Änderungen je Version | `CHANGELOG.md` |

  Bei Widerspruch zwischen einem Konzept und `CLAUDE.md` bzw. `LEITFADEN.md` gelten Letztere.
  Steht etwas schon an seinem Ort, wird anderswo nur darauf verwiesen (z. B. „Issue #35“), nicht
  wiederholt. Wird ein Issue erledigt, verschwindet der Verweis im selben PR.
- Die Repositories sind öffentlich; diese Dateien also auch.

## Arbeitsbereich

Die Repositories liegen nebeneinander in einem Arbeitsordner, damit eine Sitzung alle sieht. Der
Arbeitsordner ist selbst kein Repository (keine verschachtelten Repos, keine Submodule); Ordnername =
Repo-Name = Pfad auf GitHub Pages:

```
<arbeitsordner>/crystallography-common
<arbeitsordner>/stereography
<arbeitsordner>/plane-groups
```

- **VS Code:** `crystallography-common/kristallographie.code-workspace` öffnen (alle Repos in einem
  Fenster, Kopien des gemeinsamen Codes schreibgeschützt). Liegt in common, damit sie versioniert und
  überall gleich ist; eine neue App ergänzt dort ihren Ordner.
- **Welche `CLAUDE.md` Claude Code lädt:** die des Startordners und der Ordner darüber, samt
  `@`-Verweisen; die der Nachbarordner nicht. Die VS-Code-Erweiterung startet im Arbeitsbereich im
  ersten Ordner (common) und lädt nur diese Datei (mit `/context` geprüft, 3.11.2026). **Vor Arbeit an
  einer App deshalb deren `CLAUDE.md` lesen** (`../<app>/CLAUDE.md`). Startet Claude Code in einer App
  (App-Ordner allein öffnen oder `claude` dort), lädt deren `CLAUDE.md` diese Datei und den Leitfaden
  mit.
- **Lokal wie GitHub Pages:** `node crystallography-common/tools/server.mjs` bedient den Arbeitsordner
  unter http://127.0.0.1:8000/ (`/stereography/`, `/plane-groups/`; Links zwischen den Apps
  funktionieren).
- Den Arbeitsordner nicht in einen synchronisierten Ordner legen (iCloud, OneDrive, Dropbox): verträgt
  sich nicht mit Git.
- In einer Cloud-Sitzung fehlende Repositories klonen (`https://github.com/manganite/<name>`).
- Eine Einstiegsseite für die Familie ist geplant (Issue #12); sie käme als weiteres Repo daneben.

## Arbeitsweise mit Thomas

- Deutsch, Schweizer Schreibung (ss). Bei Unklarem nachfragen, nicht raten; Nichtwissen zugeben.
  Präzise, auf das Wesentliche beschränkt, nachprüfbar. Zielführende Vorschläge von sich aus sind
  erwünscht.
- Thomas ist Fachautor und gibt Skript und Quiz fachlich frei.

## Entscheidungen der Familie (mit Grund)

Die Regeln selbst stehen im Leitfaden; hier, warum.

- **Hilfeseite** (4.11.2026, Leitfaden Abschn. 5.3): Tooltips erklären einzelne Bedienelemente, das
  Skript die Begriffe; dazwischen blieb unklar, wie man mit der App eine Aufgabe löst.
- **ESLint** (4.11.2026, Leitfaden Abschn. 9): ein Prüfer ohne Kosten und Limit, seit das Copilot-Review
  ausfällt; ergänzt die Typprüfung um Befunde wie ungenutzte Namen, unerreichbaren Code oder versehentliche
  Zuweisungen.

## Git, PRs und Releases

- Jede Änderung auf einem eigenen Branch, dann PR nach `main`. CI (`test`, `typen`, `lint`, in Apps auch `pdf`)
  abwarten, das Review (nächster Punkt) einholen, Befunde prüfen und beantworten, dann Bericht an Thomas.
- **Review durch einen unabhängigen Agenten:** Vor dem Bericht prüft ein eigener Agent, der die Arbeit nicht
  kennt, den Diff des PR: Fehler, Randfälle, Widersprüche zu `CLAUDE.md` und `LEITFADEN.md`, fachliche
  Aussagen gegen Code und Quellen. Er bekommt nur Repo, Branch und Zweck des PR, nicht die Begründungen
  der Sitzung. Befunde wie die eines Reviewers behandeln (nachprüfen, beheben oder begründen), im Bericht
  nennen und im PR festhalten (Punkt „Review“ der PR-Vorlage), damit sie nachvollziehbar bleiben.
  Grund (4.11.2026): Das Copilot-Review ersetzt dies nicht mehr, weil dessen Nutzungslimit bei der
  Grösse der Familie nach wenigen Tagen aufgebraucht ist. Kommt trotzdem eines, wird es gleich behandelt;
  abgewartet wird es nicht.
- **Mergen nur auf ausdrückliches OK von Thomas.**
- **Einstellungen der Repos** (Regel „main schützen“, CodeQL in der erweiterten Einrichtung, About,
  Vorschaubild): `LEITFADEN.md` Abschn. 9. Den Schutz von `main` als Admin übergehen nur auf Thomas'
  Anweisung.
- **Release-Ablauf** (Release-PR, Tag, Workflows): README der App, Abschnitt „Versionen und
  Releases“. Unterschiede in common: README, Abschnitt „Entwicklung“. In den Apps prüft
  `tests/release.test.mjs` `js/version.js`, `sw.js` und CHANGELOG, nicht `CITATION.cff`; in common prüft
  `tests/sync.test.mjs` Version und CHANGELOG.
- **Wer die Release-Arbeit macht, setzt auch den Tag** (Vorgabe Thomas, 4.11.2026): in einer
  Cloud-Sitzung Thomas von Hand, weil dort der Tag-Push scheitert; in Claude Code lokal Claude Code,
  erst nach Thomas' Freigabe des Release und dem Merge des Release-PR. Vorher prüfen, dass
  `origin/main` der Release-PR ist (der erste Tag v1.4.0 der Stereo-App zeigte auf den Commit davor),
  danach, dass `release.yml` (in Apps auch `deploy.yml`) grün ist.
- **Commits und Tags mit der Noreply-Adresse:** global steht Thomas' private Adresse, GitHub lehnt den
  Push sonst ab (GH007). Deshalb in jedem Klon auf Thomas' Computer einmal
  `git config user.email 6277652+manganite@users.noreply.github.com` (lokal gesetzt 4.11.2026). Nicht in
  der Cloud-Sitzung: Dort committet Claude mit eigener, signierter Adresse; eine andere macht die Commits
  auf GitHub „Unverified“.
- Commits enden mit `Co-Authored-By: …`, in Sitzungen mit Link (claude.ai) zusätzlich mit
  `Claude-Session: …`; PR-Texte mit „🤖 Generated with Claude Code“ und, falls vorhanden, dem
  Sitzungslink.

## Grenzen der Cloud-Sitzung (claude.ai)

- Tag-Push und Tag-API scheitern (403); Tags und Releases legt dort Thomas an.
- GraphQL ist gesperrt, also kein `gh pr create`. Über REST: PR anlegen
  `gh api repos/manganite/<repo>/pulls -f title=… -f head=<branch> -f base=main -f body=…`
  (mit `-f` sendet `gh api` POST), mergen `gh api -X PUT …/pulls/N/merge`, Review-Threads
  auflösen `…/pulls/N/ccr/comments/ID/resolve`. Nur Repo-Endpunkte sind erlaubt.
- github.io ist nicht erreichbar; die Live-Seite lässt sich nicht selbst prüfen. Deploy-Status über
  `repos/…/deployments?environment=github-pages`.
- Thomas' Zotero ist erreichbar, wenn sein Computer verbunden ist (Zotero-Werkzeuge der Sitzung).

## Gemeinsamer Code: Ablauf einer Änderung

1. Änderung hier in `crystallography-common` (Branch, PR, Tests). Nie in `lib/common/` oder
   `tools/common/` einer App.
2. Release von common: Version in `js/version.js` und CHANGELOG, Release-PR, nach dem Merge der Tag
   (siehe „Git, PRs und Releases“).
3. Je App ein PR: `git checkout vX.Y.Z` in common, dann in der App
   `node tools/common/sync.mjs ../crystallography-common`; Tests der App laufen lassen
   (`tests/common.test.mjs` prüft die Kopie gegen das Manifest).
4. Je App über einen Release-PR veröffentlichen, wenn Thomas das will.

Bei einem Umbau ohne sichtbare Änderung (z. B. Umzug auf common, Stereo-App v1.11.0) vorher und nachher
vergleichen: berechnete Stile inkl. `::before`/`::after` und die Lage aller Elemente in allen Ansichten
mit Playwright, dazu Skript-PDF (Text) und Moodle-Export (bytegleich). Eigenschaften vor dem Hashen
sortieren (Reihenfolge variiert zwischen Browserstarts); einige Pixel Abweichung in WebGL-Ansichten
treten auch beim Wiederholen auf.

## Quiz: Prüfung und Rückmeldungen

Eine gemeinsame **Fragenliste** für alle Apps: Artifact https://claude.ai/artifact/YJBVwk6njpoyi48nPMUowt
(Speicher `befunde` und `rueckmeldungen`, Dokument je Frage bzw. Generator mit Schlüssel `<app>:<id>`,
z. B. `plane-groups:gl-2-03`). Filter nach App, Kapitel, Stufe, Status und offenen Punkten.

- Nur Thomas gibt Fragen frei: Urteil „In Ordnung“ bei einem Entwurf (`befunde`: `urteil`
  ok|aendern|offen, `notiz`, `zeit`). Danach setzt Claude in der Fragenbank `status: 'geprüft'`.
- Jede neue oder geänderte Frage geht auf `status: 'entwurf'` und in `befunde` auf `urteil: 'offen'`
  mit Notiz „Claude: …“ (was geändert, warum).
- Rückmeldungen zu geprüften Fragen stehen in `rueckmeldungen` (`notiz`, `von`, `stand` neu|erledigt,
  `antwort`, `zeit`). Nach dem Einarbeiten `stand: erledigt` und in `antwort`, was geändert wurde.
- Neu erzeugen, sobald sich Fragen geändert haben: im Arbeitsbereich mit allen Apps
  `node fragenliste/extract.mjs`, dann `fragenliste/fragenliste.html` mit der Adresse oben als `url`
  veröffentlichen (Fähigkeit `db` bleibt erhalten). Jede App liefert ihre Fragen über
  `tools/quiz-quelle.mjs`; eine neue App ergänzt die Liste der Ordner in `extract.mjs`.

## Vorschau einer App (nicht öffentlich)

Je App ein Artifact mit App, Skript, Quiz und `skript.pdf`; die Adresse steht in der `CLAUDE.md` der App.
Beim Neuveröffentlichen die Adresse als `url` angeben und die geänderten Dateien in `files` aufführen
(Dateien wie in der Offline-Liste von `sw.js`); `skript.pdf` vorher mit `node tools/skript-pdf.mjs`
erzeugen (in `.gitignore`).

## Neue App

Ablauf in `LEITFADEN.md` Abschn. 10 (inkl. `CLAUDE.md` und Tag-Regel für GitHub Pages; Letztere
fehlte beim ersten Release von plane-groups) und `vorlagen/README.md`.

## Literatur

- Quellen liegen in Thomas' Zotero. Zitiert wird mit gedruckten Seitenzahlen. Folien der Vorlesung nur
  als Massstab für Umfang und Begriffe, nie als Quelle.
- PDF-Seite ≠ gedruckte Seite: Hoffmann gedruckt = PDF − 12, Kleber gedruckt = PDF − 16. Bei Borchardt-Ott
  schwankt der Abstand (Kap. 5: − 7, Kap. 6: − 6, ab Kap. 7: − 5; geprüft 4.11.2026): Seitenzahl im Kopf der
  PDF-Seite ablesen.
  Borchardt-Ott Tab. 9.4 und viele Aufgaben liegen nur als Bild vor (Seite als Bild lesen).
- **Bücher nicht blind übernehmen:** Abbildungen und Lösungen nachrechnen (Lösungen bei Borchardt-Ott
  verweisen oft nur auf Abbildungen). Bekannte Fehler stehen in der `CLAUDE.md` der jeweiligen App.
- Keine Abbildungen aus Büchern oder Folien übernehmen, auch nicht in Quiz und Moodle-Export; nur
  selbst erzeugte Bilder.
