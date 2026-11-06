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
- **Querstriche** (Drehinversion, negative Indizes) als eigene Linie knapp über der Ziffer (`.ov`), nie als `text-decoration: overline`. In SVG ebenso (`querstriche()` im Skript). Für Screenreader trägt der gezeichnete Strich den Alternativtext „−“ (`.ov::before` in `css/base.css`): x̄ wird als „−x“ vorgelesen. Deshalb Querstriche im HTML immer mit `.ov`, nie anders gezeichnet. Grenzen: Beim Kopieren und im PDF-Text fehlt das Minus weiterhin; Drehinversionen werden als „minus“ statt „quer“ gelesen, Indizes ohne Leerzeichen als eine Zahl („minus hundert“).
- **Hermann-Mauguin-Symbole und Indizes** immer über `format.js` (`hmHTML`, `hklHTML`).
- **Bildexport** (wo eine App Bilder anbietet): immer in den hellen Farben, Hintergrund durchsichtig.

## 5. Die App

Die App ist eine **Werkbank**: links die Bedienung, rechts die Darstellungen, darunter die Kenndaten. Bausteine in `css/app.css`.

### 5.1 Aufbau

- **Kopfzeile:** Titel (Source Serif) und Untertitel, Umschalter der Modi (`.tabs`), rechts „Skript“, „Quiz“, „Link kopieren“ und „?“ (Hilfeseite).
- **Seitenleiste** (`.side`), auf Laptop und iPad quer angeheftet mit eigenem Scrollbereich: Karten (`.card`) mit Überschrift in Kapitälchen-Stil. Auswahl und Standardanzeige oben; alles Weitere in einklappbaren Abschnitten (`.sect`), die unter ihrer Überschrift nennen, was sie enthalten (`.sumhint`).
- **Tafeln** (`.panel`) mit Kopf (Titel, Werkzeuge, Export), Darstellung, Legende (`.legend`) und Fusszeile.
- **Kenndaten** (`.info`) unter den Tafeln: grosses Symbol (`.hm-big`), Eckdaten (`.facts`), Erläuterungen einklappbar (`.explain`), Links ins Skript (`.skript-term`).
- **Gruppenwahl** als Knöpfe je Kristallsystem (`.picker`, `.sysrow`, `.pgb`), Aufstellungen in einer Zeile darunter, nur wenn nötig.
- **Anordnung der Tafeln** (`.layout` in `lib/common/css/app.css`): zwei gleich grosse Tafeln (`.p-a`, `.p-b`) nebeneinander; iPad hochkant untereinander; Telefon eine Tafel oben angeheftet mit Umschalter (`.figswitch`, `data-fig="a"`/`"b"`), Bedienung darunter. Eine App mit anderer Anordnung überschreibt in ihrem `<style>` die Regeln der Anordnung samt den Umbrüchen bei 999 und 719 px (das Anheften auf dem Telefon und der Umschalter gelten weiter); die Grösse der Darstellung in den Tafeln legt jede App selbst fest.

### 5.2 Bedienprinzipien

