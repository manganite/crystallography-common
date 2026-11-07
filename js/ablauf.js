// Geführte Abläufe (Lernexperimente als Erste Schritte, später die geführte Bestimmung, #87): je Schritt
// Frage → Vermutung → Handlung → Beobachtung → Erklärung. Die App bleibt dabei normal bedienbar; die Handlung setzt
// den Zustand über die Link-Adresse (Ausnahme: eine benannte Aktion der App). Vor der Handlung merkt sich der
// Ablauf die Adresse; danach schaltet „Vorher/Nachher“ zwischen beiden um (#69).
// Die Abläufe selbst sind Daten der App (Leitfaden Abschn. 9); Texte dürfen einfaches HTML enthalten (<i>, <b>,
// <sub>), sie stammen aus der App und nicht aus Eingaben. pruefeAblaeufe() hilft den Tests der App.

/**
 * Handlung eines Schritts: Text des Knopfs und entweder eine Link-Adresse (`#…`, Regelfall, auch für die Hilfeseite)
 * oder der Name einer Aktion der App (für Bedienhandlungen, die nicht in der Adresse stehen).
 * @typedef {{ text: string, hash?: string, aktion?: string }} Handlung
 */
/**
 * Schritt. vermutung: 2–3 Antworten zur Frage, richtig: Index der zutreffenden (nach der Beobachtung markiert,
 * ohne Punkte). Ohne handlung beantwortet die Wahl die Frage selbst (z. B. Ja/Nein bei der Bestimmung); weiter
 * führt dann je Antwort (Index als Schlüssel) zur id eines Schritts, sonst geht es der Reihe nach weiter.
 * skript: Anker im Skript (ohne #).
 * @typedef {{ id?: string, frage: string, vermutung?: string[], richtig?: number, handlung?: Handlung,
 *   beobachtung?: string, erklaerung?: string, skript?: string, weiter?: Record<string, string> }} Schritt
 */
/** Ablauf (Lernexperiment). modus: Modus der App, in dem er angeboten wird. @typedef {{ id: string, modus?: string, titel: string, schritte: Schritt[] }} Ablauf */
/**
 * Stand eines laufenden Ablaufs. weg: Indizes der besuchten Schritte (für „Zurück“), gewaehlt: Antwort je
 * Schrittindex, gezeigt: Schritte, deren Beobachtung sichtbar ist, vorher/nachher: Adressen um die Handlung,
 * vorherAktiv: gerade ist „Vorher“ angewandt.
 * @typedef {{ ablauf: Ablauf, weg: number[], gewaehlt: Record<number, number>, gezeigt: Set<number>,
 *   vorher: Record<number, string>, nachher: Record<number, string>, vorherAktiv: boolean }} Stand
 */

/** Index eines Schritts nach id. @param {Ablauf} a @param {string} id */
const indexVon = (a, id) => a.schritte.findIndex((s) => s.id === id);

/**
 * Nächster Schritt nach i (Index) oder -1 am Ende: bei Verzweigung nach der gewählten Antwort, sonst der folgende.
 * @param {Ablauf} a @param {number} i @param {number | undefined} antwort
 */
export function naechster(a, i, antwort) {
  const s = a.schritte[i];
  if (s.weiter) return antwort === undefined || !(String(antwort) in s.weiter) ? -1 : indexVon(a, s.weiter[String(antwort)]);
  return i + 1 < a.schritte.length ? i + 1 : -1;
}

/**
 * Prüft Abläufe auf Fehler in den Daten, für die Tests der App. hashGueltig: Prüffunktion der App für eine
 * Link-Adresse (z. B. Rundlauf durch die Prüffunktion des Zustands), aktionen: Namen der Aktionen der App.
 * Rückgabe: Liste der Fehler (leer, wenn alles stimmt).
 * @param {Ablauf[]} ablaeufe
 * @param {{ hashGueltig?: (hash: string) => boolean, aktionen?: string[] }} [o]
 * @returns {string[]}
 */
