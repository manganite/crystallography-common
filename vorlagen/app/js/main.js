// Muster-App: zeigt die gemeinsamen Bausteine der Werkbank. In einer neuen App durch die eigene Logik ersetzen;
// Aufbau (Kopfzeile, Seitenleiste, Tafeln, Kenndaten, Hilfen, Telefon) und die Namen der Klassen beibehalten.

import { hmHTML } from '../lib/common/js/format.js';
import { initHelp } from '../lib/common/js/help.js';
import { offline, alleEinstellungenZuruecksetzen, $, eingabe, abschnitt, grafik, element, elemente, modusTabs } from '../lib/common/js/seite.js';
import { ablaufKarte } from '../lib/common/js/ablauf.js';
import { TIPS, SECTIONS, LABELS, ABLAEUFE } from './hilfetexte.js';
import { VERSION } from './version.js';

// Elemente der Seite (index.html) über die geprüften Helfer aus seite.js ($, eingabe, abschnitt, grafik, element, elemente)
const REPO = 'https://github.com/manganite/crystallography-common';

/** Die 17 Ebenengruppen nach Kristallsystem (ITA, Vol. A, Tab. 2.2.1.1; Kurzsymbole). @type {[string, string[]][]} */
const SYSTEME = [
  ['schiefwinklig', ['p1', 'p2']],
  ['rechtwinklig', ['pm', 'pg', 'cm', 'p2mm', 'p2mg', 'p2gg', 'c2mm']],
  ['quadratisch', ['p4', 'p4mm', 'p4gm']],
  ['hexagonal', ['p3', 'p3m1', 'p31m', 'p6', 'p6mm']],
];
let gruppe = 'p4mm';

function zeigePicker() {
  $('picker').innerHTML = SYSTEME.map(([sys, gs]) => `<div class="sysrow"><span class="sys">${sys}</span><div class="btns">${
    gs.map((g) => `<button class="pgb" type="button" data-g="${g}" aria-pressed="${g === gruppe}">${hmHTML(g)}</button>`).join('')}</div></div>`).join('');
}

/** Farbe einer Variablen aus base.css (für SVG). @param {string} name */
const farbe = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

function zeichneA() {
  const pts = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) pts.push(`<circle cx="${260 + 70 * i}" cy="${260 + 70 * j}" r="5" fill="${farbe('ink')}"/>`);
  const zelle = eingabe('opt-zelle').checked ? `<rect x="260" y="260" width="70" height="70" fill="${farbe('crystal')}" fill-opacity="0.35" stroke="${farbe('accent')}" stroke-width="2"/>` : '';
  grafik('bild-a').innerHTML = `<rect width="520" height="520" fill="${farbe('paper')}"/>${zelle}${pts.join('')}`;
  $('legend').innerHTML = `<span class="lg"><span class="sw" style="background:${farbe('ink')}"></span>Gitterpunkt</span><span class="lg"><span class="sw" style="background:${farbe('accent')}"></span>Elementarzelle</span><span class="lg hint">Werkzeug 3 gesperrt: Beispiel für den Grund bei der Tafel</span>`;
}

function zeichneB() {
  const namen = ['ax2', 'ax3', 'ax4', 'ax6', 'dir1', 'dir2', 'dir3', 'fc0', 'fc1', 'fc2', 'fc3', 'fc4', 'fc5', 'fc6', 'fc7', 'accent', 'accent2'];
  const zeilen = namen.map((n, i) => {
    const x = 40 + 240 * Math.floor(i / 9), y = 50 + 50 * (i % 9);
    return `<rect x="${x}" y="${y - 16}" width="28" height="28" rx="6" fill="${farbe(n)}"/><text x="${x + 40}" y="${y + 4}" font-family="IBM Plex Sans" font-size="16" fill="${farbe('ink')}">--${n}</text>`;
  });
  grafik('bild-b').innerHTML = `<rect width="520" height="520" fill="${farbe('paper')}"/>${zeilen.join('')}`;
}

function zeigeInfo() {
  $('info').innerHTML = `
    <div class="info-head"><span class="hm-big">${hmHTML(gruppe)}</span>
      <div class="hm-meta"><span>Ebenengruppe</span><span>Beispiel für die Kenndaten</span></div></div>
    <dl class="facts">
      <div><dt>Kristallsystem</dt><dd>${SYSTEME.find(([, gs]) => gs.includes(gruppe))?.[0]}</dd></div>
      <div><dt>Begriff mit Link ins Skript</dt><dd><a class="skript-term" href="skript.html#kapitel1">Gitter</a></dd></div>
      <div><dt>Zahl</dt><dd class="num">4</dd></div>
    </dl>
    <h3>Abschnitt der Kenndaten</h3>
    <ul class="elems"><li>erstes Element</li><li>zweites Element</li></ul>
    <details class="explain"><summary>Erläuterung</summary><p class="note">Längere Erläuterungen sind einklappbar.</p></details>
    <div class="warnbox"><strong>Hinweis</strong><p>Kasten für Warnungen, z. B. bei gebrochener Symmetrie.</p></div>
    <div class="okbox">Kasten für eine Bestätigung.</div>`;
}

