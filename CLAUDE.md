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
  | Reihenfolge der offenen Arbeit über alle Repos | Issue #74 „Fahrplan der App-Familie“ |
  | Konzepte (ausführliche Begründungen, Entwürfe) | `docs/` des betroffenen Repos; nach der Umsetzung mit Statuskopf (was umgesetzt, was überholt, wo es jetzt steht) und nicht mehr nachgeführt |
  | Änderungen je Version | `CHANGELOG.md` |

  Bei Widerspruch zwischen einem Konzept und `CLAUDE.md` bzw. `LEITFADEN.md` gelten Letztere.
  Steht etwas schon an seinem Ort, wird anderswo nur darauf verwiesen (z. B. „Issue #35“), nicht
  wiederholt. Wird ein Issue erledigt, verschwindet der Verweis im selben PR.
- Die Repositories sind öffentlich; diese Dateien also auch.

## Arbeitsbereich

Die Repositories liegen nebeneinander in einem Arbeitsordner, damit eine Sitzung alle sieht. Der
Arbeitsordner ist selbst kein Repository (keine verschachtelten Repos, keine Submodule); Ordnername =
Repo-Name, bei den Apps auch Pfad auf GitHub Pages:

```
<arbeitsordner>/crystallography-common
<arbeitsordner>/stereography
<arbeitsordner>/plane-groups
<arbeitsordner>/symcrys        eigenes Projekt (#99)
<arbeitsordner>/birss-app      eigenes Projekt, baut künftig auf symcrys auf
```

- **symcrys und birss-app** liegen im selben Arbeitsordner, sind aber eigene Projekte mit eigenen Regeln
  (englisch; für sie gelten weder diese Datei noch der Leitfaden, sondern `symcrys/CLAUDE.md` bzw. in
  birss-app `AGENTS.md` und `STATUS.md`; vor Arbeit dort diese lesen). Daneben liegen sie, weil die Apps
  symcrys wie common als Kopie aus dem Nachbarordner übernehmen werden (#99) und birss-app so mit einer
  lokalen Fassung von symcrys getestet werden kann (Ablauf in den Repos selbst). Sie gehören nicht in den
  Workspace der Familie: in einem eigenen VS-Code-Fenster öffnen (`code .` im Ordner), sonst lädt die
  Erweiterung diese Datei.
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
- In einer Cloud-Sitzung fehlende Repositories klonen (`https://github.com/manganite/<name>`), symcrys immer
  (wie in den Anweisungen des claude.ai-Projekts), birss-app, wenn die Aufgabe sie betrifft.
- Eine Einstiegsseite für die Familie ist geplant (Issue #12); sie käme als weiteres Repo daneben.

## Arbeitsweise mit Thomas

- Deutsch, Schweizer Schreibung (ss). Bei Unklarem nachfragen, nicht raten; Nichtwissen zugeben.
  Präzise, auf das Wesentliche beschränkt, nachprüfbar. Zielführende Vorschläge von sich aus sind
  erwünscht.
- Thomas ist Fachautor und gibt Skript und Quiz fachlich frei.

## Entscheidungen der Familie (mit Grund)

Die Regeln selbst stehen im Leitfaden; hier, warum.

- **Entwicklung vor Stabilität** (Thomas, 10. und 11.11.2026, #126, Leitfaden Abschn. 8, auch 5.2, 7, 9, 10): „Wir sollten wirklich auf
  sauberen Code bestehen, der keine unnötigen Altlasten mit sich herumschleppt.“ Der Kreis der Nutzer ist klein, und
  die Nutzung ist ein Testlauf; niemand ausserhalb verlässt sich auf feste Link-Adressen. Grössere Umbauten (Anlass:
  ein dritter Modus in plane-groups) sollen deshalb nicht an der Umrechnung alter Links und Speicherstände hängen,
  und vorhandener Code dafür kommt in beiden Apps jetzt heraus, „bevor sich noch mehr ansammelt“. Stabil werden die
  Link-Adressen, „wenn die Apps auch sonst ihre endgültige Form erreicht haben“. Ersetzt die frühere Regel, dass
  Link-Adressen und Namen im Speicher von Anfang an stabil bleiben. Derzeit sind alle Apps in Entwicklung (11.11.2026).
  Auch der Lernstand (Quiz, Experimente) darf verloren gehen (Thomas, 11.11.2026: „Zum jetzigen Zeitpunkt kann der
  Lernstand noch verloren gehen.“). Aus dem Review des PR #127: geänderte Bedeutung heisst
  neuer Schlüssel, geändertes Format neue Version, damit nichts umgedeutet wird (Leitfaden 5.2); ein Bruch des
  Link-Formats zählt als MINOR, weil die Apps sonst bei jedem Umbau eine neue Hauptversion bräuchten; Links zwischen
  den Apps liegen in getrennten Repos und lassen sich nicht im selben PR anpassen.
- **Gemeinsamer Rechenkern in TypeScript, eigenes Repository** (Thomas, 7.11.2026, #99): Punktgruppen
  werden heute in stereography und in birss-app unabhängig voneinander erzeugt, die Ebenengruppen in
  plane-groups; die 3D-App (#9) bräuchte die Gruppen ein weiteres Mal. Thomas hält die Rechenmodule von
  birss-app für die am besten ausgebauten und abgesicherten (Referenztests gegen Birss und ITC); sie sind
  der Ausgangspunkt. Entschieden: Ein Kern enthält alle Berechnungen, die heute in den Apps der Familie und
  in birss-app stecken; die Darstellung bleibt in den Apps. Er ist leicht erweiterbar und so gebaut, dass er
  als eigenständige Bibliothek verbreitet werden kann. Er ist ein eigenes Projekt mit eigenem Repository,
  durchgehend auf Englisch (auch Bezeichner und Kommentare); für ihn gelten weder der Leitfaden noch diese
  Datei. TypeScript, weil birss-app es schon ist und eine Bibliothek ihre Typen mitliefert. common und die
  Apps bleiben ohne `.ts` und ohne Build-Schritt; sie binden das nach JavaScript übersetzte Ergebnis ein.
  birss-app baut künftig auf dem Kern auf, bleibt aber ein eigenes Projekt ausserhalb der Familie
  (festgehalten in deren `STATUS.md`). Bis der Kern steht, bleiben die Berechnungen in den Apps. Offene
  Punkte: #99.
- **Ansage von Symbolen** (Thomas, 8.11.2026, #82, Leitfaden Abschn. 4): Der Querstrich wurde als „−“ angesagt, 4̄ also
  „minus vier“, und 222 oder (110) als Zahl. `role="img"` mit `aria-label` statt eines versteckten Texts (`.sr`), weil
  der Moodle-Export ohne das CSS der Familie auskommt (versteckter Text wäre dort sichtbar) und das Kopieren
  unverändert bleibt; dafür nennt ein Screenreader das Symbol zusätzlich „Grafik“. Gesprochen „quer“ (auch bei
  Indizes), „über“ und „Punkt“; Indizes ohne die Art der Klammer, weil der Satz sie meist schon nennt („die Form …“).
- **Kontraste: Messung und Grenzen** (8.11.2026, #65, Leitfaden Abschn. 5.4): Gemessen wird die gerenderte Seite,
  weil die Paare aus den Variablen allein Mischungen, Deckkraft und Farben in Abbildungen nicht erfassen; die
  Variablen prüft zusätzlich ein Test ohne Browser (CI). Beschriftungen in Abbildungen wie Text mit 4,5 : 1 (Thomas):
  Die Ausnahme in WCAG 1.4.3 für Text in einem Bild zielt auf Fotos und Szenen; Beschriftungen in Diagrammen gelten
  nach dem Understanding zu 1.4.11 als Text (Review des PR #105; ein erster Entwurf mit 3 : 1 wurde verworfen). Dafür
  wurden die Formfarben `--fc4`, `--fc5`, `--fc7` (hell) dunkler. Grenze von Eingabefeldern mit eigener Farbe
  `--field` (Thomas): Bei `select` ist sie die einzige Grenze; Knöpfe kennzeichnet ihr Text. Ob eine Linie oder
  Fläche unter 3 : 1 nötig ist oder nur stützt, entscheidet die Durchsicht, nicht das Werkzeug. Die ersten Befunde (hell: `--ax2`/`--dir2` als Text 4,31, `--accent2` im
  Warnkasten 4,39, `--dir3` und `--accent2` auf `--bg` knapp unter 4,5) wurden durch leicht dunklere Farben behoben;
  die Befunde in den Abbildungen der Apps stehen in plane-groups#114 und stereography#119.
- **Lernexperimente, eigener Abschnitt** (7.11.2026, #87, Leitfaden Abschn. 5.3): Ein externes Review (5.11.)
  riet zu „eine Frage, eine Handlung, eine beobachtbare Änderung“ statt reiner Bedienschritte; die Vermutung vorher
  macht die Beobachtung zur Antwort. Auswahl statt offener Frage, damit sich die Auflösung zeigen lässt; ohne Punkte,
  weil das Experiment kein Quiz ist. Handlung per Knopf über die Link-Adresse, weil das zuverlässig ist und dieselben
  Daten die Hilfeseite speisen („In der App zeigen“); eine Erkennung selbst ausgeführter Handlungen bräuchte je
  Schritt eine Prüfbedingung. Ein Mechanismus für Experimente und Bestimmung (Verzweigung), damit plane-groups#38
  nicht eine zweite Führung baut.
  Zuerst ersetzten die Experimente die Erste Schritte; Thomas fand sie dafür zu schade („als kurze
  Kennenlernübung beim Einstieg eigentlich verschwendet“). Deshalb stehen sie in einem eigenen Abschnitt, und
  die Erste Schritte bleiben kurze Bedienschritte mit derselben Mechanik. Jedes Experiment steht für sich (Thomas, 12.11.2026): In
  plane-groups setzte eines das Ende eines anderen voraus und war allein unverständlich; die Liste lässt jede Reihenfolge zu.
- **Stand der Experimente wie im Quiz** (7.11.2026, #91): Thomas entschied, dass sich die Experimente wie die
  Quizfragen verhalten. Gespeichert mit demselben Aufbau wie der Fortschritt im Quiz (`vermerken` aus
  `quiz-core.js`), damit später auch erzeugte Experimente (#92) unter `<generator>:<parameter>` zählen. Richtig
  heisst: Es gab auf dem Weg mindestens eine aufgelöste Vermutung, und jede traf bei der Auflösung zu (bei einem Experiment die Vermutung beim Klick auf die Handlung); ein Ablauf
  ohne Auflösung gilt nur als durchgespielt (○). Der Schlüssel `<präfix>-experimente` (statt des ersten
  Vorschlags `<präfix>-quiz-experimente` im Issue) ist eine Wahl beim Umsetzen: Die Experimente gehören nicht
  zum Quiz, und ein Name unter `<präfix>-quiz` hätte nur genutzt, dass das Zurücksetzen das Quiz verschont.
  Vor jedem Schreiben wird neu gelesen, damit zwei offene Tabs einander nichts überschreiben.
- **Tooltips: Abdeckung, Länge, Gerät** (Thomas, 8. und 9.11.2026, #114, Leitfaden Abschn. 5.3): Thomas fand zu einem
  Knopf („Winkel“) keine Hilfe; die Apps seien zu komplex für Lücken. Jedes Bedienelement bekommt deshalb einen
  Tooltip, Ausnahmen nur für selbsterklärende Links, Schliessen „×“, das Export-Menü (bis #130 Export-Knöpfe mit Text) und die Köpfe
  einklappbarer Abschnitte, die `.sumhint` schon erklärt (Thomas). „Ein Satz“ ist Richtwert, der Test prüft nur eine
  Höchstlänge (Thomas). 120 Zeichen fassen einen kurzen Satz; die längsten Texte hatten gut 300. Inhalt (Thomas, 12.11.2026, nach der
  Durchsicht von plane-groups 1.3.0): Tooltips wiederholten Beschriftungen und Begründungen aus der Planung (Extrembeispiel Lupe); sie
  sollen nur die Funktion oder eine nötige Angabe nennen. Der Test sieht nur
  Elemente mit `id` in `index.html`; Elemente ohne `id` (z. B. Segmentknöpfe) und im Code erzeugte bräuchten einen
  Browsertest je App (offen, #114). `title` neben einem Tooltip meldet er, weil der Browser sonst zwei zeigt (Review
  des PR #120). Texte für Maus und Touch und das ⓘ folgen dem zuletzt benutzten Gerät (`data-zeiger`, `data-touch` an
  `<html>`), nicht nur der Media Query: Nach #116 erschienen Tooltips auf einem Laptop mit Touchscreen, die Karte
  „Erste Schritte“ sagte aber weiter „Das ⓘ … erklärt“ (Review von #116). Das ⓘ bleibt ab dem ersten Tippen sichtbar,
  weil es sonst mit jeder Mausbewegung verschwände und eine offene Erklärung ohne Knopf zum Schliessen zurückliesse
  (Befund des Browsertests). Browsertests laufen in der CI von common im eigenen Job `browser` (Thomas); die Emulation
  von Chromium meldet mit Touchscreen immer `hover: none`, der Fall „Touchscreen und `hover: hover`“ wird deshalb mit
  einem Zeigerereignis vom Typ `touch` geprüft.
- **Experimente nach Kapiteln gliedern** (Thomas, 9.11.2026, #107, Leitfaden Abschn. 5.3): Mit 8–12 Experimenten je
  Modus (stereography#115, plane-groups#109) wird die flache Liste unübersichtlich; das Quiz gliedert schon nach
  Kapiteln. Schwelle 6 je Modus (gezählt wird, was die Liste eines Modus zeigt, nicht die ganze App). Das Kapitel steht
  als Feld in den Daten, statt es aus dem ersten Verweis ins Skript abzuleiten: Einige Experimente verweisen auf zwei
  Kapitel (z. B. `lage` in stereography auf Kap. 6 und 10), die Zuordnung soll eindeutig und geprüft sein. Überschrift je
  Kapitel auch bei nur einem Eintrag, damit die Liste gleichmässig bleibt; Nummer und Kurztitel wie in der Auswahl des
  Quiz (der Vorschlag „4 · Symmetriegerüste“ wurde beim Umsetzen so angeglichen; der Mittelpunkt wäre zudem vorgelesen
  worden); für Screenreader mit „Kapitel“ davor, sonst klingt „5 17 Ebenengruppen“ wie eine Zahl (Review des PR #119).
  Durchgehend nummeriert, damit die Nummer eines Experiments gleich bleibt wie in der flachen Liste. In der Seitenleiste
  ist der Titel keine Überschrift, sondern beschriftet die Liste (`aria-labelledby`, wie `.group-title`): Die Karte
  „Experimente“ hat nur ein `<summary>`; eine `h3` hätte sich für Screenreader unter „Erste Schritte“ oder direkt unter
  das `h1` eingeordnet (Review des PR #119). Auf der Hilfeseite ist er eine Überschrift (`h4` unter „Experimente“). Die
  Hilfeseite gliedert gleich, damit beide Listen übereinstimmen; dafür zählt sie Experimente ohne Modus wie die App in
  jedem Modus (vorher nur im ersten).
- **Erzeugte Experimente wie die Generatoren im Quiz** (7.11.2026, Thomas, #92): damit Studierende immer wieder
  neue Aufgaben derselben Art lösen. Gleiche Form wie im Quiz (`params`, `make`), gleicher Vorrang bei der Wahl und
  Stand unter `<id>:<parameter>`, damit beides gleich funktioniert und geprüft wird (`params`/`make` statt der
  im Issue skizzierten `erzeuge(zufall)`: So lassen sich alle Varianten aufzählen und prüfen, und der Schlüssel ist
  stabil). In der Liste zählt der zuletzt
  gespielte Parameter (✓ oder ○); ein erzeugter Ablauf ist ein Eintrag, nicht einer je Parameter, damit die Liste
  kurz bleibt.
- **Anordnung der Tafeln gemeinsam** (5.11.2026, Leitfaden Abschn. 5.1): Sie war in beiden Apps und der Vorlage
  gleich und stand dreimal; eine Änderung musste dreimal gemacht werden. Bisher hiess es, jede App lege sie
  selbst fest; das gilt nur noch für eine abweichende Anordnung. Eine gemeinsame 3D-Ansicht folgt erst mit einer
  zweiten App, die eine braucht (#9).
- **„Alle Einstellungen zurücksetzen“ gemeinsam** (5.11.2026, Leitfaden Abschn. 5.2): Ort und Umfang waren
  nicht festgelegt; plane-groups hatte den Knopf im Abschnitt „Darstellung“ und setzte nur den Zustand im Programm
  zurück (offene Abschnitte u. a. blieben). Neu laden ohne Speicher und Hash, wie in der Stereo-App, erreicht den
  Startzustand sicher; Thomas zog diese Lösung vor. Gelöscht wird nach Präfix statt nach einer Liste, damit ein
  neuer Eintrag nicht vergessen werden kann (Befund des Reviews); das Präfix trennt die Apps, die auf
  manganite.github.io denselben Speicher teilen. Feste ID `reset-alles` für Tooltips und die Hilfeseite (#24).
- **Seitenleiste und Tafel** (Thomas, 12.11.2026, #130, Leitfaden Abschn. 4, 5.1, 5.2, 5.3): Anlass war die Bewertung
  von plane-groups v1.3.0 („Im Moment muss man relativ viel scrollen, es gibt teilweise sehr lange Erklärtexte für recht
  wenig Funktionen. Was ist in der Seitenleiste, was ist im Fenster?“). Gemessen am Laptop (1440 × 900): Seitenleiste
  963 px („Ebenengruppen“), 1515 px („Gitter und Basis“), 1799 px („Muster entwerfen“) bei etwa 880 px Platz. Ursachen:
  Handlungen auf der Zeichnung verstreut über Seitenleiste und Tafel, Anleitungstexte doppelt zu Tooltip und ⓘ,
  Eigenschaften, die ein Objekt nicht hat, gesperrt mit langer Begründung. Entschieden: der Grundsatz (Seitenleiste sagt,
  was da ist; Tafel trägt, was man auf der Zeichnung tut), fehlende statt gesperrter Eigenschaften (gesperrt mit Grund
  passt auf einen Schalter, der ruht und wieder wirken kann; eine Eigenschaft, die das Objekt nicht hat, ruht nicht),
  Export als ein Knopf mit Menü, damit der Kopf der Tafel einzeilig bleibt. Beschriftung „Export“ mit den Einträgen
  „Kopieren (PNG)“, „SVG-Datei speichern“, „PNG-Datei speichern“ (Thomas); die Einträge sagen damit selbst, was sie tun,
  und brauchen keinen Tooltip. Knöpfe als Symbol, wo Text nicht passt (Thomas: für die meisten Werkzeuge gibt es
  etablierte Symbole, Stift, Radiergummi, Plus, Mauszeiger); Name im `aria-label`, Erklärung im Tooltip. Ein Baustein in
  `seite.js` (Muster „Menu Button“ der WAI-ARIA Authoring Practices), weil beide Apps exportieren und Tastatur, Fokus und
  Schliessen sonst je App anders würden; `herunterladen` und `inZwischenablage` kamen mit, weil beide Apps sie gleich
  hatten. Rückmeldung zusätzlich als Statusmeldung, weil ein Screenreader die Änderung des Namens eines fokussierten
  Knopfs nicht zuverlässig ansagt (Review des PR #133). Einrasten ist ein Schalter, Rückgängig, Löschen und
  Entfernen sind Handlungen (so in #130 d); Handlungen sind gesperrt, solange es nichts zu tun gibt, ohne Grund, weil er
  aus der Zeichnung folgt (beim Umsetzen eingeführt, von Thomas bestätigt 12.11.2026: „die Werkzeugleiste nicht unnötig
  aufblasen“; ein Grund unter jedem Knopf hätte sie verlängert, ein immer freier Knopf ohne Wirkung verwirrt). Das Menü öffnet linksbündig, wenn rechts ausgerichtet links kein Platz ist: Die Tafel schneidet mit
  `overflow: hidden` ab (Befund im Browser an der Vorlage). Nicht ersetzt ist die Prüfung mit Studierenden (#117).
- **Werkzeuge abwählen, Schalter sperren** (5.11.2026, Leitfaden Abschn. 5.2): Anlass ist plane-groups
  (Entscheidung „Erklärungen im Symmetriegerüst“). Die Regel „gesperrt, nicht abgewählt“ passt auf Schalter,
  nicht auf Werkzeuge, die sich wie eine Auswahl ausschliessen: Ein gesperrtes, aber gewähltes Zeichenwerkzeug
  täte beim Tippen nichts. Abgegrenzt über den Zweck (nur Art der Eingabe), weil auch Schalter wie die Lupe
  mitbestimmen, was ein Tippen bewirkt. Thomas wollte die Unterscheidung im Leitfaden statt als Ausnahme in
  einer App, damit die Apps nicht auseinanderdriften.
- **Hilfeseite** (4.11.2026, Leitfaden Abschn. 5.3): Tooltips erklären einzelne Bedienelemente, das
  Skript die Begriffe; dazwischen blieb unklar, wie man mit der App eine Aufgabe löst. Inhalt (Thomas, 8.11.2026,
  #24): die Erste Schritte aller Modi als bebilderte Anleitungen, die Experimente nur als Liste mit Frage und „In
  der App ausprobieren“; Bilder als Ausschnitt um das Bedienelement mit Rahmen. Gründe des Vorschlags: Die
  Experimente leben vom Vermuten, eine Auflösung auf der Hilfeseite verriete sie; auf einem Bild der ganzen App sieht
  man nicht, wohin man tippen soll. Welches Element, sagt `zeige` im Schritt, damit Text und Bild an einem Ort stehen.
  Start eines Experiments per `?experiment=<id>` statt im Hash, damit die Link-Adressen der Apps (Schnittstelle)
  unberührt bleiben; die App entfernt den Parameter gleich wieder. Weiteres zur Hilfe: #114.
- **Kennzeichnung der Typen in Datendateien** (4.11.2026, Leitfaden Abschn. 9): Ein Literal wird erst durch
  eine Typangabe zum gekennzeichneten Typ (z. B. `Normale`, `Grad`). Je Tabelle einmal bleiben die Einträge
  ohne Code lesbar und änderbar, was die Regel „Daten getrennt vom Code“ bezweckt. Die Alternativen wären
  die Umwandlung beim Verbraucher (der Typ der Daten bliebe ungekennzeichnet) oder eine Typangabe je Eintrag
  (schwer lesbar).
- **Geprüfte Helfer für Elemente der Seite** (4.11.2026, Leitfaden Abschn. 9): Die Typprüfung kennt das HTML
  nicht; eine blosse Umwandlung verschiebt einen Fehler im HTML an eine spätere, schwer zu findende Stelle. Mit
  Prüfung fällt er beim ersten Zugriff auf und nennt die ID. Einheitliche Namen, weil dieselbe Aufgabe in
  jeder App sonst anders heisst (z. B. `auswahl` und `liste`).
- **ESLint** (4.11.2026, Leitfaden Abschn. 9): ein Prüfer ohne Kosten und Limit, seit das Copilot-Review
  ausfällt; ergänzt die Typprüfung um Befunde wie ungenutzte Namen, unerreichbaren Code oder versehentliche
  Zuweisungen.
- **Kein Review durch Claude Code in GitHub Actions** (Vorgabe Thomas, 5.11.2026): Die Kosten sind nicht
  kalkulierbar. Das Review durch einen unabhängigen Agenten in der Sitzung (Abschnitt „Git, PRs und Releases“)
  bleibt der Weg; ESLint ergänzt es.
- **Grenzen für erzeugte Fragen** (5.11.2026, Leitfaden Abschn. 7): Die Grenzen bezogen sich auf die gewünschte
  Länge und wurden gerundet; ein Quiz konnte 50 % aus einem Generator haben, eines mit 5 Fragen 40 %. Thomas wollte
  sie zuerst streng. Streng bezogen auf die tatsächliche Länge machten sie aber Quizrunden in Kapiteln mit wenigen
  handgeschriebenen Fragen unnötig kurz (z. B. 4 statt 6 Fragen). Deshalb (Thomas): streng, solange die gewählte
  Länge damit erreichbar ist; sonst nur „nie mehr erzeugte als handgeschriebene“, gleichmässig über die Generatoren
  (ein einzelner Generator kann dann mehr als 30 % stellen). Die Tests rechnen die Erreichbarkeit unabhängig vom Code.
- **Moduswahl als vollständiges Tab-Muster** (Thomas, 6.11.2026, Leitfaden Abschn. 5.4; #68): Die Modi waren als
  Tabs ausgezeichnet, verhielten sich aber nicht so. Zur Wahl standen Schaltflächen mit `aria-pressed` (einfacher,
  bei zwei Modi ausreichend) und das volle Muster; das volle Muster passt auch zu Apps mit mehr Modi und
  zur Bedeutung (der Modus wechselt den ganzen Inhalt). Gemeinsamer Helfer `modusTabs()` in `js/seite.js`.
- **Zahlen ausserhalb ihres Bereichs auf den nächsten gültigen Wert** (Thomas, 6.11.2026, Leitfaden Abschn. 5.2;
  stereography#105): Der Leitfaden sah für Ungültiges den Startwert vor. Der Link von stereography setzte Zahlen
  schon immer in ihren Bereich (`ga=200` ergibt 150°). Der nächste gültige Wert liegt näher an dem, was gemeint
  war, und Link und Speicher bleiben gleich. Für fehlende, falsch getippte oder unbekannte Werte und für Werte,
  die erst zusammen ungültig sind, bleibt es beim Startwert.
- **Schlüssel des Fortschritts ohne Stufe** (5.11.2026, Leitfaden Abschn. 7): Statt die Stufe in den Schlüssel
  aufzunehmen, sind Parameter über alle Stufen eindeutig. So bleibt der gespeicherte Fortschritt gültig; alle Generatoren der Apps
  erfüllten das schon.
- **Browser in CI, Deploy und Release ohne apt** (11.11.2026, #128, Thomas einverstanden): `npx playwright install
  chromium` ohne `--with-deps`, weil ein Ausfall der Ubuntu-Paketquellen sonst Prüfungen und Releases verhindert
  (11.11.2026 mehrfach). Die Bibliotheken bringt das Image Ubuntu 24.04 mit; die Zeichen des Skripts ausserhalb der
  eigenen Schriften deckt dort DejaVu ab (in der CI geprüft, nur ⓘ nicht, das im Skript nicht vorkommt). Beim Wechsel
  des Images oder der Version von Playwright neu prüfen.

## Git, PRs und Releases

- Jede Änderung auf einem eigenen Branch, dann PR nach `main`. CI (`test`, `typen`, `lint`, in common auch `browser`, in Apps auch `pdf`)
  abwarten, das Review (nächster Punkt) einholen, Befunde prüfen und beantworten, dann Bericht an Thomas.
- **Review durch einen unabhängigen Agenten:** Vor dem Bericht prüft ein eigener Agent, der die Arbeit nicht
  kennt, den Diff des PR: Fehler, Randfälle, Widersprüche zu `CLAUDE.md` und `LEITFADEN.md`, fachliche
  Aussagen gegen Code und Quellen. Er bekommt nur Repo, Branch und Zweck des PR, nicht die Begründungen
  der Sitzung. Befunde wie die eines Reviewers behandeln (nachprüfen, beheben oder begründen), im Bericht
  nennen und im PR festhalten (Punkt „Review“ der PR-Vorlage), damit sie nachvollziehbar bleiben.
  Das gilt für jeden PR ohne Ausnahme, auch bei reinen Textänderungen (Vorgabe Thomas, 5.11.2026; das
  nachgeholte Review von plane-groups#75 fand übersehene Reste).
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
  Sitzungslink (in der Cloud-Sitzung: „Grenzen der Cloud-Sitzung“, Fusszeile).
- **Issues im PR-Text mit „Closes #N“** (bzw. „Fixes #N“), auch in einem sonst deutschen Text: GitHub schliesst ein
  Issue beim Merge nur mit einem englischen Schlüsselwort; „Schliesst #123“ liess stereography#123 offen (9.11.2026).
  Schliesst ein PR ein Issue nur zum Teil, „Zu #N“ schreiben, dann bleibt es offen.

## Grenzen der Cloud-Sitzung (claude.ai)

- Tag-Push und Tag-API scheitern (403); Tags und Releases legt dort Thomas an.
- GraphQL ist gesperrt, also kein `gh pr create`. Über REST: PR anlegen
  `gh api repos/manganite/<repo>/pulls -f title=… -f head=<branch> -f base=main -f body=…`
  (mit `-f` sendet `gh api` POST), mergen `gh api -X PUT …/pulls/N/merge`, Review-Threads
  auflösen `…/pulls/N/ccr/comments/ID/resolve`. Nur Repo-Endpunkte sind erlaubt.
- github.io ist nicht erreichbar; die Live-Seite lässt sich nicht selbst prüfen. Deploy-Status über
  `repos/…/deployments?environment=github-pages`.
- **Browser für Playwright:** Die Sitzung sperrt die Download-Hosts von Playwright (`npx playwright install` scheitert),
  und das vorhandene Chromium passt nicht zur Version von Playwright (1.52 erwartet Revision 1169, vorhanden ist 1243,
  Chrome 153). Werkzeuge und Browsertests deshalb mit `CHROMIUM_PFAD=/opt/pw-browsers/chromium` starten (README,
  „Entwicklung“; auch `tools/skript-pdf.mjs`), eigene Skripte mit `chromium.launch({ executablePath:
  '/opt/pw-browsers/chromium' })`.
- Thomas' Zotero ist erreichbar, wenn sein Computer verbunden ist (Zotero-Werkzeuge der Sitzung).
- Fusszeile: Der Zugang der Sitzung zu GitHub ersetzt „🤖 Generated with Claude Code“ in PR-Texten beim
  Speichern durch `---` und „_Generated by Claude Code_“ (Link auf claude.ai/code oder die Sitzung); bei
  Issues hängt er diese Zeilen nur an. Kein Fehler, keine Korrektur nötig. Den Sitzungslink deshalb immer als
  eigene Zeile über die Fusszeile schreiben, dann bleibt er sichtbar.

## Gemeinsamer Code: Ablauf einer Änderung

1. Änderung hier in `crystallography-common` (Branch, PR, Tests). Nie in `lib/common/` oder
   `tools/common/` einer App.
2. Release von common: Version in `js/version.js` und CHANGELOG, Release-PR, nach dem Merge der Tag
   (siehe „Git, PRs und Releases“).
3. Je App ein PR: `git checkout vX.Y.Z` in common, dann in der App
   `node tools/common/sync.mjs ../crystallography-common`; Tests der App laufen lassen
   (`tests/common.test.mjs` prüft die Kopie gegen das Manifest). Dazu eine Zeile im CHANGELOG der App:
   „**Gemeinsame Grundlage** auf crystallography-common vX.Y.Z: …“, unter „Geändert“, bei einer reinen
   Behebung unter „Behoben“. Übernommen wird nur, wenn kein offener PR der App dieselben Dateien berührt wie die
   Übernahme; `CHANGELOG.md` zählt dabei nicht. Einen Konflikt dort löst der PR, der später gemergt wird (Branch
   auf `main` nachführen). Thomas, 9.11.2026: sonst müsste jede Übernahme warten, weil fast jeder PR eine Zeile
   unter „Unreleased“ ergänzt.
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
Geändert heisst: gegenüber der Vorschau, nicht nur gegenüber dem letzten PR. Vorher die Dateien der Vorschau
(`action: list`, `scope: files`) mit dem Arbeitsstand vergleichen; sonst fehlt z. B. eine inzwischen gemergte
Änderung, ein Import schlägt fehl und die App zeigt nur leere Tafeln (plane-groups, 7.11.2026). Danach die
Vorschau im Browser öffnen, bevor sie Thomas gezeigt wird.

## Neue App

Ablauf in `LEITFADEN.md` Abschn. 10 (inkl. `CLAUDE.md` und Tag-Regel für GitHub Pages; Letztere
fehlte beim ersten Release von plane-groups) und `vorlagen/README.md`.

## Literatur

- Quellen liegen in Thomas' Zotero. Zitiert wird mit gedruckten Seitenzahlen. Folien der Vorlesung nur
  als Massstab für Umfang und Begriffe, nie als Quelle.
- PDF-Seite ≠ gedruckte Seite: Hoffmann gedruckt = PDF − 12, Kleber gedruckt = PDF − 16, Conway et al.
  (*The Symmetries of Things*) gedruckt = PDF − 19 (geprüft 5.11.2026). Bei Borchardt-Ott
  schwankt der Abstand (Kap. 5: − 7, Kap. 6: − 6, ab Kap. 7: − 5; geprüft 4.11.2026): Seitenzahl im Kopf der
  PDF-Seite ablesen.
  Borchardt-Ott Tab. 9.4 und viele Aufgaben liegen nur als Bild vor (Seite als Bild lesen).
- **Gruppentheorie und Mathematik der Kristallographie** (zur Absicherung von Fragen und Skript, alle in
  Zotero): Brückler, *Mathematische Grundlagen der Kristallographie* (2019; Normalteiler und
  Faktorgruppe *G*_K/*B*_K, Def. 4.28, S. 146); Rosebrock, *Anschauliche Gruppentheorie* (2020;
  Nebenklassen und Satz von Lagrange, Abschn. 3.2, S. 41–42); Wipf, *Symmetrien in der Physik* (2023);
  Wagner, *Gruppentheoretische Methoden in der Physik* (1998, in Zotero ohne PDF); Glosauer,
  *Elementar(st)e Gruppentheorie* (2016; Symmetriegruppe des Dreiecks und Eckentripel (1, 2, 3) → (3, 1,
  2), Abschn. 1.1–1.2, S. 1–12; symmetrische Gruppen, Abschn. 3.2, S. 50; *D*_n als Untergruppe von
  *S*_n, Abschn. 3.3.2, S. 57; Nebenklassen, Abschn. 5.1, S. 80; Faktorgruppen, Kap. 6, S. 87). Dazu
  Schwarzenbach, *Kristallographie* (2001), Abschn. 2.4: Nebenklassen nach *T*, *P* ≅ *E*/*T*, mit einer
  Ebenengruppe als Beispiel, S. 45–46; Abschn. 2.5.1 („Der Klassenbegriff“, S. 46) warnt vor der
  Verwechslung mit Konjugiertenklassen. Paufler, *Physikalische Kristallographie*, führt Nebenklassen
  und Faktorgruppe nicht ein; nur die Zerlegung nach einer Untergruppe vom Index 2 für
  Schwarz-Weiss-Gruppen (Abschn. 4.3, S. 61, Gl. 4.11). Seiten (Abstand springt an jedem Kapitelanfang;
  geprüft 6.11.2026): Schwarzenbach gedruckt = PDF − 11 (Kap. 1), − 9 (Kap. 2), − 8 (Kap. 3), − 7 (Kap.
  4), − 5 (Kap. 5); Rosebrock − 12 (Kap. 1–3), − 11 (Kap. 4–9), − 10 (ab Kap. 10); Brückler − 7 (Kap.
  2), − 6 (Kap. 3–4), − 5 (Anhang); Wipf nur an S. 14 geprüft (− 16); Glosauer − 8 (geprüft an S. 9, 50,
  57, 80). Im Zweifel Seitenzahl im Kopf der PDF-Seite ablesen.
- **Bücher nicht blind übernehmen:** Abbildungen und Lösungen nachrechnen (Lösungen bei Borchardt-Ott
  verweisen oft nur auf Abbildungen). Bekannte Fehler stehen in der `CLAUDE.md` der jeweiligen App.
- Keine Abbildungen aus Büchern oder Folien übernehmen, auch nicht in Quiz und Moodle-Export; nur
  selbst erzeugte Bilder.