export function pruefeAblaeufe(ablaeufe, { hashGueltig = () => true, aktionen = [] } = {}) {
  /** @type {string[]} */
  const f = [];
  const ids = new Set();
  for (const a of ablaeufe) {
    if (ids.has(a.id)) f.push(`${a.id}: id doppelt`);
    ids.add(a.id);
    if (!a.schritte.length) f.push(`${a.id}: keine Schritte`);
    const sids = a.schritte.map((s) => s.id).filter(Boolean);
    if (new Set(sids).size !== sids.length) f.push(`${a.id}: Schritt-id doppelt`);
    a.schritte.forEach((s, i) => {
      const w = `${a.id}, Schritt ${i + 1}`;
      const n = s.vermutung?.length ?? 0;
      if (s.vermutung && (n < 2 || n > 3)) f.push(`${w}: 2–3 Antworten erwartet, ${n} gefunden`);
      if (s.richtig !== undefined && (!s.vermutung || !Number.isInteger(s.richtig) || s.richtig < 0 || s.richtig >= n)) f.push(`${w}: richtig ausserhalb der Antworten`);
      if (s.handlung) {
        const h = s.handlung;
        if ((h.hash === undefined) === (h.aktion === undefined)) f.push(`${w}: Handlung braucht genau eines von hash und aktion`);
        if (h.hash !== undefined && (!h.hash.startsWith('#') || !hashGueltig(h.hash))) f.push(`${w}: ungültige Adresse ${h.hash}`);
        if (h.aktion !== undefined && !aktionen.includes(h.aktion)) f.push(`${w}: unbekannte Aktion ${h.aktion}`);
        if (!s.beobachtung) f.push(`${w}: Beobachtung fehlt`);
      } else if (!s.vermutung) f.push(`${w}: weder Handlung noch Antworten`);
      if (s.weiter) {
        if (s.handlung || !s.vermutung) f.push(`${w}: Verzweigung nur bei Antworten ohne Handlung`);
        for (const k of Object.keys(s.weiter)) if (!(Number(k) >= 0 && Number(k) < n)) f.push(`${w}: Verzweigung für unbekannte Antwort ${k}`);
        for (const z of Object.values(s.weiter)) if (indexVon(a, z) < 0) f.push(`${w}: Ziel ${z} fehlt`);
      }
    });
    // jeder Weg endet: keine Schleifen (Tiefensuche über alle Antworten)
    /** @param {number} i @param {Set<number>} pfad @returns {boolean} */
    const endet = (i, pfad) => {
      if (i < 0) return true;
      if (pfad.has(i)) return false;
      const s = a.schritte[i];
      const p = new Set(pfad).add(i);
      return s.weiter ? Object.keys(s.weiter).every((k) => endet(naechster(a, i, Number(k)), p)) : endet(naechster(a, i, undefined), p);
    };
    if (a.schritte.length && !endet(0, new Set())) f.push(`${a.id}: Schleife im Ablauf`);
  }
  return f;
}

/** Neuer Stand für einen Ablauf. @param {Ablauf} ablauf @returns {Stand} */
export const neuerStand = (ablauf) => ({ ablauf, weg: [0], gewaehlt: {}, gezeigt: new Set(), vorher: {}, nachher: {}, vorherAktiv: false });

/**
 * HTML der Liste der Abläufe eines Modus (Knöpfe data-ablauf).
 * @param {Ablauf[]} liste @param {Set<string>} [erledigt] ids der abgeschlossenen Abläufe
 */
export function listeHTML(liste, erledigt = new Set()) {
  if (!liste.length) return '';
  return `<p class="ablauf-hinweis">Kleine Experimente: erst vermuten, dann ausprobieren.</p><ol class="ablauf-liste">${liste.map((a) =>
    `<li${erledigt.has(a.id) ? ' class="done"' : ''}><button class="linkbtn" type="button" data-ablauf="${a.id}">${a.titel}</button></li>`).join('')}</ol>`;
}

/**
 * HTML des aktuellen Schritts. skriptUrl: Adresse zu einem Anker im Skript (ohne Angabe kein Link).
 * @param {Stand} st @param {{ skriptUrl?: (anker: string) => string }} [o]
 */
