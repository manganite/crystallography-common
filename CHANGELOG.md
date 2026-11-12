# Changelog

Alle nennenswerten Änderungen an den gemeinsamen Dateien werden hier festgehalten.

Das Format folgt [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), die Versionsnummern folgen [Semantic Versioning](https://semver.org/lang/de/). Solange die Version mit 0 beginnt, kann sich die Schnittstelle zwischen zwei Versionen ändern; der Abschnitt „Geändert“ sagt dann, was eine App anpassen muss.

## [Unreleased]

### Geändert

- **Leitfaden 5.2, 7, 8, 9, 10: Entwicklung vor Stabilität** (Entscheidung Thomas, #126): Solange eine App in Entwicklung ist, dürfen sich Link-Adressen und Speicher ohne Umrechnung ändern; Code zum Umrechnen alter Links und Speicherstände wird entfernt. Geänderte Bedeutung heisst neuer Schlüssel, geändertes Format neue Version; Bruch des Link-Formats als MINOR mit Hinweis im CHANGELOG. Das gilt auch für den Lernstand (Quiz, Experimente). Links und Anker, die eine andere App nutzt, nur mit PR dort und abgestimmten Releases. Stabil werden Link-Adressen und Speicher erst, wenn die App ihre endgültige Form erreicht hat; die `CLAUDE.md` der App vermerkt den Stand. READMEs der Vorlage entsprechend. Für die Apps: Stand in der `CLAUDE.md` vermerken, Umrechnungen alter Links und Speicherstände entfernen (eigene PRs).

### Behoben

- **`tools/skript-pdf.mjs` mit vorhandenem Chromium** (#125): Wie `kontraste.mjs` und `hilfe-bilder.mjs` nimmt das Werkzeug jetzt den Pfad eines vorhandenen Chromium aus der Umgebungsvariable (oder der neuen Option `chrome`); so entsteht `skript.pdf` auch dort, wo Playwright seinen eigenen Browser nicht laden kann (Cloud-Sitzung). Die Variable heisst jetzt neutral `CHROMIUM_PFAD` statt `KONTRASTE_CHROME`, weil sie nicht mehr nur die Kontraste betrifft; der alte Name gilt nicht mehr. Für die Apps: eigene Werkzeuge mit der Variable (in plane-groups `tools/entwurf-pruefen.mjs`) im PR der Übernahme umstellen.
- **CI ohne apt** (#128): Der Browser für die Tests wird ohne `--with-deps` installiert, also ohne Systempakete über `apt`; am 11.11.2026 scheiterten die Jobs mehrfach, weil der Runner die Paketquellen von Ubuntu nicht erreichte. Ebenso in den Workflows der Vorlage (`ci.yml`, `deploy.yml`, `release.yml`). Für die Apps: dieselbe Änderung in ihren Workflows.

## [0.16.0] - 2026-11-09

Experimente ab 6 je Modus nach Kapiteln gegliedert (#107); Regel und Prüfhelfer für Tooltips, Hinweise für Maus und Touch nach dem benutzten Gerät, Browsertests in der CI (#114); zweistellige Nummern der Experimente nicht mehr abgeschnitten. Für die Apps: ohne Anpassung übernehmbar (ohne `kapitel` bleibt die Liste flach); danach `kapitel` je Experiment und der Tooltip-Test der Vorlage mit gekürzten Texten (Einzelheiten unter „Neu“).

### Neu

- **Experimente nach Kapiteln** (`ablauf.js`, `hilfe-seite.js`, #107, Leitfaden 5.3; Entscheidungen Thomas, 9.11.2026): Ab 6 Experimenten in einem Modus gliedern die Liste in der App und die Hilfeseite sie nach den Kapiteln des Skripts, je Kapitel mit Titel (Nummer und Kurztitel wie im Quiz, für Screenreader mit „Kapitel“ davor; in der Seitenleiste als Beschriftung der Liste mit `aria-labelledby`, auf der Hilfeseite als Überschrift), durchgehend nummeriert. Neues Feld `kapitel` in `Ablauf` und `Erzeugt`, neue Option `kapitel` (`KAPITEL` der App) in `ablaufKarte`, `HilfeDaten` und `pruefeAblaeufe`, dritter Parameter von `listeHTML` (meldet unbekannte Kapitel und ab der Schwelle fehlende); `nachKapitel`, `kapitelTitel` und `GLIEDERN_AB` exportiert. Ohne Kapitel bleibt die Liste flach wie bisher. Vorlage nachgeführt (Daten, `main.js`, `hilfe-daten.js`, Test). Für die Apps: jedem Experiment `kapitel` geben und `kapitel: KAPITEL` an `ablaufKarte`, in `js/hilfe-daten.js` und im Test an `pruefeAblaeufe` übergeben; erzeugte Experimente in ihr Kapitel einordnen.
- **Tooltips prüfen** (`help.js`, #114, Leitfaden 5.3; Entscheidungen Thomas, 9.11.2026): `pruefeTooltips(html, tips, { ohne, max })` meldet für die Tests der App Bedienelemente mit `id` in `index.html` ohne Tooltip (ausser den Ausnahmen in `ohne`), veraltete Ausnahmen, ein `title` neben einem Tooltip (der Browser zeigte zwei) und Tooltips über `TIP_MAX` (120) Zeichen. Regel im Leitfaden: jedes Bedienelement mit Tooltip, ein kurzer Satz als Richtwert; ausgenommen selbsterklärende Links, Schliessen „×“, Export-Knöpfe mit Text und die Köpfe einklappbarer Abschnitte. Vorlage: Test ergänzt, Tooltip für „Link kopieren“ in `TIPS` statt als `title`, Tooltip von „Alle Einstellungen zurücksetzen“ gekürzt. Für die Apps: Test nach der Vorlage übernehmen (Ausnahmen je App in `ohne`), zu lange Tooltips kürzen (Ausführlicheres ins ⓘ; heute über 120 Zeichen: stereography 28, plane-groups 23), `title` an Bedienelementen mit Tooltip entfernen.
- **Browsertests in der CI** (`tests/browser/`, Job `browser`, #114): zuerst für `help.js` mit Maus, Tastatur und Touchscreen, auch auf einem Gerät mit `pointer: coarse`. Für die Apps: nichts anzupassen.

### Geändert

- **`CLAUDE.md`, Übernahme in die Apps** (#121): Offene PRs einer App, die nur `CHANGELOG.md` berühren, halten eine Übernahme nicht auf (Entscheidung Thomas, 9.11.2026). Für die Apps: nichts anzupassen.
- **Hilfeseite: Experimente ohne Modus** (`hilfe-seite.js`, #107) erscheinen wie in der App in jedem Modus, nicht nur im ersten. Für die Apps: nichts anzupassen (alle Experimente haben einen Modus).
- **Texte für Maus und Touch und das ⓘ nach dem benutzten Gerät** (`help.js`, `css/app.css`, #114): `help.js` setzt `data-zeiger` (`maus` oder `touch`) an `<html>`; `.only-fine` und `.only-coarse` folgen dem zuletzt benutzten Gerät statt nur der Media Query (vorher sagte die Karte „Erste Schritte“ auf einem Laptop mit Touchscreen „Das ⓘ … erklärt“, obwohl Tooltips erschienen). Ein Stift zählt als Touch. Das ⓘ erscheint ausserdem ab dem ersten Tippen (`data-touch`), auch wenn der Browser `hover: hover` meldet; meldet er `hover: none`, bleibt es wie bisher immer sichtbar. Vor der ersten Eingabe gilt die Media Query wie bisher. Für die Apps: nichts anzupassen.

### Behoben

- **Zweistellige Nummern der Experimente** (`css/app.css`, #107): Ab zehn Experimenten wurde die Nummer links abgeschnitten („0.“ statt „10.“); die Liste hat jetzt Platz für zwei Stellen. Für die Apps: nichts anzupassen.

## [0.15.1] - 2026-11-09

Tooltips auch auf Laptops mit Touchscreen. Für die Apps: nichts anzupassen.

### Geändert

- **Leitfaden 5.3 und `CLAUDE.md`:** Alles Weitere zur Hilfe (vollständige Anleitung, Tooltips, typische Fragen) sammelt jetzt #114 statt #110. Für die Apps: nichts anzupassen.

### Behoben

- **Tooltips auf Laptops mit Touchscreen** (`help.js`, #114): Tooltips erschienen nur, wenn der Browser die Maus als primäres Zeigegerät meldete (`(hover: hover) and (pointer: fine)`). Edge und Chrome unter Windows melden auf Laptops mit Touchscreen oft `pointer: coarse`, auch mit angeschlossener Maus; dann fehlten alle Tooltips (gemeldet von Thomas, Edge mit Maus). Massgebend ist jetzt das zuletzt benutzte Gerät: Maus (Tooltip beim Überfahren, auch über Polen mit `showTipAt`), Tastatur (beim Fokus) oder Touchscreen (kein Tooltip, auch nicht beim Tippen in ein Eingabefeld). Leitfaden 5.3 nachgeführt. Für die Apps: nichts anzupassen.

## [0.15.0] - 2026-11-08

Hilfeseite (#24): Anleitungen aus den Erste Schritten mit Bildern der Bedienung, Experimente als Liste; „?“ führt zur Hilfeseite. Für die Apps: Hilfeseite nach der Vorlage anlegen (Einzelheiten unter „Neu“).

### Neu

- **Hilfeseite** (#24, Leitfaden 5.3): `js/hilfe-seite.js` baut aus den Daten der App (`js/hilfe-daten.js`: Modi, Erste Schritte, Experimente) die Seite `hilfe.html`: je Modus die Erste Schritte als Anleitung mit Bildern der Bedienung und „In der App zeigen“, danach die Experimente als Liste mit „In der App ausprobieren“ (`?experiment=<id>`; in der App startet `experimentAusAdresse` das Experiment). Stile in `css/hilfe.css` (nach `skript.css`). `tools/hilfe-bilder.mjs` erzeugt die Bilder (Ausschnitt um das Bedienelement aus `zeige`, umrahmt, hell); `pruefeHilfe` prüft im Test der App Bilder und Bedienelemente. Neue Felder `zeige` (Bedienelement im Bild) und `bild` (Link-Adresse des Bildes, nach einer Aktion) im Schritt (`ablauf.js`, geprüft von `pruefeAblaeufe`); `ohneHTML` aus `ablauf.js` exportiert (Alternativtexte). Vorlage mit `hilfe.html`, `js/hilfe.js`, `js/hilfe-daten.js`, Bildern unter `hilfe/`. Für die Apps: Seite, Daten und Bilder nach der Vorlage anlegen; `zeige` in den Erste Schritten ergänzen, nach einer Aktion auch `bild` (oder die Handlung als Link-Adresse schreiben, dann gibt es auch „In der App zeigen“); „?“ als Link auf `hilfe.html` statt Knopf, dabei Klick-Handler und `aria-expanded` von `help-open` entfernen und dessen Tooltip anpassen; `experimentAusAdresse(karte, ids, oeffnen)` aufrufen (öffnet den Abschnitt „Experimente“ vor dem Start); `sw.js` (Seite in `PAGES`, Dateien und Bilder in `FILES`), `deploy.yml` (`hilfe.html`, `hilfe`), `tests/release.test.mjs` (`hilfe.html` und Ordner `hilfe/` in der Offline-Liste) und den Test aus `tests/common.test.mjs` der Vorlage übernehmen.

### Geändert

- **„?“ führt zur Hilfeseite** (Leitfaden 5.1, 5.3; Entscheidung Thomas, 4.11.2026): Die Erste Schritte öffnet es nicht mehr; sie erscheinen beim ersten Aufruf eines Modus und nach „Alle Einstellungen zurücksetzen“. `a.helpbtn` in `css/app.css` für den Link; „?“ auf Touch-Geräten 40 px statt 36 px (Leitfaden 5.2). Für die Apps: siehe oben.
- **Leitfaden 5.3:** festgehalten, dass die Erste Schritte nicht erscheinen, solange die Adresse einen Zustand enthält, auch nach dem Neuladen (Entscheidung Thomas, 4.11.2026; in beiden Apps schon so). Die Vorlage wendet jetzt beim Laden die Adresse an und übernimmt nur bekannte Gruppen. Für die Apps: nichts anzupassen.

## [0.14.0] - 2026-11-08

Barrierefreiheit: Screenreader lesen HM-Symbole, Indizes und Querstriche genauer; Kontraste nach WCAG 2.2 gemessen und die Farben (hell) angepasst. Für die Apps: eigene Eingabefelder mit `var(--field)` umranden; Befunde in den eigenen Abbildungen nach plane-groups#114 und stereography#119; sonst nichts anzupassen.

### Neu

- **Ansage von HM-Symbolen und Indizes** (`format.js`, #82): `hmHTML` und `hklHTML` liefern das Symbol als `<span role="img">` mit Ansagetext; neu `hmLabel` und `hklLabel` dafür. Ein Screenreader liest die Zeichen einzeln, den Querstrich „quer“, den Bruchstrich „über“ (4̄2*m* „4 quer, 2, m“, (1̄10) „1 quer, 1, 0“). Die Ansage der Experimente liest dieselben Texte. Leitfaden 4 und `CLAUDE.md` nachgeführt. Für die Apps: nichts anzupassen; Tests, die die Ausgabe von `hmHTML`/`hklHTML` wörtlich erwarten, vergleichen künftig mit dem Aufruf selbst.
- **Kontraste messen** (#65): `tools/kontraste.mjs` misst Text und SVG-Grafik der gerenderten Seiten nach WCAG 2.2, hell und dunkel (Leitfaden 5.4, README „Entwicklung“); `tests/kontraste.test.mjs` prüft die Farbpaare der gemeinsamen Stile ohne Browser. Für die Apps: nichts anzupassen; das Werkzeug kommt als `tools/common/kontraste.mjs` mit.

### Geändert

- **Farben, hell** (`css/base.css`, #65): `--ax2` und `--dir2` #2f855a → #2b7a53 (als Text auf Karten 4,31 : 1), `--dir3` #a16207 → #9b5f07, `--accent2` #c2410c → #bc3f0c (im Warnkasten 4,39 : 1), als Beschriftung `--fc4` #dd6b20 → #b6581a, `--fc5` #7c8a12 → #6d7910, `--fc7` #718096 → #667488; alle als Text jetzt mindestens 4,5 : 1. Dunkel unverändert. Für die Apps: nichts anzupassen; Bilder und Abbildungen werden etwas dunkler.
- **Grenze von Eingabefeldern** (#65): neue Variable `--field` (hell #808b96, dunkel #606d7a, 3 : 1 nach WCAG 1.4.11) für `select` statt `--line`. Für die Apps: eigene Eingabefelder ebenfalls mit `var(--field)` umranden.
- **Leitfaden 4 und 5.4:** Beschriftungen in Abbildungen mit denselben Schwellen wie Text, `--field`, Ausnahmen und Messung festgehalten. Für die Apps: Befunde in den eigenen Abbildungen nach plane-groups#114 und stereography#119.
- **Querstrich für Screenreader** (`css/base.css`, #82): Alternativtext „quer“ nach der Ziffer (`.ov::after`) statt „−“ davor; x̄ wird „x quer“ gelesen, wie in den Symbolen. Für die Apps: nichts anzupassen.
- **Leitfaden 9:** Der gemeinsame Rechenkern (#99) ist ein eigenes Projekt in TypeScript und auf Englisch; für ihn gilt der Leitfaden nicht. Für die Apps: nichts anzupassen.

### Behoben

- **Ansage der Experimente** (`ablauf.js`, #90): Querstriche (`<span class="ov">`) werden wie in der Darstellung für Screenreader angesagt (mit #82 „x quer“); bisher fiel der Strich weg („Deine Vermutung: 4.“, „(111)“ statt (1̄1̄1)). Entitäten aus `esc()` erscheinen als Zeichen. Beim Wechsel des Modus wird die Live-Region geleert, und eine noch ausstehende Ansage entfällt. Für die Apps: nichts anzupassen.

## [0.13.0] - 2026-11-07

Erzeugte Experimente wie die Generatoren im Quiz. Für die Apps: nichts anzupassen; wer erzeugte Experimente anbietet, typisiert die Liste als `(Ablauf | Erzeugt)[]`.

### Neu

- **Erzeugte Experimente** (#92): Ein Ablauf kann statt fester `schritte` die Funktionen `params()` und `make(p)` haben, wie ein Generator im Quiz. Die Karte wählt den Parameter nach dem Vorrang des Quiz (nie gespielt, dann zuletzt falsch, dann die übrigen; nicht zweimal dieselbe Aufgabe hintereinander) und bietet am Ende „Neue Aufgabe“ an. Der Stand steht unter `<id>:<parameter>`, die Liste zeigt den zuletzt gespielten und markiert erzeugte Experimente mit ↻ (mit Text für Screenreader). `pruefeAblaeufe` prüft jede Variante und meldet neu auch eine id mit Doppelpunkt (alle Abläufe), „make ohne params“, fehlende und doppelte Parameter. `beiAbschluss` kommt auch nach „Neue Aufgabe“; stellt die App darin die Karte um, zeichnet die Karte nicht weiter. Neues Feld `variante` im Typ `Ablauf`. Neu der Typ `Erzeugt` (und `Experiment` = `Ablauf | Erzeugt`), `erzeugt`, `variante`, `schluessel`, `eintrag`, `zuletzt`, `waehleParameter`, Option `zufall` von `ablaufKarte`; `vorrang` in `quiz-core.js` (gemeinsam mit dem Quiz); Stil `.ablauf-neu`. Beispiel in der Vorlage, Leitfaden 5.3 nachgeführt. Für die Apps: nichts anzupassen; `Ablauf` behält seine `schritte`. Wer erzeugte Experimente anbietet, typisiert die Liste als `(Ablauf | Erzeugt)[]`.

### Behoben

- **Vorlage:** Der Tooltip von „Alle Einstellungen zurücksetzen“ nennt jetzt auch den Stand der Experimente (#95). Für die Apps: nichts anzupassen.

## [0.12.0] - 2026-11-07

Der Stand der Experimente wird wie im Quiz gespeichert. Für die Apps: in der Karte „Experimente“ `speicher: '<präfix>-experimente'` angeben.

### Neu

- **Stand der Experimente wie im Quiz** (#91): `ablaufKarte` speichert mit `speicher: '<präfix>-experimente'` je Experiment die Durchgänge und ob zuletzt alle Vermutungen zutrafen (Aufbau wie der Fortschritt im Quiz). Richtig heisst: Jede aufgelöste Vermutung auf dem Weg traf bei der Auflösung zu; ein Ablauf ohne Auflösung gilt nur als durchgespielt. Die Liste zeigt ✓ (zuletzt richtig) oder ○ (durchgespielt), mit Text für Screenreader, darunter eine Übersicht mit Legende und „Stand löschen“. Nach „Fertig“ liegt der Fokus auf dem beendeten Experiment, das Ergebnis wird angesagt. Vor jedem Schreiben wird neu gelesen, und ein anderer Tab aktualisiert die Liste (`storage`). Neu `ergebnis(stand)`, `standLesen`, `standSchreiben`. Stil `.ablauf-stand` in `css/app.css`; Vorlage mit `speicher: 'muster-experimente'`. Leitfaden 5.2 und 5.3 nachgeführt.

### Geändert

- **`ablaufKarte`:** Die Option `erledigt` entfällt (keine App nutzte sie); `listeHTML` nimmt statt einer Menge erledigter ids den Stand (`Fortschritt`). Für die Apps: in der Karte „Experimente“ `speicher: '<präfix>-experimente'` angeben.
- **„Alle Einstellungen zurücksetzen“** (`seite.js`) lässt neben dem Quiz auch `<präfix>-experimente` stehen.

### Behoben

- **Quiz-Fortschritt:** Ein gespeicherter Stand mit `fragen` als Liste statt Objekt wurde angenommen; danach wurde nichts mehr gespeichert. Er gilt jetzt als unbrauchbar (leerer Fortschritt). Für die Apps: nichts anzupassen.

## [0.11.0] - 2026-11-07

### Neu

- **Geführte Abläufe** (`js/ablauf.js`, #87): Lernexperimente in einem eigenen Abschnitt „Experimente“ der Seitenleiste und kurze Erste Schritte zur Bedienung (`liste: false`), mit derselben Mechanik. Je Experiment-Schritt Frage, Vermutung mit Auflösung, Handlung per Knopf (Link-Adresse oder Aktion der App), Beobachtung, Erklärung mit Link ins Skript und Vorher/Nachher (#69). Verzweigungen nach der Antwort für die geführte Bestimmung (manganite/plane-groups#38). `pruefeAblaeufe` prüft die Daten in den Tests der App (auch Modi, Anker im Skript, Erreichbarkeit). Bedienbar mit Tastatur und Screenreader: Fokus nach jedem Klick, bleibende Live-Region für Auflösung und Beobachtung. Die Hilfsklasse `.sr` (nur für Screenreader) steht jetzt in `css/base.css` statt in `css/quiz.css`. Stile in `css/app.css` (`.ablauf-…`), Muster in der Vorlage. Leitfaden Abschn. 5.3 nachgeführt. Für die Apps: Erste Schritte und Experimente umstellen (manganite/plane-groups#56, manganite/stereography#77); `lib/common/js/ablauf.js` in die Offline-Liste von `sw.js`.

### Geändert

- **Leitfaden 5.2:** Zahlen ausserhalb ihres Bereichs werden auf den nächsten gültigen Wert gesetzt statt durch den Startwert ersetzt (Entscheidung Thomas, 6.11.2026). Umlaufende Winkel (z. B. ein Azimut) werden in 0° bis unter 360° umgerechnet; eine ungültige Auswahl, die als Zahl gespeichert ist (z. B. eine Blickrichtung), wird durch den Startwert ersetzt. Für die Apps: plane-groups ersetzt sie noch durch den Startwert (manganite/plane-groups#98).
- **Leitfaden 9, Datendateien:** Eine einfache Suche nach Kennung (`find`, Fehler oder `null` bei unbekannter Kennung) ist in Datendateien erlaubt (Entscheidung Thomas, 6.11.2026). Für die Apps: nichts anzupassen, `ebenengruppe(id)`, `vorgabe(id)` und `exampleById(id)` bleiben.

## [0.10.0] - 2026-11-06

Moduswahl als vollständiges Tab-Muster (`modusTabs`), ein gemeinsamer Helfer `esc`, Leitfaden mit Regeln zu Link und Speicher, Rundlauf-Tests, HTML aus Zeichenketten und Barrierefreiheit. Für die Apps: Moduswahl umstellen (siehe „Hinzugefügt“), sonst nichts anzupassen.

### Hinzugefügt

- **Moduswahl als Tab-Muster** (#68, `js/seite.js`, `modusTabs(liste, inhalt)`): Pfeiltasten mit Umlauf, Pos1 und Ende, `aria-controls`, nur der gewählte Tab im Fokus-Ablauf; gemeinsames `role="tabpanel"`. Gesperrte Tabs werden übersprungen. Vorlage umgestellt. Unbekannte id in `markieren` ist ein Fehler; Tasten mit Alt, Strg oder Cmd bleiben dem Browser. **Für die Apps:** `<main>` um ein `<div class="layout" id="inhalt" role="tabpanel">` (das `<main>` bleibt Hauptlandmarke); `const modi = modusTabs(element('.tabs'), $('inhalt'))` vor dem ersten Moduswechsel; die eigenen `setAttribute('aria-selected', …)` durch `modi.markieren(id)` ersetzen, dort, wo jeder Moduswechsel durchläuft (auch aus Link oder Speicher), nicht nur im `click`.
- **`esc()`** (#64, `js/format.js`): ein gemeinsamer Helfer für Text und Attributwerte (& < > " '). `help.js` verwendet ihn statt einer eigenen Kopie; der Moodle-Export behält seine XML-Helfer (bytegleich).

### Geändert

- **Leitfaden:**
  - Abschn. 5.2: eine Prüfung für Link und Speicher (#63).
  - Neuer Abschn. 5.4 „Barrierefreiheit“ (#65, Tab-Muster #68).
  - Abschn. 9: Rundlauf-Tests (#63) und Regel für HTML aus Zeichenketten (#64).

## [0.9.0] - 2026-11-05

Quiz: Grenzen für erzeugte Fragen gelten streng, solange die gewählte Länge erreichbar ist; doppelte Schlüssel sind ein Fehler. Querstrich für Screenreader, Legende mobil, PDF-Umbruch, lokaler Server robust. Für die Apps: nichts anzupassen.

### Geändert

- **Quiz: Grenzen für erzeugte Fragen** (#61, `js/quiz-core.js`, `ziehen()`): höchstens 30 % je Generator und 50 % insgesamt, bezogen auf die tatsächliche Länge und abgerundet (bei 5 Fragen höchstens eine je Generator), solange die gewählte Länge damit erreichbar ist. Sonst gilt nur noch: nie mehr erzeugte als handgeschriebene Fragen, gleichmässig über die Generatoren verteilt. Bisher konnten ein verkürztes Quiz 50 % und ein Quiz mit 5 Fragen 40 % aus einem Generator enthalten. Kürzer als gewählt wird ein Quiz nur noch, wenn es weniger handgeschriebene Fragen gibt als die halbe gewählte Länge oder zu wenige erzeugte. Für die Apps: nichts anzupassen.
- **Leitfaden:** Abschn. 4 (Querstrich mit Alternativtext für Screenreader, mit Grenzen) und Abschn. 7 (Regel für erzeugte Fragen; Generator-Parameter nur auf einer Stufe, Frage-IDs eindeutig; Tests einer App rufen `kandidaten()` auch mit `{ entwurf: true }` auf).
- **Quiz: Schlüssel eindeutig** (#60, `kandidaten()`): Kommt ein Schlüssel doppelt vor (z. B. derselbe Parameter eines Generators auf zwei Stufen), bricht `kandidaten()` mit einem Fehler ab, statt den Fortschritt zweier Fragen zu vermischen. Für die Apps: nichts anzupassen, alle Generatoren erfüllen das (Tests der Apps grün).

### Behoben

- **Querstrich für Screenreader** (#66, `css/base.css`): Der Querstrich war nur gezeichnet; ein Screenreader las x̄ als „x“ und (1̄00) wie (100). Der Strich (`.ov::before`) hat jetzt den Alternativtext „−“. Darstellung und Moodle-Export unverändert; beim Kopieren und im PDF-Text fehlt das Minus wie bisher. Für die Apps: nichts anzupassen, sofern Querstriche mit `.ov` gesetzt sind.
- **Legende auf kleinen Bildschirmen** (#67, `css/app.css`): Sie war einzeilig und waagrecht scrollbar, mit ausgeblendeter Scrollleiste; was nicht sichtbar war, liess sich kaum entdecken. Jetzt bricht sie um. Für die Apps: nichts anzupassen.
- **PDF: Abbildungen über zwei Reihen** (#47, `tools/skript-pdf.mjs`): Zwei Reihen derselben Abbildung und ihre gemeinsame Anmerkung werden nicht mehr getrennt (`break-before: avoid`). plane-groups: Abb. 7.3 und 7.5 je auf einer Seite, Seitenzahl gleich (79), dafür endet S. 70 früher; stereography: unverändert.
- **Lokaler Server** (#62, `tools/server.mjs`): Eine ungültig kodierte Adresse (z. B. `/%ZZ`) beendete den Server; jetzt Antwort 400.

## [0.8.1] - 2026-11-05

Gewählte Knöpfe behalten beim Überfahren ihren Rand; Vorlage mit Werkzeugleiste. Für die Apps: nichts anzupassen.

### Hinzugefügt

- **Vorlage:** Tafel A hat eine Werkzeugleiste mit drei Werkzeugen, die sich ausschliessen; Werkzeug 3 ist als Beispiel gesperrt, der Grund steht in der Legende (Leitfaden Abschn. 5.2).

### Behoben

- **Gewählte Knöpfe beim Überfahren** (`css/app.css`): Die Hover-Regel aus 0.8.0 (`.tools button:hover:not(:disabled)`) war stärker als `.tools button[aria-pressed="true"]`; ein gewähltes Werkzeug oder die Lupe bekam beim Überfahren einen grauen statt eines akzentfarbenen Rands (plane-groups seit der Übernahme von 0.8.0). Jetzt `.tools button:enabled:not([aria-pressed="true"]):hover`, unabhängig von der Reihenfolge der Regeln. Für die Apps: nichts anzupassen.

## [0.8.0] - 2026-11-05

Gewählte und gesperrte Knöpfe gemeinsam im CSS, Leitfaden unterscheidet Werkzeuge von Schaltern. Für die Apps: eigene Regeln für gewählte und gesperrte Knöpfe aus dem `<style>` entfernen (siehe „Hinzugefügt“); sonst nichts anzupassen.

### Hinzugefügt

- **Gewählte und gesperrte Knöpfe** (#53) in `css/app.css`: `.tools button[aria-pressed="true"]` in der Akzentfarbe, `.tools button:disabled` und `.seg button:disabled` blass mit Zeiger „not-allowed“ (Leitfaden Abschn. 5.2). Bisher hatten gesperrte Knöpfe keinen eigenen Stil und sahen aktiv aus. Für die Apps: eigene Regeln dafür aus dem `<style>` entfernen (plane-groups: `.panel-head .tools button:disabled, .seg button:disabled` und `.panel-head .tools button[aria-pressed="true"]`; `.tabs button:disabled` bleibt); stereography hat keine gesperrten Knöpfe dieser Art, dort ändert sich nichts.

### Geändert

- **Leitfaden Abschn. 5.2:** Werkzeuge (Knöpfe einer Tafel, deren einziger Zweck die Art der Eingabe ist, z. B. Zeichnen, Radieren, Zone, Winkel) schliessen sich wie eine Auswahl aus und werden abgewählt, wenn ein anderes Werkzeug oder eine andere Funktion sie ausschliesst; ausgeschlossen sind sie sichtbar gesperrt, mit Grund bei der Tafel; in einem Modus ohne sie fehlen sie. Schalter, auch Knöpfe für die Ansicht wie die Lupe, bleiben „gesperrt, nicht abgewählt“. Für die Apps: nichts anzupassen (plane-groups setzt es so um; in stereography schliessen sich Zone und Winkel aus, Zone fehlt im Punktgruppenmodus). Sichtbare Sperre im gemeinsamen CSS: siehe „Hinzugefügt“.

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

[Unreleased]: https://github.com/manganite/crystallography-common/compare/v0.16.0...HEAD
[0.16.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.16.0
[0.15.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.15.1
[0.15.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.15.0
[0.14.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.14.0
[0.13.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.13.0
[0.12.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.12.0
[0.11.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.11.0
[0.10.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.10.0
[0.9.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.9.0
[0.8.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.8.1
[0.8.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.8.0
[0.7.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.7.0
[0.6.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.6.0
[0.5.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.5.0
[0.4.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.4.0
[0.3.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.1
[0.3.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.3.0
[0.2.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.2.0
[0.1.1]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.1
[0.1.0]: https://github.com/manganite/crystallography-common/releases/tag/v0.1.0
