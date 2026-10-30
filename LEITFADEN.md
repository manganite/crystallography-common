# Leitfaden für die App-Familie

Dieser Leitfaden hält fest, was alle Lern-Apps der Familie gemeinsam haben: Zweck, Gestaltung, Bedienung, Aufbau von Skript und Quiz, Verzahnung und Technik. Er ist aus der ersten App ([Stereographische Projektion](https://github.com/manganite/stereography)) abgeleitet. Was sich als Code teilen lässt, steht in diesem Repository; alles andere hier als Regel.

Wo eine Regel für eine neue App nicht passt, wird sie hier geändert und nicht in der App stillschweigend umgangen.

## 1. Zweck und Zielgruppe

- **Familie:** je ein Themengebiet einer Einführung in die Kristallographie. Jede App hat drei Teile: die **App** als interaktive Werkbank, ein **Skript** zum Nachlesen und ein **Quiz** zum Üben.
- **Zielgruppe:** Studierende einer Einführungsvorlesung Kristallographie oder mit vergleichbarem Hintergrund.
- **Herkunft:** Die Apps sind aus der Vorlesung Kristallographie an der ETH Zürich entstanden. Das steht an passenden Stellen in App und Skript und in jedem Fall auf GitHub. Die Apps sollen aber **ohne die Vorlesung verständlich** sein: keine Verweise auf Vorlesung, Übungen oder Folien (Test `vorlesung.test.mjs` in jeder App).
- **Begleitung, nicht Ersatz:** App und Skript erklären anschaulich, mit wenigen Formeln, und decken einander fachlich ab. Das Skript erklärt alles, was die App zeigt.

## 2. Fachliche Grundlage

- **Begriffe** nach Borchardt-Ott & Sowa, *Kristallographie* (2018); **Symbole und Konventionen** nach *International Tables for Crystallography*, Vol. A (2006). Abweichende Namen aus ITA in Klammern.
- Weitere Quellen: Hoffmann, *Faszination Kristalle und Symmetrie* (2016), Schwarzenbach, *Kristallographie*, Kleber et al., *Einführung in die Kristallographie* (20. Aufl. 2020).
- **Umfang:** am Niveau dieser Bücher ausrichten, nicht weit darüber hinaus. Was darüber hinausgeht, ist im Skript als Vertiefung gekennzeichnet.
- **Absicherung:** Jede fachliche Aussage hat eine Quelle (Abschnitt, Seite, Abbildung). Zahlen werden nachgerechnet, möglichst in einem Test. Skriptkapitel und Quizfragen bekommen einen unabhängigen Prüfdurchgang, der den Entwurf nicht kennt.
- **Eigene Festlegungen** der App (z. B. eine Schwelle, eine Farbe) nennt das Skript ausdrücklich als solche.
- **Begriffe einheitlich** in App, Skript und Quiz, und über die Apps hinweg (z. B. Blickrichtung, Projektionsrichtung, Umkugel).

## 3. Sprache

- Oberfläche, Skript und Quiz auf **Deutsch** in Schweizer Schreibung (ss statt ß), Anrede im Quiz mit „Sie“, im Skript unpersönlich („man“).
- Kurze Sätze, keine undefinierten Begriffe, Fachwörter beim ersten Auftreten erklärt.
- Code-Kommentare, Commit-Nachrichten, CHANGELOG und README ebenfalls auf Deutsch.

## 4. Gestaltung

Die Grundlage steht in `css/base.css` und gilt unverändert für alle Apps.

- **Farben** als Variablen, für hell und dunkel (folgt dem System; `data-theme` erzwingt eine Variante). Flächen: `--bg`, `--surface`, `--paper`; Text: `--ink`, `--muted`; Linien: `--line`; Akzent: `--accent`, `--accent2`.
- **Farben der Symmetrie haben in allen Apps dieselbe Bedeutung:** `--ax2`, `--ax3`, `--ax4`, `--ax6` für Drehachsen nach Zähligkeit, `--dir1` bis `--dir3` für die drei Blickrichtungen (Positionen im Hermann-Mauguin-Symbol), `--fc0` bis `--fc7` für Formen bzw. unterscheidbare Objekte, bewusst verschieden von den Blickrichtungsfarben. Neue Bedeutungen bekommen neue Variablen in `base.css`, keine eigenen Farben in einer App.
- **Schriften:** Source Serif 4 für Titel und grosse Symbole, IBM Plex Sans für die Oberfläche, IBM Plex Mono für Zahlen in Reglern. Selbst gehostet (offline, keine Daten an Dritte).
- **Querstriche** (Drehinversion, negative Indizes) als eigene Linie knapp über der Ziffer (`.ov`), nie als `text-decoration: overline`. In SVG ebenso (`querstriche()` im Skript).
- **Hermann-Mauguin-Symbole und Indizes** immer über `format.js` (`hmHTML`, `hklHTML`).
- **Bildexport** (wo eine App Bilder anbietet): immer in den hellen Farben, Hintergrund durchsichtig.

## 5. Die App

Die App ist eine **Werkbank**: links die Bedienung, rechts die Darstellungen, darunter die Kenndaten. Bausteine in `css/app.css`.

### 5.1 Aufbau

- **Kopfzeile:** Titel (Source Serif) und Untertitel, Umschalter der Modi (`.tabs`), rechts „Skript“, „Quiz“, „Link kopieren“ und „?“ (Erste Schritte).
- **Seitenleiste** (`.side`), auf Laptop und iPad quer angeheftet mit eigenem Scrollbereich: Karten (`.card`) mit Überschrift in Kapitälchen-Stil. Auswahl und Standardanzeige oben; alles Weitere in einklappbaren Abschnitten (`.sect`), die unter ihrer Überschrift nennen, was sie enthalten (`.sumhint`).
- **Tafeln** (`.panel`) mit Kopf (Titel, Werkzeuge, Export), Darstellung, Legende (`.legend`) und Fusszeile.
- **Kenndaten** (`.info`) unter den Tafeln: grosses Symbol (`.hm-big`), Eckdaten (`.facts`), Erläuterungen einklappbar (`.explain`), Links ins Skript (`.skript-term`).
- **Gruppenwahl** als Knöpfe je Kristallsystem (`.picker`, `.sysrow`, `.pgb`), Aufstellungen in einer Zeile darunter, nur wenn nötig.
- **Anordnung der Tafeln** (`.layout`) legt jede App selbst fest. Muster der ersten App: zwei gleich grosse Tafeln nebeneinander; iPad hochkant untereinander; Telefon eine Tafel oben angeheftet mit Umschalter (`.figswitch`), Bedienung darunter.

### 5.2 Bedienprinzipien

- **Weniger auf einmal:** Standardmässig sichtbar ist, was man aus Lehrbuch und Vorlesung von der Darstellung erwartet. Weiteres liegt in eingeklappten Abschnitten an klar ersichtlicher Stelle. Kein globaler Einfach/Erweitert-Modus.
- **Kein versteckter Zustand:** Ein Schalter, der gerade nicht wirkt, wird gesperrt und nicht abgewählt; der Grund steht darunter (`.check .why`). Zwei Wege zum selben Ergebnis vermeiden.
- **Vorhersagbar:** Zurücksetzen je Abschnitt (`.resetbtn`) und „Alle Einstellungen zurücksetzen“.
- **Zustand in der Adresse** (`#m=…&…`), lesbar und stabil, erst geschrieben, wenn vom Standard abgewichen wird; „Link kopieren“ für Folien und Moodle. Zusätzlich im Browser gespeichert; ein Link hat Vorrang.
- **Geräte:** Laptop und iPad sind Ziel, Telefon nutzbar. Touch-Ziele mindestens 40 px, Trefferkreise für Punkte in Grafiken 44 px. Auf dem Telefon entfallen Export und „Link kopieren“.

### 5.3 Hilfen

- **Erste Schritte:** Karte oben in der Seitenleiste beim ersten Besuch, drei bis vier Schritte mit Knopf, wegklickbar, über „?“ wieder zu öffnen; nicht bei Aufruf über einen Link.
- **Tooltips** am Laptop (Maus verzögert, Tastaturfokus), **ⓘ-Erklärungen** je Abschnitt auf Touch-Geräten. Mechanik in `help.js`, Texte in der App (`hilfetexte.js`). Kurz, Begriffe wie im Skript; keine ausführlichen Erklärseiten in der App, dafür gibt es das Skript.

## 6. Das Skript

Eigene Seite `skript.html`. Bausteine in `css/skript.css` und `js/skript-kern.js`.

- **Aufbau der Seite:** links das angeheftete Inhaltsverzeichnis, rechts der Text in Lesebreite (etwa 70 Zeichen); auf iPad hochkant und Telefon das Inhaltsverzeichnis oben, einklappbar. Verankerte Abschnitte (`skript.html#zonen`).
- **Einleitung** „So ist das Skript aufgebaut“ mit Legende der Kennzeichnungen (`.box.aufbau`).
- **Jedes Kapitel:** Lernziele (`.box.ziele`), Text in kurzen Abschnitten, Merksätze (`.box.merke`), Abbildungen, Zusammenfassung (`.box.zusammen`), Quellen (`.quellen`), am Ende „Lernziele prüfen“ ins Quiz mit Kapitel und Stufe (`.quizlink`).
- **Kennzeichnung:** Der **Grundstoff** ist unmarkiert. Gekennzeichnet werden:
  - **Vertiefung** (`.box.vertiefung` mit Thema; ganze Abschnitte und Kapitel mit `data-level="vertiefung"`, Etikett auch im Inhaltsverzeichnis). Jede Vertiefung beginnt mit einem Satz, welchen Grundstoff sie weiterführt und wozu. Keine Aussage zur Klausur. Vertiefungskapitel stehen am Schluss hinter einem Trenner (`.teil`) und beginnen mit einem Kasten „Voraussetzungen“ (`.box.bezug`).
  - **Grundlagen** (`.box.grundlagen`): Grundwissen, das das Skript voraussetzt (z. B. Gruppen, Miller-Indizes).
  - **In der App** (`.box.app`): Bedienhinweise, klein und grau, meist am Abschnittsende.
  - Kein Schalter zum Einklappen; höchstens ein Vertiefungskasten je Abschnitt.
- **Abbildungen** kommen aus dem Code der App und sehen aus wie dort. Jede Abbildung ist eine Link-Adresse der App (`data-app="#…"`) und führt mit „In der App öffnen“ genau in diese Ansicht. Aufwendige Abbildungen (3D) laden erst beim Hineinscrollen (`nachladen`). Keine Abbildungen aus Büchern oder Folien (Bildrechte); wo eine Abbildung Vorbild ist, steht „nach … Abb. …“.
- **PDF:** `tools/skript-pdf.mjs` erzeugt eine A4-Fassung mit Inhaltsverzeichnis und Lesezeichen; bei jedem Release auf der Seite und als Anhang.

## 7. Das Quiz

Eigene Seite `quiz.html`. Logik in `js/quiz-core.js`, Seite in `js/quiz-seite.js`, Stile in `css/quiz.css`; die App liefert Fragen, Kapitel und die Bildfunktion.

- **Zweck:** Übung zu den Lernzielen des Skripts, nur Themen aus App und Skript. Kein Ersatz für ein Moodle-Quiz, keine Aussage zur Klausur.
- **Drei Stufen:** 1 Grundlagen (Grundstoff, ein Begriff, ein Schritt, ein Bild), 2 Anwendung (Grundstoff, mehrschrittig, auch Randthemen), 3 Vertiefung (zusätzlich die Vertiefungen des Skripts). Stufe 3 bedeutet mehr Stoff, nicht unbedingt schwierigere Fragen. Höhere Stufen enthalten Fragen der niedrigeren (Anteile in `quiz-core.js`).
- **Fragetypen:** Einfachauswahl, Mehrfachauswahl, Frage mit Bild, Bilder als Antworten, Bild mit Bildern als Antworten. Bilder kommen aus dem Code der App.
- **Ablenker** bilden typische Fehler ab; die Rückmeldung benennt den Fehler der gewählten Antwort.
- **Rückmeldung sofort:** richtig/falsch, Erklärung, Lernziel, „Im Skript nachlesen“ und, wo sinnvoll, „In der App öffnen“. Link und Frage müssen zusammenpassen.
- **Erzeugte Fragen** aus den Daten der App sind erlaubt: höchstens 50 % eines Quiz, je Generator höchstens 30 %.
- **Freigabe:** Nur Fragen mit `status: 'geprüft'` erscheinen; „Auch ungeprüfte Fragen zeigen“ (`?entwurf`) nimmt Entwürfe dazu. „Geprüft“ heisst fachlich korrekt; die Formulierung darf danach noch besser werden.
- **Fortschritt** nur lokal im Browser (kein Konto, kein Server). Der Name des Speichers einer App wird nie geändert.
- **Moodle-Export:** `tools/moodle-export.mjs` in der App (Moodle-XML, Bilder als eingebettete SVG, Kategorien nach Kapitel und Stufe).

## 8. Verzahnung

- **Innerhalb einer App:** App → Skript (Kopfzeile, Begriffe in der Infobox), Skript → App (jede Abbildung), Skript → Quiz („Lernziele prüfen“), Quiz → Skript und App (Rückmeldung). Links aus dem Quiz öffnen einen neuen Tab, damit das Quiz offen bleibt.
- **Zwischen den Apps:** über Link-Adressen, z. B. von einer Ebenen- oder Raumgruppe zu ihrer Punktgruppe im Stereogramm. Die Link-Adressen einer App sind damit eine **Schnittstelle**: Ihr Format steht im README der App, bleibt stabil (alte Links werden umgerechnet, nie ungültig) und ist durch Tests abgesichert.
- **Querverweise im Skript** auf Skripte anderer Apps mit voller Adresse und Anker.
- Geplant: ein Umschalter zwischen den Apps in der Kopfzeile, sobald es die zweite App gibt.

## 9. Technik

- **Statische Web-App ohne Build-Schritt**, gehostet auf GitHub Pages. Ordner: `index.html`, `skript.html`, `quiz.html`, `js/`, `lib/` (Fremdcode und `lib/common/`), `icons/`, `tests/`, `tools/`.
- **Gemeinsame Dateien** als Kopie mit fester Version in `lib/common/` und `tools/common/` (siehe README). Nie in der App ändern.
- **Offline:** Service Worker mit eigener Cache-Kennung je App; die Offline-Liste deckt alle Dateien ab (Test). Neue Version beim nächsten Öffnen mit Netz.
- **Als Web-App** auf dem Homescreen installierbar (Manifest, Icons).
- **Tests** mit `node --test`, ohne Abhängigkeiten; Browser-Durchläufe mit Playwright, wo nötig.
- **Versionen** nach Semantic Versioning, CHANGELOG nach *Keep a Changelog*. Die Live-Seite ändert sich **nur bei einem Release-Tag** `vX.Y.Z`, der zu `js/version.js` passt; `main` sammelt geprüfte Änderungen. Der Tag wird lokal gesetzt (mit der Noreply-Adresse des GitHub-Kontos), nach `git fetch` und Prüfung des Commits.
- **GitHub-Auftritt:** README mit Badges, Beschreibung und Themen (About), `CITATION.cff`, Lizenz MIT.
- **Datenschutz:** keine Daten an Dritte, keine externen Schriften oder Skripte zur Laufzeit.

## 10. Eine neue App anlegen

1. Leeres Repository auf GitHub anlegen (Name auf Englisch, wie `stereography`).
2. Dateien aus `vorlagen/` übernehmen und die Platzhalter ersetzen (siehe `vorlagen/README.md`).
3. `node tools/sync.mjs <neue App>` von einem Release-Tag dieses Repositories.
4. Konzept der App als Dokument festhalten (Inhalte, Modi, Link-Adressen, Kapitel des Skripts), dann App, Skript und Quiz in dieser Reihenfolge.
5. Die neue App in die Tabelle im README dieses Repositories und in die Verzahnung (Abschnitt 8) aufnehmen.

## 11. Offene Punkte

- **Anordnung der Tafeln** (`.layout`) und 3D-Ansicht teilen, sobald die zweite App zeigt, wie viel davon gemeinsam ist.
- **Umschalter zwischen den Apps** und eine gemeinsame Startseite (manganite.github.io).
- **Musterseite** mit allen Bausteinen in hell und dunkel, zum Prüfen von Änderungen an den gemeinsamen Stilen.