export function schrittHTML(st, { skriptUrl } = {}) {
  const a = st.ablauf;
  const i = st.weg[st.weg.length - 1];
  const s = a.schritte[i];
  const gezeigt = st.gezeigt.has(i);
  const wahl = st.gewaehlt[i];
  const linear = !a.schritte.some((x) => x.weiter);
  const fortschritt = linear ? `Schritt ${i + 1} von ${a.schritte.length}` : `Schritt ${st.weg.length}`;
  const antworten = s.vermutung ? `<div class="ablauf-vermutung" role="group" aria-label="${s.handlung ? 'Deine Vermutung' : 'Deine Antwort'}">${s.vermutung.map((t, k) => {
    const kl = [gezeigt && s.richtig === k ? 'richtig' : '', gezeigt && wahl === k && s.richtig !== undefined && s.richtig !== k ? 'falsch' : ''].filter(Boolean).join(' ');
    const marke = (gezeigt && s.richtig === k ? ' <span class="ablauf-marke">✓ trifft zu</span>' : '')
      + (gezeigt && wahl === k && s.richtig !== undefined ? ' <span class="ablauf-deine">(deine Vermutung)</span>' : '');
    return `<button type="button" data-antwort="${k}" aria-pressed="${wahl === k}"${kl ? ` class="${kl}"` : ''}${gezeigt ? ' disabled' : ''}>${t}${marke}</button>`;
  }).join('')}</div>` : '';
  const handlung = s.handlung && !gezeigt ? `<p><button class="linkbtn ablauf-tun" type="button" data-tun="1">${s.handlung.text}</button></p>` : '';
  const vergleich = gezeigt && st.vorher[i] !== undefined && st.vorher[i] !== st.nachher[i]
    ? `<p><button class="linkbtn" type="button" data-vergleich="1" aria-pressed="${st.vorherAktiv}">${st.vorherAktiv ? 'Nachher zeigen' : 'Vorher zeigen'}</button></p>` : '';
  const skript = s.skript && skriptUrl ? ` <a href="${skriptUrl(s.skript)}">Im Skript nachlesen</a>` : '';
  const ergebnis = gezeigt && (s.beobachtung || s.erklaerung)
    ? `${s.beobachtung ? `<p class="ablauf-beobachtung">${s.beobachtung}</p>` : ''}${s.erklaerung || skript ? `<p class="ablauf-erklaerung">${s.erklaerung ?? ''}${skript}</p>` : ''}` : '';
  const ende = naechster(a, i, wahl) < 0;
  const weiterFrei = gezeigt || (!s.handlung && !s.vermutung);
  return `<div class="ablauf-kopf"><b>${a.titel}</b> <span class="ablauf-fortschritt">${fortschritt}</span></div>`
    + `<p class="ablauf-frage">${s.frage}</p>${antworten}${handlung}<div class="ablauf-ergebnis" aria-live="polite">${ergebnis}${vergleich}</div>`
    + `<div class="ablauf-nav"><button class="linkbtn" type="button" data-nav="zurueck"${st.weg.length > 1 ? '' : ' disabled'}>Zurück</button>`
    + `<button class="linkbtn" type="button" data-nav="liste">Alle Experimente</button>`
    + `<button class="linkbtn" type="button" data-nav="${ende ? 'fertig' : 'weiter'}"${weiterFrei ? '' : ' disabled'}>${ende ? 'Fertig' : 'Weiter'}</button></div>`;
}

/**
 * Karte mit den Abläufen der App. Das Element ist der Inhalt der Karte „Erste Schritte“; ein Klick ist eine
 * Handlung, Antwort oder Navigation (Ereignis-Delegation, Tastatur über die Knöpfe).
 * - anwenden(hash): Zustand der App aus einer Adresse setzen und zeichnen,
 * - adresse(): aktuelle Adresse (für Vorher/Nachher),
 * - aktionen: Aktionen der App nach Namen,
 * - skriptUrl(anker), beiAbschluss(id): optional.
 * @param {HTMLElement} el
 * @param {Ablauf[]} ablaeufe
 * @param {{ anwenden: (hash: string) => void, adresse: () => string, aktionen?: Record<string, () => void>,
 *   skriptUrl?: (anker: string) => string, beiAbschluss?: (id: string) => void }} o
 */