- **Weniger auf einmal:** Standardmässig sichtbar ist, was man aus Lehrbuch und Vorlesung von der Darstellung erwartet. Weiteres liegt in eingeklappten Abschnitten an klar ersichtlicher Stelle. Kein globaler Einfach/Erweitert-Modus.
- **Kein versteckter Zustand:** Ein Schalter, der gerade nicht wirkt, wird gesperrt und nicht abgewählt; der Grund steht darunter (`.check .why`), bei einem Schalter als Knopf in der Tafel bei der Tafel (Legende oder Hinweis). Anders die **Werkzeuge**: Knöpfe in der Werkzeugleiste einer Tafel, deren einziger Zweck die Art der Eingabe ist (z. B. Zeichnen und Radieren in plane-groups, Zone und Winkel in stereography). Sie schliessen sich wie eine Auswahl aus: Wählt man ein anderes Werkzeug oder schliesst eine andere Funktion sie aus, werden sie abgewählt; solange sie ausgeschlossen sind, sind sie gesperrt (sichtbar blass, `css/app.css`: `.tools button:disabled`, ebenso `.seg button:disabled`; Muster in Tafel A der Vorlage), und der Grund steht bei der Tafel. Gibt es ein Werkzeug in einem Modus gar nicht, fehlt es dort. Knöpfe für die Ansicht (z. B. Lupe) und Kontrollkästchen sind Schalter, auch wenn sie mitbestimmen, was ein Tippen bewirkt. Zwei Wege zum selben Ergebnis vermeiden.
- **Vorhersagbar:** Zurücksetzen je Abschnitt (`.resetbtn`) und „Alle Einstellungen zurücksetzen“: `<button class="resetbtn" id="reset-alles">` als letztes Element der Seitenleiste, ausserhalb aller Abschnitte und Karten, damit nie in einem eingeklappten Abschnitt verborgen (Vorlage). Er ruft `alleEinstellungenZuruecksetzen('<präfix>')` aus `lib/common/js/seite.js` auf: löscht alle Einträge der App im Speicher des Browsers ausser denen des Quiz und lädt die Seite ohne Hash neu. Deshalb beginnen alle Einträge einer App mit `<präfix>-`, die des Quiz mit `<präfix>-quiz`; nach `pagehide` (in `visibilitychange` oder `unload`) speichert die App nichts mehr.
- **Zustand in der Adresse** (`#m=…&…`), lesbar und stabil, erst geschrieben, wenn vom Standard abgewichen wird; „Link kopieren“ für Folien und Moodle. Zusätzlich im Browser gespeichert; ein Link hat Vorrang.
- **Eine Prüfung für Link und Speicher:** Beide laufen durch dieselbe Prüffunktion der App, die auch Abhängigkeiten zwischen Feldern prüft (z. B. die Winkel eines Gitters gemeinsam). Eine Zahl ausserhalb ihres Bereichs (z. B. ein Winkel über dem Regler) wird auf den nächsten gültigen Wert gesetzt, also auf die Bereichsgrenze. Ein Winkel, der umläuft (z. B. ein Azimut), wird in 0 … 360° umgerechnet. Alles andere Ungültige (fehlend, falscher Typ, unbekannte Auswahl, auch eine ganzzahlige wie eine Blickrichtung) wird durch den Startwert ersetzt, nicht umgedeutet; ebenso Werte, die erst zusammen ungültig sind (z. B. die Winkel eines Gitters). Zur wiederherstellbaren Ansicht gehört alles, was eine spätere Handlung braucht (z. B. die Herkunft einer Struktur für „Zurücksetzen“). Abgesichert durch Rundlauf-Tests (Abschnitt 9).
- **Geräte:** Laptop und iPad sind Ziel, Telefon nutzbar. Touch-Ziele mindestens 40 px, Trefferkreise für Punkte in Grafiken 44 px. Auf dem Telefon entfallen Export und „Link kopieren“.

### 5.3 Hilfen

- **Erste Schritte:** Karte oben in der Seitenleiste beim ersten Aufruf eines Modus, drei bis vier Schritte mit Knopf **je Modus**, wegklickbar; nicht bei Aufruf über einen Link. Wieder zu sehen nach „Alle Einstellungen zurücksetzen“; dieselben Schritte stehen als erste Anleitungen auf der Hilfeseite.
- **Tooltips** am Laptop (Maus verzögert, Tastaturfokus), **ⓘ-Erklärungen** je Abschnitt auf Touch-Geräten. Mechanik in `help.js`, Texte in der App (`hilfetexte.js`). Kurz, Begriffe wie im Skript.
- **Hilfeseite** `hilfe.html` neben Skript und Quiz, über „?“ in der Kopfzeile; Aufbau und Aussehen wie das Skript (hell und dunkel). Sie zeigt, was man mit der App machen kann und wie: wenige Anleitungen (höchstens etwa acht), jede eine konkrete Aufgabe Schritt für Schritt mit Bildern der Bedienung und einem Knopf, der die Aufgabe in der App öffnet (Link-Adresse). Die Bilder erzeugt ein Werkzeug mit Playwright im hellen Modus; ein Test prüft, dass die abgebildeten Bedienelemente noch existieren. Die Hilfeseite erklärt die Bedienung, nicht die Fachinhalte; umgekehrt ist das Skript keine Bedienungsanleitung. Umsetzung: Issue #24.

### 5.4 Barrierefreiheit

Die Apps sollen allgemein zugänglich sein, auch ohne Maus und mit Screenreader. Mindestregeln:

