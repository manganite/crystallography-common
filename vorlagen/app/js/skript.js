// Skript der Muster-App: zeichnet die Abbildungen mit dem Code der App. Inhaltsverzeichnis, App-Links,
// Querstriche und Nachladen kommen aus lib/common/js/skript-kern.js.

import { appLink, inhaltsverzeichnis, querstriche } from '../lib/common/js/skript-kern.js';
import { versionEintragen, offline, elemente, element, eingabe } from '../lib/common/js/seite.js';
import { VERSION } from './version.js';

/** @param {string} name */
const farbe = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

/** Eine Abbildung zu ihrer Link-Adresse (data-app) zeichnen; hier nur ein Muster. @param {HTMLElement} fig @param {number} [d] Abstand */
function zeichne(fig, d = 70) {
  const pts = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) pts.push(`<circle cx="${260 + d * i}" cy="${260 + d * j}" r="5" fill="${farbe('ink')}"/>`);
  const svg = fig.querySelector('svg');
  if (svg) svg.innerHTML = `<rect width="520" height="520" fill="${farbe('paper')}"/>${pts.join('')}`;
}

// Abbildung mit Regler (Abb. 1.7): zeichnet mit dem eingestellten Abstand, die Ausgabe nennt ihn
const regler = eingabe('muster-regler');
const reglerFig = element('.regler-fig'), reglerAus = element('.regler-fig output', HTMLOutputElement);
function zeichneRegler() {
  zeichne(reglerFig, Number(regler.value));
  reglerAus.textContent = `Abstand der Punkte: ${regler.value} Einheiten.`;
}

function abbildungen() {
  for (const fig of elemente('figure[data-app]')) {
    appLink(fig, 'index.html');
    zeichne(fig);
  }
  zeichneRegler();
}

versionEintragen(VERSION);
abbildungen();
regler.addEventListener('input', zeichneRegler);
inhaltsverzeichnis();
document.fonts.ready.then(querstriche);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { abbildungen(); querstriche(); });
offline();
