// Skript der Muster-App: zeichnet die Abbildungen mit dem Code der App. Inhaltsverzeichnis, App-Links,
// Querstriche und Nachladen kommen aus lib/common/js/skript-kern.js.

import { appLink, inhaltsverzeichnis, querstriche } from '../lib/common/js/skript-kern.js';
import { versionEintragen, offline } from '../lib/common/js/seite.js';
import { VERSION } from './version.js';

/** @param {string} name */
const farbe = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

/** Eine Abbildung zu ihrer Link-Adresse (data-app) zeichnen; hier nur ein Muster. @param {HTMLElement} fig */
function zeichne(fig) {
  const pts = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) pts.push(`<circle cx="${260 + 70 * i}" cy="${260 + 70 * j}" r="5" fill="${farbe('ink')}"/>`);
  const svg = fig.querySelector('svg');
  if (svg) svg.innerHTML = `<rect width="520" height="520" fill="${farbe('paper')}"/>${pts.join('')}`;
}

function abbildungen() {
  for (const fig of /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('figure[data-app]'))) {
    appLink(fig, 'index.html');
    zeichne(fig);
  }
}

versionEintragen(VERSION);
abbildungen();
inhaltsverzeichnis();
document.fonts.ready.then(querstriche);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { abbildungen(); querstriche(); });
offline();