- **Bedeutung nie nur in Form oder Farbe:** Farben werden durch Symbole, Linienarten oder Beschriftungen ergänzt. Ein Alternativtext in CSS (`content: '' / '−'`) ist zulässig, z. B. beim Querstrich (Abschnitt 4).
- **ARIA-Rollen nur mit dem zugehörigen Verhalten.** Die Moduswahl ist ein vollständiges Tab-Muster: `role="tablist"` und `role="tab"`, ein gemeinsames `role="tabpanel"` (`<div class="layout" id="inhalt">` im `<main>`; das `<main>` selbst bleibt Hauptlandmarke), Pfeiltasten, Pos1 und Ende, nur der gewählte Tab im Fokus-Ablauf. Umsetzung mit `modusTabs()` aus `lib/common/js/seite.js` (Vorlage), aufgerufen vor dem ersten Moduswechsel; die App setzt `aria-selected` nicht selbst, sondern ruft `markieren(id)` dort, wo jeder Moduswechsel durchläuft, auch beim Laden aus Link oder Speicher.
- **Alles Bedienbare per Tastatur erreichbar.** Wo eine Zeichenfläche das nicht leistet (Pole, Motive ziehen), gibt es einen gleichwertigen Weg, z. B. eine beschriftete Liste und Felder für Koordinaten, auch als Brüche.
- **Kontraste** nach WCAG 2.2 für hell und dunkel messen: Text 4,5 : 1, grosser Text 3 : 1 (1.4.3), Bedienelemente und Grafik 3 : 1 (1.4.11). Touch-Ziele wie in Abschnitt 5.2, strenger als WCAG 2.5.8 (24 px).
- **Grafik auch als Text:** Das Wesentliche einer Darstellung steht als kurze Zusammenfassung in den Kenndaten (`.info`).
- **Bewegung:** `prefers-reduced-motion` beachten, auch in 3D-Ansichten; Übergänge schrittweise auslösen statt automatisch ablaufen lassen.
- **Vor einem grösseren Release** einmal mit einem Screenreader prüfen (VoiceOver oder NVDA).

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
- **Nummern** je Kapitel: Abbildungen „Abb. 1.2“; Teilbilder einer Reihe (`.fig-row`, `.fig-grid5`) „Abb. 1.2a“, dann „b“, „c“ …, mit gemeinsamer Unterschrift darunter (`.fig-note`, „Abb. 1.2“); in Spalten gefüllte Reihen (`.fig-cols`) jedes Teilbild mit voller Bezeichnung. Tabellen ohne Nummer, mit Unterschrift (`caption`). Beispiele: Skript der Vorlage, Abschn. 1.3.
- **PDF:** `tools/skript-pdf.mjs` erzeugt eine A4-Fassung mit Inhaltsverzeichnis und Lesezeichen; bei jedem Release auf der Seite und als Anhang.

## 7. Das Quiz

Eigene Seite `quiz.html`. Logik in `js/quiz-core.js`, Seite in `js/quiz-seite.js`, Stile in `css/quiz.css`; die App liefert Fragen, Kapitel und die Bildfunktion.

