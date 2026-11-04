// Gemeinsame Fragenliste der App-Familie (Artifact in claude.ai): alle Quizfragen und Generatoren aller
// Apps in einer Seite, mit Prüfung der Entwürfe und Rückmeldungen. Jede App liefert ihre Fragen über
// tools/quiz-quelle.mjs (quizQuelle()); die Bilder zeichnet der Code der App.
//
//   node fragenliste/extract.mjs [App-Ordner …]      (Standard: ../stereography ../plane-groups)
//
// Schreibt fragenliste/fragenliste.html (nicht im Repository). Veröffentlicht wird sie als bestehendes
// Artifact (Adresse in CLAUDE.md), damit Urteile und Rückmeldungen erhalten bleiben.
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** @import { Frage, Frageinhalt, Generator, Kapitel, Stufe, BildOptionen, Bildantwort } from '../js/quiz-core.js' */
/**
 * Was tools/quiz-quelle.mjs einer App liefert (quizQuelle()).
 * bild(angabe, opt): SVG zu einer Bildangabe (null, wenn es keines gibt); adresse(angabe): Link-Adresse der App dazu.
 * @typedef {object} Quizquelle
 * @property {string} app
 * @property {string} titel
 * @property {string} kurz
 * @property {Kapitel[]} kapitel
 * @property {Frage[]} bank
 * @property {Generator[]} generatoren
 * @property {(angabe: string, opt: BildOptionen) => string | null} bild
 * @property {(angabe: string) => string | null} adresse
 */

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = resolve(hier, '..');
const ordner = process.argv.slice(2).length ? process.argv.slice(2) : ['../stereography', '../plane-groups'];

/** @param {unknown} t */
const attr = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
// Bildtext als zugänglicher Name des Bildes (so lässt sich auch der Bildtext prüfen)
/** @param {string | null} svg @param {string} alt */
const benannt = (svg, alt) => (svg && alt ? svg.replace('<svg', `<svg role="img" aria-label="${attr(alt)}"`) : svg);
/** @param {Frageinhalt} q */
const bildAnt = (q) => q.typ === 'text-bild' || q.typ === 'bild-bild';

/** @type {object[]} */
const apps = [];
for (const o of ordner) {
  const dir = resolve(wurzel, o);
  const { quizQuelle } = await import(pathToFileURL(join(dir, 'tools/quiz-quelle.mjs')).href);
  /** @type {Quizquelle} */
  const Q = quizQuelle();
  /** @param {Frageinhalt & { id: string, stufe: Stufe, kapitel: number }} q @param {object} [extra] */
  const conv = (q, extra = {}) => ({
    id: q.id, kapitel: q.kapitel, stufe: q.stufe, typ: q.typ, lernziel: q.lernziel || '',
    frage: q.frage, bild: q.bild ? benannt(Q.bild(q.bild, q.bildOpt || {}), q.bildAlt || '') : null, bildHash: q.bild ? Q.adresse(q.bild) : null,
    antworten: q.antworten.map((a) => {
      if (!bildAnt(q)) return { html: a };
      const b = /** @type {Bildantwort} */ (a);
      return { svg: benannt(Q.bild(b.app, { ...(q.bildOpt || {}), klein: true }), b.alt || ''), hash: Q.adresse(b.app) };
    }),
    richtig: q.richtig, hinweise: q.hinweise || [], erklaerung: q.erklaerung || '', skript: q.skript || '',
    app: q.app || '', quelle: q.quelle || '', nachgerechnet: q.pruefung ? (q.pruefung.art || 'ja') : '', ...extra,
  });
  const fragen = Q.bank.map((q) => conv(q, { status: q.status }));
  const gens = Q.generatoren.map((G) => {
    /** @type {object[]} */
    const beispiele = [];
    for (const st of G.stufen) {
      const ps = G.params(st);
      const pick = [...new Set([0, Math.floor(ps.length / 3), Math.floor((2 * ps.length) / 3), ps.length - 1])].filter((i) => i >= 0 && i < ps.length);
      for (const i of pick) beispiele.push(conv({ ...G.make(ps[i], st), id: `${G.id} · ${ps[i]}`, stufe: st, kapitel: G.kapitel }));
    }
    return { id: G.id, status: G.status, kapitel: G.kapitel, stufen: G.stufen, anzahl: G.stufen.reduce((n, s) => n + G.params(s).length, 0), beispiele };
  });
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  apps.push({ app: Q.app, titel: Q.titel, kurz: Q.kurz, commit, kapitel: Q.kapitel.map((k) => ({ nr: k.nr, titel: k.titel })), fragen, gens });
  console.log(Q.app, commit.slice(0, 7), fragen.length, 'Fragen,', gens.length, 'Generatoren');
}
const tpl = readFileSync(join(hier, 'vorlage.html'), 'utf8');
const html = tpl.replace('__DATEN__', () => JSON.stringify({ apps }).replace(/<\//g, '<\\/'));
writeFileSync(join(hier, 'fragenliste.html'), html);
console.log('fragenliste/fragenliste.html', (html.length / 1e6).toFixed(1), 'MB');
