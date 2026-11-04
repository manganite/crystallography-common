// Prüft js/typen.js mit der Typprüfung (npx tsc -p .), nicht mit node --test: Jede Zeile nach @ts-expect-error
// muss einen Fehler melden, sonst schlägt die Typprüfung fehl. So bleibt belegt, dass die gekennzeichneten Typen
// Vertauschungen erkennen.

/** @import { Vec2, Vec3, Mat3, Richtung, Normale, Grad, Bogenmass, Fraktional, Kartesisch } from '../js/typen.js' */

/** @param {Richtung} r */
const nimmRichtung = (r) => r;
/** @param {Normale} n */
const nimmNormale = (n) => n;
/** @param {Vec3} v */
const nimmVec3 = (v) => v;
/** @param {Mat3} m */
const nimmMat3 = (m) => m;
/** @param {Bogenmass} x */
const nimmBogenmass = (x) => x;
/** @param {Fraktional<Vec2>} p */
const nimmFraktional = (p) => p;

const r = /** @type {Richtung} */ ([1, 1, 0]);
const n = /** @type {Normale} */ ([1, 1, 0]);
const g = /** @type {Grad} */ (90);
const k = /** @type {Kartesisch<Vec2>} */ ([0.5, 0.5]);

nimmRichtung(r);
nimmNormale(n);
nimmVec3(r); // eine Richtung ist ein Vec3
nimmBogenmass(/** @type {Bogenmass} */ ((g * Math.PI) / 180));

// @ts-expect-error Normale statt Richtung
nimmRichtung(n);
// @ts-expect-error Richtung statt Normale
nimmNormale(r);
// @ts-expect-error ungekennzeichneter Vektor statt Richtung
nimmRichtung([1, 1, 0]);
// @ts-expect-error 2D statt 3D
nimmVec3([1, 0]);
// @ts-expect-error Vektor statt Matrix
nimmMat3([1, 0, 0]);
// @ts-expect-error Grad statt Bogenmass
nimmBogenmass(g);
// @ts-expect-error kartesisch statt fraktional
nimmFraktional(k);