- **Zweck:** Übung zu den Lernzielen des Skripts, nur Themen aus App und Skript. Kein Ersatz für ein Moodle-Quiz, keine Aussage zur Klausur.
- **Drei Stufen:** 1 Grundlagen (Grundstoff, ein Begriff, ein Schritt, ein Bild), 2 Anwendung (Grundstoff, mehrschrittig, auch Randthemen), 3 Vertiefung (zusätzlich die Vertiefungen des Skripts). Stufe 3 bedeutet mehr Stoff, nicht unbedingt schwierigere Fragen. Höhere Stufen enthalten Fragen der niedrigeren (Anteile in `quiz-core.js`).
- **Fragetypen:** Einfachauswahl, Mehrfachauswahl, Frage mit Bild, Bilder als Antworten, Bild mit Bildern als Antworten. Bilder kommen aus dem Code der App.
- **Ablenker** bilden typische Fehler ab; die Rückmeldung benennt den Fehler der gewählten Antwort.
- **Rückmeldung sofort:** richtig/falsch, Erklärung, Lernziel, „Im Skript nachlesen“ und, wo sinnvoll, „In der App öffnen“. Link und Frage müssen zusammenpassen.
- **Fragenbank** `js/quiz-bank.js` nach Abschn. 9 (Daten getrennt vom Code); berechnete Fragen gehören in die Generatoren (`js/quiz-gen.js`).
- **Erzeugte Fragen** aus den Daten der App sind erlaubt: höchstens 50 % eines Quiz, je Generator höchstens 30 %, jeweils bezogen auf die tatsächliche Länge des Quiz und abgerundet (bei 5 Fragen also höchstens eine je Generator). Reichen die handgeschriebenen Fragen dafür nicht, um die gewählte Länge zu erreichen, gilt nur noch: nie mehr erzeugte als handgeschriebene Fragen, gleichmässig über die Generatoren verteilt. Ein Parameter eines Generators kommt nur auf einer Stufe vor, und jede Frage-ID nur einmal: Der Schlüssel des Fortschritts (Frage-ID bzw. `<generator>:<parameter>`) enthält keine Stufe; `kandidaten()` bricht sonst mit einem Fehler ab. Die Tests der App rufen `kandidaten()` deshalb auch mit `{ entwurf: true }` auf. Kürzer als gewählt wird ein Quiz damit nur, wenn es weniger handgeschriebene Fragen gibt als die halbe gewählte Länge oder zu wenige erzeugte.
- **Freigabe:** Nur Fragen mit `status: 'geprüft'` erscheinen; „Auch ungeprüfte Fragen zeigen“ (`?entwurf`) nimmt Entwürfe dazu. „Geprüft“ heisst fachlich korrekt; die Formulierung darf danach noch besser werden.
- **Fortschritt** nur lokal im Browser (kein Konto, kein Server). Der Name des Speichers einer App wird nie geändert.
- **Moodle-Export:** `tools/moodle-export.mjs` in der App (Moodle-XML, Bilder als eingebettete SVG, Kategorien nach Kapitel und Stufe).

## 8. Verzahnung

- **Innerhalb einer App:** App → Skript (Kopfzeile, Begriffe in der Infobox), Skript → App (jede Abbildung), Skript → Quiz („Lernziele prüfen“), Quiz → Skript und App (Rückmeldung). Links aus dem Quiz öffnen einen neuen Tab, damit das Quiz offen bleibt.
- **Zwischen den Apps:** über Link-Adressen, z. B. von einer Ebenen- oder Raumgruppe zu ihrer Punktgruppe im Stereogramm. Die Link-Adressen einer App sind damit eine **Schnittstelle**: Ihr Format steht im README der App, bleibt stabil (alte Links werden umgerechnet, nie ungültig) und ist durch Tests abgesichert.
- **Querverweise im Skript** auf Skripte anderer Apps mit voller Adresse und Anker.

## 9. Technik