export function ablaufKarte(el, ablaeufe, o) {
  /** @type {string | undefined} */
  let modus;
  /** @type {Stand | null} */
  let st = null;
  /** @type {Set<string>} */
  const erledigt = new Set();
  const imModus = () => ablaeufe.filter((a) => a.modus === undefined || a.modus === modus);
  const zeichnen = () => { el.innerHTML = st ? schrittHTML(st, { skriptUrl: o.skriptUrl }) : listeHTML(imModus(), erledigt); };
  /** Fokus auf die Frage nach einem Schrittwechsel (Tastatur und Screenreader). */
  const fokusFrage = () => { const f = el.querySelector('.ablauf-frage'); if (f instanceof HTMLElement) { f.tabIndex = -1; f.focus({ preventScroll: true }); } };
  /** @param {string} id */
  const starte = (id) => {
    const a = ablaeufe.find((x) => x.id === id);
    if (!a) throw new Error(`ablaufKarte: kein Ablauf „${id}“`);
    st = neuerStand(a); zeichnen(); fokusFrage();
  };
  /** Vorher angewandt? Dann zuerst zurück zum Nachher, damit die App nicht im alten Zustand bleibt. */
  const nachherHerstellen = () => {
    if (!st || !st.vorherAktiv) return;
    const i = st.weg[st.weg.length - 1];
    o.anwenden(st.nachher[i]); st.vorherAktiv = false;
  };
  el.addEventListener('click', (e) => {
    const b = /** @type {Element} */ (e.target).closest('button');
    if (!b || !(b instanceof HTMLButtonElement) || b.disabled) return;
    if (b.dataset.ablauf) { starte(b.dataset.ablauf); return; }
    if (!st) return;
    const i = st.weg[st.weg.length - 1];
    const s = st.ablauf.schritte[i];
    if (b.dataset.antwort !== undefined) {
      st.gewaehlt[i] = Number(b.dataset.antwort);
      if (!s.handlung) st.gezeigt.add(i); // ohne Handlung beantwortet die Wahl die Frage
      zeichnen(); return;
    }
    if (b.dataset.tun && s.handlung) {
      st.vorher[i] = o.adresse();
      if (s.handlung.hash !== undefined) o.anwenden(s.handlung.hash);
      else o.aktionen?.[/** @type {string} */ (s.handlung.aktion)]?.();
      st.nachher[i] = o.adresse();
      st.gezeigt.add(i); zeichnen(); return;
    }
    if (b.dataset.vergleich) {
      st.vorherAktiv = !st.vorherAktiv;
      o.anwenden(st.vorherAktiv ? st.vorher[i] : st.nachher[i]); zeichnen(); return;
    }
    const nav = b.dataset.nav;
    if (nav === 'zurueck' && st.weg.length > 1) { nachherHerstellen(); st.weg.pop(); zeichnen(); fokusFrage(); }
    else if (nav === 'weiter') { nachherHerstellen(); const n = naechster(st.ablauf, i, st.gewaehlt[i]); if (n >= 0) { st.weg.push(n); zeichnen(); fokusFrage(); } }
    else if (nav === 'fertig' || nav === 'liste') {
      nachherHerstellen();
      if (nav === 'fertig') { erledigt.add(st.ablauf.id); o.beiAbschluss?.(st.ablauf.id); }
      st = null; zeichnen();
      const l = el.querySelector('[data-ablauf]'); if (l instanceof HTMLElement) l.focus({ preventScroll: true });
    }
  });
  return {
    /** Modus setzen: zeigt die Liste seiner Abläufe (ein laufender Ablauf eines anderen Modus endet). @param {string} m */
    modus(m) { if (st && st.ablauf.modus !== undefined && st.ablauf.modus !== m) st = null; modus = m; zeichnen(); },
    starte,
    /** Erster Ablauf des aktuellen Modus (beim ersten Aufruf) oder null. */
    erster: () => imModus()[0]?.id ?? null,
    /** Läuft gerade ein Ablauf? */
    laeuft: () => st !== null,
    /** Zur Liste (z. B. beim Schliessen der Karte). */
    liste() { nachherHerstellen(); st = null; zeichnen(); },
  };
}