function alles() { zeigePicker(); zeichneA(); zeichneB(); zeigeInfo(); }

function init() {
  alles();
  $('picker').addEventListener('click', (e) => {
    const b = /** @type {HTMLElement | null} */ (/** @type {Element} */ (e.target).closest('.pgb'));
    if (b?.dataset.g) { gruppe = b.dataset.g; alles(); }
  });
  for (const id of ['opt-zelle']) $(id).addEventListener('change', zeichneA);
  // abhängiger Schalter: gesperrt statt abgewählt, Grund sichtbar (kein versteckter Zustand)
  $('opt-motiv').addEventListener('change', () => {
    const an = eingabe('opt-motiv').checked;
    eingabe('opt-beschr').disabled = !an;
    const why = $('row-beschr').querySelector('.why');
    if (why) why.textContent = an ? '' : 'nur mit „Motiv in allgemeiner Lage“';
  });
  $('lat-ba').addEventListener('input', () => { $('lat-ba-out').textContent = Number(eingabe('lat-ba').value).toFixed(2); });
  // Werkzeuge (Leitfaden Abschn. 5.2): schliessen sich aus, ein zweiter Klick wählt ab; Werkzeug 3 ist als
  // Beispiel ausgeschlossen (gesperrt, Grund in der Legende)
  const werkzeuge = elemente('[data-werkzeug]', HTMLButtonElement);
  werkzeuge.forEach((b) => b.addEventListener('click', () => {
    const an = b.getAttribute('aria-pressed') !== 'true';
    werkzeuge.forEach((x) => x.setAttribute('aria-pressed', String(an && x === b)));
  }));
  elemente('.seg button', HTMLButtonElement).forEach((b) => b.addEventListener('click', () => {
    b.parentElement?.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
  // Modi: Tab-Muster mit Pfeiltasten (Leitfaden Abschn. 5.4); markieren() auch beim Laden aus Link oder Speicher
  const modi = modusTabs(element('.tabs'), $('inhalt'));
  for (const t of ['tab-a', 'tab-b']) $(t).addEventListener('click', () => modi.markieren(t));
  // Telefon: eine Tafel oben, Umschalter
  const figKnoepfe = elemente('.figswitch button', HTMLButtonElement);
  figKnoepfe.forEach((b) => b.addEventListener('click', () => {
    document.body.dataset.fig = b.dataset.fig;
    figKnoepfe.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.fig === b.dataset.fig)));
  }));
  // Erste Schritte: Lernexperimente des Modus (ablauf.js); beim ersten Besuch ist das erste geöffnet, nicht bei
  // Aufruf über einen Link; wegklickbar, über „?“ wieder. Handlungen setzen den Zustand über die Adresse.
  const INTRO = 'muster-intro';
  let gesehen = false;
  try { gesehen = localStorage.getItem(INTRO) === '1'; } catch { /* ohne Speicher weiter */ }
  const karte = ablaufKarte($('ablauf'), ABLAEUFE, {
    anwenden: (hash) => { const g = new URLSearchParams(hash.slice(1)).get('g'); if (g) gruppe = g; alles(); },
    adresse: () => `#g=${gruppe}`,
    aktionen: { darstellung: () => { abschnitt('sec-view').open = true; } },
    skriptUrl: (anker) => `skript.html#${anker}`,
  });
  karte.modus('a');
  /** @param {boolean} an */
  const intro = (an) => { $('intro').hidden = !an; $('help-open').setAttribute('aria-expanded', String(an)); if (!an) karte.liste(); };
  if (!gesehen && !location.hash) { const erster = karte.erster(); if (erster) karte.starte(erster, { fokus: false }); intro(true); }
  $('intro-close').addEventListener('click', () => { intro(false); try { localStorage.setItem(INTRO, '1'); } catch { /* ohne Speicher weiter */ } });
  $('help-open').addEventListener('click', () => intro(Boolean($('intro').hidden)));
  $('copy-link').addEventListener('click', () => navigator.clipboard?.writeText(location.href));
  // Alle Einträge „muster-…“ im Speicher des Browsers ausser denen des Quiz (Leitfaden Abschn. 5.2)
  $('reset-alles').addEventListener('click', () => alleEinstellungenZuruecksetzen('muster'));
  initHelp({ tips: TIPS, sections: SECTIONS, labels: LABELS });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', alles);
  $('app-version').innerHTML = `<a href="${REPO}">Version ${VERSION}</a>`;
}

init();
offline({ lokal: true, neuLaden: true });