- **Statische Web-App ohne Build-Schritt**, gehostet auf GitHub Pages. Ordner: `index.html`, `skript.html`, `quiz.html`, `js/`, `lib/` (Fremdcode und `lib/common/`), `icons/`, `tests/`, `tools/`.
- **Gemeinsame Dateien** als Kopie mit fester Version in `lib/common/` und `tools/common/` (siehe README). Nie in der App ändern.
- **Daten getrennt vom Code.** Fachliche Inhalte und Texte (Fragen, Beispiele, Hilfetexte, Tabellen wie Punkt- oder Ebenengruppen, Bezeichnungen) stehen in eigenen Datendateien unter `js/`; Logik, Oberfläche und Zeichnung holen sie von dort. So lassen sich Inhalte prüfen und ändern, ohne den Code anzufassen, und Tests, Fragenliste und Moodle-Export nutzen dieselbe Quelle. Kleine Zuordnungen, die nur der Umsetzung dienen (z. B. Achse → Buchstabe), bleiben im Code.
  - Datendateien sind ES-Module, nicht JSON: So sind Kommentare und Formatierungshelfer möglich (z. B. `mat()`, Querstrich), und alle Verbraucher laden dieselbe Datei ohne Build-Schritt. Sie enthalten nur Literale und reine Formatierungshelfer (Text → HTML), keine Programmlogik. Erlaubt ist ausserdem eine Kennzeichnung der Typen (z. B. Indizes als `Normale`): eine reine Typangabe `/** @type {…} */ (…)` ohne Laufzeitcode, je Tabelle einmal und nicht in jedem Eintrag, damit die Einträge einfache Literale bleiben. Umformungen wie Zeile → Objekt oder berechnete Felder fallen nicht darunter.
  - Bestehender Code wird schrittweise umgestellt, wenn die Dateien ohnehin angefasst werden (stereography#75, plane-groups#55).
- **Offline:** Service Worker mit eigener Cache-Kennung je App; die Offline-Liste deckt alle Dateien ab (Test). Neue Version beim nächsten Öffnen mit Netz.
- **Als Web-App** auf dem Homescreen installierbar (Manifest, Icons).
- **Tests** mit `node --test`, ohne Abhängigkeiten; Browser-Durchläufe mit Playwright, wo nötig.
  - **Rundlauf-Tests** je App, ohne Browser: Zustand → Link → Zustand; alter Speicherstand → gültiger Zustand; Zurücksetzen vor und nach dem Neuladen gleich (Abschnitt 5.2). Erwartungen unabhängig vom Code formulieren, nicht mit derselben Rechnung.
- **HTML aus Zeichenketten:** Text kommt nur über `esc()` aus `lib/common/js/format.js` (Inhalt und Attributwerte) oder über `textContent` in die Seite. Mit `innerHTML` nur HTML aus den eigenen Daten der App. Werte aus Link und Speicher erst nach der Prüfung (Abschnitt 5.2), und dann als Text. `esc()` schützt nicht Adressen (`href`, `src`), `on…`-Attribute und `style`; dort nur feste Werte der App. Der Moodle-Export maskiert XML mit eigenen Helfern (`tools/moodle.mjs`).
- **Typprüfung** mit TypeScript über JSDoc-Typen und `checkJs` (`tsconfig.json`, CI-Job `typen`); keine `.ts`-Dateien, kein Build-Schritt. TypeScript wird nur für die Prüfung installiert, wie Playwright.
  - Alle Dateien in `js/`, `tools/` und `tests/` strikt (`strict`), ohne `// @ts-nocheck`; diese Ordner stehen in `include` der `tsconfig.json`.
  - Typen der Familie nicht in der App neu definieren: Vektoren, Matrizen und gekennzeichnete Typen aus `lib/common/js/typen.js`, Fragen, Generatoren und Kapitel aus `lib/common/js/quiz-core.js`.
  - Wo Werte gleicher Form leicht vertauscht werden, gekennzeichnete Typen verwenden: Richtung [uvw] und Normale (hkl), Grad und Bogenmass, fraktionale und kartesische Koordinaten. Die Umwandlung steht dort, wo die Bedeutung feststeht.
  - Die Typprüfung ersetzt keine Tests: Formeln, Vorzeichen und Toleranzen sichern weiterhin die Tests ab.
  - **Elemente der Seite**, die da sein müssen, über die geprüften Helfer aus `lib/common/js/seite.js`: nach ID `$`, `eingabe`, `auswahl`, `knopf`, `abschnitt`, `grafik` (allgemein `nachId(id, Art)`), nach Selektor `element(sel, Art)` und `elemente(sel, Art)` (ohne Art: HTML-Element). Nicht über eigene Umwandlungen wie `/** @type {HTMLInputElement} */ (document.getElementById(…))`. Die Helfer werfen einen Fehler mit der ID bzw. dem Selektor, wenn das Element fehlt oder eine andere Art hat. Was fehlen darf, wird mit `getElementById`/`querySelector` und einer Prüfung auf `null` gesucht; Suchen innerhalb eines Elements (z. B. einer Abbildung) bleiben in der Datei. Helfer, die dasselbe tun, heissen in allen Apps gleich.
- **ESLint** mit den empfohlenen Regeln (`@eslint/js`), CI-Job `lint`. Die Regeln stehen einmal in `tools/eslint-basis.mjs` (in der App `tools/common/eslint-basis.mjs`); `eslint.config.mjs` jedes Repositorys lädt sie und ergänzt nur Ausnahmen wie Fremdcode. Installiert wird ESLint wie TypeScript nur für die Prüfung. Befunde werden behoben; eine Ausnahme im Code (`// eslint-disable-next-line <Regel> -- Grund`) nur mit Grund.
- **Versionen** nach Semantic Versioning, CHANGELOG nach *Keep a Changelog*. Die Live-Seite ändert sich **nur bei einem Release-Tag** `vX.Y.Z`, der zu `js/version.js` passt; `main` sammelt geprüfte Änderungen. Ablauf im README jeder App (Abschnitt „Versionen und Releases“).
- **GitHub-Auftritt** gleich in allen Repositories der Familie:
  - **README** nach der Gliederung von `vorlagen/app/README.md`: Badges, Einleitung mit Herkunft, Link zur App, Bildschirmfoto, Funktionen, Nutzung (Browser, Homescreen, offline, lokal), Link-Adressen, Konventionen, Entwicklung (Aufbau, gemeinsame Grundlage, Tests, Releases), Quellen, Entstehung (Hinweis, dass die App mit Hilfe von Claude Code entstanden ist, und wer fachlich freigibt), Rückmeldungen, Zitieren, Lizenz. Abschnitte, die nicht passen, entfallen; die Reihenfolge bleibt.
  - **About:** Beschreibung (ein Satz, Deutsch), Website (Live-Seite), Themen (`crystallography`, `education`, `teaching`, `eth-zurich` und fachliche). **Vorschaubild** für geteilte Links (`docs/social-preview.png`, 1280 × 640 px, von Hand unter Settings → General → Social preview hochgeladen).
  - **CodeQL** prüft den eigenen Code, nicht Tests, nicht die Kopie der gemeinsamen Dateien (wird hier geprüft) und keinen Fremdcode (z. B. `lib/three.bundle.js`, in `codeql-config.yml` der App ergänzen). Befunde werden behoben oder mit Begründung als Fehlalarm verworfen, nie stillschweigend.
  - **Dateien:** `CITATION.cff` mit Kurzfassung (`abstract`), `SECURITY.md`, Vorlagen für Issues (`.github/ISSUE_TEMPLATE/`: Fehler, fachlicher Hinweis, Vorschlag), Lizenz MIT.
  - **Einstellungen:** Regel „main schützen“ (Änderungen nur über Pull Request, CI-Prüfungen müssen grün sein, kein Force-Push), CodeQL in der erweiterten Einrichtung (`.github/workflows/codeql.yml` und `.github/codeql/codeql-config.yml` aus `vorlagen/app/`; die Standardeinrichtung muss dann aus sein, sonst scheitert der Workflow), Dependabot-Alerts, Secret Scanning mit Push-Schutz, private Meldung von Sicherheitslücken; Wiki und Projects aus (Dokumentation im Repository, Aufgaben in Issues).
- **Datenschutz:** keine Daten an Dritte, keine externen Schriften oder Skripte zur Laufzeit.

## 10. Eine neue App anlegen

1. Leeres Repository auf GitHub anlegen (Name auf Englisch, wie `stereography`).
2. Dateien aus `vorlagen/` übernehmen und die Platzhalter ersetzen (siehe `vorlagen/README.md`).
3. `node tools/sync.mjs <neue App>` von einem Release-Tag dieses Repositories.
4. Konzept der App als Dokument festhalten (Inhalte, Modi, Link-Adressen, Kapitel des Skripts), dann App, Skript und Quiz in dieser Reihenfolge.
5. Die neue App in die Tabelle im README dieses Repositories und in die Verzahnung (Abschnitt 8) aufnehmen.
6. `CLAUDE.md` nach dem Muster der bestehenden Apps anlegen (`.github/pull_request_template.md` kommt mit der Vorlage); die `CLAUDE.md` bindet die `CLAUDE.md` dieses Repositories mit `@../crystallography-common/CLAUDE.md` ein (so lädt Claude Code beide).
7. `tools/quiz-quelle.mjs` nach dem Muster der bestehenden Apps anlegen (Fragen für die gemeinsame Fragenliste, `fragenliste/extract.mjs`) und die App dort in die Liste der Ordner aufnehmen.
8. GitHub Pages: unter Settings → Environments → github-pages eine Tag-Regel `v*.*.*` anlegen, sonst scheitert der Deploy aus Tags. Die übrigen Einstellungen und der Auftritt nach Abschnitt 9; in der Regel „main schützen“ die Prüfungen `test`, `typen`, `lint` und `pdf`; dazu das Label `inhalt` für die Vorlage „Fachlicher Hinweis“.
9. Den Ordner der App in `kristallographie.code-workspace` dieses Repositories ergänzen.

## 11. Offene Punkte

Offene Punkte der Familie stehen als [Issues in crystallography-common](https://github.com/manganite/crystallography-common/issues), die einer App in deren Issues, nicht in diesem Leitfaden.
